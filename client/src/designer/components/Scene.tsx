import { Selection } from '@react-three/postprocessing';
import { Effects } from './Effects';
import { useConfiguratorStore } from '../store/configuratorStore';

import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
    OrbitControls,
    Environment,
    ContactShadows,
    PerspectiveCamera,
    Html,
    useProgress
} from '@react-three/drei';
import * as THREE from 'three';
import { GarmentModel } from './GarmentModel';
import { SnapshotController, QuoteCaptureController } from './SnapshotController';

import { useEffect } from 'react';

// Syncs three-drei loader progress with global store
function ProgressSync() {
    const { progress, active } = useProgress();
    const setLoading = useConfiguratorStore(state => state.setLoading);
    const setLoadingProgress = useConfiguratorStore(state => state.setLoadingProgress);

    useEffect(() => {
        setLoading(active);
        setLoadingProgress(progress);
    }, [progress, active, setLoading, setLoadingProgress]);

    return null;
}

function EmptyState() {
    return (
        <Html center>
            <div className="notice-board">
                <div className="notice-glow"></div>
                <div className="notice-content">
                    <span className="notice-icon">👇</span>
                    <div className="notice-text">
                        <p className="notice-title">Select a Model</p>
                        <p className="notice-subtitle">Choose from presets in the <strong>Model</strong> menu below</p>
                    </div>
                </div>
            </div>
        </Html>
    );
}

// Error boundary specifically for model loading
class ModelErrorBoundary extends React.Component<
    { children: React.ReactNode; onReset: () => void },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Model loading error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Html center>
                    <div style={{
                        background: 'rgba(26, 26, 26, 0.95)',
                        padding: '2rem',
                        borderRadius: '12px',
                        color: '#ff6b6b',
                        maxWidth: '400px',
                        textAlign: 'center',
                        fontFamily: 'system-ui'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h3 style={{ margin: '0 0 1rem 0', color: 'white' }}>Model Load Failed</h3>
                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '1rem' }}>
                            The model file appears to be corrupted or incompatible.
                        </p>
                        <details style={{ marginBottom: '1rem', textAlign: 'left', fontSize: '0.8rem' }}>
                            <summary style={{ cursor: 'pointer', color: '#888' }}>Technical Details</summary>
                            <pre style={{
                                marginTop: '0.5rem',
                                padding: '0.5rem',
                                background: '#111',
                                borderRadius: '4px',
                                overflow: 'auto',
                                maxHeight: '100px',
                                fontSize: '0.7rem'
                            }}>
                                {this.state.error?.message || 'Unknown error'}
                            </pre>
                        </details>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                this.props.onReset();
                            }}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 600
                            }}
                        >
                            Try Another Model
                        </button>
                    </div>
                </Html>
            );
        }

        return this.props.children;
    }
}

interface SceneProps {
    isDrawerOpen: boolean;
}

export const Scene: React.FC<SceneProps> = ({ isDrawerOpen }) => {
    const { modelUrl, autoRotate, isGizmoDragging, selectMesh, selectDecal, cameraTarget, setCameraTarget, setModelUrl } = useConfiguratorStore();
    const controlsRef = useRef<any>(null);

    return (
        <Canvas
            dpr={[1, 1.5]}
            onPointerMissed={(e) => {
                if (e.type === 'click') {
                    selectMesh(null);
                    selectDecal(null);
                }
            }}
            gl={{
                antialias: true,
                preserveDrawingBuffer: true,
                alpha: true,
                powerPreference: "high-performance",
                failIfMajorPerformanceCaveat: false
            }}
            style={{ background: 'transparent' }}
        >
            <ProgressSync />
            <SnapshotController />
            <QuoteCaptureController />
            <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={50} near={0.01} />

            {/* Soft, Diffused Studio Lighting */}
            <ambientLight intensity={0.6} /> {/* Higher ambient for soft base */}

            {/* Very Key Light - Reduced intensity for soft highlights */}
            <directionalLight position={[5, 10, 5]} intensity={0.3} castShadow shadow-mapSize={[2048, 2048]} shadow-normalBias={0.05} />

            {/* Gentle Fill Lights */}
            <directionalLight position={[-5, 5, 5]} intensity={0.2} />
            <directionalLight position={[0, 0, 5]} intensity={0.1} />
            <directionalLight position={[0, 5, -5]} intensity={0.4} />

            {/* Environment for subtle reflections only, very low blur/intensity */}
            <Environment files="/potsdamer_platz_1k.hdr" blur={1} background={false} environmentIntensity={0.2} />

            {/* Reference Floor Grid */}
            <primitive object={new THREE.GridHelper(10, 20, 0x2a2a2a, 0x1a1a1a)} position={[0, -1.2, 0]} />

            <OrbitControls
                ref={controlsRef}
                target={new THREE.Vector3(...cameraTarget)}
                autoRotate={autoRotate && !isGizmoDragging}
                enabled={!isGizmoDragging}
                autoRotateSpeed={1}
                enablePan={!isGizmoDragging}
                enableZoom={!isGizmoDragging}
                enableRotate={!isGizmoDragging}
                minDistance={0.2}
                maxDistance={10}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI - Math.PI / 6}
                onEnd={() => {
                    if (controlsRef.current) {
                        const t = controlsRef.current.target;
                        setCameraTarget([t.x, t.y, t.z]);
                    }
                }}
            />

            <Selection>
                <ModelErrorBoundary onReset={() => setModelUrl(null)}>
                    <Suspense fallback={null}>
                        {modelUrl ? (
                            <GarmentModel url={modelUrl} />
                        ) : (
                            !isDrawerOpen && <EmptyState />
                        )}
                    </Suspense>
                </ModelErrorBoundary>
            </Selection>

            <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={5} blur={2.5} far={4} />

            <Effects />
        </Canvas>
    );
};
