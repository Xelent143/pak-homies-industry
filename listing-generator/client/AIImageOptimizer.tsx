import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    Upload, X, ImagePlus, Loader2, CheckCircle, Sparkles, Copy, Download
} from "lucide-react";
import type { OptimizedImageData } from "../server/gemini";
import { fileToBase64 } from "@/lib/utils";

export default function AIImageOptimizer() {
    const [rawFile, setRawFile] = useState<{ file: File; base64: string; mimeType: string } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [seoData, setSeoData] = useState<OptimizedImageData | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Editable state in case the admin wants to tweak the AI's suggestions
    const [editFilename, setEditFilename] = useState("");
    const [editAltText, setEditAltText] = useState("");
    const [editCaption, setEditCaption] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const optimizeImageMutation = trpc.aiAgent.optimizeImage.useMutation();
    const apiKeyQuery = trpc.adminSettings.getApiKey.useQuery(undefined, { retry: false });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const base64Str = await fileToBase64(file);
            // fileToBase64 returns "data:image/jpeg;base64,/9j/4AAQSkZJ..."
            // We just need the actual base64 part for Gemini
            const base64 = base64Str.split(",")[1];

            setRawFile({ file, base64, mimeType: file.type });
            setSeoData(null);

            // Auto-analyze immediately
            analyzeImage(base64, file.type);
        } catch (err: any) {
            toast.error("Failed to read image", { description: err.message });
        }

        // Clear input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const analyzeImage = async (base64: string, mimeType: string) => {
        setIsAnalyzing(true);
        try {
            const { seoData } = await optimizeImageMutation.mutateAsync({
                base64,
                mimeType,
            });

            setSeoData(seoData);
            setEditFilename(seoData.filename);
            setEditAltText(seoData.altText);
            setEditCaption(seoData.caption);

            toast.success("Image optimized successfully!");
        } catch (err: any) {
            toast.error("Analysis failed", { description: err.message });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleClear = () => {
        setRawFile(null);
        setSeoData(null);
    };

    const handleCopyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    // Note: For now, this just generates a download with the new optimized filename.
    // In a full implementation, you could upload this directly to your S3/R2 storage via TRPC.
    const handleDownloadOptimized = () => {
        if (!rawFile || !seoData) return;

        // Create a blob from the original file to download
        const url = URL.createObjectURL(rawFile.file);
        const a = document.createElement("a");
        a.href = url;
        // Use the AI-generated (and potentially manually edited) filename
        a.download = editFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success(`Image downloaded as ${editFilename}`);
    };

    return (
        <div className="flex flex-col min-h-[500px] bg-background rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center">
                        <ImagePlus className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                        <h3 className="font-condensed font-bold uppercase tracking-wider text-sm text-foreground">
                            AI Image Optimizer
                        </h3>
                        <p className="text-muted-foreground text-xs">Upload raw images to auto-generate SEO metadata</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row flex-1 p-5 gap-6">

                {/* Left Side: Upload Zone & Preview */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    {!rawFile ? (
                        <div
                            className="border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 h-full bg-secondary/10 hover:bg-secondary/30 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-8 h-8 text-gold mb-3" />
                            <h4 className="font-condensed font-bold text-foreground">Upload Raw Image</h4>
                            <p className="text-xs text-muted-foreground text-center mt-2">
                                JPEG, PNG, WEBP up to 5MB. AI will analyze contents.
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <div className="relative rounded-xl border border-border overflow-hidden bg-secondary">
                                <img
                                    src={`data:${rawFile.mimeType};base64,${rawFile.base64}`}
                                    alt="Preview"
                                    className="w-full object-cover max-h-[300px]"
                                />
                                <button
                                    onClick={handleClear}
                                    className="absolute top-2 right-2 bg-black/60 hover:bg-destructive/80 text-white rounded-full p-1.5 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => analyzeImage(rawFile.base64, rawFile.mimeType)}
                                disabled={isAnalyzing}
                                className="w-full text-xs font-condensed uppercase tracking-wider"
                            >
                                {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2 text-gold" />}
                                {isAnalyzing ? "Analyzing..." : "Re-Analyze Image"}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right Side: AI Results */}
                <div className="w-full md:w-2/3 flex flex-col gap-4">
                    {!rawFile ? (
                        <div className="flex-1 flex flex-col items-center justify-center border border-border rounded-xl bg-secondary/5 p-8 text-center h-full">
                            <Sparkles className="w-10 h-10 text-muted-foreground/30 mb-3" />
                            <p className="text-muted-foreground text-sm max-w-sm">
                                Upload an image on the left to automatically generate an SEO-optimized filename, alt text, and caption using Gemini Vision.
                            </p>
                        </div>
                    ) : isAnalyzing ? (
                        <div className="flex-1 flex flex-col items-center justify-center border border-border rounded-xl bg-secondary/5 p-8 text-center h-full">
                            <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
                            <h3 className="font-condensed font-bold uppercase tracking-wider text-lg text-foreground mb-1">
                                Analyzing Image...
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Extracting features, generating CEO-optimized tags, and creating localized filename...
                            </p>
                        </div>
                    ) : seoData ? (
                        <div className="flex flex-col gap-4">
                            <div className="bg-secondary/30 border border-gold/20 rounded-xl p-4 space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                                            Optimized Filename
                                        </Label>
                                        <button onClick={() => handleCopyToClipboard(editFilename, "Filename")} className="text-gold hover:text-gold-light">
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <Input
                                        value={editFilename}
                                        onChange={(e) => setEditFilename(e.target.value)}
                                        className="font-mono text-xs bg-background"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">Use this exact filename when uploading to your website or CMS.</p>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                                            Alt Text (For SEO & Accessibility)
                                        </Label>
                                        <button onClick={() => handleCopyToClipboard(editAltText, "Alt Text")} className="text-gold hover:text-gold-light">
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <Textarea
                                        value={editAltText}
                                        onChange={(e) => setEditAltText(e.target.value)}
                                        className="text-sm min-h-[80px] bg-background"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                                            Marketing Caption
                                        </Label>
                                        <button onClick={() => handleCopyToClipboard(editCaption, "Caption")} className="text-gold hover:text-gold-light">
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <Textarea
                                        value={editCaption}
                                        onChange={(e) => setEditCaption(e.target.value)}
                                        className="text-sm min-h-[80px] bg-background"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleDownloadOptimized}
                                className="w-full bg-gold text-black hover:bg-gold/90 font-condensed font-bold uppercase tracking-wider h-12"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Download Extracted Image
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
