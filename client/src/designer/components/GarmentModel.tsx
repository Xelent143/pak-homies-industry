import React, { useEffect, useMemo, useState, useRef, Suspense } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useConfiguratorStore, MATERIAL_PRESETS } from '../store/configuratorStore';

import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import type { DecalConfig, TextConfig } from '../types';
import { DecalSmartControls } from './DecalSmartControls';

interface GarmentModelProps {
    url: string;
}

// Surface-projected decal component - OPTIMIZED
const SurfaceDecalInner: React.FC<{
    decal: DecalConfig;
    meshes: THREE.Mesh[];
    isSelected: boolean;
    onUpdate: (updates: Partial<DecalConfig>) => void;
    onSelect: () => void;
    controlMode: 'translate' | 'rotate' | 'scale';
}> = ({ decal, meshes, isSelected, onUpdate, onSelect, controlMode }) => {
    const texture = useTexture(decal.textureUrl);
    const groupRef = useRef<THREE.Group>(null);

    const decalMeshRef = useRef<THREE.Mesh | null>(null);
    const [hitPoint, setHitPoint] = useState<THREE.Vector3 | null>(null);
    const [hitOrientation, setHitOrientation] = useState<THREE.Euler | null>(null);

    // OPTIMIZATION: Track dragging state to defer expensive geometry updates
    const [isDragging, setIsDragging] = useState(false);

    // ===== REAL-TIME PREVIEW STATE (updates instantly during drag) =====
    const [livePreviewPos, setLivePreviewPos] = useState<THREE.Vector3 | null>(null);
    const [livePreviewScale, setLivePreviewScale] = useState<number>(decal.scale[0]);
    const [livePreviewRotation, setLivePreviewRotation] = useState<number>(0);

    // OPTIMIZATION: Stable state - only updates when dragging stops
    const [stablePosition, setStablePosition] = useState(decal.position);
    const [stableRotation, setStableRotation] = useState(decal.rotation);
    const [stableScale, setStableScale] = useState(decal.scale);

    // Configure texture once
    useEffect(() => {
        if (texture) {
            texture.colorSpace = THREE.SRGBColorSpace;
        }
    }, [texture]);

    // Update stable values with debounce when NOT dragging (geometry rebuilds then)
    useEffect(() => {
        if (!isDragging) {
            // Debounce to prevent rapid geometry rebuilds
            const timer = setTimeout(() => {
                setStablePosition(decal.position);
                setStableRotation(decal.rotation);
                setStableScale(decal.scale);
            }, 100); // 100ms debounce
            return () => clearTimeout(timer);
        }
    }, [decal.position, decal.rotation, decal.scale, isDragging]);

    // OPTIMIZATION: Memoized decal geometry creation - only runs when stable values change
    const decalMesh = useMemo(() => {
        if (!texture || meshes.length === 0) return null;

        // Determine Projection Side based on isBackSide field (not rotation)
        // This field is set once during placement and never changes
        const isBackSide = decal.isBackSide === true;
        const rotationY = isBackSide ? Math.PI : 0;
        const projectorRotation = new THREE.Euler(0, rotationY, 0);

        // Map stored [x,y] loosely to world [x,y] but keep Z distant
        // This puts the projector at Z=2 for Front, Z=-2 for Back.
        // IMPORTANT: Use consistent scaling for X and Y to prevent distortion
        const posScale = 0.5; // Consistent scale for both axes
        const rayOrigin = new THREE.Vector3(
            stablePosition[0] * posScale,
            stablePosition[1] * posScale,
            2
        );
        rayOrigin.applyEuler(projectorRotation);

        const rayDirection = new THREE.Vector3(0, 0, -1);
        rayDirection.applyEuler(projectorRotation);

        const raycaster = new THREE.Raycaster();
        raycaster.set(rayOrigin, rayDirection);

        const allIntersections: THREE.Intersection[] = [];
        meshes.forEach(mesh => {
            const intersections = raycaster.intersectObject(mesh, false);
            allIntersections.push(...intersections);
        });

        allIntersections.sort((a, b) => a.distance - b.distance);

        if (allIntersections.length === 0) {
            return null;
        }

        const hit = allIntersections[0];
        const hitNormal = hit.face?.normal || new THREE.Vector3(0, 0, 1);
        const hitMesh = hit.object as THREE.Mesh;

        const worldNormal = hitNormal.clone();
        worldNormal.transformDirection(hitMesh.matrixWorld);

        const orientation = new THREE.Euler();
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), worldNormal);
        orientation.setFromQuaternion(quaternion);
        orientation.z += stableRotation[2] + (isBackSide ? Math.PI : 0); // Roll (Z rot) from user slider + Backside correction

        const size = new THREE.Vector3(
            stableScale[0] * 0.5,
            (stableScale[0] * 0.5) / (decal.aspectRatio || 1), // Height adjusted by aspect ratio
            0.2
        );

        try {
            const decalGeometry = new DecalGeometry(
                hitMesh,
                hit.point,
                orientation,
                size
            );

            // Note: The projection orientation handles texture orientation correctly
            // No UV flip is needed for back-side decals

            const decalMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.01,
                depthTest: false,
                depthWrite: false,
                polygonOffset: true,
                polygonOffsetFactor: -10,
                polygonOffsetUnits: -10,
                side: THREE.FrontSide,
            });

            const mesh = new THREE.Mesh(decalGeometry, decalMaterial);
            mesh.renderOrder = 10;
            mesh.userData = { isDecal: true };

            // Store hit info for gizmo positioning
            setHitPoint(hit.point.clone());
            setHitOrientation(orientation.clone());

            return mesh;
        } catch (error) {
            console.warn('Decal creation failed:', error);
            return null;
        }
    }, [texture, meshes, stablePosition, stableRotation, stableScale, decal.isBackSide, decal.aspectRatio]);



    // Store mesh ref for cleanup
    useEffect(() => {
        decalMeshRef.current = decalMesh;
        return () => {
            if (decalMeshRef.current) {
                decalMeshRef.current.geometry?.dispose();
                (decalMeshRef.current.material as THREE.Material)?.dispose();
            }
        };
    }, [decalMesh]);

    // Proxy object for TransformControls
    const proxyRef = useRef<THREE.Mesh>(null);
    const [proxyReady, setProxyReady] = useState(false);

    // Track when proxy mesh is mounted
    useEffect(() => {
        if (proxyRef.current) {
            setProxyReady(true);
        }
        return () => setProxyReady(false);
    }, []);

    useEffect(() => {
        if (proxyRef.current && hitPoint && hitOrientation) {
            proxyRef.current.position.copy(hitPoint);
            if (controlMode === 'translate') {
                proxyRef.current.rotation.set(0, 0, 0);
            } else {
                proxyRef.current.rotation.copy(hitOrientation);
            }
            proxyRef.current.scale.setScalar(decal.scale[0] * 0.5);
        }
    }, [hitPoint, hitOrientation, decal.scale, controlMode]);



    // Handle click/tap on decal to select it
    const handleDecalClick = (e: any) => {
        e.stopPropagation();
        onSelect();
    };

    // Imperatively add decal mesh to avoid R3F trying to set data-loc on a raw Three.js object
    useEffect(() => {
        const group = groupRef.current;
        if (!group) return;
        if (decalMesh && !isDragging) {
            group.add(decalMesh);
        }
        return () => {
            if (group && decalMesh) {
                group.remove(decalMesh);
            }
        };
    }, [decalMesh, isDragging]);

    return (
        <group ref={groupRef}>

            {/* ===== REAL-TIME DRAG PREVIEW ===== */}
            {/* Lightweight plane that follows the gizmo position INSTANTLY during drag */}
            {isDragging && livePreviewPos && texture && (
                <mesh
                    position={livePreviewPos}
                    rotation={[0, 0, livePreviewRotation]}
                    renderOrder={5}
                >
                    <planeGeometry args={[livePreviewScale * 0.5, (livePreviewScale * 0.5) / (decal.aspectRatio || 1)]} />
                    <meshBasicMaterial
                        map={texture}
                        transparent
                        opacity={0.85}
                        depthTest={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* Selection indicator - shows when this decal is selected */}
            {isSelected && hitPoint && (
                <mesh position={hitPoint} renderOrder={2}>
                    <ringGeometry args={[decal.scale[0] * 0.25, decal.scale[0] * 0.28, 32]} />
                    <meshBasicMaterial
                        color="#6366f1"
                        transparent
                        opacity={0.8}
                        side={THREE.DoubleSide}
                        depthTest={false}
                    />
                </mesh>
            )}

            {/* INVISIBLE HITBOX - Always present for reliable click/tap detection */}
            {hitPoint && !isSelected && (
                <mesh
                    position={hitPoint}
                    onDoubleClick={handleDecalClick}
                    renderOrder={3}
                >
                    <sphereGeometry args={[decal.scale[0] * 0.3, 8, 8]} />
                    <meshBasicMaterial transparent opacity={0} />
                </mesh>
            )}

            {/* Proxy mesh MUST be rendered before TransformControls so ref is available */}
            <mesh
                ref={(node) => {
                    (proxyRef as any).current = node;
                    if (node && !proxyReady) setProxyReady(true);
                }}
                visible={false}
            >
                <boxGeometry args={[0.5, 0.5, 0.1]} />
                <meshBasicMaterial color="red" wireframe />
            </mesh>

            {/* NEW: Smart Controls (Replacing TransformControls) */}
            {isSelected && hitPoint && proxyReady && proxyRef.current && (
                <DecalSmartControls
                    object={proxyRef.current}
                    meshes={meshes}
                    onStart={() => {
                        setIsDragging(true);
                        useConfiguratorStore.getState().setIsGizmoDragging(true);
                        // Initialize live preview
                        if (proxyRef.current) {
                            setLivePreviewPos(proxyRef.current.position.clone());
                            setLivePreviewScale(proxyRef.current.scale.x * 2);
                            setLivePreviewRotation(proxyRef.current.rotation.z);
                        }
                    }}
                    onUpdate={() => {
                        if (proxyRef.current) {
                            // Update live preview instantly
                            setLivePreviewPos(proxyRef.current.position.clone());
                            setLivePreviewScale(proxyRef.current.scale.x * 2);
                            setLivePreviewRotation(proxyRef.current.rotation.z);
                        }
                    }}
                    onEnd={() => {
                        // Finalize logic
                        if (proxyRef.current && hitOrientation) {
                            const finalUpdates: Partial<DecalConfig> = {};
                            const posScale = 0.5;
                            finalUpdates.position = [
                                proxyRef.current.position.x / posScale,
                                proxyRef.current.position.y / posScale,
                                decal.position[2]
                            ];

                            // Fix rotation jump: Calculate relative spin only
                            // hitOrientation.z contains (BaseZ + UserSpin)
                            // We want NewUserSpin = ProxyZ - BaseZ
                            // BaseZ = hitOrientation.z - CurrentUserSpin
                            const currentSpin = decal.rotation[2];
                            const baseZ = hitOrientation.z - currentSpin;
                            const newSpin = proxyRef.current.rotation.z - baseZ;

                            finalUpdates.rotation = [0, 0, newSpin];

                            finalUpdates.scale = [
                                proxyRef.current.scale.x * 2,
                                proxyRef.current.scale.x * 2,
                                proxyRef.current.scale.x * 2
                            ];
                            onUpdate(finalUpdates);
                        }
                        setIsDragging(false);
                        useConfiguratorStore.getState().setIsGizmoDragging(false);
                        setLivePreviewPos(null);
                    }}
                />
            )}
        </group>
    );
};

// OPTIMIZATION: Wrap with React.memo and custom comparison
const SurfaceDecal = React.memo(SurfaceDecalInner, (prevProps, nextProps) => {
    // Only re-render if meaningful props changed
    if (prevProps.isSelected !== nextProps.isSelected) return false;
    if (prevProps.controlMode !== nextProps.controlMode) return false;
    if (prevProps.decal.id !== nextProps.decal.id) return false;
    if (prevProps.decal.textureUrl !== nextProps.decal.textureUrl) return false;

    // For position/rotation/scale, allow re-render (but internal debouncing handles perf)
    if (prevProps.decal.position !== nextProps.decal.position) return false;
    if (prevProps.decal.rotation !== nextProps.decal.rotation) return false;
    if (prevProps.decal.scale !== nextProps.decal.scale) return false;

    // Meshes array reference check (usually stable)
    if (prevProps.meshes !== nextProps.meshes) return false;

    return true; // Props are equal, skip re-render
});

// ===== SURFACE TEXT DECAL COMPONENT =====
// Similar to SurfaceDecal but renders text using canvas-to-texture
const SurfaceTextDecalInner: React.FC<{
    textConfig: TextConfig;
    meshes: THREE.Mesh[];
    isSelected: boolean;
    onUpdate: (updates: Partial<TextConfig>) => void;
    onSelect: () => void;
    controlMode: 'translate' | 'rotate' | 'scale';
}> = ({ textConfig, meshes, isSelected, onUpdate, onSelect, controlMode }) => {
    const groupRef = useRef<THREE.Group>(null);
    const decalMeshRef = useRef<THREE.Mesh | null>(null);
    const [hitPoint, setHitPoint] = useState<THREE.Vector3 | null>(null);
    const [hitOrientation, setHitOrientation] = useState<THREE.Euler | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [livePreviewPos, setLivePreviewPos] = useState<THREE.Vector3 | null>(null);
    const [livePreviewScale, setLivePreviewScale] = useState<number>(textConfig.scale[0]);
    const [livePreviewRotation, setLivePreviewRotation] = useState<number>(0);

    // Stable state for geometry rebuilds
    const [stablePosition, setStablePosition] = useState(textConfig.position);
    const [stableRotation, setStableRotation] = useState(textConfig.rotation);
    const [stableScale, setStableScale] = useState(textConfig.scale);

    // Create texture from text using canvas
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // High resolution for crisp text
        const fontSize = 200;
        const padding = 40;

        // Set font and measure text
        ctx.font = `bold ${fontSize}px "${textConfig.fontFamily}", sans-serif`;
        const metrics = ctx.measureText(textConfig.text);
        const textWidth = metrics.width;
        const textHeight = fontSize * 1.2;

        // Set canvas size (power of 2 for better GPU performance)
        canvas.width = Math.min(2048, Math.pow(2, Math.ceil(Math.log2(textWidth + padding * 2))));
        canvas.height = Math.min(1024, Math.pow(2, Math.ceil(Math.log2(textHeight + padding * 2))));

        // Clear canvas with transparency
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw text (font needs to be set again after resize)
        ctx.font = `bold ${fontSize}px "${textConfig.fontFamily}", sans-serif`;
        ctx.fillStyle = textConfig.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(textConfig.text, canvas.width / 2, canvas.height / 2);

        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        return tex;
    }, [textConfig.text, textConfig.fontFamily, textConfig.color]);

    // Update stable values with debounce when NOT dragging
    useEffect(() => {
        if (!isDragging) {
            const timer = setTimeout(() => {
                setStablePosition(textConfig.position);
                setStableRotation(textConfig.rotation);
                setStableScale(textConfig.scale);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [textConfig.position, textConfig.rotation, textConfig.scale, isDragging]);

    // Create decal mesh
    const decalMesh = useMemo(() => {
        if (!texture || meshes.length === 0) return null;

        const isBackSide = (textConfig as any).isBackSide === true;
        const rotationY = isBackSide ? Math.PI : 0;
        const projectorRotation = new THREE.Euler(0, rotationY, 0);

        const posScale = 0.5;
        const rayOrigin = new THREE.Vector3(
            stablePosition[0] * posScale,
            stablePosition[1] * posScale,
            2
        );
        rayOrigin.applyEuler(projectorRotation);

        const rayDirection = new THREE.Vector3(0, 0, -1);
        rayDirection.applyEuler(projectorRotation);

        const raycaster = new THREE.Raycaster();
        raycaster.set(rayOrigin, rayDirection);

        const allIntersections: THREE.Intersection[] = [];
        meshes.forEach(mesh => {
            const intersections = raycaster.intersectObject(mesh, false);
            allIntersections.push(...intersections);
        });

        allIntersections.sort((a, b) => a.distance - b.distance);

        if (allIntersections.length === 0) return null;

        const hit = allIntersections[0];
        const hitNormal = hit.face?.normal || new THREE.Vector3(0, 0, 1);
        const hitMesh = hit.object as THREE.Mesh;

        const worldNormal = hitNormal.clone();
        worldNormal.transformDirection(hitMesh.matrixWorld);

        const orientation = new THREE.Euler();
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), worldNormal);
        orientation.setFromQuaternion(quaternion);
        orientation.z += stableRotation[2] + (isBackSide ? Math.PI : 0);

        const size = new THREE.Vector3(
            stableScale[0] * 0.5,
            (stableScale[0] * 0.5) / (textConfig.aspectRatio || 1),
            0.2
        );



        try {
            const decalGeometry = new DecalGeometry(
                hitMesh,
                hit.point,
                orientation,
                size
            );

            // Note: For text, the canvas is already flipped in the texture creation
            // so we don't need to flip UV here (that would cause double-flip)

            const decalMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.01,
                depthTest: false,
                depthWrite: false,
                polygonOffset: true,
                polygonOffsetFactor: -10,
                polygonOffsetUnits: -10,
                side: THREE.FrontSide,
            });

            const mesh = new THREE.Mesh(decalGeometry, decalMaterial);
            mesh.renderOrder = 10;
            mesh.userData = { isTextDecal: true };

            setHitPoint(hit.point.clone());
            setHitOrientation(orientation.clone());

            return mesh;
        } catch (error) {
            console.warn('Text decal creation failed:', error);
            return null;
        }
    }, [texture, meshes, stablePosition, stableRotation, stableScale, textConfig.isBackSide]);

    // Cleanup
    useEffect(() => {
        decalMeshRef.current = decalMesh;
        return () => {
            if (decalMeshRef.current) {
                decalMeshRef.current.geometry?.dispose();
                (decalMeshRef.current.material as THREE.Material)?.dispose();
            }
        };
    }, [decalMesh]);

    // Proxy for controls
    const proxyRef = useRef<THREE.Mesh>(null);
    const [proxyReady, setProxyReady] = useState(false);

    useEffect(() => {
        if (proxyRef.current) setProxyReady(true);
        return () => setProxyReady(false);
    }, []);

    useEffect(() => {
        if (proxyRef.current && hitPoint && hitOrientation) {
            proxyRef.current.position.copy(hitPoint);
            if (controlMode === 'translate') {
                proxyRef.current.rotation.set(0, 0, 0);
            } else {
                proxyRef.current.rotation.copy(hitOrientation);
            }
            proxyRef.current.scale.setScalar(textConfig.scale[0] * 0.5);
        }
    }, [hitPoint, hitOrientation, textConfig.scale, controlMode]);

    const handleClick = (e: any) => {
        e.stopPropagation();
        onSelect();
    };

    // Imperatively add text decal mesh to avoid R3F data-loc error on raw Three.js objects
    useEffect(() => {
        const group = groupRef.current;
        if (!group) return;
        if (decalMesh && !isDragging) {
            group.add(decalMesh);
        }
        return () => {
            if (group && decalMesh) {
                group.remove(decalMesh);
            }
        };
    }, [decalMesh, isDragging]);

    return (
        <group ref={groupRef}>

            {/* Live preview during drag */}
            {isDragging && livePreviewPos && texture && (
                <mesh
                    position={livePreviewPos}
                    rotation={[0, 0, livePreviewRotation]}
                    renderOrder={5}
                >
                    <planeGeometry args={[livePreviewScale * 0.5, (livePreviewScale * 0.5) / (textConfig.aspectRatio || 1)]} />
                    <meshBasicMaterial
                        map={texture}
                        transparent
                        opacity={0.85}
                        depthTest={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}

            {/* Selection ring */}
            {isSelected && hitPoint && (
                <mesh position={hitPoint} renderOrder={2}>
                    <ringGeometry args={[textConfig.scale[0] * 0.25, textConfig.scale[0] * 0.28, 32]} />
                    <meshBasicMaterial
                        color="#10b981"
                        transparent
                        opacity={0.8}
                        side={THREE.DoubleSide}
                        depthTest={false}
                    />
                </mesh>
            )}

            {/* Hitbox for selection */}
            {hitPoint && !isSelected && (
                <mesh
                    position={hitPoint}
                    onDoubleClick={handleClick}
                    renderOrder={3}
                >
                    <sphereGeometry args={[textConfig.scale[0] * 0.3, 8, 8]} />
                    <meshBasicMaterial transparent opacity={0} />
                </mesh>
            )}

            {/* Proxy mesh for controls */}
            <mesh
                ref={(node) => {
                    (proxyRef as any).current = node;
                    if (node && !proxyReady) setProxyReady(true);
                }}
                visible={false}
            >
                <boxGeometry args={[0.5, 0.5, 0.1]} />
                <meshBasicMaterial color="green" wireframe />
            </mesh>

            {/* Smart Controls */}
            {isSelected && hitPoint && proxyReady && proxyRef.current && (
                <DecalSmartControls
                    object={proxyRef.current}
                    meshes={meshes}
                    onStart={() => {
                        setIsDragging(true);
                        useConfiguratorStore.getState().setIsGizmoDragging(true);
                        if (proxyRef.current) {
                            setLivePreviewPos(proxyRef.current.position.clone());
                            setLivePreviewScale(proxyRef.current.scale.x * 2);
                            setLivePreviewRotation(proxyRef.current.rotation.z);
                        }
                    }}
                    onUpdate={() => {
                        if (proxyRef.current) {
                            setLivePreviewPos(proxyRef.current.position.clone());
                            setLivePreviewScale(proxyRef.current.scale.x * 2);
                            setLivePreviewRotation(proxyRef.current.rotation.z);
                        }
                    }}
                    onEnd={() => {
                        if (proxyRef.current && hitOrientation) {
                            const finalUpdates: Partial<TextConfig> = {};
                            const posScale = 0.5;
                            finalUpdates.position = [
                                proxyRef.current.position.x / posScale,
                                proxyRef.current.position.y / posScale,
                                textConfig.position[2]
                            ];

                            // Fix rotation jump: Calculate relative spin only
                            const currentSpin = textConfig.rotation[2];
                            const baseZ = hitOrientation.z - currentSpin;
                            const newSpin = proxyRef.current.rotation.z - baseZ;

                            finalUpdates.rotation = [0, 0, newSpin];

                            finalUpdates.scale = [
                                proxyRef.current.scale.x * 2,
                                proxyRef.current.scale.x * 2,
                                proxyRef.current.scale.x * 2
                            ];
                            onUpdate(finalUpdates);
                        }
                        setIsDragging(false);
                        useConfiguratorStore.getState().setIsGizmoDragging(false);
                        setLivePreviewPos(null);
                    }}
                />
            )}
        </group>
    );
};

// Memoize SurfaceTextDecal
const SurfaceTextDecal = React.memo(SurfaceTextDecalInner, (prevProps, nextProps) => {
    if (prevProps.isSelected !== nextProps.isSelected) return false;
    if (prevProps.controlMode !== nextProps.controlMode) return false;
    if (prevProps.textConfig.id !== nextProps.textConfig.id) return false;
    if (prevProps.textConfig.text !== nextProps.textConfig.text) return false;
    if (prevProps.textConfig.fontFamily !== nextProps.textConfig.fontFamily) return false;
    if (prevProps.textConfig.color !== nextProps.textConfig.color) return false;
    if (prevProps.textConfig.position !== nextProps.textConfig.position) return false;
    if (prevProps.textConfig.rotation !== nextProps.textConfig.rotation) return false;
    if (prevProps.textConfig.scale !== nextProps.textConfig.scale) return false;
    if (prevProps.meshes !== nextProps.meshes) return false;
    return true;
});


export const GarmentModel: React.FC<GarmentModelProps> = ({ url }) => {
    const { scene } = useGLTF(url);
    const [garmentMeshes, setGarmentMeshes] = useState<THREE.Mesh[]>([]);
    const {
        primaryColor,
        secondaryColor,
        materialPreset,
        textureUrl,
        textureScale,
        decals,
        selectedDecalId,
        selectDecal,
        updateDecal,
        gizmoMode,
        setGizmoMode,
        setLoading,
        // Multi-part
        selectedMeshName,
        selectMesh,
        meshColors,
        updateMeshColors,
        meshPatterns,
        meshTextureSettings, // Per-mesh texture settings (scale, tiled)
        // Click-to-Place
        isPlacingDecal,
        pendingDecalUrl,
        addDecal,
        setPendingDecal,
        setAvailableMeshes,
        setMaterialGroups,
        // Text
        texts,
        selectedTextId,
        selectText,
        updateText,
        isPlacingText,
        pendingText,
        addText,
        setPendingText
    } = useConfiguratorStore();

    // Removed local gizmoMode state

    // Keyboard shortcuts for gizmo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'g') setGizmoMode('translate');
            if (e.key === 'r') setGizmoMode('rotate');
            if (e.key === 's') setGizmoMode('scale');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true);
        return clone;
    }, [scene]);

    // Track initialization to avoid loop
    const initializationRef = useRef(false);

    useEffect(() => {
        if (!clonedScene) return;

        const preset = MATERIAL_PRESETS[materialPreset] || MATERIAL_PRESETS.cotton;
        let meshIndex = 0;
        const meshList: THREE.Mesh[] = [];
        const newColors: Record<string, string> = {};

        // Check if we need to initialize (only if store is empty AND we haven't done it this session)
        const needsInit = Object.keys(meshColors).length === 0 && !initializationRef.current;

        clonedScene.traverse((child) => {
            // Hide CLO3D Internal Lines/Guides
            if ((child as any).isLine || (child as any).isLineSegments) {
                child.visible = false;
                return;
            }

            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.name = mesh.name || `Part_${meshIndex}`;
                meshList.push(mesh);

                // Extract original color from the GLB material
                const originalMaterial = mesh.material as THREE.MeshStandardMaterial;
                const originalColor = originalMaterial.color ? '#' + originalMaterial.color.getHexString() : '#ffffff';

                if (needsInit) {
                    // Use the ORIGINAL color from the GLB, not our blue/gray pattern
                    newColors[mesh.name] = originalColor;
                }

                // Use meshColors if set by user, otherwise use original color from GLB
                const specificColor = meshColors[mesh.name] || originalColor;

                // --- MATERIAL HANDLING ---
                // We want to preserve original maps (normal, ao, etc.) from the GLTF

                let targetMaterial = mesh.material as THREE.MeshPhysicalMaterial;

                // If it's not yet our configured Physical material (or if it's the original Standard one)
                // We use userData to track if we've already set it up
                if (!mesh.userData.isConfigured) {
                    // Create new Physical material but COPY original maps
                    targetMaterial = new THREE.MeshPhysicalMaterial({
                        side: THREE.DoubleSide,
                        // Preserve Maps
                        map: originalMaterial.map,
                        normalMap: originalMaterial.normalMap,
                        normalScale: originalMaterial.normalScale || new THREE.Vector2(1, 1),
                        roughnessMap: originalMaterial.roughnessMap,
                        metalnessMap: originalMaterial.metalnessMap,
                        aoMap: originalMaterial.aoMap,
                        // Defaults
                        color: new THREE.Color(specificColor),
                    });

                    mesh.material = targetMaterial;
                    mesh.userData.isConfigured = true;
                    mesh.castShadow = true;
                    mesh.receiveShadow = true;
                }

                // Apply Configuration (Colors & Presets)
                if (targetMaterial) {
                    targetMaterial.color.set(specificColor);

                    // Apply Preset properties
                    targetMaterial.roughness = preset.roughness;
                    targetMaterial.metalness = preset.metalness;
                    targetMaterial.sheen = preset.sheen || 0;
                    if (preset.sheen) targetMaterial.sheenColor.set(specificColor);
                    targetMaterial.clearcoat = preset.clearcoat || 0;

                    targetMaterial.needsUpdate = true;
                }

                // Handle Patterns (Global fallback or Specific Mesh Pattern)
                const patternUrl = meshPatterns[mesh.name] || textureUrl;

                if (patternUrl) {
                    // Get per-mesh texture settings (with fallbacks)
                    const meshSettings = meshTextureSettings[mesh.name] || { scale: textureScale, tiled: true };
                    const meshScale = meshSettings.scale;
                    const isTiled = meshSettings.tiled;

                    // Check if we need to reload (URL, scale, or tiling changed)
                    const needsReload =
                        mesh.userData.lastPatternUrl !== patternUrl ||
                        mesh.userData.lastPatternScale !== meshScale ||
                        mesh.userData.lastPatternTiled !== isTiled;

                    if (needsReload) {
                        const textureLoader = new THREE.TextureLoader();
                        textureLoader.load(patternUrl, (loadedTexture) => {
                            // Set wrapping mode based on tiling setting
                            if (isTiled) {
                                loadedTexture.wrapS = THREE.RepeatWrapping;
                                loadedTexture.wrapT = THREE.RepeatWrapping;
                                // Original Size Logic: Scale = 1 = Original Size (1 repeat).
                                // Repeat = 1 / Scale.
                                // Scale 1 -> 1 repeat (Original)
                                // Scale 2 -> 0.5 repeats (Bigger pattern)
                                // Scale 0.5 -> 2 repeats (Denser/Smaller)
                                const safeScale = Math.max(0.1, meshScale);
                                const repeats = 1 / safeScale;
                                loadedTexture.repeat.set(repeats, repeats);
                            } else {
                                // Fit/stretch mode - no repeat, just stretch to UV bounds
                                loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
                                loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
                                loadedTexture.repeat.set(1, 1);
                            }
                            loadedTexture.colorSpace = THREE.SRGBColorSpace;

                            targetMaterial.map = loadedTexture;
                            targetMaterial.needsUpdate = true;

                            mesh.userData.lastPatternUrl = patternUrl;
                            mesh.userData.lastPatternScale = meshScale;
                            mesh.userData.lastPatternTiled = isTiled;
                        });
                    }
                } else if (mesh.userData.lastPatternUrl) {
                    // If no pattern URL now, but we HAD one, clear it
                    targetMaterial.map = null;
                    targetMaterial.needsUpdate = true;
                    mesh.userData.lastPatternUrl = null;
                    mesh.userData.lastPatternScale = null;
                    mesh.userData.lastPatternTiled = null;
                }

                meshIndex++;
            }
        });

        if (needsInit) {
            // Grouping Logic: Populate Material Groups
            const matByMesh: Record<string, string> = {};
            const materialGroups: Record<string, string[]> = {};

            meshList.forEach(mesh => {
                const matName = (mesh.material as THREE.MeshStandardMaterial).name;
                if (matName) {
                    matByMesh[mesh.name] = matName;
                    if (!materialGroups[matName]) materialGroups[matName] = [];
                    materialGroups[matName].push(mesh.name);
                }
            });

            initializationRef.current = true;
            setTimeout(() => {
                console.log("Initializing Mesh Colors:", newColors);
                setMaterialGroups(matByMesh, materialGroups);
                if (Object.keys(newColors).length > 0) {
                    updateMeshColors(newColors);
                }
            }, 0);
        }

        setGarmentMeshes(meshList);
        setAvailableMeshes(meshList.map(m => m.name));
        setLoading(false);
    }, [clonedScene, primaryColor, secondaryColor, materialPreset, textureUrl, textureScale, setLoading, meshColors, meshPatterns, meshTextureSettings]);

    // Precise Centering & Scaling Logic
    useEffect(() => {
        if (!clonedScene) return;

        // 1. Reset Transforms to ensure clean calculation
        clonedScene.position.set(0, 0, 0);
        clonedScene.rotation.set(0, 0, 0);
        clonedScene.scale.set(1, 1, 1);
        clonedScene.updateMatrixWorld(true);

        // 2. Calculate Bounding Box strictly on VISIBLE MESHES
        // This avoids invisible 'ghost' objects or huge helper lines skewing the center
        const box = new THREE.Box3();
        let hasMeshes = false;

        const blocklist = [
            "Internal_Line", "Shape", "Reference",
            "Avatar", "Mannequin", "Body", "Human", "Figure",
            "Genesis", "Male", "Female", "G8", "Base", "Platform", "Ground", "Floor", "Stage"
        ];

        clonedScene.traverse((child) => {
            // Ignore lines, points, and invisible markers
            if ((child as any).isLine || (child as any).isLineSegments) {
                child.visible = false;
                return;
            }
            if (!(child as THREE.Mesh).isMesh) return;

            // CRITICAL: Ignore invisible meshes
            if (child.visible === false) return;

            // Check against blocklist (Case insensitive)
            const name = child.name.toLowerCase();
            const isBlocked = blocklist.some(term => name.includes(term.toLowerCase()));

            if (isBlocked) {
                // Force hide unwanted meshes so they don't show up AND check works
                child.visible = false;
                return;
            }

            // Expand box
            box.expandByObject(child);
            hasMeshes = true;
        });

        if (!hasMeshes) {
            // Fallback: use whole scene if we filtered everything out
            box.setFromObject(clonedScene);
        }

        // 3. Center and Scale
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // CENTER X and Z (Horizontal centering)
        clonedScene.position.x = -center.x;
        clonedScene.position.z = -center.z;

        // ALIGN BOTTOM to 0 (Vertical positioning)
        // We want the lowest point (box.min.y) to be at Y=0 relative to the container
        // Actually, we usually want it slightly below 0 if the floor is at -1.2?
        // Let's stick to the User Request: "Always land on that 3D Floor".
        // The grid is at -1.2 in the Scene. ContactShadow is at -1.2.
        // So the model bottom (box.min.y) should align with -1.2?
        // OR: We place the model at 0, and the floor is at 0?
        // The previous code had ContactShadows at -1.2.
        // Let's make the model bottom sit at -1.2 to match the floor.

        clonedScene.position.y = -box.min.y - 1.2;

        // Scale to fit within a standard view unit
        // Standard Viewport is roughly 4-5 units tall at z=3 distance
        // We want the model to take up about 70-80% of screen height
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.0; // Slightly smaller to give breathing room
        const scale = maxDim > 0 ? targetScale / maxDim : 1;

        clonedScene.scale.setScalar(scale);

        // Re-calculate position after scaling? 
        // CAUTION: Scaling happens around the origin (0,0,0) of the Group generally.
        // If we set position first, then scale...
        // Let's do it cleanly:
        // 1. Scale first.
        clonedScene.scale.setScalar(scale);
        clonedScene.updateMatrixWorld(true);

        // 2. Re-measure box AFTER SCALING to get exact world bounds
        const scaledBox = new THREE.Box3().setFromObject(clonedScene);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

        // 3. Apply Final Position
        // Center X/Z
        clonedScene.position.x = clonedScene.position.x - scaledCenter.x;
        clonedScene.position.z = clonedScene.position.z - scaledCenter.z;

        // Bottom Align Y
        // We want scaledBox.min.y to be at -1.2 (Floor level)
        const currentBottom = scaledBox.min.y;
        const targetBottom = -1.2;
        clonedScene.position.y = clonedScene.position.y + (targetBottom - currentBottom);

        clonedScene.updateMatrixWorld(true);

    }, [clonedScene]);

    // Hover state needed for optimized lookup
    const [hoveredMeshName, setHoveredMeshName] = useState<string | null>(null);

    // OPTIMIZATION: Fast lookup map for meshes
    const meshMap = useRef<Record<string, THREE.Mesh>>({});

    // Populate the mesh map once when meshes are loaded
    useEffect(() => {
        if (!garmentMeshes.length) return;
        meshMap.current = {};
        garmentMeshes.forEach(mesh => {
            meshMap.current[mesh.name] = mesh;
        });
    }, [garmentMeshes]);

    // OPTIMIZED: Update visual feedback without full traversal and without shader recompilation
    useEffect(() => {
        // We only need to update the PREVIOUSLY selected/hovered meshes and the NEW ones.
        // But since we don't track "previous user selection" easily without ref,
        // we can just iterate the map (checking state) OR strictly update specific meshes.
        // A simple iteration over the map is O(N) but valid-N (only meshes), not scene traversal.
        // Even better: just update all meshes in the map since N is small (<100 usually).

        Object.values(meshMap.current).forEach(mesh => {
            const material = mesh.material as THREE.MeshPhysicalMaterial;
            if (!material) return;

            const isSelected = mesh.name === selectedMeshName;
            const isHovered = mesh.name === hoveredMeshName;

            // Only update if value actually changes to avoid thrashing (though ThreeJS acts lazily)
            let targetEmissive = 0x000000;
            let targetIntensity = 0;

            if (isSelected) {
                targetEmissive = 0xffffff;
                targetIntensity = 0.2;
            } else if (isHovered) {
                targetEmissive = 0xffffff;
                targetIntensity = 0.1;
            }

            // Apply efficiently
            if (material.emissive.getHex() !== targetEmissive) {
                material.emissive.setHex(targetEmissive);
            }
            if (material.emissiveIntensity !== targetIntensity) {
                material.emissiveIntensity = targetIntensity;
            }

            // CRITICAL: process.env.NODE_ENV check?
            // REMOVED material.needsUpdate = true; -> CAUSES LAG
            // Emissive updates are uniform updates, they do NOT require recompilation.
        });

    }, [selectedMeshName, hoveredMeshName, meshColors, primaryColor, secondaryColor]);

    useEffect(() => {
        if (isPlacingDecal) {
            document.body.style.cursor = 'crosshair';
        } else if (hoveredMeshName) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto';
        }
    }, [hoveredMeshName, isPlacingDecal]);


    return (
        <group>
            {/* Garment model - click to select mesh or place logo */}
            <primitive
                object={clonedScene}
                /* Hover Handlers */
                onPointerOver={(e: any) => {
                    e.stopPropagation();
                    if (e.object?.isMesh) {
                        setHoveredMeshName(e.object.name);
                    }
                }}
                onPointerOut={(e: any) => {
                    e.stopPropagation();
                    setHoveredMeshName(null);
                }}
                onClick={(e: any) => {
                    e.stopPropagation();

                    // --- DECAL PLACEMENT LOGIC ---
                    if (isPlacingDecal && pendingDecalUrl) {
                        // Check Surface Normal to determine Orientation
                        // If normal.z is negative, we are clicking the BACK of the model
                        let isBack = false;
                        if (e.face && e.object) {
                            const n = e.face.normal.clone().transformDirection(e.object.matrixWorld).normalize();
                            if (n.z < -0.1) isBack = true;
                        }

                        const worldX = e.point.x;
                        const worldY = e.point.y;

                        // If Back, invert X input so it maps correctly after 180 deg rotation
                        const inputX = isBack ? -worldX : worldX;

                        // IMPORTANT: Use consistent scale (0.5) for both axes to prevent distortion
                        const posScale = 0.5;
                        const x = inputX / posScale;
                        const y = worldY / posScale;

                        // Calculate aspect ratio from the image
                        const img = new Image();
                        img.onload = () => {
                            const aspectRatio = img.naturalWidth / img.naturalHeight;

                            const newDecal: DecalConfig = {
                                id: `decal-${Date.now()}`,
                                textureUrl: pendingDecalUrl,
                                position: [x, y, 0.5],
                                rotation: [0, 0, 0], // Rotation is purely for user spin (Z axis)
                                scale: [0.4, 0.4, 0.4],
                                isBackSide: isBack, // Store placement side separately
                                aspectRatio: aspectRatio, // Store image aspect ratio
                            };

                            addDecal(newDecal);
                            selectDecal(newDecal.id);
                        };
                        img.onerror = () => {
                            // Fallback: use default aspect ratio of 1 if image fails to load
                            const newDecal: DecalConfig = {
                                id: `decal-${Date.now()}`,
                                textureUrl: pendingDecalUrl,
                                position: [x, y, 0.5],
                                rotation: [0, 0, 0],
                                scale: [0.4, 0.4, 0.4],
                                isBackSide: isBack,
                                aspectRatio: 1,
                            };

                            addDecal(newDecal);
                            selectDecal(newDecal.id);
                        };
                        img.src = pendingDecalUrl;

                        setPendingDecal(null); // Exit placement mode
                        return;
                    }

                    // --- TEXT PLACEMENT LOGIC ---
                    if (isPlacingText && pendingText) {
                        // Check Surface Normal to determine Orientation
                        let isBack = false;
                        if (e.face && e.object) {
                            const n = e.face.normal.clone().transformDirection(e.object.matrixWorld).normalize();
                            if (n.z < -0.1) isBack = true;
                        }

                        const worldX = e.point.x;
                        const worldY = e.point.y;
                        const inputX = isBack ? -worldX : worldX;

                        const posScale = 0.5;
                        const x = inputX / posScale;
                        const y = worldY / posScale;

                        // Calculate aspect ratio from rendered text
                        // We'll use a temporary canvas to measure text dimensions
                        const measureCanvas = document.createElement('canvas');
                        const ctx = measureCanvas.getContext('2d');
                        if (ctx) {
                            const fontSize = 100; // Base font size for measurement
                            ctx.font = `bold ${fontSize}px "${pendingText.fontFamily}", sans-serif`;
                            const metrics = ctx.measureText(pendingText.text);
                            const textWidth = metrics.width;
                            const textHeight = fontSize * 1.2; // Approximate height
                            const aspectRatio = textWidth / textHeight;

                            const newText: TextConfig = {
                                id: `text-${Date.now()}`,
                                text: pendingText.text,
                                fontFamily: pendingText.fontFamily,
                                color: pendingText.color,
                                position: [x, y, 0.5],
                                rotation: [0, 0, 0],
                                scale: [0.6, 0.6, 0.6],
                                isBackSide: isBack,
                                aspectRatio: aspectRatio,
                            };

                            addText(newText);
                            selectText(newText.id);
                        }

                        setPendingText(null); // Exit placement mode
                        return;
                    }

                    // --- MESH SELECTION LOGIC ---
                    // Ignore clicks on decals/text (handled by their own double-click handlers)
                    if (e.object.userData.isDecal || e.object.userData.isTextDecal) {
                        return;
                    }

                    // SINGLE CLICK BEHAVIOR:
                    // Deselect everything to clear the UI as requested by user
                    // "to select ... double click ... only then it will be selected"
                    selectMesh(null);
                    selectDecal(null);
                    selectText(null);
                }}
                onDoubleClick={(e: any) => {
                    e.stopPropagation();

                    // DOUBLE CLICK BEHAVIOR:
                    // Select the mesh
                    if (e.object && e.object.isMesh && !e.object.userData.isDecal && !e.object.userData.isTextDecal) {
                        selectMesh(e.object.name);
                    }
                }}
            />

            {garmentMeshes.length > 0 && decals.map((decal) => (
                <Suspense key={decal.id} fallback={null}>
                    <SurfaceDecal
                        decal={decal}
                        meshes={garmentMeshes}
                        isSelected={selectedDecalId === decal.id}
                        onUpdate={(updates) => updateDecal(decal.id, updates)}
                        onSelect={() => selectDecal(decal.id)}
                        controlMode={gizmoMode}
                    />
                </Suspense>
            ))}

            {/* Render Text Decals */}
            {garmentMeshes.length > 0 && texts.map((textConfig) => (
                <SurfaceTextDecal
                    key={textConfig.id}
                    textConfig={textConfig}
                    meshes={garmentMeshes}
                    isSelected={selectedTextId === textConfig.id}
                    onUpdate={(updates) => updateText(textConfig.id, updates)}
                    onSelect={() => selectText(textConfig.id)}
                    controlMode={gizmoMode}
                />
            ))}

            {/* Info helper for gizmo */}
            {selectedDecalId && (
                <mesh position={[0.8, 0, 0]} visible={false}>
                    {/* Just a place to anchor if we wanted 3D UI, but we'll stick to React UI */}
                </mesh>
            )}
        </group>
    );
};

useGLTF.preload('/models/sample-garment.glb');
