/**
 * RasterEngine — the core pixel-level recoloring engine.
 *
 * Workflow:
 *  1. loadImage(img) → captures the original pixel data
 *  2. buildMasks(colorMap) → scans pixels and assigns each to a part based on HSL proximity
 *  3. recolorPart(partId, newHex) → hue-shifts that part's pixels while preserving lightness
 *  4. toDataURL() → returns the current (recolored) image as a data URL
 */

import { hexToRgb, rgbToHsl, hslToRgb } from './colorUtils';

export interface PartColorDef {
    partId: string;
    partName: string;
    originalColor: string;   // hex, e.g. '#ff0000'
}

export class RasterEngine {
    private _width = 0;
    private _height = 0;
    /** Untouched copy of the original RGB(A) data */
    private _original: Uint8ClampedArray = new Uint8ClampedArray(0);
    /** Working copy that gets mutated on recolor */
    private _current: Uint8ClampedArray = new Uint8ClampedArray(0);
    /** partId → array of pixel-start-indices (i.e. multiples of 4) */
    private _masks: Map<string, number[]> = new Map();
    /** Reverse index: pixel-start-index → partId (for O(1) click detection) */
    private _pixelToPartId: Map<number, string> = new Map();
    /** partId → original HSL of the part's definition color */
    private _originalHSL: Map<string, [number, number, number]> = new Map();
    /** Off-screen canvas for compositing */
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    constructor() {
        this._canvas = document.createElement('canvas');
        this._ctx = this._canvas.getContext('2d', { willReadFrequently: true })!;
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get masks() { return this._masks; }

    /** Step 1: Load image pixels into the engine */
    loadImage(img: HTMLImageElement) {
        this._width = img.naturalWidth;
        this._height = img.naturalHeight;
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this._ctx.drawImage(img, 0, 0);
        const id = this._ctx.getImageData(0, 0, this._width, this._height);
        this._original = new Uint8ClampedArray(id.data);
        this._current = new Uint8ClampedArray(id.data);
    }

    /** Step 2: Scan every pixel and build a mask array per part (closest-match) */
    buildMasks(parts: PartColorDef[]) {
        this._masks.clear();
        this._pixelToPartId.clear();
        this._originalHSL.clear();

        // Pre-compute each part's reference HSL
        const refs: { partId: string; hsl: [number, number, number] }[] = [];
        for (const p of parts) {
            const rgb = hexToRgb(p.originalColor);
            const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
            refs.push({ partId: p.partId, hsl });
            this._masks.set(p.partId, []);
            this._originalHSL.set(p.partId, hsl);
        }

        const data = this._original;
        const len = data.length;

        // Maximum HSL distance to be considered a match at all
        const MAX_DIST = 120;

        for (let i = 0; i < len; i += 4) {
            const a = data[i + 3];
            if (a < 20) continue; // skip near-transparent

            const r = data[i], g = data[i + 1], b = data[i + 2];
            const hsl = rgbToHsl(r, g, b);

            // Skip very desaturated pixels (background, shadows, white areas)
            if (hsl[1] < 0.08 && (hsl[2] > 0.85 || hsl[2] < 0.15)) continue;

            // Find the CLOSEST part by weighted HSL distance
            let bestPart: string | null = null;
            let bestDist = MAX_DIST;

            for (const ref of refs) {
                let dh = Math.abs(hsl[0] - ref.hsl[0]);
                if (dh > 180) dh = 360 - dh;
                const dist = dh * 2 + Math.abs(hsl[1] - ref.hsl[1]) * 100 + Math.abs(hsl[2] - ref.hsl[2]) * 60;
                if (dist < bestDist) {
                    bestDist = dist;
                    bestPart = ref.partId;
                }
            }

            if (bestPart) {
                this._masks.get(bestPart)!.push(i);
                this._pixelToPartId.set(i, bestPart);
            }
        }

        console.log('[RasterEngine] Masks built:');
        for (const [id, mask] of Array.from(this._masks.entries())) {
            console.log(`  ${id}: ${mask.length} pixels`);
        }
    }

    /** Step 3: Recolor a specific part by hue-shifting its masked pixels */
    recolorPart(partId: string, newHex: string) {
        const mask = this._masks.get(partId);
        const origHSL = this._originalHSL.get(partId);
        if (!mask || !origHSL) return;

        const newRGB = hexToRgb(newHex);
        const newHSL = rgbToHsl(newRGB[0], newRGB[1], newRGB[2]);

        const deltaH = newHSL[0] - origHSL[0];
        const satRatio = origHSL[1] > 0.01 ? newHSL[1] / origHSL[1] : 1;

        const orig = this._original;
        const curr = this._current;

        for (const i of mask) {
            const r = orig[i], g = orig[i + 1], b = orig[i + 2];
            const [h, s, l] = rgbToHsl(r, g, b);

            // Shift hue, scale saturation, keep lightness
            const nh = (h + deltaH + 360) % 360;
            const ns = Math.min(1, Math.max(0, s * satRatio));
            const [nr, ng, nb] = hslToRgb(nh, ns, l);

            curr[i] = nr;
            curr[i + 1] = ng;
            curr[i + 2] = nb;
            // alpha stays the same
        }
    }

    /** Get a data URL of the current (recolored) image */
    toDataURL(): string {
        const id = new ImageData(
            new Uint8ClampedArray(this._current),
            this._width,
            this._height,
        );
        this._ctx.putImageData(id, 0, 0);
        return this._canvas.toDataURL('image/png');
    }

    /** Get an HTMLImageElement of the current state (as a promise) */
    async toImage(): Promise<HTMLImageElement> {
        const url = this.toDataURL();
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    /** Reset all pixels back to original */
    reset() {
        this._current = new Uint8ClampedArray(this._original);
    }

    /**
     * Given pixel coords in image-space, returns which partId owns that pixel.
     * Returns null if no part mask contains it.
     */
    getPartAtPixel(x: number, y: number): string | null {
        const ix = Math.round(x);
        const iy = Math.round(y);
        if (ix < 0 || iy < 0 || ix >= this._width || iy >= this._height) return null;
        const pixelIndex = (iy * this._width + ix) * 4;
        return this._pixelToPartId.get(pixelIndex) ?? null;
    }

    /**
     * Generate a white-on-transparent image from a part's mask.
     * Used to create a Fabric.js clip path for logo/text placement.
     */
    getMaskClip(partId: string): { dataUrl: string; left: number; top: number; width: number; height: number } | null {
        const mask = this._masks.get(partId);
        if (!mask || mask.length === 0) return null;

        // Find bounding rect of the mask
        let minX = this._width, maxX = 0, minY = this._height, maxY = 0;
        for (const idx of mask) {
            const px = (idx / 4) % this._width;
            const py = Math.floor(idx / 4 / this._width);
            if (px < minX) minX = px;
            if (px > maxX) maxX = px;
            if (py < minY) minY = py;
            if (py > maxY) maxY = py;
        }

        const w = maxX - minX + 1;
        const h = maxY - minY + 1;

        // Create a white-on-transparent image for the mask
        const c = document.createElement('canvas');
        c.width = this._width;
        c.height = this._height;
        const ctx = c.getContext('2d')!;
        const imgData = ctx.createImageData(this._width, this._height);
        const d = imgData.data;

        for (const idx of mask) {
            d[idx] = 255;     // R
            d[idx + 1] = 255; // G
            d[idx + 2] = 255; // B
            d[idx + 3] = 255; // A
        }
        ctx.putImageData(imgData, 0, 0);

        return {
            dataUrl: c.toDataURL('image/png'),
            left: minX,
            top: minY,
            width: w,
            height: h,
        };
    }
}
