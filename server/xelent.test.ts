import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module to avoid real DB calls in tests
vi.mock("./db", () => ({
  createRfqSubmission: vi.fn().mockResolvedValue(undefined),
  getAllRfqSubmissions: vi.fn().mockResolvedValue([]),
  createContactSubmission: vi.fn().mockResolvedValue(undefined),
  getPublishedBlogPosts: vi.fn().mockResolvedValue([]),
  getBlogPostBySlug: vi.fn().mockResolvedValue(undefined),
  // New portfolio system
  listPortfolioItems: vi.fn().mockResolvedValue([]),
  getPortfolioItemWithImages: vi.fn().mockResolvedValue(null),
  getPortfolioCategories: vi.fn().mockResolvedValue([]),
  createPortfolioItem: vi.fn().mockResolvedValue({ id: 1 }),
  updatePortfolioItem: vi.fn().mockResolvedValue(undefined),
  deletePortfolioItem: vi.fn().mockResolvedValue(undefined),
  addPortfolioImage: vi.fn().mockResolvedValue({ id: 1 }),
  deletePortfolioImage: vi.fn().mockResolvedValue(undefined),
  reorderPortfolioImages: vi.fn().mockResolvedValue(undefined),
  getFeaturedTestimonials: vi.fn().mockResolvedValue([]),
  // Other required mocks
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(null),
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
  getActiveShippingZones: vi.fn().mockResolvedValue([]),
  getAllShippingZones: vi.fn().mockResolvedValue([]),
  createShippingZone: vi.fn().mockResolvedValue({ id: 1 }),
  updateShippingZone: vi.fn().mockResolvedValue(undefined),
  deleteShippingZone: vi.fn().mockResolvedValue(undefined),
  findShippingZoneForCountry: vi.fn().mockResolvedValue(null),
  getCartItems: vi.fn().mockResolvedValue([]),
  upsertCartItem: vi.fn().mockResolvedValue(undefined),
  updateCartItemQty: vi.fn().mockResolvedValue(undefined),
  removeCartItem: vi.fn().mockResolvedValue(undefined),
  clearCart: vi.fn().mockResolvedValue(undefined),
  createOrder: vi.fn().mockResolvedValue({ id: 1, orderNumber: "SSM-2026-0001" }),
  getOrderByNumber: vi.fn().mockResolvedValue(null),
  getAllOrders: vi.fn().mockResolvedValue([]),
  updateOrderStatus: vi.fn().mockResolvedValue(undefined),
}));

// Mock notification to avoid real API calls
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@xelent.pk",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// ─── RFQ Tests ────────────────────────────────────────────────────────────────

describe("rfq.submit", () => {
  it("accepts a valid RFQ submission", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.rfq.submit({
      companyName: "Test Brand Co.",
      contactName: "John Doe",
      email: "john@testbrand.com",
      productType: "Custom T-Shirts",
      quantity: "100–300 pieces",
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects RFQ with missing required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.rfq.submit({
        companyName: "",
        contactName: "John",
        email: "john@test.com",
        productType: "Hoodies",
        quantity: "100",
      })
    ).rejects.toThrow();
  });

  it("rejects RFQ with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.rfq.submit({
        companyName: "Test Co",
        contactName: "John",
        email: "not-an-email",
        productType: "Hoodies",
        quantity: "100",
      })
    ).rejects.toThrow();
  });

  it("accepts optional fields in RFQ submission", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.rfq.submit({
      companyName: "Premium Brand",
      contactName: "Jane Smith",
      email: "jane@premiumbrand.com",
      phone: "+1 555 123 4567",
      country: "United States",
      website: "https://premiumbrand.com",
      productType: "Bomber Jackets",
      quantity: "500–1,000 pieces",
      customizationType: "Embroidery",
      fabricPreference: "Premium Satin",
      timeline: "6–8 weeks",
      serviceType: "Custom Manufacturing",
      budgetRange: "$10,000 – $20,000",
      description: "Looking for premium bomber jackets with custom embroidery",
      howHeard: "Google Search",
    });

    expect(result).toEqual({ success: true });
  });
});

describe("rfq.list", () => {
  it("returns empty array for non-admin users", async () => {
    const ctx = {
      ...createPublicContext(),
      user: {
        id: 2,
        openId: "regular-user",
        email: "user@test.com",
        name: "Regular User",
        loginMethod: "manus",
        role: "user" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.rfq.list();
    expect(result).toEqual([]);
  });

  it("returns submissions for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.rfq.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Contact Tests ─────────────────────────────────────────────────────────────

describe("contact.submit", () => {
  it("accepts a valid contact message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Alice Johnson",
      email: "alice@brand.com",
      message: "I'd like to learn more about your manufacturing services.",
    });

    expect(result).toEqual({ success: true });
  });

  it("rejects contact with missing name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "",
        email: "alice@brand.com",
        message: "Hello",
      })
    ).rejects.toThrow();
  });

  it("rejects contact with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Alice",
        email: "invalid-email",
        message: "Hello",
      })
    ).rejects.toThrow();
  });

  it("accepts optional fields in contact submission", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Bob Smith",
      email: "bob@company.com",
      company: "Smith Apparel",
      phone: "+44 20 1234 5678",
      subject: "Partnership Inquiry",
      message: "We are looking for a reliable manufacturing partner for our UK brand.",
    });

    expect(result).toEqual({ success: true });
  });
});

// ─── Blog Tests ────────────────────────────────────────────────────────────────

describe("blog.list", () => {
  it("returns an array of blog posts", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.blog.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("blog.bySlug", () => {
  it("returns undefined for non-existent slug", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.blog.bySlug({ slug: "non-existent-post" });
    expect(result).toBeUndefined();
  });

  it("accepts a valid slug string", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.blog.bySlug({
      slug: "how-to-find-streetwear-manufacturer-pakistan",
    });
    expect(result === undefined || typeof result === "object").toBe(true);
  });
});

// ─── Portfolio Tests ───────────────────────────────────────────────────────────

describe("portfolio.list", () => {
  it("returns an array of portfolio items", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.portfolio.list({});
    expect(Array.isArray(result)).toBe(true);
  });

  it("accepts category filter", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.portfolio.list({ category: "Hunting Wear" });
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Testimonials Tests ────────────────────────────────────────────────────────

describe("testimonials.featured", () => {
  it("returns an array of featured testimonials", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.testimonials.featured();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── Auth Tests ────────────────────────────────────────────────────────────────

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user object for authenticated users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.email).toBe("admin@xelent.pk");
  });
});
