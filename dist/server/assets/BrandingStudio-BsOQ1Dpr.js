import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { forwardRef, useRef, useState, useCallback, useEffect, useImperativeHandle } from "react";
import { Link } from "wouter";
import { ArrowLeft, Info, Download, ChevronRight, ZoomIn, Trash2, Upload, Type, Dumbbell, Shirt, Layers, Palette, Star } from "lucide-react";
import { L as Label, I as Input } from "./label-C2k6QFV2.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BlbuqoI-.js";
import { T as Tooltip, a as TooltipTrigger, b as TooltipContent } from "../entry-server.js";
import * as fabric from "fabric";
import { S as SEOHead } from "./SEOHead-oEJRQGbs.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@trpc/react-query";
import "@tanstack/react-query";
import "@trpc/client";
import "react-dom/server";
import "react-helmet-async";
import "superjson";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
function buildStitchGuide(w, h, inset, labelStyle, accentColor = "rgba(150,130,100,0.5)") {
  const elements = [];
  if (labelStyle === "center-fold" || labelStyle === "loop-fold") {
    elements.push({
      type: "rect",
      id: "sg-top-gutter",
      left: 0,
      top: 0,
      width: w,
      height: inset,
      fill: "rgba(0,0,0,0.06)",
      selectable: false,
      evented: false,
      isStitchGuide: true
    });
  }
  elements.push({
    type: "rect",
    id: "sg-bottom-gutter",
    left: 0,
    top: h - inset,
    width: w,
    height: inset,
    fill: "rgba(0,0,0,0.06)",
    selectable: false,
    evented: false,
    isStitchGuide: true
  });
  elements.push({
    type: "rect",
    id: "sg-left-gutter",
    left: 0,
    top: inset,
    width: inset,
    height: h - inset * 2,
    fill: "rgba(0,0,0,0.06)",
    selectable: false,
    evented: false,
    isStitchGuide: true
  });
  elements.push({
    type: "rect",
    id: "sg-right-gutter",
    left: w - inset,
    top: inset,
    width: inset,
    height: h - inset * 2,
    fill: "rgba(0,0,0,0.06)",
    selectable: false,
    evented: false,
    isStitchGuide: true
  });
  elements.push(
    { type: "line", id: "sg-stitch-top", x1: inset, y1: inset, x2: w - inset, y2: inset, stroke: accentColor, strokeWidth: 1.2, strokeDashArray: [6, 5], selectable: false, evented: false, isStitchGuide: true },
    { type: "line", id: "sg-stitch-bottom", x1: inset, y1: h - inset, x2: w - inset, y2: h - inset, stroke: accentColor, strokeWidth: 1.2, strokeDashArray: [6, 5], selectable: false, evented: false, isStitchGuide: true },
    { type: "line", id: "sg-stitch-left", x1: inset, y1: inset, x2: inset, y2: h - inset, stroke: accentColor, strokeWidth: 1.2, strokeDashArray: [6, 5], selectable: false, evented: false, isStitchGuide: true },
    { type: "line", id: "sg-stitch-right", x1: w - inset, y1: inset, x2: w - inset, y2: h - inset, stroke: accentColor, strokeWidth: 1.2, strokeDashArray: [6, 5], selectable: false, evented: false, isStitchGuide: true }
  );
  if (labelStyle === "center-fold" || labelStyle === "loop-fold") {
    elements.push({
      type: "rect",
      id: "sg-fold-line",
      left: 0,
      top: h / 2,
      width: w,
      height: 1.5,
      fill: "rgba(0,0,0,0.12)",
      selectable: false,
      evented: false,
      isStitchGuide: true
    });
  }
  if (labelStyle === "end-fold" || labelStyle === "mitre-fold") {
    elements.push({
      type: "rect",
      id: "sg-left-flap",
      left: 0,
      top: 0,
      width: inset * 1.5,
      height: h,
      fill: "rgba(0,0,0,0.07)",
      selectable: false,
      evented: false,
      isStitchGuide: true
    }, {
      type: "rect",
      id: "sg-right-flap",
      left: w - inset * 1.5,
      top: 0,
      width: inset * 1.5,
      height: h,
      fill: "rgba(0,0,0,0.07)",
      selectable: false,
      evented: false,
      isStitchGuide: true
    });
  }
  return elements;
}
const TPL_CENTER_FOLD_FASHION = {
  id: "cf-fashion",
  name: "Fashion Neck Label",
  subtitle: "Center Fold",
  labelStyle: "center-fold",
  industry: "Fashion",
  width: 220,
  height: 480,
  backgroundColor: "#f5f0e8",
  previewGradient: "linear-gradient(145deg,#f5f0e8,#d4af37)",
  accentColor: "#1a1208",
  elements: [
    { type: "text", id: "brand-name", text: "YOUR BRAND", left: 110, top: 80, fontSize: 22, fontFamily: "Playfair Display", fontWeight: "bold", fill: "#1a1208", textAlign: "center", charSpacing: 100 },
    { type: "rect", id: "gold-line", left: 30, top: 115, width: 160, height: 1, fill: "#c9a84c", selectable: true },
    { type: "text", id: "size", text: "M", left: 110, top: 128, fontSize: 36, fontFamily: "Inter", fontWeight: "700", fill: "#1a1208", textAlign: "center" },
    { type: "rect", id: "gold-line-2", left: 30, top: 178, width: 160, height: 1, fill: "#c9a84c", selectable: true },
    { type: "text", id: "composition", text: "100% COTTON", left: 110, top: 193, fontSize: 9, fontFamily: "Inter", fontWeight: "normal", fill: "#555", textAlign: "center", charSpacing: 300 },
    { type: "text", id: "origin", text: "MADE IN PAKISTAN", left: 110, top: 210, fontSize: 8, fontFamily: "Inter", fill: "#888", textAlign: "center", charSpacing: 300 },
    // Repeat block for second panel (below fold)
    { type: "text", id: "brand-name-2", text: "YOUR BRAND", left: 110, top: 272, fontSize: 22, fontFamily: "Playfair Display", fontWeight: "bold", fill: "#1a1208", textAlign: "center", charSpacing: 100 },
    { type: "text", id: "website", text: "www.yourbrand.com", left: 110, top: 315, fontSize: 8, fontFamily: "Inter", fill: "#aaa", textAlign: "center" },
    { type: "text", id: "care-hint", text: "← Drag care icons here", left: 110, top: 360, fontSize: 8, fontFamily: "Inter", fill: "rgba(0,0,0,0.2)", textAlign: "center" }
  ]
};
const TPL_END_FOLD_PREMIUM = {
  id: "ef-premium",
  name: "Premium Flat Label",
  subtitle: "End Fold",
  labelStyle: "end-fold",
  industry: "Luxury",
  width: 480,
  height: 260,
  backgroundColor: "#111111",
  previewGradient: "linear-gradient(145deg,#111,#d4af37)",
  accentColor: "#d4af37",
  elements: [
    { type: "text", id: "brand-name", text: "MAISON BRAND", left: 240, top: 70, fontSize: 28, fontFamily: "Playfair Display", fontWeight: "bold", fill: "#d4af37", textAlign: "center", charSpacing: 300 },
    { type: "rect", id: "gold-line", left: 80, top: 112, width: 320, height: 0.8, fill: "#d4af37", selectable: true },
    { type: "text", id: "size", text: "SIZE  L", left: 240, top: 124, fontSize: 14, fontFamily: "Inter", fontWeight: "600", fill: "rgba(255,255,255,0.85)", textAlign: "center", charSpacing: 500 },
    { type: "text", id: "composition", text: "100% MERCERIZED COTTON", left: 240, top: 150, fontSize: 9, fontFamily: "Inter", fill: "rgba(255,255,255,0.45)", textAlign: "center", charSpacing: 400 },
    { type: "text", id: "origin", text: "HANDCRAFTED IN PAKISTAN", left: 240, top: 168, fontSize: 9, fontFamily: "Inter", fill: "rgba(255,255,255,0.3)", textAlign: "center", charSpacing: 400 },
    { type: "text", id: "website", text: "WWW.MAISONBRAND.COM", left: 240, top: 188, fontSize: 8, fontFamily: "Inter", fill: "rgba(212,175,55,0.4)", textAlign: "center", charSpacing: 350 }
  ]
};
const TPL_STRAIGHT_SPORT = {
  id: "sc-sport",
  name: "Sportswear Label",
  subtitle: "Straight Cut",
  labelStyle: "straight-cut",
  industry: "Sport",
  width: 440,
  height: 280,
  backgroundColor: "#0a0a0a",
  previewGradient: "linear-gradient(145deg,#0a0a0a,#aaff00)",
  accentColor: "#aaff00",
  elements: [
    { type: "rect", id: "neon-bar", left: 0, top: 0, width: 6, height: 280, fill: "#aaff00", selectable: false, evented: false },
    { type: "text", id: "brand-name", text: "SPORT", left: 220, top: 55, fontSize: 52, fontFamily: "Impact", fill: "#ffffff", textAlign: "center", charSpacing: 150 },
    { type: "rect", id: "neon-line", left: 26, top: 120, width: 392, height: 1.5, fill: "#aaff00", selectable: true },
    { type: "text", id: "size", text: "SIZE  XL", left: 220, top: 132, fontSize: 14, fontFamily: "Barlow Condensed", fontWeight: "700", fill: "rgba(255,255,255,0.75)", textAlign: "center", charSpacing: 500 },
    { type: "text", id: "specs", text: "MOISTURE WICKING  ·  UV PROTECTION", left: 220, top: 158, fontSize: 9, fontFamily: "Inter", fill: "rgba(170,255,0,0.6)", textAlign: "center", charSpacing: 300 },
    { type: "text", id: "composition", text: "88% POLYESTER  12% ELASTANE  ·  MADE IN PAKISTAN", left: 220, top: 178, fontSize: 8.5, fontFamily: "Inter", fill: "rgba(255,255,255,0.3)", textAlign: "center", charSpacing: 200 },
    { type: "text", id: "website", text: "WWW.SPORTBRAND.COM", left: 220, top: 210, fontSize: 8, fontFamily: "Inter", fill: "rgba(170,255,0,0.3)", textAlign: "center", charSpacing: 350 }
  ]
};
const TPL_PATCH_DENIM = {
  id: "wp-denim",
  name: "Denim Patch Label",
  subtitle: "Woven Patch",
  labelStyle: "woven-patch",
  industry: "Denim",
  width: 520,
  height: 340,
  backgroundColor: "#c49a6c",
  previewGradient: "linear-gradient(145deg,#c49a6c,#5c3a1e)",
  accentColor: "#3a2010",
  elements: [
    // Warm leather texture overlay tints
    { type: "rect", id: "leather-top", left: 0, top: 0, width: 520, height: 90, fill: "rgba(90,50,20,0.12)", selectable: false, evented: false },
    { type: "rect", id: "leather-bottom", left: 0, top: 250, width: 520, height: 90, fill: "rgba(90,50,20,0.12)", selectable: false, evented: false },
    // Brand — big embossed serif
    { type: "text", id: "brand-name", text: "RUGGED CO.", left: 260, top: 65, fontSize: 44, fontFamily: "Playfair Display", fontWeight: "bold", fill: "#3a2010", textAlign: "center", charSpacing: 200 },
    // Est. line
    { type: "text", id: "est", text: "— EST. 2024 —", left: 260, top: 120, fontSize: 11, fontFamily: "Inter", fontWeight: "600", fill: "rgba(58,32,16,0.55)", textAlign: "center", charSpacing: 500 },
    // Waist × Inseam — large bold
    { type: "text", id: "waist-size", text: "W 32  ×  L 30", left: 260, top: 155, fontSize: 30, fontFamily: "Barlow Condensed", fontWeight: "700", fill: "#2a1508", textAlign: "center", charSpacing: 200 },
    // Thin dark divider
    { type: "rect", id: "divider", left: 60, top: 200, width: 400, height: 1, fill: "rgba(58,32,16,0.25)", selectable: true },
    // Composition
    { type: "text", id: "composition", text: "100% RING-SPUN COTTON DENIM", left: 260, top: 215, fontSize: 10, fontFamily: "Inter", fill: "rgba(58,32,16,0.55)", textAlign: "center", charSpacing: 350 },
    // Origin
    { type: "text", id: "origin", text: "HANDCRAFTED IN SIALKOT, PAKISTAN", left: 260, top: 238, fontSize: 9, fontFamily: "Inter", fill: "rgba(58,32,16,0.4)", textAlign: "center", charSpacing: 400 },
    // Website
    { type: "text", id: "website", text: "WWW.RUGGEDCO.COM", left: 260, top: 272, fontSize: 8.5, fontFamily: "Inter", fill: "rgba(58,32,16,0.3)", textAlign: "center", charSpacing: 400 }
  ]
};
const TPL_CARE_STRIP = {
  id: "cs-standard",
  name: "Care & Composition",
  subtitle: "Side Seam Strip",
  labelStyle: "care-strip",
  industry: "All Apparel",
  width: 240,
  height: 520,
  backgroundColor: "#ffffff",
  previewGradient: "linear-gradient(145deg,#ffffff,#2563eb)",
  accentColor: "#1a1a1a",
  elements: [
    { type: "text", id: "brand-name", text: "BRAND", left: 120, top: 42, fontSize: 15, fontFamily: "Inter", fontWeight: "bold", fill: "#111", textAlign: "center", charSpacing: 400 },
    { type: "rect", id: "top-line", left: 20, top: 62, width: 200, height: 0.8, fill: "#ccc", selectable: true },
    { type: "text", id: "care-title", text: "CARE INSTRUCTIONS", left: 120, top: 74, fontSize: 7.5, fontFamily: "Inter", fontWeight: "bold", fill: "#333", textAlign: "center", charSpacing: 350 },
    // Care icons drop zone — 5 placeholder boxes
    { type: "text", id: "care-icons-hint", text: "← Drop care icons here", left: 120, top: 150, fontSize: 8, fontFamily: "Inter", fill: "rgba(0,0,0,0.2)", textAlign: "center" },
    // Boxes for icons
    { type: "rect", id: "icon-box-1", left: 18, top: 88, width: 34, height: 34, rx: 3, fill: "#f0f0f0", stroke: "#ddd", strokeWidth: 1, selectable: true },
    { type: "rect", id: "icon-box-2", left: 58, top: 88, width: 34, height: 34, rx: 3, fill: "#f0f0f0", stroke: "#ddd", strokeWidth: 1, selectable: true },
    { type: "rect", id: "icon-box-3", left: 98, top: 88, width: 34, height: 34, rx: 3, fill: "#f0f0f0", stroke: "#ddd", strokeWidth: 1, selectable: true },
    { type: "rect", id: "icon-box-4", left: 138, top: 88, width: 34, height: 34, rx: 3, fill: "#f0f0f0", stroke: "#ddd", strokeWidth: 1, selectable: true },
    { type: "rect", id: "icon-box-5", left: 178, top: 88, width: 34, height: 34, rx: 3, fill: "#f0f0f0", stroke: "#ddd", strokeWidth: 1, selectable: true },
    { type: "rect", id: "divider", left: 20, top: 178, width: 200, height: 0.8, fill: "#ccc", selectable: true },
    { type: "text", id: "composition", text: "FIBER CONTENT", left: 120, top: 192, fontSize: 7.5, fontFamily: "Inter", fontWeight: "bold", fill: "#333", textAlign: "center", charSpacing: 350 },
    { type: "text", id: "fiber", text: "100% COTTON", left: 120, top: 206, fontSize: 11, fontFamily: "Inter", fontWeight: "normal", fill: "#111", textAlign: "center" },
    { type: "rect", id: "divider-2", left: 20, top: 232, width: 200, height: 0.8, fill: "#ccc", selectable: true },
    { type: "text", id: "origin-title", text: "COUNTRY OF ORIGIN", left: 120, top: 245, fontSize: 7.5, fontFamily: "Inter", fontWeight: "bold", fill: "#333", textAlign: "center", charSpacing: 350 },
    { type: "text", id: "origin", text: "MADE IN PAKISTAN", left: 120, top: 260, fontSize: 11, fontFamily: "Inter", fill: "#111", textAlign: "center", charSpacing: 200 },
    { type: "rect", id: "divider-3", left: 20, top: 288, width: 200, height: 0.8, fill: "#ccc", selectable: true },
    { type: "text", id: "website", text: "www.yourbrand.com", left: 120, top: 305, fontSize: 9, fontFamily: "Inter", fill: "#aaa", textAlign: "center" },
    { type: "text", id: "reg-text", text: "RN# 12345678", left: 120, top: 325, fontSize: 8, fontFamily: "Inter", fill: "#ccc", textAlign: "center" }
  ]
};
const TPL_LOOP_CAP = {
  id: "lf-cap",
  name: "Cap & Hat Label",
  subtitle: "Loop Fold",
  labelStyle: "loop-fold",
  industry: "Headwear",
  width: 220,
  height: 520,
  backgroundColor: "#1a1a1a",
  previewGradient: "linear-gradient(145deg,#1a1a1a,#c0392b)",
  accentColor: "#c0392b",
  elements: [
    { type: "rect", id: "red-top", left: 0, top: 0, width: 220, height: 8, fill: "#c0392b", selectable: false, evented: false },
    { type: "text", id: "brand-name", text: "CAPS CO.", left: 110, top: 58, fontSize: 22, fontFamily: "Impact", fill: "#ffffff", textAlign: "center", charSpacing: 200 },
    { type: "rect", id: "red-line", left: 20, top: 92, width: 180, height: 2, fill: "#c0392b", selectable: true },
    { type: "text", id: "tagline", text: "AUTHENTIC HEADWEAR", left: 110, top: 103, fontSize: 8.5, fontFamily: "Inter", fontWeight: "bold", fill: "rgba(255,255,255,0.5)", textAlign: "center", charSpacing: 400 },
    { type: "text", id: "size", text: "S/M", left: 110, top: 128, fontSize: 32, fontFamily: "Barlow Condensed", fontWeight: "700", fill: "#ffffff", textAlign: "center", charSpacing: 100 },
    { type: "rect", id: "divider", left: 20, top: 175, width: 180, height: 0.8, fill: "rgba(255,255,255,0.15)", selectable: true },
    { type: "text", id: "composition", text: "100% BRUSHED COTTON", left: 110, top: 190, fontSize: 8.5, fontFamily: "Inter", fill: "rgba(255,255,255,0.5)", textAlign: "center", charSpacing: 300 },
    { type: "text", id: "origin", text: "MADE IN PAKISTAN", left: 110, top: 208, fontSize: 8, fontFamily: "Inter", fill: "rgba(255,255,255,0.3)", textAlign: "center", charSpacing: 400 },
    // Second panel (below fold line at y=260)
    { type: "text", id: "brand-name-2", text: "CAPS CO.", left: 110, top: 300, fontSize: 22, fontFamily: "Impact", fill: "#c0392b", textAlign: "center", charSpacing: 200 },
    { type: "text", id: "website", text: "www.capsco.com", left: 110, top: 336, fontSize: 9, fontFamily: "Inter", fill: "rgba(255,255,255,0.25)", textAlign: "center" },
    { type: "text", id: "care-hint", text: "← Care icons area", left: 110, top: 385, fontSize: 8, fontFamily: "Inter", fill: "rgba(255,255,255,0.12)", textAlign: "center" }
  ]
};
const TPL_MITRE_SHIRT = {
  id: "mf-shirt",
  name: "Dress Shirt Label",
  subtitle: "Mitre Fold",
  labelStyle: "mitre-fold",
  industry: "Formal",
  width: 440,
  height: 260,
  backgroundColor: "#f9f8f6",
  previewGradient: "linear-gradient(145deg,#f9f8f6,#1a1a1a)",
  accentColor: "#1a1a1a",
  elements: [
    { type: "text", id: "brand-name", text: "ATELIER BRAND", left: 220, top: 72, fontSize: 26, fontFamily: "Playfair Display", fontWeight: "bold", fill: "#1a1208", textAlign: "center", charSpacing: 200 },
    { type: "rect", id: "black-line", left: 70, top: 112, width: 300, height: 1, fill: "#333", selectable: true },
    { type: "text", id: "collection", text: "FORMAL COLLECTION", left: 220, top: 125, fontSize: 10, fontFamily: "Inter", fontWeight: "300", fill: "#777", textAlign: "center", charSpacing: 600 },
    { type: "text", id: "size", text: "41 / 16", left: 220, top: 148, fontSize: 20, fontFamily: "Inter", fontWeight: "bold", fill: "#1a1208", textAlign: "center", charSpacing: 200 },
    { type: "rect", id: "black-line-2", left: 70, top: 178, width: 300, height: 0.5, fill: "#ccc", selectable: true },
    { type: "text", id: "composition", text: "100% SUPIMA COTTON  ·  MACHINE WASH 40°C", left: 220, top: 190, fontSize: 8.5, fontFamily: "Inter", fill: "#888", textAlign: "center", charSpacing: 300 },
    { type: "text", id: "origin", text: "TAILORED IN PAKISTAN", left: 220, top: 208, fontSize: 8.5, fontFamily: "Inter", fill: "#aaa", textAlign: "center", charSpacing: 400 }
  ]
};
const WOVEN_TEMPLATES = [
  TPL_CENTER_FOLD_FASHION,
  TPL_END_FOLD_PREMIUM,
  TPL_STRAIGHT_SPORT,
  TPL_PATCH_DENIM,
  TPL_CARE_STRIP,
  TPL_LOOP_CAP,
  TPL_MITRE_SHIRT
];
const PADDING = 0.88;
const FabricEditor = forwardRef(
  ({ template, onSelectionChange, onBackgroundColorChange }, ref) => {
    const canvasEl = useRef(null);
    const containerEl = useRef(null);
    const [fc, setFc] = useState(null);
    const templateRef = useRef(null);
    const fitLayout = useCallback((canvas, tpl) => {
      if (!containerEl.current) return;
      const { clientWidth: cw, clientHeight: ch } = containerEl.current;
      if (!cw || !ch) return;
      const zoom = Math.min(cw / tpl.width * PADDING, ch / tpl.height * PADDING);
      canvas.setDimensions({ width: cw, height: ch });
      canvas.setZoom(zoom);
      const vpt = canvas.viewportTransform;
      vpt[4] = (cw - tpl.width * zoom) / 2;
      vpt[5] = (ch - tpl.height * zoom) / 2;
      canvas.requestRenderAll();
    }, []);
    useEffect(() => {
      if (!canvasEl.current) return;
      const canvas = new fabric.Canvas(canvasEl.current, {
        preserveObjectStacking: true,
        selection: true
      });
      const onSel = () => onSelectionChange?.(canvas.getActiveObject() || null);
      canvas.on("selection:created", onSel);
      canvas.on("selection:updated", onSel);
      canvas.on("selection:cleared", onSel);
      setFc(canvas);
      return () => {
        canvas.dispose();
      };
    }, []);
    useEffect(() => {
      if (!fc || !template) return;
      templateRef.current = template;
      fc.clear();
      fc.backgroundColor = template.backgroundColor;
      const load = async () => {
        if (template.backgroundImage) {
          try {
            const img = await fabric.FabricImage.fromURL(template.backgroundImage, { crossOrigin: "anonymous" });
            img.set({ left: 0, top: 0, selectable: false, evented: false });
            img.scaleX = template.width / (img.width || template.width);
            img.scaleY = template.height / (img.height || template.height);
            img.opacity = 0.4;
            fc.add(img);
            fc.sendObjectToBack(img);
          } catch {
          }
        }
        template.elements.forEach((el) => addElement(fc, el));
        const stitchGuide = buildStitchGuide(
          template.width,
          template.height,
          22,
          template.labelStyle,
          getStitchColor(template.backgroundColor)
        );
        stitchGuide.forEach((el) => addElement(fc, el));
        fitLayout(fc, template);
        fc.renderAll();
      };
      load();
      const handleResize = () => {
        if (templateRef.current) fitLayout(fc, templateRef.current);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [fc, template, fitLayout]);
    useImperativeHandle(ref, () => ({
      exportDesign: () => {
        if (!fc || !templateRef.current) return null;
        const tpl = templateRef.current;
        const origZoom = fc.getZoom();
        const origVpt = [...fc.viewportTransform];
        fc.setDimensions({ width: tpl.width, height: tpl.height });
        fc.setZoom(1);
        fc.viewportTransform = [1, 0, 0, 1, 0, 0];
        fc.renderAll();
        const url = fc.toDataURL({ format: "png", quality: 1, multiplier: 2 });
        fc.setZoom(origZoom);
        fc.viewportTransform = origVpt;
        if (containerEl.current) fc.setDimensions({ width: containerEl.current.clientWidth, height: containerEl.current.clientHeight });
        fc.renderAll();
        return url;
      },
      addImageFromDataUrl: async (dataUrl) => {
        if (!fc || !templateRef.current) return;
        const tpl = templateRef.current;
        try {
          const img = await fabric.FabricImage.fromURL(dataUrl);
          if (img.width && img.height) {
            const maxSz = Math.min(tpl.width, tpl.height) * 0.32;
            const scale = Math.min(maxSz / img.width, maxSz / img.height);
            img.scale(scale);
          }
          img.set({ left: tpl.width / 2, top: tpl.height / 2, originX: "center", originY: "center" });
          fc.add(img);
          fc.setActiveObject(img);
          fc.renderAll();
        } catch (e) {
          console.error(e);
        }
      },
      updateSelectedText: (text, color, fontFamily) => {
        if (!fc) return;
        const obj = fc.getActiveObject();
        if (obj?.type === "i-text") {
          const t = obj;
          if (text !== void 0) t.set("text", text);
          if (color) t.set("fill", color);
          if (fontFamily) t.set("fontFamily", fontFamily);
          fc.renderAll();
        }
      },
      changeBackgroundColor: (color) => {
        if (!fc) return;
        fc.backgroundColor = color;
        fc.renderAll();
        onBackgroundColorChange?.(color);
      },
      deleteSelected: () => {
        if (!fc) return;
        const obj = fc.getActiveObject();
        if (obj && !("isStitchGuide" in obj && obj.isStitchGuide)) {
          fc.remove(obj);
          fc.discardActiveObject();
          fc.renderAll();
        }
      }
    }));
    return /* @__PURE__ */ jsxs(
      "div",
      {
        "data-loc": "client\\src\\components\\branding\\FabricEditor.tsx:162",
        ref: containerEl,
        className: "w-full h-full relative overflow-hidden",
        style: {
          backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
          backgroundColor: "#e8e8e8"
        },
        children: [
          /* @__PURE__ */ jsx("canvas", { "data-loc": "client\\src\\components\\branding\\FabricEditor.tsx:173", ref: canvasEl, className: "absolute inset-0" }),
          !template && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\branding\\FabricEditor.tsx:175", className: "absolute inset-0 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm text-muted-foreground text-center p-8 z-10", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\branding\\FabricEditor.tsx:176", className: "text-4xl mb-4", children: "🔖" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\components\\branding\\FabricEditor.tsx:177", className: "font-semibold text-foreground", children: "Choose a label style to start designing" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\components\\branding\\FabricEditor.tsx:178", className: "text-sm mt-1", children: "Pick from 7 industry-standard woven label formats" })
          ] })
        ]
      }
    );
  }
);
FabricEditor.displayName = "FabricEditor";
function getStitchColor(bgColor) {
  const dark = isDarkColor$1(bgColor);
  return dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.28)";
}
function isDarkColor$1(hex) {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 < 128;
}
function addElement(canvas, el) {
  const common = {
    left: el.left || 0,
    top: el.top || 0,
    selectable: el.selectable !== void 0 ? el.selectable : !el.isStitchGuide,
    evented: el.evented !== void 0 ? el.evented : !el.isStitchGuide,
    opacity: el.opacity !== void 0 ? el.opacity : 1
  };
  let obj = null;
  if (el.type === "rect") {
    obj = new fabric.Rect({
      ...common,
      width: el.width || 100,
      height: el.height || 100,
      fill: el.fill || "transparent",
      stroke: el.stroke,
      strokeWidth: el.strokeWidth,
      strokeDashArray: el.strokeDashArray,
      rx: el.rx,
      ry: el.ry
    });
  } else if (el.type === "circle") {
    obj = new fabric.Circle({
      ...common,
      radius: (el.width || 30) / 2,
      originX: "center",
      originY: "center",
      fill: el.fill || "#000",
      stroke: el.stroke,
      strokeWidth: el.strokeWidth
    });
  } else if (el.type === "text") {
    obj = new fabric.IText(el.text || "Text", {
      ...common,
      fontSize: el.fontSize || 20,
      fontFamily: el.fontFamily || "Inter",
      fontWeight: el.fontWeight || "normal",
      fill: el.fill || "#000",
      textAlign: el.textAlign || "left",
      originX: el.textAlign === "center" ? "center" : "left",
      charSpacing: el.charSpacing || 0,
      lineHeight: el.lineHeight || 1.3
    });
  } else if (el.type === "line") {
    obj = new fabric.Line(
      [el.x1 || 0, el.y1 || 0, el.x2 || 0, el.y2 || 0],
      {
        selectable: el.selectable !== void 0 ? el.selectable : false,
        evented: el.evented !== void 0 ? el.evented : false,
        stroke: el.stroke || "#000",
        strokeWidth: el.strokeWidth || 1,
        strokeDashArray: el.strokeDashArray,
        opacity: el.opacity !== void 0 ? el.opacity : 1
      }
    );
  }
  if (obj) {
    obj.isStitchGuide = !!el.isStitchGuide;
    canvas.add(obj);
  }
}
const makeThumb = (content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60" width="80" height="60">${content}</svg>`;
const LABEL_STYLES = [
  {
    id: "center-fold",
    name: "Center Fold",
    subtitle: "Neck / Collar Label",
    description: "Folded at center top. Both raw ends hidden inside collar seam.",
    useCase: "T-shirts, shirts, jackets — sewn into collar",
    defaultWidth: 220,
    defaultHeight: 480,
    dimensions: "22 × 48 mm (unfolded)",
    stitchInset: 22,
    hasTopFold: true,
    hasEndFolds: false,
    thumbnailSvg: makeThumb(`
            <rect x="20" y="4" width="40" height="52" rx="2" fill="#f8f5ee" stroke="#bbb" stroke-width="1.2"/>
            <line x1="20" y1="28" x2="60" y2="28" stroke="#999" stroke-width="1.5" stroke-dasharray="2,2"/>
            <rect x="25" y="8" width="30" height="18" rx="1" fill="none" stroke="#c9a84c" stroke-width="0.8" stroke-dasharray="2,2"/>
            <rect x="25" y="32" width="30" height="20" rx="1" fill="none" stroke="#c9a84c" stroke-width="0.8" stroke-dasharray="2,2"/>
            <text x="40" y="20" text-anchor="middle" font-size="5" fill="#555" font-family="sans-serif" font-weight="bold">BRAND</text>
            <text x="40" y="45" text-anchor="middle" font-size="4" fill="#888" font-family="sans-serif">SIZE</text>
        `)
  },
  {
    id: "end-fold",
    name: "End Fold",
    subtitle: "High-End Sewn Label",
    description: "Left and right edges folded behind. Sewn flat on garment. No raw edges visible.",
    useCase: "Premium t-shirts, shirts sewn flat on inside hem",
    defaultWidth: 480,
    defaultHeight: 260,
    dimensions: "48 × 26 mm",
    stitchInset: 22,
    hasTopFold: false,
    hasEndFolds: true,
    thumbnailSvg: makeThumb(`
            <rect x="4" y="10" width="72" height="40" rx="2" fill="#f8f5ee" stroke="#bbb" stroke-width="1.2"/>
            <rect x="4" y="10" width="8" height="40" fill="#ecdcc8" stroke="#bbb" stroke-width="0.5"/>
            <rect x="68" y="10" width="8" height="40" fill="#ecdcc8" stroke="#bbb" stroke-width="0.5"/>
            <rect x="14" y="14" width="52" height="32" fill="none" stroke="#c9a84c" stroke-width="0.8" stroke-dasharray="2,2"/>
            <text x="40" y="27" text-anchor="middle" font-size="6" fill="#333" font-family="sans-serif" font-weight="bold">YOUR BRAND</text>
            <text x="40" y="37" text-anchor="middle" font-size="4" fill="#888" font-family="sans-serif">100% COTTON  ·  L</text>
        `)
  },
  {
    id: "straight-cut",
    name: "Straight Cut",
    subtitle: "Flat All-Purpose Label",
    description: "Simple rectangular label, all edges folded into seam. Most versatile format.",
    useCase: "Sewn into side seam, hem, or as exterior patch",
    defaultWidth: 440,
    defaultHeight: 280,
    dimensions: "44 × 28 mm",
    stitchInset: 22,
    hasTopFold: false,
    hasEndFolds: false,
    thumbnailSvg: makeThumb(`
            <rect x="6" y="8" width="68" height="44" rx="2" fill="#f8f5ee" stroke="#bbb" stroke-width="1.2"/>
            <rect x="12" y="14" width="56" height="32" fill="none" stroke="#999" stroke-width="0.8" stroke-dasharray="2,2"/>
            <text x="40" y="26" text-anchor="middle" font-size="6" fill="#333" font-family="sans-serif" font-weight="bold">BRAND</text>
            <text x="40" y="34" text-anchor="middle" font-size="4" fill="#888" font-family="sans-serif">100% COTTON · WASH 30°</text>
            <text x="40" y="42" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="sans-serif">MADE IN PAKISTAN</text>
        `)
  },
  {
    id: "woven-patch",
    name: "Woven Patch",
    subtitle: "Exterior Badge Label",
    description: "Sewn on the outside of the garment. Bold brand badge visible to consumers.",
    useCase: "Jeans back pocket, jacket sleeve, waistband",
    defaultWidth: 520,
    defaultHeight: 340,
    dimensions: "52 × 34 mm",
    stitchInset: 18,
    hasTopFold: false,
    hasEndFolds: false,
    thumbnailSvg: makeThumb(`
            <rect x="4" y="6" width="72" height="48" rx="3" fill="#1a1208" stroke="#c9a84c" stroke-width="1.5"/>
            <rect x="10" y="12" width="60" height="36" fill="none" stroke="#c9a84c" stroke-width="0.7" stroke-dasharray="2,2"/>
            <text x="40" y="30" text-anchor="middle" font-size="8" fill="#c9a84c" font-family="sans-serif" font-weight="bold">BRAND</text>
            <text x="40" y="40" text-anchor="middle" font-size="4" fill="#c9a84c" font-family="sans-serif" opacity="0.7">EST. 2024</text>
        `)
  },
  {
    id: "care-strip",
    name: "Care Strip",
    subtitle: "Side Seam Care Label",
    description: "Narrow vertical strip. Mandatory care, content, and origin information.",
    useCase: "Required legal care label sewn into side seam",
    defaultWidth: 240,
    defaultHeight: 520,
    dimensions: "24 × 52 mm",
    stitchInset: 18,
    hasTopFold: false,
    hasEndFolds: false,
    thumbnailSvg: makeThumb(`
            <rect x="28" y="2" width="24" height="56" rx="2" fill="#f8f5ee" stroke="#bbb" stroke-width="1.2"/>
            <rect x="32" y="6" width="16" height="48" fill="none" stroke="#999" stroke-width="0.7" stroke-dasharray="2,2"/>
            <text x="40" y="16" text-anchor="middle" font-size="4.5" fill="#333" font-family="sans-serif" font-weight="bold">CARE</text>
            <rect x="33" y="18" width="14" height="5" rx="1" fill="#ddd"/>
            <rect x="33" y="25" width="14" height="5" rx="1" fill="#ddd"/>
            <rect x="33" y="32" width="14" height="5" rx="1" fill="#ddd"/>
            <text x="40" y="46" text-anchor="middle" font-size="3.5" fill="#888" font-family="sans-serif">COTTON</text>
            <text x="40" y="52" text-anchor="middle" font-size="3" fill="#aaa" font-family="sans-serif">PAKISTAN</text>
        `)
  },
  {
    id: "loop-fold",
    name: "Loop Fold",
    subtitle: "Hat / Cap Label",
    description: "Center folded into a soft loop that protrudes from seam. No crease at top.",
    useCase: "Bucket hats, caps, beanies — interior loop label",
    defaultWidth: 220,
    defaultHeight: 520,
    dimensions: "22 × 52 mm (unfolded)",
    stitchInset: 22,
    hasTopFold: true,
    hasEndFolds: false,
    thumbnailSvg: makeThumb(`
            <path d="M30 14 Q40 4 50 14 L50 56 L30 56 Z" fill="#f8f5ee" stroke="#bbb" stroke-width="1.2"/>
            <rect x="33" y="18" width="14" height="35" fill="none" stroke="#c9a84c" stroke-width="0.7" stroke-dasharray="2,2"/>
            <text x="40" y="32" text-anchor="middle" font-size="5" fill="#333" font-family="sans-serif" font-weight="bold">BRAND</text>
            <text x="40" y="42" text-anchor="middle" font-size="3.5" fill="#888" font-family="sans-serif">SIZE L</text>
        `)
  },
  {
    id: "mitre-fold",
    name: "Mitre Fold",
    subtitle: "Premium Shirt Label",
    description: "Corners cut at 45° and folded. Creates clean triangular tabs sewn into seam.",
    useCase: "Dress shirts, trousers — sewn into collar or waistband",
    defaultWidth: 440,
    defaultHeight: 260,
    dimensions: "44 × 26 mm",
    stitchInset: 22,
    hasTopFold: false,
    hasEndFolds: true,
    thumbnailSvg: makeThumb(`
            <polygon points="4,10 16,10 76,10 76,50 16,50 4,50" fill="#f8f5ee" stroke="#bbb" stroke-width="1.2"/>
            <polygon points="4,10 14,10 14,50 4,50" fill="#e8dfd0"/>
            <polygon points="76,10 66,10 66,50 76,50" fill="#e8dfd0"/>
            <line x1="4" y1="10" x2="16" y2="25" stroke="#bbb" stroke-width="0.8"/>
            <line x1="4" y1="50" x2="16" y2="35" stroke="#bbb" stroke-width="0.8"/>
            <line x1="76" y1="10" x2="64" y2="25" stroke="#bbb" stroke-width="0.8"/>
            <line x1="76" y1="50" x2="64" y2="35" stroke="#bbb" stroke-width="0.8"/>
            <rect x="18" y="14" width="44" height="32" fill="none" stroke="#c9a84c" stroke-width="0.7" stroke-dasharray="2,2"/>
            <text x="40" y="28" text-anchor="middle" font-size="5.5" fill="#333" font-family="sans-serif" font-weight="bold">BRAND</text>
            <text x="40" y="38" text-anchor="middle" font-size="3.5" fill="#888" font-family="sans-serif">MADE IN PAKISTAN</text>
        `)
  }
];
const s = (paths, viewBox = "0 0 40 40") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
const TUB = `<path d="M4 18 Q4 30 20 30 Q36 30 36 18" stroke-width="2" /><line x1="4" y1="18" x2="36" y2="18" /><line x1="10" y1="12" x2="10" y2="18" /><line x1="30" y1="12" x2="30" y2="18" />`;
const TRIANGLE = `<polygon points="20,6 36,34 4,34" stroke-width="2"/>`;
const SQUARE = `<rect x="5" y="5" width="30" height="30" rx="2" stroke-width="2"/>`;
const CIRCLE = `<circle cx="20" cy="20" r="15" stroke-width="2"/>`;
const IRON_SHAPE = `<path d="M8 26 L8 22 Q8 18 20 18 L30 18 Q36 18 36 22 L36 26 Z"/><line x1="14" y1="14" x2="14" y2="18"/><path d="M14 14 Q14 10 20 10 Q26 10 26 14"/>`;
const X_MARK = `<line x1="10" y1="10" x2="30" y2="30" stroke-width="3"/><line x1="30" y1="10" x2="10" y2="30" stroke-width="3"/>`;
const DOT = `<circle cx="20" cy="20" r="3" fill="currentColor" stroke="none"/>`;
const HAND_WAVE = `<path d="M14 20 Q14 16 18 16 Q22 16 22 20 L22 26 Q22 28 20 28 Q18 28 18 26 L18 20" stroke-width="1.8"/>`;
const CARE_ICONS = [
  // ── Wash ──────────────────────────────────────────────────────────────────
  {
    id: "machine-wash-30",
    label: "Wash 30°C",
    category: "wash",
    svg: s(`${TUB}<text x="20" y="26" text-anchor="middle" font-size="9" fill="currentColor" stroke="none" font-family="Inter,sans-serif">30</text>`)
  },
  {
    id: "machine-wash-40",
    label: "Wash 40°C",
    category: "wash",
    svg: s(`${TUB}<text x="20" y="26" text-anchor="middle" font-size="9" fill="currentColor" stroke="none" font-family="Inter,sans-serif">40</text>`)
  },
  {
    id: "machine-wash-60",
    label: "Wash 60°C",
    category: "wash",
    svg: s(`${TUB}<text x="20" y="26" text-anchor="middle" font-size="9" fill="currentColor" stroke="none" font-family="Inter,sans-serif">60</text>`)
  },
  {
    id: "hand-wash",
    label: "Hand Wash",
    category: "wash",
    svg: s(`<path d="M4 18 Q4 30 20 30 Q36 30 36 18" /><line x1="4" y1="18" x2="36" y2="18" />${HAND_WAVE}`)
  },
  {
    id: "no-wash",
    label: "Do Not Wash",
    category: "wash",
    svg: s(`${TUB}${X_MARK}`)
  },
  // ── Bleach ────────────────────────────────────────────────────────────────
  {
    id: "bleach-ok",
    label: "Bleach OK",
    category: "bleach",
    svg: s(TRIANGLE)
  },
  {
    id: "no-bleach",
    label: "No Bleach",
    category: "bleach",
    svg: s(`${TRIANGLE}${X_MARK}`)
  },
  {
    id: "non-chlorine-bleach",
    label: "Non-Chlorine",
    category: "bleach",
    svg: s(`${TRIANGLE}<line x1="12" y1="22" x2="28" y2="32" stroke-width="2"/><line x1="12" y1="28" x2="22" y2="32" stroke-width="2"/>`)
  },
  // ── Drying ────────────────────────────────────────────────────────────────
  {
    id: "tumble-dry-low",
    label: "Tumble Dry Low",
    category: "dry",
    svg: s(`${SQUARE}${CIRCLE}${DOT}`)
  },
  {
    id: "tumble-dry-medium",
    label: "Tumble Dry Med",
    category: "dry",
    svg: s(`${SQUARE}${CIRCLE}<circle cx="16" cy="20" r="2" fill="currentColor" stroke="none"/><circle cx="24" cy="20" r="2" fill="currentColor" stroke="none"/>`)
  },
  {
    id: "no-tumble-dry",
    label: "No Tumble Dry",
    category: "dry",
    svg: s(`${SQUARE}${CIRCLE}${X_MARK}`)
  },
  {
    id: "line-dry",
    label: "Line Dry",
    category: "dry",
    svg: s(`${SQUARE}<line x1="10" y1="12" x2="30" y2="12" stroke-width="2.5"/><line x1="20" y1="12" x2="20" y2="28" stroke-width="2"/>`)
  },
  {
    id: "flat-dry",
    label: "Dry Flat",
    category: "dry",
    svg: s(`${SQUARE}<line x1="8" y1="20" x2="32" y2="20" stroke-width="2.5"/>`)
  },
  // ── Iron ─────────────────────────────────────────────────────────────────
  {
    id: "iron-low",
    label: "Iron Low (110°)",
    category: "iron",
    svg: s(`${IRON_SHAPE}${DOT}`)
  },
  {
    id: "iron-medium",
    label: "Iron Med (150°)",
    category: "iron",
    svg: s(`${IRON_SHAPE}<circle cx="16" cy="20" r="2" fill="currentColor" stroke="none"/><circle cx="24" cy="20" r="2" fill="currentColor" stroke="none"/>`)
  },
  {
    id: "iron-high",
    label: "Iron High (200°)",
    category: "iron",
    svg: s(`${IRON_SHAPE}<circle cx="14" cy="20" r="2" fill="currentColor" stroke="none"/><circle cx="20" cy="20" r="2" fill="currentColor" stroke="none"/><circle cx="26" cy="20" r="2" fill="currentColor" stroke="none"/>`)
  },
  {
    id: "no-iron",
    label: "Do Not Iron",
    category: "iron",
    svg: s(`${IRON_SHAPE}${X_MARK}`)
  },
  {
    id: "no-steam",
    label: "No Steam",
    category: "iron",
    svg: s(`${IRON_SHAPE}<path d="M16 12 Q16 9 18 10 Q18 7 20 8 Q20 5 22 6" stroke-width="1.5"/><line x1="12" y1="6" x2="30" y2="24" stroke-width="2.5"/>`)
  },
  // ── Dry Clean ────────────────────────────────────────────────────────────
  {
    id: "dry-clean",
    label: "Dry Clean",
    category: "dryclean",
    svg: s(`${CIRCLE}<text x="20" y="25" text-anchor="middle" font-size="14" fill="currentColor" stroke="none" font-family="serif">A</text>`)
  },
  {
    id: "dry-clean-p",
    label: "Dry Clean (P)",
    category: "dryclean",
    svg: s(`${CIRCLE}<text x="20" y="25" text-anchor="middle" font-size="14" fill="currentColor" stroke="none" font-family="serif">P</text>`)
  },
  {
    id: "no-dry-clean",
    label: "No Dry Clean",
    category: "dryclean",
    svg: s(`${CIRCLE}${X_MARK}`)
  }
];
function careIconToDataUrl(icon, color = "#1a1a1a", size = 60) {
  const svg = icon.svg.replace("currentColor", color).replace('width="40"', `width="${size}"`).replace('height="40"', `height="${size}"`);
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}
const TOOL_TABS = [
  { id: "style", label: "Style", icon: /* @__PURE__ */ jsx(Layers, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:23", className: "w-5 h-5" }) },
  { id: "color", label: "Color", icon: /* @__PURE__ */ jsx(Palette, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:24", className: "w-5 h-5" }) },
  { id: "logo", label: "Logo", icon: /* @__PURE__ */ jsx(Upload, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:25", className: "w-5 h-5" }) },
  { id: "text", label: "Text", icon: /* @__PURE__ */ jsx(Type, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:26", className: "w-5 h-5" }) },
  { id: "care", label: "Care", icon: /* @__PURE__ */ jsx(Star, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:27", className: "w-5 h-5" }) }
];
const INDUSTRY_ICONS = {
  "Fashion": /* @__PURE__ */ jsx(Shirt, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:31", className: "w-3.5 h-3.5" }),
  "Sport": /* @__PURE__ */ jsx(Dumbbell, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:32", className: "w-3.5 h-3.5" }),
  "Denim": /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:33", className: "text-xs", children: "👖" }),
  "Formal": /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:34", className: "text-xs", children: "👔" }),
  "Luxury": /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:35", className: "text-xs", children: "✦" }),
  "Headwear": /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:36", className: "text-xs", children: "🧢" }),
  "All Apparel": /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:37", className: "text-xs", children: "🏷️" })
};
const BG_PRESETS = [
  { label: "Ivory", value: "#f5f0e8" },
  { label: "Black", value: "#0d0d0d" },
  { label: "Navy", value: "#111827" },
  { label: "White", value: "#ffffff" },
  { label: "Cream", value: "#fdf8f0" },
  { label: "Khaki", value: "#c5b08a" },
  { label: "Slate", value: "#374151" },
  { label: "Wine", value: "#7c1d2e" },
  { label: "Forest", "value": "#1a3a2a" },
  { label: "Denim", value: "#1e2d40" },
  { label: "Red", value: "#c0392b" },
  { label: "Lime", value: "#14280a" }
];
const FONTS = [
  { label: "Inter (Clean)", value: "Inter" },
  { label: "Playfair (Luxury Serif)", value: "Playfair Display" },
  { label: "Barlow Condensed", value: "Barlow Condensed" },
  { label: "Impact (Bold/Sport)", value: "Impact" },
  { label: "Courier (Mono)", value: "Courier New" },
  { label: "Georgia (Classic)", value: "Georgia" }
];
const CARE_CATEGORIES = [
  { id: "wash", label: "Wash", color: "#2563eb" },
  { id: "bleach", label: "Bleach", color: "#d97706" },
  { id: "dry", label: "Dry", color: "#059669" },
  { id: "iron", label: "Iron", color: "#7c3aed" },
  { id: "dryclean", label: "Dry Clean", color: "#db2777" }
];
function BrandingStudio() {
  const editorRef = useRef(null);
  const [activeTemplate, setActiveTemplate] = useState(WOVEN_TEMPLATES[0]);
  const [activeLabelStyle, setActiveLabelStyle] = useState("center-fold");
  const [activeTab, setActiveTab] = useState("style");
  const [activeCare, setActiveCare] = useState("wash");
  const [bgColor, setBgColor] = useState(WOVEN_TEMPLATES[0].backgroundColor);
  const [selectedObj, setSelectedObj] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [textFont, setTextFont] = useState("Inter");
  const handleSelectionChange = (obj) => {
    setSelectedObj(obj);
    if (obj?.type === "i-text") {
      const t = obj;
      setTextContent(t.text || "");
      setTextColor(t.fill || "#000000");
      setTextFont(t.fontFamily || "Inter");
      setActiveTab("text");
    }
  };
  const handleSelectTemplate = (tpl) => {
    setActiveTemplate(tpl);
    setActiveLabelStyle(tpl.labelStyle);
    setBgColor(tpl.backgroundColor);
    setSelectedObj(null);
  };
  const handleBgColor = (color) => {
    setBgColor(color);
    editorRef.current?.changeBackgroundColor(color);
  };
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => editorRef.current?.addImageFromDataUrl(f.target?.result);
    reader.readAsDataURL(file);
  };
  const handleUpdateText = (text, color, font) => {
    editorRef.current?.updateSelectedText(text, color, font);
  };
  const handleAddCareIcon = async (iconId) => {
    const icon = CARE_ICONS.find((c) => c.id === iconId);
    if (!icon || !editorRef.current) return;
    const darkBg = isDarkColor(bgColor);
    const color = darkBg ? "#ffffff" : "#1a1a1a";
    const url = careIconToDataUrl(icon, color, 80);
    editorRef.current.addImageFromDataUrl(url);
  };
  const handleDownload = () => {
    const url = editorRef.current?.exportDesign();
    if (!url) return;
    const a = document.createElement("a");
    a.download = `woven-label-${activeTemplate.id}-${Date.now()}.png`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const styleTemplates = WOVEN_TEMPLATES.filter((t) => t.labelStyle === activeLabelStyle);
  const currentLabelStyleInfo = LABEL_STYLES.find((s2) => s2.id === activeLabelStyle);
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:148", className: "dark flex flex-col h-screen bg-[#111] text-foreground overflow-hidden select-none", children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        "data-loc": "client\\src\\pages\\BrandingStudio.tsx:149",
        title: "Woven Label Design Studio | Pak Homies Industry",
        description: "Design professional woven labels online — Center fold, end fold, patch, care strips and more. Download as PNG."
      }
    ),
    /* @__PURE__ */ jsxs("header", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:157", className: "flex-shrink-0 h-14 bg-[#1a1a1a] border-b border-white/10 flex items-center justify-between px-4 z-30", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:158", className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:159", href: "/", children: /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:160", className: "w-9 h-9 rounded-full flex items-center justify-center bg-white/8 hover:bg-white/15 transition-colors", children: /* @__PURE__ */ jsx(ArrowLeft, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:161", className: "w-4 h-4 text-white" }) }) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:164", className: "leading-tight", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:165", className: "text-sm font-bold text-white", children: "Woven Label Studio" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:166", className: "text-[10px] text-white/40 hidden sm:block", children: [
            currentLabelStyleInfo?.name,
            " · ",
            activeTemplate.width,
            "×",
            activeTemplate.height,
            "mm"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:172", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(Tooltip, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:174", children: [
          /* @__PURE__ */ jsx(TooltipTrigger, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:175", asChild: true, children: /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:176", className: "hidden lg:flex w-9 h-9 rounded-full items-center justify-center bg-white/8 hover:bg-white/15 transition-colors", children: /* @__PURE__ */ jsx(Info, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:177", className: "w-4 h-4 text-white/60" }) }) }),
          /* @__PURE__ */ jsx(TooltipContent, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:180", side: "bottom", className: "max-w-xs text-xs", children: /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:181", children: [
            /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:181", children: "How to use:" }),
            " Click a text element on the canvas to edit it. Drag elements to reposition. Use the tabs below to change style, color, add logos, care icons."
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            "data-loc": "client\\src\\pages\\BrandingStudio.tsx:184",
            onClick: handleDownload,
            className: "flex items-center gap-2 h-9 px-4 rounded-full bg-[#c9a84c] hover:bg-[#d4af37] text-black font-bold text-xs uppercase tracking-widest transition-all active:scale-95",
            children: [
              /* @__PURE__ */ jsx(Download, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:188", className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:189", className: "hidden sm:inline", children: "Download PNG" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:190", className: "sm:hidden", children: "Save" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:198", className: "flex-1 flex overflow-hidden", children: [
      /* @__PURE__ */ jsxs("aside", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:201", className: "hidden lg:flex w-80 flex-col bg-[#1a1a1a] border-r border-white/8 overflow-hidden z-20", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:203", className: "p-4 border-b border-white/8", children: [
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:204", className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3", children: "Label Type" }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:205", className: "space-y-1", children: LABEL_STYLES.map((style) => /* @__PURE__ */ jsxs(
            "button",
            {
              "data-loc": "client\\src\\pages\\BrandingStudio.tsx:207",
              onClick: () => {
                setActiveLabelStyle(style.id);
                const first = WOVEN_TEMPLATES.find((t) => t.labelStyle === style.id);
                if (first) handleSelectTemplate(first);
              },
              className: `w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group ${activeLabelStyle === style.id ? "bg-[#c9a84c]/20 border border-[#c9a84c]/40" : "hover:bg-white/5 border border-transparent"}`,
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "data-loc": "client\\src\\pages\\BrandingStudio.tsx:219",
                    className: "w-14 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-black/30 flex items-center justify-center",
                    dangerouslySetInnerHTML: { __html: style.thumbnailSvg }
                  }
                ),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:221", className: "min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:222", className: `text-xs font-bold leading-tight ${activeLabelStyle === style.id ? "text-[#c9a84c]" : "text-white"}`, children: style.name }),
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:225", className: "text-[10px] text-white/40 leading-tight truncate", children: style.subtitle }),
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:226", className: "text-[9px] text-white/25 mt-0.5", children: style.dimensions })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:228", className: `w-3.5 h-3.5 ml-auto flex-shrink-0 ${activeLabelStyle === style.id ? "text-[#c9a84c]" : "text-white/20 group-hover:text-white/40"}` })
              ]
            },
            style.id
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:235", className: "flex-1 overflow-y-auto p-4", children: [
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:236", className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3", children: "Presets" }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:237", className: "grid grid-cols-2 gap-2", children: (styleTemplates.length > 0 ? styleTemplates : WOVEN_TEMPLATES).map((tpl) => /* @__PURE__ */ jsxs(
            "button",
            {
              "data-loc": "client\\src\\pages\\BrandingStudio.tsx:239",
              onClick: () => handleSelectTemplate(tpl),
              className: `rounded-xl overflow-hidden border transition-all text-left group ${activeTemplate.id === tpl.id ? "border-[#c9a84c] ring-1 ring-[#c9a84c]/40" : "border-white/10 hover:border-white/30"}`,
              children: [
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:246", className: "h-16 relative", style: { background: tpl.previewGradient }, children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:248", className: "absolute top-1.5 left-1.5 flex items-center gap-1 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/50 text-white", children: INDUSTRY_ICONS[tpl.industry] }) }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:252", className: "p-2 bg-[#222] border-t border-white/5", children: [
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:253", className: "text-[10px] font-bold text-white leading-tight", children: tpl.name }),
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:254", className: "text-[9px] text-white/40", children: tpl.subtitle })
                ] })
              ]
            },
            tpl.id
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:263", className: "flex-1 flex flex-col overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:265", className: "hidden lg:flex items-center gap-1 px-4 py-2 bg-[#1a1a1a]/80 backdrop-blur border-b border-white/8 flex-shrink-0", children: [
          /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:266", className: "text-xs text-white/40 mr-2", children: [
            /* @__PURE__ */ jsx(ZoomIn, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:267", className: "w-3.5 h-3.5 inline mr-1 opacity-60" }),
            "Drag to move · Click text to edit · Drag to reposition"
          ] }),
          selectedObj && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:272", className: "w-px h-4 bg-white/15 mx-1" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                "data-loc": "client\\src\\pages\\BrandingStudio.tsx:273",
                onClick: () => editorRef.current?.deleteSelected(),
                className: "flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:275", className: "w-3.5 h-3.5" }),
                  " Delete element"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:282", className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsx(
          FabricEditor,
          {
            "data-loc": "client\\src\\pages\\BrandingStudio.tsx:283",
            ref: editorRef,
            template: activeTemplate,
            onSelectionChange: handleSelectionChange,
            onBackgroundColorChange: setBgColor
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:292", className: "flex-shrink-0 bg-[#1a1a1a] border-t border-white/10 z-20", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:294", className: "flex border-b border-white/8", children: TOOL_TABS.map((tab) => /* @__PURE__ */ jsxs(
            "button",
            {
              "data-loc": "client\\src\\pages\\BrandingStudio.tsx:296",
              onClick: () => setActiveTab(tab.id === activeTab ? activeTab : tab.id),
              className: `flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? "text-[#c9a84c] border-t-2 border-[#c9a84c] bg-[#c9a84c]/5" : "text-white/40 hover:text-white/70"}`,
              children: [
                tab.icon,
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:304", className: "hidden sm:block", children: tab.label })
              ]
            },
            tab.id
          )) }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:310", className: "max-h-60 lg:max-h-72 overflow-y-auto", children: [
            activeTab === "style" && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:314", className: "p-4", children: [
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:316", className: "lg:hidden mb-4", children: [
                /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:317", className: "text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-2", children: "Label Type" }),
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:318", className: "flex gap-2 overflow-x-auto pb-2 scrollbar-none", children: LABEL_STYLES.map((style) => /* @__PURE__ */ jsxs(
                  "button",
                  {
                    "data-loc": "client\\src\\pages\\BrandingStudio.tsx:320",
                    onClick: () => {
                      setActiveLabelStyle(style.id);
                      const first = WOVEN_TEMPLATES.find((t) => t.labelStyle === style.id);
                      if (first) handleSelectTemplate(first);
                    },
                    className: `flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-xl border w-[82px] transition-all ${activeLabelStyle === style.id ? "border-[#c9a84c] bg-[#c9a84c]/10" : "border-white/10 hover:border-white/20"}`,
                    children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          "data-loc": "client\\src\\pages\\BrandingStudio.tsx:331",
                          className: "w-12 h-9 rounded overflow-hidden bg-black/20",
                          dangerouslySetInnerHTML: { __html: style.thumbnailSvg.replace('width="80"', 'width="48"').replace('height="60"', 'height="36"') }
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:333", className: `text-[9px] font-bold text-center leading-tight ${activeLabelStyle === style.id ? "text-[#c9a84c]" : "text-white/60"}`, children: style.id === "center-fold" ? "Neck" : style.id === "end-fold" ? "EndFold" : style.id === "straight-cut" ? "Flat" : style.id === "woven-patch" ? "Patch" : style.id === "care-strip" ? "Care" : style.id === "loop-fold" ? "Cap" : "Mitre" })
                    ]
                  },
                  style.id
                )) })
              ] }),
              currentLabelStyleInfo && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:343", className: "p-3 rounded-xl bg-white/5 border border-white/8 mb-3", children: [
                /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:344", className: "text-xs font-bold text-white/80 mb-0.5", children: [
                  currentLabelStyleInfo.name,
                  " — ",
                  currentLabelStyleInfo.dimensions
                ] }),
                /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:345", className: "text-[10px] text-white/40 leading-relaxed", children: currentLabelStyleInfo.description }),
                /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:346", className: "text-[10px] text-[#c9a84c]/70 mt-1 font-semibold", children: [
                  "📍 ",
                  currentLabelStyleInfo.useCase
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:351", className: "text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-2", children: "Choose Preset" }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:352", className: "flex gap-2.5 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible scrollbar-none", children: (styleTemplates.length > 0 ? styleTemplates : WOVEN_TEMPLATES).map((tpl) => /* @__PURE__ */ jsxs(
                "button",
                {
                  "data-loc": "client\\src\\pages\\BrandingStudio.tsx:354",
                  onClick: () => handleSelectTemplate(tpl),
                  className: `flex-shrink-0 w-24 rounded-xl overflow-hidden border transition-all ${activeTemplate.id === tpl.id ? "border-[#c9a84c] ring-1 ring-[#c9a84c]/40" : "border-white/10 hover:border-white/30"}`,
                  children: [
                    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:361", className: "h-14 relative", style: { background: tpl.previewGradient }, children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:362", className: "absolute bottom-1.5 right-1.5 text-[7px] font-black uppercase tracking-wider px-1 py-0.5 rounded bg-black/50 text-white", children: tpl.industry }) }),
                    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:366", className: "py-1.5 px-2 bg-[#222]", children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:367", className: "text-[9px] font-bold text-white leading-tight", children: tpl.name }) })
                  ]
                },
                tpl.id
              )) })
            ] }),
            activeTab === "color" && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:377", className: "p-4", children: [
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:378", className: "text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-3", children: "Label Background Color" }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:380", className: "flex flex-wrap gap-2 mb-4", children: BG_PRESETS.map((p) => /* @__PURE__ */ jsxs(Tooltip, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:382", children: [
                /* @__PURE__ */ jsx(TooltipTrigger, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:383", asChild: true, children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    "data-loc": "client\\src\\pages\\BrandingStudio.tsx:384",
                    onClick: () => handleBgColor(p.value),
                    className: `w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 active:scale-95 ${bgColor === p.value ? "border-[#c9a84c] scale-110 shadow-lg shadow-black/50" : "border-white/20"}`,
                    style: { background: p.value }
                  }
                ) }),
                /* @__PURE__ */ jsx(TooltipContent, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:390", side: "top", children: /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:390", className: "text-xs", children: p.label }) })
              ] }, p.value)) }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:395", className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:396", className: "text-xs text-white/50 w-24 flex-shrink-0", children: "Custom hex:" }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:397", className: "flex gap-2 flex-1", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      "data-loc": "client\\src\\pages\\BrandingStudio.tsx:398",
                      type: "color",
                      value: bgColor,
                      onChange: (e) => handleBgColor(e.target.value),
                      className: "w-11 h-9 p-0.5 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      "data-loc": "client\\src\\pages\\BrandingStudio.tsx:401",
                      value: bgColor,
                      onChange: (e) => {
                        if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) handleBgColor(e.target.value);
                      },
                      className: "flex-1 bg-white/8 border-white/15 text-white font-mono uppercase text-xs h-9"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:407", className: "text-[10px] text-white/30 mt-3 leading-relaxed", children: "💡 This sets the woven fabric base color. Max 8 thread colors per label. For best quality, choose high-contrast combinations." })
            ] }),
            activeTab === "logo" && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:415", className: "p-4", children: [
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:416", className: "text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-3", children: "Upload Artwork / Logo" }),
              /* @__PURE__ */ jsxs("label", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:417", className: "flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-white/20 hover:border-[#c9a84c]/50 bg-white/4 cursor-pointer transition-all group", children: [
                /* @__PURE__ */ jsx(Upload, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:418", className: "w-8 h-8 text-white/30 group-hover:text-[#c9a84c]/60 transition-colors" }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:419", className: "text-center", children: [
                  /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:420", className: "text-sm font-semibold text-white/70", children: "Click to upload" }),
                  /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:421", className: "text-xs text-white/35 mt-0.5", children: "PNG, JPG, or SVG · Best: transparent PNG" })
                ] }),
                /* @__PURE__ */ jsx("input", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:423", type: "file", accept: "image/png,image/jpeg,image/svg+xml", className: "hidden", onChange: handleLogoUpload })
              ] }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:425", className: "text-[10px] text-white/30 mt-3 leading-relaxed", children: "After uploading, drag it to position and use the corner handles to resize. For woven labels, use bold, high-contrast logo files for best production result." })
            ] }),
            activeTab === "text" && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:433", className: "p-4", children: selectedObj?.type === "i-text" ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:435", className: "space-y-3", children: [
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:436", className: "text-[10px] font-black uppercase tracking-[0.15em] text-[#c9a84c]/80", children: "Editing Selected Text" }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:438", className: "space-y-1", children: [
                /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:439", className: "text-[10px] text-white/50 uppercase tracking-wider", children: "Text Content" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    "data-loc": "client\\src\\pages\\BrandingStudio.tsx:440",
                    value: textContent,
                    onChange: (e) => {
                      setTextContent(e.target.value);
                      handleUpdateText(e.target.value, textColor, textFont);
                    },
                    className: "bg-white/8 border-white/15 text-white text-sm h-9"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:445", className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:446", className: "space-y-1", children: [
                  /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:447", className: "text-[10px] text-white/50 uppercase tracking-wider", children: "Font" }),
                  /* @__PURE__ */ jsxs(Select, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:448", value: textFont, onValueChange: (v) => {
                    setTextFont(v);
                    handleUpdateText(textContent, textColor, v);
                  }, children: [
                    /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:449", className: "bg-white/8 border-white/15 text-white h-9 text-xs", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:450" }) }),
                    /* @__PURE__ */ jsx(SelectContent, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:452", children: FONTS.map((f) => /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:454", value: f.value, className: "text-xs", children: f.label }, f.value)) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:459", className: "space-y-1", children: [
                  /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:460", className: "text-[10px] text-white/50 uppercase tracking-wider", children: "Color" }),
                  /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:461", className: "flex gap-1.5", children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        "data-loc": "client\\src\\pages\\BrandingStudio.tsx:462",
                        type: "color",
                        value: textColor,
                        onChange: (e) => {
                          setTextColor(e.target.value);
                          handleUpdateText(textContent, e.target.value, textFont);
                        },
                        className: "w-9 h-9 p-0.5 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        "data-loc": "client\\src\\pages\\BrandingStudio.tsx:465",
                        value: textColor,
                        onChange: (e) => {
                          setTextColor(e.target.value);
                          handleUpdateText(textContent, e.target.value, textFont);
                        },
                        className: "flex-1 bg-white/8 border-white/15 text-white font-mono uppercase text-xs h-9 px-2"
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:472", className: "flex gap-1.5 flex-wrap", children: ["#ffffff", "#000000", "#d4af37", "#c9a84c", "#c0392b", "#2563eb", "#aaff00", "#b8732a", "#888888", "#f5f0e8"].map((c) => /* @__PURE__ */ jsx(
                "button",
                {
                  "data-loc": "client\\src\\pages\\BrandingStudio.tsx:474",
                  onClick: () => {
                    setTextColor(c);
                    handleUpdateText(textContent, c, textFont);
                  },
                  className: `w-7 h-7 rounded-full border-2 hover:scale-110 transition-all ${textColor === c ? "border-[#c9a84c] scale-110" : "border-white/20"}`,
                  style: { background: c }
                },
                c
              )) }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  "data-loc": "client\\src\\pages\\BrandingStudio.tsx:481",
                  onClick: () => editorRef.current?.deleteSelected(),
                  className: "flex items-center gap-2 text-xs text-red-400 hover:text-red-300 py-2 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(Trash2, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:483", className: "w-3.5 h-3.5" }),
                    " Remove this text element"
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:487", className: "flex flex-col items-center justify-center py-8 text-center text-white/30", children: [
              /* @__PURE__ */ jsx(Type, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:488", className: "w-10 h-10 mb-3 opacity-20" }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:489", className: "text-sm font-semibold text-white/50", children: "No text selected" }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:490", className: "text-xs mt-1", children: "👆 Tap any text on the label above to edit it here" })
            ] }) }),
            activeTab === "care" && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:498", className: "p-4", children: [
              /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:499", className: "text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-3", children: [
                "ISO 3758 Care Label Symbols",
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:501", className: "ml-1 font-normal text-white/25", children: "— tap to stamp on label" })
              ] }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:504", className: "flex gap-1.5 mb-3 overflow-x-auto scrollbar-none pb-1", children: CARE_CATEGORIES.map((cat) => /* @__PURE__ */ jsx(
                "button",
                {
                  "data-loc": "client\\src\\pages\\BrandingStudio.tsx:506",
                  onClick: () => setActiveCare(cat.id),
                  className: `flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${activeCare === cat.id ? "text-white border-transparent" : "border-white/15 text-white/40 hover:border-white/30"}`,
                  style: activeCare === cat.id ? { background: cat.color, borderColor: cat.color } : {},
                  children: cat.label
                },
                cat.id
              )) }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:519", className: "flex flex-wrap gap-2", children: CARE_ICONS.filter((i) => i.category === activeCare).map((icon) => /* @__PURE__ */ jsxs(Tooltip, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:521", children: [
                /* @__PURE__ */ jsx(TooltipTrigger, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:522", asChild: true, children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    "data-loc": "client\\src\\pages\\BrandingStudio.tsx:523",
                    onClick: () => handleAddCareIcon(icon.id),
                    className: "w-14 h-14 rounded-xl border border-white/15 bg-white/5 flex flex-col items-center justify-center hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/10 hover:scale-105 active:scale-95 transition-all",
                    children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:527", className: "w-9 h-9 text-white", dangerouslySetInnerHTML: { __html: icon.svg } })
                  }
                ) }),
                /* @__PURE__ */ jsx(TooltipContent, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:530", side: "top", className: "text-xs", children: icon.label })
              ] }, icon.id)) }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:534", className: "text-[10px] text-white/25 mt-3 leading-relaxed", children: "Icons appear in white on dark labels, black on light labels. Drag and resize after placing." })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("aside", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:544", className: "hidden xl:flex w-72 flex-col bg-[#1a1a1a] border-l border-white/8 overflow-y-auto", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:545", className: "p-4 border-b border-white/8", children: /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:546", className: "text-[10px] font-black uppercase tracking-[0.2em] text-white/40", children: "Properties" }) }),
        selectedObj?.type === "i-text" ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:550", className: "p-4 space-y-4", children: [
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:551", className: "text-xs font-bold text-[#c9a84c]", children: "Text Properties" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:552", className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:553", className: "text-[10px] text-white/50 uppercase tracking-wider", children: "Content" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "client\\src\\pages\\BrandingStudio.tsx:554",
                value: textContent,
                onChange: (e) => {
                  setTextContent(e.target.value);
                  handleUpdateText(e.target.value, textColor, textFont);
                },
                className: "bg-white/8 border-white/15 text-white text-sm h-9"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:558", className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:559", className: "text-[10px] text-white/50 uppercase tracking-wider", children: "Font" }),
            /* @__PURE__ */ jsxs(Select, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:560", value: textFont, onValueChange: (v) => {
              setTextFont(v);
              handleUpdateText(textContent, textColor, v);
            }, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:561", className: "bg-white/8 border-white/15 text-white h-9 text-xs", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:561" }) }),
              /* @__PURE__ */ jsx(SelectContent, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:562", children: FONTS.map((f) => /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:562", value: f.value, className: "text-xs", children: f.label }, f.value)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:565", className: "space-y-1", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:566", className: "text-[10px] text-white/50 uppercase tracking-wider", children: "Color" }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:567", className: "flex gap-2", children: [
              /* @__PURE__ */ jsx("input", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:568", type: "color", value: textColor, onChange: (e) => {
                setTextColor(e.target.value);
                handleUpdateText(textContent, e.target.value, textFont);
              }, className: "w-9 h-9 p-0.5 rounded border border-white/20 cursor-pointer bg-transparent" }),
              /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:569", value: textColor, onChange: (e) => {
                setTextColor(e.target.value);
                handleUpdateText(textContent, e.target.value, textFont);
              }, className: "flex-1 bg-white/8 border-white/15 text-white font-mono uppercase text-xs h-9" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:572", className: "flex flex-wrap gap-1.5 pt-1", children: ["#ffffff", "#000000", "#d4af37", "#c0392b", "#2563eb", "#aaff00", "#b8732a", "#888888"].map((c) => /* @__PURE__ */ jsx(
            "button",
            {
              "data-loc": "client\\src\\pages\\BrandingStudio.tsx:574",
              onClick: () => {
                setTextColor(c);
                handleUpdateText(textContent, c, textFont);
              },
              className: `w-7 h-7 rounded-full border-2 hover:scale-110 transition-all ${textColor === c ? "border-[#c9a84c] scale-110" : "border-white/20"}`,
              style: { background: c }
            },
            c
          )) }),
          /* @__PURE__ */ jsxs("button", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:579", onClick: () => editorRef.current?.deleteSelected(), className: "flex items-center gap-2 text-xs text-red-400 hover:text-red-300 mt-2 transition-colors", children: [
            /* @__PURE__ */ jsx(Trash2, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:580", className: "w-3.5 h-3.5" }),
            " Delete element"
          ] })
        ] }) : (
          // Background color when nothing selected
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:585", className: "p-4 space-y-4", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:586", className: "text-xs font-bold text-white/60", children: "Background Color" }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:587", className: "flex flex-wrap gap-2", children: BG_PRESETS.map((p) => /* @__PURE__ */ jsxs(Tooltip, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:589", children: [
              /* @__PURE__ */ jsx(TooltipTrigger, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:590", asChild: true, children: /* @__PURE__ */ jsx(
                "button",
                {
                  "data-loc": "client\\src\\pages\\BrandingStudio.tsx:591",
                  onClick: () => handleBgColor(p.value),
                  className: `w-8 h-8 rounded-lg border-2 hover:scale-110 transition-all ${bgColor === p.value ? "border-[#c9a84c] scale-110" : "border-white/20"}`,
                  style: { background: p.value }
                }
              ) }),
              /* @__PURE__ */ jsx(TooltipContent, { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:595", side: "top", children: /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:595", className: "text-xs", children: p.label }) })
            ] }, p.value)) }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:599", className: "flex gap-2", children: [
              /* @__PURE__ */ jsx("input", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:600", type: "color", value: bgColor, onChange: (e) => handleBgColor(e.target.value), className: "w-9 h-9 p-0.5 rounded border border-white/20 cursor-pointer bg-transparent" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  "data-loc": "client\\src\\pages\\BrandingStudio.tsx:601",
                  value: bgColor,
                  onChange: (e) => {
                    if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) handleBgColor(e.target.value);
                  },
                  className: "flex-1 bg-white/8 border-white/15 text-white font-mono uppercase text-xs h-9"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\BrandingStudio.tsx:604", className: "text-[10px] text-white/30 leading-relaxed mt-2", children: "💡 Click any text element on the canvas to edit it. Tap a care icon to stamp it directly onto the label." })
          ] })
        )
      ] })
    ] })
  ] });
}
function isDarkColor(hex) {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 < 128;
}
export {
  BrandingStudio as default
};
