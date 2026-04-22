import { and, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  InsertRfqSubmission, rfqSubmissions,
  InsertBlogPost, blogPosts,
  InsertPortfolioItem, portfolioItems,
  InsertPortfolioImage, portfolioImages, PortfolioItem, PortfolioImage,
  InsertTestimonial, testimonials,
  InsertContactSubmission, contactSubmissions,
  InsertProduct, products,
  InsertProductImage, productImages,
  InsertSlabPrice, slabPrices,
  InsertSizeChart, sizeCharts,
  InsertShippingZone, shippingZones,
  InsertCartItem, cartItems,
  InsertOrder, orders,
  InsertTechPack, techPacks,
  InsertTechPackImage, techPackImages, TechPack, TechPackImage,
  InsertInquiryNote, inquiryNotes,
  InsertKnowledgeBaseEntry, knowledgeBase,
  InsertSavedTryOnModel, savedTryOnModels, SavedTryOnModel,
  InsertCategory, categories,
  InsertSubcategory, subcategories,
  InsertProductAutomationSettings, productAutomationSettings, ProductAutomationSettings,
  InsertProductAutomationSource, productAutomationSources, ProductAutomationSource,
  InsertProductAutomationUsage, productAutomationUsage,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getActiveProducts(opts?: { category?: string; subcategory?: string; search?: string; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) {
    console.error("[getActiveProducts] Database connection failed");
    return [];
  }

  console.log("[getActiveProducts] Fetching products with opts:", opts);
  const conditions = [eq(products.isActive, true)];

  // Filter by category slug - need to join with categories table or use category_id
  if (opts?.category && opts.category !== "all") {
    // Get category ID from slug
    const category = await db.select().from(categories).where(eq(categories.slug, opts.category)).limit(1);
    if (category.length > 0) {
      conditions.push(eq(products.categoryId, category[0].id));
    } else {
      // Fallback to old category string for backward compatibility
      conditions.push(eq(products.category, opts.category));
    }
  }

  // Filter by subcategory slug
  if (opts?.subcategory && opts.subcategory !== "all") {
    const subcategory = await db.select().from(subcategories).where(eq(subcategories.slug, opts.subcategory)).limit(1);
    if (subcategory.length > 0) {
      conditions.push(eq(products.subcategoryId, subcategory[0].id));
    }
  }

  if (opts?.search) {
    conditions.push(
      or(
        like(products.title, `%${opts.search}%`),
        like(products.description, `%${opts.search}%`),
        like(products.category, `%${opts.search}%`)
      )!
    );
  }
  try {
    const results = await db.select({
      id: products.id,
      slug: products.slug,
      title: products.title,
      category: products.category,
      categoryId: products.categoryId,
      subcategoryId: products.subcategoryId,
      shortDescription: products.shortDescription,
      mainImage: products.mainImage,
      samplePrice: products.samplePrice,
      isFeatured: products.isFeatured,
      freeShipping: products.freeShipping,
      sortOrder: products.sortOrder,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    }).from(products)
      .where(and(...conditions))
      .orderBy(products.sortOrder, desc(products.createdAt))
      .limit(opts?.limit ?? 50)
      .offset(opts?.offset ?? 0);
    console.log("[getActiveProducts] Returned", results.length, "products");
    return results;
  } catch (error) {
    console.error("[getActiveProducts] Error fetching products:", error);
    return [];
  }
}

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(products.sortOrder, desc(products.createdAt));
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0];
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.insert(products).values(data);
  } catch (err: any) {
    const causeCode = err.cause?.code || err.code;
    const causeMsg = err.cause?.message || err.message;

    if (causeCode === "ER_DUP_ENTRY" && causeMsg.includes("slug")) {
      // Auto-recover from duplicate slugs by appending a short random string
      data.slug = data.slug + "-" + Math.random().toString(36).substring(2, 6);
      try {
        await db.insert(products).values(data);
      } catch (retryErr: any) {
        throw new Error("DB Insert Failed after slug retry: " + (retryErr.cause?.message || retryErr.message));
      }
    } else if (causeCode === "ER_BAD_FIELD_ERROR" && causeMsg.includes("weight")) {
      // Auto-recover if the database schema is slightly older and missing the `weight` column
      delete (data as any).weight;
      try {
        await db.insert(products).values(data);
      } catch (retryErr: any) {
        throw new Error("DB Insert Failed after weight retry: " + (retryErr.cause?.message || retryErr.message));
      }
    } else {
      // Unmask the exact MySQL error to the frontend instead of generic Drizzle query string
      throw new Error("DB Insert Failed: " + causeMsg);
    }
  }

  const result = await db.select().from(products).where(eq(products.slug, data.slug)).limit(1);
  return result[0];
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(products).set(data).where(eq(products.id, id));
  } catch (err: any) {
    const causeCode = err.cause?.code || err.code;
    const causeMsg = err.cause?.message || err.message;

    if (causeCode === "ER_BAD_FIELD_ERROR" && causeMsg.includes("weight")) {
      delete (data as any).weight;
      try {
        await db.update(products).set(data).where(eq(products.id, id));
      } catch (retryErr: any) {
        throw new Error("DB Update Failed after weight retry: " + (retryErr.cause?.message || retryErr.message));
      }
    } else {
      throw new Error("DB Update Failed: " + causeMsg);
    }
  }
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
}

export async function getFeaturedProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: products.id,
    slug: products.slug,
    title: products.title,
    category: products.category,
    categoryId: products.categoryId,
    subcategoryId: products.subcategoryId,
    shortDescription: products.shortDescription,
    mainImage: products.mainImage,
    samplePrice: products.samplePrice,
    isFeatured: products.isFeatured,
    freeShipping: products.freeShipping,
    sortOrder: products.sortOrder,
    createdAt: products.createdAt,
    updatedAt: products.updatedAt,
  }).from(products)
    .where(and(eq(products.isFeatured, true), eq(products.isActive, true)))
    .orderBy(products.sortOrder)
    .limit(8);
}

// ─── Product Images ───────────────────────────────────────────────────────────

export async function getProductImages(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(productImages.sortOrder);
}

export async function addProductImage(data: InsertProductImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(productImages).values(data);
}

export async function deleteProductImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(productImages).where(eq(productImages.id, id));
}

export async function reorderProductImages(updates: { id: number; sortOrder: number }[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (const u of updates) {
    await db.update(productImages).set({ sortOrder: u.sortOrder }).where(eq(productImages.id, u.id));
  }
}

// ─── Slab Prices ──────────────────────────────────────────────────────────────

export async function getSlabPrices(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(slabPrices)
    .where(eq(slabPrices.productId, productId))
    .orderBy(slabPrices.sortOrder);
}

export async function setSlabPrices(productId: number, slabs: Omit<InsertSlabPrice, "productId">[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(slabPrices).where(eq(slabPrices.productId, productId));
  if (slabs.length > 0) {
    await db.insert(slabPrices).values(slabs.map(s => ({ ...s, productId })));
  }
}

// ─── Size Charts ──────────────────────────────────────────────────────────────

export async function getSizeChart(productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sizeCharts).where(eq(sizeCharts.productId, productId)).limit(1);
  return result[0];
}

export async function upsertSizeChart(productId: number, data: { chartData: string; unit: "inches" | "cm"; notes?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getSizeChart(productId);
  if (existing) {
    await db.update(sizeCharts).set(data).where(eq(sizeCharts.productId, productId));
  } else {
    await db.insert(sizeCharts).values({ productId, ...data });
  }
}

// ─── Shipping Zones ───────────────────────────────────────────────────────────

export async function getActiveShippingZones() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shippingZones).where(eq(shippingZones.isActive, true));
}

export async function getAllShippingZones() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shippingZones).orderBy(shippingZones.zoneName);
}

export async function createShippingZone(data: InsertShippingZone) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(shippingZones).values(data);
}

export async function updateShippingZone(id: number, data: Partial<InsertShippingZone>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(shippingZones).set(data).where(eq(shippingZones.id, id));
}

export async function deleteShippingZone(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(shippingZones).where(eq(shippingZones.id, id));
}

export async function findShippingZoneForCountry(countryCode: string) {
  const zones = await getActiveShippingZones();
  for (const zone of zones) {
    try {
      const countries: string[] = JSON.parse(zone.countries);
      if (countries.includes(countryCode.toUpperCase())) return zone;
    } catch { /* skip malformed */ }
  }
  return null;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function getCartItems(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
}

export async function upsertCartItem(data: InsertCartItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(cartItems)
    .where(and(
      eq(cartItems.sessionId, data.sessionId),
      eq(cartItems.productId, data.productId),
      data.selectedSize ? eq(cartItems.selectedSize, data.selectedSize) : sql`1=1`
    )).limit(1);
  if (existing.length > 0) {
    await db.update(cartItems)
      .set({ quantity: (existing[0].quantity ?? 1) + (data.quantity ?? 1), updatedAt: new Date() })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values(data);
  }
}

export async function updateCartItemQty(id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  } else {
    await db.update(cartItems).set({ quantity, updatedAt: new Date() }).where(eq(cartItems.id, id));
  }
}

export async function removeCartItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(sessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(orders).values(data);
  const result = await db.select().from(orders).where(eq(orders.orderNumber, data.orderNumber)).limit(1);
  return result[0];
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result[0];
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(id: number, status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));
}

// ─── RFQ ──────────────────────────────────────────────────────────────────────

export async function createRfqSubmission(data: InsertRfqSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(rfqSubmissions).values(data);
}

export async function getAllRfqSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rfqSubmissions).orderBy(desc(rfqSubmissions.createdAt));
}

export async function getRfqById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(rfqSubmissions).where(eq(rfqSubmissions.id, id));
  return rows[0] ?? null;
}

export async function updateRfqStatus(id: number, status: "new" | "reviewed" | "quoted" | "closed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(rfqSubmissions).set({ status, updatedAt: new Date() }).where(eq(rfqSubmissions.id, id));
}

// ─── Inquiry Notes ────────────────────────────────────────────────────────────

export async function getNotesForInquiry(rfqId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inquiryNotes).where(eq(inquiryNotes.rfqId, rfqId)).orderBy(desc(inquiryNotes.createdAt));
}

export async function addInquiryNote(data: InsertInquiryNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(inquiryNotes).values(data);
}

// ─── Knowledge Base ───────────────────────────────────────────────────────────

export async function getAllKnowledgeBase(opts?: { limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(knowledgeBase).limit(opts?.limit ?? 10).offset(opts?.offset ?? 0);
}

// ─── Virtual Try-On Saved Models ──────────────────────────────────────────────

export async function insertSavedTryOnModel(modelData: InsertSavedTryOnModel) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(savedTryOnModels).values(modelData);
}

export async function getSavedTryOnModels(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(savedTryOnModels).orderBy(desc(savedTryOnModels.createdAt)).limit(limit);
}

export async function getSavedTryOnModelById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(savedTryOnModels).where(eq(savedTryOnModels.id, id)).limit(1);
  return result[0];
}

// Semi-automatic product posting automation
export async function getProductAutomationSettings() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(productAutomationSettings).orderBy(desc(productAutomationSettings.id)).limit(1);
  return result[0];
}

export async function upsertProductAutomationSettings(data: InsertProductAutomationSettings) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getProductAutomationSettings();
  if (existing) {
    await db.update(productAutomationSettings).set(data).where(eq(productAutomationSettings.id, existing.id));
    const updated = await db.select().from(productAutomationSettings).where(eq(productAutomationSettings.id, existing.id)).limit(1);
    return updated[0];
  }

  await db.insert(productAutomationSettings).values(data);
  return getProductAutomationSettings();
}

export async function listProductAutomationSources(limit: number = 200) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productAutomationSources).orderBy(desc(productAutomationSources.createdAt)).limit(limit);
}

export async function getProductAutomationSourceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(productAutomationSources).where(eq(productAutomationSources.id, id)).limit(1);
  return result[0];
}

export async function enqueueProductAutomationSources(
  urls: string[],
  defaults?: Partial<Pick<InsertProductAutomationSource, "categoryId" | "subcategoryId" | "categoryLabel" | "promptOverride">>,
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const normalizedUrls = Array.from(new Set(urls.map((url) => url.trim()).filter(Boolean)));
  if (normalizedUrls.length === 0) {
    return { added: 0, skipped: 0 };
  }

  const existing = await db.select({
    sourceUrl: productAutomationSources.sourceUrl,
  }).from(productAutomationSources).where(
    or(...normalizedUrls.map((url) => eq(productAutomationSources.sourceUrl, url)))!
  );
  const existingUrls = new Set(existing.map((row) => row.sourceUrl));

  const newItems = normalizedUrls
    .filter((url) => !existingUrls.has(url))
    .map((sourceUrl) => ({
      sourceUrl,
      status: "queued" as const,
      categoryId: defaults?.categoryId ?? null,
      subcategoryId: defaults?.subcategoryId ?? null,
      categoryLabel: defaults?.categoryLabel ?? null,
      promptOverride: defaults?.promptOverride ?? null,
      nextAttemptAt: new Date(),
    }));

  if (newItems.length > 0) {
    await db.insert(productAutomationSources).values(newItems);
  }

  return {
    added: newItems.length,
    skipped: normalizedUrls.length - newItems.length,
  };
}

export async function updateProductAutomationSource(id: number, data: Partial<InsertProductAutomationSource>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(productAutomationSources).set(data).where(eq(productAutomationSources.id, id));
}

export async function deleteProductAutomationSource(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(productAutomationSources).where(eq(productAutomationSources.id, id));
}

export async function getReadyProductAutomationSources(limit: number = 1) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productAutomationSources)
    .where(and(
      or(
        eq(productAutomationSources.status, "queued"),
        eq(productAutomationSources.status, "failed"),
      )!,
      lte(productAutomationSources.nextAttemptAt, new Date()),
    ))
    .orderBy(productAutomationSources.nextAttemptAt, productAutomationSources.createdAt)
    .limit(limit);
}

export async function reserveProductAutomationUsage(data: InsertProductAutomationUsage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(productAutomationUsage).values(data);
}

export async function getReservedProductAutomationUsageSince(since: Date) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({
    total: sql<number>`coalesce(sum(${productAutomationUsage.reservedRequests}), 0)`,
  }).from(productAutomationUsage).where(gte(productAutomationUsage.createdAt, since));

  return Number(result[0]?.total ?? 0);
}

export async function addKnowledgeBaseEntry(data: InsertKnowledgeBaseEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(knowledgeBase).values(data);
}

export async function deleteKnowledgeBaseEntry(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(knowledgeBase).where(eq(knowledgeBase.id, id));
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true))).limit(1);
  return result[0];
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export async function getPortfolioItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));
}

export async function getFeaturedPortfolioItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioItems).where(eq(portfolioItems.isFeatured, true)).orderBy(desc(portfolioItems.createdAt)).limit(6);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getFeaturedTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).where(eq(testimonials.featured, true)).orderBy(desc(testimonials.createdAt)).limit(6);
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export async function createContactSubmission(data: InsertContactSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contactSubmissions).values(data);
}

// ─── Portfolio (new image-based system) ─────────────────────────────────────

export async function listPortfolioItems(opts?: { category?: string; onlyActive?: boolean; onlyFeatured?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(portfolioItems)
    .orderBy(portfolioItems.sortOrder, desc(portfolioItems.createdAt));
  return rows.filter(r => {
    if (opts?.onlyActive && !r.isActive) return false;
    if (opts?.onlyFeatured && !r.isFeatured) return false;
    if (opts?.category && opts.category !== "All" && r.category !== opts.category) return false;
    return true;
  });
}

export async function getPortfolioItemWithImages(id: number) {
  const db = await getDb();
  if (!db) return null;
  const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id)).limit(1);
  if (!item) return null;
  const images = await db.select().from(portfolioImages)
    .where(eq(portfolioImages.portfolioItemId, id))
    .orderBy(portfolioImages.sortOrder);
  return { ...item, images };
}

export async function getPortfolioImagesForItem(itemId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioImages)
    .where(eq(portfolioImages.portfolioItemId, itemId))
    .orderBy(portfolioImages.sortOrder);
}

export async function createPortfolioItem(data: InsertPortfolioItem): Promise<PortfolioItem> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(portfolioItems).values(data).$returningId();
  const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, result.id)).limit(1);
  return item;
}

export async function updatePortfolioItem(id: number, data: Partial<InsertPortfolioItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(portfolioItems).set({ ...data, updatedAt: new Date() }).where(eq(portfolioItems.id, id));
}

export async function deletePortfolioItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(portfolioImages).where(eq(portfolioImages.portfolioItemId, id));
  await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
}

export async function addPortfolioImage(data: InsertPortfolioImage): Promise<PortfolioImage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(portfolioImages).values(data).$returningId();
  const [img] = await db.select().from(portfolioImages).where(eq(portfolioImages.id, result.id)).limit(1);
  return img;
}

export async function deletePortfolioImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(portfolioImages).where(eq(portfolioImages.id, id));
}

export async function reorderPortfolioImages(updates: { id: number; sortOrder: number }[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (const u of updates) {
    await db.update(portfolioImages).set({ sortOrder: u.sortOrder }).where(eq(portfolioImages.id, u.id));
  }
}

export async function getPortfolioCategories(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ category: portfolioItems.category }).from(portfolioItems)
    .where(eq(portfolioItems.isActive, true));
  return Array.from(new Set(rows.map(r => r.category).filter(Boolean))) as string[];
}

// ─── Tech Packs ───────────────────────────────────────────────────────────────

export async function createTechPack(data: InsertTechPack) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(techPacks).values(data);
  const result = await db.select().from(techPacks).where(eq(techPacks.referenceNumber, data.referenceNumber)).limit(1);
  return result[0];
}

export async function getTechPackById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(techPacks).where(eq(techPacks.id, id)).limit(1);
  return result[0];
}

export async function getAllTechPacks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(techPacks).orderBy(desc(techPacks.createdAt));
}

export async function updateTechPackStatus(id: number, status: "draft" | "submitted" | "reviewed" | "quoted", notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { status, updatedAt: new Date() };
  if (notes !== undefined) updateData.adminNotes = notes;

  await db.update(techPacks).set(updateData).where(eq(techPacks.id, id));
}

export async function addTechPackImage(data: InsertTechPackImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(techPackImages).values(data).$returningId();
  const [img] = await db.select().from(techPackImages).where(eq(techPackImages.id, result.id)).limit(1);
  return img;
}

export async function getTechPackImages(techPackId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(techPackImages)
    .where(eq(techPackImages.techPackId, techPackId))
    .orderBy(techPackImages.sortOrder);
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getAllCategories(opts?: { includeInactive?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = opts?.includeInactive ? undefined : eq(categories.isActive, true);
  return db.select().from(categories)
    .where(conditions)
    .orderBy(categories.sortOrder, categories.name);
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0];
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

export async function createCategory(data: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(categories).values(data).$returningId();
  const [category] = await db.select().from(categories).where(eq(categories.id, result.id)).limit(1);
  return category;
}

export async function updateCategory(id: number, data: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categories).where(eq(categories.id, id));
}

// ─── Subcategories ────────────────────────────────────────────────────────────

export async function getSubcategoriesByCategoryId(categoryId: number, opts?: { includeInactive?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  const conditions: any[] = [eq(subcategories.categoryId, categoryId)];
  if (!opts?.includeInactive) {
    conditions.push(eq(subcategories.isActive, true));
  }
  return db.select().from(subcategories)
    .where(and(...conditions))
    .orderBy(subcategories.sortOrder, subcategories.name);
}

export async function getSubcategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subcategories).where(eq(subcategories.id, id)).limit(1);
  return result[0];
}

export async function createSubcategory(data: InsertSubcategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(subcategories).values(data).$returningId();
  const [subcategory] = await db.select().from(subcategories).where(eq(subcategories.id, result.id)).limit(1);
  return subcategory;
}

export async function updateSubcategory(id: number, data: Partial<InsertSubcategory>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(subcategories).set(data).where(eq(subcategories.id, id));
}

export async function deleteSubcategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(subcategories).where(eq(subcategories.id, id));
}

export async function getCategoriesWithSubcategories(opts?: { includeInactive?: boolean }) {
  const db = await getDb();
  if (!db) return [];

  const cats = await getAllCategories(opts);
  const result = [];

  for (const cat of cats) {
    const subs = await getSubcategoriesByCategoryId(cat.id, opts);
    result.push({
      ...cat,
      subcategories: subs,
    });
  }

  return result;
}

// Re-export types for convenience
export type { Order, Product, ProductImage, SlabPrice, SizeChart, ShippingZone, PortfolioItem, PortfolioImage, TechPack, TechPackImage, Category, Subcategory } from "../drizzle/schema";
