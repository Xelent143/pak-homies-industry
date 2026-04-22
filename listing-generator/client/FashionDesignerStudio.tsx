import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Sparkles, Loader2, Eye, Paintbrush, ArrowRight, CheckCircle, Package } from "lucide-react";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

type StudioState = "conception" | "generating_grid" | "review_grid" | "producing" | "success";

export default function FashionDesignerStudio() {
    const [step, setStep] = useState<StudioState>("conception");
    const [prompt, setPrompt] = useState("");
    const [modelId, setModelId] = useState("gemini-3.1-flash-image-preview"); // Default to Nano Banana 2

    // Grid State
    const [gridImage, setGridImage] = useState<{ base64: string, mimeType: string } | null>(null);

    // Final Published State
    const [finalImageUrl, setFinalImageUrl] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const gridMutation = trpc.aiAgent.generateDesignerGrid.useMutation();
    const saveImageMutation = trpc.aiAgent.saveStudioImage.useMutation();
    const prefillMutation = trpc.aiAgent.prefillProductFromGrid.useMutation();
    const createProductMutation = trpc.product.create.useMutation();

    const form = useForm({
        defaultValues: {
            title: "",
            category: "Streetwear",
            description: "",
            shortDescription: "",
            material: "",
            samplePrice: "",
            weight: "",
            seoTitle: "",
            seoDescription: "",
            seoKeywords: "",
            isFeatured: true,
        }
    });

    const handleGenerateGrid = async () => {
        if (!prompt || prompt.length < 5) {
            toast.error("Please provide a detailed product description.");
            return;
        }

        setStep("generating_grid");
        try {
            const { base64, mimeType } = await gridMutation.mutateAsync({ prompt, modelId });
            setGridImage({ base64, mimeType });
            setStep("review_grid");
            toast.success("Design grid ready for review.");
        } catch (err: any) {
            toast.error("Generation failed", { description: err.message });
            setStep("conception");
        }
    };

    const handleApproveDesign = async () => {
        if (!gridImage) return;

        setStep("producing");
        setIsProcessing(true);

        try {
            // 1. Save Image to Local Hostinger Storage AND Analyze for SEO Parallel
            const [savedImage, prefillData] = await Promise.all([
                saveImageMutation.mutateAsync({ base64: gridImage.base64, mimeType: gridImage.mimeType }),
                prefillMutation.mutateAsync({ prompt, base64: gridImage.base64, mimeType: gridImage.mimeType, modelId: "gemini-3.1-pro-preview" })
            ]);

            setFinalImageUrl(savedImage.imageUrl);

            const productData = prefillData.productData;
            form.reset({
                title: productData.title,
                category: productData.category,
                description: productData.description,
                shortDescription: productData.shortDescription,
                material: productData.material,
                samplePrice: String(productData.samplePrice || ""),
                weight: String(productData.weight || ""),
                seoTitle: productData.seoTitle,
                seoDescription: productData.seoDescription,
                seoKeywords: productData.seoKeywords,
                isFeatured: true,
            });

            toast.success("Design finalized and SEO details auto-filled by AI.");
        } catch (err: any) {
            toast.error("Failed to process the final digital asset", { description: err.message });
            setStep("review_grid"); // go back to retry
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePublishProduct = async (data: any) => {
        if (!finalImageUrl) {
            toast.error("Image asset is missing.");
            return;
        }

        try {
            await createProductMutation.mutateAsync({
                ...data,
                slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                mainImage: finalImageUrl,
            });
            toast.success("Product published successfully!");
            setStep("success");
        } catch (err: any) {
            toast.error("Publish failed", { description: err.message });
        }
    };

    return (
        <div className="flex flex-col min-h-[600px] bg-background rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-gradient-to-r from-secondary/80 to-background/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/20 border border-gold/50 flex items-center justify-center">
                        <Paintbrush className="w-4 h-4 text-gold drop-shadow-[0_0_8px_rgba(238,187,51,0.5)]" />
                    </div>
                    <div>
                        <h3 className="font-condensed font-bold uppercase tracking-wider text-sm text-foreground bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            Premium Fashion Designer Studio
                        </h3>
                        <p className="text-muted-foreground text-xs">High-end Single-Shot Design Composite</p>
                    </div>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-2 text-xs font-condensed uppercase tracking-wider text-muted-foreground hidden sm:flex">
                    <span className={step === "conception" || step === "generating_grid" ? "text-gold font-bold" : ""}>1. Concept</span>
                    <ArrowRight className="w-3 h-3 mx-1 opacity-50" />
                    <span className={step === "review_grid" ? "text-gold font-bold" : ""}>2. Review</span>
                    <ArrowRight className="w-3 h-3 mx-1 opacity-50" />
                    <span className={step === "producing" || step === "success" ? "text-gold font-bold" : ""}>3. Production</span>
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col items-center">

                {/* STATE 1: Conception */}
                {(step === "conception" || step === "generating_grid") && (
                    <div className="w-full max-w-2xl mt-12 space-y-6">
                        <div className="text-center space-y-2 mb-8">
                            <Sparkles className="w-12 h-12 text-gold/60 mx-auto mb-4" />
                            <h2 className="text-2xl font-condensed font-bold uppercase tracking-wider">Design Your Next Collection</h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Enter your design prompt. The AI will act as a senior fashion designer to create a beautiful single-composite image showcasing all angles, designed specifically to sidestep slow proxy timeout limitations.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-condensed uppercase tracking-widest text-gold/80 flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    AI Model (Visual Style)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setModelId("gemini-3.1-flash-image-preview")}
                                        className={`px-3 py-2 rounded border text-xs font-condensed uppercase transition-all flex flex-col items-center gap-1 ${modelId === "gemini-3.1-flash-image-preview"
                                            ? "bg-gold text-black border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                                            : "bg-secondary/50 border-border text-muted-foreground hover:border-gold/50"
                                            }`}
                                    >
                                        <span>Nano Banana 2</span>
                                        <span className="opacity-60 text-[8px]">3.1 Flash Image</span>
                                    </button>
                                    <button
                                        onClick={() => setModelId("gemini-2.5-flash-image")}
                                        className={`px-3 py-2 rounded border text-xs font-condensed uppercase transition-all flex flex-col items-center gap-1 ${modelId === "gemini-2.5-flash-image"
                                            ? "bg-gold text-black border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                                            : "bg-secondary/50 border-border text-muted-foreground hover:border-gold/50"
                                            }`}
                                    >
                                        <span>Nano Banana</span>
                                        <span className="opacity-60 text-[8px]">2.5 Flash Image</span>
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <Textarea
                                    placeholder="Describe the apparel in extreme detail. e.g. 'Premium custom BJJ Kimono, 450gsm pearl weave, black with gold stitching, sleek athletic fit, minimal branding on the left shoulder.'"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="min-h-[140px] text-base p-5 pr-4 border-2 border-border focus:border-gold/50 rounded-xl resize-none transition-all shadow-sm"
                                    disabled={step === "generating_grid"}
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerateGrid}
                            disabled={step === "generating_grid" || prompt.length < 5}
                            className="w-full h-14 bg-gold text-black hover:bg-gold/90 font-condensed font-bold text-lg uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(238,187,51,0.2)] hover:shadow-[0_0_30px_rgba(238,187,51,0.4)] transition-all"
                        >
                            {step === "generating_grid" ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                    Drafting Studio Composite...
                                </>
                            ) : (
                                <>
                                    <Eye className="w-5 h-5 mr-3" />
                                    Generate Studio Composite
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {/* STATE 2: Review Grid */}
                {step === "review_grid" && gridImage && (
                    <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                            <h2 className="text-2xl font-condensed font-bold uppercase tracking-wider mb-2">Review Digital Asset</h2>
                            <p className="text-muted-foreground text-sm">
                                If you approve this high-resolution composite, the AI will package it as the primary display image and scrape all visual details to construct your SEO listing automatically.
                            </p>
                        </div>

                        <div className="max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group bg-secondary/20">
                            <img
                                src={`data:${gridImage.mimeType};base64,${gridImage.base64}`}
                                alt="Generated Composite"
                                className="w-full h-auto object-contain"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-sm font-medium leading-relaxed drop-shadow-md">
                                    <span className="text-gold font-bold mr-2">PROMPT:</span>
                                    {prompt}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 pt-4">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => setStep("conception")}
                                className="w-48 font-condensed uppercase tracking-wider"
                            >
                                Re-Roll Prompt
                            </Button>
                            <Button
                                size="lg"
                                onClick={handleApproveDesign}
                                className="w-64 bg-gold text-black hover:bg-gold/90 font-condensed font-bold uppercase tracking-wider shadow-lg"
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Approve Asset
                            </Button>
                        </div>
                    </div>
                )}

                {/* STATE 3 & 4: Producing and Auto-Fill */}
                {step === "producing" && (
                    <div className="w-full space-y-8">
                        {/* Header Status */}
                        <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-xl border border-border">
                            {isProcessing ? (
                                <Loader2 className="w-6 h-6 text-gold animate-spin" />
                            ) : (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            )}
                            <div>
                                <h3 className="font-condensed font-bold uppercase tracking-wider text-base">
                                    {isProcessing ? "Finalizing Studio Asset..." : "Asset Ready for Publishing"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Processing the final digital asset and structuring SEO listings using Gemini text extraction.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground border-b border-border pb-2">
                                    Digital Asset Review
                                </h4>
                                <div className="relative rounded-xl border border-border overflow-hidden bg-secondary/20 block aspect-square">
                                    {gridImage ? (
                                        <img src={`data:${gridImage.mimeType};base64,${gridImage.base64}`} className="w-full h-full object-contain" alt="Composite Grid" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gold/40" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 bg-secondary/30 p-5 rounded-xl border border-border flex flex-col">
                                <h4 className="font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground border-b border-border pb-2 flex justify-between items-center">
                                    <span>Product Context</span>
                                    {isProcessing && (
                                        <span className="flex items-center text-gold text-xs font-condensed">
                                            <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> Drafting Catalog Matrix...
                                        </span>
                                    )}
                                </h4>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handlePublishProduct)} className="space-y-5 flex-1 relative flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <FormField control={form.control} name="title" render={({ field }) => (
                                                <FormItem><FormLabel>Product Title</FormLabel><FormControl><Input {...field} disabled={isProcessing} /></FormControl></FormItem>
                                            )} />
                                            <FormField control={form.control} name="shortDescription" render={({ field }) => (
                                                <FormItem><FormLabel>Matrix SEO Summary</FormLabel><FormControl><Textarea className="h-24 resize-none text-xs" {...field} disabled={isProcessing} /></FormControl></FormItem>
                                            )} />

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField control={form.control} name="material" render={({ field }) => (
                                                    <FormItem><FormLabel>Textile Build</FormLabel><FormControl><Input {...field} disabled={isProcessing} /></FormControl></FormItem>
                                                )} />
                                                <FormField control={form.control} name="samplePrice" render={({ field }) => (
                                                    <FormItem><FormLabel>Sample Blueprint ($)</FormLabel><FormControl><Input {...field} disabled={isProcessing} /></FormControl></FormItem>
                                                )} />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={isProcessing}
                                            className="w-full mt-6 bg-gold text-black hover:bg-gold/90 font-condensed font-bold uppercase tracking-wider shadow-lg h-12"
                                        >
                                            <Package className="w-5 h-5 mr-2" />
                                            Deploy to Catalog
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>
                )}

                {/* STATE 5: Success */}
                {step === "success" && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-condensed font-bold uppercase tracking-wider mb-3">Asset Deployed Successfully</h2>
                        <p className="text-muted-foreground mb-8">
                            Premium studio composite and structured SEO catalog metadata are live in the system pipeline.
                        </p>
                        <Button
                            onClick={() => {
                                setPrompt("");
                                setStep("conception");
                            }}
                            className="bg-secondary text-foreground hover:bg-secondary/80 font-condensed font-bold uppercase tracking-wider px-8 h-12"
                        >
                            Draft Next Asset
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}
