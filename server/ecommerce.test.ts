import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock DB helpers ──────────────────────────────────────────────────────────

vi.mock("./db", () => {
  const MOCK_PRODUCT = {
    id: 1,
    title: "Custom Heavyweight T-Shirt",
    slug: "custom-heavyweight-tshirt",
    category: "T-Shirts",
    shortDescription: "Premium 280GSM ring-spun cotton tee",
    description: "Full description here",
    mainImage: "https://example.com/tshirt.jpg",
    samplePrice: "25.00",
    material: "280GSM Ring-Spun Cotton",
    availableSizes: '["S","M","L","XL","2XL"]',
    availableColors: '["Black","White","Navy"]',
    isFeatured: true,
    isActive: true,
    freeShipping: false,
    sortOrder: 0,
    seoTitle: "Custom T-Shirt | Xelent",
    seoDescription: "Order custom tshirts in bulk",
    seoKeywords: "custom tshirt wholesale",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const MOCK_ZONE = {
    id: 1,
    zoneName: "North America",
    countries: '["US","CA"]',
    baseRate: "15.00",
    perUnitRate: "0.50",
    perKgRate: "2.00",
    minDays: 7,
    maxDays: 14,
    currency: "USD",
    isActive: true,
  };
  return {
  getDb: vi.fn().mockResolvedValue(null),
  // Products
  getActiveProducts: vi.fn().mockResolvedValue([MOCK_PRODUCT]),
  getAllProducts: vi.fn().mockResolvedValue([MOCK_PRODUCT]),
  getFeaturedProducts: vi.fn().mockResolvedValue([MOCK_PRODUCT]),
  getProductBySlug: vi.fn().mockResolvedValue({
    ...MOCK_PRODUCT,
    slabs: [
      { id: 1, productId: 1, minQty: 10, maxQty: 24, pricePerUnit: "15.00", label: "Starter", sortOrder: 0 },
      { id: 2, productId: 1, minQty: 25, maxQty: null, pricePerUnit: "10.00", label: "Bulk", sortOrder: 1 },
    ],
    images: [],
    sizeChart: null,
  }),
  getProductById: vi.fn().mockResolvedValue(MOCK_PRODUCT),
  createProduct: vi.fn().mockResolvedValue({ id: 2 }),
  updateProduct: vi.fn().mockResolvedValue(undefined),
  deleteProduct: vi.fn().mockResolvedValue(undefined),
  // Product images
  getProductImages: vi.fn().mockResolvedValue([]),
  addProductImage: vi.fn().mockResolvedValue({ id: 1 }),
  deleteProductImage: vi.fn().mockResolvedValue(undefined),
  reorderProductImages: vi.fn().mockResolvedValue(undefined),
  // Slab prices
  getSlabPrices: vi.fn().mockResolvedValue([]),
  setSlabPrices: vi.fn().mockResolvedValue(undefined),
  // Size chart
  getSizeChart: vi.fn().mockResolvedValue(null),
  upsertSizeChart: vi.fn().mockResolvedValue(undefined),
  // Shipping
  getActiveShippingZones: vi.fn().mockResolvedValue([MOCK_ZONE]),
  getAllShippingZones: vi.fn().mockResolvedValue([MOCK_ZONE]),
  createShippingZone: vi.fn().mockResolvedValue({ id: 2 }),
  updateShippingZone: vi.fn().mockResolvedValue(undefined),
  deleteShippingZone: vi.fn().mockResolvedValue(undefined),
  findShippingZoneForCountry: vi.fn().mockImplementation(async (code: string) =>
    code === "US" || code === "CA" ? MOCK_ZONE : null
  ),
  // Cart
  getCartItems: vi.fn().mockResolvedValue([]),
  upsertCartItem: vi.fn().mockResolvedValue(undefined),
  updateCartItemQty: vi.fn().mockResolvedValue(undefined),
  removeCartItem: vi.fn().mockResolvedValue(undefined),
  clearCart: vi.fn().mockResolvedValue(undefined),
  // Orders
  createOrder: vi.fn().mockResolvedValue({ id: 1, orderNumber: "XLT-2026-0001" }),
  getOrderByNumber: vi.fn().mockResolvedValue(null),
  getAllOrders: vi.fn().mockResolvedValue([]),
  updateOrderStatus: vi.fn().mockResolvedValue(undefined),
  // RFQ
  createRfqSubmission: vi.fn().mockResolvedValue({ id: 1 }),
  getAllRfqSubmissions: vi.fn().mockResolvedValue([]),
  // Contact
  createContactSubmission: vi.fn().mockResolvedValue({ id: 1 }),
  // Blog
  getPublishedBlogPosts: vi.fn().mockResolvedValue([]),
  getBlogPostBySlug: vi.fn().mockResolvedValue(null),
  // Portfolio
  getPortfolioItems: vi.fn().mockResolvedValue([]),
  getFeaturedPortfolioItems: vi.fn().mockResolvedValue([]),
  // Testimonials
  getTestimonials: vi.fn().mockResolvedValue([]),
  // Users
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(null),
};
});

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
      email: "admin@xelent.pk",
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

// ─── Product router tests ─────────────────────────────────────────────────────

describe("product.list", () => {
  it("returns active products for public users", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.product.list({});
    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts category filter", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.product.list({ category: "T-Shirts" });
    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts featured filter", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.product.list({ featured: true });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("product.bySlug", () => {
  it("returns product with slabs and images", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.product.bySlug({ slug: "custom-heavyweight-tshirt" });
    expect(result).not.toBeNull();
    expect(result?.slabs).toBeDefined();
    expect(Array.isArray(result?.slabs)).toBe(true);
  });
});

describe("product.adminList", () => {
  it("requires admin role", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.product.adminList()).rejects.toThrow();
  });

  it("returns products for admin", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.product.adminList();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("product.create", () => {
  it("requires admin role", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.product.create({
        title: "Test", slug: "test", category: "T-Shirts",
        shortDescription: "", description: "", mainImage: "",
        samplePrice: "", material: "", availableSizes: '["S"]',
        availableColors: '["Black"]', isFeatured: false, isActive: true,
        freeShipping: false, sortOrder: 0, seoTitle: "", seoDescription: "",
        seoKeywords: "", slabs: [], sizeChart: { chartData: "[]", unit: "inches", notes: "" },
      })
    ).rejects.toThrow();
  });

  it("creates product as admin", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.product.create({
      title: "New Product", slug: "new-product", category: "Hoodies",
      shortDescription: "A great hoodie", description: "Full desc",
      mainImage: "https://example.com/img.jpg", samplePrice: "30.00",
      material: "320GSM Fleece", availableSizes: '["S","M","L"]',
      availableColors: '["Black"]', isFeatured: false, isActive: true,
      freeShipping: false, sortOrder: 1, seoTitle: "", seoDescription: "",
      seoKeywords: "",
      slabs: [{ minQty: 10, maxQty: 24, pricePerUnit: "20.00", label: "Starter", sortOrder: 0 }],
      sizeChart: { chartData: "[]", unit: "cm", notes: "" },
    });
    expect(result).toHaveProperty("id");
  });
});

// ─── Shipping router tests ────────────────────────────────────────────────────

describe("shipping.calculate", () => {
  it("calculates shipping for a known country", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.shipping.calculate({
      countryCode: "US",
      items: [{ productId: 1, quantity: 20 }],
    });
    expect(result).toHaveProperty("cost");
    expect(result).toHaveProperty("zoneName");
    expect(result).toHaveProperty("freeShipping");
    expect(result).toHaveProperty("estimatedDays");
  });

  it("returns fallback for unknown country", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.shipping.calculate({
      countryCode: "ZZ",
      items: [{ productId: 1, quantity: 10 }],
    });
    expect(result).toHaveProperty("cost");
    expect(result.zoneName).toBe("International");
  });
});

describe("shipping.adminZones", () => {
  it("requires admin", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.shipping.adminZones()).rejects.toThrow();
  });

  it("returns zones for admin", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.shipping.adminZones();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Order router tests ───────────────────────────────────────────────────────

describe("order.create", () => {
  it("creates an order with valid data", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.order.create({
      customerName: "John Smith",
      customerEmail: "john@brand.com",
      customerPhone: "+1 555 000 0000",
      companyName: "Brand LLC",
      addressLine1: "123 Main St",
      addressLine2: "",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      countryCode: "US",
      country: "United States",
      sessionId: "sess-abc123",
      items: [{ productId: 1, title: "Custom T-Shirt", qty: 20, size: "L", color: "Black", unitPrice: 15 }],
      subtotal: 300,
      shippingCost: 25,
      totalAmount: 325,
    });
    expect(result).toHaveProperty("orderNumber");
    expect(result.orderNumber).toMatch(/^SSM-/);
  });
});

describe("order.adminList", () => {
  it("requires admin", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.order.adminList()).rejects.toThrow();
  });

  it("returns orders for admin", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.order.adminList();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Auth tests ───────────────────────────────────────────────────────────────

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user for authenticated users", async () => {
    const caller = appRouter.createCaller(makeAdminCtx());
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.role).toBe("admin");
  });
});
