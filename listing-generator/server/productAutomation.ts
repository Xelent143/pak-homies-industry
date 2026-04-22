import { load } from "cheerio";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import path from "path";
import { sql } from "drizzle-orm";
import {
  addProductImage,
  createProduct,
  getCategoryById,
  getDb,
  getProductAutomationSettings,
  getReadyProductAutomationSources,
  getReservedProductAutomationUsageSince,
  getSavedTryOnModelById,
  getSubcategoryById,
  getUserById,
  reserveProductAutomationUsage,
  setSlabPrices,
  updateProductAutomationSource,
  upsertProductAutomationSettings,
} from "../../server/db";
import { analyzeUploadedProductImageBase64, generateTryOnImages } from "./gemini";
import { ENV } from "../../server/_core/env";
import { storagePut } from "../../server/storage";

const DEFAULT_PROMPT = "Place the extracted garment on the model naturally.";
const DEFAULT_CATEGORY = "Streetwear";
const REQUESTS_PER_SOURCE = 6;
const RETRY_DELAY_HOURS = 6;

let isProcessorRunning = false;

function getUploadsRootPath() {
  if (ENV.storagePath) {
    return path.isAbsolute(ENV.storagePath)
      ? ENV.storagePath
      : path.resolve(process.cwd(), ENV.storagePath);
  }

  if (ENV.isProduction) {
    return process.env.PERSISTENT_UPLOADS_DIR
      || path.join(process.env.HOME || process.env.USERPROFILE || "/tmp", "ssm_persistent_uploads");
  }

  return path.join(process.cwd(), "uploads");
}

function guessMimeTypeFromPath(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".webp":
      return "image/webp";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

async function readLocalUploadAsBase64(imageUrl: string) {
  if (!imageUrl.startsWith("/uploads/")) {
    return null;
  }

  const relativeKey = imageUrl.replace(/^\/uploads\//, "");
  const filePath = path.join(getUploadsRootPath(), relativeKey);
  const buffer = await fs.readFile(filePath);

  return {
    base64: buffer.toString("base64"),
    mimeType: guessMimeTypeFromPath(filePath),
  };
}

function sanitizePrice(price: string | undefined): string | undefined {
  if (!price) return undefined;
  const cleaned = String(price).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (Number.isNaN(num)) return undefined;
  return num.toFixed(2);
}

function sanitizeWeight(weight: string | undefined): string | undefined {
  if (!weight) return undefined;
  const cleaned = String(weight).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (Number.isNaN(num)) return undefined;
  return num.toFixed(3);
}

function toJsonArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value) || value.length === 0) {
    return JSON.stringify(fallback);
  }
  return JSON.stringify(value);
}

async function fetchImageAsBase64(imageUrl: string) {
  const localUpload = await readLocalUploadAsBase64(imageUrl).catch(() => null);
  if (localUpload) {
    return localUpload;
  }

  if (!/^https?:\/\//i.test(imageUrl)) {
    throw new Error(`Unsupported image URL for automation: ${imageUrl}`);
  }

  const response = await fetch(imageUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });
  if (!response.ok) {
    throw new Error(`Could not download image (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const mimeType = response.headers.get("content-type") || "image/jpeg";
  return {
    base64: Buffer.from(arrayBuffer).toString("base64"),
    mimeType,
  };
}

async function extractReferenceImageFromSource(sourceUrl: string) {
  const url = new URL(sourceUrl);
  const response = await fetch(url.href, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });

  if (!response.ok) {
    throw new Error(`Could not open source page (${response.status})`);
  }

  const html = await response.text();
  const $ = load(html);

  let imageUrl =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    $('link[rel="image_src"]').attr("href");

  if (!imageUrl) {
    $("img").each((_, el) => {
      const candidate = $(el).attr("src");
      if (candidate && !candidate.includes("logo") && !candidate.includes("icon")) {
        imageUrl = candidate;
        return false;
      }
      return;
    });
  }

  if (!imageUrl) {
    throw new Error("No usable product image was found on the source page.");
  }

  if (imageUrl.startsWith("//")) {
    imageUrl = `${url.protocol}${imageUrl}`;
  } else if (imageUrl.startsWith("/")) {
    imageUrl = new URL(imageUrl, url.origin).href;
  } else if (!/^https?:\/\//i.test(imageUrl)) {
    imageUrl = new URL(imageUrl, url.href).href;
  }

  return fetchImageAsBase64(imageUrl);
}

async function uploadTryOnResults(
  sourceId: number,
  generatedResults: Array<{ view: string; base64: string; mimeType: string }>,
) {
  const uploaded = [];

  for (const result of generatedResults) {
    const buffer = Buffer.from(result.base64, "base64");
    const ext = result.mimeType.split("/")[1] ?? "jpeg";
    const viewSlug = result.view.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const storageKey = `products/automation/${sourceId}-${viewSlug}-${nanoid(10)}.${ext}`;
    const { url } = await storagePut(storageKey, buffer, result.mimeType);
    uploaded.push({ ...result, url });
  }

  return uploaded;
}

async function prepareDraftSource(
  source: Awaited<ReturnType<typeof getReadyProductAutomationSources>>[number],
  settings: NonNullable<Awaited<ReturnType<typeof getProductAutomationSettings>>>,
) {
  const savedModelId = settings.savedModelId;
  if (!savedModelId) {
    throw new Error("No saved model is selected in automation settings.");
  }

  const model = await getSavedTryOnModelById(savedModelId);
  if (!model) {
    throw new Error("The saved model configured for automation no longer exists.");
  }

  const [category, subcategory, modelImage, referenceImage] = await Promise.all([
    source.categoryId ? getCategoryById(source.categoryId) : settings.defaultCategoryId ? getCategoryById(settings.defaultCategoryId) : Promise.resolve(undefined),
    source.subcategoryId ? getSubcategoryById(source.subcategoryId) : settings.defaultSubcategoryId ? getSubcategoryById(settings.defaultSubcategoryId) : Promise.resolve(undefined),
    fetchImageAsBase64(model.imageUrl),
    extractReferenceImageFromSource(source.sourceUrl),
  ]);

  const categoryLabel = source.categoryLabel || settings.defaultCategoryLabel || category?.name || DEFAULT_CATEGORY;
  const prompt = source.promptOverride || settings.defaultPrompt || DEFAULT_PROMPT;

  return {
    category,
    subcategory,
    categoryLabel,
    prompt,
    modelImage,
    referenceImage,
  };
}

async function createDraftProductFromPreparedSource(
  source: Awaited<ReturnType<typeof getReadyProductAutomationSources>>[number],
  settings: NonNullable<Awaited<ReturnType<typeof getProductAutomationSettings>>>,
  prepared: Awaited<ReturnType<typeof prepareDraftSource>>,
  apiKey?: string,
) {
  const { category, subcategory, categoryLabel, prompt, modelImage, referenceImage } = prepared;

  const generatedResults = await generateTryOnImages(
    prompt,
    modelImage,
    [referenceImage],
    undefined,
    categoryLabel,
    apiKey,
  );

  const uploadedResults = await uploadTryOnResults(source.id, generatedResults);
  const frontView = uploadedResults.find((item) => item.view === "Front View") || uploadedResults[0];
  if (!frontView) {
    throw new Error("The automation did not receive any try-on images back from Gemini.");
  }

  const productData = await analyzeUploadedProductImageBase64(frontView.base64, frontView.mimeType, undefined, apiKey);

  const createdProduct = await createProduct({
    title: productData.title,
    slug: productData.slug,
    category: category?.name || categoryLabel || productData.category,
    categoryId: category?.id ?? source.categoryId ?? settings.defaultCategoryId ?? null,
    subcategoryId: subcategory?.id ?? source.subcategoryId ?? settings.defaultSubcategoryId ?? null,
    description: productData.description,
    shortDescription: productData.shortDescription || undefined,
    mainImage: frontView.url,
    samplePrice: sanitizePrice(productData.samplePrice),
    weight: sanitizeWeight(productData.weight),
    availableSizes: toJsonArray(productData.availableSizes, ["S", "M", "L", "XL", "2XL"]),
    availableColors: toJsonArray(productData.availableColors, ["Black", "White", "Navy"]),
    material: productData.material || undefined,
    manufacturingStory: productData.manufacturingStory || undefined,
    manufacturingInfographic: undefined,
    isFeatured: false,
    isActive: false,
    freeShipping: false,
    seoTitle: productData.seoTitle || undefined,
    seoDescription: productData.seoDescription || undefined,
    seoKeywords: productData.seoKeywords || undefined,
    sortOrder: 0,
  });

  if (!createdProduct) {
    throw new Error("Draft product could not be created.");
  }

  const slabs = productData.moqSlabs?.map((slab, index) => ({
    minQty: Number(slab.minQty) || 1,
    maxQty: slab.maxQty != null ? Number(slab.maxQty) : null,
    pricePerUnit: sanitizePrice(slab.pricePerUnit) ?? "0.00",
    label: slab.label || undefined,
    sortOrder: index,
  })) ?? [];

  if (slabs.length > 0) {
    await setSlabPrices(createdProduct.id, slabs);
  }

  await Promise.all(uploadedResults.map((image, index) => addProductImage({
    productId: createdProduct.id,
    imageUrl: image.url,
    altText: `${productData.title} - ${image.view}`,
    sortOrder: index,
  })));

  return {
    productId: createdProduct.id,
    title: createdProduct.title,
    mainImage: frontView.url,
  };
}

async function updateRunSummary(summary: string) {
  const settings = await getProductAutomationSettings();
  if (!settings) return;
  const { id, createdAt, updatedAt, ...rest } = settings;
  await upsertProductAutomationSettings({
    ...rest,
    lastRunAt: new Date(),
    lastRunSummary: summary,
  });
}

export async function ensureProductAutomationTables() {
  const db = await getDb();
  if (!db) return;

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS product_automation_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ownerUserId INT NULL,
        isEnabled TINYINT(1) NOT NULL DEFAULT 0,
        runEveryMinutes INT NOT NULL DEFAULT 60,
        maxSourcesPerRun INT NOT NULL DEFAULT 1,
        geminiRequestsPerMinuteLimit INT NOT NULL DEFAULT 8,
        geminiRequestsPerDayLimit INT NOT NULL DEFAULT 100,
        defaultCategoryId INT NULL,
        defaultSubcategoryId INT NULL,
        defaultCategoryLabel VARCHAR(100) NULL,
        savedModelId INT NULL,
        defaultPrompt TEXT NULL,
        lastRunAt TIMESTAMP NULL,
        lastRunSummary TEXT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS product_automation_sources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sourceUrl VARCHAR(1000) NOT NULL UNIQUE,
        sourceTitle VARCHAR(255) NULL,
        status ENUM('queued', 'processing', 'draft_created', 'failed', 'skipped') NOT NULL DEFAULT 'queued',
        categoryId INT NULL,
        subcategoryId INT NULL,
        categoryLabel VARCHAR(100) NULL,
        promptOverride TEXT NULL,
        notes TEXT NULL,
        productId INT NULL,
        generatedMainImage VARCHAR(1000) NULL,
        attemptCount INT NOT NULL DEFAULT 0,
        lastAttemptAt TIMESTAMP NULL,
        nextAttemptAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS product_automation_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sourceId INT NULL,
        reservedRequests INT NOT NULL,
        reason VARCHAR(100) NOT NULL DEFAULT 'automation_run',
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.warn("[ProductAutomation] Could not ensure tables exist (database might be offline):", error instanceof Error ? error.message : error);
  }
}

export async function processProductAutomationQueue(options?: { manual?: boolean }) {
  if (isProcessorRunning) {
    return { processed: 0, failed: 0, message: "Automation is already running." };
  }

  isProcessorRunning = true;

  try {
    await ensureProductAutomationTables();

    const settings = await getProductAutomationSettings();
    if (!settings) {
      return { processed: 0, failed: 0, message: "Automation settings have not been configured yet." };
    }

    if (!options?.manual && !settings.isEnabled) {
      return { processed: 0, failed: 0, message: "Automation is currently paused." };
    }

    const now = Date.now();
    const lastRunAt = settings.lastRunAt ? new Date(settings.lastRunAt).getTime() : 0;
    const runEveryMs = Math.max(settings.runEveryMinutes, 1) * 60 * 1000;

    if (!options?.manual && lastRunAt && now - lastRunAt < runEveryMs) {
      return { processed: 0, failed: 0, message: "The next scheduled run is not due yet." };
    }

    const owner = settings.ownerUserId ? await getUserById(settings.ownerUserId) : undefined;
    const apiKey = owner?.geminiApiKey || undefined;

    const sources = await getReadyProductAutomationSources(Math.max(settings.maxSourcesPerRun, 1));
    if (sources.length === 0) {
      const message = "No queued source links are ready for processing.";
      await updateRunSummary(message);
      return { processed: 0, failed: 0, message };
    }

    let minuteUsage = await getReservedProductAutomationUsageSince(new Date(Date.now() - 60 * 1000));
    let dayUsage = await getReservedProductAutomationUsageSince(new Date(Date.now() - 24 * 60 * 60 * 1000));
    let processed = 0;
    let failed = 0;
    let stoppedForBudget = false;
    let budgetReason: string | null = null;

    if (settings.geminiRequestsPerMinuteLimit < REQUESTS_PER_SOURCE || settings.geminiRequestsPerDayLimit < REQUESTS_PER_SOURCE) {
      const message = `Gemini request limits are too low. Each draft needs about ${REQUESTS_PER_SOURCE} Gemini requests.`;
      await updateRunSummary(message);
      return { processed: 0, failed: 0, message };
    }

    for (const source of sources) {
      if (minuteUsage + REQUESTS_PER_SOURCE > settings.geminiRequestsPerMinuteLimit) {
        stoppedForBudget = true;
        budgetReason = `Gemini minute budget is full (${minuteUsage}/${settings.geminiRequestsPerMinuteLimit} used in the last minute, ${REQUESTS_PER_SOURCE} needed per draft).`;
        break;
      }
      if (dayUsage + REQUESTS_PER_SOURCE > settings.geminiRequestsPerDayLimit) {
        stoppedForBudget = true;
        budgetReason = `Gemini daily budget is full (${dayUsage}/${settings.geminiRequestsPerDayLimit} used in the last 24 hours, ${REQUESTS_PER_SOURCE} needed per draft).`;
        break;
      }

      await updateProductAutomationSource(source.id, {
        status: "processing",
        attemptCount: (source.attemptCount ?? 0) + 1,
        lastAttemptAt: new Date(),
        notes: null,
      });

      try {
        const prepared = await prepareDraftSource(source, settings);

        await reserveProductAutomationUsage({
          sourceId: source.id,
          reservedRequests: REQUESTS_PER_SOURCE,
          reason: "draft_generation",
        });
        minuteUsage += REQUESTS_PER_SOURCE;
        dayUsage += REQUESTS_PER_SOURCE;

        const draft = await createDraftProductFromPreparedSource(source, settings, prepared, apiKey);
        await updateProductAutomationSource(source.id, {
          status: "draft_created",
          productId: draft.productId,
          generatedMainImage: draft.mainImage,
          notes: `Draft created successfully: ${draft.title}`,
        });
        processed += 1;
      } catch (error: any) {
        failed += 1;
        await updateProductAutomationSource(source.id, {
          status: "failed",
          notes: error?.message ? String(error.message).slice(0, 2000) : "Unknown automation error",
          nextAttemptAt: new Date(Date.now() + RETRY_DELAY_HOURS * 60 * 60 * 1000),
        });
      }
    }

    const message = stoppedForBudget
      ? `Processed ${processed} source(s), failed ${failed}, and paused because ${budgetReason ?? "the Gemini request budget is exhausted"}.`
      : `Processed ${processed} source(s) and failed ${failed}.`;
    await updateRunSummary(message);
    return { processed, failed, message };
  } finally {
    isProcessorRunning = false;
  }
}

export function triggerProductAutomationQueueRun(options?: { manual?: boolean }) {
  if (isProcessorRunning) {
    return {
      started: false,
      message: "Automation is already running.",
    };
  }

  void processProductAutomationQueue(options).catch(async (error) => {
    const message = error instanceof Error ? error.message : "Unknown automation crash";
    console.error("[ProductAutomation] Background run failed:", error);
    try {
      await updateRunSummary(`Automation run crashed: ${message}`);
    } catch (summaryError) {
      console.error("[ProductAutomation] Failed to save crash summary:", summaryError);
    }
  });

  return {
    started: true,
    message: "Automation run started in the background. Refresh the queue shortly to see progress.",
  };
}

export function startProductAutomationScheduler() {
  void ensureProductAutomationTables();

  setInterval(() => {
    void processProductAutomationQueue();
  }, 60 * 1000);
}

export const productAutomationRequestBudgetPerSource = REQUESTS_PER_SOURCE;
