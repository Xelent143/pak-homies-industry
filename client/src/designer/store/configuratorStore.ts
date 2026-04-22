import { create } from 'zustand';
import { temporal, type TemporalState } from 'zundo';

import type { DecalConfig, MaterialPreset, TextConfig } from '../types';

// Re-export types for convenience
export type { DecalConfig, MaterialPreset, TextConfig } from '../types';

// Stronger normals to exaggerate texture as requested
export const MATERIAL_PRESETS: Record<string, MaterialPreset> = {
    cotton: { name: 'Cotton', roughness: 0.9, metalness: 0, normalScale: 1.5 }, // Boosted from 0.3
    silk: { name: 'Silk', roughness: 0.2, metalness: 0, sheen: 1, normalScale: 1.0 },
    denim: { name: 'Denim', roughness: 0.9, metalness: 0, normalScale: 2.0 }, // Heavy weave
    leather: { name: 'Leather', roughness: 0.4, metalness: 0, clearcoat: 0.3, normalScale: 0.8 },
    velvet: { name: 'Velvet', roughness: 0.8, metalness: 0, sheen: 1, normalScale: 1.2 },
    polyester: { name: 'Polyester', roughness: 0.5, metalness: 0.1, normalScale: 1.0 },
};

interface ConfiguratorState {
    // Model
    modelUrl: string | null;
    isLoading: boolean;
    loadingProgress: number;

    // Colors & Materials
    primaryColor: string;
    secondaryColor: string;
    materialPreset: string;
    recentColors: string[]; // History of used colors

    // Textures
    textureUrl: string | null;
    textureScale: number;

    // Decals
    decals: DecalConfig[];
    selectedDecalId: string | null;
    gizmoMode: 'translate' | 'rotate' | 'scale';
    isGizmoDragging: boolean;

    // Text Overlays
    texts: TextConfig[];
    selectedTextId: string | null;
    pendingText: { text: string; fontFamily: string; color: string } | null;
    isPlacingText: boolean;

    // View
    autoRotate: boolean;
    cameraPosition: [number, number, number];
    cameraTarget: [number, number, number];
    isAIStudioOpen: boolean; // Toggle for Magic Studio

    // Snapshot State
    snapshotRequest: number;
    triggerSnapshot: () => void;

    // Quote Capture State
    quoteImageDataUrl: string | null;
    quoteViews: { label: string; dataUrl: string }[];
    quoteViewsReady: boolean;
    quoteImageRequest: number;
    triggerQuoteCapture: () => void;
    setQuoteImageDataUrl: (dataUrl: string | null) => void;
    setQuoteViews: (views: { label: string; dataUrl: string }[]) => void;
    clearQuoteViews: () => void;

    // Click-to-Place State
    pendingDecalUrl: string | null;
    isPlacingDecal: boolean;
    setPendingDecal: (url: string | null) => void;

    // Actions
    setModelUrl: (url: string | null) => void;
    setLoading: (loading: boolean) => void;
    setLoadingProgress: (progress: number) => void;
    setPrimaryColor: (color: string) => void;
    setSecondaryColor: (color: string) => void;
    addRecentColor: (color: string) => void;
    setAIStudioOpen: (isOpen: boolean) => void;

    // Multi-part support
    selectedMeshName: string | null;
    meshColors: Record<string, string>; // MeshName -> HexColor
    selectMesh: (name: string | null) => void;
    setMeshColor: (name: string, color: string) => void;
    updateMeshColors: (colors: Record<string, string>) => void;

    // Multi-part Pattern
    meshPatterns: Record<string, string>;
    setMeshPattern: (name: string, url: string | null) => void;

    // Per-mesh texture settings (scale, tiling)
    meshTextureSettings: Record<string, { scale: number; tiled: boolean }>;
    setMeshTextureSettings: (meshName: string, settings: { scale?: number; tiled?: boolean }) => void;

    // Grouping
    materialByMesh: Record<string, string>;
    meshMaterialGroups: Record<string, string[]>; // MaterialName -> [MeshNames]
    setMaterialGroups: (matByMesh: Record<string, string>, groups: Record<string, string[]>) => void;

    setCameraTarget: (target: [number, number, number]) => void;
    setMaterialPreset: (preset: string) => void;
    setTextureUrl: (url: string | null) => void;
    setTextureScale: (scale: number) => void;
    addDecal: (decal: DecalConfig) => void;
    updateDecal: (id: string, updates: Partial<DecalConfig>) => void;
    removeDecal: (id: string) => void;
    selectDecal: (id: string | null) => void;
    setGizmoMode: (mode: 'translate' | 'rotate' | 'scale') => void;
    setIsGizmoDragging: (dragging: boolean) => void;
    setAutoRotate: (rotate: boolean) => void;
    resetConfiguration: () => void;
    exportConfiguration: () => object;
    loadConfiguration: (config: object) => void;

    // Text Actions
    addText: (text: TextConfig) => void;
    updateText: (id: string, updates: Partial<TextConfig>) => void;
    removeText: (id: string) => void;
    selectText: (id: string | null) => void;
    setPendingText: (pending: { text: string; fontFamily: string; color: string } | null) => void;

    // Available Parts
    availableMeshes: string[];
    setAvailableMeshes: (meshes: string[]) => void;
}

const initialState = {
    modelUrl: null,
    isLoading: false,
    loadingProgress: 0,
    primaryColor: '#1e88e5',
    secondaryColor: '#f5f5f5',
    recentColors: [],

    selectedMeshName: null,
    meshColors: {} as Record<string, string>, // MeshName -> HexColor
    meshPatterns: {} as Record<string, string>, // MeshName -> PatternURL
    meshTextureSettings: {} as Record<string, { scale: number; tiled: boolean }>, // Per-mesh texture settings

    // Grouping Helpers
    materialByMesh: {} as Record<string, string>,
    meshMaterialGroups: {} as Record<string, string[]>,

    materialPreset: 'cotton',
    textureUrl: null,
    textureScale: 1,
    decals: [],
    selectedDecalId: null,
    gizmoMode: 'translate' as 'translate' | 'rotate' | 'scale',
    isGizmoDragging: false,
    autoRotate: false,
    isAIStudioOpen: false,
    cameraPosition: [0, 0, 5] as [number, number, number],
    cameraTarget: [0, 0, 0] as [number, number, number],
    availableMeshes: [],

    // Text initial state
    texts: [] as TextConfig[],
    selectedTextId: null as string | null,
    pendingText: null as { text: string; fontFamily: string; color: string } | null,
    isPlacingText: false,
};

export const useConfiguratorStore = create<ConfiguratorState>()(
    temporal(
        (set, get) => ({
            ...initialState,

            setModelUrl: (url) => set({ modelUrl: url, isLoading: !!url }),
            setLoading: (loading) => set({ isLoading: loading }),
            setLoadingProgress: (progress) => set({ loadingProgress: progress }),
            setPrimaryColor: (color) => set({ primaryColor: color }),
            setSecondaryColor: (color) => set({ secondaryColor: color }),

            addRecentColor: (color) => set((state) => {
                // Prevent duplicates and keep only last 15
                const newRecent = [color, ...state.recentColors.filter(c => c !== color)].slice(0, 15);
                return { recentColors: newRecent };
            }),

            // New Actions
            selectMesh: (name) => set({ selectedMeshName: name }),
            setMeshColor: (name, color) => set((state) => {
                // Check if this mesh belongs to a material group (e.g. Stitching)
                const materialName = state.materialByMesh[name];
                const group = materialName && (
                    materialName.toLowerCase().includes('stitch') ||
                    materialName.toLowerCase().includes('seam') ||
                    materialName.toLowerCase().includes('thread')
                ) ? state.meshMaterialGroups[materialName] : null;

                const newColors = { ...state.meshColors };

                if (group) {
                    // Apply to ALL meshes in the group
                    group.forEach(meshName => {
                        newColors[meshName] = color;
                    });
                } else {
                    // Apply only to single mesh
                    newColors[name] = color;
                }

                return {
                    meshColors: newColors,
                    // selectedMeshName: null // REMOVED: Keep selected for continuous editing
                };
            }),
            updateMeshColors: (colors) => set((state) => ({
                meshColors: { ...state.meshColors, ...colors }
            })),

            // Pattern / Texture Support per Mesh
            setMeshPattern: (name, url) => set((state) => ({
                meshPatterns: { ...state.meshPatterns, [name]: url || '' },
            })),

            // Per-mesh texture settings
            setMeshTextureSettings: (meshName, settings) => set((state) => {
                const current = state.meshTextureSettings[meshName] || { scale: 1, tiled: true };
                return {
                    meshTextureSettings: {
                        ...state.meshTextureSettings,
                        [meshName]: { ...current, ...settings }
                    }
                };
            }),

            setMaterialGroups: (matByMesh, groups) => set({
                materialByMesh: matByMesh,
                meshMaterialGroups: groups
            }),

            setMaterialPreset: (preset) => set({ materialPreset: preset }),
            setTextureUrl: (url) => set({ textureUrl: url }),
            setTextureScale: (scale) => set({ textureScale: scale }),

            addDecal: (decal) => set((state) => ({
                decals: [...state.decals, decal]
            })),

            updateDecal: (id, updates) => set((state) => ({
                decals: state.decals.map((d) =>
                    d.id === id ? { ...d, ...updates } : d
                )
            })),

            removeDecal: (id) => set((state) => ({
                decals: state.decals.filter((d) => d.id !== id),
                selectedDecalId: state.selectedDecalId === id ? null : state.selectedDecalId
            })),

            selectDecal: (id) => set({ selectedDecalId: id }),
            setGizmoMode: (mode) => set({ gizmoMode: mode }),
            setIsGizmoDragging: (dragging) => set({ isGizmoDragging: dragging }),

            setAutoRotate: (rotate) => set({ autoRotate: rotate }),
            setAIStudioOpen: (isOpen) => set({ isAIStudioOpen: isOpen }),

            setCameraTarget: (target) => set({ cameraTarget: target }),

            // Snapshot Logic
            snapshotRequest: 0,
            triggerSnapshot: () => set({ snapshotRequest: Date.now() }),

            // Quote Capture Logic
            quoteImageDataUrl: null,
            quoteViews: [],
            quoteViewsReady: false,
            quoteImageRequest: 0,
            triggerQuoteCapture: () => set({ quoteImageRequest: Date.now(), quoteViewsReady: false, quoteViews: [] }),
            setQuoteImageDataUrl: (dataUrl) => set({ quoteImageDataUrl: dataUrl }),
            setQuoteViews: (views) => set({ quoteViews: views, quoteViewsReady: views.length >= 4 }),
            clearQuoteViews: () => set({ quoteViews: [], quoteViewsReady: false }),

            // Click-to-Place Logic
            pendingDecalUrl: null,
            isPlacingDecal: false,
            setPendingDecal: (url) => set({ pendingDecalUrl: url, isPlacingDecal: !!url }),

            // Text Actions
            addText: (text) => set((state) => ({
                texts: [...state.texts, text],
                pendingText: null,
                isPlacingText: false
            })),

            updateText: (id, updates) => set((state) => ({
                texts: state.texts.map((t) =>
                    t.id === id ? { ...t, ...updates } : t
                )
            })),

            removeText: (id) => set((state) => ({
                texts: state.texts.filter((t) => t.id !== id),
                selectedTextId: state.selectedTextId === id ? null : state.selectedTextId
            })),

            selectText: (id) => set({ selectedTextId: id, selectedDecalId: null }),

            setPendingText: (pending) => set({
                pendingText: pending,
                isPlacingText: !!pending,
                // Clear decal placement if starting text placement
                pendingDecalUrl: pending ? null : null,
                isPlacingDecal: pending ? false : false
            }),

            resetConfiguration: () => set(initialState),

            exportConfiguration: () => {
                const state = get();
                return {
                    primaryColor: state.primaryColor,
                    secondaryColor: state.secondaryColor,
                    materialPreset: state.materialPreset,
                    textureUrl: state.textureUrl,
                    textureScale: state.textureScale,
                    decals: state.decals,
                    texts: state.texts,
                    meshColors: state.meshColors,
                    recentColors: state.recentColors,
                };
            },

            loadConfiguration: (config: any) => set({
                primaryColor: config.primaryColor || initialState.primaryColor,
                secondaryColor: config.secondaryColor || initialState.secondaryColor,
                recentColors: Array.isArray(config.recentColors) ? config.recentColors : [],
                materialPreset: config.materialPreset || initialState.materialPreset,
                textureUrl: config.textureUrl || null,
                textureScale: config.textureScale || 1,
                decals: config.decals || [],
                texts: config.texts || [],
                meshColors: config.meshColors || {},
            }),

            setAvailableMeshes: (meshes) => set({ availableMeshes: meshes }),
        }),
        {
            // Only track state related to the design, ignore view/loading state
            partialize: (state) => {
                const {
                    primaryColor,
                    secondaryColor,
                    materialPreset,
                    textureUrl,
                    textureScale,
                    decals,
                    texts,
                    meshColors,
                    meshPatterns,
                    recentColors
                } = state;
                return {
                    primaryColor,
                    secondaryColor,
                    materialPreset,
                    textureUrl,
                    textureScale,
                    decals,
                    texts,
                    meshColors,
                    meshPatterns,
                    recentColors
                };
            },
            limit: 50 // Keep last 50 steps
        }
    )
) as unknown as import('zustand').UseBoundStore<import('zustand').StoreApi<ConfiguratorState>> & { temporal: TemporalState<ConfiguratorState> };
