import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { aiAgentRouter } from "../listing-generator/server/agentRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import {
  // Users
  upsertUser, getUserByOpenId,
  // Products
  getActiveProducts, getAllProducts, getProductBySlug, getProductById,
  createProduct, updateProduct, deleteProduct, getFeaturedProducts,
  // Product images
  getProductImages, addProductImage, deleteProductImage, reorderProductImages,
  // Slab prices
  getSlabPrices, setSlabPrices,
  // Size charts
  getSizeChart, upsertSizeChart,
  // Shipping
  getActiveShippingZones, getAllShippingZones, createShippingZone,
  updateShippingZone, deleteShippingZone, findShippingZoneForCountry,
  // Cart
  getCartItems, upsertCartItem, updateCartItemQty, removeCartItem, clearCart,
  // Orders
  createOrder, getOrderByNumber, getAllOrders, updateOrderStatus,
  // RFQ
  createRfqSubmission, getAllRfqSubmissions, getRfqById, updateRfqStatus,
  // Inquiry Notes + Knowledge Base
  getNotesForInquiry, addInquiryNote, getAllKnowledgeBase, addKnowledgeBaseEntry, deleteKnowledgeBaseEntry,
  // Blog
  getPublishedBlogPosts, getBlogPostBySlug,
  // Portfolio (new image-based system)
  listPortfolioItems, getPortfolioItemWithImages, getPortfolioCategories,
  createPortfolioItem, updatePortfolioItem, deletePortfolioItem,
  addPortfolioImage, deletePortfolioImage, reorderPortfolioImages,
  // Testimonials
  getFeaturedTestimonials,
  // Contact
  createContactSubmission,
  // Tech Packs
  createTechPack, getTechPackById, getAllTechPacks, updateTechPackStatus,
  addTechPackImage, getTechPackImages,
  // Categories
  getAllCategories, getCategoryById, getCategoryBySlug, createCategory, updateCategory, deleteCategory,
  getSubcategoriesByCategoryId, getSubcategoryById, createSubcategory, updateSubcategory, deleteSubcategory,
  getCategoriesWithSubcategories,
  deleteProductAutomationSource,
  enqueueProductAutomationSources,
  getProductAutomationSettings,
  listProductAutomationSources,
  updateProductAutomationSource,
  upsertProductAutomationSettings,
} from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import Stripe from "stripe";
import {
  ensureProductAutomationTables,
  productAutomationRequestBudgetPerSource,
  triggerProductAutomationQueueRun,
} from "../listing-generator/server/productAutomation";

// Stripe is now initialized lazily in the route handler to prevent startup crashes

// ─── Admin guard middleware ───────────────────────────────────────────────────

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ─── Slab price schema ────────────────────────────────────────────────────────

const slabSchema = z.object({
  minQty: z.number().int().positive(),
  maxQty: z.number().int().positive().nullable().optional(),
  pricePerUnit: z.string(),
  label: z.string().max(100).optional(),
  sortOrder: z.number().int().default(0),
});

// ─── Product router ───────────────────────────────────────────────────────────

const productRouter = router({
  list: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      subcategory: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().int().min(1).max(100).default(24),
      offset: z.number().int().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      return getActiveProducts(input);
    }),

  featured: publicProcedure
    .input(z.object({
      limit: z.number().int().min(1).max(24).default(8),
    }).optional())
    .query(async ({ input }) => {
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
    const cats = Array.from(new Set(all.map(p => p.category)));
    return cats;
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const product = await getProductBySlug(input.slug);
      if (!product) return null;
      const [images, slabs, sizeChart] = await Promise.all([
        getProductImages(product.id),
        getSlabPrices(product.id),
        getSizeChart(product.id),
      ]);
      return { ...product, images, slabs, sizeChart: sizeChart ?? null };
    }),

  // Admin: full list including inactive
  adminList: adminProcedure.query(() => getAllProducts()),

  byId: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const product = await getProductById(input.id);
      if (!product) return null;
      const [images, slabs, sizeChart] = await Promise.all([
        getProductImages(product.id),
        getSlabPrices(product.id),
        getSizeChart(product.id),
      ]);
      return { ...product, images, slabs, sizeChart: sizeChart ?? null };
    }),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1).max(500),
      slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
      category: z.string().min(1).max(100),
      categoryId: z.number().int().positive().optional().nullable(),
      subcategoryId: z.number().int().positive().optional().nullable(),
      description: z.string().optional(),
      shortDescription: z.string().max(500).optional(),
      mainImage: z.string().optional(),
      samplePrice: z.string().optional(),
      weight: z.string().optional(),
      availableSizes: z.string().optional(), // JSON
      availableColors: z.string().optional(), // JSON
      material: z.string().max(255).optional(),
      manufacturingStory: z.string().optional(),
      manufacturingInfographic: z.string().optional(),
      isFeatured: z.boolean().default(false),
      isActive: z.boolean().default(true),
      freeShipping: z.boolean().default(false),
      seoTitle: z.string().max(255).optional(),
      seoDescription: z.string().optional(),
      seoKeywords: z.string().optional(),
      sortOrder: z.number().int().default(0),
      slabs: z.array(slabSchema).optional(),
      sizeChart: z.object({
        chartData: z.string(),
        unit: z.enum(["inches", "cm"]),
        notes: z.string().optional(),
      }).optional(),
    }))
    .mutation(async ({ input }) => {
      const { slabs, sizeChart, ...productData } = input;

      // Sanitize empty strings to avoid MySQL strict DECIMAL errors
      if (productData.samplePrice === "") productData.samplePrice = undefined;
      if (productData.weight === "") productData.weight = undefined;

      const product = await createProduct(productData);
      if (!product) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to insert product" });
      if (slabs && slabs.length > 0) await setSlabPrices(product.id, slabs);
      if (sizeChart) await upsertSizeChart(product.id, sizeChart);
      return product;
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      title: z.string().min(1).max(500).optional(),
      slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
      category: z.string().min(1).max(100).optional(),
      categoryId: z.number().int().positive().optional().nullable(),
      subcategoryId: z.number().int().positive().optional().nullable(),
      description: z.string().optional(),
      shortDescription: z.string().max(500).optional(),
      mainImage: z.string().optional(),
      samplePrice: z.string().optional(),
      weight: z.string().optional(),
      availableSizes: z.string().optional(),
      availableColors: z.string().optional(),
      material: z.string().max(255).optional(),
      manufacturingStory: z.string().optional(),
      manufacturingInfographic: z.string().optional(),
      isFeatured: z.boolean().optional(),
      isActive: z.boolean().optional(),
      freeShipping: z.boolean().optional(),
      seoTitle: z.string().max(255).optional(),
      seoDescription: z.string().optional(),
      seoKeywords: z.string().optional(),
      sortOrder: z.number().int().optional(),
      slabs: z.array(slabSchema).optional(),
      sizeChart: z.object({
        chartData: z.string(),
        unit: z.enum(["inches", "cm"]),
        notes: z.string().optional(),
      }).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, slabs, sizeChart, ...data } = input;

      // Sanitize empty strings to avoid MySQL strict DECIMAL errors
      if (data.samplePrice === "") data.samplePrice = undefined;
      if (data.weight === "") data.weight = undefined;

      await updateProduct(id, data);
      if (slabs !== undefined) await setSlabPrices(id, slabs);
      if (sizeChart) await upsertSizeChart(id, sizeChart);
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteProduct(input.id);
      return { success: true };
    }),

  uploadImage: adminProcedure
    .input(z.object({
      productId: z.number().int().positive(),
      imageBase64: z.string(),
      mimeType: z.string().default("image/jpeg"),
      altText: z.string().optional(),
      sortOrder: z.number().int().default(0),
    }))
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.imageBase64, "base64");
      const ext = input.mimeType.split("/")[1] ?? "jpg";
      const key = `products-${input.productId}-${nanoid(10)}.${ext}`;
      const { url } = await storagePut(key, buffer, input.mimeType);
      await addProductImage({
        productId: input.productId,
        imageUrl: url,
        altText: input.altText,
        sortOrder: input.sortOrder,
      });
      return { url };
    }),

  deleteImage: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteProductImage(input.id);
      return { success: true };
    }),

  reorderImages: adminProcedure
    .input(z.array(z.object({ id: z.number(), sortOrder: z.number() })))
    .mutation(async ({ input }) => {
      await reorderProductImages(input);
      return { success: true };
    }),
});

// ─── Shipping router ──────────────────────────────────────────────────────────

const shippingRouter = router({
  zones: publicProcedure.query(() => getActiveShippingZones()),

  adminZones: adminProcedure.query(() => getAllShippingZones()),

  calculate: publicProcedure
    .input(z.object({
      countryCode: z.string().length(2),
      items: z.array(z.object({
        productId: z.number().int(),
        quantity: z.number().int().positive(),
      })),
    }))
    .query(async ({ input }) => {
      // Check if any product has free shipping
      const productDetails = await Promise.all(
        input.items.map(item => getProductById(item.productId))
      );
      const allFreeShipping = productDetails.every(p => p?.freeShipping);
      if (allFreeShipping) {
        return { cost: "0.00", currency: "USD", estimatedDays: { min: 7, max: 21 }, freeShipping: true, zoneName: "Free Shipping" };
      }

      const zone = await findShippingZoneForCountry(input.countryCode);
      if (!zone) {
        // Default fallback rate for unlisted countries
        return { cost: "45.00", currency: "USD", estimatedDays: { min: 14, max: 30 }, freeShipping: false, zoneName: "International" };
      }

      // Calculate: base + per-unit
      const totalQty = input.items.reduce((sum, i) => sum + i.quantity, 0);
      const totalWeight = productDetails.reduce((sum, p, idx) => {
        const qty = input.items[idx]?.quantity ?? 1;
        return sum + (parseFloat(p?.weight ?? "0.3") * qty);
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
        zoneName: zone.zoneName,
      };
    }),

  createZone: adminProcedure
    .input(z.object({
      zoneName: z.string().min(1).max(100),
      countries: z.string(), // JSON array of ISO codes
      baseRate: z.string().regex(/^\d+(\.\d{1,2})?$/),
      perUnitRate: z.string().regex(/^\d+(\.\d{1,2})?$/).default("0.00"),
      perKgRate: z.string().regex(/^\d+(\.\d{1,2})?$/).default("0.00"),
      minDays: z.number().int().min(1).default(7),
      maxDays: z.number().int().min(1).default(21),
      currency: z.string().max(10).default("USD"),
      isActive: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      await createShippingZone(input);
      return { success: true };
    }),

  updateZone: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      zoneName: z.string().min(1).max(100).optional(),
      countries: z.string().optional(),
      baseRate: z.string().optional(),
      perUnitRate: z.string().optional(),
      perKgRate: z.string().optional(),
      minDays: z.number().int().optional(),
      maxDays: z.number().int().optional(),
      currency: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateShippingZone(id, data);
      return { success: true };
    }),

  deleteZone: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteShippingZone(input.id);
      return { success: true };
    }),
});

// ─── Cart router ──────────────────────────────────────────────────────────────

const cartRouter = router({
  get: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const items = await getCartItems(input.sessionId);
      // Enrich with product details
      const enriched = await Promise.all(items.map(async item => {
        const product = await getProductById(item.productId);
        const slabs = await getSlabPrices(item.productId);
        // Find applicable slab price
        const slab = slabs.find(s => {
          const qty = item.quantity;
          return qty >= s.minQty && (s.maxQty === null || qty <= (s.maxQty ?? Infinity));
        }) ?? slabs[0];
        return {
          ...item,
          product: product ?? null,
          unitPrice: slab ? parseFloat(slab.pricePerUnit) : 0,
          lineTotal: slab ? parseFloat(slab.pricePerUnit) * item.quantity : 0,
        };
      }));
      return enriched;
    }),

  addItem: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
      selectedSize: z.string().optional(),
      selectedColor: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await upsertCartItem(input);
      return { success: true };
    }),

  updateQty: publicProcedure
    .input(z.object({ id: z.number().int().positive(), quantity: z.number().int().min(0) }))
    .mutation(async ({ input }) => {
      await updateCartItemQty(input.id, input.quantity);
      return { success: true };
    }),

  removeItem: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await removeCartItem(input.id);
      return { success: true };
    }),

  clear: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      await clearCart(input.sessionId);
      return { success: true };
    }),
});

// ─── Order router ─────────────────────────────────────────────────────────────

const orderRouter = router({
  create: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      customerName: z.string().min(1),
      customerEmail: z.string().email(),
      customerPhone: z.string().optional(),
      companyName: z.string().optional(),
      addressLine1: z.string().min(1),
      addressLine2: z.string().optional(),
      city: z.string().min(1),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().min(1),
      countryCode: z.string().length(2),
      items: z.array(z.object({
        productId: z.number(),
        title: z.string(),
        qty: z.number(),
        size: z.string().optional(),
        color: z.string().optional(),
        unitPrice: z.number(),
      })),
      subtotal: z.number(),
      shippingCost: z.number(),
      totalAmount: z.number(),
      paymentMethod: z.enum(["stripe", "invoice"]),
    }))
    .mutation(async ({ input }) => {
      const orderNumber = `SSM-${Date.now()}-${nanoid(6).toUpperCase()}`;

      let stripeSessionId: string | undefined = undefined;
      let stripeUrl: string | undefined = undefined;

      if (input.paymentMethod === 'stripe') {
        const lineItems = input.items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.title,
              description: `Size: ${item.size || 'N/A'}, Color: ${item.color || 'N/A'}`,
            },
            unit_amount: Math.round(item.unitPrice * 100), // Stripe expects cents
          },
          quantity: item.qty,
        }));

        if (input.shippingCost > 0) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: { name: 'Shipping', description: 'Standard Shipping Rate' },
              unit_amount: Math.round(input.shippingCost * 100),
            },
            quantity: 1,
          });
        }

        const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
        // Attempt to get host from request headers if possible, otherwise fallback
        const host = process.env.HOST || "localhost:5173";

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2026-02-25.clover" as any });
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${protocol}://${host}/checkout/success?order_number=${orderNumber}`,
          cancel_url: `${protocol}://${host}/checkout/cancel`,
          customer_email: input.customerEmail,
          metadata: { orderNumber },
        });

        stripeSessionId = session.id;
        stripeUrl = session.url ?? undefined;
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
        stripeSessionId,
      });

      // Clear cart after order creation
      await clearCart(input.sessionId);

      // Notify owner
      await notifyOwner({
        title: `New Order: ${orderNumber}`,
        content: `Order from ${input.customerName} (${input.companyName ?? input.customerEmail}) — Total: $${input.totalAmount.toFixed(2)} via ${input.paymentMethod.toUpperCase()}`,
      });

      return { success: true, orderNumber, stripeUrl };
    }),

  byNumber: publicProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => getOrderByNumber(input.orderNumber)),

  getById: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const all = await getAllOrders();
      return all.find(o => o.id === input.id) ?? null;
    }),

  adminList: adminProcedure.query(() => getAllOrders()),

  adminStats: adminProcedure.query(async () => {
    const all = await getAllOrders();
    const products = await getAllProducts();
    const rfqs = await getAllRfqSubmissions();
    const paidOrders = all.filter(o => ["paid", "processing", "shipped", "delivered"].includes(o.status));
    const totalRevenue = paidOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
    const pendingCount = all.filter(o => o.status === "pending").length;
    const processingCount = all.filter(o => o.status === "processing").length;
    const recentOrders = all.slice(0, 5);
    return {
      totalRevenue: totalRevenue.toFixed(2),
      orderCount: all.length,
      paidOrderCount: paidOrders.length,
      pendingCount,
      processingCount,
      productCount: products.length,
      activeProductCount: products.filter(p => p.isActive).length,
      recentOrders,
      inquiryCount: rfqs.length,
      newInquiryCount: rfqs.filter(r => r.status === "new").length,
      recentInquiries: rfqs.slice(0, 5),
    };
  }),

  updateStatus: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]),
    }))
    .mutation(async ({ input }) => {
      await updateOrderStatus(input.id, input.status);
      return { success: true };
    }),
});

// ─── RFQ router ───────────────────────────────────────────────────────────────

const rfqRouter = router({
  submit: publicProcedure
    .input(z.object({
      companyName: z.string().min(1),
      contactName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      country: z.string().optional(),
      website: z.string().optional(),
      productType: z.string().min(1),
      quantity: z.string().min(1),
      customizationType: z.string().optional(),
      fabricPreference: z.string().optional(),
      timeline: z.string().optional(),
      budgetRange: z.string().optional(),
      description: z.string().optional(),
      serviceType: z.string().optional(),
      howHeard: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
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
        additionalNotes: input.description,
      });
      await notifyOwner({
        title: `New RFQ from ${input.companyName}`,
        content: `${input.contactName} (${input.email}) requested a quote for ${input.productType} — Qty: ${input.quantity}`,
      });
      return { success: true };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") return [];
    return getAllRfqSubmissions();
  }),

  // Upload a design screenshot to S3 and return the URL
  uploadDesignImage: publicProcedure
    .input(z.object({
      imageBase64: z.string(),
      mimeType: z.string().default('image/jpeg'),
    }))
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.imageBase64, 'base64');
      const ext = input.mimeType.split('/')[1] || 'jpg';
      const fileKey = `design-quotes/${nanoid(12)}.${ext}`;
      const { url } = await storagePut(fileKey, buffer, input.mimeType);
      return { url };
    }),

  // Submit an RFQ with an attached 3D design image
  submitWithDesign: publicProcedure
    .input(z.object({
      companyName: z.string().min(1),
      contactName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      country: z.string().optional(),
      productType: z.string().min(1),
      quantity: z.string().min(1),
      timeline: z.string().optional(),
      budgetRange: z.string().optional(),
      description: z.string().optional(),
      designImageUrl: z.string().url().optional(),
      garmentType: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
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
        garmentType: input.garmentType,
      });
      const designNote = input.designImageUrl
        ? `\n\n🎨 Design Preview: ${input.designImageUrl}`
        : '';
      await notifyOwner({
        title: `New 3D Design Quote from ${input.companyName}`,
        content: `${input.contactName} (${input.email}) submitted a 3D design quote request for ${input.productType} (${input.garmentType ?? ''}) — Qty: ${input.quantity}${designNote}`,
      });
      return { success: true };
    }),

  // ── Admin inquiry management ──────────────────────────────────────

  adminList: adminProcedure.query(() => getAllRfqSubmissions()),

  getById: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const rfq = await getRfqById(input.id);
      if (!rfq) return null;
      const notes = await getNotesForInquiry(input.id);
      return { ...rfq, notes };
    }),

  updateStatus: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      status: z.enum(["new", "reviewed", "quoted", "closed"]),
    }))
    .mutation(async ({ input }) => {
      await updateRfqStatus(input.id, input.status);
      return { success: true };
    }),

  addNote: adminProcedure
    .input(z.object({
      rfqId: z.number().int().positive(),
      content: z.string().min(1),
      isAiGenerated: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      await addInquiryNote({
        rfqId: input.rfqId,
        content: input.content,
        isAiGenerated: input.isAiGenerated,
      });
      return { success: true };
    }),

  generateAiReply: adminProcedure
    .input(z.object({
      rfqId: z.number().int().positive(),
      instruction: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const rfq = await getRfqById(input.rfqId);
      if (!rfq) throw new TRPCError({ code: "NOT_FOUND", message: "Inquiry not found" });

      // Get user's saved Gemini API key (same one used in AI Product Agent)
      const userApiKey = (ctx.user as any)?.geminiApiKey || undefined;

      // Build knowledge base from products + custom entries
      const products = await getAllProducts();
      const kb = await getAllKnowledgeBase();
      const notes = await getNotesForInquiry(input.rfqId);

      const productCatalog = products.map(p =>
        `- ${p.title} (${p.category}): ${p.shortDescription || p.description || ''} | Base Price: $${p.samplePrice || 'Contact for pricing'}`
      ).join("\n");

      const kbContent = kb.map(k => `[${k.category}] ${k.title}: ${k.content}`).join("\n\n");

      const previousNotes = notes.map(n => `[${n.isAiGenerated ? 'AI' : 'Admin'}] ${n.content}`).join("\n---\n");

      const systemPrompt = `You are a professional sales representative for Pak Homies Industry — a premium B2B custom apparel manufacturer from Sialkot, Pakistan. We specialize in custom sportswear, streetwear, hunting gear, tactical uniforms, martial arts uniforms, and private label manufacturing.

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

${kbContent ? `ADDITIONAL KNOWLEDGE BASE:\n${kbContent}` : ''}

${previousNotes ? `PREVIOUS CONVERSATION NOTES:\n${previousNotes}` : ''}

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
- Phone: ${rfq.phone || 'Not provided'}
- Country: ${rfq.country || 'Not specified'}
- Product Type: ${rfq.productType}
- Quantity: ${rfq.quantity}
- Customization: ${rfq.customization || 'Not specified'}
- Fabric Preference: ${rfq.fabricPreference || 'Not specified'}
- Timeline: ${rfq.timeline || 'Not specified'}
- Budget: ${rfq.budget || 'Not specified'}
- Additional Notes: ${rfq.additionalNotes || 'None'}
- Current Status: ${rfq.status}

USER INSTRUCTION: ${input.instruction}`;

      const { chatWithProductAgent } = await import("./ai/gemini");
      const reply = await chatWithProductAgent(
        [],
        inquiryContext,
        systemPrompt,
        userApiKey,
      );

      return { reply };
    }),

  // ── Knowledge Base ─────────────────────────────────────────────────

  getKnowledgeBase: adminProcedure.query(() => getAllKnowledgeBase()),

  addKnowledge: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(1),
      category: z.string().default("general"),
    }))
    .mutation(async ({ input }) => {
      await addKnowledgeBaseEntry(input);
      return { success: true };
    }),

  deleteKnowledge: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteKnowledgeBaseEntry(input.id);
      return { success: true };
    }),
});

// ─── Blog router ──────────────────────────────────────────────────────────────

const blogRouter = router({
  list: publicProcedure.query(() => getPublishedBlogPosts()),
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => getBlogPostBySlug(input.slug)),
});

// ─── Portfolio router ─────────────────────────────────────────────────────────

const portfolioRouter = router({
  // Public queries
  list: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(({ input }) => listPortfolioItems({ category: input?.category, onlyActive: true })),

  categories: publicProcedure.query(() => getPortfolioCategories()),

  adminList: adminProcedure.query(() => listPortfolioItems({ onlyActive: false })),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getPortfolioItemWithImages(input.id)),

  // Admin: create portfolio item
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      category: z.string().min(1),
      description: z.string().optional(),
      tags: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      seoKeywords: z.string().optional(),
      geoTarget: z.string().optional(),
      isFeatured: z.boolean().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return createPortfolioItem(input);
    }),

  // Admin: update portfolio item
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      category: z.string().optional(),
      description: z.string().optional(),
      tags: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      seoKeywords: z.string().optional(),
      geoTarget: z.string().optional(),
      isFeatured: z.boolean().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
      coverImage: z.string().optional(),
      ogImage: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const { id, ...data } = input;
      await updatePortfolioItem(id, data);
      return { success: true };
    }),

  // Admin: delete portfolio item (cascades images)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      await deletePortfolioItem(input.id);
      return { success: true };
    }),

  // Admin: upload image to S3 and attach to portfolio item
  uploadImage: protectedProcedure
    .input(z.object({
      portfolioItemId: z.number().optional(),
      imageBase64: z.string(),
      mimeType: z.string().default("image/jpeg"),
      altText: z.string().optional(),
      caption: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const buffer = Buffer.from(input.imageBase64, "base64");
      const ext = input.mimeType.split("/")[1] || "jpg";
      const fileKey = input.portfolioItemId
        ? `portfolio/${input.portfolioItemId}/${nanoid(10)}.${ext}`
        : `portfolio/temp/${nanoid(10)}.${ext}`;
      const { url } = await storagePut(fileKey, buffer, input.mimeType);

      if (input.portfolioItemId) {
        const img = await addPortfolioImage({
          portfolioItemId: input.portfolioItemId,
          imageUrl: url,
          fileKey,
          altText: input.altText,
          caption: input.caption,
          sortOrder: input.sortOrder ?? 0,
        });
        // Set as cover image if it's the first image
        const existing = await getPortfolioItemWithImages(input.portfolioItemId);
        if (existing && existing.images.length === 1) {
          await updatePortfolioItem(input.portfolioItemId, { coverImage: url, ogImage: url });
        }
        return img;
      }

      return { url };
    }),

  // Admin: delete a single image
  deleteImage: protectedProcedure
    .input(z.object({ imageId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      await deletePortfolioImage(input.imageId);
      return { success: true };
    }),

  // Admin: reorder images
  reorderImages: protectedProcedure
    .input(z.array(z.object({ id: z.number(), sortOrder: z.number() })))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      await reorderPortfolioImages(input);
      return { success: true };
    }),

  // Admin: set cover image
  setCover: protectedProcedure
    .input(z.object({ portfolioItemId: z.number(), imageUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      await updatePortfolioItem(input.portfolioItemId, { coverImage: input.imageUrl, ogImage: input.imageUrl });
      return { success: true };
    }),
});

// ─── Testimonials router ──────────────────────────────────────────────────────

const testimonialsRouter = router({
  featured: publicProcedure.query(() => getFeaturedTestimonials()),
});

// ─── Contact router ───────────────────────────────────────────────────────────

const contactRouter = router({
  submit: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      company: z.string().optional(),
      phone: z.string().optional(),
      subject: z.string().optional(),
      message: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      await createContactSubmission(input);
      await notifyOwner({
        title: `New Contact from ${input.name}`,
        content: `${input.email}${input.company ? ` (${input.company})` : ""}: ${input.message.slice(0, 200)}`,
      });
      return { success: true };
    }),
});

// ─── Tech Pack router ─────────────────────────────────────────────────────────

const techPackRouter = router({
  submit: publicProcedure
    .input(z.object({
      brandName: z.string().min(1),
      contactName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      country: z.string().optional(),
      garmentType: z.string().min(1),
      styleName: z.string().optional(),
      season: z.string().optional(),
      gender: z.string().optional(),
      targetMarket: z.string().optional(),
      techPackData: z.string(), // JSON blob
      images: z.array(z.object({
        imageUrl: z.string().url(),
        fileKey: z.string().optional(),
        imageType: z.enum(["mockup", "flat_sketch", "reference", "hangtag", "care_label"]),
        caption: z.string().optional(),
        sortOrder: z.number().int().default(0),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      const referenceNumber = `TP-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`;

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
        status: "submitted",
      });

      if (!techPack) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create Tech Pack overview" });
      }

      if (input.images && input.images.length > 0) {
        for (const img of input.images) {
          await addTechPackImage({
            techPackId: techPack.id,
            imageUrl: img.imageUrl,
            fileKey: img.fileKey,
            imageType: img.imageType,
            caption: img.caption,
            sortOrder: img.sortOrder,
          });
        }
      }

      await notifyOwner({
        title: `New Tech Pack: ${referenceNumber}`,
        content: `${input.contactName} (${input.brandName}) submitted a Tech Pack for ${input.garmentType} (${input.styleName || "N/A"})`,
      });

      return { success: true, referenceNumber, techPackId: techPack.id };
    }),

  uploadImage: publicProcedure
    .input(z.object({
      imageBase64: z.string(),
      mimeType: z.string().default('image/jpeg'),
    }))
    .mutation(async ({ input }) => {
      const buffer = Buffer.from(input.imageBase64, 'base64');
      const ext = input.mimeType.split('/')[1] || 'jpg';
      const fileKey = `tech-packs/${nanoid(12)}.${ext}`;
      const { url, key } = await storagePut(fileKey, buffer, input.mimeType);
      return { url, fileKey: key };
    }),

  list: adminProcedure.query(async () => {
    return getAllTechPacks();
  }),

  byId: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const techPack = await getTechPackById(input.id);
      if (!techPack) return null;
      const images = await getTechPackImages(techPack.id);
      return { ...techPack, images };
    }),

  updateStatus: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      status: z.enum(["draft", "submitted", "reviewed", "quoted"]),
      adminNotes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await updateTechPackStatus(input.id, input.status, input.adminNotes);
      return { success: true };
    }),
});

// ─── Category router ──────────────────────────────────────────────────────────

const categoryRouter = router({
  // Public endpoints
  list: publicProcedure
    .input(z.object({ includeInactive: z.boolean().optional() }).optional())
    .query(({ input }) => getAllCategories({ includeInactive: input?.includeInactive })),

  listWithSubs: publicProcedure
    .input(z.object({ includeInactive: z.boolean().optional() }).optional())
    .query(({ input }) => getCategoriesWithSubcategories({ includeInactive: input?.includeInactive })),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const category = await getCategoryBySlug(input.slug);
      if (!category) return null;
      const subcategories = await getSubcategoriesByCategoryId(category.id);
      return { ...category, subcategories };
    }),

  subcategories: publicProcedure
    .input(z.object({ categoryId: z.number().int().positive() }))
    .query(({ input }) => getSubcategoriesByCategoryId(input.categoryId)),

  // Admin endpoints
  adminList: adminProcedure
    .input(z.object({ includeInactive: z.boolean().optional() }).optional())
    .query(({ input }) => getCategoriesWithSubcategories({ includeInactive: input?.includeInactive ?? true })),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
      icon: z.string().max(50).optional(),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      sortOrder: z.number().int().default(0),
      isActive: z.boolean().default(true),
      seoTitle: z.string().max(255).optional(),
      seoDescription: z.string().optional(),
      seoKeywords: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return createCategory(input);
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      name: z.string().min(1).max(100).optional(),
      slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
      icon: z.string().max(50).optional(),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      sortOrder: z.number().int().optional(),
      isActive: z.boolean().optional(),
      seoTitle: z.string().max(255).optional(),
      seoDescription: z.string().optional(),
      seoKeywords: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCategory(id, data);
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteCategory(input.id);
      return { success: true };
    }),

  // Subcategory admin endpoints
  createSubcategory: adminProcedure
    .input(z.object({
      categoryId: z.number().int().positive(),
      name: z.string().min(1).max(100),
      slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
      description: z.string().optional(),
      sortOrder: z.number().int().default(0),
      isActive: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      return createSubcategory(input);
    }),

  updateSubcategory: adminProcedure
    .input(z.object({
      id: z.number().int().positive(),
      name: z.string().min(1).max(100).optional(),
      slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
      description: z.string().optional(),
      sortOrder: z.number().int().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateSubcategory(id, data);
      return { success: true };
    }),

  deleteSubcategory: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteSubcategory(input.id);
      return { success: true };
    }),
});

// ─── App router ───────────────────────────────────────────────────────────────

const productAutomationRouter = router({
  settings: adminProcedure.query(async () => {
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
        lastRunSummary: null,
      },
      requestsPerSource: productAutomationRequestBudgetPerSource,
    };
  }),

  saveSettings: adminProcedure
    .input(z.object({
      isEnabled: z.boolean().default(false),
      runEveryMinutes: z.number().int().min(1).max(1440),
      maxSourcesPerRun: z.number().int().min(1).max(25),
      geminiRequestsPerMinuteLimit: z.number().int().min(productAutomationRequestBudgetPerSource).max(1000),
      geminiRequestsPerDayLimit: z.number().int().min(productAutomationRequestBudgetPerSource).max(100000),
      defaultCategoryId: z.number().int().positive().nullable().optional(),
      defaultSubcategoryId: z.number().int().positive().nullable().optional(),
      defaultCategoryLabel: z.string().max(100).nullable().optional(),
      savedModelId: z.number().int().positive().nullable().optional(),
      defaultPrompt: z.string().min(5).max(1000).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await ensureProductAutomationTables();

      if (input.isEnabled && !input.savedModelId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Select a saved model before enabling the automation.",
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
        lastRunSummary: existing?.lastRunSummary ?? null,
      };

      const saved = await upsertProductAutomationSettings(payload);
      return { success: true, settings: saved };
    }),

  listSources: adminProcedure.query(async () => {
    await ensureProductAutomationTables();
    return listProductAutomationSources();
  }),

  enqueue: adminProcedure
    .input(z.object({
      urls: z.array(z.string().url()).min(1).max(200),
      categoryId: z.number().int().positive().nullable().optional(),
      subcategoryId: z.number().int().positive().nullable().optional(),
      categoryLabel: z.string().max(100).nullable().optional(),
      promptOverride: z.string().max(1000).nullable().optional(),
    }))
    .mutation(async ({ input }) => {
      await ensureProductAutomationTables();
      const result = await enqueueProductAutomationSources(input.urls, {
        categoryId: input.categoryId ?? null,
        subcategoryId: input.subcategoryId ?? null,
        categoryLabel: input.categoryLabel ?? null,
        promptOverride: input.promptOverride ?? null,
      });
      return { success: true, ...result };
    }),

  retrySource: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await ensureProductAutomationTables();
      await updateProductAutomationSource(input.id, {
        status: "queued",
        notes: null,
        nextAttemptAt: new Date(),
      });
      return { success: true };
    }),

  deleteSource: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await ensureProductAutomationTables();
      await deleteProductAutomationSource(input.id);
      return { success: true };
    }),

  runNow: adminProcedure.mutation(async () => {
    await ensureProductAutomationTables();
    return triggerProductAutomationQueueRun({ manual: true });
  }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
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
    getApiKey: adminProcedure.query(async ({ ctx }) => {
      const { getDb: getDatabase } = await import("./db");
      const { users } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = await getDatabase();
      if (!db) return { hasKey: false, maskedKey: "" };
      const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
      const key = (user as any)?.geminiApiKey || "";
      return {
        hasKey: !!key,
        maskedKey: key ? key.substring(0, 6) + "..." + key.substring(key.length - 4) : "",
      };
    }),
    saveApiKey: adminProcedure
      .input(z.object({ apiKey: z.string().max(255) }))
      .mutation(async ({ input, ctx }) => {
        const { getDb: getDatabase } = await import("./db");
        const { users } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const db = await getDatabase();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        await db.update(users).set({ geminiApiKey: input.apiKey || null } as any).where(eq(users.id, ctx.user.id));
        return { success: true };
      }),
    getModelImage: adminProcedure.query(async () => {
      try {
        const fs = await import("fs/promises");
        const path = await import("path");
        const filePath = path.join(process.cwd(), "model_image.json");
        const data = await fs.readFile(filePath, "utf-8");
        const parsed = JSON.parse(data);
        if (parsed && parsed.base64 && parsed.mimeType) {
          return parsed;
        }
        return null;
      } catch (err) {
        return null;
      }
    }),
    saveModelImage: adminProcedure
      .input(z.object({
        base64: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          const fs = await import("fs/promises");
          const path = await import("path");
          const filePath = path.join(process.cwd(), "model_image.json");
          await fs.writeFile(filePath, JSON.stringify({
            base64: input.base64,
            mimeType: input.mimeType,
          }));
          return { success: true };
        } catch (err) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to save model image" });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

