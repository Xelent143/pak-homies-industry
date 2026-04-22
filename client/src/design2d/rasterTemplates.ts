/**
 * Admin-defined raster garment templates.
 *
 * HOW TO ADD A NEW TEMPLATE:
 *  1. Prepare a garment image (PNG/JPG) where each customizable body part
 *     has a clear, distinct solid color.
 *  2. Place the image in /public/garments/ (or use a full URL / data-URI).
 *  3. Add an entry below with:
 *       - id: unique number
 *       - name: display name
 *       - imageUrl: URL to the image
 *       - parts: array of { partId, partName, originalColor }
 *         where originalColor is the hex color of that part AS IT APPEARS in the image.
 *
 * The recoloring engine uses the originalColor to find all pixels that belong to
 * that part (via HSL proximity matching) and builds a mask for each.
 */

import type { PartColorDef } from './utils/RasterEngine';

export interface RasterTemplate {
    id: number;
    name: string;
    imageUrl: string;
    /** A short description shown in the template picker */
    description?: string;
    parts: PartColorDef[];
}

// ─── Demo: Generate a simple T-shirt image as an inline SVG data-URI ─────────
// This lets the feature work out of the box without needing real images.
// Replace these with real garment photos when ready.

function makeDemoTshirtSvg(
    body: string, leftSleeve: string, rightSleeve: string,
    collar: string, pocket: string,
): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
    <!-- Body -->
    <path d="M120 130 L120 430 Q120 450 140 450 L260 450 Q280 450 280 430 L280 130 Z"
          fill="${body}" />
    <!-- Left Sleeve -->
    <path d="M120 130 L30 180 L30 230 Q30 240 40 240 L120 220 Z"
          fill="${leftSleeve}" />
    <!-- Right Sleeve -->
    <path d="M280 130 L370 180 L370 230 Q370 240 360 240 L280 220 Z"
          fill="${rightSleeve}" />
    <!-- Collar -->
    <path d="M140 100 Q200 80 260 100 L280 130 Q200 110 120 130 Z"
          fill="${collar}" />
    <!-- Collar inner -->
    <path d="M160 106 Q200 92 240 106 L250 118 Q200 105 150 118 Z"
          fill="${collar}" opacity="0.7" />
    <!-- Pocket -->
    <rect x="220" y="200" width="40" height="45" rx="3"
          fill="${pocket}" stroke="${pocket}" stroke-width="1.5" opacity="0.85" />
    <!-- Stitching lines for realism -->
    <line x1="120" y1="130" x2="120" y2="430" stroke="rgba(0,0,0,0.1)" stroke-width="1.5" />
    <line x1="280" y1="130" x2="280" y2="430" stroke="rgba(0,0,0,0.1)" stroke-width="1.5" />
    <line x1="200" y1="130" x2="200" y2="450" stroke="rgba(0,0,0,0.04)" stroke-width="1" stroke-dasharray="8 4" />
  </svg>`;
}

// Convert SVG string to a data-URI that can be loaded as an image
function svgToDataUri(svg: string): string {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// ── Admin-Defined Raster Templates ──────────────────────────────────────────

export const RASTER_TEMPLATES: RasterTemplate[] = [
    // ── Real garment photos ─────────────────────────────────────────────────
    {
        id: 2001,
        name: 'Color-Block T-Shirt',
        description: 'Real photo — green body, red collar, yellow sleeve',
        imageUrl: '/garments/tshirt-colorblock.jpg',
        parts: [
            { partId: 'body', partName: 'Body & Left Sleeve', originalColor: '#2da67a' },
            { partId: 'collar', partName: 'Collar', originalColor: '#c03848' },
            { partId: 'right-sleeve', partName: 'Right Sleeve', originalColor: '#d4a838' },
        ],
    },
    {
        id: 2002,
        name: 'Color-Block Hoodie',
        description: '4-view hoodie — all views recolor together',
        imageUrl: '/garments/hoodie-colorblock-4view.jpg',
        parts: [
            { partId: 'hood', partName: 'Hood', originalColor: '#80ff00' },
            { partId: 'front-body', partName: 'Front Body', originalColor: '#00ddf0' },
            { partId: 'back-sleeve', partName: 'Back Body & Left Sleeve', originalColor: '#ffe020' },
            { partId: 'right-sleeve', partName: 'Right Sleeve', originalColor: '#e020e0' },
            { partId: 'waistband', partName: 'Waistband & Hem', originalColor: '#ff8020' },
        ],
    },

    // ── Demo SVG templates (for testing) ─────────────────────────────────────
    {
        id: 1001,
        name: 'T-Shirt Classic',
        description: 'Basic crew-neck t-shirt with 5 customizable zones',
        imageUrl: svgToDataUri(
            makeDemoTshirtSvg('#1a3a8f', '#b22222', '#2d6a4f', '#d4af37', '#1a3a8f')
        ),
        parts: [
            { partId: 'body', partName: 'Body', originalColor: '#1a3a8f' },
            { partId: 'left-sleeve', partName: 'Left Sleeve', originalColor: '#b22222' },
            { partId: 'right-sleeve', partName: 'Right Sleeve', originalColor: '#2d6a4f' },
            { partId: 'collar', partName: 'Collar', originalColor: '#d4af37' },
            { partId: 'pocket', partName: 'Breast Pocket', originalColor: '#1a3a8f' },
        ],
    },
    {
        id: 1002,
        name: 'Polo Shirt',
        description: 'Polo shirt with body, sleeves, and collar zones',
        imageUrl: svgToDataUri(
            makeDemoTshirtSvg('#0f3460', '#0f3460', '#0f3460', '#d4af37', '#0f3460')
        ),
        parts: [
            { partId: 'body', partName: 'Body & Sleeves', originalColor: '#0f3460' },
            { partId: 'collar', partName: 'Collar & Placket', originalColor: '#d4af37' },
        ],
    },
];
