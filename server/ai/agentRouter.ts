import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { chatWithProductAgent, generateProductData, generateProductImageBase64 } from "./gemini";
import { storagePut } from "../storage";
import { nanoid } from "nanoid";

// ─── Expert System Prompt ─────────────────────────────────────────────────────

const AGENT_SYSTEM_PROMPT = `You are an Elite B2B Apparel Product Posting Consultant AI for Pak Homies Industry — a premium, eco-friendly custom apparel manufacturer based in Sialkot, Pakistan with 15+ years of experience exporting to 40+ countries.

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
- Be proactive — suggest improvements the user may not have thought of
- Always include both GEO keywords (Sialkot, Pakistan, wholesale) and product-specific SEO keywords
- When you have enough information, say: **"I have all the information needed. Click the '🚀 Generate Product' button below to create the full product listing!"**
- When generating product images, ask if they want to upload a logo to place on the garment

## Important Rules:
- Categories must be one of: Hunting Wear, Sports Wear, Ski Wear, Tech Wear, Streetwear, Martial Arts Wear
- Always suggest at least 3 MOQ price tiers (e.g. 50-99 pcs, 100-299 pcs, 300+ pcs)
- Size charts should be realistic for international buyers (XS-3XL typically)
- Prices should reflect Pakistan manufacturing rates (very competitive globally)`;

// ─── Admin guard ──────────────────────────────────────────────────────────────

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
    if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    return next({ ctx });
});

// ─── AI Agent Router ──────────────────────────────────────────────────────────

export const aiAgentRouter = router({
    // Multi-turn chat with the product consultant
    chat: adminProcedure
        .input(z.object({
            history: z.array(z.object({
                role: z.enum(["user", "model"]),
                text: z.string(),
            })),
            message: z.string().min(1).max(2000),
            apiKey: z.string().optional(),
            modelId: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const key = input.apiKey || (ctx.user as any).geminiApiKey || undefined;
                const reply = await chatWithProductAgent(
                    input.history,
                    input.message,
                    AGENT_SYSTEM_PROMPT,
                    key,
                    input.modelId,
                );
                return { reply, success: true };
            } catch (err: any) {
                if (err.message?.includes("GEMINI_API_KEY") || err.message?.includes("API key")) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Gemini API key not configured. Please add your API key in the AI Agent settings.",
                    });
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `AI error: ${err.message}`,
                });
            }
        }),

    // Generate full structured product data from a description
    generateProduct: adminProcedure
        .input(z.object({
            description: z.string().min(5).max(1000),
            apiKey: z.string().optional(),
            modelId: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const key = input.apiKey || (ctx.user as any).geminiApiKey || undefined;
                const productData = await generateProductData(input.description, undefined, key, input.modelId);
                return { product: productData, success: true };
            } catch (err: any) {
                if (err.message?.includes("GEMINI_API_KEY") || err.message?.includes("API key")) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Gemini API key not configured. Please add your API key in the AI Agent settings.",
                    });
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Product generation failed: ${err.message}`,
                });
            }
        }),

    // Generate a product image with optional logo, upload to storage, return URL
    generateProductImage: adminProcedure
        .input(z.object({
            imagePrompt: z.string().min(5).max(1000),
            logoBase64: z.string().optional(),
            logoMimeType: z.string().optional(),
            apiKey: z.string().optional(),
            modelId: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const key = input.apiKey || (ctx.user as any).geminiApiKey || undefined;
                const { base64, mimeType } = await generateProductImageBase64(
                    input.imagePrompt,
                    input.logoBase64,
                    input.logoMimeType,
                    key,
                    input.modelId,
                );
                // Upload to storage
                const buffer = Buffer.from(base64, "base64");
                const ext = mimeType.split("/")[1] ?? "png";
                const storageKey = `ai-generated/${nanoid(12)}.${ext}`;
                const { url } = await storagePut(storageKey, buffer, mimeType);
                return { imageUrl: url, success: true };
            } catch (err: any) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Image generation failed: ${err.message}`,
                });
            }
        }),

    // Generate an illustrative infographic based on the manufacturing story
    generateInfographic: adminProcedure
        .input(z.object({
            prompt: z.string().min(5),
            apiKey: z.string().optional(),
            modelId: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { generateInfographicImageBase64 } = await import("./gemini");
                const key = input.apiKey || (ctx.user as any).geminiApiKey || undefined;
                const { base64, mimeType } = await generateInfographicImageBase64(
                    input.prompt,
                    key,
                    input.modelId,
                );
                // Upload to storage
                const buffer = Buffer.from(base64, "base64");
                const ext = mimeType.split("/")[1] ?? "png";
                const storageKey = `ai-infographics/${nanoid(12)}.${ext}`;
                const { url } = await storagePut(storageKey, buffer, mimeType);
                return { imageUrl: url, success: true };
            } catch (err: any) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Infographic generation failed: ${err.message}`,
                });
            }
        }),

    // Analyze an uploaded image to generate a full product listing
    analyzeUploadedProductImage: adminProcedure
        .input(z.object({
            base64: z.string(),
            mimeType: z.string(),
            apiKey: z.string().optional(),
            modelId: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { analyzeUploadedProductImageBase64 } = await import("./gemini");
                const key = input.apiKey || (ctx.user as any).geminiApiKey || undefined;
                const productData = await analyzeUploadedProductImageBase64(input.base64, input.mimeType, undefined, key, input.modelId);
                return { product: productData, success: true };
            } catch (err: any) {
                if (err.message?.includes("GEMINI_API_KEY") || err.message?.includes("API key")) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Gemini API key not configured. Please add your API key in the AI Agent settings.",
                    });
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Product image analysis failed: ${err.message}`,
                });
            }
        }),

    // Analyze a manually uploaded image for SEO optimization (rename, alt, caption)
    optimizeImage: adminProcedure
        .input(z.object({
            base64: z.string(),
            mimeType: z.string(),
            apiKey: z.string().optional(),
            modelId: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { analyzeImageForSeo } = await import("./gemini");
                const key = input.apiKey || (ctx.user as any).geminiApiKey || undefined;
                const seoData = await analyzeImageForSeo(input.base64, input.mimeType, key, input.modelId);
                return { seoData, success: true };
            } catch (err: any) {
                if (err.message?.includes("GEMINI_API_KEY") || err.message?.includes("API key")) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Gemini API key not configured. Please add your API key in the AI Agent settings.",
                    });
                }
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Image optimization failed: ${err.message}`,
                });
            }
        }),

    // Premium: Generate a 4-view design concept grid
    generateDesignerGrid: adminProcedure
        .input(z.object({
            prompt: z.string().min(5).max(1000),
            apiKey: z.string().optional(),
            modelId: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { generateDesignerGrid } = await import("./gemini");
                const key = input.apiKey || (ctx.user as any).geminiApiKey || undefined;
                const { base64, mimeType } = await generateDesignerGrid(input.prompt, key, input.modelId);

                // Return base64 directly to save storage space (since it's just for approval preview)
                return { base64, mimeType, success: true };
            } catch (err: any) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Grid generation failed: ${err.message}`,
                });
            }
        }),

    // Premium: Generate individual high-res view
    generateIndividualView: adminProcedure
        .input(z.object({
            basePrompt: z.string().min(5).max(1000),
            viewType: z.enum(["front", "back", "left-side", "right-side", "side", "close-up", "model"]),
            apiKey: z.string().optional(),
            modelId: z.string().optional(),
            referenceImage: z.object({ base64: z.string(), mimeType: z.string() }).optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { generateIndividualView } = await import("./gemini");
                const key = input.apiKey || (ctx.user as any).geminiApiKey || undefined;
                const { base64, mimeType } = await generateIndividualView(
                    input.basePrompt,
                    input.viewType,
                    key,
                    input.modelId,
                    input.referenceImage
                );

                // Upload this to storage because it's a final individual product image
                const buffer = Buffer.from(base64, "base64");
                const ext = mimeType.split("/")[1] ?? "jpeg";
                const storageKey = `portfolio/designer-${input.viewType}-${nanoid(10)}.${ext}`;
                const { url } = await storagePut(storageKey, buffer, mimeType);

                return { imageUrl: url, success: true };
            } catch (err: any) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Individual view generation failed: ${err.message}`,
                });
            }
        }),

    // Premium: Generate a Virtual Try-On image
    generateTryOnImage: adminProcedure
        .input(z.object({
            prompt: z.string().min(5).max(1000),
            modelImage: z.object({ base64: z.string(), mimeType: z.string() }),
            referenceImages: z.array(z.object({ base64: z.string(), mimeType: z.string() })).optional(),
            referenceLink: z.string().url().optional(),
            logoImage: z.object({ base64: z.string(), mimeType: z.string() }).optional(),
            category: z.string().optional(),
            apiKey: z.string().optional(),
            modelId: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { generateTryOnImages } = await import("./gemini");
                const key = input.apiKey || (ctx.user as any).geminiApiKey || undefined;

                let finalReferenceImages = input.referenceImages || [];

                // Step 1: If a referenceLink is provided, scrape it for the main og:image
                if (input.referenceLink && finalReferenceImages.length === 0) {
                    try {
                        const url = new URL(input.referenceLink);
                        const res = await fetch(url.href, {
                            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                        });
                        const html = await res.text();
                        const { load } = await import("cheerio");
                        const $ = load(html);

                        let imageUrl = $('meta[property="og:image"]').attr('content') ||
                            $('meta[name="twitter:image"]').attr('content') ||
                            $('link[rel="image_src"]').attr('href');

                        if (!imageUrl) {
                            // Fallback to first large image
                            $('img').each((i, el) => {
                                const src = $(el).attr('src');
                                if (src && !src.includes('logo') && !src.includes('icon')) {
                                    imageUrl = src;
                                    return false; // break
                                }
                            });
                        }

                        if (imageUrl) {
                            // Convert relative to absolute
                            if (imageUrl.startsWith("/")) {
                                imageUrl = new URL(imageUrl, url.origin).href;
                            }

                            // Download image and convert to base64
                            const imgRes = await fetch(imageUrl);
                            const arrayBuffer = await imgRes.arrayBuffer();
                            const buffer = Buffer.from(arrayBuffer);
                            const mimeType = imgRes.headers.get("content-type") || "image/jpeg";
                            const base64 = buffer.toString("base64");

                            finalReferenceImages.push({ base64, mimeType });
                        }
                    } catch (e: any) {
                        console.error("Failed to scrape reference link:", e.message);
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message: `Could not extract an image from the provided link: ${e.message}`
                        });
                    }
                }

                if (finalReferenceImages.length === 0) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "At least one reference image or a valid product link with an image must be provided."
                    });
                }

                const generatedResults = await generateTryOnImages(
                    input.prompt,
                    input.modelImage,
                    finalReferenceImages,
                    input.logoImage,
                    input.category,
                    key,
                    input.modelId
                );

                // Upload all results to storage
                const uploadedUrls = [];
                for (const result of generatedResults) {
                    const buffer = Buffer.from(result.base64, "base64");
                    const ext = result.mimeType.split("/")[1] ?? "jpeg";
                    const storageKey = `portfolio/tryon-${result.view}-${nanoid(10)}.${ext}`;
                    const { url } = await storagePut(storageKey, buffer, result.mimeType);
                    uploadedUrls.push({ view: result.view, url });
                }

                return { images: uploadedUrls, success: true };
            } catch (err: any) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Virtual Try-On generation failed: ${err.message}`,
                });
            }
        }),

    // Premium: Auto-fill product form based on grid image
    prefillProductFromGrid: adminProcedure
        .input(z.object({
            prompt: z.string(),
            base64: z.string(),
            mimeType: z.string(),
            apiKey: z.string().optional(),
            modelId: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            try {
                const { prefillProductDataFromGrid } = await import("./gemini");
                const key = input.apiKey || (ctx.user as any).geminiApiKey || undefined;
                const productData = await prefillProductDataFromGrid(input.prompt, input.base64, input.mimeType, key, input.modelId);
                return { productData, success: true };
            } catch (err: any) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Product prefill failed: ${err.message}`,
                });
            }
        }),

    // Get saved Virtual Try-On models
    getSavedModels: adminProcedure
        .query(async () => {
            try {
                const { getSavedTryOnModels } = await import("../db");
                const models = await getSavedTryOnModels();
                return { models, success: true };
            } catch (err: any) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to fetch saved models: ${err.message}`,
                });
            }
        }),

    // Save a new Virtual Try-On model to the database
    saveTryOnModel: adminProcedure
        .input(z.object({
            base64: z.string(),
            mimeType: z.string(),
            name: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            try {
                const { insertSavedTryOnModel } = await import("../db");
                const buffer = Buffer.from(input.base64, "base64");
                const ext = input.mimeType.split("/")[1] ?? "jpeg";
                const storageKey = `portfolio/saved-model-${nanoid(10)}.${ext}`;
                const { url } = await storagePut(storageKey, buffer, input.mimeType);

                await insertSavedTryOnModel({
                    imageUrl: url,
                    name: input.name || "Custom Model",
                });
                return { imageUrl: url, success: true };
            } catch (err: any) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to save model: ${err.message}`,
                });
            }
        }),

    // Premium: Save the final approved grid design to storage
    saveStudioImage: adminProcedure
        .input(z.object({
            base64: z.string(),
            mimeType: z.string(),
        }))
        .mutation(async ({ input }) => {
            try {
                const buffer = Buffer.from(input.base64, "base64");
                const ext = input.mimeType.split("/")[1] ?? "jpeg";
                const storageKey = `portfolio/studio-concept-${nanoid(10)}.${ext}`;
                const { url } = await storagePut(storageKey, buffer, input.mimeType);
                return { imageUrl: url, success: true };
            } catch (err: any) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to save studio image: ${err.message}`,
                });
            }
        }),
});

