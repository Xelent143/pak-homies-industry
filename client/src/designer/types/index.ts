// Decal effect type - different printing/application techniques
export type DecalEffect = 'digital' | 'screen' | 'embroidery' | 'applique';

// Decal configuration type
export interface DecalConfig {
    id: string;
    textureUrl: string;
    position: [number, number, number];
    rotation: [number, number, number]; // [x, y, z] - Z is user-adjustable spin
    scale: [number, number, number];
    isBackSide?: boolean; // true = placed on back of model, false/undefined = front
    aspectRatio?: number; // width/height ratio of the decal image (default: 1)
    effect?: DecalEffect; // Print effect (default: 'digital')
}

// Text overlay configuration type
export interface TextConfig {
    id: string;
    text: string;
    fontFamily: string;
    color: string;
    position: [number, number, number];
    rotation: [number, number, number]; // [x, y, z] - Z is user-adjustable spin
    scale: [number, number, number];
    isBackSide?: boolean; // true = placed on back of model, false/undefined = front
    aspectRatio?: number; // width/height ratio of the rendered text (calculated from canvas)
}

// Material preset type
export interface MaterialPreset {
    name: string;
    roughness: number;
    metalness: number;
    sheen?: number;
    clearcoat?: number;
    normalScale?: number;
}
