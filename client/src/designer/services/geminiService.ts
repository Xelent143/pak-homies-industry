import { GoogleGenerativeAI } from "@google/generative-ai";

// In a real app, this should be in an env variable
// For this playground, we will rely on the user inputting it or us guiding them.
export const generateRealisticRender = async (
    apiKey: string,
    imageBase64: string,
    promptContext: string
): Promise<string> => {
    if (!apiKey) throw new Error("API Key is missing");

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    // User specified model code:
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-image-preview" });

    const base64Data = imageBase64.split(',')[1] || imageBase64;

    const prompt = `
    You are an expert fashion photographer and 3D rendering specialist.
    Analyze this 3D preview screenshot.
    
    CRITICAL INSTRUCTIONS:
    1. Keep the EXACT SAME ANGLE and perspective.
    2. Maintain the EXACT SAME PRODUCT design, logos, and placement.
    3. The output description must be for a PHOTOREALISTIC MODEL PHOTOSHOOT.
    
    Style: High-End Editorial, Vogue Feature.
    Setting: Professional Studio Lighting (Softbox, Rim Edge Light).
    Subject: The garment is strictly the focus. If a model is implied, they are professional and the fit is perfect.
    
    User Context/Materials:
    ${promptContext}
    
    Task:
    Provide a concise but extremely detailed prompt description that generates this exact image but as a real 8k photograph.
  `;

    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType: "image/png",
        },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
};

export const generateImageWithGemini = async (apiKey: string, prompt: string): Promise<string> => {
    // Call User-Specified Model: gemini-3-pro-image-preview
    // Using v1alpha as this is likely a bleeding-edge preview model not yet in v1beta
    const url = `https://generativelanguage.googleapis.com/v1alpha/models/gemini-3-pro-image-preview:predict?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            instances: [
                { prompt: prompt }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: "16:9" // or "1:1"
            }
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "Imagen generation failed");
    }

    const data = await response.json();
    // Imagen returns base64 string
    const base64Image = data.predictions?.[0]?.bytesBase64Encoded;

    if (!base64Image) {
        throw new Error("No image returned from Gemini Imagen.");
    }

    return `data:image/png;base64,${base64Image}`;
};
