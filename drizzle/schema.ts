import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  password: varchar("password", { length: 255 }), // new: for local email/pass auth
  geminiApiKey: varchar("geminiApiKey", { length: 255 }), // per-client Gemini AI key
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Products ─────────────────────────────────────────────────────────────────

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // legacy field - keep for compatibility
  categoryId: int("category_id"),
  subcategoryId: int("subcategory_id"),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  mainImage: varchar("mainImage", { length: 1000 }),
  samplePrice: decimal("samplePrice", { precision: 10, scale: 2 }),
  weight: decimal("weight", { precision: 8, scale: 3 }), // kg per unit, for shipping calc
  availableSizes: text("availableSizes"), // JSON array e.g. ["S","M","L","XL","XXL","3XL"]
  availableColors: text("availableColors"), // JSON array of color names
  material: varchar("material", { length: 255 }),
  manufacturingStory: text("manufacturingStory"), // SEO/GEO driven manufacturing details
  manufacturingInfographic: varchar("manufacturingInfographic", { length: 1000 }), // Infographic image URL
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  freeShipping: boolean("freeShipping").default(false).notNull(),
  // SEO fields
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: text("seoDescription"),
  seoKeywords: text("seoKeywords"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ─── Product Images ───────────────────────────────────────────────────────────

export const productImages = mysqlTable("product_images", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  imageUrl: varchar("imageUrl", { length: 1000 }).notNull(),
  altText: varchar("altText", { length: 255 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductImage = typeof productImages.$inferSelect;
export type InsertProductImage = typeof productImages.$inferInsert;

// ─── Slab Prices (MOQ tiers) ──────────────────────────────────────────────────

export const slabPrices = mysqlTable("slab_prices", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  minQty: int("minQty").notNull(),
  maxQty: int("maxQty"), // null = unlimited (e.g. 500+)
  pricePerUnit: decimal("pricePerUnit", { precision: 10, scale: 2 }).notNull(),
  label: varchar("label", { length: 100 }), // e.g. "Bulk Discount", "Best Value"
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type SlabPrice = typeof slabPrices.$inferSelect;
export type InsertSlabPrice = typeof slabPrices.$inferInsert;

// ─── Size Charts ──────────────────────────────────────────────────────────────

export const sizeCharts = mysqlTable("size_charts", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull().unique(),
  // chartData: JSON array of rows, each row: { size, chest, waist, hip, length, ... }
  chartData: text("chartData").notNull(), // JSON
  unit: mysqlEnum("unit", ["inches", "cm"]).default("inches").notNull(),
  notes: text("notes"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SizeChart = typeof sizeCharts.$inferSelect;
export type InsertSizeChart = typeof sizeCharts.$inferInsert;

// ─── Shipping Zones ───────────────────────────────────────────────────────────

export const shippingZones = mysqlTable("shipping_zones", {
  id: int("id").autoincrement().primaryKey(),
  zoneName: varchar("zoneName", { length: 100 }).notNull(), // e.g. "North America", "Europe"
  countries: text("countries").notNull(), // JSON array of ISO country codes
  baseRate: decimal("baseRate", { precision: 10, scale: 2 }).notNull(), // base shipping cost in USD
  perUnitRate: decimal("perUnitRate", { precision: 10, scale: 2 }).default("0.00").notNull(), // extra per unit
  perKgRate: decimal("perKgRate", { precision: 10, scale: 2 }).default("0.00").notNull(),
  minDays: int("minDays").default(7).notNull(),
  maxDays: int("maxDays").default(21).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShippingZone = typeof shippingZones.$inferSelect;
export type InsertShippingZone = typeof shippingZones.$inferInsert;

// ─── Cart Items ───────────────────────────────────────────────────────────────

export const cartItems = mysqlTable("cart_items", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(), // anonymous cart support
  userId: int("userId"), // null for guests
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull().default(1),
  selectedSize: varchar("selectedSize", { length: 50 }),
  selectedColor: varchar("selectedColor", { length: 100 }),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 64 }).notNull().unique(),
  userId: int("userId"),
  sessionId: varchar("sessionId", { length: 128 }),
  // Customer info
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 64 }),
  companyName: varchar("companyName", { length: 255 }),
  // Shipping address
  addressLine1: varchar("addressLine1", { length: 500 }).notNull(),
  addressLine2: varchar("addressLine2", { length: 500 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }),
  country: varchar("country", { length: 100 }).notNull(),
  countryCode: varchar("countryCode", { length: 10 }).notNull(),
  // Financials (in USD)
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  // Items snapshot (JSON)
  items: text("items").notNull(), // JSON array of { productId, title, qty, size, color, unitPrice }
  // Payment
  paymentMethod: mysqlEnum("paymentMethod", ["stripe", "invoice"]).default("invoice").notNull(),
  // Stripe
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  status: mysqlEnum("status", ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// ─── RFQ Submissions ──────────────────────────────────────────────────────────

export const rfqSubmissions = mysqlTable("rfq_submissions", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  country: varchar("country", { length: 100 }),
  website: varchar("website", { length: 255 }),
  productType: varchar("productType", { length: 100 }).notNull(),
  quantity: varchar("quantity", { length: 100 }).notNull(),
  customization: text("customization"),
  fabricPreference: varchar("fabricPreference", { length: 255 }),
  timeline: varchar("timeline", { length: 100 }),
  budget: varchar("budget", { length: 100 }),
  additionalNotes: text("additionalNotes"),
  designImageUrl: text("designImageUrl"),
  garmentType: varchar("garmentType", { length: 100 }),
  status: mysqlEnum("status", ["new", "reviewed", "quoted", "closed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RfqSubmission = typeof rfqSubmissions.$inferSelect;
export type InsertRfqSubmission = typeof rfqSubmissions.$inferInsert;

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  category: varchar("category", { length: 100 }),
  tags: text("tags"),
  featuredImage: varchar("featuredImage", { length: 500 }),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

// ─── Portfolio Items ──────────────────────────────────────────────────────────

export const portfolioItems = mysqlTable("portfolio_items", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  tags: text("tags"),           // JSON array of tag strings
  coverImage: varchar("coverImage", { length: 1000 }), // first/hero image URL
  // SEO & Geo fields
  seoTitle: varchar("seoTitle", { length: 255 }),
  seoDescription: text("seoDescription"),
  seoKeywords: text("seoKeywords"),
  geoTarget: varchar("geoTarget", { length: 255 }), // e.g. "US, UK, Canada"
  ogImage: varchar("ogImage", { length: 1000 }),    // Open Graph image URL
  // Display controls
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = typeof portfolioItems.$inferInsert;

// ─── Portfolio Images ─────────────────────────────────────────────────────────

export const portfolioImages = mysqlTable("portfolio_images", {
  id: int("id").autoincrement().primaryKey(),
  portfolioItemId: int("portfolioItemId").notNull(),
  imageUrl: varchar("imageUrl", { length: 1000 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }),     // S3 key for deletion
  altText: varchar("altText", { length: 500 }),     // SEO alt text
  caption: varchar("caption", { length: 500 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PortfolioImage = typeof portfolioImages.$inferSelect;
export type InsertPortfolioImage = typeof portfolioImages.$inferInsert;

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientTitle: varchar("clientTitle", { length: 255 }),
  companyName: varchar("companyName", { length: 255 }),
  country: varchar("country", { length: 100 }),
  rating: int("rating").default(5),
  testimonial: text("testimonial").notNull(),
  avatar: varchar("avatar", { length: 500 }),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// ─── Contact Submissions ──────────────────────────────────────────────────────

export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 64 }),
  subject: varchar("subject", { length: 500 }),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

// ─── Tech Packs ───────────────────────────────────────────────────────────────

export const techPacks = mysqlTable("tech_packs", {
  id: int("id").autoincrement().primaryKey(),
  referenceNumber: varchar("referenceNumber", { length: 64 }).notNull().unique(),
  brandName: varchar("brandName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }),
  country: varchar("country", { length: 100 }),
  garmentType: varchar("garmentType", { length: 100 }).notNull(),
  styleName: varchar("styleName", { length: 255 }),
  season: varchar("season", { length: 100 }),
  gender: varchar("gender", { length: 100 }),
  targetMarket: varchar("targetMarket", { length: 255 }),
  techPackData: text("techPackData").notNull(), // JSON blob for the full wizard data
  status: mysqlEnum("status", ["draft", "submitted", "reviewed", "quoted"]).default("submitted").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TechPack = typeof techPacks.$inferSelect;
export type InsertTechPack = typeof techPacks.$inferInsert;

export const techPackImages = mysqlTable("tech_pack_images", {
  id: int("id").autoincrement().primaryKey(),
  techPackId: int("techPackId").notNull(),
  imageUrl: varchar("imageUrl", { length: 1000 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }),
  imageType: mysqlEnum("imageType", ["mockup", "flat_sketch", "reference", "hangtag", "care_label"]).notNull(),
  caption: varchar("caption", { length: 500 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TechPackImage = typeof techPackImages.$inferSelect;
export type InsertTechPackImage = typeof techPackImages.$inferInsert;

// ─── Inquiry Notes ────────────────────────────────────────────────────────────

export const inquiryNotes = mysqlTable("inquiry_notes", {
  id: int("id").autoincrement().primaryKey(),
  rfqId: int("rfqId").notNull(),
  content: text("content").notNull(),
  isAiGenerated: boolean("isAiGenerated").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InquiryNote = typeof inquiryNotes.$inferSelect;
export type InsertInquiryNote = typeof inquiryNotes.$inferInsert;

// ─── Knowledge Base ───────────────────────────────────────────────────────────

export const knowledgeBase = mysqlTable("knowledge_base", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).default("general").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KnowledgeBaseEntry = typeof knowledgeBase.$inferSelect;
export type InsertKnowledgeBaseEntry = typeof knowledgeBase.$inferInsert;

// ─── Saved Virtual Try-On Models ──────────────────────────────────────────────

export const savedTryOnModels = mysqlTable("saved_tryon_models", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }), // Optional name for the model
  imageUrl: varchar("imageUrl", { length: 1000 }).notNull(), // The high-res URL of the model image
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SavedTryOnModel = typeof savedTryOnModels.$inferSelect;
export type InsertSavedTryOnModel = typeof savedTryOnModels.$inferInsert;

// ─── Categories ───────────────────────────────────────────────────────────────

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 50 }).default(""),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 1000 }),
  sortOrder: int("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// ─── Subcategories ────────────────────────────────────────────────────────────

export const subcategories = mysqlTable("subcategories", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("category_id").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull(),
  description: text("description"),
  sortOrder: int("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueCategorySubcategory: { unique: [table.categoryId, table.slug] },
}));

export type Subcategory = typeof subcategories.$inferSelect;
export type InsertSubcategory = typeof subcategories.$inferInsert;

// Semi-automatic AI product posting settings and queue
export const productAutomationSettings = mysqlTable("product_automation_settings", {
  id: int("id").autoincrement().primaryKey(),
  ownerUserId: int("ownerUserId"),
  isEnabled: boolean("isEnabled").default(false).notNull(),
  runEveryMinutes: int("runEveryMinutes").default(60).notNull(),
  maxSourcesPerRun: int("maxSourcesPerRun").default(1).notNull(),
  geminiRequestsPerMinuteLimit: int("geminiRequestsPerMinuteLimit").default(8).notNull(),
  geminiRequestsPerDayLimit: int("geminiRequestsPerDayLimit").default(100).notNull(),
  defaultCategoryId: int("defaultCategoryId"),
  defaultSubcategoryId: int("defaultSubcategoryId"),
  defaultCategoryLabel: varchar("defaultCategoryLabel", { length: 100 }),
  savedModelId: int("savedModelId"),
  defaultPrompt: text("defaultPrompt"),
  lastRunAt: timestamp("lastRunAt"),
  lastRunSummary: text("lastRunSummary"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductAutomationSettings = typeof productAutomationSettings.$inferSelect;
export type InsertProductAutomationSettings = typeof productAutomationSettings.$inferInsert;

export const productAutomationSources = mysqlTable("product_automation_sources", {
  id: int("id").autoincrement().primaryKey(),
  sourceUrl: varchar("sourceUrl", { length: 1000 }).notNull().unique(),
  sourceTitle: varchar("sourceTitle", { length: 255 }),
  status: mysqlEnum("status", ["queued", "processing", "draft_created", "failed", "skipped"]).default("queued").notNull(),
  categoryId: int("categoryId"),
  subcategoryId: int("subcategoryId"),
  categoryLabel: varchar("categoryLabel", { length: 100 }),
  promptOverride: text("promptOverride"),
  notes: text("notes"),
  productId: int("productId"),
  generatedMainImage: varchar("generatedMainImage", { length: 1000 }),
  attemptCount: int("attemptCount").default(0).notNull(),
  lastAttemptAt: timestamp("lastAttemptAt"),
  nextAttemptAt: timestamp("nextAttemptAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductAutomationSource = typeof productAutomationSources.$inferSelect;
export type InsertProductAutomationSource = typeof productAutomationSources.$inferInsert;

export const productAutomationUsage = mysqlTable("product_automation_usage", {
  id: int("id").autoincrement().primaryKey(),
  sourceId: int("sourceId"),
  reservedRequests: int("reservedRequests").notNull(),
  reason: varchar("reason", { length: 100 }).default("automation_run").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductAutomationUsage = typeof productAutomationUsage.$inferSelect;
export type InsertProductAutomationUsage = typeof productAutomationUsage.$inferInsert;
