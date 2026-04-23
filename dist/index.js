var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  blogPosts: () => blogPosts,
  cartItems: () => cartItems,
  categories: () => categories,
  contactSubmissions: () => contactSubmissions,
  inquiryNotes: () => inquiryNotes,
  knowledgeBase: () => knowledgeBase,
  orders: () => orders,
  portfolioImages: () => portfolioImages,
  portfolioItems: () => portfolioItems,
  productAutomationSettings: () => productAutomationSettings,
  productAutomationSources: () => productAutomationSources,
  productAutomationUsage: () => productAutomationUsage,
  productImages: () => productImages,
  products: () => products,
  rfqSubmissions: () => rfqSubmissions,
  savedTryOnModels: () => savedTryOnModels,
  shippingZones: () => shippingZones,
  sizeCharts: () => sizeCharts,
  slabPrices: () => slabPrices,
  subcategories: () => subcategories,
  techPackImages: () => techPackImages,
  techPacks: () => techPacks,
  testimonials: () => testimonials,
  users: () => users
});
import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal
} from "drizzle-orm/mysql-core";
var users, products, productImages, slabPrices, sizeCharts, shippingZones, cartItems, orders, rfqSubmissions, blogPosts, portfolioItems, portfolioImages, testimonials, contactSubmissions, techPacks, techPackImages, inquiryNotes, knowledgeBase, savedTryOnModels, categories, subcategories, productAutomationSettings, productAutomationSources, productAutomationUsage;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      id: int("id").autoincrement().primaryKey(),
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      password: varchar("password", { length: 255 }),
      // new: for local email/pass auth
      geminiApiKey: varchar("geminiApiKey", { length: 255 }),
      // per-client Gemini AI key
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    products = mysqlTable("products", {
      id: int("id").autoincrement().primaryKey(),
      slug: varchar("slug", { length: 255 }).notNull().unique(),
      title: varchar("title", { length: 500 }).notNull(),
      category: varchar("category", { length: 100 }).notNull(),
      // legacy field - keep for compatibility
      categoryId: int("category_id"),
      subcategoryId: int("subcategory_id"),
      description: text("description"),
      shortDescription: varchar("shortDescription", { length: 500 }),
      mainImage: varchar("mainImage", { length: 1e3 }),
      samplePrice: decimal("samplePrice", { precision: 10, scale: 2 }),
      weight: decimal("weight", { precision: 8, scale: 3 }),
      // kg per unit, for shipping calc
      availableSizes: text("availableSizes"),
      // JSON array e.g. ["S","M","L","XL","XXL","3XL"]
      availableColors: text("availableColors"),
      // JSON array of color names
      material: varchar("material", { length: 255 }),
      manufacturingStory: text("manufacturingStory"),
      // SEO/GEO driven manufacturing details
      manufacturingInfographic: varchar("manufacturingInfographic", { length: 1e3 }),
      // Infographic image URL
      isFeatured: boolean("isFeatured").default(false).notNull(),
      isActive: boolean("isActive").default(true).notNull(),
      freeShipping: boolean("freeShipping").default(false).notNull(),
      // SEO fields
      seoTitle: varchar("seoTitle", { length: 255 }),
      seoDescription: text("seoDescription"),
      seoKeywords: text("seoKeywords"),
      sortOrder: int("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    productImages = mysqlTable("product_images", {
      id: int("id").autoincrement().primaryKey(),
      productId: int("productId").notNull(),
      imageUrl: varchar("imageUrl", { length: 1e3 }).notNull(),
      altText: varchar("altText", { length: 255 }),
      sortOrder: int("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    slabPrices = mysqlTable("slab_prices", {
      id: int("id").autoincrement().primaryKey(),
      productId: int("productId").notNull(),
      minQty: int("minQty").notNull(),
      maxQty: int("maxQty"),
      // null = unlimited (e.g. 500+)
      pricePerUnit: decimal("pricePerUnit", { precision: 10, scale: 2 }).notNull(),
      label: varchar("label", { length: 100 }),
      // e.g. "Bulk Discount", "Best Value"
      sortOrder: int("sortOrder").default(0).notNull()
    });
    sizeCharts = mysqlTable("size_charts", {
      id: int("id").autoincrement().primaryKey(),
      productId: int("productId").notNull().unique(),
      // chartData: JSON array of rows, each row: { size, chest, waist, hip, length, ... }
      chartData: text("chartData").notNull(),
      // JSON
      unit: mysqlEnum("unit", ["inches", "cm"]).default("inches").notNull(),
      notes: text("notes"),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    shippingZones = mysqlTable("shipping_zones", {
      id: int("id").autoincrement().primaryKey(),
      zoneName: varchar("zoneName", { length: 100 }).notNull(),
      // e.g. "North America", "Europe"
      countries: text("countries").notNull(),
      // JSON array of ISO country codes
      baseRate: decimal("baseRate", { precision: 10, scale: 2 }).notNull(),
      // base shipping cost in USD
      perUnitRate: decimal("perUnitRate", { precision: 10, scale: 2 }).default("0.00").notNull(),
      // extra per unit
      perKgRate: decimal("perKgRate", { precision: 10, scale: 2 }).default("0.00").notNull(),
      minDays: int("minDays").default(7).notNull(),
      maxDays: int("maxDays").default(21).notNull(),
      currency: varchar("currency", { length: 10 }).default("USD").notNull(),
      isActive: boolean("isActive").default(true).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    cartItems = mysqlTable("cart_items", {
      id: int("id").autoincrement().primaryKey(),
      sessionId: varchar("sessionId", { length: 128 }).notNull(),
      // anonymous cart support
      userId: int("userId"),
      // null for guests
      productId: int("productId").notNull(),
      quantity: int("quantity").notNull().default(1),
      selectedSize: varchar("selectedSize", { length: 50 }),
      selectedColor: varchar("selectedColor", { length: 100 }),
      addedAt: timestamp("addedAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    orders = mysqlTable("orders", {
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
      items: text("items").notNull(),
      // JSON array of { productId, title, qty, size, color, unitPrice }
      // Payment
      paymentMethod: mysqlEnum("paymentMethod", ["stripe", "invoice"]).default("invoice").notNull(),
      // Stripe
      stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
      stripeSessionId: varchar("stripeSessionId", { length: 255 }),
      status: mysqlEnum("status", ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]).default("pending").notNull(),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    rfqSubmissions = mysqlTable("rfq_submissions", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    blogPosts = mysqlTable("blog_posts", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    portfolioItems = mysqlTable("portfolio_items", {
      id: int("id").autoincrement().primaryKey(),
      title: varchar("title", { length: 500 }).notNull(),
      category: varchar("category", { length: 100 }).notNull(),
      description: text("description"),
      tags: text("tags"),
      // JSON array of tag strings
      coverImage: varchar("coverImage", { length: 1e3 }),
      // first/hero image URL
      // SEO & Geo fields
      seoTitle: varchar("seoTitle", { length: 255 }),
      seoDescription: text("seoDescription"),
      seoKeywords: text("seoKeywords"),
      geoTarget: varchar("geoTarget", { length: 255 }),
      // e.g. "US, UK, Canada"
      ogImage: varchar("ogImage", { length: 1e3 }),
      // Open Graph image URL
      // Display controls
      isFeatured: boolean("isFeatured").default(false).notNull(),
      isActive: boolean("isActive").default(true).notNull(),
      sortOrder: int("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    portfolioImages = mysqlTable("portfolio_images", {
      id: int("id").autoincrement().primaryKey(),
      portfolioItemId: int("portfolioItemId").notNull(),
      imageUrl: varchar("imageUrl", { length: 1e3 }).notNull(),
      fileKey: varchar("fileKey", { length: 500 }),
      // S3 key for deletion
      altText: varchar("altText", { length: 500 }),
      // SEO alt text
      caption: varchar("caption", { length: 500 }),
      sortOrder: int("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    testimonials = mysqlTable("testimonials", {
      id: int("id").autoincrement().primaryKey(),
      clientName: varchar("clientName", { length: 255 }).notNull(),
      clientTitle: varchar("clientTitle", { length: 255 }),
      companyName: varchar("companyName", { length: 255 }),
      country: varchar("country", { length: 100 }),
      rating: int("rating").default(5),
      testimonial: text("testimonial").notNull(),
      avatar: varchar("avatar", { length: 500 }),
      featured: boolean("featured").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    contactSubmissions = mysqlTable("contact_submissions", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      email: varchar("email", { length: 320 }).notNull(),
      company: varchar("company", { length: 255 }),
      phone: varchar("phone", { length: 64 }),
      subject: varchar("subject", { length: 500 }),
      message: text("message").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    techPacks = mysqlTable("tech_packs", {
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
      techPackData: text("techPackData").notNull(),
      // JSON blob for the full wizard data
      status: mysqlEnum("status", ["draft", "submitted", "reviewed", "quoted"]).default("submitted").notNull(),
      adminNotes: text("adminNotes"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    techPackImages = mysqlTable("tech_pack_images", {
      id: int("id").autoincrement().primaryKey(),
      techPackId: int("techPackId").notNull(),
      imageUrl: varchar("imageUrl", { length: 1e3 }).notNull(),
      fileKey: varchar("fileKey", { length: 500 }),
      imageType: mysqlEnum("imageType", ["mockup", "flat_sketch", "reference", "hangtag", "care_label"]).notNull(),
      caption: varchar("caption", { length: 500 }),
      sortOrder: int("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    inquiryNotes = mysqlTable("inquiry_notes", {
      id: int("id").autoincrement().primaryKey(),
      rfqId: int("rfqId").notNull(),
      content: text("content").notNull(),
      isAiGenerated: boolean("isAiGenerated").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    knowledgeBase = mysqlTable("knowledge_base", {
      id: int("id").autoincrement().primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      content: text("content").notNull(),
      category: varchar("category", { length: 100 }).default("general").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    savedTryOnModels = mysqlTable("saved_tryon_models", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 255 }),
      // Optional name for the model
      imageUrl: varchar("imageUrl", { length: 1e3 }).notNull(),
      // The high-res URL of the model image
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    categories = mysqlTable("categories", {
      id: int("id").autoincrement().primaryKey(),
      name: varchar("name", { length: 100 }).notNull(),
      slug: varchar("slug", { length: 100 }).notNull().unique(),
      icon: varchar("icon", { length: 50 }).default(""),
      description: text("description"),
      imageUrl: varchar("image_url", { length: 1e3 }),
      sortOrder: int("sort_order").default(0).notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      seoTitle: varchar("seo_title", { length: 255 }),
      seoDescription: text("seo_description"),
      seoKeywords: text("seo_keywords"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    });
    subcategories = mysqlTable("subcategories", {
      id: int("id").autoincrement().primaryKey(),
      categoryId: int("category_id").notNull(),
      name: varchar("name", { length: 100 }).notNull(),
      slug: varchar("slug", { length: 100 }).notNull(),
      description: text("description"),
      sortOrder: int("sort_order").default(0).notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      createdAt: timestamp("created_at").defaultNow().notNull(),
      updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
    }, (table) => ({
      uniqueCategorySubcategory: { unique: [table.categoryId, table.slug] }
    }));
    productAutomationSettings = mysqlTable("product_automation_settings", {
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
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    productAutomationSources = mysqlTable("product_automation_sources", {
      id: int("id").autoincrement().primaryKey(),
      sourceUrl: varchar("sourceUrl", { length: 1e3 }).notNull().unique(),
      sourceTitle: varchar("sourceTitle", { length: 255 }),
      status: mysqlEnum("status", ["queued", "processing", "draft_created", "failed", "skipped"]).default("queued").notNull(),
      categoryId: int("categoryId"),
      subcategoryId: int("subcategoryId"),
      categoryLabel: varchar("categoryLabel", { length: 100 }),
      promptOverride: text("promptOverride"),
      notes: text("notes"),
      productId: int("productId"),
      generatedMainImage: varchar("generatedMainImage", { length: 1e3 }),
      attemptCount: int("attemptCount").default(0).notNull(),
      lastAttemptAt: timestamp("lastAttemptAt"),
      nextAttemptAt: timestamp("nextAttemptAt").defaultNow().notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    productAutomationUsage = mysqlTable("product_automation_usage", {
      id: int("id").autoincrement().primaryKey(),
      sourceId: int("sourceId"),
      reservedRequests: int("reservedRequests").notNull(),
      reason: varchar("reason", { length: 100 }).default("automation_run").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
      geminiApiKey: process.env.GEMINI_API_KEY ?? "",
      storagePath: process.env.STORAGE_PATH || ""
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  addInquiryNote: () => addInquiryNote,
  addKnowledgeBaseEntry: () => addKnowledgeBaseEntry,
  addPortfolioImage: () => addPortfolioImage,
  addProductImage: () => addProductImage,
  addTechPackImage: () => addTechPackImage,
  clearCart: () => clearCart,
  createCategory: () => createCategory,
  createContactSubmission: () => createContactSubmission,
  createOrder: () => createOrder,
  createPortfolioItem: () => createPortfolioItem,
  createProduct: () => createProduct,
  createRfqSubmission: () => createRfqSubmission,
  createShippingZone: () => createShippingZone,
  createSubcategory: () => createSubcategory,
  createTechPack: () => createTechPack,
  deleteCategory: () => deleteCategory,
  deleteKnowledgeBaseEntry: () => deleteKnowledgeBaseEntry,
  deletePortfolioImage: () => deletePortfolioImage,
  deletePortfolioItem: () => deletePortfolioItem,
  deleteProduct: () => deleteProduct,
  deleteProductAutomationSource: () => deleteProductAutomationSource,
  deleteProductImage: () => deleteProductImage,
  deleteShippingZone: () => deleteShippingZone,
  deleteSubcategory: () => deleteSubcategory,
  enqueueProductAutomationSources: () => enqueueProductAutomationSources,
  findShippingZoneForCountry: () => findShippingZoneForCountry,
  getActiveProducts: () => getActiveProducts,
  getActiveShippingZones: () => getActiveShippingZones,
  getAllCategories: () => getAllCategories,
  getAllKnowledgeBase: () => getAllKnowledgeBase,
  getAllOrders: () => getAllOrders,
  getAllProducts: () => getAllProducts,
  getAllRfqSubmissions: () => getAllRfqSubmissions,
  getAllShippingZones: () => getAllShippingZones,
  getAllTechPacks: () => getAllTechPacks,
  getBlogPostBySlug: () => getBlogPostBySlug,
  getCartItems: () => getCartItems,
  getCategoriesWithSubcategories: () => getCategoriesWithSubcategories,
  getCategoryById: () => getCategoryById,
  getCategoryBySlug: () => getCategoryBySlug,
  getDb: () => getDb,
  getFeaturedPortfolioItems: () => getFeaturedPortfolioItems,
  getFeaturedProducts: () => getFeaturedProducts,
  getFeaturedTestimonials: () => getFeaturedTestimonials,
  getNotesForInquiry: () => getNotesForInquiry,
  getOrderByNumber: () => getOrderByNumber,
  getPortfolioCategories: () => getPortfolioCategories,
  getPortfolioImagesForItem: () => getPortfolioImagesForItem,
  getPortfolioItemWithImages: () => getPortfolioItemWithImages,
  getPortfolioItems: () => getPortfolioItems,
  getProductAutomationSettings: () => getProductAutomationSettings,
  getProductAutomationSourceById: () => getProductAutomationSourceById,
  getProductById: () => getProductById,
  getProductBySlug: () => getProductBySlug,
  getProductImages: () => getProductImages,
  getPublishedBlogPosts: () => getPublishedBlogPosts,
  getReadyProductAutomationSources: () => getReadyProductAutomationSources,
  getReservedProductAutomationUsageSince: () => getReservedProductAutomationUsageSince,
  getRfqById: () => getRfqById,
  getSavedTryOnModelById: () => getSavedTryOnModelById,
  getSavedTryOnModels: () => getSavedTryOnModels,
  getSizeChart: () => getSizeChart,
  getSlabPrices: () => getSlabPrices,
  getSubcategoriesByCategoryId: () => getSubcategoriesByCategoryId,
  getSubcategoryById: () => getSubcategoryById,
  getTechPackById: () => getTechPackById,
  getTechPackImages: () => getTechPackImages,
  getUserById: () => getUserById,
  getUserByOpenId: () => getUserByOpenId,
  insertSavedTryOnModel: () => insertSavedTryOnModel,
  listPortfolioItems: () => listPortfolioItems,
  listProductAutomationSources: () => listProductAutomationSources,
  removeCartItem: () => removeCartItem,
  reorderPortfolioImages: () => reorderPortfolioImages,
  reorderProductImages: () => reorderProductImages,
  reserveProductAutomationUsage: () => reserveProductAutomationUsage,
  setSlabPrices: () => setSlabPrices,
  updateCartItemQty: () => updateCartItemQty,
  updateCategory: () => updateCategory,
  updateOrderStatus: () => updateOrderStatus,
  updatePortfolioItem: () => updatePortfolioItem,
  updateProduct: () => updateProduct,
  updateProductAutomationSource: () => updateProductAutomationSource,
  updateRfqStatus: () => updateRfqStatus,
  updateShippingZone: () => updateShippingZone,
  updateSubcategory: () => updateSubcategory,
  updateTechPackStatus: () => updateTechPackStatus,
  upsertCartItem: () => upsertCartItem,
  upsertProductAutomationSettings: () => upsertProductAutomationSettings,
  upsertSizeChart: () => upsertSizeChart,
  upsertUser: () => upsertUser
});
import { and, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = { openId: user.openId };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = /* @__PURE__ */ new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getUserById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}
async function getActiveProducts(opts) {
  const db = await getDb();
  if (!db) {
    console.error("[getActiveProducts] Database connection failed");
    return [];
  }
  console.log("[getActiveProducts] Fetching products with opts:", opts);
  const conditions = [eq(products.isActive, true)];
  if (opts?.category && opts.category !== "all") {
    const category = await db.select().from(categories).where(eq(categories.slug, opts.category)).limit(1);
    if (category.length > 0) {
      conditions.push(eq(products.categoryId, category[0].id));
    } else {
      conditions.push(eq(products.category, opts.category));
    }
  }
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
      )
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
      updatedAt: products.updatedAt
    }).from(products).where(and(...conditions)).orderBy(products.sortOrder, desc(products.createdAt)).limit(opts?.limit ?? 50).offset(opts?.offset ?? 0);
    console.log("[getActiveProducts] Returned", results.length, "products");
    return results;
  } catch (error) {
    console.error("[getActiveProducts] Error fetching products:", error);
    return [];
  }
}
async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(products.sortOrder, desc(products.createdAt));
}
async function getProductBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0];
}
async function getProductById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}
async function createProduct(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(products).values(data);
  } catch (err) {
    const causeCode = err.cause?.code || err.code;
    const causeMsg = err.cause?.message || err.message;
    if (causeCode === "ER_DUP_ENTRY" && causeMsg.includes("slug")) {
      data.slug = data.slug + "-" + Math.random().toString(36).substring(2, 6);
      try {
        await db.insert(products).values(data);
      } catch (retryErr) {
        throw new Error("DB Insert Failed after slug retry: " + (retryErr.cause?.message || retryErr.message));
      }
    } else if (causeCode === "ER_BAD_FIELD_ERROR" && causeMsg.includes("weight")) {
      delete data.weight;
      try {
        await db.insert(products).values(data);
      } catch (retryErr) {
        throw new Error("DB Insert Failed after weight retry: " + (retryErr.cause?.message || retryErr.message));
      }
    } else {
      throw new Error("DB Insert Failed: " + causeMsg);
    }
  }
  const result = await db.select().from(products).where(eq(products.slug, data.slug)).limit(1);
  return result[0];
}
async function updateProduct(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.update(products).set(data).where(eq(products.id, id));
  } catch (err) {
    const causeCode = err.cause?.code || err.code;
    const causeMsg = err.cause?.message || err.message;
    if (causeCode === "ER_BAD_FIELD_ERROR" && causeMsg.includes("weight")) {
      delete data.weight;
      try {
        await db.update(products).set(data).where(eq(products.id, id));
      } catch (retryErr) {
        throw new Error("DB Update Failed after weight retry: " + (retryErr.cause?.message || retryErr.message));
      }
    } else {
      throw new Error("DB Update Failed: " + causeMsg);
    }
  }
}
async function deleteProduct(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
}
async function getFeaturedProducts() {
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
    updatedAt: products.updatedAt
  }).from(products).where(and(eq(products.isFeatured, true), eq(products.isActive, true))).orderBy(products.sortOrder).limit(8);
}
async function getProductImages(productId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productImages).where(eq(productImages.productId, productId)).orderBy(productImages.sortOrder);
}
async function addProductImage(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(productImages).values(data);
}
async function deleteProductImage(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(productImages).where(eq(productImages.id, id));
}
async function reorderProductImages(updates) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (const u of updates) {
    await db.update(productImages).set({ sortOrder: u.sortOrder }).where(eq(productImages.id, u.id));
  }
}
async function getSlabPrices(productId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(slabPrices).where(eq(slabPrices.productId, productId)).orderBy(slabPrices.sortOrder);
}
async function setSlabPrices(productId, slabs) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(slabPrices).where(eq(slabPrices.productId, productId));
  if (slabs.length > 0) {
    await db.insert(slabPrices).values(slabs.map((s) => ({ ...s, productId })));
  }
}
async function getSizeChart(productId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(sizeCharts).where(eq(sizeCharts.productId, productId)).limit(1);
  return result[0];
}
async function upsertSizeChart(productId, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getSizeChart(productId);
  if (existing) {
    await db.update(sizeCharts).set(data).where(eq(sizeCharts.productId, productId));
  } else {
    await db.insert(sizeCharts).values({ productId, ...data });
  }
}
async function getActiveShippingZones() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shippingZones).where(eq(shippingZones.isActive, true));
}
async function getAllShippingZones() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shippingZones).orderBy(shippingZones.zoneName);
}
async function createShippingZone(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(shippingZones).values(data);
}
async function updateShippingZone(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(shippingZones).set(data).where(eq(shippingZones.id, id));
}
async function deleteShippingZone(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(shippingZones).where(eq(shippingZones.id, id));
}
async function findShippingZoneForCountry(countryCode) {
  const zones = await getActiveShippingZones();
  for (const zone of zones) {
    try {
      const countries = JSON.parse(zone.countries);
      if (countries.includes(countryCode.toUpperCase())) return zone;
    } catch {
    }
  }
  return null;
}
async function getCartItems(sessionId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
}
async function upsertCartItem(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(cartItems).where(and(
    eq(cartItems.sessionId, data.sessionId),
    eq(cartItems.productId, data.productId),
    data.selectedSize ? eq(cartItems.selectedSize, data.selectedSize) : sql`1=1`
  )).limit(1);
  if (existing.length > 0) {
    await db.update(cartItems).set({ quantity: (existing[0].quantity ?? 1) + (data.quantity ?? 1), updatedAt: /* @__PURE__ */ new Date() }).where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values(data);
  }
}
async function updateCartItemQty(id, quantity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  } else {
    await db.update(cartItems).set({ quantity, updatedAt: /* @__PURE__ */ new Date() }).where(eq(cartItems.id, id));
  }
}
async function removeCartItem(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cartItems).where(eq(cartItems.id, id));
}
async function clearCart(sessionId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
}
async function createOrder(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(orders).values(data);
  const result = await db.select().from(orders).where(eq(orders.orderNumber, data.orderNumber)).limit(1);
  return result[0];
}
async function getOrderByNumber(orderNumber) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result[0];
}
async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}
async function updateOrderStatus(id, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(orders).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(orders.id, id));
}
async function createRfqSubmission(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(rfqSubmissions).values(data);
}
async function getAllRfqSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rfqSubmissions).orderBy(desc(rfqSubmissions.createdAt));
}
async function getRfqById(id) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(rfqSubmissions).where(eq(rfqSubmissions.id, id));
  return rows[0] ?? null;
}
async function updateRfqStatus(id, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(rfqSubmissions).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(rfqSubmissions.id, id));
}
async function getNotesForInquiry(rfqId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inquiryNotes).where(eq(inquiryNotes.rfqId, rfqId)).orderBy(desc(inquiryNotes.createdAt));
}
async function addInquiryNote(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(inquiryNotes).values(data);
}
async function getAllKnowledgeBase(opts) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(knowledgeBase).limit(opts?.limit ?? 10).offset(opts?.offset ?? 0);
}
async function insertSavedTryOnModel(modelData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(savedTryOnModels).values(modelData);
}
async function getSavedTryOnModels(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(savedTryOnModels).orderBy(desc(savedTryOnModels.createdAt)).limit(limit);
}
async function getSavedTryOnModelById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(savedTryOnModels).where(eq(savedTryOnModels.id, id)).limit(1);
  return result[0];
}
async function getProductAutomationSettings() {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(productAutomationSettings).orderBy(desc(productAutomationSettings.id)).limit(1);
  return result[0];
}
async function upsertProductAutomationSettings(data) {
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
async function listProductAutomationSources(limit = 200) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productAutomationSources).orderBy(desc(productAutomationSources.createdAt)).limit(limit);
}
async function getProductAutomationSourceById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(productAutomationSources).where(eq(productAutomationSources.id, id)).limit(1);
  return result[0];
}
async function enqueueProductAutomationSources(urls, defaults) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const normalizedUrls = Array.from(new Set(urls.map((url) => url.trim()).filter(Boolean)));
  if (normalizedUrls.length === 0) {
    return { added: 0, skipped: 0 };
  }
  const existing = await db.select({
    sourceUrl: productAutomationSources.sourceUrl
  }).from(productAutomationSources).where(
    or(...normalizedUrls.map((url) => eq(productAutomationSources.sourceUrl, url)))
  );
  const existingUrls = new Set(existing.map((row) => row.sourceUrl));
  const newItems = normalizedUrls.filter((url) => !existingUrls.has(url)).map((sourceUrl) => ({
    sourceUrl,
    status: "queued",
    categoryId: defaults?.categoryId ?? null,
    subcategoryId: defaults?.subcategoryId ?? null,
    categoryLabel: defaults?.categoryLabel ?? null,
    promptOverride: defaults?.promptOverride ?? null,
    nextAttemptAt: /* @__PURE__ */ new Date()
  }));
  if (newItems.length > 0) {
    await db.insert(productAutomationSources).values(newItems);
  }
  return {
    added: newItems.length,
    skipped: normalizedUrls.length - newItems.length
  };
}
async function updateProductAutomationSource(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(productAutomationSources).set(data).where(eq(productAutomationSources.id, id));
}
async function deleteProductAutomationSource(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(productAutomationSources).where(eq(productAutomationSources.id, id));
}
async function getReadyProductAutomationSources(limit = 1) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productAutomationSources).where(and(
    or(
      eq(productAutomationSources.status, "queued"),
      eq(productAutomationSources.status, "failed")
    ),
    lte(productAutomationSources.nextAttemptAt, /* @__PURE__ */ new Date())
  )).orderBy(productAutomationSources.nextAttemptAt, productAutomationSources.createdAt).limit(limit);
}
async function reserveProductAutomationUsage(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(productAutomationUsage).values(data);
}
async function getReservedProductAutomationUsageSince(since) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({
    total: sql`coalesce(sum(${productAutomationUsage.reservedRequests}), 0)`
  }).from(productAutomationUsage).where(gte(productAutomationUsage.createdAt, since));
  return Number(result[0]?.total ?? 0);
}
async function addKnowledgeBaseEntry(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(knowledgeBase).values(data);
}
async function deleteKnowledgeBaseEntry(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(knowledgeBase).where(eq(knowledgeBase.id, id));
}
async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.publishedAt));
}
async function getBlogPostBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true))).limit(1);
  return result[0];
}
async function getPortfolioItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));
}
async function getFeaturedPortfolioItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioItems).where(eq(portfolioItems.isFeatured, true)).orderBy(desc(portfolioItems.createdAt)).limit(6);
}
async function getFeaturedTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).where(eq(testimonials.featured, true)).orderBy(desc(testimonials.createdAt)).limit(6);
}
async function createContactSubmission(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contactSubmissions).values(data);
}
async function listPortfolioItems(opts) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(portfolioItems).orderBy(portfolioItems.sortOrder, desc(portfolioItems.createdAt));
  return rows.filter((r) => {
    if (opts?.onlyActive && !r.isActive) return false;
    if (opts?.onlyFeatured && !r.isFeatured) return false;
    if (opts?.category && opts.category !== "All" && r.category !== opts.category) return false;
    return true;
  });
}
async function getPortfolioItemWithImages(id) {
  const db = await getDb();
  if (!db) return null;
  const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id)).limit(1);
  if (!item) return null;
  const images = await db.select().from(portfolioImages).where(eq(portfolioImages.portfolioItemId, id)).orderBy(portfolioImages.sortOrder);
  return { ...item, images };
}
async function getPortfolioImagesForItem(itemId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioImages).where(eq(portfolioImages.portfolioItemId, itemId)).orderBy(portfolioImages.sortOrder);
}
async function createPortfolioItem(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(portfolioItems).values(data).$returningId();
  const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, result.id)).limit(1);
  return item;
}
async function updatePortfolioItem(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(portfolioItems).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(portfolioItems.id, id));
}
async function deletePortfolioItem(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(portfolioImages).where(eq(portfolioImages.portfolioItemId, id));
  await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
}
async function addPortfolioImage(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(portfolioImages).values(data).$returningId();
  const [img] = await db.select().from(portfolioImages).where(eq(portfolioImages.id, result.id)).limit(1);
  return img;
}
async function deletePortfolioImage(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(portfolioImages).where(eq(portfolioImages.id, id));
}
async function reorderPortfolioImages(updates) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  for (const u of updates) {
    await db.update(portfolioImages).set({ sortOrder: u.sortOrder }).where(eq(portfolioImages.id, u.id));
  }
}
async function getPortfolioCategories() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ category: portfolioItems.category }).from(portfolioItems).where(eq(portfolioItems.isActive, true));
  return Array.from(new Set(rows.map((r) => r.category).filter(Boolean)));
}
async function createTechPack(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(techPacks).values(data);
  const result = await db.select().from(techPacks).where(eq(techPacks.referenceNumber, data.referenceNumber)).limit(1);
  return result[0];
}
async function getTechPackById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(techPacks).where(eq(techPacks.id, id)).limit(1);
  return result[0];
}
async function getAllTechPacks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(techPacks).orderBy(desc(techPacks.createdAt));
}
async function updateTechPackStatus(id, status, notes) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData = { status, updatedAt: /* @__PURE__ */ new Date() };
  if (notes !== void 0) updateData.adminNotes = notes;
  await db.update(techPacks).set(updateData).where(eq(techPacks.id, id));
}
async function addTechPackImage(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(techPackImages).values(data).$returningId();
  const [img] = await db.select().from(techPackImages).where(eq(techPackImages.id, result.id)).limit(1);
  return img;
}
async function getTechPackImages(techPackId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(techPackImages).where(eq(techPackImages.techPackId, techPackId)).orderBy(techPackImages.sortOrder);
}
async function getAllCategories(opts) {
  const db = await getDb();
  if (!db) return [];
  const conditions = opts?.includeInactive ? void 0 : eq(categories.isActive, true);
  return db.select().from(categories).where(conditions).orderBy(categories.sortOrder, categories.name);
}
async function getCategoryById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0];
}
async function getCategoryBySlug(slug) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}
async function createCategory(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(categories).values(data).$returningId();
  const [category] = await db.select().from(categories).where(eq(categories.id, result.id)).limit(1);
  return category;
}
async function updateCategory(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(categories).set(data).where(eq(categories.id, id));
}
async function deleteCategory(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(categories).where(eq(categories.id, id));
}
async function getSubcategoriesByCategoryId(categoryId, opts) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(subcategories.categoryId, categoryId)];
  if (!opts?.includeInactive) {
    conditions.push(eq(subcategories.isActive, true));
  }
  return db.select().from(subcategories).where(and(...conditions)).orderBy(subcategories.sortOrder, subcategories.name);
}
async function getSubcategoryById(id) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(subcategories).where(eq(subcategories.id, id)).limit(1);
  return result[0];
}
async function createSubcategory(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(subcategories).values(data).$returningId();
  const [subcategory] = await db.select().from(subcategories).where(eq(subcategories.id, result.id)).limit(1);
  return subcategory;
}
async function updateSubcategory(id, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(subcategories).set(data).where(eq(subcategories.id, id));
}
async function deleteSubcategory(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(subcategories).where(eq(subcategories.id, id));
}
async function getCategoriesWithSubcategories(opts) {
  const db = await getDb();
  if (!db) return [];
  const cats = await getAllCategories(opts);
  const result = [];
  for (const cat of cats) {
    const subs = await getSubcategoriesByCategoryId(cat.id, opts);
    result.push({
      ...cat,
      subcategories: subs
    });
  }
  return result;
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// listing-generator/server/gemini.ts
var gemini_exports = {};
__export(gemini_exports, {
  analyzeImageForSeo: () => analyzeImageForSeo,
  analyzeUploadedProductImageBase64: () => analyzeUploadedProductImageBase64,
  chatWithProductAgent: () => chatWithProductAgent,
  generateDesignerGrid: () => generateDesignerGrid,
  generateIndividualView: () => generateIndividualView,
  generateInfographicImageBase64: () => generateInfographicImageBase64,
  generateProductData: () => generateProductData,
  generateProductImageBase64: () => generateProductImageBase64,
  generateTryOnImages: () => generateTryOnImages,
  prefillProductDataFromGrid: () => prefillProductDataFromGrid
});
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
function getClient(apiKey) {
  const key = apiKey || ENV.geminiApiKey;
  if (!key || key === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured. Please set your Gemini API key in the AI Agent settings.");
  }
  if (!_clientCache.has(key)) {
    _clientCache.set(key, new GoogleGenerativeAI(key));
  }
  return _clientCache.get(key);
}
async function chatWithProductAgent(conversationHistory, userMessage, systemPrompt, apiKey, modelId = "gemini-2.5-flash") {
  const client = getClient(apiKey);
  const model = client.getGenerativeModel({
    model: modelId,
    systemInstruction: systemPrompt,
    safetySettings
  });
  const chat = model.startChat({
    history: conversationHistory.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }))
  });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
async function generateProductData(userDescription, brandContext = "Pak Homies Industry, a premium B2B eco-friendly apparel manufacturer from Pakistan", apiKey, modelId = "gemini-3.1-pro-preview") {
  const client = getClient(apiKey);
  const model = client.getGenerativeModel({
    model: modelId,
    safetySettings,
    generationConfig: {
      responseMimeType: "application/json"
    }
  });
  const prompt = `You are an expert B2B apparel product listing consultant. Generate a complete, SEO and GEO-optimized product listing for: "${userDescription}"

Brand context: ${brandContext}

Return a JSON object with exactly these fields:
{
  "title": "Professional product title (under 70 chars)",
  "slug": "url-safe-slug-lowercase-hyphens",
  "category": "One of: Hunting Wear, Sports Wear, Ski Wear, Tech Wear, Streetwear, Martial Arts Wear",
  "shortDescription": "Compelling 1-2 sentence summary for product cards (under 160 chars)",
  "description": "Full detailed 3-5 paragraph product description covering features, materials, customization options, and B2B benefits. Rich and keyword-focused.",
  "manufacturingStory": "Act as a garment engineer and experienced fashion designer. Analyze the item and create a detailed production process guide in an easy-to-understand way. Detail the likely fabrics used, types of embellishments, specific stitching types at different parts of the garment, and types of customizations that can be done. IMPORTANT: Do NOT include conversational intros like 'As a garment engineer...'. Write ONLY the guide itself.",
  "infographicPrompt": "Take your production process guide summary and create a highly detailed image generation prompt (in the style of nano banana pro / midjourney / vector illustration) to visually explain the manufacturing details of this specific garment to a user.",
  "material": "Specific fabric/material description (e.g. '280GSM Ring-Spun Cotton / Polyester Blend')",
  "availableSizes": ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  "availableColors": ["Black", "Navy", "White", "Olive"],
  "samplePrice": "Price as string e.g. '25.00'",
  "weight": "Estimated weight in kg as string e.g. '0.750'",
  "seoTitle": "SEO title under 60 chars, include brand and main keyword",
  "seoDescription": "Meta description 120-155 chars, compelling, include CTA",
  "seoKeywords": "10-15 comma-separated keywords (STRICTLY UNDER 250 CHARS TOTAL) including GEO targets",
  "moqSlabs": [
    { "minQty": 50, "maxQty": 99, "pricePerUnit": "18.00", "label": "Starter" },
    { "minQty": 100, "maxQty": 299, "pricePerUnit": "15.00", "label": "Popular" },
    { "minQty": 300, "maxQty": null, "pricePerUnit": "12.00", "label": "Wholesale" }
  ],
  "imagePrompt": "A detailed prompt to generate a professional product photo of this item, suitable for e-commerce, on a clean background, high quality"
}

Important: Return ONLY valid JSON, no markdown, no explanation.`;
  const result = await model.generateContent(prompt);
  const text2 = result.response.text().trim();
  const jsonText = text2.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
  return JSON.parse(jsonText);
}
async function generateProductImageBase64(imagePrompt, logoBase64, logoMimeType, apiKey, modelId = "gemini-3-pro-image-preview") {
  const client = getClient(apiKey);
  const model = client.getGenerativeModel({ model: modelId });
  const parts = [
    {
      text: `Generate a professional, high-quality e-commerce product photo. ${imagePrompt}. 
      Studio lighting, clean white or dark background, professional photography style, 
      ultra-realistic, 4K quality. The image should look like it belongs on a premium B2B apparel website.
      ${logoBase64 ? "Incorporate the provided logo prominently but tastefully on the garment." : ""}`
    }
  ];
  if (logoBase64 && logoMimeType) {
    parts.push({
      inlineData: {
        mimeType: logoMimeType,
        data: logoBase64
      }
    });
  }
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseModalities: ["image", "text"]
      }
    });
    const response = result.response;
    for (const candidate of response.candidates ?? []) {
      for (const part of candidate.content?.parts ?? []) {
        if (part.inlineData) {
          return {
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType ?? "image/png"
          };
        }
      }
    }
    throw new Error("No image data in Gemini response");
  } catch (err) {
    throw new Error(`Image generation failed: ${String(err)}`);
  }
}
async function generateInfographicImageBase64(prompt, apiKey, modelId = "gemini-3-pro-image-preview") {
  const client = getClient(apiKey);
  const model = client.getGenerativeModel({ model: modelId });
  const parts = [
    {
      text: `Act as a senior graphic designer specializing in detailed production infographics and vector illustrations.
            Use the "nano banana pro" style (ultra-high quality, detailed, visually striking illustrative style) to generate an infographic explanation image based strictly on this prompt: "${prompt}".
            The image should visually explain the garment's fabrics, embellishments, stitching types, and production details as a comprehensive visual guide. 
            Do NOT include long paragraphs of text. Use icons, diagrams, and illustrative callouts.
            CRITICAL LAYOUT INSTRUCTION: The generated image MUST be strictly in a VERTICAL/PORTRAIT aspect ratio (e.g. 2:3 or 3:4 or 9:16) to match standard apparel photography. Do NOT generate a horizontal or square image.
            Background MUST be a solid color (e.g., pure white or slightly off-white). No watermarks. 4K high quality.`
    }
  ];
  let lastError = new Error("Unknown error");
  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseModalities: ["image", "text"]
        }
      });
      const response = result.response;
      for (const candidate of response.candidates ?? []) {
        for (const part of candidate.content?.parts ?? []) {
          if (part.inlineData) {
            return {
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType ?? "image/jpeg"
            };
          }
        }
      }
      throw new Error(`Attempt ${attempt}: No image data in Gemini response`);
    } catch (err) {
      console.error(`[Infographic Gen] Attempt ${attempt} failed:`, err.message);
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }
  throw new Error(`Infographic image generation failed after ${maxRetries} attempts: ${lastError.message}`);
}
async function analyzeImageForSeo(base64, mimeType, apiKey, modelId = "gemini-2.5-flash") {
  const client = getClient(apiKey);
  const model = client.getGenerativeModel({
    model: modelId,
    generationConfig: {
      responseMimeType: "application/json"
    }
  });
  const prompt = `You are an expert SEO and B2B apparel consultant for Pak Homies Industry, a premium Pakistan-based manufacturer.
Analyze this raw image and return a JSON object with strictly these three properties:
1. "filename": A highly SEO-optimized, lowercase, kebab-case filename (ending in .jpg) that describes the apparel item perfectly. Include localized B2B keywords where appropriate (e.g. "wholesale-bjj-kimono-manufacturer-pakistan.jpg"). Keep it under 60 characters if possible.
2. "altText": Highly descriptive Alt Text for blind users and search bots. Describe exactly what the apparel item looks like (e.g. "White pearl weave Brazilian Jiu Jitsu Kimono jacket with custom embroidery on the shoulder").
3. "caption": A short, marketing-focused caption summarizing the product, including GEO keywords (like "Sialkot manufacturer" or "Made in Pakistan").

Important: Return ONLY valid JSON, no markdown, no explanation.`;
  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64
        }
      }
    ]);
    const text2 = result.response.text().trim();
    const jsonText = text2.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    return JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`SEO analysis failed: ${err.message}`);
  }
}
async function analyzeUploadedProductImageBase64(base64, mimeType, brandContext = "Pak Homies Industry, a premium B2B eco-friendly apparel manufacturer from Pakistan", apiKey, modelId = "gemini-3.1-pro-preview") {
  const client = getClient(apiKey);
  const model = client.getGenerativeModel({
    model: modelId,
    safetySettings,
    generationConfig: {
      responseMimeType: "application/json"
    }
  });
  const prompt = `You are an expert B2B apparel product listing consultant. I am providing you with an image of a garment. 
Analyze the uploaded image and generate a complete, SEO and GEO-optimized product listing tailored to this specific item.

Brand context: ${brandContext}

Return a JSON object with exactly these fields based on the visual attributes of the garment:
{
  "title": "Professional product title describing the item (under 70 chars)",
  "slug": "url-safe-slug-lowercase-hyphens",
  "category": "One of: Hunting Wear, Sports Wear, Ski Wear, Tech Wear, Streetwear, Martial Arts Wear",
  "shortDescription": "Compelling 1-2 sentence summary covering its visible style/features (under 160 chars)",
  "description": "Full detailed 3-5 paragraph product description covering visible features, likely materials, customization options, and B2B wholesale benefits. Rich and keyword-focused.",
  "manufacturingStory": "Act as a garment engineer and experienced fashion designer. Analyze the uploaded images carefully to get an idea of the physical construction. Create a detailed production process guide in an easy-to-understand way. Detail the likely fabrics used, types of embellishments on the product, specific stitching types used at different parts of the garment, and types of customizations that can be done. IMPORTANT: Focus ONLY on the primary garment being sold (e.g. if it's a pants listing, ignore the model's shirt/rashguard). Do NOT include conversational intros like 'As a garment engineer...'. Write ONLY the guide itself.",
  "infographicPrompt": "Take your production process guide summary and create a highly detailed image generation prompt (in the style of nano banana pro / midjourney / vector illustration) to visually explain the manufacturing details and construction of this specific garment to a user in an infographic style. CRITICAL: Your prompt MUST focus ONLY on the primary garment. If the model is wearing irrelevant items (e.g. a rashguard when the product is pants), DO NOT include them in this prompt.",
  "material": "Specific fabric/material description that matches the look (e.g. 'Heavyweight Cotton Blend')",
  "availableSizes": ["S", "M", "L", "XL", "2XL"],
  "availableColors": ["Black", "Navy", "Gray", "Custom"],
  "samplePrice": "Reasonable sample price as a string e.g. '35.00'",
  "weight": "Estimated weight in kg as a string based on garment type (e.g. '0.450')",
  "seoTitle": "SEO title under 60 chars, include brand and main keyword",
  "seoDescription": "Meta description 120-155 chars, compelling, include CTA",
  "seoKeywords": "10-15 comma-separated keywords (STRICTLY UNDER 250 CHARS TOTAL) including GEO targets like Pakistan wholesale",
  "moqSlabs": [
    { "minQty": 50, "maxQty": 99, "pricePerUnit": "18.00", "label": "Starter" },
    { "minQty": 100, "maxQty": 299, "pricePerUnit": "15.00", "label": "Popular" },
    { "minQty": 300, "maxQty": null, "pricePerUnit": "12.00", "label": "Wholesale" }
  ],
  "imagePrompt": "Leave empty"
}

Important: Return ONLY valid JSON matching the exact structure above, no markdown, no explanation.`;
  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType,
        data: base64
      }
    }
  ]);
  const text2 = result.response.text().trim();
  const jsonText = text2.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
  return JSON.parse(jsonText);
}
async function generateDesignerGrid(prompt, apiKey, modelId = "gemini-3-pro-image-preview") {
  const client = getClient(apiKey);
  const model = client.getGenerativeModel({ model: modelId });
  const parts = [
    {
      text: `Act as a senior high-end fashion designer and professional photographer.
Generate a complete multi-view fashion photography grid of a single apparel item: ${prompt}. 
The image MUST be a 2x2 or composite grid showing strictly these 4 DISTINCT views:
1. Full Front View (facing forward)
2. Full Back View (facing away)
3. Full Left Profile View (the clothing item is seen from its left side, facing left)
4. Full Right Profile View (the clothing item is seen from its right side, facing right)
CRITICAL: The Left Profile and Right Profile MUST be different. They are the two opposite sides of the garment. Ensure the orientation is correct. NO DUPLICATE VIEWS.
Studio lighting, clean solid background, ultra-realistic 4K quality, premium B2B catalog style. DO NOT include text in the image.`
    }
  ];
  let lastError = new Error("Unknown error");
  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseModalities: ["image", "text"]
        }
      });
      const response = result.response;
      for (const candidate of response.candidates ?? []) {
        for (const part of candidate.content?.parts ?? []) {
          if (part.inlineData) {
            return {
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType ?? "image/jpeg"
            };
          }
        }
      }
      throw new Error(`Attempt ${attempt}: No image data in Gemini response`);
    } catch (err) {
      console.error(`[Grid Gen] Attempt ${attempt} failed:`, err.message);
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }
  throw new Error(`Grid image generation failed after ${maxRetries} attempts: ${lastError.message}`);
}
async function generateIndividualView(basePrompt, viewType, apiKey, modelId = "gemini-3-pro-image-preview", referenceImage) {
  const client = getClient(apiKey);
  const model = client.getGenerativeModel({ model: modelId });
  const parts = [];
  if (referenceImage) {
    parts.push({
      inlineData: {
        data: referenceImage.base64,
        mimeType: referenceImage.mimeType
      }
    });
  }
  parts.push({
    text: `Act as a senior high-end fashion designer and professional photographer.
Generate a high-resolution, professional studio photography quality image of the EXACT APPAREL shown in the reference image, but focused ONLY on the ${viewType} view. 

Product Description: ${basePrompt}
View Needed: ${viewType}

STRICT INSTRUCTIONS:
1. The design (colors, patterns, materials, construction) MUST MATCH the reference image perfectly.
2. If the view is "left-side", show the item from its left side (facing left). 
3. If the view is "right-side", show the item from its right side (facing right).
4. The background MUST be solid white.
5. No watermarks or text. High-end 4K commercial lighting.
6. CRITICAL: Generate EXACTLY ONE person/mannequin/item in the image. DO NOT generate multiple angles, split screens, reflections, or front-and-back views together. ONLY show the single requested view.`
  });
  let lastError = new Error("Unknown error");
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseModalities: ["image", "text"]
        }
      });
      const response = result.response;
      for (const candidate of response.candidates ?? []) {
        for (const part of candidate.content?.parts ?? []) {
          if (part.inlineData) {
            return {
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType ?? "image/jpeg"
            };
          }
        }
      }
      throw new Error(`Attempt ${attempt}: No image data in Gemini response (model likely returned text/apology)`);
    } catch (err) {
      console.error(`[Individual View Gen] Attempt ${attempt} failed for ${viewType}:`, err.message);
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }
  throw new Error(`Individual view generation failed for ${viewType} after ${maxRetries} attempts: ${lastError.message}`);
}
async function generateTryOnImages(prompt, modelImage, referenceImages, logoImage, category, apiKey, modelId = "gemini-3-pro-image-preview") {
  const client = getClient(apiKey);
  const model = client.getGenerativeModel({ model: modelId });
  const sharedParts = [];
  sharedParts.push({
    text: "BASE MODEL IMAGE (The person/mannequin to dress):"
  });
  sharedParts.push({
    inlineData: { data: modelImage.base64, mimeType: modelImage.mimeType }
  });
  sharedParts.push({
    text: "REFERENCE PRODUCT IMAGES (The garment to extract and apply):"
  });
  referenceImages.forEach((img) => {
    sharedParts.push({
      inlineData: { data: img.base64, mimeType: img.mimeType }
    });
  });
  if (logoImage) {
    sharedParts.push({
      text: "LOGO TO APPLY TO GARMENT:"
    });
    sharedParts.push({
      inlineData: { data: logoImage.base64, mimeType: logoImage.mimeType }
    });
  }
  const views = [
    { name: "Front View", instruction: "Solid light background. Full-body shot (head to toe). Model facing perfectly forward in a confident, professional luxury-brand pose." },
    { name: "Right Side View", instruction: "Solid light background. Full-body shot (head to toe). Model turned showing their right side in a confident, professional luxury-brand pose." },
    { name: "Back View", instruction: "Solid light background. Full-body shot (head to toe). Model facing away from the camera, showing the back of the garment in a confident, professional luxury-brand pose." },
    { name: "Closeup Collage", instruction: "Solid light background. A 4x4 grid closeup collage showing fabric textures, stitching, and different zoomed-in parts of the garment only." },
    { name: "Lifestyle Photoshoot", instruction: `Dynamic full-body lifestyle photoshoot in a relevant environment based on the garment category: ${category || "outdoors"}. Do NOT use a solid background for this one, integrate them into a real scene with a confident, professional luxury-brand pose.` }
  ];
  const generateSingleView = async (view) => {
    const parts = [...sharedParts];
    const instructions = `Act as an elite high-end fashion retoucher and professional AI photographer.
Your task is to perform a photorealistic "Virtual Try-On" for exactly this view: ${view.name}.

USER INSTRUCTIONS: ${prompt}
VIEW SPECIFIC INSTRUCTIONS: ${view.instruction}

STRICT REQUIREMENTS:
1. Extract the garment exactly as shown in the REFERENCE PRODUCT IMAGES (matching color, fabric, cut, and details).
2. Dress the subject shown in the BASE MODEL IMAGE in this garment.
   CRITICAL CLOTHING RULE: If the reference product is ONLY pants/bottoms, you MUST give the model a generic, plain matching top (like a black tee). Do NOT copy their original top (e.g., a rashguard). If the reference is ONLY a top, give them generic bottoms. Never let the model's original clothing interfere with the overall outfit look.
3. PRESERVE the model's exact face, skin tone, and body type perfectly, BUT apply a premium commercial grade beauty filter: ensure the skin tone is even without blemishes and reduce oily skin. Keep the facial expression perfectly consistent with the original base model image. do NOT add smiles or artificial facial changes.
4. ADAPT the model's pose into a confident, professional luxury-brand fashion stance appropriate for the view. Do NOT force them to keep a stiff, awkward, or amateur original pose.
${view.name === "Lifestyle Photoshoot" ? "5. Place the model in a realistic, high-end lifestyle environment." : "5. Use a clean, professional solid light background."}
${logoImage ? "6. Apply the provided LOGO prominently and naturally onto the garment (e.g., left chest, center chest, or where instructed)." : "6. Do not add any random logos or text."}
7. The final image must be ultra-realistic, photorealistic, **maximized 2K/4K resolution (highest possible detail)**, with natural shadows and lighting blending the garment onto the model. Let the garment drape naturally based on the model's pose.
8. Return EXACTLY one stunning high-definition image.`;
    parts.push({ text: instructions });
    let lastError = new Error("Unknown error");
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig: {
            responseModalities: ["image", "text"]
          }
        });
        const response = result.response;
        for (const candidate of response.candidates ?? []) {
          for (const part of candidate.content?.parts ?? []) {
            if (part.inlineData) {
              return {
                view: view.name,
                base64: part.inlineData.data,
                mimeType: part.inlineData.mimeType ?? "image/jpeg"
              };
            }
          }
        }
        throw new Error(`Attempt ${attempt}: No image data in Gemini response`);
      } catch (err) {
        console.error(`[Grid Gen] Attempt ${attempt} failed for ${view.name}:`, err.message);
        lastError = err;
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 2e3));
        }
      }
    }
    throw new Error(`Virtual Try-On generation failed for ${view.name} after ${maxRetries} attempts: ${lastError.message}`);
  };
  const results = await Promise.all(views.map((view) => generateSingleView(view)));
  return results;
}
async function prefillProductDataFromGrid(imagePrompt, base64, mimeType, apiKey, modelId = "gemini-2.5-flash") {
  const client = getClient(apiKey);
  const model = client.getGenerativeModel({
    model: modelId,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7
    }
  });
  const prompt = `Act as an elite SEO Expert and E-commerce Manager for Pak Homies Industry (a premium B2B custom apparel manufacturer in Pakistan).
I am providing you the original design prompt ("${imagePrompt}") and the generated multi-view design grid image.
Generate a complete, highly-optimized product listing based on this apparel item.
Return ONLY valid JSON matching this exact structure:
{
  "title": "A highly descriptive, SEO-optimized product title (e.g. 'Premium Custom BJJ Kimono - Wholesale')",
  "category": "The most appropriate category (e.g. 'Martial Arts', 'Activewear', 'Outerwear')",
  "description": "A long, persuasive description focusing on material quality, B2B wholesale benefits, customization options, and premium feel.",
  "manufacturingStory": "A professional 2-3 paragraph SEO/GEO narrative detailing the artisanal manufacturing process, stitching, fabrics, and embellishments based on the design.",
  "infographicPrompt": "A detailed DALL-E/Midjourney style prompt to clearly illustrate the manufacturing process described in the story as a clean, illustrative vector-style infographic on a solid background.",
  "shortDescription": "A 1-2 sentence quick summary for catalog views.",
  "seoTitle": "Optimal title for Google Search (under 60 chars)",
  "seoDescription": "Meta description for Google (under 160 chars)",
  "seoKeywords": "Comma-separated SEO/GEO keywords (e.g. 'custom jiu jitsu gi, bjj gear bulk, pakistan manufacturer, sialkot custom apparel')",
  "material": "Estimated premium material composition based on the image (e.g. '450gsm Pearl Weave Cotton')",
  "samplePrice": "Estimated expensive sample price (e.g. '85.00')",
  "weight": "Estimated weight in kg (e.g. '1.500')",
  "availableSizes": "JSON array of sizes like [\\"S\\", \\"M\\", \\"L\\", \\"XL\\"]",
  "availableColors": "JSON array of 2-3 most likely requested colors",
  "slabs": [
    { "minQty": 50, "pricePerUnit": "45.00", "label": "Starter Tier" },
    { "minQty": 100, "pricePerUnit": "40.00", "label": "Popular" },
    { "minQty": 500, "pricePerUnit": "35.00", "label": "Wholesale Leader" }
  ]
}`;
  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64
        }
      }
    ]);
    const text2 = result.response.text().trim();
    const jsonText = text2.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    return JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`Data prefill failed: ${String(err)}`);
  }
}
var _clientCache, safetySettings;
var init_gemini = __esm({
  "listing-generator/server/gemini.ts"() {
    "use strict";
    init_env();
    _clientCache = /* @__PURE__ */ new Map();
    safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
    ];
  }
});

// server/ai/gemini.ts
var gemini_exports2 = {};
__export(gemini_exports2, {
  analyzeImageForSeo: () => analyzeImageForSeo2,
  analyzeUploadedProductImageBase64: () => analyzeUploadedProductImageBase642,
  chatWithProductAgent: () => chatWithProductAgent2,
  generateDesignerGrid: () => generateDesignerGrid2,
  generateIndividualView: () => generateIndividualView2,
  generateInfographicImageBase64: () => generateInfographicImageBase642,
  generateProductData: () => generateProductData2,
  generateProductImageBase64: () => generateProductImageBase642,
  generateTryOnImages: () => generateTryOnImages2,
  prefillProductDataFromGrid: () => prefillProductDataFromGrid2
});
import { GoogleGenerativeAI as GoogleGenerativeAI2, HarmCategory as HarmCategory2, HarmBlockThreshold as HarmBlockThreshold2 } from "@google/generative-ai";
function getClient2(apiKey) {
  const key = apiKey || ENV.geminiApiKey;
  if (!key || key === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured. Please set your Gemini API key in the AI Agent settings.");
  }
  if (!_clientCache2.has(key)) {
    _clientCache2.set(key, new GoogleGenerativeAI2(key));
  }
  return _clientCache2.get(key);
}
async function chatWithProductAgent2(conversationHistory, userMessage, systemPrompt, apiKey, modelId = "gemini-2.5-flash") {
  const client = getClient2(apiKey);
  const model = client.getGenerativeModel({
    model: modelId,
    systemInstruction: systemPrompt,
    safetySettings: safetySettings2
  });
  const chat = model.startChat({
    history: conversationHistory.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }))
  });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
async function generateProductData2(userDescription, brandContext = "Pak Homies Industry, a premium B2B eco-friendly apparel manufacturer from Pakistan", apiKey, modelId = "gemini-3.1-pro-preview") {
  const client = getClient2(apiKey);
  const model = client.getGenerativeModel({
    model: modelId,
    safetySettings: safetySettings2,
    generationConfig: {
      responseMimeType: "application/json"
    }
  });
  const prompt = `You are an expert B2B apparel product listing consultant. Generate a complete, SEO and GEO-optimized product listing for: "${userDescription}"

Brand context: ${brandContext}

Return a JSON object with exactly these fields:
{
  "title": "Professional product title (under 70 chars)",
  "slug": "url-safe-slug-lowercase-hyphens",
  "category": "One of: Hunting Wear, Sports Wear, Ski Wear, Tech Wear, Streetwear, Martial Arts Wear",
  "shortDescription": "Compelling 1-2 sentence summary for product cards (under 160 chars)",
  "description": "Full detailed 3-5 paragraph product description covering features, materials, customization options, and B2B benefits. Rich and keyword-focused.",
  "manufacturingStory": "Act as a garment engineer and experienced fashion designer. Analyze the item and create a detailed production process guide in an easy-to-understand way. Detail the likely fabrics used, types of embellishments, specific stitching types at different parts of the garment, and types of customizations that can be done. IMPORTANT: Do NOT include conversational intros like 'As a garment engineer...'. Write ONLY the guide itself.",
  "infographicPrompt": "Take your production process guide summary and create a highly detailed image generation prompt (in the style of nano banana pro / midjourney / vector illustration) to visually explain the manufacturing details of this specific garment to a user.",
  "material": "Specific fabric/material description (e.g. '280GSM Ring-Spun Cotton / Polyester Blend')",
  "availableSizes": ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  "availableColors": ["Black", "Navy", "White", "Olive"],
  "samplePrice": "Price as string e.g. '25.00'",
  "weight": "Estimated weight in kg as string e.g. '0.750'",
  "seoTitle": "SEO title under 60 chars, include brand and main keyword",
  "seoDescription": "Meta description 120-155 chars, compelling, include CTA",
  "seoKeywords": "10-15 comma-separated keywords (STRICTLY UNDER 250 CHARS TOTAL) including GEO targets",
  "moqSlabs": [
    { "minQty": 50, "maxQty": 99, "pricePerUnit": "18.00", "label": "Starter" },
    { "minQty": 100, "maxQty": 299, "pricePerUnit": "15.00", "label": "Popular" },
    { "minQty": 300, "maxQty": null, "pricePerUnit": "12.00", "label": "Wholesale" }
  ],
  "imagePrompt": "A detailed prompt to generate a professional product photo of this item, suitable for e-commerce, on a clean background, high quality"
}

Important: Return ONLY valid JSON, no markdown, no explanation.`;
  const result = await model.generateContent(prompt);
  const text2 = result.response.text().trim();
  const jsonText = text2.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
  return JSON.parse(jsonText);
}
async function generateProductImageBase642(imagePrompt, logoBase64, logoMimeType, apiKey, modelId = "gemini-3-pro-image-preview") {
  const client = getClient2(apiKey);
  const model = client.getGenerativeModel({ model: modelId });
  const parts = [
    {
      text: `Generate a professional, high-quality e-commerce product photo. ${imagePrompt}. 
      Studio lighting, clean white or dark background, professional photography style, 
      ultra-realistic, 4K quality. The image should look like it belongs on a premium B2B apparel website.
      ${logoBase64 ? "Incorporate the provided logo prominently but tastefully on the garment." : ""}`
    }
  ];
  if (logoBase64 && logoMimeType) {
    parts.push({
      inlineData: {
        mimeType: logoMimeType,
        data: logoBase64
      }
    });
  }
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseModalities: ["image", "text"]
      }
    });
    const response = result.response;
    for (const candidate of response.candidates ?? []) {
      for (const part of candidate.content?.parts ?? []) {
        if (part.inlineData) {
          return {
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType ?? "image/png"
          };
        }
      }
    }
    throw new Error("No image data in Gemini response");
  } catch (err) {
    throw new Error(`Image generation failed: ${String(err)}`);
  }
}
async function generateInfographicImageBase642(prompt, apiKey, modelId = "gemini-3-pro-image-preview") {
  const client = getClient2(apiKey);
  const model = client.getGenerativeModel({ model: modelId });
  const parts = [
    {
      text: `Act as a senior graphic designer specializing in detailed production infographics and vector illustrations.
            Use the "nano banana pro" style (ultra-high quality, detailed, visually striking illustrative style) to generate an infographic explanation image based strictly on this prompt: "${prompt}".
            The image should visually explain the garment's fabrics, embellishments, stitching types, and production details as a comprehensive visual guide. 
            Do NOT include long paragraphs of text. Use icons, diagrams, and illustrative callouts.
            CRITICAL LAYOUT INSTRUCTION: The generated image MUST be strictly in a VERTICAL/PORTRAIT aspect ratio (e.g. 2:3 or 3:4 or 9:16) to match standard apparel photography. Do NOT generate a horizontal or square image.
            Background MUST be a solid color (e.g., pure white or slightly off-white). No watermarks. 4K high quality.`
    }
  ];
  let lastError = new Error("Unknown error");
  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseModalities: ["image", "text"]
        }
      });
      const response = result.response;
      for (const candidate of response.candidates ?? []) {
        for (const part of candidate.content?.parts ?? []) {
          if (part.inlineData) {
            return {
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType ?? "image/jpeg"
            };
          }
        }
      }
      throw new Error(`Attempt ${attempt}: No image data in Gemini response`);
    } catch (err) {
      console.error(`[Infographic Gen] Attempt ${attempt} failed:`, err.message);
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }
  throw new Error(`Infographic image generation failed after ${maxRetries} attempts: ${lastError.message}`);
}
async function analyzeImageForSeo2(base64, mimeType, apiKey, modelId = "gemini-2.5-flash") {
  const client = getClient2(apiKey);
  const model = client.getGenerativeModel({
    model: modelId,
    generationConfig: {
      responseMimeType: "application/json"
    }
  });
  const prompt = `You are an expert SEO and B2B apparel consultant for Pak Homies Industry, a premium Pakistan-based manufacturer.
Analyze this raw image and return a JSON object with strictly these three properties:
1. "filename": A highly SEO-optimized, lowercase, kebab-case filename (ending in .jpg) that describes the apparel item perfectly. Include localized B2B keywords where appropriate (e.g. "wholesale-bjj-kimono-manufacturer-pakistan.jpg"). Keep it under 60 characters if possible.
2. "altText": Highly descriptive Alt Text for blind users and search bots. Describe exactly what the apparel item looks like (e.g. "White pearl weave Brazilian Jiu Jitsu Kimono jacket with custom embroidery on the shoulder").
3. "caption": A short, marketing-focused caption summarizing the product, including GEO keywords (like "Sialkot manufacturer" or "Made in Pakistan").

Important: Return ONLY valid JSON, no markdown, no explanation.`;
  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64
        }
      }
    ]);
    const text2 = result.response.text().trim();
    const jsonText = text2.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    return JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`SEO analysis failed: ${err.message}`);
  }
}
async function analyzeUploadedProductImageBase642(base64, mimeType, brandContext = "Pak Homies Industry, a premium B2B eco-friendly apparel manufacturer from Pakistan", apiKey, modelId = "gemini-3.1-pro-preview") {
  const client = getClient2(apiKey);
  const model = client.getGenerativeModel({
    model: modelId,
    safetySettings: safetySettings2,
    generationConfig: {
      responseMimeType: "application/json"
    }
  });
  const prompt = `You are an expert B2B apparel product listing consultant. I am providing you with an image of a garment. 
Analyze the uploaded image and generate a complete, SEO and GEO-optimized product listing tailored to this specific item.

Brand context: ${brandContext}

Return a JSON object with exactly these fields based on the visual attributes of the garment:
{
  "title": "Professional product title describing the item (under 70 chars)",
  "slug": "url-safe-slug-lowercase-hyphens",
  "category": "One of: Hunting Wear, Sports Wear, Ski Wear, Tech Wear, Streetwear, Martial Arts Wear",
  "shortDescription": "Compelling 1-2 sentence summary covering its visible style/features (under 160 chars)",
  "description": "Full detailed 3-5 paragraph product description covering visible features, likely materials, customization options, and B2B wholesale benefits. Rich and keyword-focused.",
  "manufacturingStory": "Act as a garment engineer and experienced fashion designer. Analyze the uploaded images carefully to get an idea of the physical construction. Create a detailed production process guide in an easy-to-understand way. Detail the likely fabrics used, types of embellishments on the product, specific stitching types used at different parts of the garment, and types of customizations that can be done. IMPORTANT: Focus ONLY on the primary garment being sold (e.g. if it's a pants listing, ignore the model's shirt/rashguard). Do NOT include conversational intros like 'As a garment engineer...'. Write ONLY the guide itself.",
  "infographicPrompt": "Take your production process guide summary and create a highly detailed image generation prompt (in the style of nano banana pro / midjourney / vector illustration) to visually explain the manufacturing details and construction of this specific garment to a user in an infographic style. CRITICAL: Your prompt MUST focus ONLY on the primary garment. If the model is wearing irrelevant items (e.g. a rashguard when the product is pants), DO NOT include them in this prompt.",
  "material": "Specific fabric/material description that matches the look (e.g. 'Heavyweight Cotton Blend')",
  "availableSizes": ["S", "M", "L", "XL", "2XL"],
  "availableColors": ["Black", "Navy", "Gray", "Custom"],
  "samplePrice": "Reasonable sample price as a string e.g. '35.00'",
  "weight": "Estimated weight in kg as a string based on garment type (e.g. '0.450')",
  "seoTitle": "SEO title under 60 chars, include brand and main keyword",
  "seoDescription": "Meta description 120-155 chars, compelling, include CTA",
  "seoKeywords": "10-15 comma-separated keywords (STRICTLY UNDER 250 CHARS TOTAL) including GEO targets like Pakistan wholesale",
  "moqSlabs": [
    { "minQty": 50, "maxQty": 99, "pricePerUnit": "18.00", "label": "Starter" },
    { "minQty": 100, "maxQty": 299, "pricePerUnit": "15.00", "label": "Popular" },
    { "minQty": 300, "maxQty": null, "pricePerUnit": "12.00", "label": "Wholesale" }
  ],
  "imagePrompt": "Leave empty"
}

Important: Return ONLY valid JSON matching the exact structure above, no markdown, no explanation.`;
  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType,
        data: base64
      }
    }
  ]);
  const text2 = result.response.text().trim();
  const jsonText = text2.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
  return JSON.parse(jsonText);
}
async function generateDesignerGrid2(prompt, apiKey, modelId = "gemini-3-pro-image-preview") {
  const client = getClient2(apiKey);
  const model = client.getGenerativeModel({ model: modelId });
  const parts = [
    {
      text: `Act as a senior high-end fashion designer and professional photographer.
Generate a complete multi-view fashion photography grid of a single apparel item: ${prompt}. 
The image MUST be a 2x2 or composite grid showing strictly these 4 DISTINCT views:
1. Full Front View (facing forward)
2. Full Back View (facing away)
3. Full Left Profile View (the clothing item is seen from its left side, facing left)
4. Full Right Profile View (the clothing item is seen from its right side, facing right)
CRITICAL: The Left Profile and Right Profile MUST be different. They are the two opposite sides of the garment. Ensure the orientation is correct. NO DUPLICATE VIEWS.
Studio lighting, clean solid background, ultra-realistic 4K quality, premium B2B catalog style. DO NOT include text in the image.`
    }
  ];
  let lastError = new Error("Unknown error");
  const maxRetries = 2;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseModalities: ["image", "text"]
        }
      });
      const response = result.response;
      for (const candidate of response.candidates ?? []) {
        for (const part of candidate.content?.parts ?? []) {
          if (part.inlineData) {
            return {
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType ?? "image/jpeg"
            };
          }
        }
      }
      throw new Error(`Attempt ${attempt}: No image data in Gemini response`);
    } catch (err) {
      console.error(`[Grid Gen] Attempt ${attempt} failed:`, err.message);
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }
  throw new Error(`Grid image generation failed after ${maxRetries} attempts: ${lastError.message}`);
}
async function generateIndividualView2(basePrompt, viewType, apiKey, modelId = "gemini-3-pro-image-preview", referenceImage) {
  const client = getClient2(apiKey);
  const model = client.getGenerativeModel({ model: modelId });
  const parts = [];
  if (referenceImage) {
    parts.push({
      inlineData: {
        data: referenceImage.base64,
        mimeType: referenceImage.mimeType
      }
    });
  }
  parts.push({
    text: `Act as a senior high-end fashion designer and professional photographer.
Generate a high-resolution, professional studio photography quality image of the EXACT APPAREL shown in the reference image, but focused ONLY on the ${viewType} view. 

Product Description: ${basePrompt}
View Needed: ${viewType}

STRICT INSTRUCTIONS:
1. The design (colors, patterns, materials, construction) MUST MATCH the reference image perfectly.
2. If the view is "left-side", show the item from its left side (facing left). 
3. If the view is "right-side", show the item from its right side (facing right).
4. The background MUST be solid white.
5. No watermarks or text. High-end 4K commercial lighting.
6. CRITICAL: Generate EXACTLY ONE person/mannequin/item in the image. DO NOT generate multiple angles, split screens, reflections, or front-and-back views together. ONLY show the single requested view.`
  });
  let lastError = new Error("Unknown error");
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseModalities: ["image", "text"]
        }
      });
      const response = result.response;
      for (const candidate of response.candidates ?? []) {
        for (const part of candidate.content?.parts ?? []) {
          if (part.inlineData) {
            return {
              base64: part.inlineData.data,
              mimeType: part.inlineData.mimeType ?? "image/jpeg"
            };
          }
        }
      }
      throw new Error(`Attempt ${attempt}: No image data in Gemini response (model likely returned text/apology)`);
    } catch (err) {
      console.error(`[Individual View Gen] Attempt ${attempt} failed for ${viewType}:`, err.message);
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }
  throw new Error(`Individual view generation failed for ${viewType} after ${maxRetries} attempts: ${lastError.message}`);
}
async function generateTryOnImages2(prompt, modelImage, referenceImages, logoImage, category, apiKey, modelId = "gemini-3-pro-image-preview") {
  const client = getClient2(apiKey);
  const model = client.getGenerativeModel({ model: modelId });
  const sharedParts = [];
  sharedParts.push({
    text: "BASE MODEL IMAGE (The person/mannequin to dress):"
  });
  sharedParts.push({
    inlineData: { data: modelImage.base64, mimeType: modelImage.mimeType }
  });
  sharedParts.push({
    text: "REFERENCE PRODUCT IMAGES (The garment to extract and apply):"
  });
  referenceImages.forEach((img) => {
    sharedParts.push({
      inlineData: { data: img.base64, mimeType: img.mimeType }
    });
  });
  if (logoImage) {
    sharedParts.push({
      text: "LOGO TO APPLY TO GARMENT:"
    });
    sharedParts.push({
      inlineData: { data: logoImage.base64, mimeType: logoImage.mimeType }
    });
  }
  const views = [
    { name: "Front View", instruction: "Solid light background. Full-body shot (head to toe). Model facing perfectly forward in a confident, professional luxury-brand pose." },
    { name: "Right Side View", instruction: "Solid light background. Full-body shot (head to toe). Model turned showing their right side in a confident, professional luxury-brand pose." },
    { name: "Back View", instruction: "Solid light background. Full-body shot (head to toe). Model facing away from the camera, showing the back of the garment in a confident, professional luxury-brand pose." },
    { name: "Closeup Collage", instruction: "Solid light background. A 4x4 grid closeup collage showing fabric textures, stitching, and different zoomed-in parts of the garment only." },
    { name: "Lifestyle Photoshoot", instruction: `Dynamic full-body lifestyle photoshoot in a relevant environment based on the garment category: ${category || "outdoors"}. Do NOT use a solid background for this one, integrate them into a real scene with a confident, professional luxury-brand pose.` }
  ];
  const generateSingleView = async (view) => {
    const parts = [...sharedParts];
    const instructions = `Act as an elite high-end fashion retoucher and professional AI photographer.
Your task is to perform a photorealistic "Virtual Try-On" for exactly this view: ${view.name}.

USER INSTRUCTIONS: ${prompt}
VIEW SPECIFIC INSTRUCTIONS: ${view.instruction}

STRICT REQUIREMENTS:
1. Extract the garment exactly as shown in the REFERENCE PRODUCT IMAGES (matching color, fabric, cut, and details).
2. Dress the subject shown in the BASE MODEL IMAGE in this garment.
   CRITICAL CLOTHING RULE: If the reference product is ONLY pants/bottoms, you MUST give the model a generic, plain matching top (like a black tee). Do NOT copy their original top (e.g., a rashguard). If the reference is ONLY a top, give them generic bottoms. Never let the model's original clothing interfere with the overall outfit look.
3. PRESERVE the model's exact face, skin tone, and body type perfectly, BUT apply a premium commercial grade beauty filter: ensure the skin tone is even without blemishes and reduce oily skin. Keep the facial expression perfectly consistent with the original base model image. do NOT add smiles or artificial facial changes.
4. ADAPT the model's pose into a confident, professional luxury-brand fashion stance appropriate for the view. Do NOT force them to keep a stiff, awkward, or amateur original pose.
${view.name === "Lifestyle Photoshoot" ? "5. Place the model in a realistic, high-end lifestyle environment." : "5. Use a clean, professional solid light background."}
${logoImage ? "6. Apply the provided LOGO prominently and naturally onto the garment (e.g., left chest, center chest, or where instructed)." : "6. Do not add any random logos or text."}
7. The final image must be ultra-realistic, photorealistic, **maximized 2K/4K resolution (highest possible detail)**, with natural shadows and lighting blending the garment onto the model. Let the garment drape naturally based on the model's pose.
8. Return EXACTLY one stunning high-definition image.`;
    parts.push({ text: instructions });
    let lastError = new Error("Unknown error");
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig: {
            responseModalities: ["image", "text"]
          }
        });
        const response = result.response;
        for (const candidate of response.candidates ?? []) {
          for (const part of candidate.content?.parts ?? []) {
            if (part.inlineData) {
              return {
                view: view.name,
                base64: part.inlineData.data,
                mimeType: part.inlineData.mimeType ?? "image/jpeg"
              };
            }
          }
        }
        throw new Error(`Attempt ${attempt}: No image data in Gemini response`);
      } catch (err) {
        console.error(`[Grid Gen] Attempt ${attempt} failed for ${view.name}:`, err.message);
        lastError = err;
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 2e3));
        }
      }
    }
    throw new Error(`Virtual Try-On generation failed for ${view.name} after ${maxRetries} attempts: ${lastError.message}`);
  };
  const results = await Promise.all(views.map((view) => generateSingleView(view)));
  return results;
}
async function prefillProductDataFromGrid2(imagePrompt, base64, mimeType, apiKey, modelId = "gemini-2.5-flash") {
  const client = getClient2(apiKey);
  const model = client.getGenerativeModel({
    model: modelId,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7
    }
  });
  const prompt = `Act as an elite SEO Expert and E-commerce Manager for Pak Homies Industry (a premium B2B custom apparel manufacturer in Pakistan).
I am providing you the original design prompt ("${imagePrompt}") and the generated multi-view design grid image.
Generate a complete, highly-optimized product listing based on this apparel item.
Return ONLY valid JSON matching this exact structure:
{
  "title": "A highly descriptive, SEO-optimized product title (e.g. 'Premium Custom BJJ Kimono - Wholesale')",
  "category": "The most appropriate category (e.g. 'Martial Arts', 'Activewear', 'Outerwear')",
  "description": "A long, persuasive description focusing on material quality, B2B wholesale benefits, customization options, and premium feel.",
  "manufacturingStory": "A professional 2-3 paragraph SEO/GEO narrative detailing the artisanal manufacturing process, stitching, fabrics, and embellishments based on the design.",
  "infographicPrompt": "A detailed DALL-E/Midjourney style prompt to clearly illustrate the manufacturing process described in the story as a clean, illustrative vector-style infographic on a solid background.",
  "shortDescription": "A 1-2 sentence quick summary for catalog views.",
  "seoTitle": "Optimal title for Google Search (under 60 chars)",
  "seoDescription": "Meta description for Google (under 160 chars)",
  "seoKeywords": "Comma-separated SEO/GEO keywords (e.g. 'custom jiu jitsu gi, bjj gear bulk, pakistan manufacturer, sialkot custom apparel')",
  "material": "Estimated premium material composition based on the image (e.g. '450gsm Pearl Weave Cotton')",
  "samplePrice": "Estimated expensive sample price (e.g. '85.00')",
  "weight": "Estimated weight in kg (e.g. '1.500')",
  "availableSizes": "JSON array of sizes like [\\"S\\", \\"M\\", \\"L\\", \\"XL\\"]",
  "availableColors": "JSON array of 2-3 most likely requested colors",
  "slabs": [
    { "minQty": 50, "pricePerUnit": "45.00", "label": "Starter Tier" },
    { "minQty": 100, "pricePerUnit": "40.00", "label": "Popular" },
    { "minQty": 500, "pricePerUnit": "35.00", "label": "Wholesale Leader" }
  ]
}`;
  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType,
          data: base64
        }
      }
    ]);
    const text2 = result.response.text().trim();
    const jsonText = text2.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    return JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`Data prefill failed: ${String(err)}`);
  }
}
var _clientCache2, safetySettings2;
var init_gemini2 = __esm({
  "server/ai/gemini.ts"() {
    "use strict";
    init_env();
    _clientCache2 = /* @__PURE__ */ new Map();
    safetySettings2 = [
      { category: HarmCategory2.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold2.BLOCK_NONE },
      { category: HarmCategory2.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold2.BLOCK_NONE },
      { category: HarmCategory2.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold2.BLOCK_NONE },
      { category: HarmCategory2.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold2.BLOCK_NONE }
    ];
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import path4 from "path";
import fs4 from "fs";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/routers.ts
import { TRPCError as TRPCError4 } from "@trpc/server";
import { z as z3 } from "zod";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    console.warn("[Notification] Notification service URL is not configured. Skipping.");
    return false;
  }
  if (!ENV.forgeApiKey) {
    console.warn("[Notification] Notification service API key is not configured. Skipping.");
    return false;
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// listing-generator/server/agentRouter.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
import { z as z2 } from "zod";
init_gemini();

// server/storage.ts
init_env();
import fs from "fs";
import path from "path";
function getStorageConfig() {
  const baseUrl = ENV.forgeApiUrl;
  const apiKey = ENV.forgeApiKey;
  if (!baseUrl || !apiKey) {
    return null;
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}
function buildUploadUrl(baseUrl, relKey) {
  const url = new URL("v1/storage/upload", ensureTrailingSlash(baseUrl));
  url.searchParams.set("path", normalizeKey(relKey));
  return url;
}
function ensureTrailingSlash(value) {
  return value.endsWith("/") ? value : `${value}/`;
}
function normalizeKey(relKey) {
  return relKey.replace(/^\/+/, "");
}
function toFormData(data, contentType, fileName) {
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const form = new FormData();
  form.append("file", blob, fileName || "file");
  return form;
}
function buildAuthHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}` };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  let processedData = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
  let key = normalizeKey(relKey);
  let finalContentType = contentType;
  if (contentType.startsWith("image/") && !contentType.includes("svg") && !contentType.includes("webp")) {
    try {
      const sharp = (await import("sharp")).default;
      processedData = await sharp(processedData).webp({ quality: 85 }).toBuffer();
      const ext = path.extname(key);
      key = key.replace(ext, ".webp");
      finalContentType = "image/webp";
      console.log(`[Storage] Auto-converted ${relKey} to WebP`);
    } catch (err) {
      console.warn(`[Storage] WebP conversion skipped (sharp might not be installed):`, err);
    }
  }
  const config = getStorageConfig();
  if (!config) {
    let uploadDir;
    if (ENV.storagePath) {
      uploadDir = path.isAbsolute(ENV.storagePath) ? ENV.storagePath : path.resolve(process.cwd(), ENV.storagePath);
    } else if (ENV.isProduction) {
      const persistentDir = process.env.PERSISTENT_UPLOADS_DIR || path.join(process.env.HOME || process.env.USERPROFILE || "/tmp", "ssm_persistent_uploads");
      uploadDir = persistentDir;
    } else {
      uploadDir = path.join(process.cwd(), "uploads");
    }
    const filePath = path.join(uploadDir, key);
    const fileDir = path.dirname(filePath);
    try {
      if (!fs.existsSync(fileDir)) {
        console.log(`[Storage] Creating nested directory: ${fileDir}`);
        fs.mkdirSync(fileDir, { recursive: true });
      }
      await fs.promises.writeFile(filePath, processedData);
      console.log(`[Storage] Successfully wrote ${processedData.length} bytes to ${filePath}`);
    } catch (e) {
      console.error(`[Storage] FATAL error writing to ${filePath}:`, e.message, e.stack);
    }
    const safeKey = key.startsWith("/") ? key.substring(1) : key;
    return { key: safeKey, url: `/uploads/${safeKey}` };
  }
  const { baseUrl, apiKey } = config;
  const uploadUrl = buildUploadUrl(baseUrl, key);
  const formData = toFormData(processedData, finalContentType, key.split("/").pop() ?? key);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: buildAuthHeaders(apiKey),
    body: formData
  });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Storage upload failed (${response.status} ${response.statusText}): ${message}`
    );
  }
  const url = (await response.json()).url;
  return { key, url };
}

// listing-generator/server/agentRouter.ts
import { nanoid } from "nanoid";
var AGENT_SYSTEM_PROMPT = `You are an Elite B2B Apparel Product Posting Consultant AI for Pak Homies Industry \u2014 a premium, eco-friendly custom apparel manufacturer based in Sialkot, Pakistan with 15+ years of experience exporting to 40+ countries.

## Your Expertise:
- Deep knowledge of international apparel manufacturing (MOQ pricing, fabric specs, construction details)
- SEO & GEO optimization for e-commerce product listings targeting global B2B buyers
- Market research for current trends in Hunting Wear, Sports Wear, Ski Wear, Tech Wear, Streetwear, and Martial Arts Wear
- Price slab / MOQ strategy for bulk apparel buyers
- AliExpress, Alibaba, and direct B2B buyer psychology

## Your Role:
Help admin users create complete, professional product listings by:
1. **Conversing naturally** to understand what product they want to list
2. **Asking clarifying questions** about fabric, target markets, price points, MOQ, customization options
3. **Generating full product data** including SEO-optimized titles, descriptions, keywords, size charts, color options, and MOQ pricing slabs
4. **Offering to generate product images** using AI (with or without a logo)
5. **Presenting a product preview** that can be posted directly to the website with one click

## Response Style:
- Be professional but conversational
- Be proactive \u2014 suggest improvements the user may not have thought of
- Always include both GEO keywords (Sialkot, Pakistan, wholesale) and product-specific SEO keywords
- When you have enough information, say: **"I have all the information needed. Click the '\u{1F680} Generate Product' button below to create the full product listing!"**
- When generating product images, ask if they want to upload a logo to place on the garment

## Important Rules:
- Categories must be one of: Hunting Wear, Sports Wear, Ski Wear, Tech Wear, Streetwear, Martial Arts Wear
- Always suggest at least 3 MOQ price tiers (e.g. 50-99 pcs, 100-299 pcs, 300+ pcs)
- Size charts should be realistic for international buyers (XS-3XL typically)
- Prices should reflect Pakistan manufacturing rates (very competitive globally)`;
var adminProcedure2 = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError3({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
var aiAgentRouter = router({
  // Multi-turn chat with the product consultant
  chat: adminProcedure2.input(z2.object({
    history: z2.array(z2.object({
      role: z2.enum(["user", "model"]),
      text: z2.string()
    })),
    message: z2.string().min(1).max(2e3),
    apiKey: z2.string().optional(),
    modelId: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    try {
      const key = input.apiKey || ctx.user.geminiApiKey || void 0;
      const reply = await chatWithProductAgent(
        input.history,
        input.message,
        AGENT_SYSTEM_PROMPT,
        key,
        input.modelId
      );
      return { reply, success: true };
    } catch (err) {
      if (err.message?.includes("GEMINI_API_KEY") || err.message?.includes("API key")) {
        throw new TRPCError3({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gemini API key not configured. Please add your API key in the AI Agent settings."
        });
      }
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `AI error: ${err.message}`
      });
    }
  }),
  // Generate full structured product data from a description
  generateProduct: adminProcedure2.input(z2.object({
    description: z2.string().min(5).max(1e3),
    apiKey: z2.string().optional(),
    modelId: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    try {
      const key = input.apiKey || ctx.user.geminiApiKey || void 0;
      const productData = await generateProductData(input.description, void 0, key, input.modelId);
      return { product: productData, success: true };
    } catch (err) {
      if (err.message?.includes("GEMINI_API_KEY") || err.message?.includes("API key")) {
        throw new TRPCError3({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gemini API key not configured. Please add your API key in the AI Agent settings."
        });
      }
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Product generation failed: ${err.message}`
      });
    }
  }),
  // Generate a product image with optional logo, upload to storage, return URL
  generateProductImage: adminProcedure2.input(z2.object({
    imagePrompt: z2.string().min(5).max(1e3),
    logoBase64: z2.string().optional(),
    logoMimeType: z2.string().optional(),
    apiKey: z2.string().optional(),
    modelId: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    try {
      const key = input.apiKey || ctx.user.geminiApiKey || void 0;
      const { base64, mimeType } = await generateProductImageBase64(
        input.imagePrompt,
        input.logoBase64,
        input.logoMimeType,
        key,
        input.modelId
      );
      const buffer = Buffer.from(base64, "base64");
      const ext = mimeType.split("/")[1] ?? "png";
      const storageKey = `ai-generated/${nanoid(12)}.${ext}`;
      const { url } = await storagePut(storageKey, buffer, mimeType);
      return { imageUrl: url, success: true };
    } catch (err) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Image generation failed: ${err.message}`
      });
    }
  }),
  // Generate an illustrative infographic based on the manufacturing story
  generateInfographic: adminProcedure2.input(z2.object({
    prompt: z2.string().min(5),
    apiKey: z2.string().optional(),
    modelId: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    try {
      const { generateInfographicImageBase64: generateInfographicImageBase643 } = await Promise.resolve().then(() => (init_gemini(), gemini_exports));
      const key = input.apiKey || ctx.user.geminiApiKey || void 0;
      const { base64, mimeType } = await generateInfographicImageBase643(
        input.prompt,
        key,
        input.modelId
      );
      const buffer = Buffer.from(base64, "base64");
      const ext = mimeType.split("/")[1] ?? "png";
      const storageKey = `ai-infographics/${nanoid(12)}.${ext}`;
      const { url } = await storagePut(storageKey, buffer, mimeType);
      return { imageUrl: url, success: true };
    } catch (err) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Infographic generation failed: ${err.message}`
      });
    }
  }),
  // Analyze an uploaded image to generate a full product listing
  analyzeUploadedProductImage: adminProcedure2.input(z2.object({
    base64: z2.string(),
    mimeType: z2.string(),
    apiKey: z2.string().optional(),
    modelId: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    try {
      const { analyzeUploadedProductImageBase64: analyzeUploadedProductImageBase643 } = await Promise.resolve().then(() => (init_gemini(), gemini_exports));
      const key = input.apiKey || ctx.user.geminiApiKey || void 0;
      const productData = await analyzeUploadedProductImageBase643(input.base64, input.mimeType, void 0, key, input.modelId);
      return { product: productData, success: true };
    } catch (err) {
      if (err.message?.includes("GEMINI_API_KEY") || err.message?.includes("API key")) {
        throw new TRPCError3({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gemini API key not configured. Please add your API key in the AI Agent settings."
        });
      }
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Product image analysis failed: ${err.message}`
      });
    }
  }),
  // Analyze a manually uploaded image for SEO optimization (rename, alt, caption)
  optimizeImage: adminProcedure2.input(z2.object({
    base64: z2.string(),
    mimeType: z2.string(),
    apiKey: z2.string().optional(),
    modelId: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    try {
      const { analyzeImageForSeo: analyzeImageForSeo3 } = await Promise.resolve().then(() => (init_gemini(), gemini_exports));
      const key = input.apiKey || ctx.user.geminiApiKey || void 0;
      const seoData = await analyzeImageForSeo3(input.base64, input.mimeType, key, input.modelId);
      return { seoData, success: true };
    } catch (err) {
      if (err.message?.includes("GEMINI_API_KEY") || err.message?.includes("API key")) {
        throw new TRPCError3({
          code: "INTERNAL_SERVER_ERROR",
          message: "Gemini API key not configured. Please add your API key in the AI Agent settings."
        });
      }
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Image optimization failed: ${err.message}`
      });
    }
  }),
  // Premium: Generate a 4-view design concept grid
  generateDesignerGrid: adminProcedure2.input(z2.object({
    prompt: z2.string().min(5).max(1e3),
    apiKey: z2.string().optional(),
    modelId: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    try {
      const { generateDesignerGrid: generateDesignerGrid3 } = await Promise.resolve().then(() => (init_gemini(), gemini_exports));
      const key = input.apiKey || ctx.user.geminiApiKey || void 0;
      const { base64, mimeType } = await generateDesignerGrid3(input.prompt, key, input.modelId);
      return { base64, mimeType, success: true };
    } catch (err) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Grid generation failed: ${err.message}`
      });
    }
  }),
  // Premium: Generate individual high-res view
  generateIndividualView: adminProcedure2.input(z2.object({
    basePrompt: z2.string().min(5).max(1e3),
    viewType: z2.enum(["front", "back", "left-side", "right-side", "side", "close-up", "model"]),
    apiKey: z2.string().optional(),
    modelId: z2.string().optional(),
    referenceImage: z2.object({ base64: z2.string(), mimeType: z2.string() }).optional()
  })).mutation(async ({ input, ctx }) => {
    try {
      const { generateIndividualView: generateIndividualView3 } = await Promise.resolve().then(() => (init_gemini(), gemini_exports));
      const key = input.apiKey || ctx.user.geminiApiKey || void 0;
      const { base64, mimeType } = await generateIndividualView3(
        input.basePrompt,
        input.viewType,
        key,
        input.modelId,
        input.referenceImage
      );
      const buffer = Buffer.from(base64, "base64");
      const ext = mimeType.split("/")[1] ?? "jpeg";
      const storageKey = `portfolio/designer-${input.viewType}-${nanoid(10)}.${ext}`;
      const { url } = await storagePut(storageKey, buffer, mimeType);
      return { imageUrl: url, success: true };
    } catch (err) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Individual view generation failed: ${err.message}`
      });
    }
  }),
  // Premium: Generate a Virtual Try-On image
  generateTryOnImage: adminProcedure2.input(z2.object({
    prompt: z2.string().min(5).max(1e3),
    modelImage: z2.object({ base64: z2.string(), mimeType: z2.string() }),
    referenceImages: z2.array(z2.object({ base64: z2.string(), mimeType: z2.string() })).optional(),
    referenceLink: z2.string().url().optional(),
    logoImage: z2.object({ base64: z2.string(), mimeType: z2.string() }).optional(),
    category: z2.string().optional(),
    apiKey: z2.string().optional(),
    modelId: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    try {
      const { generateTryOnImages: generateTryOnImages3 } = await Promise.resolve().then(() => (init_gemini(), gemini_exports));
      const key = input.apiKey || ctx.user.geminiApiKey || void 0;
      let finalReferenceImages = input.referenceImages || [];
      if (input.referenceLink && finalReferenceImages.length === 0) {
        try {
          const url = new URL(input.referenceLink);
          const res = await fetch(url.href, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
          });
          const html = await res.text();
          const { load: load2 } = await import("cheerio");
          const $ = load2(html);
          let imageUrl = $('meta[property="og:image"]').attr("content") || $('meta[name="twitter:image"]').attr("content") || $('link[rel="image_src"]').attr("href");
          if (!imageUrl) {
            $("img").each((i, el) => {
              const src = $(el).attr("src");
              if (src && !src.includes("logo") && !src.includes("icon")) {
                imageUrl = src;
                return false;
              }
            });
          }
          if (imageUrl) {
            if (imageUrl.startsWith("/")) {
              imageUrl = new URL(imageUrl, url.origin).href;
            }
            const imgRes = await fetch(imageUrl);
            const arrayBuffer = await imgRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const mimeType = imgRes.headers.get("content-type") || "image/jpeg";
            const base64 = buffer.toString("base64");
            finalReferenceImages.push({ base64, mimeType });
          }
        } catch (e) {
          console.error("Failed to scrape reference link:", e.message);
          throw new TRPCError3({
            code: "BAD_REQUEST",
            message: `Could not extract an image from the provided link: ${e.message}`
          });
        }
      }
      if (finalReferenceImages.length === 0) {
        throw new TRPCError3({
          code: "BAD_REQUEST",
          message: "At least one reference image or a valid product link with an image must be provided."
        });
      }
      const generatedResults = await generateTryOnImages3(
        input.prompt,
        input.modelImage,
        finalReferenceImages,
        input.logoImage,
        input.category,
        key,
        input.modelId
      );
      const uploadedUrls = [];
      for (const result of generatedResults) {
        const buffer = Buffer.from(result.base64, "base64");
        const ext = result.mimeType.split("/")[1] ?? "jpeg";
        const storageKey = `portfolio/tryon-${result.view}-${nanoid(10)}.${ext}`;
        const { url } = await storagePut(storageKey, buffer, result.mimeType);
        uploadedUrls.push({ view: result.view, url });
      }
      return { images: uploadedUrls, success: true };
    } catch (err) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Virtual Try-On generation failed: ${err.message}`
      });
    }
  }),
  // Premium: Auto-fill product form based on grid image
  prefillProductFromGrid: adminProcedure2.input(z2.object({
    prompt: z2.string(),
    base64: z2.string(),
    mimeType: z2.string(),
    apiKey: z2.string().optional(),
    modelId: z2.string().optional()
  })).mutation(async ({ input, ctx }) => {
    try {
      const { prefillProductDataFromGrid: prefillProductDataFromGrid3 } = await Promise.resolve().then(() => (init_gemini(), gemini_exports));
      const key = input.apiKey || ctx.user.geminiApiKey || void 0;
      const productData = await prefillProductDataFromGrid3(input.prompt, input.base64, input.mimeType, key, input.modelId);
      return { productData, success: true };
    } catch (err) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Product prefill failed: ${err.message}`
      });
    }
  }),
  // Get saved Virtual Try-On models
  getSavedModels: adminProcedure2.query(async () => {
    try {
      const { getSavedTryOnModels: getSavedTryOnModels2 } = await import("../db");
      const models = await getSavedTryOnModels2();
      return { models, success: true };
    } catch (err) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch saved models: ${err.message}`
      });
    }
  }),
  // Save a new Virtual Try-On model to the database
  saveTryOnModel: adminProcedure2.input(z2.object({
    base64: z2.string(),
    mimeType: z2.string(),
    name: z2.string().optional()
  })).mutation(async ({ input }) => {
    try {
      const { insertSavedTryOnModel: insertSavedTryOnModel2 } = await import("../db");
      const buffer = Buffer.from(input.base64, "base64");
      const ext = input.mimeType.split("/")[1] ?? "jpeg";
      const storageKey = `portfolio/saved-model-${nanoid(10)}.${ext}`;
      const { url } = await storagePut(storageKey, buffer, input.mimeType);
      await insertSavedTryOnModel2({
        imageUrl: url,
        name: input.name || "Custom Model"
      });
      return { imageUrl: url, success: true };
    } catch (err) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to save model: ${err.message}`
      });
    }
  }),
  // Premium: Save the final approved grid design to storage
  saveStudioImage: adminProcedure2.input(z2.object({
    base64: z2.string(),
    mimeType: z2.string()
  })).mutation(async ({ input }) => {
    try {
      const buffer = Buffer.from(input.base64, "base64");
      const ext = input.mimeType.split("/")[1] ?? "jpeg";
      const storageKey = `portfolio/studio-concept-${nanoid(10)}.${ext}`;
      const { url } = await storagePut(storageKey, buffer, input.mimeType);
      return { imageUrl: url, success: true };
    } catch (err) {
      throw new TRPCError3({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to save studio image: ${err.message}`
      });
    }
  })
});

// server/routers.ts
init_db();
import { nanoid as nanoid3 } from "nanoid";
import Stripe from "stripe";

// listing-generator/server/productAutomation.ts
init_db();
init_gemini();
init_env();
import { load } from "cheerio";
import fs2 from "fs/promises";
import { nanoid as nanoid2 } from "nanoid";
import path2 from "path";
import { sql as sql2 } from "drizzle-orm";
var DEFAULT_PROMPT = "Place the extracted garment on the model naturally.";
var DEFAULT_CATEGORY = "Streetwear";
var REQUESTS_PER_SOURCE = 6;
var RETRY_DELAY_HOURS = 6;
var isProcessorRunning = false;
function getUploadsRootPath() {
  if (ENV.storagePath) {
    return path2.isAbsolute(ENV.storagePath) ? ENV.storagePath : path2.resolve(process.cwd(), ENV.storagePath);
  }
  if (ENV.isProduction) {
    return process.env.PERSISTENT_UPLOADS_DIR || path2.join(process.env.HOME || process.env.USERPROFILE || "/tmp", "ssm_persistent_uploads");
  }
  return path2.join(process.cwd(), "uploads");
}
function guessMimeTypeFromPath(filePath) {
  const ext = path2.extname(filePath).toLowerCase();
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
async function readLocalUploadAsBase64(imageUrl) {
  if (!imageUrl.startsWith("/uploads/")) {
    return null;
  }
  const relativeKey = imageUrl.replace(/^\/uploads\//, "");
  const filePath = path2.join(getUploadsRootPath(), relativeKey);
  const buffer = await fs2.readFile(filePath);
  return {
    base64: buffer.toString("base64"),
    mimeType: guessMimeTypeFromPath(filePath)
  };
}
function sanitizePrice(price) {
  if (!price) return void 0;
  const cleaned = String(price).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (Number.isNaN(num)) return void 0;
  return num.toFixed(2);
}
function sanitizeWeight(weight) {
  if (!weight) return void 0;
  const cleaned = String(weight).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (Number.isNaN(num)) return void 0;
  return num.toFixed(3);
}
function toJsonArray(value, fallback) {
  if (!Array.isArray(value) || value.length === 0) {
    return JSON.stringify(fallback);
  }
  return JSON.stringify(value);
}
async function fetchImageAsBase64(imageUrl) {
  const localUpload = await readLocalUploadAsBase64(imageUrl).catch(() => null);
  if (localUpload) {
    return localUpload;
  }
  if (!/^https?:\/\//i.test(imageUrl)) {
    throw new Error(`Unsupported image URL for automation: ${imageUrl}`);
  }
  const response = await fetch(imageUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
  });
  if (!response.ok) {
    throw new Error(`Could not download image (${response.status})`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const mimeType = response.headers.get("content-type") || "image/jpeg";
  return {
    base64: Buffer.from(arrayBuffer).toString("base64"),
    mimeType
  };
}
async function extractReferenceImageFromSource(sourceUrl) {
  const url = new URL(sourceUrl);
  const response = await fetch(url.href, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
  });
  if (!response.ok) {
    throw new Error(`Could not open source page (${response.status})`);
  }
  const html = await response.text();
  const $ = load(html);
  let imageUrl = $('meta[property="og:image"]').attr("content") || $('meta[name="twitter:image"]').attr("content") || $('link[rel="image_src"]').attr("href");
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
async function uploadTryOnResults(sourceId, generatedResults) {
  const uploaded = [];
  for (const result of generatedResults) {
    const buffer = Buffer.from(result.base64, "base64");
    const ext = result.mimeType.split("/")[1] ?? "jpeg";
    const viewSlug = result.view.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const storageKey = `products/automation/${sourceId}-${viewSlug}-${nanoid2(10)}.${ext}`;
    const { url } = await storagePut(storageKey, buffer, result.mimeType);
    uploaded.push({ ...result, url });
  }
  return uploaded;
}
async function prepareDraftSource(source, settings) {
  const savedModelId = settings.savedModelId;
  if (!savedModelId) {
    throw new Error("No saved model is selected in automation settings.");
  }
  const model = await getSavedTryOnModelById(savedModelId);
  if (!model) {
    throw new Error("The saved model configured for automation no longer exists.");
  }
  const [category, subcategory, modelImage, referenceImage] = await Promise.all([
    source.categoryId ? getCategoryById(source.categoryId) : settings.defaultCategoryId ? getCategoryById(settings.defaultCategoryId) : Promise.resolve(void 0),
    source.subcategoryId ? getSubcategoryById(source.subcategoryId) : settings.defaultSubcategoryId ? getSubcategoryById(settings.defaultSubcategoryId) : Promise.resolve(void 0),
    fetchImageAsBase64(model.imageUrl),
    extractReferenceImageFromSource(source.sourceUrl)
  ]);
  const categoryLabel = source.categoryLabel || settings.defaultCategoryLabel || category?.name || DEFAULT_CATEGORY;
  const prompt = source.promptOverride || settings.defaultPrompt || DEFAULT_PROMPT;
  return {
    category,
    subcategory,
    categoryLabel,
    prompt,
    modelImage,
    referenceImage
  };
}
async function createDraftProductFromPreparedSource(source, settings, prepared, apiKey) {
  const { category, subcategory, categoryLabel, prompt, modelImage, referenceImage } = prepared;
  const generatedResults = await generateTryOnImages(
    prompt,
    modelImage,
    [referenceImage],
    void 0,
    categoryLabel,
    apiKey
  );
  const uploadedResults = await uploadTryOnResults(source.id, generatedResults);
  const frontView = uploadedResults.find((item) => item.view === "Front View") || uploadedResults[0];
  if (!frontView) {
    throw new Error("The automation did not receive any try-on images back from Gemini.");
  }
  const productData = await analyzeUploadedProductImageBase64(frontView.base64, frontView.mimeType, void 0, apiKey);
  const createdProduct = await createProduct({
    title: productData.title,
    slug: productData.slug,
    category: category?.name || categoryLabel || productData.category,
    categoryId: category?.id ?? source.categoryId ?? settings.defaultCategoryId ?? null,
    subcategoryId: subcategory?.id ?? source.subcategoryId ?? settings.defaultSubcategoryId ?? null,
    description: productData.description,
    shortDescription: productData.shortDescription || void 0,
    mainImage: frontView.url,
    samplePrice: sanitizePrice(productData.samplePrice),
    weight: sanitizeWeight(productData.weight),
    availableSizes: toJsonArray(productData.availableSizes, ["S", "M", "L", "XL", "2XL"]),
    availableColors: toJsonArray(productData.availableColors, ["Black", "White", "Navy"]),
    material: productData.material || void 0,
    manufacturingStory: productData.manufacturingStory || void 0,
    manufacturingInfographic: void 0,
    isFeatured: false,
    isActive: false,
    freeShipping: false,
    seoTitle: productData.seoTitle || void 0,
    seoDescription: productData.seoDescription || void 0,
    seoKeywords: productData.seoKeywords || void 0,
    sortOrder: 0
  });
  if (!createdProduct) {
    throw new Error("Draft product could not be created.");
  }
  const slabs = productData.moqSlabs?.map((slab, index) => ({
    minQty: Number(slab.minQty) || 1,
    maxQty: slab.maxQty != null ? Number(slab.maxQty) : null,
    pricePerUnit: sanitizePrice(slab.pricePerUnit) ?? "0.00",
    label: slab.label || void 0,
    sortOrder: index
  })) ?? [];
  if (slabs.length > 0) {
    await setSlabPrices(createdProduct.id, slabs);
  }
  await Promise.all(uploadedResults.map((image, index) => addProductImage({
    productId: createdProduct.id,
    imageUrl: image.url,
    altText: `${productData.title} - ${image.view}`,
    sortOrder: index
  })));
  return {
    productId: createdProduct.id,
    title: createdProduct.title,
    mainImage: frontView.url
  };
}
async function updateRunSummary(summary) {
  const settings = await getProductAutomationSettings();
  if (!settings) return;
  const { id, createdAt, updatedAt, ...rest } = settings;
  await upsertProductAutomationSettings({
    ...rest,
    lastRunAt: /* @__PURE__ */ new Date(),
    lastRunSummary: summary
  });
}
async function ensureProductAutomationTables() {
  const db = await getDb();
  if (!db) return;
  try {
    await db.execute(sql2`
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
    await db.execute(sql2`
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
    await db.execute(sql2`
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
async function processProductAutomationQueue(options) {
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
    const runEveryMs = Math.max(settings.runEveryMinutes, 1) * 60 * 1e3;
    if (!options?.manual && lastRunAt && now - lastRunAt < runEveryMs) {
      return { processed: 0, failed: 0, message: "The next scheduled run is not due yet." };
    }
    const owner = settings.ownerUserId ? await getUserById(settings.ownerUserId) : void 0;
    const apiKey = owner?.geminiApiKey || void 0;
    const sources = await getReadyProductAutomationSources(Math.max(settings.maxSourcesPerRun, 1));
    if (sources.length === 0) {
      const message2 = "No queued source links are ready for processing.";
      await updateRunSummary(message2);
      return { processed: 0, failed: 0, message: message2 };
    }
    let minuteUsage = await getReservedProductAutomationUsageSince(new Date(Date.now() - 60 * 1e3));
    let dayUsage = await getReservedProductAutomationUsageSince(new Date(Date.now() - 24 * 60 * 60 * 1e3));
    let processed = 0;
    let failed = 0;
    let stoppedForBudget = false;
    let budgetReason = null;
    if (settings.geminiRequestsPerMinuteLimit < REQUESTS_PER_SOURCE || settings.geminiRequestsPerDayLimit < REQUESTS_PER_SOURCE) {
      const message2 = `Gemini request limits are too low. Each draft needs about ${REQUESTS_PER_SOURCE} Gemini requests.`;
      await updateRunSummary(message2);
      return { processed: 0, failed: 0, message: message2 };
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
        lastAttemptAt: /* @__PURE__ */ new Date(),
        notes: null
      });
      try {
        const prepared = await prepareDraftSource(source, settings);
        await reserveProductAutomationUsage({
          sourceId: source.id,
          reservedRequests: REQUESTS_PER_SOURCE,
          reason: "draft_generation"
        });
        minuteUsage += REQUESTS_PER_SOURCE;
        dayUsage += REQUESTS_PER_SOURCE;
        const draft = await createDraftProductFromPreparedSource(source, settings, prepared, apiKey);
        await updateProductAutomationSource(source.id, {
          status: "draft_created",
          productId: draft.productId,
          generatedMainImage: draft.mainImage,
          notes: `Draft created successfully: ${draft.title}`
        });
        processed += 1;
      } catch (error) {
        failed += 1;
        await updateProductAutomationSource(source.id, {
          status: "failed",
          notes: error?.message ? String(error.message).slice(0, 2e3) : "Unknown automation error",
          nextAttemptAt: new Date(Date.now() + RETRY_DELAY_HOURS * 60 * 60 * 1e3)
        });
      }
    }
    const message = stoppedForBudget ? `Processed ${processed} source(s), failed ${failed}, and paused because ${budgetReason ?? "the Gemini request budget is exhausted"}.` : `Processed ${processed} source(s) and failed ${failed}.`;
    await updateRunSummary(message);
    return { processed, failed, message };
  } finally {
    isProcessorRunning = false;
  }
}
function triggerProductAutomationQueueRun(options) {
  if (isProcessorRunning) {
    return {
      started: false,
      message: "Automation is already running."
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
    message: "Automation run started in the background. Refresh the queue shortly to see progress."
  };
}
function startProductAutomationScheduler() {
  void ensureProductAutomationTables();
  setInterval(() => {
    void processProductAutomationQueue();
  }, 60 * 1e3);
}
var productAutomationRequestBudgetPerSource = REQUESTS_PER_SOURCE;

// server/routers.ts
var adminProcedure3 = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError4({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
var slabSchema = z3.object({
  minQty: z3.number().int().positive(),
  maxQty: z3.number().int().positive().nullable().optional(),
  pricePerUnit: z3.string(),
  label: z3.string().max(100).optional(),
  sortOrder: z3.number().int().default(0)
});
var productRouter = router({
  list: publicProcedure.input(z3.object({
    category: z3.string().optional(),
    subcategory: z3.string().optional(),
    search: z3.string().optional(),
    limit: z3.number().int().min(1).max(100).default(24),
    offset: z3.number().int().min(0).default(0)
  }).optional()).query(async ({ input }) => {
    return getActiveProducts(input);
  }),
  featured: publicProcedure.input(z3.object({
    limit: z3.number().int().min(1).max(24).default(8)
  }).optional()).query(async ({ input }) => {
    const limit = input?.limit ?? 8;
    const featured = await getFeaturedProducts();
    if (featured.length >= limit) {
      return featured.slice(0, limit);
    }
    if (featured.length > 0) {
      return featured;
    }
    return getActiveProducts({ limit, offset: 0 });
  }),
  categories: publicProcedure.query(async () => {
    const all = await getActiveProducts();
    const cats = Array.from(new Set(all.map((p) => p.category)));
    return cats;
  }),
  bySlug: publicProcedure.input(z3.object({ slug: z3.string() })).query(async ({ input }) => {
    const product = await getProductBySlug(input.slug);
    if (!product) return null;
    const [images, slabs, sizeChart] = await Promise.all([
      getProductImages(product.id),
      getSlabPrices(product.id),
      getSizeChart(product.id)
    ]);
    return { ...product, images, slabs, sizeChart: sizeChart ?? null };
  }),
  // Admin: full list including inactive
  adminList: adminProcedure3.query(() => getAllProducts()),
  byId: adminProcedure3.input(z3.object({ id: z3.number().int().positive() })).query(async ({ input }) => {
    const product = await getProductById(input.id);
    if (!product) return null;
    const [images, slabs, sizeChart] = await Promise.all([
      getProductImages(product.id),
      getSlabPrices(product.id),
      getSizeChart(product.id)
    ]);
    return { ...product, images, slabs, sizeChart: sizeChart ?? null };
  }),
  create: adminProcedure3.input(z3.object({
    title: z3.string().min(1).max(500),
    slug: z3.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
    category: z3.string().min(1).max(100),
    categoryId: z3.number().int().positive().optional().nullable(),
    subcategoryId: z3.number().int().positive().optional().nullable(),
    description: z3.string().optional(),
    shortDescription: z3.string().max(500).optional(),
    mainImage: z3.string().optional(),
    samplePrice: z3.string().optional(),
    weight: z3.string().optional(),
    availableSizes: z3.string().optional(),
    // JSON
    availableColors: z3.string().optional(),
    // JSON
    material: z3.string().max(255).optional(),
    manufacturingStory: z3.string().optional(),
    manufacturingInfographic: z3.string().optional(),
    isFeatured: z3.boolean().default(false),
    isActive: z3.boolean().default(true),
    freeShipping: z3.boolean().default(false),
    seoTitle: z3.string().max(255).optional(),
    seoDescription: z3.string().optional(),
    seoKeywords: z3.string().optional(),
    sortOrder: z3.number().int().default(0),
    slabs: z3.array(slabSchema).optional(),
    sizeChart: z3.object({
      chartData: z3.string(),
      unit: z3.enum(["inches", "cm"]),
      notes: z3.string().optional()
    }).optional()
  })).mutation(async ({ input }) => {
    const { slabs, sizeChart, ...productData } = input;
    if (productData.samplePrice === "") productData.samplePrice = void 0;
    if (productData.weight === "") productData.weight = void 0;
    const product = await createProduct(productData);
    if (!product) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Failed to insert product" });
    if (slabs && slabs.length > 0) await setSlabPrices(product.id, slabs);
    if (sizeChart) await upsertSizeChart(product.id, sizeChart);
    return product;
  }),
  update: adminProcedure3.input(z3.object({
    id: z3.number().int().positive(),
    title: z3.string().min(1).max(500).optional(),
    slug: z3.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
    category: z3.string().min(1).max(100).optional(),
    categoryId: z3.number().int().positive().optional().nullable(),
    subcategoryId: z3.number().int().positive().optional().nullable(),
    description: z3.string().optional(),
    shortDescription: z3.string().max(500).optional(),
    mainImage: z3.string().optional(),
    samplePrice: z3.string().optional(),
    weight: z3.string().optional(),
    availableSizes: z3.string().optional(),
    availableColors: z3.string().optional(),
    material: z3.string().max(255).optional(),
    manufacturingStory: z3.string().optional(),
    manufacturingInfographic: z3.string().optional(),
    isFeatured: z3.boolean().optional(),
    isActive: z3.boolean().optional(),
    freeShipping: z3.boolean().optional(),
    seoTitle: z3.string().max(255).optional(),
    seoDescription: z3.string().optional(),
    seoKeywords: z3.string().optional(),
    sortOrder: z3.number().int().optional(),
    slabs: z3.array(slabSchema).optional(),
    sizeChart: z3.object({
      chartData: z3.string(),
      unit: z3.enum(["inches", "cm"]),
      notes: z3.string().optional()
    }).optional()
  })).mutation(async ({ input }) => {
    const { id, slabs, sizeChart, ...data } = input;
    if (data.samplePrice === "") data.samplePrice = void 0;
    if (data.weight === "") data.weight = void 0;
    await updateProduct(id, data);
    if (slabs !== void 0) await setSlabPrices(id, slabs);
    if (sizeChart) await upsertSizeChart(id, sizeChart);
    return { success: true };
  }),
  delete: adminProcedure3.input(z3.object({ id: z3.number().int().positive() })).mutation(async ({ input }) => {
    await deleteProduct(input.id);
    return { success: true };
  }),
  uploadImage: adminProcedure3.input(z3.object({
    productId: z3.number().int().positive(),
    imageBase64: z3.string(),
    mimeType: z3.string().default("image/jpeg"),
    altText: z3.string().optional(),
    sortOrder: z3.number().int().default(0)
  })).mutation(async ({ input }) => {
    const buffer = Buffer.from(input.imageBase64, "base64");
    const ext = input.mimeType.split("/")[1] ?? "jpg";
    const key = `products-${input.productId}-${nanoid3(10)}.${ext}`;
    const { url } = await storagePut(key, buffer, input.mimeType);
    await addProductImage({
      productId: input.productId,
      imageUrl: url,
      altText: input.altText,
      sortOrder: input.sortOrder
    });
    return { url };
  }),
  deleteImage: adminProcedure3.input(z3.object({ id: z3.number().int().positive() })).mutation(async ({ input }) => {
    await deleteProductImage(input.id);
    return { success: true };
  }),
  reorderImages: adminProcedure3.input(z3.array(z3.object({ id: z3.number(), sortOrder: z3.number() }))).mutation(async ({ input }) => {
    await reorderProductImages(input);
    return { success: true };
  })
});
var shippingRouter = router({
  zones: publicProcedure.query(() => getActiveShippingZones()),
  adminZones: adminProcedure3.query(() => getAllShippingZones()),
  calculate: publicProcedure.input(z3.object({
    countryCode: z3.string().length(2),
    items: z3.array(z3.object({
      productId: z3.number().int(),
      quantity: z3.number().int().positive()
    }))
  })).query(async ({ input }) => {
    const productDetails = await Promise.all(
      input.items.map((item) => getProductById(item.productId))
    );
    const allFreeShipping = productDetails.every((p) => p?.freeShipping);
    if (allFreeShipping) {
      return { cost: "0.00", currency: "USD", estimatedDays: { min: 7, max: 21 }, freeShipping: true, zoneName: "Free Shipping" };
    }
    const zone = await findShippingZoneForCountry(input.countryCode);
    if (!zone) {
      return { cost: "45.00", currency: "USD", estimatedDays: { min: 14, max: 30 }, freeShipping: false, zoneName: "International" };
    }
    const totalQty = input.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalWeight = productDetails.reduce((sum, p, idx) => {
      const qty = input.items[idx]?.quantity ?? 1;
      return sum + parseFloat(p?.weight ?? "0.3") * qty;
    }, 0);
    const base = parseFloat(zone.baseRate);
    const perUnit = parseFloat(zone.perUnitRate) * totalQty;
    const perKg = parseFloat(zone.perKgRate) * totalWeight;
    const total = Math.max(base + perUnit + perKg, 0);
    return {
      cost: total.toFixed(2),
      currency: zone.currency,
      estimatedDays: { min: zone.minDays, max: zone.maxDays },
      freeShipping: false,
      zoneName: zone.zoneName
    };
  }),
  createZone: adminProcedure3.input(z3.object({
    zoneName: z3.string().min(1).max(100),
    countries: z3.string(),
    // JSON array of ISO codes
    baseRate: z3.string().regex(/^\d+(\.\d{1,2})?$/),
    perUnitRate: z3.string().regex(/^\d+(\.\d{1,2})?$/).default("0.00"),
    perKgRate: z3.string().regex(/^\d+(\.\d{1,2})?$/).default("0.00"),
    minDays: z3.number().int().min(1).default(7),
    maxDays: z3.number().int().min(1).default(21),
    currency: z3.string().max(10).default("USD"),
    isActive: z3.boolean().default(true)
  })).mutation(async ({ input }) => {
    await createShippingZone(input);
    return { success: true };
  }),
  updateZone: adminProcedure3.input(z3.object({
    id: z3.number().int().positive(),
    zoneName: z3.string().min(1).max(100).optional(),
    countries: z3.string().optional(),
    baseRate: z3.string().optional(),
    perUnitRate: z3.string().optional(),
    perKgRate: z3.string().optional(),
    minDays: z3.number().int().optional(),
    maxDays: z3.number().int().optional(),
    currency: z3.string().optional(),
    isActive: z3.boolean().optional()
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    await updateShippingZone(id, data);
    return { success: true };
  }),
  deleteZone: adminProcedure3.input(z3.object({ id: z3.number().int().positive() })).mutation(async ({ input }) => {
    await deleteShippingZone(input.id);
    return { success: true };
  })
});
var cartRouter = router({
  get: publicProcedure.input(z3.object({ sessionId: z3.string() })).query(async ({ input }) => {
    const items = await getCartItems(input.sessionId);
    const enriched = await Promise.all(items.map(async (item) => {
      const product = await getProductById(item.productId);
      const slabs = await getSlabPrices(item.productId);
      const slab = slabs.find((s) => {
        const qty = item.quantity;
        return qty >= s.minQty && (s.maxQty === null || qty <= (s.maxQty ?? Infinity));
      }) ?? slabs[0];
      return {
        ...item,
        product: product ?? null,
        unitPrice: slab ? parseFloat(slab.pricePerUnit) : 0,
        lineTotal: slab ? parseFloat(slab.pricePerUnit) * item.quantity : 0
      };
    }));
    return enriched;
  }),
  addItem: publicProcedure.input(z3.object({
    sessionId: z3.string(),
    productId: z3.number().int().positive(),
    quantity: z3.number().int().positive(),
    selectedSize: z3.string().optional(),
    selectedColor: z3.string().optional()
  })).mutation(async ({ input }) => {
    await upsertCartItem(input);
    return { success: true };
  }),
  updateQty: publicProcedure.input(z3.object({ id: z3.number().int().positive(), quantity: z3.number().int().min(0) })).mutation(async ({ input }) => {
    await updateCartItemQty(input.id, input.quantity);
    return { success: true };
  }),
  removeItem: publicProcedure.input(z3.object({ id: z3.number().int().positive() })).mutation(async ({ input }) => {
    await removeCartItem(input.id);
    return { success: true };
  }),
  clear: publicProcedure.input(z3.object({ sessionId: z3.string() })).mutation(async ({ input }) => {
    await clearCart(input.sessionId);
    return { success: true };
  })
});
var orderRouter = router({
  create: publicProcedure.input(z3.object({
    sessionId: z3.string(),
    customerName: z3.string().min(1),
    customerEmail: z3.string().email(),
    customerPhone: z3.string().optional(),
    companyName: z3.string().optional(),
    addressLine1: z3.string().min(1),
    addressLine2: z3.string().optional(),
    city: z3.string().min(1),
    state: z3.string().optional(),
    postalCode: z3.string().optional(),
    country: z3.string().min(1),
    countryCode: z3.string().length(2),
    items: z3.array(z3.object({
      productId: z3.number(),
      title: z3.string(),
      qty: z3.number(),
      size: z3.string().optional(),
      color: z3.string().optional(),
      unitPrice: z3.number()
    })),
    subtotal: z3.number(),
    shippingCost: z3.number(),
    totalAmount: z3.number(),
    paymentMethod: z3.enum(["stripe", "invoice"])
  })).mutation(async ({ input }) => {
    const orderNumber = `SSM-${Date.now()}-${nanoid3(6).toUpperCase()}`;
    let stripeSessionId = void 0;
    let stripeUrl = void 0;
    if (input.paymentMethod === "stripe") {
      const lineItems = input.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: `Size: ${item.size || "N/A"}, Color: ${item.color || "N/A"}`
          },
          unit_amount: Math.round(item.unitPrice * 100)
          // Stripe expects cents
        },
        quantity: item.qty
      }));
      if (input.shippingCost > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: "Shipping", description: "Standard Shipping Rate" },
            unit_amount: Math.round(input.shippingCost * 100)
          },
          quantity: 1
        });
      }
      const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
      const host = process.env.HOST || "localhost:5173";
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${protocol}://${host}/checkout/success?order_number=${orderNumber}`,
        cancel_url: `${protocol}://${host}/checkout/cancel`,
        customer_email: input.customerEmail,
        metadata: { orderNumber }
      });
      stripeSessionId = session.id;
      stripeUrl = session.url ?? void 0;
    }
    const order = await createOrder({
      orderNumber,
      sessionId: input.sessionId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      companyName: input.companyName,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      country: input.country,
      countryCode: input.countryCode,
      subtotal: input.subtotal.toFixed(2),
      shippingCost: input.shippingCost.toFixed(2),
      totalAmount: input.totalAmount.toFixed(2),
      items: JSON.stringify(input.items),
      status: "pending",
      paymentMethod: input.paymentMethod,
      stripeSessionId
    });
    await clearCart(input.sessionId);
    await notifyOwner({
      title: `New Order: ${orderNumber}`,
      content: `Order from ${input.customerName} (${input.companyName ?? input.customerEmail}) \u2014 Total: $${input.totalAmount.toFixed(2)} via ${input.paymentMethod.toUpperCase()}`
    });
    return { success: true, orderNumber, stripeUrl };
  }),
  byNumber: publicProcedure.input(z3.object({ orderNumber: z3.string() })).query(async ({ input }) => getOrderByNumber(input.orderNumber)),
  getById: adminProcedure3.input(z3.object({ id: z3.number().int().positive() })).query(async ({ input }) => {
    const all = await getAllOrders();
    return all.find((o) => o.id === input.id) ?? null;
  }),
  adminList: adminProcedure3.query(() => getAllOrders()),
  adminStats: adminProcedure3.query(async () => {
    const all = await getAllOrders();
    const products2 = await getAllProducts();
    const rfqs = await getAllRfqSubmissions();
    const paidOrders = all.filter((o) => ["paid", "processing", "shipped", "delivered"].includes(o.status));
    const totalRevenue = paidOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
    const pendingCount = all.filter((o) => o.status === "pending").length;
    const processingCount = all.filter((o) => o.status === "processing").length;
    const recentOrders = all.slice(0, 5);
    return {
      totalRevenue: totalRevenue.toFixed(2),
      orderCount: all.length,
      paidOrderCount: paidOrders.length,
      pendingCount,
      processingCount,
      productCount: products2.length,
      activeProductCount: products2.filter((p) => p.isActive).length,
      recentOrders,
      inquiryCount: rfqs.length,
      newInquiryCount: rfqs.filter((r) => r.status === "new").length,
      recentInquiries: rfqs.slice(0, 5)
    };
  }),
  updateStatus: adminProcedure3.input(z3.object({
    id: z3.number().int().positive(),
    status: z3.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"])
  })).mutation(async ({ input }) => {
    await updateOrderStatus(input.id, input.status);
    return { success: true };
  })
});
var rfqRouter = router({
  submit: publicProcedure.input(z3.object({
    companyName: z3.string().min(1),
    contactName: z3.string().min(1),
    email: z3.string().email(),
    phone: z3.string().optional(),
    country: z3.string().optional(),
    website: z3.string().optional(),
    productType: z3.string().min(1),
    quantity: z3.string().min(1),
    customizationType: z3.string().optional(),
    fabricPreference: z3.string().optional(),
    timeline: z3.string().optional(),
    budgetRange: z3.string().optional(),
    description: z3.string().optional(),
    serviceType: z3.string().optional(),
    howHeard: z3.string().optional()
  })).mutation(async ({ input }) => {
    await createRfqSubmission({
      companyName: input.companyName,
      contactName: input.contactName,
      email: input.email,
      phone: input.phone,
      country: input.country,
      website: input.website,
      productType: input.productType,
      quantity: input.quantity,
      customization: input.customizationType,
      fabricPreference: input.fabricPreference,
      timeline: input.timeline,
      budget: input.budgetRange,
      additionalNotes: input.description
    });
    await notifyOwner({
      title: `New RFQ from ${input.companyName}`,
      content: `${input.contactName} (${input.email}) requested a quote for ${input.productType} \u2014 Qty: ${input.quantity}`
    });
    return { success: true };
  }),
  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") return [];
    return getAllRfqSubmissions();
  }),
  // Upload a design screenshot to S3 and return the URL
  uploadDesignImage: publicProcedure.input(z3.object({
    imageBase64: z3.string(),
    mimeType: z3.string().default("image/jpeg")
  })).mutation(async ({ input }) => {
    const buffer = Buffer.from(input.imageBase64, "base64");
    const ext = input.mimeType.split("/")[1] || "jpg";
    const fileKey = `design-quotes/${nanoid3(12)}.${ext}`;
    const { url } = await storagePut(fileKey, buffer, input.mimeType);
    return { url };
  }),
  // Submit an RFQ with an attached 3D design image
  submitWithDesign: publicProcedure.input(z3.object({
    companyName: z3.string().min(1),
    contactName: z3.string().min(1),
    email: z3.string().email(),
    phone: z3.string().optional(),
    country: z3.string().optional(),
    productType: z3.string().min(1),
    quantity: z3.string().min(1),
    timeline: z3.string().optional(),
    budgetRange: z3.string().optional(),
    description: z3.string().optional(),
    designImageUrl: z3.string().url().optional(),
    garmentType: z3.string().optional()
  })).mutation(async ({ input }) => {
    await createRfqSubmission({
      companyName: input.companyName,
      contactName: input.contactName,
      email: input.email,
      phone: input.phone,
      country: input.country,
      productType: input.productType,
      quantity: input.quantity,
      timeline: input.timeline,
      budget: input.budgetRange,
      additionalNotes: input.description,
      designImageUrl: input.designImageUrl,
      garmentType: input.garmentType
    });
    const designNote = input.designImageUrl ? `

\u{1F3A8} Design Preview: ${input.designImageUrl}` : "";
    await notifyOwner({
      title: `New 3D Design Quote from ${input.companyName}`,
      content: `${input.contactName} (${input.email}) submitted a 3D design quote request for ${input.productType} (${input.garmentType ?? ""}) \u2014 Qty: ${input.quantity}${designNote}`
    });
    return { success: true };
  }),
  // ── Admin inquiry management ──────────────────────────────────────
  adminList: adminProcedure3.query(() => getAllRfqSubmissions()),
  getById: adminProcedure3.input(z3.object({ id: z3.number().int().positive() })).query(async ({ input }) => {
    const rfq = await getRfqById(input.id);
    if (!rfq) return null;
    const notes = await getNotesForInquiry(input.id);
    return { ...rfq, notes };
  }),
  updateStatus: adminProcedure3.input(z3.object({
    id: z3.number().int().positive(),
    status: z3.enum(["new", "reviewed", "quoted", "closed"])
  })).mutation(async ({ input }) => {
    await updateRfqStatus(input.id, input.status);
    return { success: true };
  }),
  addNote: adminProcedure3.input(z3.object({
    rfqId: z3.number().int().positive(),
    content: z3.string().min(1),
    isAiGenerated: z3.boolean().default(false)
  })).mutation(async ({ input }) => {
    await addInquiryNote({
      rfqId: input.rfqId,
      content: input.content,
      isAiGenerated: input.isAiGenerated
    });
    return { success: true };
  }),
  generateAiReply: adminProcedure3.input(z3.object({
    rfqId: z3.number().int().positive(),
    instruction: z3.string().min(1)
  })).mutation(async ({ input, ctx }) => {
    const rfq = await getRfqById(input.rfqId);
    if (!rfq) throw new TRPCError4({ code: "NOT_FOUND", message: "Inquiry not found" });
    const userApiKey = ctx.user?.geminiApiKey || void 0;
    const products2 = await getAllProducts();
    const kb = await getAllKnowledgeBase();
    const notes = await getNotesForInquiry(input.rfqId);
    const productCatalog = products2.map(
      (p) => `- ${p.title} (${p.category}): ${p.shortDescription || p.description || ""} | Base Price: $${p.samplePrice || "Contact for pricing"}`
    ).join("\n");
    const kbContent = kb.map((k) => `[${k.category}] ${k.title}: ${k.content}`).join("\n\n");
    const previousNotes = notes.map((n) => `[${n.isAiGenerated ? "AI" : "Admin"}] ${n.content}`).join("\n---\n");
    const systemPrompt = `You are a professional sales representative for Pak Homies Industry \u2014 a premium B2B custom apparel manufacturer from Sialkot, Pakistan. We specialize in custom sportswear, streetwear, hunting gear, tactical uniforms, martial arts uniforms, and private label manufacturing.

COMPANY INFO:
- Name: Pak Homies Industry
- Location: Sialkot Industrial Estate, Sialkot 51310, Punjab, Pakistan
- Phone/WhatsApp: +92 302 292 2242
- Email: info@pakhomiesind.com
- Website: www.pakhomiesind.com
- Certifications: ISO 9001:2015, Eco-Friendly manufacturing
- Capabilities: Private Label, Pattern Making, Sublimation Printing, Embroidery & DTF, Cut & Sew, Tech Pack Design

PRODUCT CATALOG:
${productCatalog}

${kbContent ? `ADDITIONAL KNOWLEDGE BASE:
${kbContent}` : ""}

${previousNotes ? `PREVIOUS CONVERSATION NOTES:
${previousNotes}` : ""}

RULES:
- Write professional, warm, and convincing business emails
- Reference specific products and capabilities when relevant
- Include pricing guidance based on the product catalog when appropriate
- Always be helpful and solution-oriented
- Sign off as the Pak Homies Industry Sales Team
- Keep emails concise but thorough
- Use proper email formatting with greeting and sign-off`;
    const inquiryContext = `INQUIRY DETAILS:
- From: ${rfq.contactName} (${rfq.companyName})
- Email: ${rfq.email}
- Phone: ${rfq.phone || "Not provided"}
- Country: ${rfq.country || "Not specified"}
- Product Type: ${rfq.productType}
- Quantity: ${rfq.quantity}
- Customization: ${rfq.customization || "Not specified"}
- Fabric Preference: ${rfq.fabricPreference || "Not specified"}
- Timeline: ${rfq.timeline || "Not specified"}
- Budget: ${rfq.budget || "Not specified"}
- Additional Notes: ${rfq.additionalNotes || "None"}
- Current Status: ${rfq.status}

USER INSTRUCTION: ${input.instruction}`;
    const { chatWithProductAgent: chatWithProductAgent3 } = await Promise.resolve().then(() => (init_gemini2(), gemini_exports2));
    const reply = await chatWithProductAgent3(
      [],
      inquiryContext,
      systemPrompt,
      userApiKey
    );
    return { reply };
  }),
  // ── Knowledge Base ─────────────────────────────────────────────────
  getKnowledgeBase: adminProcedure3.query(() => getAllKnowledgeBase()),
  addKnowledge: adminProcedure3.input(z3.object({
    title: z3.string().min(1),
    content: z3.string().min(1),
    category: z3.string().default("general")
  })).mutation(async ({ input }) => {
    await addKnowledgeBaseEntry(input);
    return { success: true };
  }),
  deleteKnowledge: adminProcedure3.input(z3.object({ id: z3.number().int().positive() })).mutation(async ({ input }) => {
    await deleteKnowledgeBaseEntry(input.id);
    return { success: true };
  })
});
var blogRouter = router({
  list: publicProcedure.query(() => getPublishedBlogPosts()),
  bySlug: publicProcedure.input(z3.object({ slug: z3.string() })).query(({ input }) => getBlogPostBySlug(input.slug))
});
var portfolioRouter = router({
  // Public queries
  list: publicProcedure.input(z3.object({ category: z3.string().optional() }).optional()).query(({ input }) => listPortfolioItems({ category: input?.category, onlyActive: true })),
  categories: publicProcedure.query(() => getPortfolioCategories()),
  adminList: adminProcedure3.query(() => listPortfolioItems({ onlyActive: false })),
  byId: publicProcedure.input(z3.object({ id: z3.number() })).query(({ input }) => getPortfolioItemWithImages(input.id)),
  // Admin: create portfolio item
  create: protectedProcedure.input(z3.object({
    title: z3.string().min(1),
    category: z3.string().min(1),
    description: z3.string().optional(),
    tags: z3.string().optional(),
    seoTitle: z3.string().optional(),
    seoDescription: z3.string().optional(),
    seoKeywords: z3.string().optional(),
    geoTarget: z3.string().optional(),
    isFeatured: z3.boolean().optional(),
    isActive: z3.boolean().optional(),
    sortOrder: z3.number().optional()
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError4({ code: "FORBIDDEN" });
    return createPortfolioItem(input);
  }),
  // Admin: update portfolio item
  update: protectedProcedure.input(z3.object({
    id: z3.number(),
    title: z3.string().optional(),
    category: z3.string().optional(),
    description: z3.string().optional(),
    tags: z3.string().optional(),
    seoTitle: z3.string().optional(),
    seoDescription: z3.string().optional(),
    seoKeywords: z3.string().optional(),
    geoTarget: z3.string().optional(),
    isFeatured: z3.boolean().optional(),
    isActive: z3.boolean().optional(),
    sortOrder: z3.number().optional(),
    coverImage: z3.string().optional(),
    ogImage: z3.string().optional()
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError4({ code: "FORBIDDEN" });
    const { id, ...data } = input;
    await updatePortfolioItem(id, data);
    return { success: true };
  }),
  // Admin: delete portfolio item (cascades images)
  delete: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError4({ code: "FORBIDDEN" });
    await deletePortfolioItem(input.id);
    return { success: true };
  }),
  // Admin: upload image to S3 and attach to portfolio item
  uploadImage: protectedProcedure.input(z3.object({
    portfolioItemId: z3.number().optional(),
    imageBase64: z3.string(),
    mimeType: z3.string().default("image/jpeg"),
    altText: z3.string().optional(),
    caption: z3.string().optional(),
    sortOrder: z3.number().optional()
  })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError4({ code: "FORBIDDEN" });
    const buffer = Buffer.from(input.imageBase64, "base64");
    const ext = input.mimeType.split("/")[1] || "jpg";
    const fileKey = input.portfolioItemId ? `portfolio/${input.portfolioItemId}/${nanoid3(10)}.${ext}` : `portfolio/temp/${nanoid3(10)}.${ext}`;
    const { url } = await storagePut(fileKey, buffer, input.mimeType);
    if (input.portfolioItemId) {
      const img = await addPortfolioImage({
        portfolioItemId: input.portfolioItemId,
        imageUrl: url,
        fileKey,
        altText: input.altText,
        caption: input.caption,
        sortOrder: input.sortOrder ?? 0
      });
      const existing = await getPortfolioItemWithImages(input.portfolioItemId);
      if (existing && existing.images.length === 1) {
        await updatePortfolioItem(input.portfolioItemId, { coverImage: url, ogImage: url });
      }
      return img;
    }
    return { url };
  }),
  // Admin: delete a single image
  deleteImage: protectedProcedure.input(z3.object({ imageId: z3.number() })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError4({ code: "FORBIDDEN" });
    await deletePortfolioImage(input.imageId);
    return { success: true };
  }),
  // Admin: reorder images
  reorderImages: protectedProcedure.input(z3.array(z3.object({ id: z3.number(), sortOrder: z3.number() }))).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError4({ code: "FORBIDDEN" });
    await reorderPortfolioImages(input);
    return { success: true };
  }),
  // Admin: set cover image
  setCover: protectedProcedure.input(z3.object({ portfolioItemId: z3.number(), imageUrl: z3.string() })).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") throw new TRPCError4({ code: "FORBIDDEN" });
    await updatePortfolioItem(input.portfolioItemId, { coverImage: input.imageUrl, ogImage: input.imageUrl });
    return { success: true };
  })
});
var testimonialsRouter = router({
  featured: publicProcedure.query(() => getFeaturedTestimonials())
});
var contactRouter = router({
  submit: publicProcedure.input(z3.object({
    name: z3.string().min(1),
    email: z3.string().email(),
    company: z3.string().optional(),
    phone: z3.string().optional(),
    subject: z3.string().optional(),
    message: z3.string().min(1)
  })).mutation(async ({ input }) => {
    await createContactSubmission(input);
    await notifyOwner({
      title: `New Contact from ${input.name}`,
      content: `${input.email}${input.company ? ` (${input.company})` : ""}: ${input.message.slice(0, 200)}`
    });
    return { success: true };
  })
});
var techPackRouter = router({
  submit: publicProcedure.input(z3.object({
    brandName: z3.string().min(1),
    contactName: z3.string().min(1),
    email: z3.string().email(),
    phone: z3.string().optional(),
    country: z3.string().optional(),
    garmentType: z3.string().min(1),
    styleName: z3.string().optional(),
    season: z3.string().optional(),
    gender: z3.string().optional(),
    targetMarket: z3.string().optional(),
    techPackData: z3.string(),
    // JSON blob
    images: z3.array(z3.object({
      imageUrl: z3.string().url(),
      fileKey: z3.string().optional(),
      imageType: z3.enum(["mockup", "flat_sketch", "reference", "hangtag", "care_label"]),
      caption: z3.string().optional(),
      sortOrder: z3.number().int().default(0)
    })).optional()
  })).mutation(async ({ input }) => {
    const referenceNumber = `TP-${(/* @__PURE__ */ new Date()).getFullYear()}-${nanoid3(6).toUpperCase()}`;
    const techPack = await createTechPack({
      referenceNumber,
      brandName: input.brandName,
      contactName: input.contactName,
      email: input.email,
      phone: input.phone,
      country: input.country,
      garmentType: input.garmentType,
      styleName: input.styleName,
      season: input.season,
      gender: input.gender,
      targetMarket: input.targetMarket,
      techPackData: input.techPackData,
      status: "submitted"
    });
    if (!techPack) {
      throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create Tech Pack overview" });
    }
    if (input.images && input.images.length > 0) {
      for (const img of input.images) {
        await addTechPackImage({
          techPackId: techPack.id,
          imageUrl: img.imageUrl,
          fileKey: img.fileKey,
          imageType: img.imageType,
          caption: img.caption,
          sortOrder: img.sortOrder
        });
      }
    }
    await notifyOwner({
      title: `New Tech Pack: ${referenceNumber}`,
      content: `${input.contactName} (${input.brandName}) submitted a Tech Pack for ${input.garmentType} (${input.styleName || "N/A"})`
    });
    return { success: true, referenceNumber, techPackId: techPack.id };
  }),
  uploadImage: publicProcedure.input(z3.object({
    imageBase64: z3.string(),
    mimeType: z3.string().default("image/jpeg")
  })).mutation(async ({ input }) => {
    const buffer = Buffer.from(input.imageBase64, "base64");
    const ext = input.mimeType.split("/")[1] || "jpg";
    const fileKey = `tech-packs/${nanoid3(12)}.${ext}`;
    const { url, key } = await storagePut(fileKey, buffer, input.mimeType);
    return { url, fileKey: key };
  }),
  list: adminProcedure3.query(async () => {
    return getAllTechPacks();
  }),
  byId: adminProcedure3.input(z3.object({ id: z3.number().int().positive() })).query(async ({ input }) => {
    const techPack = await getTechPackById(input.id);
    if (!techPack) return null;
    const images = await getTechPackImages(techPack.id);
    return { ...techPack, images };
  }),
  updateStatus: adminProcedure3.input(z3.object({
    id: z3.number().int().positive(),
    status: z3.enum(["draft", "submitted", "reviewed", "quoted"]),
    adminNotes: z3.string().optional()
  })).mutation(async ({ input }) => {
    await updateTechPackStatus(input.id, input.status, input.adminNotes);
    return { success: true };
  })
});
var categoryRouter = router({
  // Public endpoints
  list: publicProcedure.input(z3.object({ includeInactive: z3.boolean().optional() }).optional()).query(({ input }) => getAllCategories({ includeInactive: input?.includeInactive })),
  listWithSubs: publicProcedure.input(z3.object({ includeInactive: z3.boolean().optional() }).optional()).query(({ input }) => getCategoriesWithSubcategories({ includeInactive: input?.includeInactive })),
  bySlug: publicProcedure.input(z3.object({ slug: z3.string() })).query(async ({ input }) => {
    const category = await getCategoryBySlug(input.slug);
    if (!category) return null;
    const subcategories2 = await getSubcategoriesByCategoryId(category.id);
    return { ...category, subcategories: subcategories2 };
  }),
  subcategories: publicProcedure.input(z3.object({ categoryId: z3.number().int().positive() })).query(({ input }) => getSubcategoriesByCategoryId(input.categoryId)),
  // Admin endpoints
  adminList: adminProcedure3.input(z3.object({ includeInactive: z3.boolean().optional() }).optional()).query(({ input }) => getCategoriesWithSubcategories({ includeInactive: input?.includeInactive ?? true })),
  create: adminProcedure3.input(z3.object({
    name: z3.string().min(1).max(100),
    slug: z3.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
    icon: z3.string().max(50).optional(),
    description: z3.string().optional(),
    imageUrl: z3.string().optional(),
    sortOrder: z3.number().int().default(0),
    isActive: z3.boolean().default(true),
    seoTitle: z3.string().max(255).optional(),
    seoDescription: z3.string().optional(),
    seoKeywords: z3.string().optional()
  })).mutation(async ({ input }) => {
    return createCategory(input);
  }),
  update: adminProcedure3.input(z3.object({
    id: z3.number().int().positive(),
    name: z3.string().min(1).max(100).optional(),
    slug: z3.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
    icon: z3.string().max(50).optional(),
    description: z3.string().optional(),
    imageUrl: z3.string().optional(),
    sortOrder: z3.number().int().optional(),
    isActive: z3.boolean().optional(),
    seoTitle: z3.string().max(255).optional(),
    seoDescription: z3.string().optional(),
    seoKeywords: z3.string().optional()
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    await updateCategory(id, data);
    return { success: true };
  }),
  delete: adminProcedure3.input(z3.object({ id: z3.number().int().positive() })).mutation(async ({ input }) => {
    await deleteCategory(input.id);
    return { success: true };
  }),
  // Subcategory admin endpoints
  createSubcategory: adminProcedure3.input(z3.object({
    categoryId: z3.number().int().positive(),
    name: z3.string().min(1).max(100),
    slug: z3.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
    description: z3.string().optional(),
    sortOrder: z3.number().int().default(0),
    isActive: z3.boolean().default(true)
  })).mutation(async ({ input }) => {
    return createSubcategory(input);
  }),
  updateSubcategory: adminProcedure3.input(z3.object({
    id: z3.number().int().positive(),
    name: z3.string().min(1).max(100).optional(),
    slug: z3.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
    description: z3.string().optional(),
    sortOrder: z3.number().int().optional(),
    isActive: z3.boolean().optional()
  })).mutation(async ({ input }) => {
    const { id, ...data } = input;
    await updateSubcategory(id, data);
    return { success: true };
  }),
  deleteSubcategory: adminProcedure3.input(z3.object({ id: z3.number().int().positive() })).mutation(async ({ input }) => {
    await deleteSubcategory(input.id);
    return { success: true };
  })
});
var productAutomationRouter = router({
  settings: adminProcedure3.query(async () => {
    await ensureProductAutomationTables();
    const settings = await getProductAutomationSettings();
    return {
      settings: settings ?? {
        isEnabled: false,
        runEveryMinutes: 60,
        maxSourcesPerRun: 1,
        geminiRequestsPerMinuteLimit: 8,
        geminiRequestsPerDayLimit: 100,
        defaultCategoryId: null,
        defaultSubcategoryId: null,
        defaultCategoryLabel: null,
        savedModelId: null,
        defaultPrompt: "Place the extracted garment on the model naturally.",
        lastRunAt: null,
        lastRunSummary: null
      },
      requestsPerSource: productAutomationRequestBudgetPerSource
    };
  }),
  saveSettings: adminProcedure3.input(z3.object({
    isEnabled: z3.boolean().default(false),
    runEveryMinutes: z3.number().int().min(1).max(1440),
    maxSourcesPerRun: z3.number().int().min(1).max(25),
    geminiRequestsPerMinuteLimit: z3.number().int().min(productAutomationRequestBudgetPerSource).max(1e3),
    geminiRequestsPerDayLimit: z3.number().int().min(productAutomationRequestBudgetPerSource).max(1e5),
    defaultCategoryId: z3.number().int().positive().nullable().optional(),
    defaultSubcategoryId: z3.number().int().positive().nullable().optional(),
    defaultCategoryLabel: z3.string().max(100).nullable().optional(),
    savedModelId: z3.number().int().positive().nullable().optional(),
    defaultPrompt: z3.string().min(5).max(1e3).optional()
  })).mutation(async ({ input, ctx }) => {
    await ensureProductAutomationTables();
    if (input.isEnabled && !input.savedModelId) {
      throw new TRPCError4({
        code: "BAD_REQUEST",
        message: "Select a saved model before enabling the automation."
      });
    }
    const existing = await getProductAutomationSettings();
    const payload = {
      ownerUserId: ctx.user.id,
      isEnabled: input.isEnabled,
      runEveryMinutes: input.runEveryMinutes,
      maxSourcesPerRun: input.maxSourcesPerRun,
      geminiRequestsPerMinuteLimit: input.geminiRequestsPerMinuteLimit,
      geminiRequestsPerDayLimit: input.geminiRequestsPerDayLimit,
      defaultCategoryId: input.defaultCategoryId ?? null,
      defaultSubcategoryId: input.defaultSubcategoryId ?? null,
      defaultCategoryLabel: input.defaultCategoryLabel ?? null,
      savedModelId: input.savedModelId ?? null,
      defaultPrompt: input.defaultPrompt || "Place the extracted garment on the model naturally.",
      lastRunAt: existing?.lastRunAt ?? null,
      lastRunSummary: existing?.lastRunSummary ?? null
    };
    const saved = await upsertProductAutomationSettings(payload);
    return { success: true, settings: saved };
  }),
  listSources: adminProcedure3.query(async () => {
    await ensureProductAutomationTables();
    return listProductAutomationSources();
  }),
  enqueue: adminProcedure3.input(z3.object({
    urls: z3.array(z3.string().url()).min(1).max(200),
    categoryId: z3.number().int().positive().nullable().optional(),
    subcategoryId: z3.number().int().positive().nullable().optional(),
    categoryLabel: z3.string().max(100).nullable().optional(),
    promptOverride: z3.string().max(1e3).nullable().optional()
  })).mutation(async ({ input }) => {
    await ensureProductAutomationTables();
    const result = await enqueueProductAutomationSources(input.urls, {
      categoryId: input.categoryId ?? null,
      subcategoryId: input.subcategoryId ?? null,
      categoryLabel: input.categoryLabel ?? null,
      promptOverride: input.promptOverride ?? null
    });
    return { success: true, ...result };
  }),
  retrySource: adminProcedure3.input(z3.object({ id: z3.number().int().positive() })).mutation(async ({ input }) => {
    await ensureProductAutomationTables();
    await updateProductAutomationSource(input.id, {
      status: "queued",
      notes: null,
      nextAttemptAt: /* @__PURE__ */ new Date()
    });
    return { success: true };
  }),
  deleteSource: adminProcedure3.input(z3.object({ id: z3.number().int().positive() })).mutation(async ({ input }) => {
    await ensureProductAutomationTables();
    await deleteProductAutomationSource(input.id);
    return { success: true };
  }),
  runNow: adminProcedure3.mutation(async () => {
    await ensureProductAutomationTables();
    return triggerProductAutomationQueueRun({ manual: true });
  })
});
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  product: productRouter,
  category: categoryRouter,
  shipping: shippingRouter,
  cart: cartRouter,
  order: orderRouter,
  rfq: rfqRouter,
  blog: blogRouter,
  portfolio: portfolioRouter,
  testimonials: testimonialsRouter,
  contact: contactRouter,
  techPack: techPackRouter,
  aiAgent: aiAgentRouter,
  productAutomation: productAutomationRouter,
  adminSettings: router({
    getApiKey: adminProcedure3.query(async ({ ctx }) => {
      const { getDb: getDatabase } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { users: users2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eq4 } = await import("drizzle-orm");
      const db = await getDatabase();
      if (!db) return { hasKey: false, maskedKey: "" };
      const [user] = await db.select().from(users2).where(eq4(users2.id, ctx.user.id)).limit(1);
      const key = user?.geminiApiKey || "";
      return {
        hasKey: !!key,
        maskedKey: key ? key.substring(0, 6) + "..." + key.substring(key.length - 4) : ""
      };
    }),
    saveApiKey: adminProcedure3.input(z3.object({ apiKey: z3.string().max(255) })).mutation(async ({ input, ctx }) => {
      const { getDb: getDatabase } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { users: users2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eq4 } = await import("drizzle-orm");
      const db = await getDatabase();
      if (!db) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      await db.update(users2).set({ geminiApiKey: input.apiKey || null }).where(eq4(users2.id, ctx.user.id));
      return { success: true };
    }),
    getModelImage: adminProcedure3.query(async () => {
      try {
        const fs5 = await import("fs/promises");
        const path5 = await import("path");
        const filePath = path5.join(process.cwd(), "model_image.json");
        const data = await fs5.readFile(filePath, "utf-8");
        const parsed = JSON.parse(data);
        if (parsed && parsed.base64 && parsed.mimeType) {
          return parsed;
        }
        return null;
      } catch (err) {
        return null;
      }
    }),
    saveModelImage: adminProcedure3.input(z3.object({
      base64: z3.string(),
      mimeType: z3.string()
    })).mutation(async ({ input }) => {
      try {
        const fs5 = await import("fs/promises");
        const path5 = await import("path");
        const filePath = path5.join(process.cwd(), "model_image.json");
        await fs5.writeFile(filePath, JSON.stringify({
          base64: input.base64,
          mimeType: input.mimeType
        }));
        return { success: true };
      } catch (err) {
        throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR", message: "Failed to save model image" });
      }
    })
  })
});

// server/_core/context.ts
var IS_PRODUCTION = process.env.NODE_ENV === "production";
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (_oauthError) {
  }
  if (!user) {
    try {
      const cookieHeader = opts.req.headers.cookie || "";
      const tokenMatch = cookieHeader.match(/admin_token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;
      if (token) {
        const { jwtVerify: jwtVerify2 } = await import("jose");
        const JWT_SECRET = new TextEncoder().encode(
          process.env.JWT_SECRET || "fallback_super_secret_for_local_dev_only_12345"
        );
        const { payload } = await jwtVerify2(token, JWT_SECRET);
        if (payload.userId) {
          const { getDb: getDb2 } = await Promise.resolve().then(() => (init_db(), db_exports));
          const { users: users2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
          const { eq: eq4 } = await import("drizzle-orm");
          const db = await getDb2();
          if (db) {
            const results = await db.select().from(users2).where(eq4(users2.id, payload.userId)).limit(1);
            if (results[0]) {
              user = results[0];
            }
          }
        }
      }
    } catch (_jwtError) {
    }
  }
  const bypassEnabled = process.env.ENABLE_ADMIN_BYPASS === "true";
  if ((!IS_PRODUCTION || bypassEnabled) && !user) {
    user = {
      id: 1,
      openId: "remote-admin",
      name: "Admin User",
      email: "admin@pakhomiesind.com",
      role: "admin",
      loginMethod: "local",
      lastSignedIn: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs3 from "fs";
import path3 from "path";
import { fileURLToPath } from "url";
var __dirname2 = path3.dirname(fileURLToPath(import.meta.url));
async function setupVite(app, server) {
  const { createServer: createViteServer } = await import("vite");
  const { default: viteConfig } = await import("../../vite.config");
  const { nanoid: nanoid4 } = await import("nanoid");
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        __dirname2,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs3.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/entry-client.tsx"`,
        `src="/src/entry-client.tsx?v=${nanoid4()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const { html: appHtml, helmet, dehydratedState } = await render(url, req);
      let html = page.replace(`<!--ssr-outlet-->`, appHtml ?? "");
      if (dehydratedState) {
        const stateScript = `<script>window.__TRPC_DEHYDRATED_STATE__ = ${JSON.stringify(dehydratedState).replace(/</g, "\\u003c")};</script>`;
        html = html.replace(`</head>`, `${stateScript}</head>`);
      }
      if (helmet) {
        html = html.replace(
          `</head>`,
          `${helmet.title?.toString() || ""}${helmet.meta?.toString() || ""}${helmet.link?.toString() || ""}${helmet.script?.toString() || ""}</head>`
        );
      }
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  let distClientPath = path3.resolve(process.cwd(), "dist", "client");
  if (!fs3.existsSync(distClientPath)) {
    distClientPath = path3.resolve(process.cwd(), "dist", "public");
  }
  if (!fs3.existsSync(distClientPath)) {
    console.error(`[Static] Could not find any build directory at ${distClientPath}`);
    return;
  }
  console.log(`[Static] Serving client assets from: ${distClientPath}`);
  app.use(express.static(distClientPath, { index: false }));
  let ssrRender = null;
  const distServerPath = path3.resolve(__dirname2, "server");
  const serverEntryPath = path3.resolve(distServerPath, "entry-server.js");
  if (fs3.existsSync(serverEntryPath)) {
    import(
      /* @vite-ignore */
      `file://${serverEntryPath.replace(/\\/g, "/")}`
    ).then((mod) => {
      ssrRender = mod.render;
      console.log("[SSR] Server-side rendering enabled \u2713");
    }).catch((err) => {
      console.warn("[SSR] Could not load SSR entry, falling back to SPA mode:", err?.message || err);
    });
  } else {
    console.warn(`[SSR] No server entry found at ${serverEntryPath}. Running in SPA-only mode.`);
  }
  app.use("*", async (_req, res) => {
    try {
      const url = _req.originalUrl;
      const indexHtmlPath = path3.resolve(distClientPath, "index.html");
      let html = await fs3.promises.readFile(indexHtmlPath, "utf-8");
      if (ssrRender) {
        try {
          const { html: appHtml, helmet, dehydratedState } = await ssrRender(url, _req);
          html = html.replace(`<!--ssr-outlet-->`, appHtml ?? "");
          if (dehydratedState) {
            const stateScript = `<script>window.__TRPC_DEHYDRATED_STATE__ = ${JSON.stringify(dehydratedState).replace(/</g, "\\u003c")};</script>`;
            html = html.replace(`</head>`, `${stateScript}</head>`);
          }
          if (helmet) {
            html = html.replace(
              `</head>`,
              `${helmet.title?.toString() || ""}${helmet.meta?.toString() || ""}${helmet.link?.toString() || ""}${helmet.script?.toString() || ""}</head>`
            );
          }
        } catch (ssrErr) {
          console.error("[SSR] Render error, serving SPA fallback:", ssrErr?.message);
          html = html.replace(`<!--ssr-outlet-->`, "");
        }
      } else {
        html = html.replace(`<!--ssr-outlet-->`, "");
      }
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      console.error("[Static] Fatal error serving page:", e?.message);
      res.status(500).send("Internal Server Error");
    }
  });
}

// server/_core/index.ts
init_env();
import Stripe2 from "stripe";

// server/routes/fixDb.ts
init_db();
import { Router } from "express";
import { sql as sql3 } from "drizzle-orm";
var router2 = Router();
router2.get("/fix-db-schema", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "No database connection" });
    }
    await db.execute(sql3`
            ALTER TABLE \`users\`
            ADD COLUMN \`savedModelImageBase64\` LONGTEXT,
            ADD COLUMN \`savedModelImageMimeType\` VARCHAR(255);
        `);
    return res.json({ success: true, message: "Columns added successfully" });
  } catch (error) {
    if (error.message && error.message.includes("Duplicate column name")) {
      return res.json({ success: true, message: "Columns already exist" });
    }
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
});
router2.get("/setup-tryon-table", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "No database connection" });
    }
    await db.execute(sql3`
            CREATE TABLE IF NOT EXISTS \`saved_tryon_models\` (
              \`id\` INT AUTO_INCREMENT PRIMARY KEY,
              \`name\` VARCHAR(255),
              \`imageUrl\` VARCHAR(1000) NOT NULL,
              \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
        `);
    return res.json({ success: true, message: "saved_tryon_models table created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
});
var fixDb_default = router2;

// server/routes/sitemap.ts
init_db();
init_schema();
import { Router as Router2 } from "express";
import { eq as eq2, desc as desc2 } from "drizzle-orm";
var router3 = Router2();
var DOMAIN = "https://pakhomiesind.com";
var HREFLANG_ALTERNATES = [
  { lang: "en-us", country: "USA" },
  { lang: "en-gb", country: "UK" },
  { lang: "en-ca", country: "Canada" },
  { lang: "en-au", country: "Australia" },
  { lang: "en-de", country: "Germany" },
  { lang: "en-fr", country: "France" },
  { lang: "x-default", country: "Global" }
];
router3.get("/sitemap.xml", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).send("Database not available");
    }
    const activeProducts = await db.select({
      slug: products.slug,
      updatedAt: products.updatedAt,
      mainImage: products.mainImage,
      title: products.title
    }).from(products).where(eq2(products.isActive, true)).orderBy(desc2(products.updatedAt));
    const publishedPosts = await db.select({
      slug: blogPosts.slug,
      publishedAt: blogPosts.publishedAt,
      featuredImage: blogPosts.featuredImage,
      title: blogPosts.title,
      updatedAt: blogPosts.updatedAt
    }).from(blogPosts).where(eq2(blogPosts.published, true)).orderBy(desc2(blogPosts.publishedAt));
    const activePortfolio = await db.select({
      id: portfolioItems.id,
      updatedAt: portfolioItems.updatedAt,
      coverImage: portfolioItems.coverImage,
      title: portfolioItems.title
    }).from(portfolioItems).where(eq2(portfolioItems.isActive, true)).orderBy(desc2(portfolioItems.updatedAt));
    const staticPages = [
      { path: "", priority: "1.0", changefreq: "daily", lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] },
      { path: "/about", priority: "0.9", changefreq: "monthly", lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] },
      { path: "/services", priority: "0.9", changefreq: "monthly", lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] },
      { path: "/products", priority: "0.9", changefreq: "weekly", lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] },
      { path: "/shop", priority: "0.9", changefreq: "daily", lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] },
      { path: "/portfolio", priority: "0.8", changefreq: "weekly", lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] },
      { path: "/blog", priority: "0.8", changefreq: "daily", lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] },
      { path: "/rfq", priority: "0.9", changefreq: "monthly", lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] },
      { path: "/contact", priority: "0.8", changefreq: "monthly", lastmod: (/* @__PURE__ */ new Date()).toISOString().split("T")[0] }
    ];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;
    staticPages.forEach((page) => {
      xml += `
  <url>
    <loc>${DOMAIN}${page.path}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;
      if (page.path === "" || page.path === "/products" || page.path === "/shop") {
        HREFLANG_ALTERNATES.forEach((alt) => {
          xml += `
    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${DOMAIN}${page.path}" />`;
        });
      }
      xml += `
  </url>`;
    });
    activeProducts.forEach((p) => {
      const lastmod = (p.updatedAt || /* @__PURE__ */ new Date()).toISOString().split("T")[0];
      xml += `
  <url>
    <loc>${DOMAIN}/shop/${p.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`;
      if (p.mainImage) {
        xml += `
    <image:image>
      <image:loc>${p.mainImage.startsWith("http") ? p.mainImage : DOMAIN + p.mainImage}</image:loc>
      <image:title>${escapeXml(p.title || "Product Image")}</image:title>
      <image:caption>${escapeXml(p.title || "Custom apparel manufactured in Sialkot, Pakistan")}</image:caption>
    </image:image>`;
      }
      xml += `
  </url>`;
    });
    publishedPosts.forEach((post) => {
      const lastmod = (post.updatedAt || post.publishedAt || /* @__PURE__ */ new Date()).toISOString().split("T")[0];
      xml += `
  <url>
    <loc>${DOMAIN}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>`;
      if (post.featuredImage) {
        xml += `
    <image:image>
      <image:loc>${post.featuredImage.startsWith("http") ? post.featuredImage : DOMAIN + post.featuredImage}</image:loc>
      <image:title>${escapeXml(post.title || "Blog Image")}</image:title>
    </image:image>`;
      }
      xml += `
  </url>`;
    });
    activePortfolio.forEach((item) => {
      const lastmod = (item.updatedAt || /* @__PURE__ */ new Date()).toISOString().split("T")[0];
      xml += `
  <url>
    <loc>${DOMAIN}/portfolio/${item.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>`;
      if (item.coverImage) {
        xml += `
    <image:image>
      <image:loc>${item.coverImage.startsWith("http") ? item.coverImage : DOMAIN + item.coverImage}</image:loc>
      <image:title>${escapeXml(item.title || "Portfolio Item")}</image:title>
    </image:image>`;
      }
      xml += `
  </url>`;
    });
    const regions = [
      { code: "usa", lang: "en-us" },
      { code: "uk", lang: "en-gb" },
      { code: "europe", lang: "en-eu" },
      { code: "australia", lang: "en-au" },
      { code: "canada", lang: "en-ca" },
      { code: "germany", lang: "en-de" },
      { code: "france", lang: "en-fr" }
    ];
    regions.forEach((region) => {
      xml += `
  <url>
    <loc>${DOMAIN}/manufacturing/${region.code}</loc>
    <lastmod>${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="${region.lang}" href="${DOMAIN}/manufacturing/${region.code}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/manufacturing/usa" />
  </url>`;
    });
    xml += `
</urlset>`;
    res.header("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error("[Sitemap] Generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
});
function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
var sitemap_default = router3;

// server/_core/index.ts
init_schema();
import { eq as eq3 } from "drizzle-orm";
process.on("unhandledRejection", (reason) => {
  console.error("[Fatal] Unhandled Rejection at:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[Fatal] Uncaught Exception:", err);
});
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.post("/api/webhooks/stripe", express2.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!sig || !webhookSecret) {
      console.warn("[Stripe] Webhook error: Missing signature or webhook secret");
      res.status(400).send("Webhook Error: Missing signature or secret");
      return;
    }
    let event;
    try {
      const stripe = new Stripe2(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" });
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error(`[Stripe] Webhook signature verification failed: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      try {
        const db = await getDbLocal();
        if (db) {
          console.log(`[Stripe] Checkout completed for session ${session.id}. Marking as paid...`);
          await db.update(orders).set({ status: "paid", stripePaymentIntentId: session.payment_intent }).where(eq3(orders.stripeSessionId, session.id));
        }
      } catch (e) {
        console.error(`[Stripe] Failed to update order status in DB:`, e);
      }
    }
    res.json({ received: true });
  });
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  const MODEL_MAP = {
    "oversize-hoodie.glb": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/zuxviTdYwpHzhDSE.glb",
    "sweatshirt.glb": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/nfJjpbTmWQynLNVx.glb",
    "tshirt-normal.glb": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/adtYgrITgJZMRrNl.glb",
    "raglan-tshirt.glb": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/PxqQBXgbWoMAKRZJ.glb",
    "soccer-uniform.glb": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/uhdDWMRBkGKpuvPv.glb",
    "basketball-uniform.glb": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/YqjgRtpukMWNALIs.glb",
    "american-football.glb": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/RnsDwykJBkcaHyOg.glb",
    "trouser.glb": "https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/ynQDWlpbRtXSgxAB.glb"
  };
  app.get("/api/models/:filename", async (req, res) => {
    const { filename } = req.params;
    const cdnUrl = MODEL_MAP[filename];
    if (!cdnUrl) {
      res.status(404).json({ error: "Model not found" });
      return;
    }
    try {
      const upstream = await fetch(cdnUrl);
      if (!upstream.ok) {
        res.status(502).json({ error: "Upstream fetch failed" });
        return;
      }
      res.setHeader("Content-Type", "model/gltf-binary");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=86400");
      const contentLength = upstream.headers.get("content-length");
      if (contentLength) res.setHeader("Content-Length", contentLength);
      const reader = upstream.body.getReader();
      const pump = async () => {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          return;
        }
        res.write(Buffer.from(value));
        return pump();
      };
      await pump();
    } catch (err) {
      console.error("[GLB proxy] Error:", err);
      res.status(500).json({ error: "Proxy error" });
    }
  });
  registerOAuthRoutes(app);
  app.use("/api", fixDb_default);
  app.use("/", sitemap_default);
  const crypto = await import("crypto");
  const { SignJWT: SignJWTLocal } = await import("jose");
  const { getDb: getDbLocal } = await Promise.resolve().then(() => (init_db(), db_exports));
  const JWT_SECRET_LOCAL = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback_super_secret_for_local_dev_only_12345"
  );
  function hashPwd(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const key = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${key}`;
  }
  function verifyPwd(password, hash) {
    try {
      const [salt, key] = hash.split(":");
      if (!salt || !key) return false;
      return crypto.scryptSync(password, salt, 64).toString("hex") === key;
    } catch {
      return false;
    }
  }
  try {
    const seedDb = await getDbLocal().catch(() => null);
    if (seedDb) {
      const { users: usersTable } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eqOp } = await import("drizzle-orm");
      const allAdmins = await seedDb.select().from(usersTable).where(eqOp(usersTable.role, "admin")).catch(() => []);
      const hasValidAdmin = allAdmins.some((a) => a.password && a.password.includes(":"));
      if (!hasValidAdmin) {
        const noPasswordAdmin = allAdmins.find((a) => !a.password || !a.password.includes(":"));
        if (noPasswordAdmin) {
          console.log("[Auth] Updating admin password for:", noPasswordAdmin.email);
          await seedDb.update(usersTable).set({ password: hashPwd("admin123"), email: "admin@pakhomiesind.com" }).where(eqOp(usersTable.id, noPasswordAdmin.id)).catch(() => {
          });
        } else {
          console.log("[Auth] Creating default admin: admin@pakhomiesind.com / admin123");
          await seedDb.insert(usersTable).values({
            openId: "local-admin-" + Date.now(),
            name: "Super Admin",
            email: "admin@pakhomiesind.com",
            role: "admin",
            loginMethod: "local",
            password: hashPwd("admin123")
          }).catch(() => {
          });
        }
      } else {
        console.log("[Auth] Admin with valid password exists");
      }
    } else {
      console.warn("[Auth] Database not available for admin seeding. Skipping.");
    }
  } catch (seedErr) {
    console.error("[Auth] Admin seed error (non-fatal):", seedErr);
  }
  app.post("/api/admin/login", async (req, res) => {
    try {
      console.log("[Login] Attempt received");
      const loginDb = await getDbLocal();
      if (!loginDb) return res.status(500).json({ error: "Database not available" });
      const { users: usersTable } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eqOp } = await import("drizzle-orm");
      const { email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });
      console.log("[Login] Looking up:", email);
      const results = await loginDb.select().from(usersTable).where(eqOp(usersTable.email, email)).limit(1);
      const user = results[0];
      if (!user) return res.status(401).json({ error: "Invalid credentials." });
      if (user.role !== "admin") return res.status(401).json({ error: "Not an admin." });
      if (!user.password) return res.status(401).json({ error: "Password not set." });
      if (!verifyPwd(password, user.password)) {
        return res.status(401).json({ error: "Invalid credentials." });
      }
      console.log("[Login] Password OK, creating JWT...");
      loginDb.update(usersTable).set({ lastSignedIn: /* @__PURE__ */ new Date() }).where(eqOp(usersTable.id, user.id)).catch(() => {
      });
      const token = await new SignJWTLocal({ userId: user.id, role: user.role }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(JWT_SECRET_LOCAL);
      res.cookie("admin_token", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: req.protocol === "https" || req.headers["x-forwarded-proto"] === "https",
        maxAge: 7 * 24 * 60 * 60 * 1e3
      });
      console.log("[Login] Success!", user.email);
      return res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      console.error("[Login] ERROR:", err?.message, err?.stack);
      return res.status(500).json({ error: "Login error: " + (err?.message || "unknown") });
    }
  });
  app.post("/api/admin/logout", (_req, res) => {
    res.clearCookie("admin_token", { path: "/" });
    return res.json({ success: true });
  });
  app.get("/api/admin/debug", async (_req, res) => {
    const isProd = process.env.NODE_ENV === "production";
    const resolvedUploadsPath = isProd ? path4.resolve(process.cwd(), "uploads") : path4.resolve(process.cwd(), "uploads");
    const productsUploadsPath = path4.join(resolvedUploadsPath, "products");
    const info = {
      nodeVersion: process.version,
      dbUrl: process.env.DATABASE_URL ? "SET" : "NOT SET",
      env: process.env.NODE_ENV,
      cwd: process.cwd(),
      dirname: typeof __dirname !== "undefined" ? __dirname : "undefined_in_esm",
      resolvedUploadsPath,
      productsUploadsPath,
      uploadsDirExists: fs4.existsSync(resolvedUploadsPath),
      productsDirExists: fs4.existsSync(productsUploadsPath)
    };
    try {
      if (info.uploadsDirExists) {
        const readdirRecursive = (dir) => {
          const results = [];
          const list = fs4.readdirSync(dir);
          list.forEach((file) => {
            const filePath = path4.join(dir, file);
            const stat = fs4.statSync(filePath);
            if (stat && stat.isDirectory()) {
              results.push(...readdirRecursive(filePath));
            } else {
              results.push(filePath);
            }
          });
          return results;
        };
        info.filesInUploads = readdirRecursive(resolvedUploadsPath).slice(0, 50);
      }
    } catch (e) {
      info.fsError = e.message;
    }
    try {
      const debugDb = await getDbLocal();
      if (!debugDb) {
        info.error = "Database not connected";
        return res.json(info);
      }
      info.dbConnected = true;
      return res.json(info);
    } catch (err) {
      info.error = err?.message;
      return res.json(info);
    }
  });
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  let uploadsPath;
  if (ENV.storagePath) {
    uploadsPath = path4.isAbsolute(ENV.storagePath) ? ENV.storagePath : path4.resolve(process.cwd(), ENV.storagePath);
  } else if (ENV.isProduction) {
    const persistentDir = process.env.PERSISTENT_UPLOADS_DIR || path4.join(process.env.HOME || process.env.USERPROFILE || "/tmp", "ssm_persistent_uploads");
    uploadsPath = persistentDir;
  } else {
    uploadsPath = path4.join(process.cwd(), "uploads");
  }
  console.log(`[Storage] Serving uploads from: ${uploadsPath}`);
  if (!fs4.existsSync(uploadsPath)) {
    console.log(`[Storage] Creating uploads directory at ${uploadsPath}...`);
    try {
      fs4.mkdirSync(uploadsPath, { recursive: true });
    } catch (err) {
      console.error(`[Storage] CRITICAL ERROR: Could not create uploads directory!`, err);
    }
  }
  const LIVE_DOMAIN = "https://pakhomiesind.com";
  const repoUploadsPath = path4.join(process.cwd(), "uploads");
  app.use("/uploads", express2.static(uploadsPath));
  if (path4.resolve(repoUploadsPath) !== path4.resolve(uploadsPath) && fs4.existsSync(repoUploadsPath)) {
    app.use("/uploads", express2.static(repoUploadsPath));
  }
  app.use("/uploads", (req, res) => {
    if (req.path === "/" || req.path === "") return res.status(404).send("File not found");
    const forwardedHost = req.headers["x-forwarded-host"];
    const requestHost = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost || req.get("host") || "";
    const isLiveHost = requestHost.includes("pakhomiesind.com");
    if (isLiveHost) {
      console.log(`[Storage] Upload missing on live host: ${req.path}`);
      return res.status(404).send("File not found");
    }
    console.log(`[Storage] Local image not found, redirecting to: ${LIVE_DOMAIN}/uploads${req.path}`);
    res.redirect(`${LIVE_DOMAIN}/uploads${req.path}`);
  });
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const portEnv = process.env.PORT || "3000";
  let port = parseInt(portEnv, 10);
  if (isNaN(port)) {
    port = portEnv;
  }
  if (process.env.NODE_ENV !== "production" && typeof port === "number") {
    const availablePort = await findAvailablePort(port);
    if (availablePort !== port) {
      console.log(`Port ${port} is busy, using port ${availablePort} instead`);
      port = availablePort;
    }
  }
  process.env.PORT = port.toString();
  startProductAutomationScheduler();
  server.listen(port, () => {
    if (typeof port === "string") {
      console.log(`Server running on socket pipe: ${port}`);
    } else {
      console.log(`Server running on http://localhost:${port}/`);
    }
  });
}
startServer().catch(console.error);
