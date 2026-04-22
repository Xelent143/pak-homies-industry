import React, { useMemo } from 'react';
import { Decal, useTexture } from '@react-three/drei';
import { useConfiguratorStore } from '../store/configuratorStore';
import * as THREE from 'three';
import type { DecalEffect } from '../types';

interface DecalRendererProps {
    meshRef: React.RefObject<THREE.Mesh>;
}

// Effect texture paths
const EFFECT_TEXTURES = {
    embroidery: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/wnVUWgyHXQnKCJAq.png',
    applique: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/ddhMukjtFQROeMxi.png',
};

// Material properties for each effect
const EFFECT_MATERIALS: Record<DecalEffect, {
    roughness: number;
    metalness: number;
    bumpScale?: number;
    clearcoat?: number;
    sheen?: number;
}> = {
    digital: { roughness: 0.3, metalness: 0 },
    screen: { roughness: 0.8, metalness: 0 },
    embroidery: { roughness: 0.5, metalness: 0.1, bumpScale: 0.15, sheen: 0.8 },
    applique: { roughness: 0.8, metalness: 0, bumpScale: 0.08, clearcoat: 0.1 },
};

export const DecalRenderer: React.FC<DecalRendererProps> = ({ meshRef }) => {
    const { decals } = useConfiguratorStore();

    return (
        <>
            {decals.map((decal) => (
                <DecalItem
                    key={`${decal.id}-${decal.effect || 'digital'}`}
                    decal={decal}
                    meshRef={meshRef}
                />
            ))}
        </>
    );
};

interface DecalItemProps {
    decal: {
        id: string;
        textureUrl: string;
        position: [number, number, number];
        rotation: [number, number, number];
        scale: [number, number, number];
        effect?: DecalEffect;
    };
    meshRef: React.RefObject<THREE.Mesh>;
}

// OPTIMIZATION: Wrapped with React.memo to prevent unnecessary re-renders
const DecalItem: React.FC<DecalItemProps> = React.memo(({ decal, meshRef }) => {
    const effect = decal.effect || 'digital';
    const materialProps = EFFECT_MATERIALS[effect];

    // Load main texture
    const texture = useTexture(decal.textureUrl);

    // Load effect textures conditionally
    const needsEffectTexture = effect === 'embroidery' || effect === 'applique';
    const effectTexturePath = needsEffectTexture
        ? (effect === 'embroidery' ? EFFECT_TEXTURES.embroidery : EFFECT_TEXTURES.applique)
        : null;

    // Always load a texture (use main texture as fallback for conditional loading)
    const effectTexture = useTexture(effectTexturePath || decal.textureUrl);

    // Configure textures - memoized
    useMemo(() => {
        if (texture) {
            texture.colorSpace = THREE.SRGBColorSpace;
        }
        if (effectTexture && needsEffectTexture) {
            effectTexture.wrapS = THREE.RepeatWrapping;
            effectTexture.wrapT = THREE.RepeatWrapping;
            effectTexture.repeat.set(8, 8); // Tile the effect texture
        }
    }, [texture, effectTexture, needsEffectTexture]);

    if (!meshRef.current) return null;

    return (
        <Decal
            mesh={meshRef}
            position={decal.position}
            rotation={decal.rotation}
            scale={decal.scale}
        >
            <meshPhysicalMaterial
                map={texture}
                transparent
                polygonOffset
                polygonOffsetFactor={-2}
                depthTest
                depthWrite={false}
                roughness={materialProps.roughness}
                metalness={materialProps.metalness}
                bumpMap={needsEffectTexture ? effectTexture : undefined}
                bumpScale={materialProps.bumpScale || 0}
                clearcoat={materialProps.clearcoat || 0}
                sheen={materialProps.sheen || 0}
                sheenColor={new THREE.Color(0xffffff)}
            />
        </Decal>
    );
}, (prevProps, nextProps) => {
    // Custom comparison - only re-render if this specific decal changed
    return (
        prevProps.decal.id === nextProps.decal.id &&
        prevProps.decal.textureUrl === nextProps.decal.textureUrl &&
        prevProps.decal.position === nextProps.decal.position &&
        prevProps.decal.rotation === nextProps.decal.rotation &&
        prevProps.decal.scale === nextProps.decal.scale &&
        prevProps.decal.effect === nextProps.decal.effect &&
        prevProps.meshRef === nextProps.meshRef
    );
});
