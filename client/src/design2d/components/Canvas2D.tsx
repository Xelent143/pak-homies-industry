import { useRef, useEffect, useCallback, useState } from 'react';
import * as fabric from 'fabric';
import { useDesign2DStore, PendingPlacement } from '../store/design2dStore';
import { RasterEngine } from '../utils/RasterEngine';

interface Canvas2DProps {
    width?: number;
    height?: number;
}

// ─── Annotation registry ─────────────────────────────────────────────────────
interface AnnotationEntry {
    targetObj: fabric.FabricObject;
    noteGroup: fabric.Group;
    line: fabric.Line;
}

function getCenter(obj: fabric.FabricObject) {
    const br = obj.getBoundingRect();
    return { x: br.left + br.width / 2, y: br.top + br.height / 2 };
}

export default function Canvas2D({ width = 600, height = 700 }: Canvas2DProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricRef = useRef<fabric.Canvas | null>(null);
    const partsMapRef = useRef<Map<string, fabric.FabricObject[]>>(new Map());
    const svgObjectsRef = useRef<fabric.FabricObject[]>([]);
    const annotationsRef = useRef<AnnotationEntry[]>([]);
    const rasterEngineRef = useRef<RasterEngine | null>(null);
    const rasterImgRef = useRef<fabric.FabricImage | null>(null);
    const [ready, setReady] = useState(false);

    const [justPlaced, setJustPlaced] = useState<fabric.FabricObject | null>(null);

    const {
        svgData, partNames, partColors, selectPart, setCanvasReady, setPendingPlacement,
        isRasterMode, rasterImageUrl, rasterParts, rasterPartColors,
    } = useDesign2DStore();

    // ── 1. Create the Fabric canvas once ──────────────────────────────────────
    useEffect(() => {
        const el = canvasRef.current;
        if (!el) return;

        const raf = requestAnimationFrame(() => {
            if (fabricRef.current) {
                fabricRef.current.dispose();
                fabricRef.current = null;
            }

            const parent = el.parentElement;
            const container = parent?.parentElement ?? parent;
            const w = (container?.clientWidth || parent?.clientWidth || 600);
            const h = (container?.clientHeight || parent?.clientHeight || 700);

            const canvas = new fabric.Canvas(el, {
                width: w,
                height: h,
                backgroundColor: '#0d1117',
                selection: true,
                preserveObjectStacking: true,
                renderOnAddRemove: false,
            });

            fabricRef.current = canvas;
            setCanvasReady(true);
            setReady(true);

            // ── Live line updater ────────────────────────────────────────────
            // Whenever any object moves, check if it's a target or a note group
            // and update the corresponding line endpoints.
            const updateLines = () => {
                for (const entry of annotationsRef.current) {
                    const { targetObj, noteGroup, line } = entry;
                    const tc = getCenter(targetObj);
                    const nc = getCenter(noteGroup);
                    line.set({ x1: tc.x, y1: tc.y, x2: nc.x, y2: nc.y });
                }
                canvas.renderAll();
            };

            canvas.on('object:moving', updateLines);
            canvas.on('object:scaling', updateLines);

            // ── Selection → expose selected obj for floating "Add Note" button ──
            const notifySelection = () => {
                const active = canvas.getActiveObject();
                // Only non-SVG placeable objects (logos, texts – not annotation boxes or SVG parts)
                if (
                    active &&
                    active.selectable &&
                    (active as any)?.data?.type !== 'annotation'
                ) {
                    const br = active.getBoundingRect();
                    (window as any).__d2d_selectedForNote = { obj: active, br };
                } else {
                    (window as any).__d2d_selectedForNote = null;
                }
            };

            canvas.on('selection:created', notifySelection);
            canvas.on('selection:updated', notifySelection);
            canvas.on('selection:cleared', () => {
                (window as any).__d2d_selectedForNote = null;
            });

            const onResize = () => {
                const par = el.parentElement;
                const cont = par?.parentElement ?? par;
                if (!cont || !fabricRef.current) return;
                fabricRef.current.setDimensions({ width: cont.clientWidth, height: cont.clientHeight });
                fabricRef.current.renderAll();
            };
            window.addEventListener('resize', onResize);
            (fabricRef as any)._cleanupResize = () => window.removeEventListener('resize', onResize);
        });

        return () => {
            cancelAnimationFrame(raf);
            if ((fabricRef as any)._cleanupResize) (fabricRef as any)._cleanupResize();
            fabricRef.current?.dispose();
            fabricRef.current = null;
            setReady(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── 2. Load SVG template ───────────────────────────────────────────────────
    useEffect(() => {
        if (!ready) return;
        const canvas = fabricRef.current;
        if (!canvas) return;

        svgObjectsRef.current.forEach(o => { try { canvas.remove(o); } catch (_) { } });
        svgObjectsRef.current = [];
        partsMapRef.current.clear();

        if (!svgData || svgData.trim().length === 0) {
            canvas.renderAll();
            return;
        }

        fabric.loadSVGFromString(svgData).then((result: any) => {
            const fCanvas = fabricRef.current;
            if (!fCanvas) return;

            let objects: fabric.FabricObject[];
            if (Array.isArray(result)) {
                objects = result.filter(Boolean);
            } else if (result && Array.isArray(result.objects)) {
                objects = result.objects.filter(Boolean);
            } else {
                return;
            }

            // Compute bounding box of all objects
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            objects.forEach(obj => {
                const l = obj.left ?? 0, t = obj.top ?? 0;
                const r = l + (obj.width ?? 0) * (obj.scaleX ?? 1);
                const b = t + (obj.height ?? 0) * (obj.scaleY ?? 1);
                if (l < minX) minX = l;
                if (t < minY) minY = t;
                if (r > maxX) maxX = r;
                if (b > maxY) maxY = b;
            });
            const svgW = maxX - minX || 1;
            const svgH = maxY - minY || 1;

            const cw = fCanvas.getWidth();
            const ch = fCanvas.getHeight();
            const scale = Math.min((cw * 0.92) / svgW, (ch * 0.92) / svgH);
            const dx = (cw - svgW * scale) / 2 - minX * scale;
            const dy = (ch - svgH * scale) / 2 - minY * scale;

            objects.forEach(obj => {
                const id: string = (obj as any).id ?? '';
                const groupId: string = (obj as any).groupId ?? '';

                obj.set({
                    left: (obj.left ?? 0) * scale + dx,
                    top: (obj.top ?? 0) * scale + dy,
                    scaleX: (obj.scaleX ?? 1) * scale,
                    scaleY: (obj.scaleY ?? 1) * scale,
                    selectable: false,
                    evented: true,
                    hoverCursor: 'pointer',
                    hasControls: false,
                    hasBorders: false,
                });
                fCanvas.add(obj);
                svgObjectsRef.current.push(obj);

                const matchKey = partNames.find(pn =>
                    pn === id || pn === groupId ||
                    id.startsWith(pn) || groupId.startsWith(pn)
                );
                if (matchKey) {
                    const existing = partsMapRef.current.get(matchKey) ?? [];
                    existing.push(obj);
                    partsMapRef.current.set(matchKey, existing);
                }
            });

            // Apply current colors
            partsMapRef.current.forEach((objs, partId) => {
                const color = partColors[partId];
                if (color) objs.forEach(o => o.set({ fill: color }));
            });

            fCanvas.renderAll();
        }).catch((err: unknown) => {
            console.error('[Canvas2D] loadSVGFromString error:', err);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [svgData, ready]);

    // ── 3. Recolor SVG parts ─────────────────────────────────────────────────
    useEffect(() => {
        if (isRasterMode) return; // skip in raster mode
        const canvas = fabricRef.current;
        if (!canvas) return;
        partsMapRef.current.forEach((objs, partId) => {
            const color = partColors[partId];
            if (color) objs.forEach(o => o.set({ fill: color }));
        });
        canvas.renderAll();
    }, [partColors, isRasterMode]);

    // ── 3b. Load raster image when rasterImageUrl changes ────────────────────
    useEffect(() => {
        if (!isRasterMode || !rasterImageUrl || !ready) return;
        const canvas = fabricRef.current;
        if (!canvas) return;

        // Clear any existing SVG or raster objects
        svgObjectsRef.current.forEach(o => { try { canvas.remove(o); } catch (_) { } });
        svgObjectsRef.current = [];
        partsMapRef.current.clear();
        if (rasterImgRef.current) {
            try { canvas.remove(rasterImgRef.current); } catch (_) { }
            rasterImgRef.current = null;
        }

        const imgEl = new Image();
        imgEl.crossOrigin = 'anonymous';
        imgEl.onload = () => {
            const fCanvas = fabricRef.current;
            if (!fCanvas) return;

            // Initialize the raster engine
            const engine = new RasterEngine();
            engine.loadImage(imgEl);
            engine.buildMasks(rasterParts);
            rasterEngineRef.current = engine;

            console.log(`[RasterLoad] Image loaded: ${imgEl.naturalWidth}x${imgEl.naturalHeight}`);

            // Scale the image to fit the canvas
            const cw = fCanvas.getWidth();
            const ch = fCanvas.getHeight();
            const scale = Math.min((cw * 0.9) / imgEl.naturalWidth, (ch * 0.9) / imgEl.naturalHeight);
            const dx = (cw - imgEl.naturalWidth * scale) / 2;
            const dy = (ch - imgEl.naturalHeight * scale) / 2;

            const fImg = new fabric.FabricImage(imgEl, {
                left: dx,
                top: dy,
                scaleX: scale,
                scaleY: scale,
                selectable: false,
                evented: false,
                hoverCursor: 'default',
                hasControls: false,
                hasBorders: false,
            });
            fCanvas.add(fImg);
            rasterImgRef.current = fImg;
            fCanvas.renderAll();
        };
        imgEl.src = rasterImageUrl;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rasterImageUrl, isRasterMode, ready]);

    // ── 3c. Recolor raster parts when colors change ──────────────────────────
    useEffect(() => {
        if (!isRasterMode) return;
        const engine = rasterEngineRef.current;
        const canvas = fabricRef.current;
        if (!engine || !canvas) return;

        // Check which parts actually changed
        const hasChanges = rasterParts.some(p => {
            const c = rasterPartColors[p.partId];
            return c && c !== p.originalColor;
        });
        if (!hasChanges) return;

        // Reset to original, then apply all current color changes
        engine.reset();
        for (const part of rasterParts) {
            const newColor = rasterPartColors[part.partId];
            if (newColor && newColor !== part.originalColor) {
                engine.recolorPart(part.partId, newColor);
            }
        }

        // Swap the canvas image
        const dataUrl = engine.toDataURL();
        const newImg = new Image();
        newImg.crossOrigin = 'anonymous';
        newImg.onload = () => {
            const fCanvas = fabricRef.current;
            const oldImg = rasterImgRef.current;
            if (!fCanvas || !oldImg) return;

            const fImg = new fabric.FabricImage(newImg, {
                left: oldImg.left,
                top: oldImg.top,
                scaleX: oldImg.scaleX,
                scaleY: oldImg.scaleY,
                selectable: false,
                evented: false,
                hoverCursor: 'default',
                hasControls: false,
                hasBorders: false,
            });

            fCanvas.remove(oldImg);
            fCanvas.add(fImg);
            fCanvas.sendObjectToBack(fImg);
            rasterImgRef.current = fImg;
            fCanvas.renderAll();
        };
        newImg.src = dataUrl;
    }, [rasterPartColors, isRasterMode, rasterParts]);

    // ── 4. Build clip for a part ───────────────────────────────────────────────
    const buildClipForPart = useCallback(async (partId: string): Promise<fabric.FabricObject | null> => {
        // ── Raster mode: bitmap clip from pixel mask ──
        if (isRasterMode) {
            const engine = rasterEngineRef.current;
            const ri = rasterImgRef.current;
            if (!engine || !ri) return null;

            const maskClip = engine.getMaskClip(partId);
            if (!maskClip) return null;

            // Load the mask image
            return new Promise<fabric.FabricObject | null>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const fImg = new fabric.FabricImage(img, {
                        left: ri.left ?? 0,
                        top: ri.top ?? 0,
                        scaleX: ri.scaleX ?? 1,
                        scaleY: ri.scaleY ?? 1,
                        absolutePositioned: true,
                    });
                    resolve(fImg);
                };
                img.onerror = () => resolve(null);
                img.src = maskClip.dataUrl;
            });
        }

        // ── SVG mode: clone SVG part objects ──
        const partObjs = partsMapRef.current.get(partId);
        if (!partObjs || partObjs.length === 0) return null;

        const clones: fabric.FabricObject[] = await Promise.all(
            partObjs.map(obj => (obj as any).clone())
        );

        if (clones.length === 1) {
            clones[0].set({ absolutePositioned: true });
            return clones[0];
        }
        return new fabric.Group(clones, { absolutePositioned: true });
    }, [isRasterMode]);

    // ── 5. Add annotation callout after placement ──────────────────────────────
    const addAnnotation = useCallback((targetObj: fabric.FabricObject, noteText: string) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const tc = getCenter(targetObj);
        const cw = canvas.getWidth();

        // Position annotation box to the right (or left if near edge)
        const boxW = 180;
        const boxH = noteText.split('\n').length * 18 + 32;
        const margin = 24;
        let boxLeft = tc.x + 120;
        if (boxLeft + boxW > cw - 10) boxLeft = tc.x - 120 - boxW;
        const boxTop = tc.y - boxH / 2;

        // ── Callout box background ──
        const rect = new fabric.Rect({
            width: boxW,
            height: boxH,
            fill: 'rgba(250,247,235,0.97)',
            stroke: '#c8a84b',
            strokeWidth: 1.5,
            rx: 4,
            ry: 4,
            shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.35)', blur: 10, offsetX: 2, offsetY: 3 }),
        });

        // ── Note label at top ──
        const label = new fabric.FabricText('MANUFACTURER NOTE', {
            fontSize: 7,
            fontFamily: 'monospace',
            fill: '#b8860b',
            fontWeight: 'bold',
            left: 10,
            top: 8,
            selectable: false,
        });

        // ── Note content ──
        const content = new fabric.FabricText(noteText, {
            fontSize: 11,
            fontFamily: 'Arial, sans-serif',
            fill: '#1a1a1a',
            left: 10,
            top: 22,
            width: boxW - 20,
            selectable: false,
        });

        // Group the callout box parts
        const noteGroup = new fabric.Group([rect, label, content], {
            left: boxLeft,
            top: boxTop,
            selectable: true,
            evented: true,
            hasControls: false,
            hasBorders: true,
            borderColor: '#c8a84b',
            hoverCursor: 'move',
            // Tag it so we know it's an annotation
            data: { type: 'annotation' },
        } as any);

        // ── Leader line ──
        const nc = { x: boxLeft + boxW / 2, y: boxTop + boxH / 2 };
        const line = new fabric.Line(
            [tc.x, tc.y, nc.x, nc.y],
            {
                stroke: '#c8a84b',
                strokeWidth: 1.5,
                strokeDashArray: [5, 4],
                selectable: false,
                evented: false,
                hoverCursor: 'default',
            }
        );

        // Add leader line BELOW the annotation box
        canvas.add(line);
        canvas.add(noteGroup);

        // Store entry for live updates
        annotationsRef.current.push({ targetObj, noteGroup, line });

        // Bring target to front so it's above the line
        canvas.bringObjectToFront(targetObj);
        canvas.setActiveObject(noteGroup);
        canvas.renderAll();
    }, []);

    // ── 6. Place pending item ──────────────────────────────────────────────────
    const placePendingItem = useCallback(async (pending: PendingPlacement, partId: string) => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const clip = await buildClipForPart(partId);
        const br = clip?.getBoundingRect() ?? null;
        const cw = canvas.getWidth();
        const ch = canvas.getHeight();

        const cx = br ? br.left + br.width / 2 : cw / 2;
        const cy = br ? br.top + br.height / 2 : ch / 2;

        if (pending.type === 'logo') {
            const imgEl = new Image();
            imgEl.crossOrigin = 'anonymous';
            imgEl.onload = () => {
                const maxSize = br ? Math.min(br.width, br.height) * 0.8 : Math.min(cw, ch) * 0.3;
                const s = Math.min(1, maxSize / imgEl.width, maxSize / imgEl.height);
                const img = new fabric.FabricImage(imgEl, {
                    left: cx, top: cy, originX: 'center', originY: 'center',
                    scaleX: s, scaleY: s, selectable: true, evented: true,
                    cornerColor: '#d4af37', cornerStrokeColor: '#d4af37',
                    borderColor: '#d4af37', cornerSize: 10, transparentCorners: false, padding: 8,
                });
                if (clip) img.clipPath = clip;
                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.renderAll();
                setPendingPlacement(null);
                // Prompt for annotation
                setJustPlaced(img);
            };
            imgEl.src = pending.imageUrl;

        } else if (pending.type === 'text') {
            const maxFontSize = br ? Math.min(br.width, br.height) * 0.15 : pending.fontSize;
            const obj = new fabric.FabricText(pending.text, {
                left: cx, top: cy,
                fontFamily: pending.fontFamily,
                fontSize: Math.min(pending.fontSize, maxFontSize),
                fill: pending.fill,
                originX: 'center', originY: 'center',
                selectable: true, evented: true,
                cornerColor: '#d4af37', cornerStrokeColor: '#d4af37',
                borderColor: '#d4af37', cornerSize: 10, transparentCorners: false, padding: 8,
            });
            if (clip) obj.clipPath = clip;
            canvas.add(obj);
            canvas.setActiveObject(obj);
            canvas.renderAll();
            setPendingPlacement(null);
            setJustPlaced(obj);

        } else if (pending.type === 'pattern') {
            if (!pending.patternUrl) { setPendingPlacement(null); return; }

            const patternImgEl = new Image();
            patternImgEl.crossOrigin = 'anonymous';
            patternImgEl.onload = async () => {
                const fCanvas = fabricRef.current;
                if (!fCanvas) return;

                // Scale the pattern tile if a scale factor was provided
                const patScale = (pending as any).patternScale ?? 1;
                const scaledW = patternImgEl.naturalWidth * patScale;
                const scaledH = patternImgEl.naturalHeight * patScale;

                // Create a scaled tile canvas
                const tileCnv = document.createElement('canvas');
                tileCnv.width = scaledW;
                tileCnv.height = scaledH;
                const tileCtx = tileCnv.getContext('2d')!;
                tileCtx.drawImage(patternImgEl, 0, 0, scaledW, scaledH);

                const pat = new fabric.Pattern({ source: tileCnv as any, repeat: 'repeat' });

                const { isRasterMode: isRaster } = useDesign2DStore.getState();

                if (isRaster) {
                    // Raster mode: create a Rect with pattern fill, clipped by masked part
                    const clipObj = await buildClipForPart(partId);
                    const ri = rasterImgRef.current;
                    if (ri) {
                        const rect = new fabric.Rect({
                            left: ri.left ?? 0,
                            top: ri.top ?? 0,
                            width: (ri.width ?? 400) * (ri.scaleX ?? 1),
                            height: (ri.height ?? 500) * (ri.scaleY ?? 1),
                            fill: pat,
                            selectable: true,
                            evented: true,
                            cornerColor: '#d4af37',
                            cornerStrokeColor: '#d4af37',
                            borderColor: '#d4af37',
                            cornerSize: 10,
                            transparentCorners: false,
                            padding: 8,
                            opacity: 0.85,
                        });
                        if (clipObj) rect.clipPath = clipObj;
                        fCanvas.add(rect);
                        fCanvas.setActiveObject(rect);
                        fCanvas.renderAll();
                        setJustPlaced(rect);
                    }
                } else {
                    // SVG mode: fill part objects directly
                    const partObjs = partsMapRef.current.get(partId);
                    if (partObjs) {
                        partObjs.forEach(o => o.set({ fill: pat }));
                        fCanvas.renderAll();
                    }
                }

                setPendingPlacement(null);
            };
            patternImgEl.src = pending.patternUrl;
        }
    }, [buildClipForPart, setPendingPlacement]);

    // ── 7. Click handler ───────────────────────────────────────────────────────
    useEffect(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;

        const onMouseDown = (e: any) => {
            const t = e.target as fabric.FabricObject | null;
            const pointer = canvas.getViewportPoint(e.e);

            let clickedPartId: string | null = null;

            // ── Raster mode: detect part by pixel coord ──
            const { isRasterMode: isRaster, pendingPlacement } = useDesign2DStore.getState();
            if (isRaster && rasterEngineRef.current && rasterImgRef.current) {
                const ri = rasterImgRef.current;
                // Convert canvas coords → image-space coords
                const imgX = (pointer.x - (ri.left ?? 0)) / (ri.scaleX ?? 1);
                const imgY = (pointer.y - (ri.top ?? 0)) / (ri.scaleY ?? 1);
                clickedPartId = rasterEngineRef.current.getPartAtPixel(imgX, imgY);
            } else {
                // SVG mode: match by fabric object
                if (t) {
                    for (const [pid, objs] of Array.from(partsMapRef.current.entries())) {
                        if (objs.includes(t)) { clickedPartId = pid; break; }
                    }
                }
            }

            if (pendingPlacement && clickedPartId) {
                canvas.defaultCursor = 'default';
                canvas.hoverCursor = 'pointer';
                placePendingItem(pendingPlacement, clickedPartId);
                return;
            }

            if (pendingPlacement && !clickedPartId) {
                selectPart(null);
                return;
            }

            // Skip annotation objects from triggering part selection
            if ((t as any)?.data?.type === 'annotation') return;

            selectPart(clickedPartId);
        };

        canvas.on('mouse:down', onMouseDown);
        return () => { canvas.off('mouse:down', onMouseDown); };
    }, [ready, selectPart, placePendingItem]);

    // ── 8. Cursor on placement mode ────────────────────────────────────────────
    useEffect(() => {
        const unsub = useDesign2DStore.subscribe((state) => {
            const canvas = fabricRef.current;
            if (!canvas) return;
            if (state.pendingPlacement) {
                canvas.defaultCursor = 'crosshair';
                canvas.hoverCursor = 'crosshair';
            } else {
                canvas.defaultCursor = 'default';
                canvas.hoverCursor = 'pointer';
            }
        });
        return unsub;
    }, []);

    // ── 9. Export & delete ─────────────────────────────────────────────────────
    const exportCanvas = useCallback(() => {
        return fabricRef.current?.toDataURL({ format: 'png', quality: 1, multiplier: 2 }) ?? '';
    }, []);

    const deleteSelected = useCallback(() => {
        const canvas = fabricRef.current;
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active?.selectable) {
            // Also remove any annotation attached to a non-annotation element
            if ((active as any)?.data?.type !== 'annotation') {
                const idx = annotationsRef.current.findIndex(a => a.targetObj === active);
                if (idx !== -1) {
                    const { noteGroup, line } = annotationsRef.current[idx];
                    canvas.remove(noteGroup);
                    canvas.remove(line);
                    annotationsRef.current.splice(idx, 1);
                }
            }
            canvas.remove(active);
            canvas.discardActiveObject();
            canvas.renderAll();
        }
    }, []);

    useEffect(() => {
        (window as any).__d2d_exportCanvas = exportCanvas;
        (window as any).__d2d_deleteSelected = deleteSelected;
        (window as any).__d2d_addAnnotation = addAnnotation;
        (window as any).__d2d_getJustPlaced = () => justPlaced;
        (window as any).__d2d_clearJustPlaced = () => setJustPlaced(null);
        return () => {
            delete (window as any).__d2d_exportCanvas;
            delete (window as any).__d2d_deleteSelected;
            delete (window as any).__d2d_addAnnotation;
            delete (window as any).__d2d_getJustPlaced;
            delete (window as any).__d2d_clearJustPlaced;
        };
    }, [exportCanvas, deleteSelected, addAnnotation, justPlaced]);

    return (
        <div className="d2d-canvas-wrapper" style={{ width: '100%', height: '100%' }}>
            <canvas ref={canvasRef} />
        </div>
    );
}
