import { create } from 'zustand';
import type { PartColorDef } from '../utils/RasterEngine';

export interface DesignPart {
    id: string;
    color: string;
    patternUrl: string | null;
}

export interface DesignText {
    id: string;
    text: string;
    fontFamily: string;
    fontSize: number;
    fill: string;
    left: number;
    top: number;
}

export interface DesignLogo {
    id: string;
    imageUrl: string;
    left: number;
    top: number;
    scaleX: number;
    scaleY: number;
}

// ─── Pending Placement ──────────────────────────────────────────────────────
export type PendingPlacement =
    | { type: 'logo'; imageUrl: string }
    | { type: 'text'; text: string; fontFamily: string; fontSize: number; fill: string }
    | { type: 'pattern'; patternId: string; patternUrl: string; patternScale?: number };

interface Design2DState {
    // ── SVG Template ──
    templateId: number | null;
    templateSlug: string | null;
    templateName: string;
    svgData: string;
    partNames: string[];

    // ── Raster Template ──
    isRasterMode: boolean;
    rasterImageUrl: string | null;
    rasterParts: PartColorDef[];
    /** Current raster part colors (partId → hex). Starts from originalColors. */
    rasterPartColors: Record<string, string>;

    // Part colors (SVG mode)
    partColors: Record<string, string>;
    partPatterns: Record<string, string | null>;

    // Selection
    selectedPartId: string | null;
    activeTool: 'select' | 'color' | 'logo' | 'text' | 'pattern' | 'preset' | 'save' | 'export';

    // Placement mode
    pendingPlacement: PendingPlacement | null;

    // Canvas ref
    canvasReady: boolean;

    // ── Actions ──
    setTemplate: (id: number, slug: string, name: string, svgData: string, partNames: string[]) => void;
    setRasterTemplate: (id: number, name: string, imageUrl: string, parts: PartColorDef[]) => void;
    setPartColor: (partId: string, color: string) => void;
    setRasterPartColor: (partId: string, color: string) => void;
    setPartPattern: (partId: string, patternUrl: string | null) => void;
    selectPart: (partId: string | null) => void;
    setActiveTool: (tool: Design2DState['activeTool']) => void;
    setCanvasReady: (ready: boolean) => void;
    setPendingPlacement: (p: PendingPlacement | null) => void;
    resetDesign: () => void;
}

export const useDesign2DStore = create<Design2DState>((set) => ({
    // SVG Template
    templateId: null,
    templateSlug: null,
    templateName: '',
    svgData: '',
    partNames: [],

    // Raster Template
    isRasterMode: false,
    rasterImageUrl: null,
    rasterParts: [],
    rasterPartColors: {},

    // Part state
    partColors: {},
    partPatterns: {},

    // Selection
    selectedPartId: null,
    activeTool: 'select',

    // Placement mode
    pendingPlacement: null,

    // Canvas
    canvasReady: false,

    // ── Actions ──

    /** Load an SVG template (existing flow) */
    setTemplate: (id, slug, name, svgData, partNames) => {
        const defaultColors: Record<string, string> = {};
        partNames.forEach(p => { defaultColors[p] = '#1a1a2e'; });
        set({
            templateId: id,
            templateSlug: slug,
            templateName: name,
            svgData,
            partNames,
            partColors: defaultColors,
            partPatterns: {},
            selectedPartId: null,
            pendingPlacement: null,
            canvasReady: false,
            // Clear raster state
            isRasterMode: false,
            rasterImageUrl: null,
            rasterParts: [],
            rasterPartColors: {},
        });
    },

    /** Load a raster template */
    setRasterTemplate: (id, name, imageUrl, parts) => {
        const defaultColors: Record<string, string> = {};
        parts.forEach(p => { defaultColors[p.partId] = p.originalColor; });
        set({
            templateId: id,
            templateSlug: null,
            templateName: name,
            // Clear SVG state
            svgData: '',
            partNames: [],
            partColors: {},
            partPatterns: {},
            // Set raster state
            isRasterMode: true,
            rasterImageUrl: imageUrl,
            rasterParts: parts,
            rasterPartColors: defaultColors,
            selectedPartId: null,
            pendingPlacement: null,
            canvasReady: false,
            activeTool: 'color',
        });
    },

    setPartColor: (partId, color) => set(state => ({
        partColors: { ...state.partColors, [partId]: color },
    })),

    setRasterPartColor: (partId, color) => set(state => ({
        rasterPartColors: { ...state.rasterPartColors, [partId]: color },
    })),

    setPartPattern: (partId, patternUrl) => set(state => ({
        partPatterns: { ...state.partPatterns, [partId]: patternUrl },
    })),

    selectPart: (partId) => set({ selectedPartId: partId }),

    setActiveTool: (tool) => set({ activeTool: tool }),

    setCanvasReady: (ready) => set({ canvasReady: ready }),

    setPendingPlacement: (p) => set({ pendingPlacement: p }),

    resetDesign: () => set(state => {
        if (state.isRasterMode) {
            const defaultColors: Record<string, string> = {};
            state.rasterParts.forEach(p => { defaultColors[p.partId] = p.originalColor; });
            return {
                rasterPartColors: defaultColors,
                selectedPartId: null,
                pendingPlacement: null,
                activeTool: 'color',
            };
        }
        const defaultColors: Record<string, string> = {};
        state.partNames.forEach(p => { defaultColors[p] = '#1a1a2e'; });
        return {
            partColors: defaultColors,
            partPatterns: {},
            selectedPartId: null,
            pendingPlacement: null,
            activeTool: 'select',
        };
    }),
}));
