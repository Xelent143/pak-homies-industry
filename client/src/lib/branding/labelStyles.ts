/**
 * Industry-standard woven label type definitions.
 *
 * Based on ISO / FTC labeling standards and confirmed by major woven
 * label manufacturers (damask, satin, taffeta substrate options).
 *
 * Standard seam allowance: 6 mm (≈ ¼ inch) per side.
 * Minimum text: 6pt / ≈ 2 mm woven height.
 * Max thread colours: 8 per label.
 */

export type LabelStyleId =
    | 'center-fold'
    | 'end-fold'
    | 'straight-cut'
    | 'woven-patch'
    | 'care-strip'
    | 'loop-fold'
    | 'mitre-fold';

export interface LabelStyle {
    id: LabelStyleId;
    name: string;
    subtitle: string;
    description: string;
    useCase: string;
    /** Canvas pixel dimensions at 10px per mm scale */
    defaultWidth: number;
    defaultHeight: number;
    /** Industry dimension label shown to user */
    dimensions: string;
    /** Sewing margin in pixels (6mm = 24px at 10px/4mm ≈ 20px). We use 20px */
    stitchInset: number;
    /** Whether top has a visible fold crease */
    hasTopFold: boolean;
    /** Whether ends are folded under (end-fold, mitre) */
    hasEndFolds: boolean;
    /** Thumbnail SVG (rendered in the type picker) */
    thumbnailSvg: string;
}

const makeThumb = (content: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60" width="80" height="60">${content}</svg>`;

export const LABEL_STYLES: LabelStyle[] = [
    {
        id: 'center-fold',
        name: 'Center Fold',
        subtitle: 'Neck / Collar Label',
        description: 'Folded at center top. Both raw ends hidden inside collar seam.',
        useCase: 'T-shirts, shirts, jackets — sewn into collar',
        defaultWidth: 220,
        defaultHeight: 480,
        dimensions: '22 × 48 mm (unfolded)',
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
        `),
    },
    {
        id: 'end-fold',
        name: 'End Fold',
        subtitle: 'High-End Sewn Label',
        description: 'Left and right edges folded behind. Sewn flat on garment. No raw edges visible.',
        useCase: 'Premium t-shirts, shirts sewn flat on inside hem',
        defaultWidth: 480,
        defaultHeight: 260,
        dimensions: '48 × 26 mm',
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
        `),
    },
    {
        id: 'straight-cut',
        name: 'Straight Cut',
        subtitle: 'Flat All-Purpose Label',
        description: 'Simple rectangular label, all edges folded into seam. Most versatile format.',
        useCase: 'Sewn into side seam, hem, or as exterior patch',
        defaultWidth: 440,
        defaultHeight: 280,
        dimensions: '44 × 28 mm',
        stitchInset: 22,
        hasTopFold: false,
        hasEndFolds: false,
        thumbnailSvg: makeThumb(`
            <rect x="6" y="8" width="68" height="44" rx="2" fill="#f8f5ee" stroke="#bbb" stroke-width="1.2"/>
            <rect x="12" y="14" width="56" height="32" fill="none" stroke="#999" stroke-width="0.8" stroke-dasharray="2,2"/>
            <text x="40" y="26" text-anchor="middle" font-size="6" fill="#333" font-family="sans-serif" font-weight="bold">BRAND</text>
            <text x="40" y="34" text-anchor="middle" font-size="4" fill="#888" font-family="sans-serif">100% COTTON · WASH 30°</text>
            <text x="40" y="42" text-anchor="middle" font-size="3.5" fill="#aaa" font-family="sans-serif">MADE IN PAKISTAN</text>
        `),
    },
    {
        id: 'woven-patch',
        name: 'Woven Patch',
        subtitle: 'Exterior Badge Label',
        description: 'Sewn on the outside of the garment. Bold brand badge visible to consumers.',
        useCase: 'Jeans back pocket, jacket sleeve, waistband',
        defaultWidth: 520,
        defaultHeight: 340,
        dimensions: '52 × 34 mm',
        stitchInset: 18,
        hasTopFold: false,
        hasEndFolds: false,
        thumbnailSvg: makeThumb(`
            <rect x="4" y="6" width="72" height="48" rx="3" fill="#1a1208" stroke="#c9a84c" stroke-width="1.5"/>
            <rect x="10" y="12" width="60" height="36" fill="none" stroke="#c9a84c" stroke-width="0.7" stroke-dasharray="2,2"/>
            <text x="40" y="30" text-anchor="middle" font-size="8" fill="#c9a84c" font-family="sans-serif" font-weight="bold">BRAND</text>
            <text x="40" y="40" text-anchor="middle" font-size="4" fill="#c9a84c" font-family="sans-serif" opacity="0.7">EST. 2024</text>
        `),
    },
    {
        id: 'care-strip',
        name: 'Care Strip',
        subtitle: 'Side Seam Care Label',
        description: 'Narrow vertical strip. Mandatory care, content, and origin information.',
        useCase: 'Required legal care label sewn into side seam',
        defaultWidth: 240,
        defaultHeight: 520,
        dimensions: '24 × 52 mm',
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
        `),
    },
    {
        id: 'loop-fold',
        name: 'Loop Fold',
        subtitle: 'Hat / Cap Label',
        description: 'Center folded into a soft loop that protrudes from seam. No crease at top.',
        useCase: 'Bucket hats, caps, beanies — interior loop label',
        defaultWidth: 220,
        defaultHeight: 520,
        dimensions: '22 × 52 mm (unfolded)',
        stitchInset: 22,
        hasTopFold: true,
        hasEndFolds: false,
        thumbnailSvg: makeThumb(`
            <path d="M30 14 Q40 4 50 14 L50 56 L30 56 Z" fill="#f8f5ee" stroke="#bbb" stroke-width="1.2"/>
            <rect x="33" y="18" width="14" height="35" fill="none" stroke="#c9a84c" stroke-width="0.7" stroke-dasharray="2,2"/>
            <text x="40" y="32" text-anchor="middle" font-size="5" fill="#333" font-family="sans-serif" font-weight="bold">BRAND</text>
            <text x="40" y="42" text-anchor="middle" font-size="3.5" fill="#888" font-family="sans-serif">SIZE L</text>
        `),
    },
    {
        id: 'mitre-fold',
        name: 'Mitre Fold',
        subtitle: 'Premium Shirt Label',
        description: 'Corners cut at 45° and folded. Creates clean triangular tabs sewn into seam.',
        useCase: 'Dress shirts, trousers — sewn into collar or waistband',
        defaultWidth: 440,
        defaultHeight: 260,
        dimensions: '44 × 26 mm',
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
        `),
    },
];

export const getLabelStyle = (id: LabelStyleId): LabelStyle =>
    LABEL_STYLES.find(s => s.id === id) ?? LABEL_STYLES[0];
