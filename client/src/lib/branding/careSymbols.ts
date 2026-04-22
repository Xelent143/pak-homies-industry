/**
 * ISO 3758 textile care symbols — rendered as inline SVG paths.
 * Each symbol is a small SVG viewBox="0 0 40 40" that can be
 * stamped onto the Fabric.js canvas as a fabric.FabricImage.
 *
 * Usage:  const dataUrl = getCareIconDataUrl('machine-wash');
 *         const img = await fabric.FabricImage.fromURL(dataUrl);
 *         canvas.add(img);
 */

export interface CareIcon {
    id: string;
    label: string;
    category: 'wash' | 'bleach' | 'dry' | 'iron' | 'dryclean';
    svg: string; // full <svg>...</svg> string
}

const s = (paths: string, viewBox = '0 0 40 40') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

/** Tub (basin) shape helper */
const TUB = `<path d="M4 18 Q4 30 20 30 Q36 30 36 18" stroke-width="2" /><line x1="4" y1="18" x2="36" y2="18" /><line x1="10" y1="12" x2="10" y2="18" /><line x1="30" y1="12" x2="30" y2="18" />`;
const HAND = `<path d="M16 28 C12 28 8 26 8 20 L8 10 Q8 8 10 8 Q12 8 12 10 L12 16 Q14 14 16 14 Q18 14 18 16 Q20 14 22 14 Q24 14 24 16 Q26 15 28 17 L28 24 Q28 28 24 28 Z" stroke-width="1.8"/>`;
const TRIANGLE = `<polygon points="20,6 36,34 4,34" stroke-width="2"/>`;
const SQUARE = `<rect x="5" y="5" width="30" height="30" rx="2" stroke-width="2"/>`;
const CIRCLE = `<circle cx="20" cy="20" r="15" stroke-width="2"/>`;
const IRON_SHAPE = `<path d="M8 26 L8 22 Q8 18 20 18 L30 18 Q36 18 36 22 L36 26 Z"/><line x1="14" y1="14" x2="14" y2="18"/><path d="M14 14 Q14 10 20 10 Q26 10 26 14"/>`;
const X_MARK = `<line x1="10" y1="10" x2="30" y2="30" stroke-width="3"/><line x1="30" y1="10" x2="10" y2="30" stroke-width="3"/>`;
const DOT = `<circle cx="20" cy="20" r="3" fill="currentColor" stroke="none"/>`;
const HAND_WAVE = `<path d="M14 20 Q14 16 18 16 Q22 16 22 20 L22 26 Q22 28 20 28 Q18 28 18 26 L18 20" stroke-width="1.8"/>`;

export const CARE_ICONS: CareIcon[] = [
    // ── Wash ──────────────────────────────────────────────────────────────────
    {
        id: 'machine-wash-30',
        label: 'Wash 30°C',
        category: 'wash',
        svg: s(`${TUB}<text x="20" y="26" text-anchor="middle" font-size="9" fill="currentColor" stroke="none" font-family="Inter,sans-serif">30</text>`)
    },
    {
        id: 'machine-wash-40',
        label: 'Wash 40°C',
        category: 'wash',
        svg: s(`${TUB}<text x="20" y="26" text-anchor="middle" font-size="9" fill="currentColor" stroke="none" font-family="Inter,sans-serif">40</text>`)
    },
    {
        id: 'machine-wash-60',
        label: 'Wash 60°C',
        category: 'wash',
        svg: s(`${TUB}<text x="20" y="26" text-anchor="middle" font-size="9" fill="currentColor" stroke="none" font-family="Inter,sans-serif">60</text>`)
    },
    {
        id: 'hand-wash',
        label: 'Hand Wash',
        category: 'wash',
        svg: s(`<path d="M4 18 Q4 30 20 30 Q36 30 36 18" /><line x1="4" y1="18" x2="36" y2="18" />${HAND_WAVE}`)
    },
    {
        id: 'no-wash',
        label: 'Do Not Wash',
        category: 'wash',
        svg: s(`${TUB}${X_MARK}`)
    },

    // ── Bleach ────────────────────────────────────────────────────────────────
    {
        id: 'bleach-ok',
        label: 'Bleach OK',
        category: 'bleach',
        svg: s(TRIANGLE)
    },
    {
        id: 'no-bleach',
        label: 'No Bleach',
        category: 'bleach',
        svg: s(`${TRIANGLE}${X_MARK}`)
    },
    {
        id: 'non-chlorine-bleach',
        label: 'Non-Chlorine',
        category: 'bleach',
        svg: s(`${TRIANGLE}<line x1="12" y1="22" x2="28" y2="32" stroke-width="2"/><line x1="12" y1="28" x2="22" y2="32" stroke-width="2"/>`)
    },

    // ── Drying ────────────────────────────────────────────────────────────────
    {
        id: 'tumble-dry-low',
        label: 'Tumble Dry Low',
        category: 'dry',
        svg: s(`${SQUARE}${CIRCLE}${DOT}`)
    },
    {
        id: 'tumble-dry-medium',
        label: 'Tumble Dry Med',
        category: 'dry',
        svg: s(`${SQUARE}${CIRCLE}<circle cx="16" cy="20" r="2" fill="currentColor" stroke="none"/><circle cx="24" cy="20" r="2" fill="currentColor" stroke="none"/>`)
    },
    {
        id: 'no-tumble-dry',
        label: 'No Tumble Dry',
        category: 'dry',
        svg: s(`${SQUARE}${CIRCLE}${X_MARK}`)
    },
    {
        id: 'line-dry',
        label: 'Line Dry',
        category: 'dry',
        svg: s(`${SQUARE}<line x1="10" y1="12" x2="30" y2="12" stroke-width="2.5"/><line x1="20" y1="12" x2="20" y2="28" stroke-width="2"/>`)
    },
    {
        id: 'flat-dry',
        label: 'Dry Flat',
        category: 'dry',
        svg: s(`${SQUARE}<line x1="8" y1="20" x2="32" y2="20" stroke-width="2.5"/>`)
    },

    // ── Iron ─────────────────────────────────────────────────────────────────
    {
        id: 'iron-low',
        label: 'Iron Low (110°)',
        category: 'iron',
        svg: s(`${IRON_SHAPE}${DOT}`)
    },
    {
        id: 'iron-medium',
        label: 'Iron Med (150°)',
        category: 'iron',
        svg: s(`${IRON_SHAPE}<circle cx="16" cy="20" r="2" fill="currentColor" stroke="none"/><circle cx="24" cy="20" r="2" fill="currentColor" stroke="none"/>`)
    },
    {
        id: 'iron-high',
        label: 'Iron High (200°)',
        category: 'iron',
        svg: s(`${IRON_SHAPE}<circle cx="14" cy="20" r="2" fill="currentColor" stroke="none"/><circle cx="20" cy="20" r="2" fill="currentColor" stroke="none"/><circle cx="26" cy="20" r="2" fill="currentColor" stroke="none"/>`)
    },
    {
        id: 'no-iron',
        label: 'Do Not Iron',
        category: 'iron',
        svg: s(`${IRON_SHAPE}${X_MARK}`)
    },
    {
        id: 'no-steam',
        label: 'No Steam',
        category: 'iron',
        svg: s(`${IRON_SHAPE}<path d="M16 12 Q16 9 18 10 Q18 7 20 8 Q20 5 22 6" stroke-width="1.5"/><line x1="12" y1="6" x2="30" y2="24" stroke-width="2.5"/>`)
    },

    // ── Dry Clean ────────────────────────────────────────────────────────────
    {
        id: 'dry-clean',
        label: 'Dry Clean',
        category: 'dryclean',
        svg: s(`${CIRCLE}<text x="20" y="25" text-anchor="middle" font-size="14" fill="currentColor" stroke="none" font-family="serif">A</text>`)
    },
    {
        id: 'dry-clean-p',
        label: 'Dry Clean (P)',
        category: 'dryclean',
        svg: s(`${CIRCLE}<text x="20" y="25" text-anchor="middle" font-size="14" fill="currentColor" stroke="none" font-family="serif">P</text>`)
    },
    {
        id: 'no-dry-clean',
        label: 'No Dry Clean',
        category: 'dryclean',
        svg: s(`${CIRCLE}${X_MARK}`)
    },
];

/** Convert a CARE_ICON svg string to a data URL that Fabric.js can load */
export function careIconToDataUrl(icon: CareIcon, color = '#1a1a1a', size = 60): string {
    const svg = icon.svg
        .replace('currentColor', color)
        .replace('width="40"', `width="${size}"`)
        .replace('height="40"', `height="${size}"`);
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}
