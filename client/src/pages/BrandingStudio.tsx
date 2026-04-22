import { useState, useRef } from "react";
import { Link } from "wouter";
import {
    ArrowLeft, Download, Upload, Type, Palette, Layers,
    Trash2, ZoomIn, ChevronRight, RotateCcw, Info, Star, Shirt, Dumbbell
} from "lucide-react";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import FabricEditor, { FabricEditorRef } from "@/components/branding/FabricEditor";
import { WOVEN_TEMPLATES, WovenTemplate } from "@/lib/branding/templates";
import { LABEL_STYLES, LabelStyleId } from "@/lib/branding/labelStyles";
import { CARE_ICONS, careIconToDataUrl } from "@/lib/branding/careSymbols";
import SEOHead from "@/components/SEOHead";

// Tab IDs for bottom navigation
type ToolTab = 'style' | 'color' | 'logo' | 'text' | 'care';

const TOOL_TABS: { id: ToolTab; label: string; icon: React.ReactNode }[] = [
    { id: 'style', label: 'Style', icon: <Layers className="w-5 h-5" /> },
    { id: 'color', label: 'Color', icon: <Palette className="w-5 h-5" /> },
    { id: 'logo', label: 'Logo', icon: <Upload className="w-5 h-5" /> },
    { id: 'text', label: 'Text', icon: <Type className="w-5 h-5" /> },
    { id: 'care', label: 'Care', icon: <Star className="w-5 h-5" /> },
];

const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
    'Fashion': <Shirt className="w-3.5 h-3.5" />,
    'Sport': <Dumbbell className="w-3.5 h-3.5" />,
    'Denim': <span className="text-xs">👖</span>,
    'Formal': <span className="text-xs">👔</span>,
    'Luxury': <span className="text-xs">✦</span>,
    'Headwear': <span className="text-xs">🧢</span>,
    'All Apparel': <span className="text-xs">🏷️</span>,
};

const BG_PRESETS = [
    { label: 'Ivory', value: '#f5f0e8' },
    { label: 'Black', value: '#0d0d0d' },
    { label: 'Navy', value: '#111827' },
    { label: 'White', value: '#ffffff' },
    { label: 'Cream', value: '#fdf8f0' },
    { label: 'Khaki', value: '#c5b08a' },
    { label: 'Slate', value: '#374151' },
    { label: 'Wine', value: '#7c1d2e' },
    { label: 'Forest', 'value': '#1a3a2a' },
    { label: 'Denim', value: '#1e2d40' },
    { label: 'Red', value: '#c0392b' },
    { label: 'Lime', value: '#14280a' },
];

const FONTS = [
    { label: 'Inter (Clean)', value: 'Inter' },
    { label: 'Playfair (Luxury Serif)', value: 'Playfair Display' },
    { label: 'Barlow Condensed', value: 'Barlow Condensed' },
    { label: 'Impact (Bold/Sport)', value: 'Impact' },
    { label: 'Courier (Mono)', value: 'Courier New' },
    { label: 'Georgia (Classic)', value: 'Georgia' },
];

const CARE_CATEGORIES = [
    { id: 'wash', label: 'Wash', color: '#2563eb' },
    { id: 'bleach', label: 'Bleach', color: '#d97706' },
    { id: 'dry', label: 'Dry', color: '#059669' },
    { id: 'iron', label: 'Iron', color: '#7c3aed' },
    { id: 'dryclean', label: 'Dry Clean', color: '#db2777' },
] as const;

export default function BrandingStudio() {
    const editorRef = useRef<FabricEditorRef>(null);

    const [activeTemplate, setActiveTemplate] = useState<WovenTemplate>(WOVEN_TEMPLATES[0]);
    const [activeLabelStyle, setActiveLabelStyle] = useState<LabelStyleId>('center-fold');
    const [activeTab, setActiveTab] = useState<ToolTab>('style');
    const [activeCare, setActiveCare] = useState<string>('wash');
    const [bgColor, setBgColor] = useState(WOVEN_TEMPLATES[0].backgroundColor);

    // Text editor state (populated when text element is selected)
    const [selectedObj, setSelectedObj] = useState<fabric.FabricObject | null>(null);
    const [textContent, setTextContent] = useState('');
    const [textColor, setTextColor] = useState('#000000');
    const [textFont, setTextFont] = useState('Inter');

    const handleSelectionChange = (obj: fabric.FabricObject | null) => {
        setSelectedObj(obj);
        if (obj?.type === 'i-text') {
            const t = obj as fabric.IText;
            setTextContent(t.text || '');
            setTextColor((t.fill as string) || '#000000');
            setTextFont(t.fontFamily || 'Inter');
            // Auto-switch to text tab when text is selected
            setActiveTab('text');
        }
    };

    const handleSelectTemplate = (tpl: WovenTemplate) => {
        setActiveTemplate(tpl);
        setActiveLabelStyle(tpl.labelStyle);
        setBgColor(tpl.backgroundColor);
        setSelectedObj(null);
    };

    const handleBgColor = (color: string) => {
        setBgColor(color);
        editorRef.current?.changeBackgroundColor(color);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = f => editorRef.current?.addImageFromDataUrl(f.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleUpdateText = (text: string, color: string, font: string) => {
        editorRef.current?.updateSelectedText(text, color, font);
    };

    const handleAddCareIcon = async (iconId: string) => {
        const icon = CARE_ICONS.find(c => c.id === iconId);
        if (!icon || !editorRef.current) return;
        const darkBg = isDarkColor(bgColor);
        const color = darkBg ? '#ffffff' : '#1a1a1a';
        const url = careIconToDataUrl(icon, color, 80);
        editorRef.current.addImageFromDataUrl(url);
    };

    const handleDownload = () => {
        const url = editorRef.current?.exportDesign();
        if (!url) return;
        const a = document.createElement('a');
        a.download = `woven-label-${activeTemplate.id}-${Date.now()}.png`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Filter templates by the selected label style
    const styleTemplates = WOVEN_TEMPLATES.filter(t => t.labelStyle === activeLabelStyle);
    const currentLabelStyleInfo = LABEL_STYLES.find(s => s.id === activeLabelStyle)!;

    return (
        <div className="dark flex flex-col h-screen bg-[#111] text-foreground overflow-hidden select-none">
            <SEOHead
                title="Woven Label Design Studio | Pak Homies Industry"
                description="Design professional woven labels online — Center fold, end fold, patch, care strips and more. Download as PNG."
            />

            {/* ════════════════════════════════════════════════════════════
                TOP HEADER
            ════════════════════════════════════════════════════════════ */}
            <header className="flex-shrink-0 h-14 bg-[#1a1a1a] border-b border-white/10 flex items-center justify-between px-4 z-30">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <button className="w-9 h-9 rounded-full flex items-center justify-center bg-white/8 hover:bg-white/15 transition-colors">
                            <ArrowLeft className="w-4 h-4 text-white" />
                        </button>
                    </Link>
                    <div className="leading-tight">
                        <div className="text-sm font-bold text-white">Woven Label Studio</div>
                        <div className="text-[10px] text-white/40 hidden sm:block">
                            {currentLabelStyleInfo?.name} · {activeTemplate.width}×{activeTemplate.height}mm
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Undo / info hints shown on desktop */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="hidden lg:flex w-9 h-9 rounded-full items-center justify-center bg-white/8 hover:bg-white/15 transition-colors">
                                <Info className="w-4 h-4 text-white/60" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs text-xs">
                            <p><strong>How to use:</strong> Click a text element on the canvas to edit it. Drag elements to reposition. Use the tabs below to change style, color, add logos, care icons.</p>
                        </TooltipContent>
                    </Tooltip>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 h-9 px-4 rounded-full bg-[#c9a84c] hover:bg-[#d4af37] text-black font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download PNG</span>
                        <span className="sm:hidden">Save</span>
                    </button>
                </div>
            </header>

            {/* ════════════════════════════════════════════════════════════
                MAIN AREA — canvas + desktop sidebar
            ════════════════════════════════════════════════════════════ */}
            <div className="flex-1 flex overflow-hidden">

                {/* ── DESKTOP LEFT SIDEBAR ──────────────────────────────── */}
                <aside className="hidden lg:flex w-80 flex-col bg-[#1a1a1a] border-r border-white/8 overflow-hidden z-20">
                    {/* Label Type Picker */}
                    <div className="p-4 border-b border-white/8">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Label Type</p>
                        <div className="space-y-1">
                            {LABEL_STYLES.map(style => (
                                <button key={style.id}
                                    onClick={() => {
                                        setActiveLabelStyle(style.id);
                                        const first = WOVEN_TEMPLATES.find(t => t.labelStyle === style.id);
                                        if (first) handleSelectTemplate(first);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group ${activeLabelStyle === style.id
                                        ? 'bg-[#c9a84c]/20 border border-[#c9a84c]/40'
                                        : 'hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    {/* SVG thumbnail */}
                                    <div className="w-14 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-black/30 flex items-center justify-center"
                                        dangerouslySetInnerHTML={{ __html: style.thumbnailSvg }} />
                                    <div className="min-w-0">
                                        <div className={`text-xs font-bold leading-tight ${activeLabelStyle === style.id ? 'text-[#c9a84c]' : 'text-white'}`}>
                                            {style.name}
                                        </div>
                                        <div className="text-[10px] text-white/40 leading-tight truncate">{style.subtitle}</div>
                                        <div className="text-[9px] text-white/25 mt-0.5">{style.dimensions}</div>
                                    </div>
                                    <ChevronRight className={`w-3.5 h-3.5 ml-auto flex-shrink-0 ${activeLabelStyle === style.id ? 'text-[#c9a84c]' : 'text-white/20 group-hover:text-white/40'}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Template Presets for selected style */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Presets</p>
                        <div className="grid grid-cols-2 gap-2">
                            {(styleTemplates.length > 0 ? styleTemplates : WOVEN_TEMPLATES).map(tpl => (
                                <button key={tpl.id}
                                    onClick={() => handleSelectTemplate(tpl)}
                                    className={`rounded-xl overflow-hidden border transition-all text-left group ${activeTemplate.id === tpl.id
                                        ? 'border-[#c9a84c] ring-1 ring-[#c9a84c]/40'
                                        : 'border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    <div className="h-16 relative" style={{ background: tpl.previewGradient }}>
                                        {/* Industry badge */}
                                        <span className="absolute top-1.5 left-1.5 flex items-center gap-1 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/50 text-white">
                                            {INDUSTRY_ICONS[tpl.industry]}
                                        </span>
                                    </div>
                                    <div className="p-2 bg-[#222] border-t border-white/5">
                                        <div className="text-[10px] font-bold text-white leading-tight">{tpl.name}</div>
                                        <div className="text-[9px] text-white/40">{tpl.subtitle}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ── CANVAS ──────────────────────────────────────────── */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Floating contextual toolbar (desktop) */}
                    <div className="hidden lg:flex items-center gap-1 px-4 py-2 bg-[#1a1a1a]/80 backdrop-blur border-b border-white/8 flex-shrink-0">
                        <span className="text-xs text-white/40 mr-2">
                            <ZoomIn className="w-3.5 h-3.5 inline mr-1 opacity-60" />
                            Drag to move · Click text to edit · Drag to reposition
                        </span>
                        {selectedObj && (
                            <>
                                <div className="w-px h-4 bg-white/15 mx-1" />
                                <button onClick={() => editorRef.current?.deleteSelected()}
                                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all">
                                    <Trash2 className="w-3.5 h-3.5" /> Delete element
                                </button>
                            </>
                        )}
                    </div>

                    {/* Canvas area */}
                    <div className="flex-1 overflow-hidden">
                        <FabricEditor
                            ref={editorRef}
                            template={activeTemplate}
                            onSelectionChange={handleSelectionChange}
                            onBackgroundColorChange={setBgColor}
                        />
                    </div>

                    {/* ── BOTTOM TOOL TABS (all screen sizes) ─────────── */}
                    <div className="flex-shrink-0 bg-[#1a1a1a] border-t border-white/10 z-20">
                        {/* Tab bar */}
                        <div className="flex border-b border-white/8">
                            {TOOL_TABS.map(tab => (
                                <button key={tab.id}
                                    onClick={() => setActiveTab(tab.id === activeTab ? activeTab : tab.id)}
                                    className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id
                                        ? 'text-[#c9a84c] border-t-2 border-[#c9a84c] bg-[#c9a84c]/5'
                                        : 'text-white/40 hover:text-white/70'
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="hidden sm:block">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab panel content */}
                        <div className="max-h-60 lg:max-h-72 overflow-y-auto">

                            {/* ── STYLE TAB ───────────────────────────── */}
                            {activeTab === 'style' && (
                                <div className="p-4">
                                    {/* Mobile: label type row */}
                                    <div className="lg:hidden mb-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-2">Label Type</p>
                                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                            {LABEL_STYLES.map(style => (
                                                <button key={style.id}
                                                    onClick={() => {
                                                        setActiveLabelStyle(style.id);
                                                        const first = WOVEN_TEMPLATES.find(t => t.labelStyle === style.id);
                                                        if (first) handleSelectTemplate(first);
                                                    }}
                                                    className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-xl border w-[82px] transition-all ${activeLabelStyle === style.id
                                                        ? 'border-[#c9a84c] bg-[#c9a84c]/10'
                                                        : 'border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className="w-12 h-9 rounded overflow-hidden bg-black/20"
                                                        dangerouslySetInnerHTML={{ __html: style.thumbnailSvg.replace('width="80"', 'width="48"').replace('height="60"', 'height="36"') }} />
                                                    <span className={`text-[9px] font-bold text-center leading-tight ${activeLabelStyle === style.id ? 'text-[#c9a84c]' : 'text-white/60'}`}>
                                                        {style.id === 'center-fold' ? 'Neck' : style.id === 'end-fold' ? 'EndFold' : style.id === 'straight-cut' ? 'Flat' : style.id === 'woven-patch' ? 'Patch' : style.id === 'care-strip' ? 'Care' : style.id === 'loop-fold' ? 'Cap' : 'Mitre'}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Description of selected label type */}
                                    {currentLabelStyleInfo && (
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/8 mb-3">
                                            <p className="text-xs font-bold text-white/80 mb-0.5">{currentLabelStyleInfo.name} — {currentLabelStyleInfo.dimensions}</p>
                                            <p className="text-[10px] text-white/40 leading-relaxed">{currentLabelStyleInfo.description}</p>
                                            <p className="text-[10px] text-[#c9a84c]/70 mt-1 font-semibold">📍 {currentLabelStyleInfo.useCase}</p>
                                        </div>
                                    )}

                                    {/* Template grid */}
                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-2">Choose Preset</p>
                                    <div className="flex gap-2.5 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible scrollbar-none">
                                        {(styleTemplates.length > 0 ? styleTemplates : WOVEN_TEMPLATES).map(tpl => (
                                            <button key={tpl.id}
                                                onClick={() => handleSelectTemplate(tpl)}
                                                className={`flex-shrink-0 w-24 rounded-xl overflow-hidden border transition-all ${activeTemplate.id === tpl.id
                                                    ? 'border-[#c9a84c] ring-1 ring-[#c9a84c]/40'
                                                    : 'border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <div className="h-14 relative" style={{ background: tpl.previewGradient }}>
                                                    <span className="absolute bottom-1.5 right-1.5 text-[7px] font-black uppercase tracking-wider px-1 py-0.5 rounded bg-black/50 text-white">
                                                        {tpl.industry}
                                                    </span>
                                                </div>
                                                <div className="py-1.5 px-2 bg-[#222]">
                                                    <div className="text-[9px] font-bold text-white leading-tight">{tpl.name}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── COLOR TAB ───────────────────────────── */}
                            {activeTab === 'color' && (
                                <div className="p-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-3">Label Background Color</p>
                                    {/* Presets */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {BG_PRESETS.map(p => (
                                            <Tooltip key={p.value}>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => handleBgColor(p.value)}
                                                        className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 active:scale-95 ${bgColor === p.value ? 'border-[#c9a84c] scale-110 shadow-lg shadow-black/50' : 'border-white/20'}`}
                                                        style={{ background: p.value }}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent side="top"><p className="text-xs">{p.label}</p></TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </div>
                                    {/* Custom color */}
                                    <div className="flex items-center gap-3">
                                        <Label className="text-xs text-white/50 w-24 flex-shrink-0">Custom hex:</Label>
                                        <div className="flex gap-2 flex-1">
                                            <input type="color" value={bgColor}
                                                onChange={e => handleBgColor(e.target.value)}
                                                className="w-11 h-9 p-0.5 rounded-lg border border-white/20 bg-transparent cursor-pointer" />
                                            <Input value={bgColor}
                                                onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) handleBgColor(e.target.value); }}
                                                className="flex-1 bg-white/8 border-white/15 text-white font-mono uppercase text-xs h-9" />
                                        </div>
                                    </div>
                                    {/* Thread color quick tip */}
                                    <p className="text-[10px] text-white/30 mt-3 leading-relaxed">
                                        💡 This sets the woven fabric base color. Max 8 thread colors per label. For best quality, choose high-contrast combinations.
                                    </p>
                                </div>
                            )}

                            {/* ── LOGO TAB ─────────────────────────────── */}
                            {activeTab === 'logo' && (
                                <div className="p-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-3">Upload Artwork / Logo</p>
                                    <label className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-white/20 hover:border-[#c9a84c]/50 bg-white/4 cursor-pointer transition-all group">
                                        <Upload className="w-8 h-8 text-white/30 group-hover:text-[#c9a84c]/60 transition-colors" />
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-white/70">Click to upload</p>
                                            <p className="text-xs text-white/35 mt-0.5">PNG, JPG, or SVG · Best: transparent PNG</p>
                                        </div>
                                        <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={handleLogoUpload} />
                                    </label>
                                    <p className="text-[10px] text-white/30 mt-3 leading-relaxed">
                                        After uploading, drag it to position and use the corner handles to resize. For woven labels, use bold, high-contrast logo files for best production result.
                                    </p>
                                </div>
                            )}

                            {/* ── TEXT TAB ─────────────────────────────── */}
                            {activeTab === 'text' && (
                                <div className="p-4">
                                    {selectedObj?.type === 'i-text' ? (
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#c9a84c]/80">Editing Selected Text</p>
                                            {/* Content */}
                                            <div className="space-y-1">
                                                <Label className="text-[10px] text-white/50 uppercase tracking-wider">Text Content</Label>
                                                <Input value={textContent}
                                                    onChange={e => { setTextContent(e.target.value); handleUpdateText(e.target.value, textColor, textFont); }}
                                                    className="bg-white/8 border-white/15 text-white text-sm h-9" />
                                            </div>
                                            {/* Font + color side by side */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] text-white/50 uppercase tracking-wider">Font</Label>
                                                    <Select value={textFont} onValueChange={v => { setTextFont(v); handleUpdateText(textContent, textColor, v); }}>
                                                        <SelectTrigger className="bg-white/8 border-white/15 text-white h-9 text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {FONTS.map(f => (
                                                                <SelectItem key={f.value} value={f.value} className="text-xs">{f.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] text-white/50 uppercase tracking-wider">Color</Label>
                                                    <div className="flex gap-1.5">
                                                        <input type="color" value={textColor}
                                                            onChange={e => { setTextColor(e.target.value); handleUpdateText(textContent, e.target.value, textFont); }}
                                                            className="w-9 h-9 p-0.5 rounded-lg border border-white/20 cursor-pointer bg-transparent" />
                                                        <Input value={textColor}
                                                            onChange={e => { setTextColor(e.target.value); handleUpdateText(textContent, e.target.value, textFont); }}
                                                            className="flex-1 bg-white/8 border-white/15 text-white font-mono uppercase text-xs h-9 px-2" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Quick text color chips */}
                                            <div className="flex gap-1.5 flex-wrap">
                                                {['#ffffff', '#000000', '#d4af37', '#c9a84c', '#c0392b', '#2563eb', '#aaff00', '#b8732a', '#888888', '#f5f0e8'].map(c => (
                                                    <button key={c}
                                                        onClick={() => { setTextColor(c); handleUpdateText(textContent, c, textFont); }}
                                                        className={`w-7 h-7 rounded-full border-2 hover:scale-110 transition-all ${textColor === c ? 'border-[#c9a84c] scale-110' : 'border-white/20'}`}
                                                        style={{ background: c }} />
                                                ))}
                                            </div>
                                            {/* Delete */}
                                            <button onClick={() => editorRef.current?.deleteSelected()}
                                                className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 py-2 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" /> Remove this text element
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center text-white/30">
                                            <Type className="w-10 h-10 mb-3 opacity-20" />
                                            <p className="text-sm font-semibold text-white/50">No text selected</p>
                                            <p className="text-xs mt-1">👆 Tap any text on the label above to edit it here</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── CARE ICONS TAB ───────────────────────── */}
                            {activeTab === 'care' && (
                                <div className="p-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40 mb-3">
                                        ISO 3758 Care Label Symbols
                                        <span className="ml-1 font-normal text-white/25">— tap to stamp on label</span>
                                    </p>
                                    {/* Category pills */}
                                    <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-none pb-1">
                                        {CARE_CATEGORIES.map(cat => (
                                            <button key={cat.id}
                                                onClick={() => setActiveCare(cat.id)}
                                                className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${activeCare === cat.id
                                                    ? 'text-white border-transparent'
                                                    : 'border-white/15 text-white/40 hover:border-white/30'
                                                    }`}
                                                style={activeCare === cat.id ? { background: cat.color, borderColor: cat.color } : {}}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                    {/* Icons grid */}
                                    <div className="flex flex-wrap gap-2">
                                        {CARE_ICONS.filter(i => i.category === activeCare).map(icon => (
                                            <Tooltip key={icon.id}>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={() => handleAddCareIcon(icon.id)}
                                                        className="w-14 h-14 rounded-xl border border-white/15 bg-white/5 flex flex-col items-center justify-center hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/10 hover:scale-105 active:scale-95 transition-all"
                                                    >
                                                        <div className="w-9 h-9 text-white" dangerouslySetInnerHTML={{ __html: icon.svg }} />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top" className="text-xs">{icon.label}</TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-white/25 mt-3 leading-relaxed">
                                        Icons appear in white on dark labels, black on light labels. Drag and resize after placing.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── DESKTOP RIGHT PROPERTIES PANEL ────────────────── */}
                <aside className="hidden xl:flex w-72 flex-col bg-[#1a1a1a] border-l border-white/8 overflow-y-auto">
                    <div className="p-4 border-b border-white/8">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Properties</p>
                    </div>

                    {selectedObj?.type === 'i-text' ? (
                        <div className="p-4 space-y-4">
                            <p className="text-xs font-bold text-[#c9a84c]">Text Properties</p>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-white/50 uppercase tracking-wider">Content</Label>
                                <Input value={textContent}
                                    onChange={e => { setTextContent(e.target.value); handleUpdateText(e.target.value, textColor, textFont); }}
                                    className="bg-white/8 border-white/15 text-white text-sm h-9" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-white/50 uppercase tracking-wider">Font</Label>
                                <Select value={textFont} onValueChange={v => { setTextFont(v); handleUpdateText(textContent, textColor, v); }}>
                                    <SelectTrigger className="bg-white/8 border-white/15 text-white h-9 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>{FONTS.map(f => <SelectItem key={f.value} value={f.value} className="text-xs">{f.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] text-white/50 uppercase tracking-wider">Color</Label>
                                <div className="flex gap-2">
                                    <input type="color" value={textColor} onChange={e => { setTextColor(e.target.value); handleUpdateText(textContent, e.target.value, textFont); }} className="w-9 h-9 p-0.5 rounded border border-white/20 cursor-pointer bg-transparent" />
                                    <Input value={textColor} onChange={e => { setTextColor(e.target.value); handleUpdateText(textContent, e.target.value, textFont); }} className="flex-1 bg-white/8 border-white/15 text-white font-mono uppercase text-xs h-9" />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {['#ffffff', '#000000', '#d4af37', '#c0392b', '#2563eb', '#aaff00', '#b8732a', '#888888'].map(c => (
                                    <button key={c} onClick={() => { setTextColor(c); handleUpdateText(textContent, c, textFont); }}
                                        className={`w-7 h-7 rounded-full border-2 hover:scale-110 transition-all ${textColor === c ? 'border-[#c9a84c] scale-110' : 'border-white/20'}`}
                                        style={{ background: c }} />
                                ))}
                            </div>
                            <button onClick={() => editorRef.current?.deleteSelected()} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 mt-2 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" /> Delete element
                            </button>
                        </div>
                    ) : (
                        // Background color when nothing selected
                        <div className="p-4 space-y-4">
                            <p className="text-xs font-bold text-white/60">Background Color</p>
                            <div className="flex flex-wrap gap-2">
                                {BG_PRESETS.map(p => (
                                    <Tooltip key={p.value}>
                                        <TooltipTrigger asChild>
                                            <button onClick={() => handleBgColor(p.value)}
                                                className={`w-8 h-8 rounded-lg border-2 hover:scale-110 transition-all ${bgColor === p.value ? 'border-[#c9a84c] scale-110' : 'border-white/20'}`}
                                                style={{ background: p.value }} />
                                        </TooltipTrigger>
                                        <TooltipContent side="top"><p className="text-xs">{p.label}</p></TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input type="color" value={bgColor} onChange={e => handleBgColor(e.target.value)} className="w-9 h-9 p-0.5 rounded border border-white/20 cursor-pointer bg-transparent" />
                                <Input value={bgColor} onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) handleBgColor(e.target.value); }}
                                    className="flex-1 bg-white/8 border-white/15 text-white font-mono uppercase text-xs h-9" />
                            </div>
                            <p className="text-[10px] text-white/30 leading-relaxed mt-2">
                                💡 Click any text element on the canvas to edit it.
                                Tap a care icon to stamp it directly onto the label.
                            </p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}

function isDarkColor(hex: string): boolean {
    const clean = hex.replace('#', '');
    if (clean.length < 6) return false;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
}
