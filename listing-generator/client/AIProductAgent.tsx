import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Bot, Send, Sparkles, Upload, Package, Loader2,
    ImagePlus, CheckCircle, RefreshCw, X, ChevronDown, ChevronUp, Eye,
    Key, Save, EyeOff, Settings
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
    role: "user" | "model";
    text: string;
    timestamp: Date;
}

interface GeneratedProduct {
    title: string;
    slug: string;
    category: string;
    shortDescription: string;
    description: string;
    manufacturingStory: string;
    material: string;
    availableSizes: string[];
    availableColors: string[];
    samplePrice: string;
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
    infographicPrompt: string;
    generatedImageUrl?: string;
    generatedInfographicUrl?: string;
}

// ─── Product Preview Card ─────────────────────────────────────────────────────

function ProductPreview({
    product,
    onPost,
    onGenerateImage,
    onGenerateInfographic,
    isPosting,
    isGeneratingImage,
    isGeneratingInfographic,
}: {
    product: GeneratedProduct;
    onPost: (product: GeneratedProduct) => void;
    onGenerateImage: () => void;
    onGenerateInfographic: () => void;
    isPosting: boolean;
    isGeneratingImage: boolean;
    isGeneratingInfographic: boolean;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="mt-3 rounded-xl border border-gold/30 bg-background/80 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gold/5">
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gold" />
                    <span className="font-condensed font-bold uppercase tracking-wider text-sm text-foreground">
                        Generated Product Preview
                    </span>
                </div>
                <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">{product.category}</Badge>
            </div>

            {/* Main Info */}
            <div className="p-4 space-y-3">
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.generatedImageUrl && (
                        <img
                            src={product.generatedImageUrl}
                            alt={product.title}
                            className="w-full max-w-[200px] max-h-48 object-cover rounded-lg border border-border shrink-0"
                        />
                    )}
                    {product.generatedInfographicUrl && (
                        <img
                            src={product.generatedInfographicUrl}
                            alt="Manufacturing Story Infographic"
                            className="w-full max-w-[200px] max-h-48 object-cover rounded-lg border border-border shrink-0"
                        />
                    )}
                </div>

                <div>
                    <h3 className="font-serif text-lg font-bold text-foreground">{product.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{product.shortDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-secondary/50 rounded p-2">
                        <span className="text-muted-foreground">Material</span>
                        <p className="text-foreground font-medium mt-0.5">{product.material}</p>
                    </div>
                    <div className="bg-secondary/50 rounded p-2">
                        <span className="text-muted-foreground">Sample Price</span>
                        <p className="text-foreground font-medium mt-0.5">${product.samplePrice}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {product.availableColors.map((c) => (
                        <span key={c} className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                            {c}
                        </span>
                    ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                    {product.availableSizes.map((s) => (
                        <span key={s} className="text-xs border border-border px-2 py-0.5 rounded font-mono text-foreground">
                            {s}
                        </span>
                    ))}
                </div>

                {/* MOQ Slabs */}
                <div className="border border-border rounded-lg overflow-hidden">
                    <div className="px-3 py-1.5 bg-secondary text-xs font-condensed font-bold uppercase tracking-wider text-muted-foreground">
                        MOQ Price Tiers
                    </div>
                    {product.moqSlabs.map((slab, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 border-t border-border text-xs">
                            <span className="text-muted-foreground">
                                {slab.minQty}–{slab.maxQty ?? "∞"} pcs
                            </span>
                            <span className="font-bold text-foreground">${slab.pricePerUnit}/pc</span>
                            {slab.label && (
                                <Badge className="text-[10px] bg-gold/10 text-gold border-gold/20">{slab.label}</Badge>
                            )}
                        </div>
                    ))}
                </div>

                {/* Manufacturing Story Preview */}
                <div className="border border-border rounded-lg overflow-hidden">
                    <div className="px-3 py-1.5 bg-secondary text-xs font-condensed font-bold uppercase tracking-wider text-muted-foreground">
                        Manufacturing Story
                    </div>
                    {product.manufacturingStory ? (
                        <div className="px-3 py-2 text-xs text-foreground bg-secondary/20 italic whitespace-pre-wrap">
                            {product.manufacturingStory}
                        </div>
                    ) : (
                        <div className="px-3 py-2 text-xs text-muted-foreground">
                            Not generated for this product.
                        </div>
                    )}
                </div>

                {/* Expanded SEO Info */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {expanded ? "Hide" : "Show"} SEO Details
                </button>

                {expanded && (
                    <div className="space-y-2 text-xs border-t border-border pt-2">
                        <div>
                            <span className="text-muted-foreground uppercase tracking-wider font-semibold">SEO Title</span>
                            <p className="text-foreground mt-0.5">{product.seoTitle}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground uppercase tracking-wider font-semibold">Meta Description</span>
                            <p className="text-foreground mt-0.5">{product.seoDescription}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground uppercase tracking-wider font-semibold">Keywords</span>
                            <p className="text-muted-foreground mt-0.5">{product.seoKeywords}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 p-4 pt-0">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 text-xs h-9 font-condensed font-semibold uppercase tracking-wider border-border"
                        onClick={onGenerateImage}
                        disabled={isGeneratingImage}
                    >
                        {isGeneratingImage ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5 mr-1.5" />}
                        {isGeneratingImage ? "Gen Image" : "🖼️ Image"}
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1 text-xs h-9 font-condensed font-semibold uppercase tracking-wider border-border"
                        onClick={onGenerateInfographic}
                        disabled={isGeneratingInfographic}
                    >
                        {isGeneratingInfographic ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
                        {isGeneratingInfographic ? "Gen Info..." : "📊 Infographic"}
                    </Button>
                </div>
                <Button
                    className="w-full bg-gold text-black hover:bg-gold/90 font-condensed font-bold uppercase tracking-wider text-xs h-9"
                    onClick={() => onPost(product)}
                    disabled={isPosting}
                >
                    {isPosting ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                    {isPosting ? "Posting..." : "✅ Post to Website"}
                </Button>
            </div>
        </div>
    );
}

// ─── Main AI Product Agent Component ─────────────────────────────────────────

export default function AIProductAgent({
    initialImageUrl,
    onClearInitialImage
}: {
    initialImageUrl?: string | null;
    onClearInitialImage?: () => void;
}) {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "model",
            text: "👋 Welcome! I'm your **AI Product Posting Consultant** powered by Gemini.\n\nI can help you create complete, SEO-optimized product listings for Pak Homies Industry. Just describe any product you want to add — for example:\n\n*\"Create a listing for a custom waterproof hunting jacket with fleece lining, available in olive and camo\"*\n\nI'll research the market, write professional descriptions, set optimal pricing slabs, and generate beautiful product images!",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [generatedProduct, setGeneratedProduct] = useState<GeneratedProduct | null>(null);
    const [logoFile, setLogoFile] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
    const [isPosting, setIsPosting] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isGeneratingInfographic, setIsGeneratingInfographic] = useState(false);
    const [lastDescription, setLastDescription] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState("");
    const [showKey, setShowKey] = useState(false);
    const [isSavingKey, setIsSavingKey] = useState(false);
    const [modelId, setModelId] = useState("gemini-2.1-flash"); // Default for chat
    const [researchModelId, setResearchModelId] = useState("gemini-3.1-pro-preview"); // Pro for data generation

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // API Key management
    const apiKeyQuery = trpc.adminSettings.getApiKey.useQuery(undefined, { retry: false });
    const saveApiKeyMutation = trpc.adminSettings.saveApiKey.useMutation({
        onSuccess: () => {
            toast.success("API key saved!");
            apiKeyQuery.refetch();
            setIsSavingKey(false);
            setApiKeyInput("");
        },
        onError: (e) => {
            toast.error("Failed to save API key", { description: e.message });
            setIsSavingKey(false);
        },
    });

    const handleSaveApiKey = () => {
        if (!apiKeyInput.trim()) return;
        setIsSavingKey(true);
        saveApiKeyMutation.mutate({ apiKey: apiKeyInput.trim() });
    };

    const handleClearApiKey = () => {
        setIsSavingKey(true);
        saveApiKeyMutation.mutate({ apiKey: "" });
    };

    const chatMutation = trpc.aiAgent.chat.useMutation();
    const generateProductMutation = trpc.aiAgent.generateProduct.useMutation();
    const generateImageMutation = trpc.aiAgent.generateProductImage.useMutation();
    const generateInfographicMutation = trpc.aiAgent.generateInfographic.useMutation();

    const analyzeImageMutation = trpc.aiAgent.analyzeUploadedProductImage.useMutation({
        onSuccess: (data) => {
            setGeneratedProduct(data.product);
            addMessage("model", `✅ Product listing generated from image for **"${data.product.title}"**!\n\nI've extracted the design intelligence and created:\n- Full SEO-optimized overview\n- Manufacturing story\n- Pricing slabs and variations\n\nReview the product card below.`);
        },
        onError: (err) => {
            addMessage("model", `❌ Image analysis failed: ${err.message}`);
        },
        onSettled: () => setIsLoading(false)
    });

    const createProductMutation = trpc.product.create.useMutation({
        onSuccess: () => {
            toast.success("🎉 Product posted to the website!", {
                description: `"${generatedProduct?.title}" is now live in your store`,
            });
            setIsPosting(false);
        },
        onError: (e) => {
            toast.error("Failed to post product", { description: e.message });
            setIsPosting(false);
        },
    });
    const utils = trpc.useUtils();

    // Handle incoming initial image (e.g. from Virtual Try-On)
    useEffect(() => {
        if (initialImageUrl) {
            const fetchInitialImage = async () => {
                try {
                    setIsLoading(true);
                    addMessage("user", "[System] Received a generated image from Virtual Try-On Studio. Please analyze this garment and create a full product listing.");
                    addMessage("model", "🔍 Understood! Processing the Virtual Try-On image to generate your product listing data...");

                    const res = await fetch(initialImageUrl);
                    const blob = await res.blob();
                    const reader = new FileReader();

                    reader.onloadend = () => {
                        const base64data = reader.result as string;
                        analyzeImageMutation.mutate({
                            base64: base64data.split(",")[1] ?? "",
                            mimeType: blob.type,
                            apiKey: apiKeyInput || undefined,
                            modelId: researchModelId
                        });
                        if (onClearInitialImage) onClearInitialImage();
                    };
                    reader.readAsDataURL(blob);
                } catch (e) {
                    setIsLoading(false);
                    addMessage("model", "❌ Failed to load the Virtual Try-On image.");
                }
            };
            fetchInitialImage();
        }
    }, [initialImageUrl]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const addMessage = (role: "user" | "model", text: string) => {
        setMessages((prev) => [...prev, { role, text, timestamp: new Date() }]);
    };

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        setInput("");
        addMessage("user", trimmed);
        setLastDescription(trimmed);
        setIsLoading(true);

        // Build history for context (exclude the welcome message)
        const history = messages
            .filter((_, i) => i > 0)
            .map((m) => ({ role: m.role as "user" | "model", text: m.text }));

        try {
            const { reply } = await chatMutation.mutateAsync({
                history,
                message: trimmed,
                apiKey: apiKeyInput || undefined,
                modelId: modelId
            });
            addMessage("model", reply);
        } catch (err: any) {
            addMessage("model", `❌ Error: ${err.message}. Please check that your GEMINI_API_KEY is set in .env`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateProduct = async () => {
        if (!lastDescription) {
            toast.error("Please describe a product in the chat first");
            return;
        }
        setIsLoading(true);
        addMessage("model", "🚀 Generating your complete product listing... This may take a few seconds.");

        try {
            const { product } = await generateProductMutation.mutateAsync({
                description: lastDescription,
                apiKey: apiKeyInput || undefined,
                modelId: researchModelId
            });
            setGeneratedProduct(product);
            addMessage("model", `✅ Product listing generated for **"${product.title}"**!\n\nI've created:\n- Full SEO-optimized title and description\n- ${product.moqSlabs.length} MOQ price tiers\n- ${product.availableSizes.length} sizes and ${product.availableColors.length} colors\n- Complete meta tags and keywords\n\nReview the product card below. You can generate a main product image, and a matching manufacturing infographic!`);
        } catch (err: any) {
            addMessage("model", `❌ Generation failed: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateImage = async () => {
        if (!generatedProduct) return;
        setIsGeneratingImage(true);

        try {
            const { imageUrl } = await generateImageMutation.mutateAsync({
                imagePrompt: generatedProduct.imagePrompt,
                logoBase64: logoFile?.base64,
                logoMimeType: logoFile?.mimeType,
                apiKey: apiKeyInput || undefined,
            });
            setGeneratedProduct((prev) => prev ? { ...prev, generatedImageUrl: imageUrl } : prev);
            addMessage("model", `🖼️ Product image generated${logoFile ? " with your logo" : ""}!\n\nThe image has been added to your product preview above. You can now post the complete listing to your website.`);
        } catch (err: any) {
            toast.error("Image generation failed", { description: err.message });
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleGenerateInfographic = async () => {
        if (!generatedProduct || !generatedProduct.infographicPrompt) return;
        setIsGeneratingInfographic(true);

        try {
            const { imageUrl } = await generateInfographicMutation.mutateAsync({
                prompt: generatedProduct.infographicPrompt,
                apiKey: apiKeyInput || undefined,
            });
            setGeneratedProduct((prev) => prev ? { ...prev, generatedInfographicUrl: imageUrl } : prev);
            addMessage("model", `📊 Manufacturing process infographic generated successfully!\n\nIt is now shown in your product preview and will be displayed alongside the story on your website.`);
        } catch (err: any) {
            toast.error("Infographic generation failed", { description: err.message });
        } finally {
            setIsGeneratingInfographic(false);
        }
    };

    const sanitizePrice = (price: string | undefined): string | undefined => {
        if (!price) return undefined;
        const cleaned = String(price).replace(/[^0-9.]/g, "");
        const num = parseFloat(cleaned);
        if (isNaN(num)) return undefined;
        return num.toFixed(2);
    };

    const sanitizeSlug = (slug: string): string =>
        slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

    const handlePostProduct = async (product: GeneratedProduct) => {
        setIsPosting(true);
        try {
            await createProductMutation.mutateAsync({
                title: product.title,
                slug: sanitizeSlug(product.slug),
                category: product.category,
                shortDescription: product.shortDescription || undefined,
                description: product.description,
                manufacturingStory: product.manufacturingStory || undefined,
                manufacturingInfographic: product.generatedInfographicUrl || undefined,
                material: product.material || undefined,
                availableSizes: JSON.stringify(
                    Array.isArray(product.availableSizes) ? product.availableSizes : ["S", "M", "L", "XL"]
                ),
                availableColors: JSON.stringify(
                    Array.isArray(product.availableColors) ? product.availableColors : ["Black", "White"]
                ),
                samplePrice: sanitizePrice(product.samplePrice),
                mainImage: product.generatedImageUrl || undefined,
                seoTitle: product.seoTitle || undefined,
                seoDescription: product.seoDescription || undefined,
                seoKeywords: product.seoKeywords || undefined,
                isActive: true,
                isFeatured: false,
                freeShipping: false,
                sortOrder: 0,
                slabs: product.moqSlabs?.map((s, i) => ({
                    minQty: Number(s.minQty) || 1,
                    maxQty: s.maxQty != null ? Number(s.maxQty) : null,
                    pricePerUnit: sanitizePrice(s.pricePerUnit) ?? "0.00",
                    label: s.label || undefined,
                    sortOrder: i,
                })) ?? [],
            });
            utils.product.adminList.invalidate();
        } catch (_) {
            // handled by mutation callbacks
        }
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(",")[1];
            setLogoFile({ base64, mimeType: file.type, name: file.name });
        };
        reader.readAsDataURL(file);
    };

    const renderMessageText = (text: string) => {
        // Simple markdown-like rendering
        return text
            .split("\n")
            .map((line, i) => {
                const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                const italic = bold.replace(/\*(.*?)\*/g, "<em>$1</em>");
                const listItem = italic.startsWith("- ") || italic.startsWith("• ")
                    ? `<span class="block pl-3 border-l-2 border-gold/30 mb-1">${italic.replace(/^[-•]\s/, "")}</span>`
                    : italic;
                return <span key={i} dangerouslySetInnerHTML={{ __html: listItem + (i < text.split("\n").length - 1 ? "" : "") }} className="block mb-1 last:mb-0" />;
            });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-220px)] min-h-[500px] bg-background rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                        <h3 className="font-condensed font-bold uppercase tracking-wider text-sm text-foreground">
                            AI Product Consultant
                        </h3>
                        <p className="text-muted-foreground text-xs">Powered by Gemini AI</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* API Key status indicator */}
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border transition-colors ${apiKeyQuery.data?.hasKey
                            ? "bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20"
                            : "bg-orange-500/10 text-orange-500 border-orange-500/30 hover:bg-orange-500/20"
                            }`}
                    >
                        <Key className="w-3 h-3" />
                        {apiKeyQuery.data?.hasKey ? "Key Set" : "Set API Key"}
                    </button>
                    {logoFile && (
                        <div className="flex items-center gap-1.5 bg-secondary border border-border rounded-full px-2 py-1 text-xs">
                            <span className="text-muted-foreground truncate max-w-24">{logoFile.name}</span>
                            <button onClick={() => setLogoFile(null)} className="text-muted-foreground hover:text-destructive">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 text-xs gap-1.5"
                    >
                        <Upload className="w-3 h-3" />
                        {logoFile ? "Change Logo" : "Upload Logo"}
                    </Button>
                </div>
            </div>

            {/* API Key Settings Panel */}
            {showSettings && (
                <div className="px-5 py-4 border-b border-border bg-secondary/20 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            <span className="font-condensed font-bold uppercase tracking-wider text-xs text-foreground">Gemini API Key Settings</span>
                        </div>
                        <button onClick={() => setShowSettings(false)} className="text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {apiKeyQuery.data?.hasKey && (
                        <div className="flex items-center gap-2 text-xs">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-green-500 font-medium">API Key configured:</span>
                            <code className="bg-secondary px-2 py-0.5 rounded text-muted-foreground">{apiKeyQuery.data.maskedKey}</code>
                            <Button size="sm" variant="ghost" className="h-6 text-xs text-destructive hover:text-destructive" onClick={handleClearApiKey} disabled={isSavingKey}>
                                Remove
                            </Button>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                type={showKey ? "text" : "password"}
                                placeholder="Paste your Gemini API key here..."
                                value={apiKeyInput}
                                onChange={(e) => setApiKeyInput(e.target.value)}
                                className="h-9 text-xs pr-8 bg-background"
                            />
                            <button
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                        <Button
                            size="sm"
                            className="h-9 bg-gold text-black hover:bg-gold/90 text-xs gap-1.5"
                            onClick={handleSaveApiKey}
                            disabled={!apiKeyInput.trim() || isSavingKey}
                        >
                            {isSavingKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            Save Key
                        </Button>
                    </div>

                    <p className="text-[10px] text-muted-foreground">
                        Get your API key from <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-gold hover:underline">Google AI Studio</a>.
                        Your key is encrypted and stored securely. Each admin has their own key.
                    </p>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Model Selection Banner */}
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border/50 backdrop-blur-sm mb-2">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold" />
                        <div>
                            <span className="text-[10px] font-condensed uppercase tracking-widest text-muted-foreground block leading-none mb-1">Research Engine</span>
                            <div className="flex bg-background/50 p-0.5 rounded border border-border">
                                <button
                                    onClick={() => setResearchModelId("gemini-3.1-pro-preview")}
                                    className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${researchModelId === "gemini-3.1-pro-preview" ? "bg-gold text-black shadow-inner" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Gemini 3.1 Pro
                                </button>
                                <button
                                    onClick={() => setResearchModelId("gemini-2.1-flash")}
                                    className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${researchModelId === "gemini-2.1-flash" ? "bg-gold text-black shadow-inner" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    2.1 Flash
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-border/50 mx-2" />

                    <div className="flex items-center gap-2">
                        <div>
                            <span className="text-[10px] font-condensed uppercase tracking-widest text-muted-foreground block leading-none mb-1 text-right">Chat Model</span>
                            <div className="flex bg-background/50 p-0.5 rounded border border-border">
                                <button
                                    onClick={() => setModelId("gemini-1.5-pro")}
                                    className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${modelId === "gemini-1.5-pro" ? "bg-gold text-black shadow-inner" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Pro
                                </button>
                                <button
                                    onClick={() => setModelId("gemini-2.1-flash")}
                                    className={`px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${modelId === "gemini-2.1-flash" ? "bg-gold text-black shadow-inner" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                    Flash
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[85%] ${msg.role === "user" ? "order-2" : "order-1"}`}>
                            {msg.role === "model" && (
                                <div className="flex items-center gap-1.5 mb-1">
                                    <Bot className="w-3 h-3 text-gold" />
                                    <span className="text-xs font-semibold text-gold">AI Consultant</span>
                                </div>
                            )}
                            <div
                                className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-gold text-black rounded-tr-sm"
                                    : "bg-secondary text-foreground rounded-tl-sm border border-border"
                                    }`}
                            >
                                {renderMessageText(msg.text)}
                            </div>

                            {/* Show product card after the last model message if product was generated */}
                            {msg.role === "model" && idx === messages.length - 1 && generatedProduct && (
                                <ProductPreview
                                    product={generatedProduct}
                                    onPost={handlePostProduct}
                                    onGenerateImage={handleGenerateImage}
                                    onGenerateInfographic={handleGenerateInfographic}
                                    isPosting={isPosting}
                                    isGeneratingImage={isGeneratingImage}
                                    isGeneratingInfographic={isGeneratingInfographic}
                                />
                            )}
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-secondary border border-border rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-gold animate-spin" />
                            <span className="text-muted-foreground text-sm">AI is thinking...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Buttons */}
            <div className="flex gap-2 px-4 py-2 border-t border-border bg-secondary/20 overflow-x-auto">
                <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-xs h-7 gap-1.5 border-gold/30 text-gold hover:bg-gold/10"
                    onClick={handleGenerateProduct}
                    disabled={isLoading || !lastDescription}
                >
                    <Sparkles className="w-3 h-3" />
                    🚀 Generate Product
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-xs h-7 gap-1.5"
                    onClick={() => {
                        setInput("What trending products should I add for the international market right now?");
                    }}
                >
                    💡 Trending Ideas
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-xs h-7 gap-1.5"
                    onClick={() => {
                        setInput("Create a custom BJJ kimono with competition specs, platinum weave, and logo placement options");
                    }}
                >
                    🥋 BJJ Kimono
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-xs h-7 gap-1.5"
                    onClick={() => {
                        setInput("Create a waterproof hunting jacket with fleece lining in camo and olive");
                    }}
                >
                    🎯 Hunting Jacket
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-xs h-7 gap-1.5"
                    onClick={() => {
                        setMessages([{
                            role: "model",
                            text: "👋 Chat cleared! I'm ready to help you create a new product listing. What would you like to add?",
                            timestamp: new Date(),
                        }]);
                        setGeneratedProduct(null);
                        setLastDescription("");
                    }}
                >
                    <RefreshCw className="w-3 h-3" />
                    Clear
                </Button>
            </div>

            {/* Input Area */}
            <div className="flex gap-2 p-4 border-t border-border bg-background">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Describe the product you want to create, or ask me anything..."
                    className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold/50"
                    disabled={isLoading}
                />
                <Button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-gold text-black hover:bg-gold/90 h-10 px-4 shrink-0"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
