import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-D0S_T65I.js";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { t as trpc, B as Button, f as fileToBase64, c as cn } from "../entry-server.js";
import { I as Input, L as Label } from "./label-C2k6QFV2.js";
import { B as Badge } from "./badge-BLnXf9IA.js";
import { toast } from "sonner";
import { Bot, Key, X, Upload, Settings, CheckCircle, EyeOff, Eye, Loader2, Save, Sparkles, RefreshCw, Send, Package, ChevronUp, ChevronDown, ImagePlus, Copy, Download, Paintbrush, ArrowRight, Wand2, ScanFace, Shirt, Image } from "lucide-react";
import { T as Textarea } from "./textarea-DNjmcxjP.js";
import { FormProvider, Controller, useFormContext, useFormState, useForm } from "react-hook-form";
import { Slot } from "@radix-ui/react-slot";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import "wouter";
import "@trpc/client";
import "./SEOHead-oEJRQGbs.js";
import "react-helmet-async";
import "@trpc/react-query";
import "@tanstack/react-query";
import "react-dom/server";
import "superjson";
import "next-themes";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
function ProductPreview({
  product,
  onPost,
  onGenerateImage,
  onGenerateInfographic,
  isPosting,
  isGeneratingImage,
  isGeneratingInfographic
}) {
  const [expanded, setExpanded] = useState(false);
  return /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:71", className: "mt-3 rounded-xl border border-gold/30 bg-background/80 backdrop-blur-sm overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:73", className: "flex items-center justify-between px-4 py-3 border-b border-border bg-gold/5", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:74", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Package, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:75", className: "w-4 h-4 text-gold" }),
        /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:76", className: "font-condensed font-bold uppercase tracking-wider text-sm text-foreground", children: "Generated Product Preview" })
      ] }),
      /* @__PURE__ */ jsx(Badge, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:80", className: "bg-gold/20 text-gold border-gold/30 text-xs", children: product.category })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:84", className: "p-4 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:85", className: "flex gap-3 overflow-x-auto pb-2", children: [
        product.generatedImageUrl && /* @__PURE__ */ jsx(
          "img",
          {
            "data-loc": "listing-generator\\client\\AIProductAgent.tsx:87",
            src: product.generatedImageUrl,
            alt: product.title,
            className: "w-full max-w-[200px] max-h-48 object-cover rounded-lg border border-border shrink-0"
          }
        ),
        product.generatedInfographicUrl && /* @__PURE__ */ jsx(
          "img",
          {
            "data-loc": "listing-generator\\client\\AIProductAgent.tsx:94",
            src: product.generatedInfographicUrl,
            alt: "Manufacturing Story Infographic",
            className: "w-full max-w-[200px] max-h-48 object-cover rounded-lg border border-border shrink-0"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:102", children: [
        /* @__PURE__ */ jsx("h3", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:103", className: "font-serif text-lg font-bold text-foreground", children: product.title }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:104", className: "text-muted-foreground text-sm mt-1", children: product.shortDescription })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:107", className: "grid grid-cols-2 gap-2 text-xs", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:108", className: "bg-secondary/50 rounded p-2", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:109", className: "text-muted-foreground", children: "Material" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:110", className: "text-foreground font-medium mt-0.5", children: product.material })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:112", className: "bg-secondary/50 rounded p-2", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:113", className: "text-muted-foreground", children: "Sample Price" }),
          /* @__PURE__ */ jsxs("p", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:114", className: "text-foreground font-medium mt-0.5", children: [
            "$",
            product.samplePrice
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:118", className: "flex flex-wrap gap-1.5", children: product.availableColors.map((c) => /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:120", className: "text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground", children: c }, c)) }),
      /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:126", className: "flex flex-wrap gap-1.5", children: product.availableSizes.map((s) => /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:128", className: "text-xs border border-border px-2 py-0.5 rounded font-mono text-foreground", children: s }, s)) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:135", className: "border border-border rounded-lg overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:136", className: "px-3 py-1.5 bg-secondary text-xs font-condensed font-bold uppercase tracking-wider text-muted-foreground", children: "MOQ Price Tiers" }),
        product.moqSlabs.map((slab, i) => /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:140", className: "flex items-center justify-between px-3 py-2 border-t border-border text-xs", children: [
          /* @__PURE__ */ jsxs("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:141", className: "text-muted-foreground", children: [
            slab.minQty,
            "–",
            slab.maxQty ?? "∞",
            " pcs"
          ] }),
          /* @__PURE__ */ jsxs("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:144", className: "font-bold text-foreground", children: [
            "$",
            slab.pricePerUnit,
            "/pc"
          ] }),
          slab.label && /* @__PURE__ */ jsx(Badge, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:146", className: "text-[10px] bg-gold/10 text-gold border-gold/20", children: slab.label })
        ] }, i))
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:153", className: "border border-border rounded-lg overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:154", className: "px-3 py-1.5 bg-secondary text-xs font-condensed font-bold uppercase tracking-wider text-muted-foreground", children: "Manufacturing Story" }),
        product.manufacturingStory ? /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:158", className: "px-3 py-2 text-xs text-foreground bg-secondary/20 italic whitespace-pre-wrap", children: product.manufacturingStory }) : /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:162", className: "px-3 py-2 text-xs text-muted-foreground", children: "Not generated for this product." })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          "data-loc": "listing-generator\\client\\AIProductAgent.tsx:169",
          onClick: () => setExpanded(!expanded),
          className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
          children: [
            expanded ? /* @__PURE__ */ jsx(ChevronUp, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:173", className: "w-3 h-3" }) : /* @__PURE__ */ jsx(ChevronDown, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:173", className: "w-3 h-3" }),
            expanded ? "Hide" : "Show",
            " SEO Details"
          ]
        }
      ),
      expanded && /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:178", className: "space-y-2 text-xs border-t border-border pt-2", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:179", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:180", className: "text-muted-foreground uppercase tracking-wider font-semibold", children: "SEO Title" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:181", className: "text-foreground mt-0.5", children: product.seoTitle })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:183", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:184", className: "text-muted-foreground uppercase tracking-wider font-semibold", children: "Meta Description" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:185", className: "text-foreground mt-0.5", children: product.seoDescription })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:187", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:188", className: "text-muted-foreground uppercase tracking-wider font-semibold", children: "Keywords" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:189", className: "text-muted-foreground mt-0.5", children: product.seoKeywords })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:196", className: "flex flex-col gap-2 p-4 pt-0", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:197", className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "listing-generator\\client\\AIProductAgent.tsx:198",
            variant: "outline",
            className: "flex-1 text-xs h-9 font-condensed font-semibold uppercase tracking-wider border-border",
            onClick: onGenerateImage,
            disabled: isGeneratingImage,
            children: [
              isGeneratingImage ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:204", className: "w-3.5 h-3.5 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsx(ImagePlus, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:204", className: "w-3.5 h-3.5 mr-1.5" }),
              isGeneratingImage ? "Gen Image" : "🖼️ Image"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "listing-generator\\client\\AIProductAgent.tsx:207",
            variant: "outline",
            className: "flex-1 text-xs h-9 font-condensed font-semibold uppercase tracking-wider border-border",
            onClick: onGenerateInfographic,
            disabled: isGeneratingInfographic,
            children: [
              isGeneratingInfographic ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:213", className: "w-3.5 h-3.5 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsx(Sparkles, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:213", className: "w-3.5 h-3.5 mr-1.5" }),
              isGeneratingInfographic ? "Gen Info..." : "📊 Infographic"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          "data-loc": "listing-generator\\client\\AIProductAgent.tsx:217",
          className: "w-full bg-gold text-black hover:bg-gold/90 font-condensed font-bold uppercase tracking-wider text-xs h-9",
          onClick: () => onPost(product),
          disabled: isPosting,
          children: [
            isPosting ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:222", className: "w-3.5 h-3.5 mr-1.5 animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:222", className: "w-3.5 h-3.5 mr-1.5" }),
            isPosting ? "Posting..." : "✅ Post to Website"
          ]
        }
      )
    ] })
  ] });
}
function AIProductAgent({
  initialImageUrl,
  onClearInitialImage
}) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: `👋 Welcome! I'm your **AI Product Posting Consultant** powered by Gemini.

I can help you create complete, SEO-optimized product listings for Pak Homies Industry. Just describe any product you want to add — for example:

*"Create a listing for a custom waterproof hunting jacket with fleece lining, available in olive and camo"*

I'll research the market, write professional descriptions, set optimal pricing slabs, and generate beautiful product images!`,
      timestamp: /* @__PURE__ */ new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedProduct, setGeneratedProduct] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingInfographic, setIsGeneratingInfographic] = useState(false);
  const [lastDescription, setLastDescription] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [modelId, setModelId] = useState("gemini-2.1-flash");
  const [researchModelId, setResearchModelId] = useState("gemini-3.1-pro-preview");
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const apiKeyQuery = trpc.adminSettings.getApiKey.useQuery(void 0, { retry: false });
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
    }
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
      addMessage("model", `✅ Product listing generated from image for **"${data.product.title}"**!

I've extracted the design intelligence and created:
- Full SEO-optimized overview
- Manufacturing story
- Pricing slabs and variations

Review the product card below.`);
    },
    onError: (err) => {
      addMessage("model", `❌ Image analysis failed: ${err.message}`);
    },
    onSettled: () => setIsLoading(false)
  });
  const createProductMutation = trpc.product.create.useMutation({
    onSuccess: () => {
      toast.success("🎉 Product posted to the website!", {
        description: `"${generatedProduct?.title}" is now live in your store`
      });
      setIsPosting(false);
    },
    onError: (e) => {
      toast.error("Failed to post product", { description: e.message });
      setIsPosting(false);
    }
  });
  const utils = trpc.useUtils();
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
            const base64data = reader.result;
            analyzeImageMutation.mutate({
              base64: base64data.split(",")[1] ?? "",
              mimeType: blob.type,
              apiKey: apiKeyInput || void 0,
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
  const addMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text, timestamp: /* @__PURE__ */ new Date() }]);
  };
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    addMessage("user", trimmed);
    setLastDescription(trimmed);
    setIsLoading(true);
    const history = messages.filter((_, i) => i > 0).map((m) => ({ role: m.role, text: m.text }));
    try {
      const { reply } = await chatMutation.mutateAsync({
        history,
        message: trimmed,
        apiKey: apiKeyInput || void 0,
        modelId
      });
      addMessage("model", reply);
    } catch (err) {
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
        apiKey: apiKeyInput || void 0,
        modelId: researchModelId
      });
      setGeneratedProduct(product);
      addMessage("model", `✅ Product listing generated for **"${product.title}"**!

I've created:
- Full SEO-optimized title and description
- ${product.moqSlabs.length} MOQ price tiers
- ${product.availableSizes.length} sizes and ${product.availableColors.length} colors
- Complete meta tags and keywords

Review the product card below. You can generate a main product image, and a matching manufacturing infographic!`);
    } catch (err) {
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
        apiKey: apiKeyInput || void 0
      });
      setGeneratedProduct((prev) => prev ? { ...prev, generatedImageUrl: imageUrl } : prev);
      addMessage("model", `🖼️ Product image generated${logoFile ? " with your logo" : ""}!

The image has been added to your product preview above. You can now post the complete listing to your website.`);
    } catch (err) {
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
        apiKey: apiKeyInput || void 0
      });
      setGeneratedProduct((prev) => prev ? { ...prev, generatedInfographicUrl: imageUrl } : prev);
      addMessage("model", `📊 Manufacturing process infographic generated successfully!

It is now shown in your product preview and will be displayed alongside the story on your website.`);
    } catch (err) {
      toast.error("Infographic generation failed", { description: err.message });
    } finally {
      setIsGeneratingInfographic(false);
    }
  };
  const sanitizePrice = (price) => {
    if (!price) return void 0;
    const cleaned = String(price).replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    if (isNaN(num)) return void 0;
    return num.toFixed(2);
  };
  const sanitizeSlug = (slug) => slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  const handlePostProduct = async (product) => {
    setIsPosting(true);
    try {
      await createProductMutation.mutateAsync({
        title: product.title,
        slug: sanitizeSlug(product.slug),
        category: product.category,
        shortDescription: product.shortDescription || void 0,
        description: product.description,
        manufacturingStory: product.manufacturingStory || void 0,
        manufacturingInfographic: product.generatedInfographicUrl || void 0,
        material: product.material || void 0,
        availableSizes: JSON.stringify(
          Array.isArray(product.availableSizes) ? product.availableSizes : ["S", "M", "L", "XL"]
        ),
        availableColors: JSON.stringify(
          Array.isArray(product.availableColors) ? product.availableColors : ["Black", "White"]
        ),
        samplePrice: sanitizePrice(product.samplePrice),
        mainImage: product.generatedImageUrl || void 0,
        seoTitle: product.seoTitle || void 0,
        seoDescription: product.seoDescription || void 0,
        seoKeywords: product.seoKeywords || void 0,
        isActive: true,
        isFeatured: false,
        freeShipping: false,
        sortOrder: 0,
        slabs: product.moqSlabs?.map((s, i) => ({
          minQty: Number(s.minQty) || 1,
          maxQty: s.maxQty != null ? Number(s.maxQty) : null,
          pricePerUnit: sanitizePrice(s.pricePerUnit) ?? "0.00",
          label: s.label || void 0,
          sortOrder: i
        })) ?? []
      });
      utils.product.adminList.invalidate();
    } catch (_) {
    }
  };
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(",")[1];
      setLogoFile({ base64, mimeType: file.type, name: file.name });
    };
    reader.readAsDataURL(file);
  };
  const renderMessageText = (text) => {
    return text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      const italic = bold.replace(/\*(.*?)\*/g, "<em>$1</em>");
      const listItem = italic.startsWith("- ") || italic.startsWith("• ") ? `<span class="block pl-3 border-l-2 border-gold/30 mb-1">${italic.replace(/^[-•]\s/, "")}</span>` : italic;
      return /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:525", dangerouslySetInnerHTML: { __html: listItem + (i < text.split("\n").length - 1 ? "" : "") }, className: "block mb-1 last:mb-0" }, i);
    });
  };
  return /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:530", className: "flex flex-col h-[calc(100vh-220px)] min-h-[500px] bg-background rounded-xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:532", className: "flex items-center justify-between px-5 py-3.5 border-b border-border bg-secondary/30", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:533", className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:534", className: "w-8 h-8 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center", children: /* @__PURE__ */ jsx(Bot, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:535", className: "w-4 h-4 text-gold" }) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:537", children: [
          /* @__PURE__ */ jsx("h3", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:538", className: "font-condensed font-bold uppercase tracking-wider text-sm text-foreground", children: "AI Product Consultant" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:541", className: "text-muted-foreground text-xs", children: "Powered by Gemini AI" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:544", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            "data-loc": "listing-generator\\client\\AIProductAgent.tsx:546",
            onClick: () => setShowSettings(!showSettings),
            className: `flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border transition-colors ${apiKeyQuery.data?.hasKey ? "bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/30 hover:bg-orange-500/20"}`,
            children: [
              /* @__PURE__ */ jsx(Key, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:553", className: "w-3 h-3" }),
              apiKeyQuery.data?.hasKey ? "Key Set" : "Set API Key"
            ]
          }
        ),
        logoFile && /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:557", className: "flex items-center gap-1.5 bg-secondary border border-border rounded-full px-2 py-1 text-xs", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:558", className: "text-muted-foreground truncate max-w-24", children: logoFile.name }),
          /* @__PURE__ */ jsx("button", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:559", onClick: () => setLogoFile(null), className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsx(X, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:560", className: "w-3 h-3" }) })
        ] }),
        /* @__PURE__ */ jsx("input", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:564", ref: fileInputRef, type: "file", accept: "image/*", onChange: handleLogoUpload, className: "hidden" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "listing-generator\\client\\AIProductAgent.tsx:565",
            size: "sm",
            variant: "outline",
            onClick: () => fileInputRef.current?.click(),
            className: "h-7 text-xs gap-1.5",
            children: [
              /* @__PURE__ */ jsx(Upload, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:571", className: "w-3 h-3" }),
              logoFile ? "Change Logo" : "Upload Logo"
            ]
          }
        )
      ] })
    ] }),
    showSettings && /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:579", className: "px-5 py-4 border-b border-border bg-secondary/20 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:580", className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:581", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Settings, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:582", className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:583", className: "font-condensed font-bold uppercase tracking-wider text-xs text-foreground", children: "Gemini API Key Settings" })
        ] }),
        /* @__PURE__ */ jsx("button", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:585", onClick: () => setShowSettings(false), className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsx(X, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:586", className: "w-4 h-4" }) })
      ] }),
      apiKeyQuery.data?.hasKey && /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:591", className: "flex items-center gap-2 text-xs", children: [
        /* @__PURE__ */ jsx(CheckCircle, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:592", className: "w-3.5 h-3.5 text-green-500" }),
        /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:593", className: "text-green-500 font-medium", children: "API Key configured:" }),
        /* @__PURE__ */ jsx("code", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:594", className: "bg-secondary px-2 py-0.5 rounded text-muted-foreground", children: apiKeyQuery.data.maskedKey }),
        /* @__PURE__ */ jsx(Button, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:595", size: "sm", variant: "ghost", className: "h-6 text-xs text-destructive hover:text-destructive", onClick: handleClearApiKey, disabled: isSavingKey, children: "Remove" })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:601", className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:602", className: "relative flex-1", children: [
          /* @__PURE__ */ jsx(
            Input,
            {
              "data-loc": "listing-generator\\client\\AIProductAgent.tsx:603",
              type: showKey ? "text" : "password",
              placeholder: "Paste your Gemini API key here...",
              value: apiKeyInput,
              onChange: (e) => setApiKeyInput(e.target.value),
              className: "h-9 text-xs pr-8 bg-background"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              "data-loc": "listing-generator\\client\\AIProductAgent.tsx:610",
              onClick: () => setShowKey(!showKey),
              className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
              children: showKey ? /* @__PURE__ */ jsx(EyeOff, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:614", className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsx(Eye, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:614", className: "w-3.5 h-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "listing-generator\\client\\AIProductAgent.tsx:617",
            size: "sm",
            className: "h-9 bg-gold text-black hover:bg-gold/90 text-xs gap-1.5",
            onClick: handleSaveApiKey,
            disabled: !apiKeyInput.trim() || isSavingKey,
            children: [
              isSavingKey ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:623", className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsx(Save, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:623", className: "w-3 h-3" }),
              "Save Key"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("p", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:628", className: "text-[10px] text-muted-foreground", children: [
        "Get your API key from ",
        /* @__PURE__ */ jsx("a", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:629", href: "https://aistudio.google.com/apikey", target: "_blank", rel: "noreferrer", className: "text-gold hover:underline", children: "Google AI Studio" }),
        ". Your key is encrypted and stored securely. Each admin has their own key."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:636", className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:638", className: "flex items-center justify-between p-3 bg-secondary/30 rounded-xl border border-border/50 backdrop-blur-sm mb-2", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:639", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:640", className: "w-4 h-4 text-gold" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:641", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:642", className: "text-[10px] font-condensed uppercase tracking-widest text-muted-foreground block leading-none mb-1", children: "Research Engine" }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:643", className: "flex bg-background/50 p-0.5 rounded border border-border", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  "data-loc": "listing-generator\\client\\AIProductAgent.tsx:644",
                  onClick: () => setResearchModelId("gemini-3.1-pro-preview"),
                  className: `px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${researchModelId === "gemini-3.1-pro-preview" ? "bg-gold text-black shadow-inner" : "text-muted-foreground hover:text-foreground"}`,
                  children: "Gemini 3.1 Pro"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  "data-loc": "listing-generator\\client\\AIProductAgent.tsx:650",
                  onClick: () => setResearchModelId("gemini-2.1-flash"),
                  className: `px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${researchModelId === "gemini-2.1-flash" ? "bg-gold text-black shadow-inner" : "text-muted-foreground hover:text-foreground"}`,
                  children: "2.1 Flash"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:660", className: "h-8 w-px bg-border/50 mx-2" }),
        /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:662", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:663", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:664", className: "text-[10px] font-condensed uppercase tracking-widest text-muted-foreground block leading-none mb-1 text-right", children: "Chat Model" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:665", className: "flex bg-background/50 p-0.5 rounded border border-border", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                "data-loc": "listing-generator\\client\\AIProductAgent.tsx:666",
                onClick: () => setModelId("gemini-1.5-pro"),
                className: `px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${modelId === "gemini-1.5-pro" ? "bg-gold text-black shadow-inner" : "text-muted-foreground hover:text-foreground"}`,
                children: "Pro"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                "data-loc": "listing-generator\\client\\AIProductAgent.tsx:672",
                onClick: () => setModelId("gemini-2.1-flash"),
                className: `px-3 py-1 rounded text-[9px] font-bold uppercase transition-all ${modelId === "gemini-2.1-flash" ? "bg-gold text-black shadow-inner" : "text-muted-foreground hover:text-foreground"}`,
                children: "Flash"
              }
            )
          ] })
        ] }) })
      ] }),
      messages.map((msg, idx) => /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:684", className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:685", className: `max-w-[85%] ${msg.role === "user" ? "order-2" : "order-1"}`, children: [
        msg.role === "model" && /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:687", className: "flex items-center gap-1.5 mb-1", children: [
          /* @__PURE__ */ jsx(Bot, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:688", className: "w-3 h-3 text-gold" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:689", className: "text-xs font-semibold text-gold", children: "AI Consultant" })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-loc": "listing-generator\\client\\AIProductAgent.tsx:692",
            className: `rounded-xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-gold text-black rounded-tr-sm" : "bg-secondary text-foreground rounded-tl-sm border border-border"}`,
            children: renderMessageText(msg.text)
          }
        ),
        msg.role === "model" && idx === messages.length - 1 && generatedProduct && /* @__PURE__ */ jsx(
          ProductPreview,
          {
            "data-loc": "listing-generator\\client\\AIProductAgent.tsx:703",
            product: generatedProduct,
            onPost: handlePostProduct,
            onGenerateImage: handleGenerateImage,
            onGenerateInfographic: handleGenerateInfographic,
            isPosting,
            isGeneratingImage,
            isGeneratingInfographic
          }
        )
      ] }) }, idx)),
      isLoading && /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:719", className: "flex justify-start", children: /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:720", className: "bg-secondary border border-border rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:721", className: "w-4 h-4 text-gold animate-spin" }),
        /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:722", className: "text-muted-foreground text-sm", children: "AI is thinking..." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:727", ref: messagesEndRef })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:731", className: "flex gap-2 px-4 py-2 border-t border-border bg-secondary/20 overflow-x-auto", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          "data-loc": "listing-generator\\client\\AIProductAgent.tsx:732",
          size: "sm",
          variant: "outline",
          className: "shrink-0 text-xs h-7 gap-1.5 border-gold/30 text-gold hover:bg-gold/10",
          onClick: handleGenerateProduct,
          disabled: isLoading || !lastDescription,
          children: [
            /* @__PURE__ */ jsx(Sparkles, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:739", className: "w-3 h-3" }),
            "🚀 Generate Product"
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          "data-loc": "listing-generator\\client\\AIProductAgent.tsx:742",
          size: "sm",
          variant: "outline",
          className: "shrink-0 text-xs h-7 gap-1.5",
          onClick: () => {
            setInput("What trending products should I add for the international market right now?");
          },
          children: "💡 Trending Ideas"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          "data-loc": "listing-generator\\client\\AIProductAgent.tsx:752",
          size: "sm",
          variant: "outline",
          className: "shrink-0 text-xs h-7 gap-1.5",
          onClick: () => {
            setInput("Create a custom BJJ kimono with competition specs, platinum weave, and logo placement options");
          },
          children: "🥋 BJJ Kimono"
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          "data-loc": "listing-generator\\client\\AIProductAgent.tsx:762",
          size: "sm",
          variant: "outline",
          className: "shrink-0 text-xs h-7 gap-1.5",
          onClick: () => {
            setInput("Create a waterproof hunting jacket with fleece lining in camo and olive");
          },
          children: "🎯 Hunting Jacket"
        }
      ),
      /* @__PURE__ */ jsxs(
        Button,
        {
          "data-loc": "listing-generator\\client\\AIProductAgent.tsx:772",
          size: "sm",
          variant: "outline",
          className: "shrink-0 text-xs h-7 gap-1.5",
          onClick: () => {
            setMessages([{
              role: "model",
              text: "👋 Chat cleared! I'm ready to help you create a new product listing. What would you like to add?",
              timestamp: /* @__PURE__ */ new Date()
            }]);
            setGeneratedProduct(null);
            setLastDescription("");
          },
          children: [
            /* @__PURE__ */ jsx(RefreshCw, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:786", className: "w-3 h-3" }),
            "Clear"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:792", className: "flex gap-2 p-4 border-t border-border bg-background", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          "data-loc": "listing-generator\\client\\AIProductAgent.tsx:793",
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          },
          placeholder: "Describe the product you want to create, or ask me anything...",
          className: "flex-1 bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold/50",
          disabled: isLoading
        }
      ),
      /* @__PURE__ */ jsx(
        Button,
        {
          "data-loc": "listing-generator\\client\\AIProductAgent.tsx:801",
          onClick: handleSend,
          disabled: isLoading || !input.trim(),
          className: "bg-gold text-black hover:bg-gold/90 h-10 px-4 shrink-0",
          children: /* @__PURE__ */ jsx(Send, { "data-loc": "listing-generator\\client\\AIProductAgent.tsx:806", className: "w-4 h-4" })
        }
      )
    ] })
  ] });
}
function AIImageOptimizer() {
  const [rawFile, setRawFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [seoData, setSeoData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editFilename, setEditFilename] = useState("");
  const [editAltText, setEditAltText] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const fileInputRef = useRef(null);
  const optimizeImageMutation = trpc.aiAgent.optimizeImage.useMutation();
  trpc.adminSettings.getApiKey.useQuery(void 0, { retry: false });
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64Str = await fileToBase64(file);
      const base64 = base64Str.split(",")[1];
      setRawFile({ file, base64, mimeType: file.type });
      setSeoData(null);
      analyzeImage(base64, file.type);
    } catch (err) {
      toast.error("Failed to read image", { description: err.message });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const analyzeImage = async (base64, mimeType) => {
    setIsAnalyzing(true);
    try {
      const { seoData: seoData2 } = await optimizeImageMutation.mutateAsync({
        base64,
        mimeType
      });
      setSeoData(seoData2);
      setEditFilename(seoData2.filename);
      setEditAltText(seoData2.altText);
      setEditCaption(seoData2.caption);
      toast.success("Image optimized successfully!");
    } catch (err) {
      toast.error("Analysis failed", { description: err.message });
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleClear = () => {
    setRawFile(null);
    setSeoData(null);
  };
  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };
  const handleDownloadOptimized = () => {
    if (!rawFile || !seoData) return;
    const url = URL.createObjectURL(rawFile.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = editFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Image downloaded as ${editFilename}`);
  };
  return /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:104", className: "flex flex-col min-h-[500px] bg-background rounded-xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:106", className: "flex items-center justify-between px-5 py-3.5 border-b border-border bg-secondary/30", children: /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:107", className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:108", className: "w-8 h-8 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center", children: /* @__PURE__ */ jsx(ImagePlus, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:109", className: "w-4 h-4 text-gold" }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:111", children: [
        /* @__PURE__ */ jsx("h3", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:112", className: "font-condensed font-bold uppercase tracking-wider text-sm text-foreground", children: "AI Image Optimizer" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:115", className: "text-muted-foreground text-xs", children: "Upload raw images to auto-generate SEO metadata" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:120", className: "flex flex-col md:flex-row flex-1 p-5 gap-6", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:123", className: "w-full md:w-1/3 flex flex-col gap-4", children: !rawFile ? /* @__PURE__ */ jsxs(
        "div",
        {
          "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:125",
          className: "border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 h-full bg-secondary/10 hover:bg-secondary/30 transition-colors cursor-pointer",
          onClick: () => fileInputRef.current?.click(),
          children: [
            /* @__PURE__ */ jsx(Upload, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:129", className: "w-8 h-8 text-gold mb-3" }),
            /* @__PURE__ */ jsx("h4", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:130", className: "font-condensed font-bold text-foreground", children: "Upload Raw Image" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:131", className: "text-xs text-muted-foreground text-center mt-2", children: "JPEG, PNG, WEBP up to 5MB. AI will analyze contents." }),
            /* @__PURE__ */ jsx(
              "input",
              {
                "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:134",
                ref: fileInputRef,
                type: "file",
                accept: "image/*",
                onChange: handleFileUpload,
                className: "hidden"
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:143", className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:144", className: "relative rounded-xl border border-border overflow-hidden bg-secondary", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:145",
              src: `data:${rawFile.mimeType};base64,${rawFile.base64}`,
              alt: "Preview",
              className: "w-full object-cover max-h-[300px]"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:150",
              onClick: handleClear,
              className: "absolute top-2 right-2 bg-black/60 hover:bg-destructive/80 text-white rounded-full p-1.5 transition-colors",
              children: /* @__PURE__ */ jsx(X, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:154", className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:158",
            variant: "outline",
            onClick: () => analyzeImage(rawFile.base64, rawFile.mimeType),
            disabled: isAnalyzing,
            className: "w-full text-xs font-condensed uppercase tracking-wider",
            children: [
              isAnalyzing ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:164", className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(Sparkles, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:164", className: "w-4 h-4 mr-2 text-gold" }),
              isAnalyzing ? "Analyzing..." : "Re-Analyze Image"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:172", className: "w-full md:w-2/3 flex flex-col gap-4", children: !rawFile ? /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:174", className: "flex-1 flex flex-col items-center justify-center border border-border rounded-xl bg-secondary/5 p-8 text-center h-full", children: [
        /* @__PURE__ */ jsx(Sparkles, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:175", className: "w-10 h-10 text-muted-foreground/30 mb-3" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:176", className: "text-muted-foreground text-sm max-w-sm", children: "Upload an image on the left to automatically generate an SEO-optimized filename, alt text, and caption using Gemini Vision." })
      ] }) : isAnalyzing ? /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:181", className: "flex-1 flex flex-col items-center justify-center border border-border rounded-xl bg-secondary/5 p-8 text-center h-full", children: [
        /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:182", className: "w-10 h-10 text-gold animate-spin mb-4" }),
        /* @__PURE__ */ jsx("h3", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:183", className: "font-condensed font-bold uppercase tracking-wider text-lg text-foreground mb-1", children: "Analyzing Image..." }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:186", className: "text-sm text-muted-foreground", children: "Extracting features, generating CEO-optimized tags, and creating localized filename..." })
      ] }) : seoData ? /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:191", className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:192", className: "bg-secondary/30 border border-gold/20 rounded-xl p-4 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:193", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:194", className: "flex items-center justify-between mb-1.5", children: [
              /* @__PURE__ */ jsx(Label, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:195", className: "text-xs uppercase tracking-wider text-muted-foreground font-bold", children: "Optimized Filename" }),
              /* @__PURE__ */ jsx("button", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:198", onClick: () => handleCopyToClipboard(editFilename, "Filename"), className: "text-gold hover:text-gold-light", children: /* @__PURE__ */ jsx(Copy, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:199", className: "w-3.5 h-3.5" }) })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:202",
                value: editFilename,
                onChange: (e) => setEditFilename(e.target.value),
                className: "font-mono text-xs bg-background"
              }
            ),
            /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:207", className: "text-[10px] text-muted-foreground mt-1", children: "Use this exact filename when uploading to your website or CMS." })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:210", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:211", className: "flex items-center justify-between mb-1.5", children: [
              /* @__PURE__ */ jsx(Label, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:212", className: "text-xs uppercase tracking-wider text-muted-foreground font-bold", children: "Alt Text (For SEO & Accessibility)" }),
              /* @__PURE__ */ jsx("button", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:215", onClick: () => handleCopyToClipboard(editAltText, "Alt Text"), className: "text-gold hover:text-gold-light", children: /* @__PURE__ */ jsx(Copy, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:216", className: "w-3.5 h-3.5" }) })
            ] }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:219",
                value: editAltText,
                onChange: (e) => setEditAltText(e.target.value),
                className: "text-sm min-h-[80px] bg-background"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:226", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:227", className: "flex items-center justify-between mb-1.5", children: [
              /* @__PURE__ */ jsx(Label, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:228", className: "text-xs uppercase tracking-wider text-muted-foreground font-bold", children: "Marketing Caption" }),
              /* @__PURE__ */ jsx("button", { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:231", onClick: () => handleCopyToClipboard(editCaption, "Caption"), className: "text-gold hover:text-gold-light", children: /* @__PURE__ */ jsx(Copy, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:232", className: "w-3.5 h-3.5" }) })
            ] }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:235",
                value: editCaption,
                onChange: (e) => setEditCaption(e.target.value),
                className: "text-sm min-h-[80px] bg-background"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:243",
            onClick: handleDownloadOptimized,
            className: "w-full bg-gold text-black hover:bg-gold/90 font-condensed font-bold uppercase tracking-wider h-12",
            children: [
              /* @__PURE__ */ jsx(Download, { "data-loc": "listing-generator\\client\\AIImageOptimizer.tsx:247", className: "w-5 h-5 mr-2" }),
              "Download Extracted Image"
            ]
          }
        )
      ] }) : null })
    ] })
  ] });
}
const Form = FormProvider;
const FormFieldContext = React.createContext(
  {}
);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { "data-loc": "client\\src\\components\\ui\\form.tsx:39", value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { "data-loc": "client\\src\\components\\ui\\form.tsx:40", ...props }) });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = React.createContext(
  {}
);
function FormItem({ className, ...props }) {
  const id = React.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { "data-loc": "client\\src\\components\\ui\\form.tsx:80", value: { id }, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-loc": "client\\src\\components\\ui\\form.tsx:81",
      "data-slot": "form-item",
      className: cn("grid gap-2", className),
      ...props
    }
  ) });
}
function FormLabel({
  className,
  ...props
}) {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    {
      "data-loc": "client\\src\\components\\ui\\form.tsx:97",
      "data-slot": "form-label",
      "data-error": !!error,
      className: cn("data-[error=true]:text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
}
function FormControl({ ...props }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      "data-loc": "client\\src\\components\\ui\\form.tsx:112",
      "data-slot": "form-control",
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
}
function FashionDesignerStudio() {
  const [step, setStep] = useState("conception");
  const [prompt, setPrompt] = useState("");
  const [modelId, setModelId] = useState("gemini-3.1-flash-image-preview");
  const [gridImage, setGridImage] = useState(null);
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
      isFeatured: true
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
    } catch (err) {
      toast.error("Generation failed", { description: err.message });
      setStep("conception");
    }
  };
  const handleApproveDesign = async () => {
    if (!gridImage) return;
    setStep("producing");
    setIsProcessing(true);
    try {
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
        isFeatured: true
      });
      toast.success("Design finalized and SEO details auto-filled by AI.");
    } catch (err) {
      toast.error("Failed to process the final digital asset", { description: err.message });
      setStep("review_grid");
    } finally {
      setIsProcessing(false);
    }
  };
  const handlePublishProduct = async (data) => {
    if (!finalImageUrl) {
      toast.error("Image asset is missing.");
      return;
    }
    try {
      await createProductMutation.mutateAsync({
        ...data,
        slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
        mainImage: finalImageUrl
      });
      toast.success("Product published successfully!");
      setStep("success");
    } catch (err) {
      toast.error("Publish failed", { description: err.message });
    }
  };
  return /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:129", className: "flex flex-col min-h-[600px] bg-background rounded-xl border border-border overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:131", className: "flex items-center justify-between px-5 py-3.5 border-b border-border bg-gradient-to-r from-secondary/80 to-background/50", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:132", className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:133", className: "w-8 h-8 rounded-lg bg-gold/20 border border-gold/50 flex items-center justify-center", children: /* @__PURE__ */ jsx(Paintbrush, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:134", className: "w-4 h-4 text-gold drop-shadow-[0_0_8px_rgba(238,187,51,0.5)]" }) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:136", children: [
          /* @__PURE__ */ jsx("h3", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:137", className: "font-condensed font-bold uppercase tracking-wider text-sm text-foreground bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70", children: "Premium Fashion Designer Studio" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:140", className: "text-muted-foreground text-xs", children: "High-end Single-Shot Design Composite" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:145", className: "flex items-center gap-2 text-xs font-condensed uppercase tracking-wider text-muted-foreground hidden sm:flex", children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:146", className: step === "conception" || step === "generating_grid" ? "text-gold font-bold" : "", children: "1. Concept" }),
        /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:147", className: "w-3 h-3 mx-1 opacity-50" }),
        /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:148", className: step === "review_grid" ? "text-gold font-bold" : "", children: "2. Review" }),
        /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:149", className: "w-3 h-3 mx-1 opacity-50" }),
        /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:150", className: step === "producing" || step === "success" ? "text-gold font-bold" : "", children: "3. Production" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:154", className: "flex-1 p-6 flex flex-col items-center", children: [
      (step === "conception" || step === "generating_grid") && /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:158", className: "w-full max-w-2xl mt-12 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:159", className: "text-center space-y-2 mb-8", children: [
          /* @__PURE__ */ jsx(Sparkles, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:160", className: "w-12 h-12 text-gold/60 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("h2", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:161", className: "text-2xl font-condensed font-bold uppercase tracking-wider", children: "Design Your Next Collection" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:162", className: "text-muted-foreground text-sm leading-relaxed", children: "Enter your design prompt. The AI will act as a senior fashion designer to create a beautiful single-composite image showcasing all angles, designed specifically to sidestep slow proxy timeout limitations." })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:167", className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:168", className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("label", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:169", className: "text-xs font-condensed uppercase tracking-widest text-gold/80 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Sparkles, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:170", className: "w-3.5 h-3.5" }),
              "AI Model (Visual Style)"
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:173", className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:174",
                  onClick: () => setModelId("gemini-3.1-flash-image-preview"),
                  className: `px-3 py-2 rounded border text-xs font-condensed uppercase transition-all flex flex-col items-center gap-1 ${modelId === "gemini-3.1-flash-image-preview" ? "bg-gold text-black border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]" : "bg-secondary/50 border-border text-muted-foreground hover:border-gold/50"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:181", children: "Nano Banana 2" }),
                    /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:182", className: "opacity-60 text-[8px]", children: "3.1 Flash Image" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:184",
                  onClick: () => setModelId("gemini-2.5-flash-image"),
                  className: `px-3 py-2 rounded border text-xs font-condensed uppercase transition-all flex flex-col items-center gap-1 ${modelId === "gemini-2.5-flash-image" ? "bg-gold text-black border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]" : "bg-secondary/50 border-border text-muted-foreground hover:border-gold/50"}`,
                  children: [
                    /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:191", children: "Nano Banana" }),
                    /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:192", className: "opacity-60 text-[8px]", children: "2.5 Flash Image" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:197", className: "relative", children: /* @__PURE__ */ jsx(
            Textarea,
            {
              "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:198",
              placeholder: "Describe the apparel in extreme detail. e.g. 'Premium custom BJJ Kimono, 450gsm pearl weave, black with gold stitching, sleek athletic fit, minimal branding on the left shoulder.'",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              className: "min-h-[140px] text-base p-5 pr-4 border-2 border-border focus:border-gold/50 rounded-xl resize-none transition-all shadow-sm",
              disabled: step === "generating_grid"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:208",
            onClick: handleGenerateGrid,
            disabled: step === "generating_grid" || prompt.length < 5,
            className: "w-full h-14 bg-gold text-black hover:bg-gold/90 font-condensed font-bold text-lg uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(238,187,51,0.2)] hover:shadow-[0_0_30px_rgba(238,187,51,0.4)] transition-all",
            children: step === "generating_grid" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:215", className: "w-5 h-5 mr-3 animate-spin" }),
              "Drafting Studio Composite..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Eye, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:220", className: "w-5 h-5 mr-3" }),
              "Generate Studio Composite"
            ] })
          }
        )
      ] }),
      step === "review_grid" && gridImage && /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:230", className: "w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:231", className: "text-center", children: [
          /* @__PURE__ */ jsx("h2", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:232", className: "text-2xl font-condensed font-bold uppercase tracking-wider mb-2", children: "Review Digital Asset" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:233", className: "text-muted-foreground text-sm", children: "If you approve this high-resolution composite, the AI will package it as the primary display image and scrape all visual details to construct your SEO listing automatically." })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:238", className: "max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group bg-secondary/20", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:239",
              src: `data:${gridImage.mimeType};base64,${gridImage.base64}`,
              alt: "Generated Composite",
              className: "w-full h-auto object-contain"
            }
          ),
          /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:244", className: "absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent", children: /* @__PURE__ */ jsxs("p", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:245", className: "text-white text-sm font-medium leading-relaxed drop-shadow-md", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:246", className: "text-gold font-bold mr-2", children: "PROMPT:" }),
            prompt
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:252", className: "flex items-center justify-center gap-4 pt-4", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:253",
              variant: "outline",
              size: "lg",
              onClick: () => setStep("conception"),
              className: "w-48 font-condensed uppercase tracking-wider",
              children: "Re-Roll Prompt"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:261",
              size: "lg",
              onClick: handleApproveDesign,
              className: "w-64 bg-gold text-black hover:bg-gold/90 font-condensed font-bold uppercase tracking-wider shadow-lg",
              children: [
                /* @__PURE__ */ jsx(CheckCircle, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:266", className: "w-5 h-5 mr-2" }),
                "Approve Asset"
              ]
            }
          )
        ] })
      ] }),
      step === "producing" && /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:275", className: "w-full space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:277", className: "flex items-center gap-4 bg-secondary/30 p-4 rounded-xl border border-border", children: [
          isProcessing ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:279", className: "w-6 h-6 text-gold animate-spin" }) : /* @__PURE__ */ jsx(CheckCircle, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:281", className: "w-6 h-6 text-green-500" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:283", children: [
            /* @__PURE__ */ jsx("h3", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:284", className: "font-condensed font-bold uppercase tracking-wider text-base", children: isProcessing ? "Finalizing Studio Asset..." : "Asset Ready for Publishing" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:287", className: "text-sm text-muted-foreground", children: "Processing the final digital asset and structuring SEO listings using Gemini text extraction." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:293", className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:294", className: "space-y-4", children: [
            /* @__PURE__ */ jsx("h4", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:295", className: "font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground border-b border-border pb-2", children: "Digital Asset Review" }),
            /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:298", className: "relative rounded-xl border border-border overflow-hidden bg-secondary/20 block aspect-square", children: gridImage ? /* @__PURE__ */ jsx("img", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:300", src: `data:${gridImage.mimeType};base64,${gridImage.base64}`, className: "w-full h-full object-contain", alt: "Composite Grid" }) : /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:302", className: "w-full h-full flex flex-col items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:303", className: "w-8 h-8 animate-spin mx-auto mb-2 text-gold/40" }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:309", className: "space-y-4 bg-secondary/30 p-5 rounded-xl border border-border flex flex-col", children: [
            /* @__PURE__ */ jsxs("h4", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:310", className: "font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground border-b border-border pb-2 flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:311", children: "Product Context" }),
              isProcessing && /* @__PURE__ */ jsxs("span", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:313", className: "flex items-center text-gold text-xs font-condensed", children: [
                /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:314", className: "w-3 h-3 animate-spin mr-1.5" }),
                " Drafting Catalog Matrix..."
              ] })
            ] }),
            /* @__PURE__ */ jsx(Form, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:319", ...form, children: /* @__PURE__ */ jsxs("form", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:320", onSubmit: form.handleSubmit(handlePublishProduct), className: "space-y-5 flex-1 relative flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:321", className: "space-y-4", children: [
                /* @__PURE__ */ jsx(FormField, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:322", control: form.control, name: "title", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:323", children: [
                  /* @__PURE__ */ jsx(FormLabel, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:323", children: "Product Title" }),
                  /* @__PURE__ */ jsx(FormControl, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:323", children: /* @__PURE__ */ jsx(Input, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:323", ...field, disabled: isProcessing }) })
                ] }) }),
                /* @__PURE__ */ jsx(FormField, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:325", control: form.control, name: "shortDescription", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:326", children: [
                  /* @__PURE__ */ jsx(FormLabel, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:326", children: "Matrix SEO Summary" }),
                  /* @__PURE__ */ jsx(FormControl, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:326", children: /* @__PURE__ */ jsx(Textarea, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:326", className: "h-24 resize-none text-xs", ...field, disabled: isProcessing }) })
                ] }) }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:329", className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsx(FormField, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:330", control: form.control, name: "material", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:331", children: [
                    /* @__PURE__ */ jsx(FormLabel, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:331", children: "Textile Build" }),
                    /* @__PURE__ */ jsx(FormControl, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:331", children: /* @__PURE__ */ jsx(Input, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:331", ...field, disabled: isProcessing }) })
                  ] }) }),
                  /* @__PURE__ */ jsx(FormField, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:333", control: form.control, name: "samplePrice", render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:334", children: [
                    /* @__PURE__ */ jsx(FormLabel, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:334", children: "Sample Blueprint ($)" }),
                    /* @__PURE__ */ jsx(FormControl, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:334", children: /* @__PURE__ */ jsx(Input, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:334", ...field, disabled: isProcessing }) })
                  ] }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:339",
                  type: "submit",
                  disabled: isProcessing,
                  className: "w-full mt-6 bg-gold text-black hover:bg-gold/90 font-condensed font-bold uppercase tracking-wider shadow-lg h-12",
                  children: [
                    /* @__PURE__ */ jsx(Package, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:344", className: "w-5 h-5 mr-2" }),
                    "Deploy to Catalog"
                  ]
                }
              )
            ] }) })
          ] })
        ] })
      ] }),
      step === "success" && /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:356", className: "flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:357", className: "w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20", children: /* @__PURE__ */ jsx(CheckCircle, { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:358", className: "w-10 h-10 text-green-500" }) }),
        /* @__PURE__ */ jsx("h2", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:360", className: "text-3xl font-condensed font-bold uppercase tracking-wider mb-3", children: "Asset Deployed Successfully" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:361", className: "text-muted-foreground mb-8", children: "Premium studio composite and structured SEO catalog metadata are live in the system pipeline." }),
        /* @__PURE__ */ jsx(
          Button,
          {
            "data-loc": "listing-generator\\client\\FashionDesignerStudio.tsx:364",
            onClick: () => {
              setPrompt("");
              setStep("conception");
            },
            className: "bg-secondary text-foreground hover:bg-secondary/80 font-condensed font-bold uppercase tracking-wider px-8 h-12",
            children: "Draft Next Asset"
          }
        )
      ] })
    ] })
  ] });
}
function VirtualTryOnAgent({
  onUseImage,
  onUseImages
}) {
  const utils = trpc.useUtils();
  const { data: savedModelsResult, isLoading: isLoadingModels } = trpc.aiAgent.getSavedModels.useQuery();
  const saveModelMutation = trpc.aiAgent.saveTryOnModel.useMutation({
    onSuccess: () => {
      utils.aiAgent.getSavedModels.invalidate();
      toast.success("Model saved to your Library!");
      setHasUnsavedModel(false);
    },
    onError: (err) => toast.error(err.message)
  });
  const generateMutation = trpc.aiAgent.generateTryOnImage.useMutation({
    onSuccess: (data) => {
      setGeneratedImages(data.images);
      toast.success("Virtual Try-On successful!");
    },
    onError: (err) => toast.error(err.message)
  });
  const [modelImage, setModelImage] = useState(null);
  const [hasUnsavedModel, setHasUnsavedModel] = useState(false);
  const [referenceImages, setReferenceImages] = useState([]);
  const [referenceLink, setReferenceLink] = useState("");
  const [category, setCategory] = useState("Streetwear");
  const [logoImage, setLogoImage] = useState(null);
  const [prompt, setPrompt] = useState("Place the extracted garment on the model naturally.");
  const [generatedImages, setGeneratedImages] = useState(null);
  const modelInputRef = useRef(null);
  const refInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const handleModelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setModelImage({ base64: base64.split(",")[1], mimeType: file.type, preview: base64 });
    setHasUnsavedModel(true);
  };
  const handleReferenceUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newRefs = await Promise.all(
      files.map(async (file) => {
        const base64 = await fileToBase64(file);
        return { base64: base64.split(",")[1], mimeType: file.type, preview: base64 };
      })
    );
    setReferenceImages((prev) => [...prev, ...newRefs]);
  };
  const handleLogoUpload = async (e) => {
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
      referenceImages: referenceImages.map((img) => ({ base64: img.base64, mimeType: img.mimeType })),
      referenceLink: referenceLink || void 0,
      category,
      logoImage: logoImage ? { base64: logoImage.base64, mimeType: logoImage.mimeType } : void 0
    });
  };
  const handleDownload = async (imageUrl, viewName) => {
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
  return /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:130", className: "grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in fade-in duration-500", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:132", className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:135", className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:136", className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("h2", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:137", className: "text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(UserIcon, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:138", className: "w-4 h-4 text-gold" }),
            " Base Model"
          ] }),
          hasUnsavedModel && modelImage && /* @__PURE__ */ jsx(
            Button,
            {
              "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:141",
              size: "sm",
              className: "h-7 text-xs bg-gold hover:bg-gold/90 text-black font-bold",
              disabled: saveModelMutation.isPending,
              onClick: () => saveModelMutation.mutate({ base64: modelImage.base64, mimeType: modelImage.mimeType }),
              children: saveModelMutation.isPending ? "Saving..." : "Save to Library"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:152", className: "flex flex-col gap-4", children: /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:154", className: "flex gap-4", children: [
          modelImage ? /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:156", className: "relative group w-32 h-40 shrink-0", children: [
            /* @__PURE__ */ jsx("img", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:157", src: modelImage.preview, alt: "Base model", className: "w-full h-full object-cover rounded-lg border-2 border-gold" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:158", className: "absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded shadow", children: "Active" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:159",
                onClick: () => {
                  setModelImage(null);
                  setHasUnsavedModel(false);
                },
                className: "absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md",
                children: /* @__PURE__ */ jsx(X, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:163", className: "w-3 h-3" })
              }
            )
          ] }) : /* @__PURE__ */ jsxs(
            "div",
            {
              "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:167",
              className: "w-32 h-40 border-2 border-dashed border-border hover:border-gold/50 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-secondary/10 shrink-0",
              onClick: () => modelInputRef.current?.click(),
              children: [
                /* @__PURE__ */ jsx(Upload, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:171", className: "w-5 h-5 text-muted-foreground" }),
                /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:172", className: "text-xs font-medium text-muted-foreground text-center px-2", children: "Upload New Custom Model" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("input", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:175", type: "file", ref: modelInputRef, className: "hidden", accept: "image/*", onChange: handleModelUpload }),
          /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:178", className: "flex gap-3 overflow-x-auto pb-2 flex-nowrap w-full", children: isLoadingModels ? /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:180", className: "w-24 h-32 flex items-center justify-center rounded-lg bg-secondary/20 animate-pulse text-xs text-muted-foreground text-center p-2", children: "Loading Library..." }) : savedModelsResult?.models?.map((savedModel) => /* @__PURE__ */ jsxs(
            "div",
            {
              "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:183",
              onClick: async () => {
                try {
                  const res = await fetch(savedModel.imageUrl);
                  const blob = await res.blob();
                  const reader = new FileReader();
                  reader.readAsDataURL(blob);
                  reader.onloadend = () => {
                    const b64 = reader.result;
                    setModelImage({
                      base64: b64.split(",")[1],
                      mimeType: blob.type,
                      preview: savedModel.imageUrl
                    });
                    setHasUnsavedModel(false);
                  };
                } catch (e) {
                  toast.error("Failed to load saved model");
                }
              },
              className: "w-24 h-32 shrink-0 rounded-lg border border-border cursor-pointer hover:border-gold/50 transition-all opacity-70 hover:opacity-100 group relative overflow-hidden",
              children: [
                /* @__PURE__ */ jsx("img", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:206", src: savedModel.imageUrl, alt: savedModel.name || "Saved", className: "w-full h-full object-cover" }),
                /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:207", className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:208", className: "text-[10px] bg-gold text-black px-2 py-1 rounded font-bold", children: "Use Model" }) })
              ]
            },
            savedModel.id
          )) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:219", className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ jsxs("h2", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:220", className: "text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(ClothesIcon, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:221", className: "w-4 h-4 text-gold" }),
          " Reference Garment"
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:223", className: "text-xs text-muted-foreground mb-4", children: "Upload 1-3 clear photos of the garment, OR paste a product link (e.g. from Zara, Amazon) and the AI will scrape the image." }),
        /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:227", className: "mb-4", children: /* @__PURE__ */ jsx(
          Input,
          {
            "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:228",
            value: referenceLink,
            onChange: (e) => setReferenceLink(e.target.value),
            placeholder: "Or paste a product link here...",
            className: "bg-secondary/20"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:235", className: "flex items-center gap-4 mb-4", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:236", className: "h-px bg-border flex-1" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:237", className: "text-xs text-muted-foreground font-medium uppercase", children: "Or Upload Manually" }),
          /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:238", className: "h-px bg-border flex-1" })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:241", className: "flex flex-wrap gap-4", children: [
          referenceImages.map((img, i) => /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:243", className: "relative group w-24 h-24 shrink-0", children: [
            /* @__PURE__ */ jsx("img", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:244", src: img.preview, alt: `Reference ${i}`, className: "w-full h-full object-cover rounded-lg border border-border" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:245",
                onClick: () => setReferenceImages((prev) => prev.filter((_, idx) => idx !== i)),
                className: "absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md",
                children: /* @__PURE__ */ jsx(X, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:249", className: "w-3 h-3" })
              }
            )
          ] }, i)),
          referenceImages.length < 3 && /* @__PURE__ */ jsx(
            "div",
            {
              "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:254",
              className: "w-24 h-24 border-2 border-dashed border-border hover:border-gold/50 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-secondary/10",
              onClick: () => refInputRef.current?.click(),
              children: /* @__PURE__ */ jsx(ImagePlus, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:258", className: "w-5 h-5 text-muted-foreground" })
            }
          ),
          /* @__PURE__ */ jsx("input", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:261", type: "file", ref: refInputRef, multiple: true, className: "hidden", accept: "image/*", onChange: handleReferenceUpload })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:266", className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ jsxs("h2", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:267", className: "text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:268", className: "w-4 h-4 text-gold" }),
          " Garment Category (For Lifestyle Shot)"
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:270", className: "text-xs text-muted-foreground mb-4", children: "Tell the AI what type of garment this is so it places the model in a realistic environment (e.g., Gym, Street, Formal)." }),
        /* @__PURE__ */ jsx(
          Input,
          {
            "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:273",
            value: category,
            onChange: (e) => setCategory(e.target.value),
            placeholder: "e.g. Sportswear, Streetwear, Suit...",
            className: "bg-secondary/20"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:282", className: "bg-card border border-border rounded-xl p-6", children: [
        /* @__PURE__ */ jsxs("h2", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:283", className: "text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:284", className: "w-4 h-4 text-gold" }),
          " Apply Custom Logo (Optional)"
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:286", className: "text-xs text-muted-foreground mb-4", children: "Upload your logo (PNG transparent is best). The AI will map it naturally onto the generated garment." }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:290", className: "flex gap-4", children: [
          logoImage ? /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:292", className: "relative group w-24 h-24 shrink-0 bg-secondary/50 rounded-lg flex items-center justify-center p-2 border border-border", children: [
            /* @__PURE__ */ jsx("img", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:293", src: logoImage.preview, alt: "Logo", className: "w-full h-full object-contain" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:294",
                onClick: () => setLogoImage(null),
                className: "absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md",
                children: /* @__PURE__ */ jsx(X, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:298", className: "w-3 h-3" })
              }
            )
          ] }) : /* @__PURE__ */ jsx(
            "div",
            {
              "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:302",
              className: "w-24 h-24 border-2 border-dashed border-border hover:border-gold/50 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-secondary/10",
              onClick: () => logoInputRef.current?.click(),
              children: /* @__PURE__ */ jsx(Upload, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:306", className: "w-5 h-5 text-muted-foreground" })
            }
          ),
          /* @__PURE__ */ jsx("input", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:309", type: "file", ref: logoInputRef, className: "hidden", accept: "image/png, image/jpeg", onChange: handleLogoUpload })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:316", className: "bg-card border border-border rounded-xl p-6 flex flex-col", children: [
      /* @__PURE__ */ jsxs("h2", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:317", className: "text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsx(Wand2, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:318", className: "w-4 h-4 text-gold" }),
        " Try-On Studio"
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:321", className: "flex-1 bg-secondary/20 rounded-xl border border-border/50 flex flex-col items-center justify-center p-4 min-h-[400px] mb-4 overflow-hidden relative", children: [
        generateMutation.isPending && /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:323", className: "absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:324", className: "w-10 h-10 text-gold animate-spin mb-4" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:325", className: "text-sm font-medium text-foreground", children: "Extracting garment and rendering try-on..." }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:326", className: "text-xs text-muted-foreground", children: "This may take up to 20 seconds" })
        ] }),
        generatedImages && generatedImages.length > 0 ? /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:331", className: "grid grid-cols-2 gap-4 w-full h-full overflow-y-auto p-2", children: generatedImages.map((img, i) => /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:333", className: "flex flex-col gap-2 relative group w-full", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:334", className: "aspect-[3/4] w-full relative", children: [
            /* @__PURE__ */ jsx("img", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:335", src: img.url, alt: img.view, className: "w-full h-full object-cover rounded-lg shadow-md border border-border" }),
            /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:336", className: "absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg", children: /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:337", className: "text-xs font-bold text-white text-center tracking-wider", children: img.view }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:340", className: "flex gap-2", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:341",
                size: "sm",
                variant: "outline",
                className: "flex-1 text-xs px-2",
                onClick: () => {
                  if (onUseImage) {
                    toast.info("Sending view to Listing Agent...");
                    onUseImage(img.url, "", "");
                  }
                },
                children: [
                  /* @__PURE__ */ jsx(CheckCircle, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:352", className: "w-3 h-3 mr-1 text-emerald-500" }),
                  "Use"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:355",
                size: "sm",
                variant: "secondary",
                className: "px-3",
                onClick: () => handleDownload(img.url, img.view),
                children: /* @__PURE__ */ jsxs("svg", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:361", xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx("path", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:361", d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                  /* @__PURE__ */ jsx("polyline", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:361", points: "7 10 12 15 17 10" }),
                  /* @__PURE__ */ jsx("line", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:361", x1: "12", x2: "12", y1: "15", y2: "3" })
                ] })
              }
            )
          ] })
        ] }, i)) }) : /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:368", className: "text-center max-w-sm", children: [
          /* @__PURE__ */ jsx(Wand2, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:369", className: "w-12 h-12 text-muted-foreground/30 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("h3", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:370", className: "text-muted-foreground font-medium mb-1", children: "Workspace Empty" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:371", className: "text-xs text-muted-foreground/70", children: "Configure your model, garment, and logo on the left, then click Generate to see the photorealistic multi-view results here." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:378", className: "space-y-3", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:379",
            value: prompt,
            onChange: (e) => setPrompt(e.target.value),
            placeholder: "e.g. Put the garment on the model. Make the logo visible on the left chest.",
            className: "bg-secondary/30"
          }
        ),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:386", className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:387",
              className: "flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold",
              onClick: handleGenerate,
              disabled: generateMutation.isPending || !modelImage || referenceImages.length === 0 && !referenceLink,
              children: [
                generateMutation.isPending ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:392", className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(Wand2, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:392", className: "w-4 h-4 mr-2" }),
                "Generate Collection"
              ]
            }
          ),
          generatedImages && generatedImages.length > 0 && onUseImages && /* @__PURE__ */ jsxs(
            Button,
            {
              "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:397",
              className: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6",
              onClick: () => {
                toast.info("Sending entire collection to Listing Agent...");
                onUseImages(generatedImages.map((img) => ({ url: img.url, base64: "", mimeType: "" })));
              },
              children: [
                /* @__PURE__ */ jsx(CheckCircle, { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:404", className: "w-4 h-4 mr-2" }),
                " Select All & Post Now"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function UserIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:416", ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:416", d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
    /* @__PURE__ */ jsx("circle", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:416", cx: "12", cy: "7", r: "4" })
  ] });
}
function ClothesIcon(props) {
  return /* @__PURE__ */ jsx("svg", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:417", ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { "data-loc": "listing-generator\\client\\VirtualTryOnAgent.tsx:417", d: "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" }) });
}
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Root,
    {
      "data-loc": "client\\src\\components\\ui\\tabs.tsx:11",
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.List,
    {
      "data-loc": "client\\src\\components\\ui\\tabs.tsx:24",
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Trigger,
    {
      "data-loc": "client\\src\\components\\ui\\tabs.tsx:40",
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Content,
    {
      "data-loc": "client\\src\\components\\ui\\tabs.tsx:56",
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
function AdminAIStudio() {
  const [activeTab, setActiveTab] = useState("tryon");
  const [scannedImageUrl, setScannedImageUrl] = useState(null);
  const handleUseTryOnImage = (url) => {
    setScannedImageUrl(url);
    setActiveTab("agent");
  };
  return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:20", children: /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:21", className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:22", children: [
      /* @__PURE__ */ jsx("h1", { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:23", className: "font-serif text-2xl font-bold text-foreground", children: "AI Studio" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:24", className: "text-sm text-muted-foreground mt-1", children: "Accelerate your workflow with specialized AI tools." })
    ] }),
    /* @__PURE__ */ jsxs(Tabs, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:27", value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [
      /* @__PURE__ */ jsxs(TabsList, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:28", className: "bg-secondary/50 border-border p-1", children: [
        /* @__PURE__ */ jsxs(TabsTrigger, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:29", value: "tryon", className: "data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground", children: [
          /* @__PURE__ */ jsx(ScanFace, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:30", className: "w-4 h-4 mr-2" }),
          " Virtual Try-On"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:32", value: "designer", className: "data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Shirt, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:33", className: "w-4 h-4 mr-2" }),
          " Quick Designer"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:35", value: "agent", className: "data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Wand2, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:36", className: "w-4 h-4 mr-2" }),
          " SEO Listing Agent"
        ] }),
        /* @__PURE__ */ jsxs(TabsTrigger, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:38", value: "optimizer", className: "data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Image, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:39", className: "w-4 h-4 mr-2" }),
          " Image Optimizer"
        ] })
      ] }),
      /* @__PURE__ */ jsx(TabsContent, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:43", value: "tryon", className: "mt-6 border-none p-0 outline-none", children: /* @__PURE__ */ jsx(VirtualTryOnAgent, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:44", onUseImage: handleUseTryOnImage }) }),
      /* @__PURE__ */ jsx(TabsContent, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:47", value: "designer", className: "mt-6 border-none p-0 outline-none", children: /* @__PURE__ */ jsx(FashionDesignerStudio, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:48" }) }),
      /* @__PURE__ */ jsx(TabsContent, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:51", value: "agent", className: "mt-6 border-none p-0 outline-none", children: /* @__PURE__ */ jsx(AIProductAgent, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:52", initialImageUrl: scannedImageUrl, onClearInitialImage: () => setScannedImageUrl(null) }) }),
      /* @__PURE__ */ jsx(TabsContent, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:55", value: "optimizer", className: "mt-6 border-none p-0 outline-none", children: /* @__PURE__ */ jsx(AIImageOptimizer, { "data-loc": "listing-generator\\client\\AdminAIStudio.tsx:56" }) })
    ] })
  ] }) });
}
export {
  AdminAIStudio as default
};
