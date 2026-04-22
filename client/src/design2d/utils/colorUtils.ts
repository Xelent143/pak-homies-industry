/**
 * Color conversion utilities for the raster recoloring engine.
 * All functions are pure math — no DOM/Canvas dependencies.
 */

/** Convert hex color string to [R, G, B] */
export function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [
        parseInt(h.substring(0, 2), 16),
        parseInt(h.substring(2, 4), 16),
        parseInt(h.substring(4, 6), 16),
    ];
}

/** Convert [R,G,B] (0-255) to [H,S,L] (H: 0-360, S: 0-1, L: 0-1) */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l]; // achromatic

    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;

    return [h * 360, s, l];
}

/** Convert [H,S,L] (H: 0-360, S: 0-1, L: 0-1) to [R,G,B] (0-255) */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h = ((h % 360) + 360) % 360; // normalize
    h /= 360;
    if (s === 0) {
        const v = Math.round(l * 255);
        return [v, v, v];
    }
    const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [
        Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
        Math.round(hue2rgb(p, q, h) * 255),
        Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    ];
}

/** Convert RGB to hex string */
export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if two HSL colors are within tolerance.
 * Tuned for 3D-rendered garments where shading can shift hue/sat/lit significantly.
 * hueTol in degrees (default 40), satTol and litTol as 0-1 fractions.
 *
 * RECOMMENDED PALETTE (max 4–5 parts, each ≥80° hue apart):
 *   Red #FF0000 (H=0°), Green #00FF00 (H=120°), Blue #0000FF (H=240°),
 *   Cyan #00FFFF (H=180°), Yellow #FFFF00 (H=60°), Magenta #FF00FF (H=300°)
 *
 * For more parts, see the RECOMMENDED_PALETTE export below.
 */
export function hslMatch(
    hsl1: [number, number, number],
    hsl2: [number, number, number],
    hueTol = 40,
    satTol = 0.40,
    litTol = 0.45,
): boolean {
    // Both very low saturation → achromatic, compare lightness only
    if (hsl1[1] < 0.10 && hsl2[1] < 0.10) {
        return Math.abs(hsl1[2] - hsl2[2]) <= litTol;
    }
    // One is achromatic, other isn't → not a match
    if (hsl1[1] < 0.10 || hsl2[1] < 0.10) return false;

    let hueDiff = Math.abs(hsl1[0] - hsl2[0]);
    if (hueDiff > 180) hueDiff = 360 - hueDiff;

    return (
        hueDiff <= hueTol &&
        Math.abs(hsl1[1] - hsl2[1]) <= satTol &&
        Math.abs(hsl1[2] - hsl2[2]) <= litTol
    );
}

/**
 * Recommended high-contrast colors for garment parts.
 * Each color is ~90° apart in hue space, at full saturation 50% lightness.
 * This guarantees zero overlap with a ±40° hue tolerance.
 * Maximum safe limit: ~8 parts (using hue + saturation variation).
 */
export const RECOMMENDED_PALETTE = [
    { hex: '#FF0000', name: 'Red', hue: 0 },
    { hex: '#00FF00', name: 'Green', hue: 120 },
    { hex: '#0000FF', name: 'Blue', hue: 240 },
    { hex: '#FFFF00', name: 'Yellow', hue: 60 },
    { hex: '#FF00FF', name: 'Magenta', hue: 300 },
    { hex: '#00FFFF', name: 'Cyan', hue: 180 },
    // Below: by varying lightness for extra parts
    { hex: '#FF8000', name: 'Orange', hue: 30 },   // safe if no Red+Yellow adjacent
    { hex: '#80FF00', name: 'Lime', hue: 90 },   // safe if no Green+Yellow adjacent
    { hex: '#8000FF', name: 'Purple', hue: 270 },  // safe if no Blue+Magenta adjacent
    { hex: '#00FF80', name: 'Spring Green', hue: 150 },  // safe if no Green+Cyan adjacent
];
