import React, { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DecalSmartControlsProps {
    object: THREE.Object3D;
    meshes: THREE.Mesh[]; // The garment meshes to raycast against for movement
    onStart: () => void;
    onEnd: () => void;
    onUpdate: () => void; // Called when proxy updates, to sync live preview
}

export const DecalSmartControls: React.FC<DecalSmartControlsProps> = ({
    object,
    meshes,
    onStart,
    onEnd,
    onUpdate
}) => {
    const { camera, raycaster, gl } = useThree();
    const [mode, setMode] = useState<'none' | 'translate' | 'rotate' | 'scale'>('none');

    // Internal state for drag calculations
    const startPoint = useRef(new THREE.Vector2());
    const initialScale = useRef(1);
    const initialRotation = useRef(0);
    const initialHitPoint = useRef(new THREE.Vector3());

    // Visual References
    const groupRef = useRef<THREE.Group>(null);

    // NEW: Determine action based on click position within the control
    const determineAction = (localPoint: THREE.Vector3): 'translate' | 'rotate' | 'scale' => {
        const ext = 0.5; // extent from center
        const cornerThreshold = 0.2; // Reduced threshold for more precision

        // Check if click is near any corner
        const corners = [
            new THREE.Vector2(-ext, -ext),
            new THREE.Vector2(ext, -ext),
            new THREE.Vector2(ext, ext),
            new THREE.Vector2(-ext, ext)
        ];

        const clickPos2D = new THREE.Vector2(localPoint.x, localPoint.y);

        for (const corner of corners) {
            if (clickPos2D.distanceTo(corner) < cornerThreshold) {
                return 'scale';
            }
        }

        // Check if click is near the rotation handle (top)
        const rotateHandlePos = new THREE.Vector2(0, ext + 0.2);
        if (clickPos2D.distanceTo(rotateHandlePos) < 0.2) {
            return 'rotate';
        }

        // Default: center area = translate
        return 'translate';
    };

    // Unified pointer down handler for the main control plane
    const onControlPointerDown = (e: any) => {
        e.stopPropagation();

        // Calculate local position of click
        const localPoint = e.point.clone();
        if (groupRef.current) {
            // Transform world point to local space
            groupRef.current.worldToLocal(localPoint);
        }

        const action = determineAction(localPoint);

        setMode(action);
        onStart();

        startPoint.current.set(e.clientX, e.clientY);
        initialScale.current = object.scale.x;
        initialRotation.current = object.rotation.z;
        initialHitPoint.current.copy(object.position);

        // Capture pointer
        (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    };

    // Global pointer move/up handlers
    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            if (mode === 'none') return;

            if (mode === 'translate') {
                // Raycast against garment meshes to find new position
                const rect = gl.domElement.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

                const intersections = raycaster.intersectObjects(meshes, true);
                if (intersections.length > 0) {
                    const hit = intersections[0];
                    if (hit.face) {
                        const n = hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize();
                        object.position.copy(hit.point);

                        const up = new THREE.Vector3(0, 0, 1);
                        const q = new THREE.Quaternion().setFromUnitVectors(up, n);
                        const zRot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), initialRotation.current);
                        object.quaternion.copy(q).multiply(zRot);
                    }
                }
            }
            else if (mode === 'scale') {
                const dy = startPoint.current.y - e.clientY;
                const scaleFactor = 1 + (dy * 0.01);
                const newScale = Math.max(0.1, initialScale.current * scaleFactor);
                object.scale.setScalar(newScale);
            }
            else if (mode === 'rotate') {
                const center = object.position.clone().project(camera);
                const rect = gl.domElement.getBoundingClientRect();
                const centerX = (center.x * .5 + .5) * rect.width + rect.left;
                const centerY = -(center.y * .5 - .5) * rect.height + rect.top;

                const dx = e.clientX - centerX;
                const dy = e.clientY - centerY;
                const angle = Math.atan2(dy, dx);

                const startDx = startPoint.current.x - centerX;
                const startDy = startPoint.current.y - centerY;
                const startAngle = Math.atan2(startDy, startDx);
                const deltaRot = angle - startAngle;

                object.rotation.z = initialRotation.current - deltaRot;
            }

            onUpdate();
        };

        const handlePointerUp = () => {
            if (mode !== 'none') {
                setMode('none');
                onEnd();
            }
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [mode, camera, gl, meshes, object, onUpdate, onEnd]);

    // Follow object visuals
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.position.copy(object.position);
            groupRef.current.quaternion.copy(object.quaternion);
            groupRef.current.scale.copy(object.scale);
        }
    });

    const boxColor = "#3b82f6"; // Blue
    const handleColor = "#ffffff";
    const handleSize = 0.18; // Slightly bigger handles
    const ext = 0.5;

    return (
        <group ref={groupRef}>
            {/* SINGLE LARGE INVISIBLE CONTROL PLANE - handles ALL interactions */}
            <mesh
                position={[0, 0, 0.1]}
                onPointerDown={onControlPointerDown}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'default'}
                renderOrder={20}
            >
                {/* Tighter fit to visual box (1x1) plus handles */}
                <planeGeometry args={[1.2, 1.25]} />
                <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
            </mesh>

            {/* VISUAL ONLY - Main Bounding Box */}
            <lineSegments renderOrder={5}>
                <edgesGeometry args={[new THREE.PlaneGeometry(1, 1)]} />
                <lineBasicMaterial color={boxColor} depthTest={false} transparent opacity={0.8} />
            </lineSegments>

            {/* VISUAL ONLY - Corner Handles */}
            {[[-ext, -ext], [ext, -ext], [ext, ext], [-ext, ext]].map((pos, i) => (
                <mesh key={i} position={[pos[0], pos[1], 0]} renderOrder={6}>
                    <boxGeometry args={[handleSize, handleSize, 0.01]} />
                    <meshBasicMaterial color={handleColor} depthTest={false} />
                    <lineSegments>
                        <edgesGeometry args={[new THREE.BoxGeometry(handleSize, handleSize, 0.01)]} />
                        <lineBasicMaterial color={boxColor} depthTest={false} />
                    </lineSegments>
                </mesh>
            ))}

            {/* VISUAL ONLY - Rotation Handle (Top) */}
            <group position={[0, ext + 0.2, 0]}>
                <mesh position={[0, -0.1, 0]} renderOrder={6}>
                    <boxGeometry args={[0.02, 0.2, 0.01]} />
                    <meshBasicMaterial color={boxColor} depthTest={false} />
                </mesh>
                <mesh renderOrder={6}>
                    <circleGeometry args={[0.1, 16]} />
                    <meshBasicMaterial color={handleColor} depthTest={false} />
                    <lineSegments>
                        <edgesGeometry args={[new THREE.CircleGeometry(0.1, 16)]} />
                        <lineBasicMaterial color={boxColor} depthTest={false} />
                    </lineSegments>
                </mesh>
            </group>

            {/* VISUAL ONLY - Center Move Icon */}
            <group scale={[1, 1, 1]} position={[0, 0, 0.02]}>
                <mesh renderOrder={7}>
                    <planeGeometry args={[0.25, 0.06]} />
                    <meshBasicMaterial color={handleColor} depthTest={false} />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]} renderOrder={7}>
                    <planeGeometry args={[0.25, 0.06]} />
                    <meshBasicMaterial color={handleColor} depthTest={false} />
                </mesh>
            </group>
        </group>
    );
};
