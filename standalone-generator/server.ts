import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import FormData from "form-data";
import axios from "axios";
import { nanoid } from "nanoid";
import { sql } from "drizzle-orm";

// Automatically load from parent project .env so the user doesn't have to duplicate keys!
dotenv.config({ path: '../.env' });
dotenv.config({ path: '../.env.production' }); // Fallback

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Required API Keys
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || "INSERT_YOUR_IMGBB_API_KEY_HERE";

if (!GEMINI_API_KEY) console.warn("WARNING: GEMINI_API_KEY not found in parent .env");
if (!DATABASE_URL) console.warn("WARNING: DATABASE_URL not found in parent .env");
if (IMGBB_API_KEY.includes("INSERT")) console.warn("WARNING: IMGBB_API_KEY not found in parent .env");

// ─── Drizzle Setup ────────────────────────────────────────────────────────
const poolConnection = mysql.createPool(DATABASE_URL!);
const db = drizzle(poolConnection);

// ─── Gemini Setup ─────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

// ─── Phase 1: Master Concept Generation ──────────────────────────────────────
app.post("/api/generate-concept", async (req, res) => {
    try {
        const { prompt, geminiKey, logoBase64 } = req.body;
        const apiKey = geminiKey || GEMINI_API_KEY;
        if (!apiKey) return res.status(400).json({ error: "Gemini API Key is required. Please set it in the Settings panel." });

        console.log(`[AI] Generating Master Concept for: "${prompt}"...`);
        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ model: "gemini-3.1-flash-image-preview" });

        const strictPrompt = `
Act as a creative high-end fashion designer working for big brands.
Process the user's product idea and design a fresh, practical, and trending product from scratch.
Generate a gorgeous 2-view grid layout (Front View and Back View) of the exact same product worn by a model.
CRITICAL INSTRUCTION: Generate a FULL BODY, HEAD-TO-TOE profile. DO NOT crop the head or the legs. The entire body must be visible including shoes and head.
${logoBase64 ? "CRITICAL: The user has attached a logo. You MUST incorporate this small logo tastefully as a branding element on the garment. The rest of the design must be unique and novel." : ""}
Product Idea: ${prompt}
Style: High-end streetwear/sports manufacturer, studio lighting, masterpiece quality, photorealistic, full body shot.
CRITICAL RULE: DO NOT include any text or words in the final output except for the provided logo.
`;

        const parts: any[] = [{ text: strictPrompt }];
        if (logoBase64) {
            // Assume image/png if not specified, strip the data:image/png;base64, prefix if present
            const base64Data = logoBase64.replace(/^data:image\/\w+;base64,/, "");
            parts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: "image/png"
                }
            });
        }

        let result;
        try {
            result = await model.generateContent({
                contents: [{ role: "user", parts }],
            });
        } catch (genError: any) {
            console.error("[Gemini API Error Detail]:", genError);
            if (genError.message && genError.message.includes("403")) {
                throw new Error("Gemini API Key is invalid or has been blocked (403 Forbidden). Please generate a new key at aistudio.google.com and update the Settings panel.");
            }
            throw new Error(`Gemini generation failed: ${genError.message}`);
        }

        const imagePart = result.response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!imagePart || !imagePart.inlineData) {
            throw new Error("Gemini did not return an image part. It may have returned safety text.");
        }

        const base64 = imagePart.inlineData.data;
        const mimeType = imagePart.inlineData.mimeType;
        console.log(`[AI] Concept Generated successfully. Size: ${Math.round(base64.length / 1024)}KB`);

        res.json({ base64, mimeType });
    } catch (error: any) {
        console.error("[AI Base64 Gen Error]:", error);
        res.status(500).json({ error: error.message });
    }
});

// ─── Phase 2: Individual View Generation ─────────────────────────────────────
app.post("/api/generate-view", async (req, res) => {
    try {
        const { prompt, viewType, referenceBase64, geminiKey } = req.body;
        const apiKey = geminiKey || GEMINI_API_KEY;
        if (!apiKey) return res.status(400).json({ error: "Gemini API Key is required." });
        if (!referenceBase64) return res.status(400).json({ error: "Master Concept reference image is required." });

        console.log(`[AI] Generating Sub-View (${viewType}) for: "${prompt}"...`);
        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ model: "gemini-3.1-flash-image-preview" });

        const strictPrompt = `
Using the attached master concept design as an absolute reference, generate a photorealistic ${viewType} View of this exact same garment worn by a model. 
CRITICAL INSTRUCTION: Generate a FULL BODY, HEAD-TO-TOE profile. DO NOT crop the head or the legs. The entire body must be visible including shoes and head.
Maintain perfect consistency with the reference design's colors, materials, patterns, and branding. 
Product Context: ${prompt}
Output ONLY the ${viewType} View. 
CRITICAL RULE: DO NOT include any text, words, or split-screens. Just one single solid angle image.
`;

        const referenceData = referenceBase64.replace(/^data:image\/\w+;base64,/, "");

        const parts: any[] = [
            { text: strictPrompt },
            { inlineData: { data: referenceData, mimeType: "image/png" } }
        ];

        let result;
        try {
            result = await model.generateContent({
                contents: [{ role: "user", parts }],
            });
        } catch (genError: any) {
            console.error(`[Gemini API Error Detail - ${viewType}]:`, genError);
            if (genError.message && genError.message.includes("403")) {
                throw new Error("Gemini API Key is invalid or has been blocked (403 Forbidden).");
            }
            throw new Error(`Gemini generation failed: ${genError.message}`);
        }

        const imagePart = result.response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!imagePart || !imagePart.inlineData) {
            throw new Error("Gemini did not return an image part for the requested view.");
        }

        const base64 = imagePart.inlineData.data;
        const mimeType = imagePart.inlineData.mimeType;
        console.log(`[AI] ${viewType} Generated successfully. Size: ${Math.round(base64.length / 1024)}KB`);

        res.json({ base64, mimeType });
    } catch (error: any) {
        console.error(`[AI Sub-View Error - ${req.body?.viewType}]:`, error);
        res.status(500).json({ error: error.message });
    }
});

// ─── AI SEO Prefill Endpoint ──────────────────────────────────────────────
app.post("/api/prefill-seo", async (req, res) => {
    try {
        const { prompt, base64, mimeType, geminiKey } = req.body;
        const apiKey = geminiKey || GEMINI_API_KEY;
        if (!apiKey) return res.status(400).json({ error: "Gemini API Key is required." });
        console.log(`[AI] Analyzing image to prefill SEO Data...`);

        const promptText = `
You are an expert SEO Product Copywriter for Pak Homies Industry (a B2B custom apparel manufacturer).
Look at the attached product design based on the prompt: "${prompt}".
Generate a structured JSON payload for our database exactly matching this schema:
{
  "title": "A catchy, premium SEO product title (max 50 chars)",
  "category": "Pick one: Streetwear, Sports Wear, Tech Wear, Martial Arts Wear",
  "shortDescription": "A highly compelling 3-sentence B2B pitch focusing on custom manufacturing and quality.",
  "material": "The dominant fabric in 3 words (e.g. 100% Cotton Fleece)",
  "samplePrice": 45,
  "seoTitle": "SEO meta title focusing on Wholesale / Custom Manufacturer",
  "seoKeywords": "comma separated B2B keywords"
}
Ensure it is ONLY valid JSON.
`;
        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ model: "gemini-3.1-pro-preview" });
        const result = await model.generateContent([
            promptText,
            { inlineData: { data: base64, mimeType } }
        ]);

        let responseText = result.response.text().trim();
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "");
        const parsed = JSON.parse(responseText);

        res.json(parsed);
    } catch (error: any) {
        console.error("[SEO Gen Error]:", error);
        res.status(500).json({ error: error.message });
    }
});

// ─── Direct Hostinger SFTP Uploader ────────────────────────────────────────
app.post("/api/upload-hostinger", async (req, res) => {
    try {
        const { base64, sftpHost, sftpUser, sftpPass, sftpPort, siteDomain } = req.body;
        if (!base64) return res.status(400).json({ error: "Missing image data" });
        if (!sftpHost || !sftpUser || !sftpPass) return res.status(400).json({ error: "Hostinger SSH/SFTP credentials are required. Please set them in Settings." });

        const SftpClient = (await import("ssh2-sftp-client")).default;
        const sftp = new SftpClient();

        const fileName = `studio-${nanoid(10)}.png`;
        const remotePath = `/home/${sftpUser}/htdocs/uploads/portfolio/${fileName}`;
        const buffer = Buffer.from(base64, "base64");

        console.log(`[SFTP] Connecting to ${sftpHost}:${sftpPort || 65002}...`);
        await sftp.connect({
            host: sftpHost,
            port: parseInt(sftpPort) || 65002,
            username: sftpUser,
            password: sftpPass,
        });

        // Ensure the remote directory exists
        const remoteDir = `/home/${sftpUser}/htdocs/uploads/portfolio`;
        const dirExists = await sftp.exists(remoteDir);
        if (!dirExists) {
            await sftp.mkdir(remoteDir, true);
            console.log(`[SFTP] Created remote directory: ${remoteDir}`);
        }

        console.log(`[SFTP] Uploading ${fileName} (${Math.round(buffer.length / 1024)}KB)...`);
        await sftp.put(buffer, remotePath);
        await sftp.end();

        // Build the public URL on the user's domain
        const domain = siteDomain || sftpHost;
        const publicUrl = `https://${domain}/uploads/portfolio/${fileName}`;
        console.log(`[SFTP] Upload Success! Public URL: ${publicUrl}`);

        res.json({ url: publicUrl });
    } catch (error: any) {
        console.error("[SFTP Upload Error]:", error.message);
        res.status(500).json({ error: `SFTP upload failed: ${error.message}` });
    }
});

// ─── Remote DB Publisher ───────────────────────────────────────────────────
app.post("/api/publish", async (req, res) => {
    try {
        const data = req.body;
        console.log(`[DB] Publishing to Live Hostinger Database: ${data.title}...`);

        // We avoid heavy Drizzle schema definitions here by executing a raw prepared statement
        // It's much cleaner for a standalone tool
        const insertQuery = sql`
            INSERT INTO products (
                slug, title, category, description, shortDescription, 
                material, samplePrice, mainImage, isFeatured, 
                seoTitle, seoKeywords
            ) VALUES (
                ${data.slug}, ${data.title}, ${data.category}, '<p>High quality custom manufactured product by Pak Homies Industry.</p>', ${data.shortDescription},
                ${data.material}, ${data.samplePrice}, ${data.mainImage}, 1,
                ${data.seoTitle}, ${data.seoKeywords}
            )
        `;

        await db.execute(insertQuery);
        console.log(`[DB] Published successfully!`);
        res.json({ success: true });
    } catch (error: any) {
        console.error("[DB Insert Error]:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = 4005;
app.listen(PORT, () => {
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 SIALKOT STANDALONE GENERATOR RUNNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Backend: http://localhost:${PORT}

To use the generator, run: "npm run dev" to start the frontend.
`);
});

