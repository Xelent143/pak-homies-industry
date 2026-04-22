import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { ENV } from "../../server/_core/env";

// ─── Gemini Client ────────────────────────────────────────────────────────────

// Cache clients by API key to avoid re-creating on every call
const _clientCache = new Map<string, GoogleGenerativeAI>();

function getClient(apiKey?: string): GoogleGenerativeAI {
    const key = apiKey || ENV.geminiApiKey;
    if (!key || key === "your_gemini_api_key_here") {
        throw new Error("GEMINI_API_KEY is not configured. Please set your Gemini API key in the AI Agent settings.");
    }
    if (!_clientCache.has(key)) {
        _clientCache.set(key, new GoogleGenerativeAI(key));
    }
    return _clientCache.get(key)!;
}

// ─── Safety Settings ──────────────────────────────────────────────────────────

const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

// ─── Chat Function ────────────────────────────────────────────────────────────

export interface ChatMessage {
    role: "user" | "model";
    text: string;
}

export async function chatWithProductAgent(
    conversationHistory: ChatMessage[],
    userMessage: string,
    systemPrompt: string,
    apiKey?: string,
    modelId: string = "gemini-2.5-flash",
): Promise<string> {
    const client = getClient(apiKey);
    const model = client.getGenerativeModel({
        model: modelId,
        systemInstruction: systemPrompt,
        safetySettings,
    });

    const chat = model.startChat({
        history: conversationHistory.map((m) => ({
            role: m.role,
            parts: [{ text: m.text }],
        })),
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
}

// ─── Product Generation ───────────────────────────────────────────────────────

export interface GeneratedProductData {
    title: string;
    slug: string;
    category: string;
    shortDescription: string;
    description: string;
    manufacturingStory: string;
    infographicPrompt: string;
    material: string;
    availableSizes: string[];
    availableColors: string[];
    samplePrice: string;
    weight: string; // kg
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    moqSlabs: Array<{
        minQty: number;
        maxQty: number | null;
        pricePerUnit: string;
        label: string;
    }>;
    imagePrompt: string;
}

export async function generateProductData(
    userDescription: string,
    brandContext: string = "Pak Homies Industry, a premium B2B eco-friendly apparel manufacturer from Pakistan",
    apiKey?: string,
    modelId: string = "gemini-3.1-pro-preview",
): Promise<GeneratedProductData> {
    const client = getClient(apiKey);
    const model = client.getGenerativeModel({
        model: modelId,
        safetySettings,
        generationConfig: {
            responseMimeType: "application/json",
        },
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
    const text = result.response.text().trim();

    // Strip markdown code fences if present
    const jsonText = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

    return JSON.parse(jsonText) as GeneratedProductData;
}

// ─── Product Image Generation ─────────────────────────────────────────────────

export async function generateProductImageBase64(
    imagePrompt: string,
    logoBase64?: string,
    logoMimeType?: string,
    apiKey?: string,
    modelId: string = "gemini-3-pro-image-preview",
): Promise<{ base64: string; mimeType: string }> {
    const client = getClient(apiKey);

    const model = client.getGenerativeModel({ model: modelId });

    const parts: any[] = [
        {
            text: `Generate a professional, high-quality e-commerce product photo. ${imagePrompt}. 
      Studio lighting, clean white or dark background, professional photography style, 
      ultra-realistic, 4K quality. The image should look like it belongs on a premium B2B apparel website.
      ${logoBase64 ? "Incorporate the provided logo prominently but tastefully on the garment." : ""}`,
        },
    ];

    if (logoBase64 && logoMimeType) {
        parts.push({
            inlineData: {
                mimeType: logoMimeType,
                data: logoBase64,
            },
        });
    }

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: {
                responseModalities: ["image", "text"],
            } as any,
        });

        const response = result.response;
        for (const candidate of response.candidates ?? []) {
            for (const part of candidate.content?.parts ?? []) {
                if ((part as any).inlineData) {
                    return {
                        base64: (part as any).inlineData.data,
                        mimeType: (part as any).inlineData.mimeType ?? "image/png",
                    };
                }
            }
        }
        throw new Error("No image data in Gemini response");
    } catch (err) {
        throw new Error(`Image generation failed: ${String(err)}`);
    }
}

// ─── Infographic Image Generation ─────────────────────────────────────────────

export async function generateInfographicImageBase64(
    prompt: string,
    apiKey?: string,
    modelId: string = "gemini-3-pro-image-preview",
): Promise<{ base64: string; mimeType: string }> {
    const client = getClient(apiKey);
    const model = client.getGenerativeModel({ model: modelId });

    const parts: any[] = [
        {
            text: `Act as a senior graphic designer specializing in detailed production infographics and vector illustrations.
            Use the "nano banana pro" style (ultra-high quality, detailed, visually striking illustrative style) to generate an infographic explanation image based strictly on this prompt: "${prompt}".
            The image should visually explain the garment's fabrics, embellishments, stitching types, and production details as a comprehensive visual guide. 
            Do NOT include long paragraphs of text. Use icons, diagrams, and illustrative callouts.
            CRITICAL LAYOUT INSTRUCTION: The generated image MUST be strictly in a VERTICAL/PORTRAIT aspect ratio (e.g. 2:3 or 3:4 or 9:16) to match standard apparel photography. Do NOT generate a horizontal or square image.
            Background MUST be a solid color (e.g., pure white or slightly off-white). No watermarks. 4K high quality.`,
        },
    ];

    let lastError: Error = new Error("Unknown error");
    const maxRetries = 2;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig: {
                    responseModalities: ["image", "text"],
                } as any,
            });

            const response = result.response;
            for (const candidate of response.candidates ?? []) {
                for (const part of candidate.content?.parts ?? []) {
                    if ((part as any).inlineData) {
                        return {
                            base64: (part as any).inlineData.data,
                            mimeType: (part as any).inlineData.mimeType ?? "image/jpeg",
                        };
                    }
                }
            }
            throw new Error(`Attempt ${attempt}: No image data in Gemini response`);
        } catch (err: any) {
            console.error(`[Infographic Gen] Attempt ${attempt} failed:`, err.message);
            lastError = err;
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }
    }

    throw new Error(`Infographic image generation failed after ${maxRetries} attempts: ${lastError.message}`);
}

// ─── Image SEO Optimization ───────────────────────────────────────────────────

export interface OptimizedImageData {
    filename: string;
    altText: string;
    caption: string;
}

export async function analyzeImageForSeo(
    base64: string,
    mimeType: string,
    apiKey?: string,
    modelId: string = "gemini-2.5-flash",
): Promise<OptimizedImageData> {
    const client = getClient(apiKey);
    const model = client.getGenerativeModel({
        model: modelId,
        generationConfig: {
            responseMimeType: "application/json",
        },
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
                    data: base64,
                },
            },
        ]);

        const text = result.response.text().trim();
        const jsonText = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
        return JSON.parse(jsonText) as OptimizedImageData;
    } catch (err: any) {
        throw new Error(`SEO analysis failed: ${err.message}`);
    }
}

export async function analyzeUploadedProductImageBase64(
    base64: string,
    mimeType: string,
    brandContext: string = "Pak Homies Industry, a premium B2B eco-friendly apparel manufacturer from Pakistan",
    apiKey?: string,
    modelId: string = "gemini-3.1-pro-preview",
): Promise<GeneratedProductData> {
    const client = getClient(apiKey);
    const model = client.getGenerativeModel({
        model: modelId,
        safetySettings,
        generationConfig: {
            responseMimeType: "application/json",
        },
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
                data: base64,
            },
        },
    ]);
    const text = result.response.text().trim();

    // Strip markdown code fences if present
    const jsonText = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

    return JSON.parse(jsonText) as GeneratedProductData;
}

// ─── Premium Fashion Designer Studio ──────────────────────────────────────────

export async function generateDesignerGrid(
    prompt: string,
    apiKey?: string,
    modelId: string = "gemini-3-pro-image-preview",
): Promise<{ base64: string; mimeType: string }> {
    const client = getClient(apiKey);
    const model = client.getGenerativeModel({ model: modelId });

    const parts: any[] = [
        {
            text: `Act as a senior high-end fashion designer and professional photographer.
Generate a complete multi-view fashion photography grid of a single apparel item: ${prompt}. 
The image MUST be a 2x2 or composite grid showing strictly these 4 DISTINCT views:
1. Full Front View (facing forward)
2. Full Back View (facing away)
3. Full Left Profile View (the clothing item is seen from its left side, facing left)
4. Full Right Profile View (the clothing item is seen from its right side, facing right)
CRITICAL: The Left Profile and Right Profile MUST be different. They are the two opposite sides of the garment. Ensure the orientation is correct. NO DUPLICATE VIEWS.
Studio lighting, clean solid background, ultra-realistic 4K quality, premium B2B catalog style. DO NOT include text in the image.`,
        },
    ];

    let lastError: Error = new Error("Unknown error");
    const maxRetries = 2; // Two attempts to keep it under strict proxy timeout limits

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig: {
                    responseModalities: ["image", "text"],
                } as any,
            });

            const response = result.response;
            for (const candidate of response.candidates ?? []) {
                for (const part of candidate.content?.parts ?? []) {
                    if ((part as any).inlineData) {
                        return {
                            base64: (part as any).inlineData.data,
                            mimeType: (part as any).inlineData.mimeType ?? "image/jpeg",
                        };
                    }
                }
            }
            throw new Error(`Attempt ${attempt}: No image data in Gemini response`);
        } catch (err: any) {
            console.error(`[Grid Gen] Attempt ${attempt} failed:`, err.message);
            lastError = err;
            if (attempt < maxRetries) {
                // Short wait before retry
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }
    }

    throw new Error(`Grid image generation failed after ${maxRetries} attempts: ${lastError.message}`);
}

export async function generateIndividualView(
    basePrompt: string,
    viewType: string,
    apiKey?: string,
    modelId: string = "gemini-3-pro-image-preview",
    referenceImage?: { base64: string; mimeType: string },
): Promise<{ base64: string; mimeType: string }> {
    const client = getClient(apiKey);
    const model = client.getGenerativeModel({ model: modelId });

    const parts: any[] = [];

    if (referenceImage) {
        parts.push({
            inlineData: {
                data: referenceImage.base64,
                mimeType: referenceImage.mimeType,
            },
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
6. CRITICAL: Generate EXACTLY ONE person/mannequin/item in the image. DO NOT generate multiple angles, split screens, reflections, or front-and-back views together. ONLY show the single requested view.`,
    });

    let lastError = new Error("Unknown error");
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig: {
                    responseModalities: ["image", "text"],
                } as any,
            });

            const response = result.response;
            for (const candidate of response.candidates ?? []) {
                for (const part of candidate.content?.parts ?? []) {
                    if ((part as any).inlineData) {
                        return {
                            base64: (part as any).inlineData.data,
                            mimeType: (part as any).inlineData.mimeType ?? "image/jpeg",
                        };
                    }
                }
            }
            throw new Error(`Attempt ${attempt}: No image data in Gemini response (model likely returned text/apology)`);
        } catch (err: any) {
            console.error(`[Individual View Gen] Attempt ${attempt} failed for ${viewType}:`, err.message);
            lastError = err;
            // Wait slightly before retrying
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }
    }

    throw new Error(`Individual view generation failed for ${viewType} after ${maxRetries} attempts: ${lastError.message}`);
}

export async function generateTryOnImages(
    prompt: string,
    modelImage: { base64: string; mimeType: string },
    referenceImages: Array<{ base64: string; mimeType: string }>,
    logoImage?: { base64: string; mimeType: string },
    category?: string,
    apiKey?: string,
    modelId: string = "gemini-3-pro-image-preview",
): Promise<Array<{ view: string; base64: string; mimeType: string }>> {
    const client = getClient(apiKey);
    const model = client.getGenerativeModel({ model: modelId });

    const sharedParts: any[] = [];

    // 1. Add Model Image First
    sharedParts.push({
        text: "BASE MODEL IMAGE (The person/mannequin to dress):",
    });
    sharedParts.push({
        inlineData: { data: modelImage.base64, mimeType: modelImage.mimeType },
    });

    // 2. Add Reference Images
    sharedParts.push({
        text: "REFERENCE PRODUCT IMAGES (The garment to extract and apply):",
    });
    referenceImages.forEach((img) => {
        sharedParts.push({
            inlineData: { data: img.base64, mimeType: img.mimeType },
        });
    });

    // 3. Add Logo if present
    if (logoImage) {
        sharedParts.push({
            text: "LOGO TO APPLY TO GARMENT:",
        });
        sharedParts.push({
            inlineData: { data: logoImage.base64, mimeType: logoImage.mimeType },
        });
    }

    const views = [
        { name: "Front View", instruction: "Solid light background. Full-body shot (head to toe). Model facing perfectly forward in a confident, professional luxury-brand pose." },
        { name: "Right Side View", instruction: "Solid light background. Full-body shot (head to toe). Model turned showing their right side in a confident, professional luxury-brand pose." },
        { name: "Back View", instruction: "Solid light background. Full-body shot (head to toe). Model facing away from the camera, showing the back of the garment in a confident, professional luxury-brand pose." },
        { name: "Closeup Collage", instruction: "Solid light background. A 4x4 grid closeup collage showing fabric textures, stitching, and different zoomed-in parts of the garment only." },
        { name: "Lifestyle Photoshoot", instruction: `Dynamic full-body lifestyle photoshoot in a relevant environment based on the garment category: ${category || "outdoors"}. Do NOT use a solid background for this one, integrate them into a real scene with a confident, professional luxury-brand pose.` }
    ];

    const generateSingleView = async (view: typeof views[0]) => {
        const parts = [...sharedParts];

        // 4. Instructions
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
        const maxRetries = 2; // Keep retries low for parallel batch to not stall forever

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await model.generateContent({
                    contents: [{ role: "user", parts }],
                    generationConfig: {
                        responseModalities: ["image", "text"],
                    } as any,
                });

                const response = result.response;
                for (const candidate of response.candidates ?? []) {
                    for (const part of candidate.content?.parts ?? []) {
                        if ((part as any).inlineData) {
                            return {
                                view: view.name,
                                base64: (part as any).inlineData.data,
                                mimeType: (part as any).inlineData.mimeType ?? "image/jpeg",
                            };
                        }
                    }
                }
                throw new Error(`Attempt ${attempt}: No image data in Gemini response`);
            } catch (err: any) {
                console.error(`[Grid Gen] Attempt ${attempt} failed for ${view.name}:`, err.message);
                lastError = err;
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }
        }

        throw new Error(`Virtual Try-On generation failed for ${view.name} after ${maxRetries} attempts: ${lastError.message}`);
    };

    // Run all 5 image generations in parallel
    const results = await Promise.all(views.map(view => generateSingleView(view)));

    return results;
}

export async function prefillProductDataFromGrid(
    imagePrompt: string,
    base64: string,
    mimeType: string,
    apiKey?: string,
    modelId: string = "gemini-2.5-flash",
): Promise<any> {
    const client = getClient(apiKey);
    const model = client.getGenerativeModel({
        model: modelId,
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
        },
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
                    data: base64,
                },
            },
        ]);

        const text = result.response.text().trim();
        const jsonText = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
        return JSON.parse(jsonText);
    } catch (err) {
        throw new Error(`Data prefill failed: ${String(err)}`);
    }
}

