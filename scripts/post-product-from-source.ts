import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { load } from "cheerio";
import { z } from "zod";
import {
  addProductImage,
  createProduct,
  getCategoryById,
  getProductAutomationSettings,
  getSavedTryOnModelById,
  getSubcategoryById,
  getUserById,
  setSlabPrices,
} from "../server/db";
import { analyzeUploadedProductImageBase64, generateTryOnImages } from "../listing-generator/server/gemini";
import { ENV } from "../server/_core/env";
import { getStorageMode, hasSharedStorageConfig, storagePut } from "../server/storage";

const DEFAULT_PROMPT = "Place the extracted garment on the model naturally.";
const DEFAULT_CATEGORY = "Streetwear";

const slabSchema = z.object({
  minQty: z.number().int().positive(),
  maxQty: z.number().int().positive().nullable().optional(),
  pricePerUnit: z.string().min(1),
  label: z.string().max(100).optional(),
  sortOrder: z.number().int().optional(),
});

const configSchema = z.object({
  sourceUrl: z.string().url(),
  savedModelId: z.number().int().positive().optional(),
  modelImagePath: z.string().min(1).optional(),
  geminiApiKey: z.string().min(1).optional(),
  allowLocalStorageFallback: z.boolean().optional(),
  publish: z.boolean().optional(),
  tryOnPrompt: z.string().min(5).optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  subcategoryId: z.number().int().positive().nullable().optional(),
  categoryLabel: z.string().max(100).nullable().optional(),
  product: z.object({
    title: z.string().min(1).max(500).optional(),
    slug: z.string().min(1).max(255).optional(),
    category: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    shortDescription: z.string().max(500).optional(),
    samplePrice: z.string().optional(),
    weight: z.string().optional(),
    availableSizes: z.array(z.string().min(1)).optional(),
    availableColors: z.array(z.string().min(1)).optional(),
    material: z.string().max(255).optional(),
    manufacturingStory: z.string().optional(),
    isFeatured: z.boolean().optional(),
    freeShipping: z.boolean().optional(),
    seoTitle: z.string().max(255).optional(),
    seoDescription: z.string().optional(),
    seoKeywords: z.string().optional(),
    sortOrder: z.number().int().optional(),
    slabs: z.array(slabSchema).optional(),
  }).default({}),
});

type PostProductConfig = z.infer<typeof configSchema>;

function normalizeGeminiKey(value: string | undefined | null) {
  const key = value?.trim();
  if (!key) return undefined;

  const placeholders = new Set([
    "your-gemini-api-key",
    "your_gemini_api_key_here",
    "YOUR_GEMINI_API_KEY_HERE",
  ]);

  if (placeholders.has(key)) {
    return undefined;
  }

  return key;
}

function printUsage() {
  console.log([
    "Usage:",
    "  pnpm tsx scripts/post-product-from-source.ts --config <path-to-json>",
    "",
    "Options:",
    "  --config <path>       JSON config file describing the source URL, model, and product fields",
    "  --print-example       Print an example JSON config to stdout",
    "  --help                Show this help text",
  ].join("\n"));
}

function printExample() {
  const example = {
    sourceUrl: "https://example.com/products/sample-shorts",
    savedModelId: 1,
    allowLocalStorageFallback: false,
    publish: false,
    categoryId: 6,
    subcategoryId: null,
    categoryLabel: "Martial Arts Wear",
    tryOnPrompt: "Place the extracted garment on the model naturally.",
    product: {
      title: "Custom Grappling Fight Shorts Wholesale",
      slug: "custom-grappling-fight-shorts-wholesale",
      category: "Martial Arts Wear",
      shortDescription: "Custom grappling shorts for B2B fightwear brands, built for training durability and private-label production.",
      description: "SEO copy written by GPT-5.4 goes here.",
      seoTitle: "Custom Grappling Fight Shorts Manufacturer",
      seoDescription: "Private-label grappling shorts from Pak Homies Industry with wholesale MOQ support and custom branding.",
      seoKeywords: "grappling shorts manufacturer, bjj shorts wholesale, private label fight shorts, sialkot pakistan apparel",
      material: "Polyester spandex performance blend",
      availableSizes: ["S", "M", "L", "XL", "2XL"],
      availableColors: ["Black", "White", "Custom"],
      samplePrice: "18.00",
      weight: "0.350",
      manufacturingStory: "Detailed manufacturing notes here.",
      slabs: [
        { minQty: 50, maxQty: 99, pricePerUnit: "12.50", label: "Starter" },
        { minQty: 100, maxQty: 299, pricePerUnit: "10.90", label: "Popular" },
        { minQty: 300, maxQty: null, pricePerUnit: "9.75", label: "Bulk" },
      ],
    },
  };

  console.log(JSON.stringify(example, null, 2));
}

function getArg(name: string) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

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

function sanitizePrice(price: string | undefined) {
  if (!price) return undefined;
  const cleaned = String(price).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (Number.isNaN(num)) return undefined;
  return num.toFixed(2);
}

function sanitizeWeight(weight: string | undefined) {
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

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 255) || `product-${Date.now()}`;
}

async function readLocalFileAsBase64(filePath: string) {
  const resolvedPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
  const buffer = await fs.readFile(resolvedPath);
  return {
    base64: buffer.toString("base64"),
    mimeType: guessMimeTypeFromPath(resolvedPath),
  };
}

async function readUploadPathAsBase64(imageUrl: string) {
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

async function fetchImageAsBase64(imageUrl: string) {
  const localUpload = await readUploadPathAsBase64(imageUrl).catch(() => null);
  if (localUpload) {
    return localUpload;
  }

  if (/^https?:\/\//i.test(imageUrl)) {
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

  return readLocalFileAsBase64(imageUrl);
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

async function resolveGeminiApiKey(config: PostProductConfig) {
  const configKey = normalizeGeminiKey(config.geminiApiKey);
  if (configKey) return configKey;

  const envKey = normalizeGeminiKey(process.env.GEMINI_API_KEY);
  if (envKey) return envKey;

  const settings = await getProductAutomationSettings();
  if (settings?.ownerUserId) {
    const owner = await getUserById(settings.ownerUserId);
    const ownerKey = normalizeGeminiKey(owner?.geminiApiKey);
    if (ownerKey) return ownerKey;
  }

  throw new Error("Gemini API key not found. Add a valid geminiApiKey to the config, set GEMINI_API_KEY in .env, or save it in the admin AI settings.");
}

async function resolveModelImage(config: PostProductConfig) {
  if (config.savedModelId) {
    const savedModel = await getSavedTryOnModelById(config.savedModelId);
    if (!savedModel) {
      throw new Error(`Saved model ${config.savedModelId} was not found.`);
    }
    return fetchImageAsBase64(savedModel.imageUrl);
  }

  if (config.modelImagePath) {
    return fetchImageAsBase64(config.modelImagePath);
  }

  throw new Error("Provide either savedModelId or modelImagePath in the config.");
}

async function uploadTryOnResults(
  sourceSlug: string,
  generatedResults: Array<{ view: string; base64: string; mimeType: string }>,
) {
  const uploaded = [];

  for (const result of generatedResults) {
    const buffer = Buffer.from(result.base64, "base64");
    const ext = result.mimeType.split("/")[1] ?? "jpeg";
    const viewSlug = result.view.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const storageKey = `products/manual-cli/${sourceSlug}-${viewSlug}-${Date.now()}.${ext}`;
    const { url } = await storagePut(storageKey, buffer, result.mimeType);
    uploaded.push({ ...result, url });
  }

  return uploaded;
}

async function loadConfig() {
  if (process.argv.includes("--help")) {
    printUsage();
    process.exit(0);
  }

  if (process.argv.includes("--print-example")) {
    printExample();
    process.exit(0);
  }

  const configPath = getArg("--config");
  if (!configPath) {
    printUsage();
    throw new Error("Missing required --config argument.");
  }

  const resolvedPath = path.isAbsolute(configPath)
    ? configPath
    : path.resolve(process.cwd(), configPath);
  const raw = await fs.readFile(resolvedPath, "utf8");
  return configSchema.parse(JSON.parse(raw));
}

async function main() {
  const config = await loadConfig();
  if (!hasSharedStorageConfig() && !config.allowLocalStorageFallback) {
    throw new Error([
      "Shared storage is not configured.",
      `Current storage mode: ${getStorageMode()}.`,
      "Refusing to create a product because generated images would only be saved on the local filesystem.",
      "Configure BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY for shared storage,",
      "or set allowLocalStorageFallback=true in the config for an intentional one-off local test.",
    ].join(" "));
  }

  const geminiApiKey = await resolveGeminiApiKey(config);
  const [category, subcategory, modelImage, referenceImage] = await Promise.all([
    config.categoryId ? getCategoryById(config.categoryId) : Promise.resolve(undefined),
    config.subcategoryId ? getSubcategoryById(config.subcategoryId) : Promise.resolve(undefined),
    resolveModelImage(config),
    extractReferenceImageFromSource(config.sourceUrl),
  ]);

  const categoryLabel = config.product.category || config.categoryLabel || category?.name || DEFAULT_CATEGORY;
  const sourceSlug = slugify(new URL(config.sourceUrl).pathname.split("/").filter(Boolean).pop() || "source-product");
  const tryOnPrompt = config.tryOnPrompt || DEFAULT_PROMPT;

  const generatedResults = await generateTryOnImages(
    tryOnPrompt,
    modelImage,
    [referenceImage],
    undefined,
    categoryLabel,
    geminiApiKey,
  );

  const uploadedResults = await uploadTryOnResults(sourceSlug, generatedResults);
  const frontView = uploadedResults.find((item) => item.view === "Front View") || uploadedResults[0];
  if (!frontView) {
    throw new Error("No try-on images were generated.");
  }

  const fallbackProduct = await analyzeUploadedProductImageBase64(frontView.base64, frontView.mimeType, undefined, geminiApiKey);
  const mergedProduct = {
    ...fallbackProduct,
    ...config.product,
    title: config.product.title || fallbackProduct.title,
    slug: config.product.slug || fallbackProduct.slug,
    category: config.product.category || categoryLabel || fallbackProduct.category,
    description: config.product.description || fallbackProduct.description,
    shortDescription: config.product.shortDescription || fallbackProduct.shortDescription,
    seoTitle: config.product.seoTitle || fallbackProduct.seoTitle,
    seoDescription: config.product.seoDescription || fallbackProduct.seoDescription,
    seoKeywords: config.product.seoKeywords || fallbackProduct.seoKeywords,
    material: config.product.material || fallbackProduct.material,
    manufacturingStory: config.product.manufacturingStory || fallbackProduct.manufacturingStory,
    samplePrice: config.product.samplePrice || fallbackProduct.samplePrice,
    weight: config.product.weight || fallbackProduct.weight,
    availableSizes: config.product.availableSizes || fallbackProduct.availableSizes,
    availableColors: config.product.availableColors || fallbackProduct.availableColors,
  };

  const createdProduct = await createProduct({
    title: mergedProduct.title,
    slug: slugify(mergedProduct.slug || mergedProduct.title),
    category: mergedProduct.category || DEFAULT_CATEGORY,
    categoryId: category?.id ?? config.categoryId ?? null,
    subcategoryId: subcategory?.id ?? config.subcategoryId ?? null,
    description: mergedProduct.description,
    shortDescription: mergedProduct.shortDescription?.slice(0, 500) || undefined,
    mainImage: frontView.url,
    samplePrice: sanitizePrice(mergedProduct.samplePrice),
    weight: sanitizeWeight(mergedProduct.weight),
    availableSizes: toJsonArray(mergedProduct.availableSizes, ["S", "M", "L", "XL", "2XL"]),
    availableColors: toJsonArray(mergedProduct.availableColors, ["Black", "White", "Navy"]),
    material: mergedProduct.material || undefined,
    manufacturingStory: mergedProduct.manufacturingStory || undefined,
    manufacturingInfographic: undefined,
    isFeatured: config.product.isFeatured ?? false,
    isActive: config.publish ?? false,
    freeShipping: config.product.freeShipping ?? false,
    seoTitle: mergedProduct.seoTitle?.slice(0, 255) || undefined,
    seoDescription: mergedProduct.seoDescription || undefined,
    seoKeywords: mergedProduct.seoKeywords || undefined,
    sortOrder: config.product.sortOrder ?? 0,
  });

  if (!createdProduct) {
    throw new Error("Product could not be created.");
  }

  const slabs = (config.product.slabs || fallbackProduct.moqSlabs || []).map((slab, index) => ({
    minQty: Number(slab.minQty) || 1,
    maxQty: slab.maxQty != null ? Number(slab.maxQty) : null,
    pricePerUnit: sanitizePrice(slab.pricePerUnit) ?? "0.00",
    label: slab.label || undefined,
    sortOrder: slab.sortOrder ?? index,
  }));

  if (slabs.length > 0) {
    await setSlabPrices(createdProduct.id, slabs);
  }

  await Promise.all(uploadedResults.map((image, index) => addProductImage({
    productId: createdProduct.id,
    imageUrl: image.url,
    altText: `${mergedProduct.title} - ${image.view}`,
    sortOrder: index,
  })));

  console.log(JSON.stringify({
    success: true,
    productId: createdProduct.id,
    slug: createdProduct.slug,
    status: createdProduct.isActive ? "live" : "draft",
    sourceUrl: config.sourceUrl,
    mainImage: frontView.url,
    imageCount: uploadedResults.length,
  }, null, 2));
}

main().catch((error) => {
  console.error("[post-product-from-source] Failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});

