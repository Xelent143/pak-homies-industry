import { LabelStyleId } from './labelStyles';
import { CARE_ICONS, careIconToDataUrl } from './careSymbols';

export type DesignType = 'hangtag' | 'polybag' | 'wovenlabel';

export interface TemplateElement {
    type: string;
    id: string;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    // Line coordinates (for type: 'line')
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDashArray?: number[];
    opacity?: number;
    rx?: number;
    ry?: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    fontStyle?: string;
    textAlign?: string;
    lineHeight?: number;
    charSpacing?: number;
    selectable?: boolean;
    evented?: boolean;
    isStitchGuide?: boolean;
}

export interface WovenTemplate {
    id: string;
    name: string;
    subtitle: string;
    labelStyle: LabelStyleId;
    industry: string;
    width: number;
    height: number;
    backgroundColor: string;          // fabric/thread base color
    previewGradient: string;          // CSS gradient for the card thumbnail
    accentColor: string;              // main brand color in the template
    backgroundImage?: string;         // optional realistic photo base
    elements: TemplateElement[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SEWING GUIDE LAYERS — injected by FabricEditor on top of any template
// These are the "dotted stitch lines" showing the sewing margin.
// Not editable by the user.
// ─────────────────────────────────────────────────────────────────────────────
export function buildStitchGuide(
    w: number,
    h: number,
    inset: number,
    labelStyle: LabelStyleId,
    accentColor = 'rgba(150,130,100,0.5)'
): TemplateElement[] {
    const elements: TemplateElement[] = [];

    // Outer gutter shading — top
    if (labelStyle === 'center-fold' || labelStyle === 'loop-fold') {
        elements.push({
            type: 'rect', id: 'sg-top-gutter',
            left: 0, top: 0, width: w, height: inset,
            fill: 'rgba(0,0,0,0.06)',
            selectable: false, evented: false, isStitchGuide: true,
        });
    }
    // Outer gutter — bottom
    elements.push({
        type: 'rect', id: 'sg-bottom-gutter',
        left: 0, top: h - inset, width: w, height: inset,
        fill: 'rgba(0,0,0,0.06)',
        selectable: false, evented: false, isStitchGuide: true,
    });
    // Left gutter
    elements.push({
        type: 'rect', id: 'sg-left-gutter',
        left: 0, top: inset, width: inset, height: h - inset * 2,
        fill: 'rgba(0,0,0,0.06)',
        selectable: false, evented: false, isStitchGuide: true,
    });
    // Right gutter
    elements.push({
        type: 'rect', id: 'sg-right-gutter',
        left: w - inset, top: inset, width: inset, height: h - inset * 2,
        fill: 'rgba(0,0,0,0.06)',
        selectable: false, evented: false, isStitchGuide: true,
    });

    // Stitch dash lines — 4 separate Line objects for clean corners
    elements.push(
        { type: 'line', id: 'sg-stitch-top', x1: inset, y1: inset, x2: w - inset, y2: inset, stroke: accentColor, strokeWidth: 1.2, strokeDashArray: [6, 5], selectable: false, evented: false, isStitchGuide: true },
        { type: 'line', id: 'sg-stitch-bottom', x1: inset, y1: h - inset, x2: w - inset, y2: h - inset, stroke: accentColor, strokeWidth: 1.2, strokeDashArray: [6, 5], selectable: false, evented: false, isStitchGuide: true },
        { type: 'line', id: 'sg-stitch-left', x1: inset, y1: inset, x2: inset, y2: h - inset, stroke: accentColor, strokeWidth: 1.2, strokeDashArray: [6, 5], selectable: false, evented: false, isStitchGuide: true },
        { type: 'line', id: 'sg-stitch-right', x1: w - inset, y1: inset, x2: w - inset, y2: h - inset, stroke: accentColor, strokeWidth: 1.2, strokeDashArray: [6, 5], selectable: false, evented: false, isStitchGuide: true },
    );

    // If center fold or loop fold — draw fold crease at top
    if (labelStyle === 'center-fold' || labelStyle === 'loop-fold') {
        elements.push({
            type: 'rect', id: 'sg-fold-line',
            left: 0, top: h / 2, width: w, height: 1.5,
            fill: 'rgba(0,0,0,0.12)',
            selectable: false, evented: false, isStitchGuide: true,
        });
    }

    // End fold / mitre — shade the end flaps
    if (labelStyle === 'end-fold' || labelStyle === 'mitre-fold') {
        elements.push({
            type: 'rect', id: 'sg-left-flap',
            left: 0, top: 0, width: inset * 1.5, height: h,
            fill: 'rgba(0,0,0,0.07)',
            selectable: false, evented: false, isStitchGuide: true,
        }, {
            type: 'rect', id: 'sg-right-flap',
            left: w - inset * 1.5, top: 0, width: inset * 1.5, height: h,
            fill: 'rgba(0,0,0,0.07)',
            selectable: false, evented: false, isStitchGuide: true,
        });
    }

    return elements;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1: Center Fold Neck Label — Fashion Brand
// Industry-standard collar label. Most iconic label position.
// ─────────────────────────────────────────────────────────────────────────────
export const TPL_CENTER_FOLD_FASHION: WovenTemplate = {
    id: 'cf-fashion',
    name: 'Fashion Neck Label',
    subtitle: 'Center Fold',
    labelStyle: 'center-fold',
    industry: 'Fashion',
    width: 220,
    height: 480,
    backgroundColor: '#f5f0e8',
    previewGradient: 'linear-gradient(145deg,#f5f0e8,#d4af37)',
    accentColor: '#1a1208',
    elements: [
        { type: 'text', id: 'brand-name', text: 'YOUR BRAND', left: 110, top: 80, fontSize: 22, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#1a1208', textAlign: 'center', charSpacing: 100 },
        { type: 'rect', id: 'gold-line', left: 30, top: 115, width: 160, height: 1, fill: '#c9a84c', selectable: true },
        { type: 'text', id: 'size', text: 'M', left: 110, top: 128, fontSize: 36, fontFamily: 'Inter', fontWeight: '700', fill: '#1a1208', textAlign: 'center' },
        { type: 'rect', id: 'gold-line-2', left: 30, top: 178, width: 160, height: 1, fill: '#c9a84c', selectable: true },
        { type: 'text', id: 'composition', text: '100% COTTON', left: 110, top: 193, fontSize: 9, fontFamily: 'Inter', fontWeight: 'normal', fill: '#555', textAlign: 'center', charSpacing: 300 },
        { type: 'text', id: 'origin', text: 'MADE IN PAKISTAN', left: 110, top: 210, fontSize: 8, fontFamily: 'Inter', fill: '#888', textAlign: 'center', charSpacing: 300 },
        // Repeat block for second panel (below fold)
        { type: 'text', id: 'brand-name-2', text: 'YOUR BRAND', left: 110, top: 272, fontSize: 22, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#1a1208', textAlign: 'center', charSpacing: 100 },
        { type: 'text', id: 'website', text: 'www.yourbrand.com', left: 110, top: 315, fontSize: 8, fontFamily: 'Inter', fill: '#aaa', textAlign: 'center' },
        { type: 'text', id: 'care-hint', text: '← Drag care icons here', left: 110, top: 360, fontSize: 8, fontFamily: 'Inter', fill: 'rgba(0,0,0,0.2)', textAlign: 'center' },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2: End Fold — Premium High-End Brand
// ─────────────────────────────────────────────────────────────────────────────
export const TPL_END_FOLD_PREMIUM: WovenTemplate = {
    id: 'ef-premium',
    name: 'Premium Flat Label',
    subtitle: 'End Fold',
    labelStyle: 'end-fold',
    industry: 'Luxury',
    width: 480,
    height: 260,
    backgroundColor: '#111111',
    previewGradient: 'linear-gradient(145deg,#111,#d4af37)',
    accentColor: '#d4af37',
    elements: [
        { type: 'text', id: 'brand-name', text: 'MAISON BRAND', left: 240, top: 70, fontSize: 28, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#d4af37', textAlign: 'center', charSpacing: 300 },
        { type: 'rect', id: 'gold-line', left: 80, top: 112, width: 320, height: 0.8, fill: '#d4af37', selectable: true },
        { type: 'text', id: 'size', text: 'SIZE  L', left: 240, top: 124, fontSize: 14, fontFamily: 'Inter', fontWeight: '600', fill: 'rgba(255,255,255,0.85)', textAlign: 'center', charSpacing: 500 },
        { type: 'text', id: 'composition', text: '100% MERCERIZED COTTON', left: 240, top: 150, fontSize: 9, fontFamily: 'Inter', fill: 'rgba(255,255,255,0.45)', textAlign: 'center', charSpacing: 400 },
        { type: 'text', id: 'origin', text: 'HANDCRAFTED IN PAKISTAN', left: 240, top: 168, fontSize: 9, fontFamily: 'Inter', fill: 'rgba(255,255,255,0.3)', textAlign: 'center', charSpacing: 400 },
        { type: 'text', id: 'website', text: 'WWW.MAISONBRAND.COM', left: 240, top: 188, fontSize: 8, fontFamily: 'Inter', fill: 'rgba(212,175,55,0.4)', textAlign: 'center', charSpacing: 350 },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3: Straight Cut — Sports Brand
// ─────────────────────────────────────────────────────────────────────────────
export const TPL_STRAIGHT_SPORT: WovenTemplate = {
    id: 'sc-sport',
    name: 'Sportswear Label',
    subtitle: 'Straight Cut',
    labelStyle: 'straight-cut',
    industry: 'Sport',
    width: 440,
    height: 280,
    backgroundColor: '#0a0a0a',
    previewGradient: 'linear-gradient(145deg,#0a0a0a,#aaff00)',
    accentColor: '#aaff00',
    elements: [
        { type: 'rect', id: 'neon-bar', left: 0, top: 0, width: 6, height: 280, fill: '#aaff00', selectable: false, evented: false },
        { type: 'text', id: 'brand-name', text: 'SPORT', left: 220, top: 55, fontSize: 52, fontFamily: 'Impact', fill: '#ffffff', textAlign: 'center', charSpacing: 150 },
        { type: 'rect', id: 'neon-line', left: 26, top: 120, width: 392, height: 1.5, fill: '#aaff00', selectable: true },
        { type: 'text', id: 'size', text: 'SIZE  XL', left: 220, top: 132, fontSize: 14, fontFamily: 'Barlow Condensed', fontWeight: '700', fill: 'rgba(255,255,255,0.75)', textAlign: 'center', charSpacing: 500 },
        { type: 'text', id: 'specs', text: 'MOISTURE WICKING  ·  UV PROTECTION', left: 220, top: 158, fontSize: 9, fontFamily: 'Inter', fill: 'rgba(170,255,0,0.6)', textAlign: 'center', charSpacing: 300 },
        { type: 'text', id: 'composition', text: '88% POLYESTER  12% ELASTANE  ·  MADE IN PAKISTAN', left: 220, top: 178, fontSize: 8.5, fontFamily: 'Inter', fill: 'rgba(255,255,255,0.3)', textAlign: 'center', charSpacing: 200 },
        { type: 'text', id: 'website', text: 'WWW.SPORTBRAND.COM', left: 220, top: 210, fontSize: 8, fontFamily: 'Inter', fill: 'rgba(170,255,0,0.3)', textAlign: 'center', charSpacing: 350 },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 4: Woven Patch — Denim / Jeans
// ─────────────────────────────────────────────────────────────────────────────
export const TPL_PATCH_DENIM: WovenTemplate = {
    id: 'wp-denim',
    name: 'Denim Patch Label',
    subtitle: 'Woven Patch',
    labelStyle: 'woven-patch',
    industry: 'Denim',
    width: 520,
    height: 340,
    backgroundColor: '#c49a6c',
    previewGradient: 'linear-gradient(145deg,#c49a6c,#5c3a1e)',
    accentColor: '#3a2010',
    elements: [
        // Warm leather texture overlay tints
        { type: 'rect', id: 'leather-top', left: 0, top: 0, width: 520, height: 90, fill: 'rgba(90,50,20,0.12)', selectable: false, evented: false },
        { type: 'rect', id: 'leather-bottom', left: 0, top: 250, width: 520, height: 90, fill: 'rgba(90,50,20,0.12)', selectable: false, evented: false },
        // Brand — big embossed serif
        { type: 'text', id: 'brand-name', text: 'RUGGED CO.', left: 260, top: 65, fontSize: 44, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#3a2010', textAlign: 'center', charSpacing: 200 },
        // Est. line
        { type: 'text', id: 'est', text: '— EST. 2024 —', left: 260, top: 120, fontSize: 11, fontFamily: 'Inter', fontWeight: '600', fill: 'rgba(58,32,16,0.55)', textAlign: 'center', charSpacing: 500 },
        // Waist × Inseam — large bold
        { type: 'text', id: 'waist-size', text: 'W 32  ×  L 30', left: 260, top: 155, fontSize: 30, fontFamily: 'Barlow Condensed', fontWeight: '700', fill: '#2a1508', textAlign: 'center', charSpacing: 200 },
        // Thin dark divider
        { type: 'rect', id: 'divider', left: 60, top: 200, width: 400, height: 1, fill: 'rgba(58,32,16,0.25)', selectable: true },
        // Composition
        { type: 'text', id: 'composition', text: '100% RING-SPUN COTTON DENIM', left: 260, top: 215, fontSize: 10, fontFamily: 'Inter', fill: 'rgba(58,32,16,0.55)', textAlign: 'center', charSpacing: 350 },
        // Origin
        { type: 'text', id: 'origin', text: 'HANDCRAFTED IN SIALKOT, PAKISTAN', left: 260, top: 238, fontSize: 9, fontFamily: 'Inter', fill: 'rgba(58,32,16,0.4)', textAlign: 'center', charSpacing: 400 },
        // Website
        { type: 'text', id: 'website', text: 'WWW.RUGGEDCO.COM', left: 260, top: 272, fontSize: 8.5, fontFamily: 'Inter', fill: 'rgba(58,32,16,0.3)', textAlign: 'center', charSpacing: 400 },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 5: Care Strip — Standard Legal Care & Composition Label
// ─────────────────────────────────────────────────────────────────────────────
export const TPL_CARE_STRIP: WovenTemplate = {
    id: 'cs-standard',
    name: 'Care & Composition',
    subtitle: 'Side Seam Strip',
    labelStyle: 'care-strip',
    industry: 'All Apparel',
    width: 240,
    height: 520,
    backgroundColor: '#ffffff',
    previewGradient: 'linear-gradient(145deg,#ffffff,#2563eb)',
    accentColor: '#1a1a1a',
    elements: [
        { type: 'text', id: 'brand-name', text: 'BRAND', left: 120, top: 42, fontSize: 15, fontFamily: 'Inter', fontWeight: 'bold', fill: '#111', textAlign: 'center', charSpacing: 400 },
        { type: 'rect', id: 'top-line', left: 20, top: 62, width: 200, height: 0.8, fill: '#ccc', selectable: true },
        { type: 'text', id: 'care-title', text: 'CARE INSTRUCTIONS', left: 120, top: 74, fontSize: 7.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#333', textAlign: 'center', charSpacing: 350 },
        // Care icons drop zone — 5 placeholder boxes
        { type: 'text', id: 'care-icons-hint', text: '← Drop care icons here', left: 120, top: 150, fontSize: 8, fontFamily: 'Inter', fill: 'rgba(0,0,0,0.2)', textAlign: 'center' },
        // Boxes for icons
        { type: 'rect', id: 'icon-box-1', left: 18, top: 88, width: 34, height: 34, rx: 3, fill: '#f0f0f0', stroke: '#ddd', strokeWidth: 1, selectable: true },
        { type: 'rect', id: 'icon-box-2', left: 58, top: 88, width: 34, height: 34, rx: 3, fill: '#f0f0f0', stroke: '#ddd', strokeWidth: 1, selectable: true },
        { type: 'rect', id: 'icon-box-3', left: 98, top: 88, width: 34, height: 34, rx: 3, fill: '#f0f0f0', stroke: '#ddd', strokeWidth: 1, selectable: true },
        { type: 'rect', id: 'icon-box-4', left: 138, top: 88, width: 34, height: 34, rx: 3, fill: '#f0f0f0', stroke: '#ddd', strokeWidth: 1, selectable: true },
        { type: 'rect', id: 'icon-box-5', left: 178, top: 88, width: 34, height: 34, rx: 3, fill: '#f0f0f0', stroke: '#ddd', strokeWidth: 1, selectable: true },
        { type: 'rect', id: 'divider', left: 20, top: 178, width: 200, height: 0.8, fill: '#ccc', selectable: true },
        { type: 'text', id: 'composition', text: 'FIBER CONTENT', left: 120, top: 192, fontSize: 7.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#333', textAlign: 'center', charSpacing: 350 },
        { type: 'text', id: 'fiber', text: '100% COTTON', left: 120, top: 206, fontSize: 11, fontFamily: 'Inter', fontWeight: 'normal', fill: '#111', textAlign: 'center' },
        { type: 'rect', id: 'divider-2', left: 20, top: 232, width: 200, height: 0.8, fill: '#ccc', selectable: true },
        { type: 'text', id: 'origin-title', text: 'COUNTRY OF ORIGIN', left: 120, top: 245, fontSize: 7.5, fontFamily: 'Inter', fontWeight: 'bold', fill: '#333', textAlign: 'center', charSpacing: 350 },
        { type: 'text', id: 'origin', text: 'MADE IN PAKISTAN', left: 120, top: 260, fontSize: 11, fontFamily: 'Inter', fill: '#111', textAlign: 'center', charSpacing: 200 },
        { type: 'rect', id: 'divider-3', left: 20, top: 288, width: 200, height: 0.8, fill: '#ccc', selectable: true },
        { type: 'text', id: 'website', text: 'www.yourbrand.com', left: 120, top: 305, fontSize: 9, fontFamily: 'Inter', fill: '#aaa', textAlign: 'center' },
        { type: 'text', id: 'reg-text', text: 'RN# 12345678', left: 120, top: 325, fontSize: 8, fontFamily: 'Inter', fill: '#ccc', textAlign: 'center' },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 6: Loop Fold — Hat / Cap
// ─────────────────────────────────────────────────────────────────────────────
export const TPL_LOOP_CAP: WovenTemplate = {
    id: 'lf-cap',
    name: 'Cap & Hat Label',
    subtitle: 'Loop Fold',
    labelStyle: 'loop-fold',
    industry: 'Headwear',
    width: 220,
    height: 520,
    backgroundColor: '#1a1a1a',
    previewGradient: 'linear-gradient(145deg,#1a1a1a,#c0392b)',
    accentColor: '#c0392b',
    elements: [
        { type: 'rect', id: 'red-top', left: 0, top: 0, width: 220, height: 8, fill: '#c0392b', selectable: false, evented: false },
        { type: 'text', id: 'brand-name', text: 'CAPS CO.', left: 110, top: 58, fontSize: 22, fontFamily: 'Impact', fill: '#ffffff', textAlign: 'center', charSpacing: 200 },
        { type: 'rect', id: 'red-line', left: 20, top: 92, width: 180, height: 2, fill: '#c0392b', selectable: true },
        { type: 'text', id: 'tagline', text: 'AUTHENTIC HEADWEAR', left: 110, top: 103, fontSize: 8.5, fontFamily: 'Inter', fontWeight: 'bold', fill: 'rgba(255,255,255,0.5)', textAlign: 'center', charSpacing: 400 },
        { type: 'text', id: 'size', text: 'S/M', left: 110, top: 128, fontSize: 32, fontFamily: 'Barlow Condensed', fontWeight: '700', fill: '#ffffff', textAlign: 'center', charSpacing: 100 },
        { type: 'rect', id: 'divider', left: 20, top: 175, width: 180, height: 0.8, fill: 'rgba(255,255,255,0.15)', selectable: true },
        { type: 'text', id: 'composition', text: '100% BRUSHED COTTON', left: 110, top: 190, fontSize: 8.5, fontFamily: 'Inter', fill: 'rgba(255,255,255,0.5)', textAlign: 'center', charSpacing: 300 },
        { type: 'text', id: 'origin', text: 'MADE IN PAKISTAN', left: 110, top: 208, fontSize: 8, fontFamily: 'Inter', fill: 'rgba(255,255,255,0.3)', textAlign: 'center', charSpacing: 400 },
        // Second panel (below fold line at y=260)
        { type: 'text', id: 'brand-name-2', text: 'CAPS CO.', left: 110, top: 300, fontSize: 22, fontFamily: 'Impact', fill: '#c0392b', textAlign: 'center', charSpacing: 200 },
        { type: 'text', id: 'website', text: 'www.capsco.com', left: 110, top: 336, fontSize: 9, fontFamily: 'Inter', fill: 'rgba(255,255,255,0.25)', textAlign: 'center' },
        { type: 'text', id: 'care-hint', text: '← Care icons area', left: 110, top: 385, fontSize: 8, fontFamily: 'Inter', fill: 'rgba(255,255,255,0.12)', textAlign: 'center' },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 7: Mitre Fold — Dress Shirt / Premium Garment
// ─────────────────────────────────────────────────────────────────────────────
export const TPL_MITRE_SHIRT: WovenTemplate = {
    id: 'mf-shirt',
    name: 'Dress Shirt Label',
    subtitle: 'Mitre Fold',
    labelStyle: 'mitre-fold',
    industry: 'Formal',
    width: 440,
    height: 260,
    backgroundColor: '#f9f8f6',
    previewGradient: 'linear-gradient(145deg,#f9f8f6,#1a1a1a)',
    accentColor: '#1a1a1a',
    elements: [
        { type: 'text', id: 'brand-name', text: 'ATELIER BRAND', left: 220, top: 72, fontSize: 26, fontFamily: 'Playfair Display', fontWeight: 'bold', fill: '#1a1208', textAlign: 'center', charSpacing: 200 },
        { type: 'rect', id: 'black-line', left: 70, top: 112, width: 300, height: 1, fill: '#333', selectable: true },
        { type: 'text', id: 'collection', text: 'FORMAL COLLECTION', left: 220, top: 125, fontSize: 10, fontFamily: 'Inter', fontWeight: '300', fill: '#777', textAlign: 'center', charSpacing: 600 },
        { type: 'text', id: 'size', text: '41 / 16', left: 220, top: 148, fontSize: 20, fontFamily: 'Inter', fontWeight: 'bold', fill: '#1a1208', textAlign: 'center', charSpacing: 200 },
        { type: 'rect', id: 'black-line-2', left: 70, top: 178, width: 300, height: 0.5, fill: '#ccc', selectable: true },
        { type: 'text', id: 'composition', text: '100% SUPIMA COTTON  ·  MACHINE WASH 40°C', left: 220, top: 190, fontSize: 8.5, fontFamily: 'Inter', fill: '#888', textAlign: 'center', charSpacing: 300 },
        { type: 'text', id: 'origin', text: 'TAILORED IN PAKISTAN', left: 220, top: 208, fontSize: 8.5, fontFamily: 'Inter', fill: '#aaa', textAlign: 'center', charSpacing: 400 },
    ],
};

export const WOVEN_TEMPLATES: WovenTemplate[] = [
    TPL_CENTER_FOLD_FASHION,
    TPL_END_FOLD_PREMIUM,
    TPL_STRAIGHT_SPORT,
    TPL_PATCH_DENIM,
    TPL_CARE_STRIP,
    TPL_LOOP_CAP,
    TPL_MITRE_SHIRT,
];
