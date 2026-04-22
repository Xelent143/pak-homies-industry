import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import pkg from 'file-saver';
const { saveAs } = pkg;
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { useConfiguratorStore } from '../store/configuratorStore';

export const SnapshotController = () => {
    const { gl, scene, camera } = useThree();
    const { snapshotRequest } = useConfiguratorStore();

    useEffect(() => {
        if (!snapshotRequest) return;

        const captureAndDownload = async () => {
            console.log('📸 Starting 4K transparent PNG capture...');

            // 1. Store original state
            const originalBg = scene.background;
            const currentSize = gl.getSize(new THREE.Vector2());

            // 2. Calculate 4K resolution
            const TARGET_4K = 4096;
            const aspectRatio = currentSize.width / currentSize.height;
            const targetWidth = aspectRatio >= 1 ? TARGET_4K : Math.round(TARGET_4K * aspectRatio);
            const targetHeight = aspectRatio >= 1 ? Math.round(TARGET_4K / aspectRatio) : TARGET_4K;

            console.log(`🖼️ Target resolution: ${targetWidth}x${targetHeight}`);

            // 3. Create a NEW separate renderer for clean capture (bypasses all post-processing)
            const captureRenderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: true,
            });
            captureRenderer.setSize(targetWidth, targetHeight, false);
            captureRenderer.setPixelRatio(1);
            captureRenderer.setClearColor(0x000000, 0); // Fully transparent
            captureRenderer.outputColorSpace = THREE.SRGBColorSpace;

            // 4. Set transparent background
            scene.background = null;

            // 5. Hide non-essential objects (Grid, Shadows, Helpers, Gizmos)
            const hiddenObjects: THREE.Object3D[] = [];

            scene.traverse((child) => {
                // Skip the main garment meshes - we only want to hide helpers/floor/shadows
                const shouldHide =
                    child instanceof THREE.GridHelper ||
                    child instanceof THREE.AxesHelper ||
                    child.type === 'LineSegments' ||
                    child.type.includes('Helper') ||
                    child.name.toLowerCase().includes('grid') ||
                    child.name.toLowerCase().includes('shadow') ||
                    child.name.toLowerCase().includes('contact') ||
                    child.name.toLowerCase().includes('floor') ||
                    (child as any).isTransformControls;

                if (shouldHide && child.visible) {
                    hiddenObjects.push(child);
                    child.visible = false;
                }
            });

            // 6. Also find and hide the primitive GridHelper (it won't have a name)
            scene.children.forEach((child) => {
                if (child instanceof THREE.GridHelper || child.type === 'GridHelper') {
                    if (child.visible) {
                        hiddenObjects.push(child);
                        child.visible = false;
                    }
                }
            });

            // 7. Render to the clean capture renderer
            captureRenderer.clear();
            captureRenderer.render(scene, camera);

            // 8. Extract PNG from the capture canvas
            const captureCanvas = captureRenderer.domElement;

            captureCanvas.toBlob(async (blob) => {
                if (blob) {
                    const now = new Date();
                    const dateStr = now.toISOString().split('T')[0];
                    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
                    const filename = `3D-Model-4K_${dateStr}_${timeStr}.png`;

                    if (Capacitor.isNativePlatform()) {
                        // Native Mobile Saving: Write to Filesystem
                        try {
                            // Convert Blob to Base64
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = async () => {
                                const base64data = reader.result as string;

                                await Filesystem.writeFile({
                                    path: filename,
                                    data: base64data,
                                    directory: Directory.Documents, // Saves to Documents folder
                                    recursive: true
                                });
                                alert(`Snapshot saved to Documents/${filename}`);
                                console.log(`✅ Mobile Save: Documents/${filename}`);
                            };
                        } catch (e) {
                            console.error("Mobile Save Failed:", e);
                            alert("Failed to save snapshot on device.");
                        }
                    } else {
                        // Web Saving
                        saveAs(blob, filename);
                        console.log(`✅ Downloaded: ${filename} (${(blob.size / 1024 / 1024).toFixed(2)} MB)`);
                    }

                } else {
                    console.error('❌ Failed to create PNG blob');
                }

                // 9. Cleanup: restore state and dispose capture renderer
                scene.background = originalBg;

                hiddenObjects.forEach((obj) => {
                    obj.visible = true;
                });

                captureRenderer.dispose();

                // Re-render main view
                gl.render(scene, camera);

            }, 'image/png', 1.0);
        };

        // Small delay to ensure state is ready
        requestAnimationFrame(captureAndDownload);

    }, [snapshotRequest, gl, scene, camera]);

    return null;
};

// ─── QuoteCaptureController ──────────────────────────────────────────────────
// Captures 4 views (Front, Right, Back, Left) of the 3D garment by rotating
// the camera around the model, then stores all views in the store.
export const QuoteCaptureController = () => {
    const { scene, camera } = useThree();
    const { quoteImageRequest, setQuoteViews } = useConfiguratorStore();

    useEffect(() => {
        if (!quoteImageRequest) return;

        const VIEWS = [
            { label: 'Front', azimuth: 0 },
            { label: 'Right', azimuth: Math.PI / 2 },
            { label: 'Back', azimuth: Math.PI },
            { label: 'Left', azimuth: -Math.PI / 2 },
        ];
        const RADIUS = 4.5;
        const ELEVATION = 0.8;
        const target = new THREE.Vector3(0, 0.5, 0);

        const captureRenderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: true,
        });
        captureRenderer.setSize(900, 900, false);
        captureRenderer.setPixelRatio(1);
        captureRenderer.setClearColor(0x0d1117, 1);
        captureRenderer.outputColorSpace = THREE.SRGBColorSpace;

        const originalBg = scene.background;
        const originalPos = camera.position.clone();

        // Hide UI helpers (grid, gizmos, floor shadows)
        const hiddenObjects: THREE.Object3D[] = [];
        scene.traverse((child) => {
            const shouldHide =
                child.name.toLowerCase().includes('grid') ||
                child.name.toLowerCase().includes('shadow') ||
                child.name.toLowerCase().includes('floor') ||
                (child as any).isTransformControls;
            if (shouldHide && child.visible) {
                hiddenObjects.push(child);
                child.visible = false;
            }
        });
        scene.children.forEach((child) => {
            if (child instanceof THREE.GridHelper || child.type === 'GridHelper') {
                if (child.visible) { hiddenObjects.push(child); child.visible = false; }
            }
        });

        const views: { label: string; dataUrl: string }[] = [];

        const captureView = (index: number) => {
            if (index >= VIEWS.length) {
                // Restore everything
                scene.background = originalBg;
                camera.position.copy(originalPos);
                camera.lookAt(target);
                camera.updateProjectionMatrix();
                hiddenObjects.forEach((obj) => { obj.visible = true; });
                captureRenderer.dispose();
                setQuoteViews(views);
                return;
            }
            const { label, azimuth } = VIEWS[index];
            camera.position.set(
                Math.sin(azimuth) * RADIUS,
                ELEVATION,
                Math.cos(azimuth) * RADIUS
            );
            camera.lookAt(target);
            camera.updateProjectionMatrix();
            // Two rAF frames to let the scene settle before capturing
            requestAnimationFrame(() => requestAnimationFrame(() => {
                captureRenderer.render(scene, camera);
                const dataUrl = captureRenderer.domElement.toDataURL('image/jpeg', 0.90);
                views.push({ label, dataUrl });
                captureView(index + 1);
            }));
        };

        requestAnimationFrame(() => captureView(0));
    }, [quoteImageRequest, scene, camera, setQuoteViews]);

    return null;
};
