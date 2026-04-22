import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import * as fabric from 'fabric';
import { WovenTemplate, buildStitchGuide } from '@/lib/branding/templates';

export interface FabricEditorRef {
    exportDesign: () => string | null;
    addImageFromDataUrl: (dataUrl: string) => void;
    updateSelectedText: (text: string, color: string, fontFamily: string) => void;
    changeBackgroundColor: (color: string) => void;
    deleteSelected: () => void;
}

interface Props {
    template: WovenTemplate | null;
    onSelectionChange?: (obj: fabric.FabricObject | null) => void;
    onBackgroundColorChange?: (color: string) => void;
}

const PADDING = 0.88;

const FabricEditor = forwardRef<FabricEditorRef, Props>(
    ({ template, onSelectionChange, onBackgroundColorChange }, ref) => {
        const canvasEl = useRef<HTMLCanvasElement>(null);
        const containerEl = useRef<HTMLDivElement>(null);
        const [fc, setFc] = useState<fabric.Canvas | null>(null);
        const templateRef = useRef<WovenTemplate | null>(null);

        const fitLayout = useCallback((canvas: fabric.Canvas, tpl: WovenTemplate) => {
            if (!containerEl.current) return;
            const { clientWidth: cw, clientHeight: ch } = containerEl.current;
            if (!cw || !ch) return;
            const zoom = Math.min((cw / tpl.width) * PADDING, (ch / tpl.height) * PADDING);
            canvas.setDimensions({ width: cw, height: ch });
            canvas.setZoom(zoom);
            const vpt = canvas.viewportTransform!;
            vpt[4] = (cw - tpl.width * zoom) / 2;
            vpt[5] = (ch - tpl.height * zoom) / 2;
            canvas.requestRenderAll();
        }, []);

        // Init canvas once
        useEffect(() => {
            if (!canvasEl.current) return;
            const canvas = new fabric.Canvas(canvasEl.current, {
                preserveObjectStacking: true,
                selection: true,
            });
            const onSel = () => onSelectionChange?.(canvas.getActiveObject() || null);
            canvas.on('selection:created', onSel);
            canvas.on('selection:updated', onSel);
            canvas.on('selection:cleared', onSel);
            setFc(canvas);
            return () => { canvas.dispose(); };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        // Load template
        useEffect(() => {
            if (!fc || !template) return;
            templateRef.current = template;
            fc.clear();
            fc.backgroundColor = template.backgroundColor;

            const load = async () => {
                // 1. Woven texture background image (optional)
                if (template.backgroundImage) {
                    try {
                        const img = await fabric.FabricImage.fromURL(template.backgroundImage, { crossOrigin: 'anonymous' });
                        img.set({ left: 0, top: 0, selectable: false, evented: false });
                        img.scaleX = template.width / (img.width || template.width);
                        img.scaleY = template.height / (img.height || template.height);
                        img.opacity = 0.40;
                        fc.add(img);
                        fc.sendObjectToBack(img);
                    } catch { /* silent */ }
                }

                // 2. Content elements
                template.elements.forEach(el => addElement(fc, el));

                // 3. Stitch guide overlay (always on top, non-interactive)
                const stitchGuide = buildStitchGuide(
                    template.width, template.height,
                    22,
                    template.labelStyle,
                    getStitchColor(template.backgroundColor),
                );
                stitchGuide.forEach(el => addElement(fc, el));

                fitLayout(fc, template);
                fc.renderAll();
            };
            load();

            const handleResize = () => { if (templateRef.current) fitLayout(fc, templateRef.current); };
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, [fc, template, fitLayout]);

        useImperativeHandle(ref, () => ({
            exportDesign: () => {
                if (!fc || !templateRef.current) return null;
                const tpl = templateRef.current;
                const origZoom = fc.getZoom();
                const origVpt = [...fc.viewportTransform!] as [number, number, number, number, number, number];
                fc.setDimensions({ width: tpl.width, height: tpl.height });
                fc.setZoom(1);
                fc.viewportTransform = [1, 0, 0, 1, 0, 0];
                fc.renderAll();
                const url = fc.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
                fc.setZoom(origZoom);
                fc.viewportTransform = origVpt;
                if (containerEl.current) fc.setDimensions({ width: containerEl.current.clientWidth, height: containerEl.current.clientHeight });
                fc.renderAll();
                return url;
            },
            addImageFromDataUrl: async (dataUrl: string) => {
                if (!fc || !templateRef.current) return;
                const tpl = templateRef.current;
                try {
                    const img = await fabric.FabricImage.fromURL(dataUrl);
                    if (img.width && img.height) {
                        const maxSz = Math.min(tpl.width, tpl.height) * 0.32;
                        const scale = Math.min(maxSz / img.width, maxSz / img.height);
                        img.scale(scale);
                    }
                    img.set({ left: tpl.width / 2, top: tpl.height / 2, originX: 'center', originY: 'center' });
                    fc.add(img);
                    fc.setActiveObject(img);
                    fc.renderAll();
                } catch (e) { console.error(e); }
            },
            updateSelectedText: (text: string, color: string, fontFamily: string) => {
                if (!fc) return;
                const obj = fc.getActiveObject();
                if (obj?.type === 'i-text') {
                    const t = obj as fabric.IText;
                    if (text !== undefined) t.set('text', text);
                    if (color) t.set('fill', color);
                    if (fontFamily) t.set('fontFamily', fontFamily);
                    fc.renderAll();
                }
            },
            changeBackgroundColor: (color: string) => {
                if (!fc) return;
                fc.backgroundColor = color;
                fc.renderAll();
                onBackgroundColorChange?.(color);
            },
            deleteSelected: () => {
                if (!fc) return;
                const obj = fc.getActiveObject();
                if (obj && !('isStitchGuide' in obj && (obj as any).isStitchGuide)) {
                    fc.remove(obj);
                    fc.discardActiveObject();
                    fc.renderAll();
                }
            },
        }));

        return (
            <div ref={containerEl} className="w-full h-full relative overflow-hidden"
                style={{
                    backgroundImage:
                        'linear-gradient(45deg,#ccc 25%,transparent 25%),' +
                        'linear-gradient(-45deg,#ccc 25%,transparent 25%),' +
                        'linear-gradient(45deg,transparent 75%,#ccc 75%),' +
                        'linear-gradient(-45deg,transparent 75%,#ccc 75%)',
                    backgroundSize: '16px 16px',
                    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
                    backgroundColor: '#e8e8e8',
                }}>
                <canvas ref={canvasEl} className="absolute inset-0" />
                {!template && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm text-muted-foreground text-center p-8 z-10">
                        <span className="text-4xl mb-4">🔖</span>
                        <p className="font-semibold text-foreground">Choose a label style to start designing</p>
                        <p className="text-sm mt-1">Pick from 7 industry-standard woven label formats</p>
                    </div>
                )}
            </div>
        );
    }
);

FabricEditor.displayName = 'FabricEditor';
export default FabricEditor;

// ─── Internal helpers ─────────────────────────────────────────────────────────

function getStitchColor(bgColor: string): string {
    // Determine if background is dark or light
    const dark = isDarkColor(bgColor);
    return dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.28)';
}

function isDarkColor(hex: string): boolean {
    const clean = hex.replace('#', '');
    if (clean.length < 6) return false;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
}

import { TemplateElement } from '@/lib/branding/templates';
function addElement(canvas: fabric.Canvas, el: TemplateElement) {
    const common = {
        left: el.left || 0,
        top: el.top || 0,
        selectable: el.selectable !== undefined ? el.selectable : !el.isStitchGuide,
        evented: el.evented !== undefined ? el.evented : !el.isStitchGuide,
        opacity: el.opacity !== undefined ? el.opacity : 1,
    };

    let obj: fabric.FabricObject | null = null;

    if (el.type === 'rect') {
        obj = new fabric.Rect({
            ...common,
            width: el.width || 100,
            height: el.height || 100,
            fill: el.fill || 'transparent',
            stroke: el.stroke,
            strokeWidth: el.strokeWidth,
            strokeDashArray: el.strokeDashArray,
            rx: el.rx,
            ry: el.ry,
        });
    } else if (el.type === 'circle') {
        obj = new fabric.Circle({
            ...common,
            radius: (el.width || 30) / 2,
            originX: 'center',
            originY: 'center',
            fill: el.fill || '#000',
            stroke: el.stroke,
            strokeWidth: el.strokeWidth,
        });
    } else if (el.type === 'text') {
        obj = new fabric.IText(el.text || 'Text', {
            ...common,
            fontSize: el.fontSize || 20,
            fontFamily: el.fontFamily || 'Inter',
            fontWeight: (el.fontWeight as string) || 'normal',
            fill: el.fill || '#000',
            textAlign: (el.textAlign as 'left' | 'center' | 'right' | 'justify') || 'left',
            originX: el.textAlign === 'center' ? 'center' : 'left',
            charSpacing: el.charSpacing || 0,
            lineHeight: el.lineHeight || 1.3,
        });
    } else if (el.type === 'line') {
        obj = new fabric.Line(
            [el.x1 || 0, el.y1 || 0, el.x2 || 0, el.y2 || 0],
            {
                selectable: el.selectable !== undefined ? el.selectable : false,
                evented: el.evented !== undefined ? el.evented : false,
                stroke: el.stroke || '#000',
                strokeWidth: el.strokeWidth || 1,
                strokeDashArray: el.strokeDashArray,
                opacity: el.opacity !== undefined ? el.opacity : 1,
            }
        );
    }

    if (obj) {
        (obj as any).isStitchGuide = !!el.isStitchGuide;
        canvas.add(obj);
    }
}
