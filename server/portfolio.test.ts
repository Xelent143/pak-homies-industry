import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PORTFOLIO_ITEM = {
  id: 1,
  title: "Camo Hunting Jacket Set",
  category: "Hunting Wear",
  description: "Premium 3-layer camo jacket for hunting enthusiasts",
  tags: '["camo","waterproof","fleece"]',
  coverImage: "https://cdn.example.com/portfolio/jacket.jpg",
  ogImage: null,
  seoTitle: "Camo Hunting Jacket | Pak Homies Industry",
  seoDescription: "Custom hunting jackets manufactured in Sialkot, Pakistan",
  seoKeywords: "hunting jacket manufacturer, camo jacket wholesale",
  geoTarget: "USA, UK",
  isFeatured: true,
  isActive: true,
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_PORTFOLIO_ITEM_WITH_IMAGES = {
  ...MOCK_PORTFOLIO_ITEM,
  images: [
    {
      id: 1,
      portfolioItemId: 1,
      imageUrl: "https://cdn.example.com/portfolio/jacket-1.jpg",
      fileKey: "portfolio/1/abc123.jpg",
      altText: "Camo Hunting Jacket Front",
      caption: "Front view",
      sortOrder: 0,
      createdAt: new Date(),
    },
    {
      id: 2,
      portfolioItemId: 1,
      imageUrl: "https://cdn.example.com/portfolio/jacket-2.jpg",
      fileKey: "portfolio/1/def456.jpg",
      altText: "Camo Hunting Jacket Back",
      caption: "Back view",
      sortOrder: 1,
      createdAt: new Date(),
    },
  ],
};

// ─── Mock DB + storage ────────────────────────────────────────────────────────

vi.mock("./db", () => ({
  // Auth
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(null),
  // Products (required by router imports)
  getActiveProducts: vi.fn().mockResolvedValue([]),
  getAllProducts: vi.fn().mockResolvedValue([]),
  getFeaturedProducts: vi.fn().mockResolvedValue([]),
  getProductBySlug: vi.fn().mockResolvedValue(null),
  getProductById: vi.fn().mockResolvedValue(null),
  createProduct: vi.fn().mockResolvedValue({ id: 1 }),
  updateProduct: vi.fn().mockResolvedValue(undefined),
  deleteProduct: vi.fn().mockResolvedValue(undefined),
  getProductImages: vi.fn().mockResolvedValue([]),
  addProductImage: vi.fn().mockResolvedValue({ id: 1 }),
  deleteProductImage: vi.fn().mockResolvedValue(undefined),
  reorderProductImages: vi.fn().mockResolvedValue(undefined),
  getSlabPrices: vi.fn().mockResolvedValue([]),
  setSlabPrices: vi.fn().mockResolvedValue(undefined),
  getSizeChart: vi.fn().mockResolvedValue(null),
  upsertSizeChart: vi.fn().mockResolvedValue(undefined),
  // Shipping
  getActiveShippingZones: vi.fn().mockResolvedValue([]),
  getAllShippingZones: vi.fn().mockResolvedValue([]),
  createShippingZone: vi.fn().mockResolvedValue({ id: 1 }),
  updateShippingZone: vi.fn().mockResolvedValue(undefined),
  deleteShippingZone: vi.fn().mockResolvedValue(undefined),
  findShippingZoneForCountry: vi.fn().mockResolvedValue(null),
  // Cart
  getCartItems: vi.fn().mockResolvedValue([]),
  upsertCartItem: vi.fn().mockResolvedValue(undefined),
  updateCartItemQty: vi.fn().mockResolvedValue(undefined),
  removeCartItem: vi.fn().mockResolvedValue(undefined),
  clearCart: vi.fn().mockResolvedValue(undefined),
  // Orders
  createOrder: vi.fn().mockResolvedValue({ id: 1, orderNumber: "SSM-2026-0001" }),
  getOrderByNumber: vi.fn().mockResolvedValue(null),
  getAllOrders: vi.fn().mockResolvedValue([]),
  updateOrderStatus: vi.fn().mockResolvedValue(undefined),
  // RFQ
  createRfqSubmission: vi.fn().mockResolvedValue({ id: 1 }),
  getAllRfqSubmissions: vi.fn().mockResolvedValue([]),
  // Blog
  getPublishedBlogPosts: vi.fn().mockResolvedValue([]),
  getBlogPostBySlug: vi.fn().mockResolvedValue(null),
  // Portfolio — inline data to avoid hoisting issues
  listPortfolioItems: vi.fn().mockResolvedValue([{
    id: 1, title: "Camo Hunting Jacket Set", category: "Hunting Wear",
    description: "Premium 3-layer camo jacket", tags: '["camo","waterproof"]',
    coverImage: "https://cdn.example.com/portfolio/jacket.jpg", ogImage: null,
    seoTitle: null, seoDescription: null, seoKeywords: null, geoTarget: "USA, UK",
    isFeatured: true, isActive: true, sortOrder: 0,
    createdAt: new Date(), updatedAt: new Date(),
  }]),
  getPortfolioItemWithImages: vi.fn().mockResolvedValue({
    id: 1, title: "Camo Hunting Jacket Set", category: "Hunting Wear",
    description: "Premium 3-layer camo jacket", tags: '["camo","waterproof"]',
    coverImage: "https://cdn.example.com/portfolio/jacket.jpg", ogImage: null,
    seoTitle: null, seoDescription: null, seoKeywords: null, geoTarget: "USA, UK",
    isFeatured: true, isActive: true, sortOrder: 0,
    createdAt: new Date(), updatedAt: new Date(),
    images: [
      { id: 1, portfolioItemId: 1, imageUrl: "https://cdn.example.com/portfolio/jacket-1.jpg",
        fileKey: "portfolio/1/abc.jpg", altText: "Front", caption: null, sortOrder: 0, createdAt: new Date() },
      { id: 2, portfolioItemId: 1, imageUrl: "https://cdn.example.com/portfolio/jacket-2.jpg",
        fileKey: "portfolio/1/def.jpg", altText: "Back", caption: null, sortOrder: 1, createdAt: new Date() },
    ],
  }),
  getPortfolioCategories: vi.fn().mockResolvedValue(["Hunting Wear", "Sports Wear"]),
  createPortfolioItem: vi.fn().mockResolvedValue({ id: 2 }),
  updatePortfolioItem: vi.fn().mockResolvedValue(undefined),
  deletePortfolioItem: vi.fn().mockResolvedValue(undefined),
  addPortfolioImage: vi.fn().mockResolvedValue({ id: 3 }),
  deletePortfolioImage: vi.fn().mockResolvedValue(undefined),
  reorderPortfolioImages: vi.fn().mockResolvedValue(undefined),
  // Testimonials
  getFeaturedTestimonials: vi.fn().mockResolvedValue([]),
  // Contact
  createContactSubmission: vi.fn().mockResolvedValue({ id: 1 }),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "portfolio/2/test.jpg", url: "https://cdn.example.com/portfolio/2/test.jpg" }),
}));

// ─── Context helpers ──────────────────────────────────────────────────────────

function makePublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeAdminCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-open-id",
      email: "admin@sialkotsamplementasters.com",
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeUserCtx(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "user-open-id",
      email: "buyer@example.com",
      name: "Buyer",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── portfolio.list ───────────────────────────────────────────────────────────

describe("portfolio.list", () => {
  it("returns portfolio items for public users", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.portfolio.list({});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("accepts category filter", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.portfolio.list({ category: "Hunting Wear" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns items without category filter", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.portfolio.list(undefined);
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── portfolio.byId ───────────────────────────────────────────────────────────

describe("portfolio.byId", () => {
  it("returns item with images for public users", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.portfolio.byId({ id: 1 });
    expect(result).toBeTruthy();
    expect(result?.id).toBe(1);
    expect(result?.images).toBeDefined();
    expect(Array.isArray(result?.images)).toBe(true);
  });

  it("returns multiple images for a portfolio item", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.portfolio.byId({ id: 1 });
    expect(result?.images.length).toBe(2);
    expect(result?.images[0].sortOrder).toBe(0);
    expect(result?.images[1].sortOrder).toBe(1);
  });
});

// ─── portfolio.categories ─────────────────────────────────────────────────────

describe("portfolio.categories", () => {
  it("returns list of categories", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.portfolio.categories();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

// ─── portfolio.create ─────────────────────────────────────────────────────────

describe("portfolio.create", () => {
  it("allows admin to create portfolio item", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.portfolio.create({
      title: "New Ski Jacket Collection",
      category: "Ski Wear",
      description: "Premium ski jackets for winter sports brands",
      tags: '["ski","waterproof","insulated"]',
      seoTitle: "Ski Jacket Manufacturer | Pak Homies Industry",
      seoDescription: "Custom ski jackets manufactured in Pakistan",
      seoKeywords: "ski jacket manufacturer, ski wear wholesale",
      geoTarget: "Europe, USA",
      isFeatured: false,
      isActive: true,
    });
    expect(result).toBeTruthy();
    expect(result.id).toBeDefined();
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.portfolio.create({ title: "Test Item", category: "Streetwear" })
    ).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.portfolio.create({ title: "Test Item", category: "Streetwear" })
    ).rejects.toThrow();
  });

  it("requires title and category", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    await expect(
      caller.portfolio.create({ title: "", category: "Streetwear" })
    ).rejects.toThrow();
  });
});

// ─── portfolio.update ─────────────────────────────────────────────────────────

describe("portfolio.update", () => {
  it("allows admin to update portfolio item", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.portfolio.update({
      id: 1,
      title: "Updated Camo Hunting Jacket",
      isFeatured: true,
    });
    expect(result).toEqual({ success: true });
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.portfolio.update({ id: 1, title: "Hacked Title" })
    ).rejects.toThrow();
  });
});

// ─── portfolio.delete ─────────────────────────────────────────────────────────

describe("portfolio.delete", () => {
  it("allows admin to delete portfolio item", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.portfolio.delete({ id: 1 });
    expect(result).toEqual({ success: true });
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.portfolio.delete({ id: 1 })
    ).rejects.toThrow();
  });
});

// ─── portfolio.deleteImage ────────────────────────────────────────────────────

describe("portfolio.deleteImage", () => {
  it("allows admin to delete an image", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.portfolio.deleteImage({ imageId: 1 });
    expect(result).toEqual({ success: true });
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.portfolio.deleteImage({ imageId: 1 })
    ).rejects.toThrow();
  });
});

// ─── portfolio.reorderImages ──────────────────────────────────────────────────

describe("portfolio.reorderImages", () => {
  it("allows admin to reorder images", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.portfolio.reorderImages([
      { id: 1, sortOrder: 1 },
      { id: 2, sortOrder: 0 },
    ]);
    expect(result).toEqual({ success: true });
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.portfolio.reorderImages([{ id: 1, sortOrder: 0 }])
    ).rejects.toThrow();
  });
});

// ─── portfolio.setCover ───────────────────────────────────────────────────────

describe("portfolio.setCover", () => {
  it("allows admin to set cover image", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.portfolio.setCover({
      portfolioItemId: 1,
      imageUrl: "https://cdn.example.com/portfolio/jacket-2.jpg",
    });
    expect(result).toEqual({ success: true });
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.portfolio.setCover({ portfolioItemId: 1, imageUrl: "https://example.com/img.jpg" })
    ).rejects.toThrow();
  });
});

// ─── portfolio.uploadImage ────────────────────────────────────────────────────

describe("portfolio.uploadImage", () => {
  it("allows admin to upload an image", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    // Use a tiny 1x1 transparent PNG in base64
    const tinyPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const result = await caller.portfolio.uploadImage({
      portfolioItemId: 1,
      imageBase64: tinyPng,
      mimeType: "image/png",
      altText: "Test image",
      caption: "Test caption",
      sortOrder: 0,
    });
    expect(result).toBeTruthy();
    expect(result.id).toBeDefined();
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.portfolio.uploadImage({
        portfolioItemId: 1,
        imageBase64: "abc",
        mimeType: "image/jpeg",
      })
    ).rejects.toThrow();
  });
});

