import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Upload, X, ImagePlus, Loader2, Sparkles, CheckCircle, Wand2, ArrowRight
} from "lucide-react";
import { fileToBase64 } from "@/lib/utils";

interface ImageData {
    base64: string;
    mimeType: string;
    preview: string;
}

export default function VirtualTryOnAgent({
    onUseImage,
    onUseImages
}: {
    onUseImage?: (url: string, base64: string, mimeType: string) => void;
    onUseImages?: (images: { url: string; base64: string; mimeType: string }[]) => void;
}) {
    // ─── API Hooks ─────────────────────────────────────────────────────────────
    const utils = trpc.useUtils();

    const { data: savedModelsResult, isLoading: isLoadingModels } = trpc.aiAgent.getSavedModels.useQuery();

    const saveModelMutation = trpc.aiAgent.saveTryOnModel.useMutation({
        onSuccess: () => {
            utils.aiAgent.getSavedModels.invalidate();
            toast.success("Model saved to your Library!");
            setHasUnsavedModel(false);
        },
        onError: (err) => toast.error(err.message),
    });

    const generateMutation = trpc.aiAgent.generateTryOnImage.useMutation({
        onSuccess: (data) => {
            setGeneratedImages(data.images);
            toast.success("Virtual Try-On successful!");
        },
        onError: (err) => toast.error(err.message),
    });

    // ─── State ─────────────────────────────────────────────────────────────────
    const [modelImage, setModelImage] = useState<ImageData | null>(null);
    const [hasUnsavedModel, setHasUnsavedModel] = useState(false);

    const [referenceImages, setReferenceImages] = useState<ImageData[]>([]);
    const [referenceLink, setReferenceLink] = useState("");
    const [category, setCategory] = useState("Streetwear");
    const [logoImage, setLogoImage] = useState<ImageData | null>(null);
    const [prompt, setPrompt] = useState("Place the extracted garment on the model naturally.");

    const [generatedImages, setGeneratedImages] = useState<{ view: string; url: string }[] | null>(null);

    // Refs for file inputs
    const modelInputRef = useRef<HTMLInputElement>(null);
    const refInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    // Load saved model on mount defaults removed because user can pick from list

    // ─── Handlers ──────────────────────────────────────────────────────────────
    const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const base64 = await fileToBase64(file);
        setModelImage({ base64: base64.split(",")[1], mimeType: file.type, preview: base64 });
        setHasUnsavedModel(true);
    };

    const handleReferenceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const newRefs = await Promise.all(
            files.map(async (file) => {
                const base64 = await fileToBase64(file);
                return { base64: base64.split(",")[1], mimeType: file.type, preview: base64 };
            })
        );
        setReferenceImages(prev => [...prev, ...newRefs]);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const base64 = await fileToBase64(file);
        setLogoImage({ base64: base64.split(",")[1], mimeType: file.type, preview: base64 });
    };

    const handleGenerate = () => {
        if (!modelImage) return toast.error("Please upload or save a base model image first.");
        if (referenceImages.length === 0 && !referenceLink) return toast.error("Please provide at least one reference garment image or a product link.");
        if (!category) return toast.error("Please specify a garment category so the lifestyle shot knows what environment to use.");

        setGeneratedImages(null);
        generateMutation.mutate({
            prompt,
            modelImage: { base64: modelImage.base64, mimeType: modelImage.mimeType },
            referenceImages: referenceImages.map(img => ({ base64: img.base64, mimeType: img.mimeType })),
            referenceLink: referenceLink || undefined,
            category: category,
            logoImage: logoImage ? { base64: logoImage.base64, mimeType: logoImage.mimeType } : undefined,
        });
    };

    const handleDownload = async (imageUrl: string, viewName: string) => {
        try {
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = blobUrl;
            a.download = `Sialkot_TryOn_${viewName.replace(/\s+/g, "_")}.jpg`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
            toast.success("Image downloaded successfully!");
        } catch (error) {
            toast.error("Failed to download image.");
        }
    };

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {/* Left Column: Configuration */}
            <div className="space-y-6">

                {/* 1. Base Model Section */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-gold" /> Base Model
                        </h2>
                        {hasUnsavedModel && modelImage && (
                            <Button
                                size="sm"
                                className="h-7 text-xs bg-gold hover:bg-gold/90 text-black font-bold"
                                disabled={saveModelMutation.isPending}
                                onClick={() => saveModelMutation.mutate({ base64: modelImage.base64, mimeType: modelImage.mimeType })}
                            >
                                {saveModelMutation.isPending ? "Saving..." : "Save to Library"}
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Currently Selected or Uploaded Model */}
                        <div className="flex gap-4">
                            {modelImage ? (
                                <div className="relative group w-32 h-40 shrink-0">
                                    <img src={modelImage.preview} alt="Base model" className="w-full h-full object-cover rounded-lg border-2 border-gold" />
                                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded shadow">Active</span>
                                    <button
                                        onClick={() => { setModelImage(null); setHasUnsavedModel(false); }}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="w-32 h-40 border-2 border-dashed border-border hover:border-gold/50 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-secondary/10 shrink-0"
                                    onClick={() => modelInputRef.current?.click()}
                                >
                                    <Upload className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-xs font-medium text-muted-foreground text-center px-2">Upload New Custom Model</span>
                                </div>
                            )}
                            <input type="file" ref={modelInputRef} className="hidden" accept="image/*" onChange={handleModelUpload} />

                            {/* Saved Models Horizontal List */}
                            <div className="flex gap-3 overflow-x-auto pb-2 flex-nowrap w-full">
                                {isLoadingModels ? (
                                    <div className="w-24 h-32 flex items-center justify-center rounded-lg bg-secondary/20 animate-pulse text-xs text-muted-foreground text-center p-2">Loading Library...</div>
                                ) : (
                                    savedModelsResult?.models?.map((savedModel) => (
                                        <div
                                            key={savedModel.id}
                                            onClick={async () => {
                                                try {
                                                    const res = await fetch(savedModel.imageUrl);
                                                    const blob = await res.blob();
                                                    const reader = new FileReader();
                                                    reader.readAsDataURL(blob);
                                                    reader.onloadend = () => {
                                                        const b64 = reader.result as string;
                                                        setModelImage({
                                                            base64: b64.split(",")[1],
                                                            mimeType: blob.type,
                                                            preview: savedModel.imageUrl
                                                        });
                                                        setHasUnsavedModel(false);
                                                    }
                                                } catch (e) {
                                                    toast.error("Failed to load saved model");
                                                }
                                            }}
                                            className="w-24 h-32 shrink-0 rounded-lg border border-border cursor-pointer hover:border-gold/50 transition-all opacity-70 hover:opacity-100 group relative overflow-hidden"
                                        >
                                            <img src={savedModel.imageUrl} alt={savedModel.name || "Saved"} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-[10px] bg-gold text-black px-2 py-1 rounded font-bold">Use Model</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Reference Garments Section */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-2">
                        <ClothesIcon className="w-4 h-4 text-gold" /> Reference Garment
                    </h2>
                    <p className="text-xs text-muted-foreground mb-4">
                        Upload 1-3 clear photos of the garment, OR paste a product link (e.g. from Zara, Amazon) and the AI will scrape the image.
                    </p>

                    <div className="mb-4">
                        <Input
                            value={referenceLink}
                            onChange={(e) => setReferenceLink(e.target.value)}
                            placeholder="Or paste a product link here..."
                            className="bg-secondary/20"
                        />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-px bg-border flex-1"></div>
                        <span className="text-xs text-muted-foreground font-medium uppercase">Or Upload Manually</span>
                        <div className="h-px bg-border flex-1"></div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {referenceImages.map((img, i) => (
                            <div key={i} className="relative group w-24 h-24 shrink-0">
                                <img src={img.preview} alt={`Reference ${i}`} className="w-full h-full object-cover rounded-lg border border-border" />
                                <button
                                    onClick={() => setReferenceImages(prev => prev.filter((_, idx) => idx !== i))}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {referenceImages.length < 3 && (
                            <div
                                className="w-24 h-24 border-2 border-dashed border-border hover:border-gold/50 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-secondary/10"
                                onClick={() => refInputRef.current?.click()}
                            >
                                <ImagePlus className="w-5 h-5 text-muted-foreground" />
                            </div>
                        )}
                        <input type="file" ref={refInputRef} multiple className="hidden" accept="image/*" onChange={handleReferenceUpload} />
                    </div>
                </div>

                {/* 2.5 Category Section */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-gold" /> Garment Category (For Lifestyle Shot)
                    </h2>
                    <p className="text-xs text-muted-foreground mb-4">
                        Tell the AI what type of garment this is so it places the model in a realistic environment (e.g., Gym, Street, Formal).
                    </p>
                    <Input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Sportswear, Streetwear, Suit..."
                        className="bg-secondary/20"
                    />
                </div>

                {/* 3. Logo Injection Section */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-gold" /> Apply Custom Logo (Optional)
                    </h2>
                    <p className="text-xs text-muted-foreground mb-4">
                        Upload your logo (PNG transparent is best). The AI will map it naturally onto the generated garment.
                    </p>

                    <div className="flex gap-4">
                        {logoImage ? (
                            <div className="relative group w-24 h-24 shrink-0 bg-secondary/50 rounded-lg flex items-center justify-center p-2 border border-border">
                                <img src={logoImage.preview} alt="Logo" className="w-full h-full object-contain" />
                                <button
                                    onClick={() => setLogoImage(null)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <div
                                className="w-24 h-24 border-2 border-dashed border-border hover:border-gold/50 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-secondary/10"
                                onClick={() => logoInputRef.current?.click()}
                            >
                                <Upload className="w-5 h-5 text-muted-foreground" />
                            </div>
                        )}
                        <input type="file" ref={logoInputRef} className="hidden" accept="image/png, image/jpeg" onChange={handleLogoUpload} />
                    </div>
                </div>

            </div>

            {/* Right Column: Generation Workspace */}
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-4">
                    <Wand2 className="w-4 h-4 text-gold" /> Try-On Studio
                </h2>

                <div className="flex-1 bg-secondary/20 rounded-xl border border-border/50 flex flex-col items-center justify-center p-4 min-h-[400px] mb-4 overflow-hidden relative">
                    {generateMutation.isPending && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                            <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
                            <p className="text-sm font-medium text-foreground">Extracting garment and rendering try-on...</p>
                            <p className="text-xs text-muted-foreground">This may take up to 20 seconds</p>
                        </div>
                    )}

                    {generatedImages && generatedImages.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 w-full h-full overflow-y-auto p-2">
                            {generatedImages.map((img, i) => (
                                <div key={i} className="flex flex-col gap-2 relative group w-full">
                                    <div className="aspect-[3/4] w-full relative">
                                        <img src={img.url} alt={img.view} className="w-full h-full object-cover rounded-lg shadow-md border border-border" />
                                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                                            <p className="text-xs font-bold text-white text-center tracking-wider">{img.view}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 text-xs px-2"
                                            onClick={() => {
                                                if (onUseImage) {
                                                    toast.info("Sending view to Listing Agent...");
                                                    onUseImage(img.url, "", "");
                                                }
                                            }}
                                        >
                                            <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
                                            Use
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="px-3"
                                            onClick={() => handleDownload(img.url, img.view)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center max-w-sm">
                            <Wand2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-muted-foreground font-medium mb-1">Workspace Empty</h3>
                            <p className="text-xs text-muted-foreground/70">
                                Configure your model, garment, and logo on the left, then click Generate to see the photorealistic multi-view results here.
                            </p>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <Input
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="e.g. Put the garment on the model. Make the logo visible on the left chest."
                        className="bg-secondary/30"
                    />

                    <div className="flex gap-3">
                        <Button
                            className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold"
                            onClick={handleGenerate}
                            disabled={generateMutation.isPending || !modelImage || (referenceImages.length === 0 && !referenceLink)}
                        >
                            {generateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                            Generate Collection
                        </Button>

                        {generatedImages && generatedImages.length > 0 && onUseImages && (
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6"
                                onClick={() => {
                                    toast.info("Sending entire collection to Listing Agent...");
                                    onUseImages(generatedImages.map(img => ({ url: img.url, base64: "", mimeType: "" })));
                                }}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" /> Select All & Post Now
                            </Button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

// Minimal Icons
function UserIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> }
function ClothesIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></svg> }
