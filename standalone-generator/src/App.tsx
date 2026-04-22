import React, { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, CheckCircle, Loader2, Server, CloudUpload, Settings, Eye, EyeOff, KeyRound, Upload, Download } from 'lucide-react';

const API_BASE = "http://localhost:4005/api";

type ViewType = 'front' | 'back' | 'left' | 'right' | 'closeup';

export default function App() {
    const [prompt, setPrompt] = useState("");
    const [logoBase64, setLogoBase64] = useState<string | null>(null);
    const [status, setStatus] = useState<"idle" | "generating_concept" | "review_concept" | "generating_view" | "analyzing_seo" | "review_seo" | "uploading_cloud" | "publishing_db" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    // The 2-view master reference
    const [gridImage, setGridImage] = useState<{ base64: string, mimeType: string } | null>(null);

    // The derived standalone views mapping
    const [subViews, setSubViews] = useState<Record<string, { base64: string, mimeType: string }>>({});

    // The image selected to push to the live database
    const [activePublishImage, setActivePublishImage] = useState<{ base64: string, mimeType: string } | null>(null);

    const [prefilledData, setPrefilledData] = useState<any>(null);

    // API Keys & Hostinger SFTP (persisted in localStorage)
    const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
    const [sftpHost, setSftpHost] = useState(() => localStorage.getItem('sftp_host') || '');
    const [sftpUser, setSftpUser] = useState(() => localStorage.getItem('sftp_user') || '');
    const [sftpPass, setSftpPass] = useState(() => localStorage.getItem('sftp_pass') || '');
    const [siteDomain, setSiteDomain] = useState(() => localStorage.getItem('site_domain') || '');
    const [showSettings, setShowSettings] = useState(false);
    const [showGeminiKey, setShowGeminiKey] = useState(false);
    const [showSftpPass, setShowSftpPass] = useState(false);

    useEffect(() => { localStorage.setItem('gemini_api_key', geminiKey); }, [geminiKey]);
    useEffect(() => { localStorage.setItem('sftp_host', sftpHost); }, [sftpHost]);
    useEffect(() => { localStorage.setItem('sftp_user', sftpUser); }, [sftpUser]);
    useEffect(() => { localStorage.setItem('sftp_pass', sftpPass); }, [sftpPass]);
    useEffect(() => { localStorage.setItem('site_domain', siteDomain); }, [siteDomain]);

    const keysConfigured = geminiKey.length > 10;
    const sftpConfigured = sftpHost.length > 3 && sftpUser.length > 1 && sftpPass.length > 1;

    // Handle Logo Upload
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoBase64(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // 1. Generate Master Concept
    const handleGenerateConcept = async () => {
        if (!prompt) return;
        setStatus("generating_concept");
        setErrorMsg("");
        setGridImage(null);
        setSubViews({});
        setActivePublishImage(null);
        setPrefilledData(null);

        try {
            const res = await fetch(`${API_BASE}/generate-concept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, geminiKey, logoBase64 })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setGridImage({ base64: data.base64, mimeType: data.mimeType });
            setStatus("review_concept");
        } catch (err: any) {
            setErrorMsg(err.message);
            setStatus("error");
        }
    };

    // 2. Generate Specific View from Concept
    const handleGenerateView = async (viewType: ViewType) => {
        if (!gridImage) return;
        setStatus("generating_view");
        setErrorMsg("");

        try {
            const res = await fetch(`${API_BASE}/generate-view`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    viewType,
                    referenceBase64: `data:${gridImage.mimeType};base64,${gridImage.base64}`,
                    geminiKey
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSubViews(prev => ({
                ...prev,
                [viewType]: { base64: data.base64, mimeType: data.mimeType }
            }));
            setStatus("review_concept"); // Return back to gallery
        } catch (err: any) {
            setErrorMsg(err.message);
            setStatus("review_concept"); // Don't wipe everything on sub-view fail
        }
    };

    // 3. Proceed to SEO with the selected image
    const handleProceedToSEO = async (selectedImage: { base64: string, mimeType: string }) => {
        setActivePublishImage(selectedImage);
        setStatus("analyzing_seo");
        setErrorMsg("");

        try {
            const seoRes = await fetch(`${API_BASE}/prefill-seo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, base64: selectedImage.base64, mimeType: selectedImage.mimeType, geminiKey })
            });
            const seoData = await seoRes.json();
            if (!seoRes.ok) throw new Error(seoData.error);
            setPrefilledData(seoData);

            setStatus("review_seo");
        } catch (err: any) {
            setErrorMsg(err.message);
            setStatus("error");
        }
    };

    const handleDownloadImage = (e: React.MouseEvent, base64: string, mimeType: string, filename: string) => {
        e.stopPropagation();
        const a = document.createElement('a');
        a.href = `data:${mimeType};base64,${base64}`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // 4. Publish to DB
    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activePublishImage) return;

        setStatus("uploading_cloud");
        setErrorMsg("");

        try {
            const uploadRes = await fetch(`${API_BASE}/upload-hostinger`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ base64: activePublishImage.base64, sftpHost, sftpUser, sftpPass, sftpPort: '65002', siteDomain })
            });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error);

            setStatus("publishing_db");

            const finalPayload = {
                ...prefilledData,
                mainImage: uploadData.url,
                slug: prefilledData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            };

            const dbRes = await fetch(`${API_BASE}/publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPayload)
            });
            const dbData = await dbRes.json();
            if (!dbRes.ok) throw new Error(dbData.error);

            setStatus("success");
        } catch (err: any) {
            setErrorMsg(err.message);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 p-8 text-gray-100 font-sans selection:bg-yellow-500/30">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex items-center justify-between border-b border-gray-800 pb-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                            <Server className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-widest text-white">Sialkot <span className="text-yellow-500">Standalone App</span></h1>
                            <p className="text-sm text-gray-400 font-medium">Local Generation • Cloud Storage • Remote Publishing</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border font-mono shadow-inner transition-all ${keysConfigured
                            ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                            : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 animate-pulse'
                            }`}
                    >
                        <KeyRound className="w-3.5 h-3.5" />
                        {keysConfigured ? 'Keys Active' : 'Set API Keys'}
                    </button>
                </header>

                {/* API Keys Settings Panel */}
                {showSettings && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl shadow-black/50 space-y-4 animate-in">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-2">
                            <h3 className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-yellow-500">
                                <Settings className="w-4 h-4" /> API Configuration
                            </h3>
                            <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white text-xs uppercase tracking-wider">Close</button>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs uppercase font-bold text-gray-400">Gemini API Key <span className="text-red-400">*Required</span></label>
                            <div className="relative">
                                <input
                                    type={showGeminiKey ? 'text' : 'password'}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 pr-12 text-sm font-mono focus:border-yellow-500 outline-none placeholder:text-gray-700"
                                    placeholder="AIzaSy..."
                                    value={geminiKey}
                                    onChange={e => setGeminiKey(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowGeminiKey(!showGeminiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                    {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-600">Get from <a href="https://aistudio.google.com/apikey" target="_blank" className="text-yellow-600 hover:text-yellow-500 underline">Google AI Studio</a></p>
                        </div>

                        <div className="pt-4 border-t border-gray-800 space-y-3">
                            <label className="block text-xs uppercase font-bold text-yellow-500">Hostinger SFTP <span className="text-gray-600">(for direct image upload to your site)</span></label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">SSH Host</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm font-mono focus:border-yellow-500 outline-none placeholder:text-gray-700"
                                        placeholder="ssh.hostinger.com"
                                        value={sftpHost}
                                        onChange={e => setSftpHost(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">SSH Username</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm font-mono focus:border-yellow-500 outline-none placeholder:text-gray-700"
                                        placeholder="u123456789"
                                        value={sftpUser}
                                        onChange={e => setSftpUser(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">SSH Password</label>
                                <div className="relative">
                                    <input
                                        type={showSftpPass ? 'text' : 'password'}
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 pr-12 text-sm font-mono focus:border-yellow-500 outline-none placeholder:text-gray-700"
                                        placeholder="Your Hostinger SSH password"
                                        value={sftpPass}
                                        onChange={e => setSftpPass(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setShowSftpPass(!showSftpPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                        {showSftpPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Site Domain <span className="text-gray-600">(for public image URL)</span></label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-sm font-mono focus:border-yellow-500 outline-none placeholder:text-gray-700"
                                    placeholder="deepskyblue-kudu-567161.hostingersite.com"
                                    value={siteDomain}
                                    onChange={e => setSiteDomain(e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] text-gray-600">Find SSH credentials in Hostinger Panel → Hosting → SSH Access. Port 65002 is used by default.</p>
                        </div>

                        {keysConfigured && sftpConfigured && (
                            <div className="flex items-center gap-2 text-green-400 text-xs bg-green-500/5 border border-green-500/20 rounded-lg p-2.5">
                                <CheckCircle className="w-3.5 h-3.5" /> All credentials configured. You're ready to generate & publish!
                            </div>
                        )}
                        {keysConfigured && !sftpConfigured && (
                            <div className="flex items-center gap-2 text-yellow-400 text-xs bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2.5">
                                <KeyRound className="w-3.5 h-3.5" /> Gemini ready. Add Hostinger SFTP to enable publishing.
                            </div>
                        )}
                    </div>
                )}

                {/* Error State */}
                {status === "error" && (
                    <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm flex items-start gap-3">
                        <span className="text-lg">⚠️</span>
                        <div>
                            <strong className="block mb-1 font-bold text-red-300">Execution Error</strong>
                            <div className="font-mono text-xs opacity-80 break-all">{errorMsg}</div>
                            <button onClick={() => setStatus("idle")} className="mt-2 text-xs bg-red-500/20 hover:bg-red-500/40 px-3 py-1 rounded transition">Dismiss</button>
                        </div>
                    </div>
                )}

                {/* 1. Prompt Input */}
                {(status === "idle" || status === "error") && (
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl shadow-black/50 space-y-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-yellow-500 mb-2">
                                <Sparkles className="w-4 h-4" /> Define Product Prompt
                            </label>
                            <textarea
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-5 text-base focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none resize-none placeholder:text-gray-600 shadow-inner min-h-[140px]"
                                placeholder="Describe the product (e.g. Premium BJJ kimono, 450gsm, gold stitching...)"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                        </div>

                        <div className="border border-gray-800 rounded-xl p-4 bg-gray-950/50">
                            <label className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-400 mb-3">
                                <Upload className="w-3.5 h-3.5" /> Brand Logo (Optional)
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gray-800 file:text-white hover:file:bg-gray-700 transition"
                                />
                                {logoBase64 && (
                                    <div className="shrink-0 relative group rounded overflow-hidden">
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer" onClick={() => setLogoBase64(null)}>
                                            <span className="text-red-400 text-xs font-bold">Remove</span>
                                        </div>
                                        <img src={logoBase64} alt="Logo Preview" className="h-12 w-auto object-contain bg-white/10 rounded" />
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2">Upload a logo to embed it into the generated clothing design.</p>
                        </div>

                        <button
                            onClick={handleGenerateConcept}
                            disabled={!prompt || !keysConfigured}
                            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center shadow-[0_0_20px_rgba(234,179,8,0.15)] shadow-yellow-500/20"
                        >
                            Generate Master Concept
                        </button>
                    </div>
                )}

                {/* Generating Loading State */}
                {(status === "generating_concept" || status === "generating_view") && (
                    <div className="bg-gray-900 border border-gray-800 p-12 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center space-y-4">
                        <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                        <div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                                {status === "generating_concept" ? "Designing Master Concept" : "Rendering Specific View"}
                            </h3>
                            <p className="text-sm text-gray-400">The AI is building a photorealistic 8K asset. Please wait approx 10-15s.</p>
                        </div>
                    </div>
                )}

                {/* 2. Review Master & Generate Views */}
                {(status === "review_concept") && gridImage && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl uppercase font-black tracking-widest">High-End Design Studio</h2>
                            <button onClick={() => setStatus("idle")} className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded uppercase tracking-wider transition">Start Over</button>
                        </div>

                        <div className="grid grid-cols-12 gap-6">
                            {/* Left: Master Concept */}
                            <div className="col-span-12 lg:col-span-7 bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl shadow-black/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="uppercase tracking-widest font-black text-yellow-500 text-xs">Master Concept (Front & Back)</h3>
                                    <button onClick={(e) => handleDownloadImage(e, gridImage.base64, gridImage.mimeType, 'concept_master.png')} className="flex items-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded transition text-gray-300">
                                        <Download className="w-3.5 h-3.5" /> Download HD
                                    </button>
                                </div>
                                <img
                                    src={`data:${gridImage.mimeType};base64,${gridImage.base64}`}
                                    className="w-full rounded-lg bg-gray-950 object-contain border border-gray-800"
                                    alt="Master Concept"
                                />

                                <div className="mt-6">
                                    <h4 className="uppercase tracking-wider font-bold text-gray-400 text-[10px] mb-3 border-b border-gray-800 pb-2">Generate Derived Views</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(['front', 'back', 'left', 'right', 'closeup'] as ViewType[]).map(view => (
                                            <button
                                                key={view}
                                                onClick={() => handleGenerateView(view)}
                                                className="bg-gray-950 hover:bg-gray-800 border border-gray-800 hover:border-yellow-500/50 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition"
                                            >
                                                + {view}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2">These will be generated using the Master Concept above as an exact reference to maintain total consistency.</p>
                                </div>
                            </div>

                            {/* Right: Gallery & Publishing */}
                            <div className="col-span-12 lg:col-span-5 space-y-4 flex flex-col">
                                <h3 className="uppercase tracking-widest font-black text-gray-400 text-xs flex items-center justify-between">
                                    Asset Gallery
                                    <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-400 font-normal normal-case">Select an image to publish</span>
                                </h3>

                                <div className="flex-1 overflow-y-auto bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-xl shadow-black/50 content-start grid grid-cols-2 gap-3 max-h-[600px]">
                                    {/* Include Master Concept in Gallery */}
                                    <div
                                        className="relative group cursor-pointer border border-gray-800 rounded-lg overflow-hidden bg-gray-950 hover:border-yellow-500 transition aspect-square"
                                        onClick={() => handleProceedToSEO(gridImage)}
                                    >
                                        <div className="absolute top-2 left-2 z-10 bg-black/80 px-2 py-1 rounded text-[9px] uppercase font-bold text-yellow-500 border border-gray-800/50 shadow-md backdrop-blur">Master</div>
                                        <button onClick={(e) => handleDownloadImage(e, gridImage.base64, gridImage.mimeType, 'concept_master.png')} className="absolute top-2 right-2 z-10 bg-black/80 p-1.5 rounded text-gray-400 hover:text-white border border-gray-800/50 shadow-md backdrop-blur opacity-0 group-hover:opacity-100 transition">
                                            <Download className="w-3 h-3" />
                                        </button>
                                        <img src={`data:${gridImage.mimeType};base64,${gridImage.base64}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                        <div className="absolute inset-0 z-0 bg-yellow-500/0 group-hover:bg-yellow-500/10 transition flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">Publish This</div>
                                        </div>
                                    </div>

                                    {/* Render SubViews in Gallery */}
                                    {Object.entries(subViews).map(([viewName, viewImg]) => (
                                        <div
                                            key={viewName}
                                            className="relative group cursor-pointer border border-gray-800 rounded-lg overflow-hidden bg-gray-950 hover:border-yellow-500 transition aspect-square"
                                            onClick={() => handleProceedToSEO(viewImg)}
                                        >
                                            <div className="absolute top-2 left-2 z-10 bg-black/80 px-2 py-1 rounded text-[9px] uppercase font-bold text-gray-300 border border-gray-800/50 shadow-md backdrop-blur">{viewName} View</div>
                                            <button onClick={(e) => handleDownloadImage(e, viewImg.base64, viewImg.mimeType, `concept_${viewName}.png`)} className="absolute top-2 right-2 z-10 bg-black/80 p-1.5 rounded text-gray-400 hover:text-white border border-gray-800/50 shadow-md backdrop-blur opacity-0 group-hover:opacity-100 transition">
                                                <Download className="w-3 h-3" />
                                            </button>
                                            <img src={`data:${viewImg.mimeType};base64,${viewImg.base64}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                            <div className="absolute inset-0 z-0 bg-yellow-500/0 group-hover:bg-yellow-500/10 transition flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">Publish This</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Review SEO and Publish */}
                {(status === "review_seo" || status === "analyzing_seo" || status === "uploading_cloud" || status === "publishing_db") && (
                    <div className="grid grid-cols-12 gap-8">
                        {/* Selected Publish Image Preview */}
                        <div className="col-span-12 lg:col-span-5 space-y-4">
                            <h3 className="uppercase tracking-widest font-black text-gray-500 text-xs flex justify-between items-center">
                                Selected Final Asset
                                {status === "review_seo" && <button onClick={() => setStatus("review_concept")} className="text-yellow-600 hover:text-yellow-500 underline text-[10px] normal-case tracking-normal">Change Selection</button>}
                            </h3>
                            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden aspect-square sticky top-8 shadow-xl">
                                {activePublishImage && (
                                    <img src={`data:${activePublishImage.mimeType};base64,${activePublishImage.base64}`} className="w-full h-full object-cover" />
                                )}
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-7 bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
                            {status === "analyzing_seo" ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-4 py-20 text-center">
                                    <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
                                    <p className="text-gray-400 text-sm">Extracting product matrix & SEO metadata from image...</p>
                                </div>
                            ) : prefilledData && (
                                <>
                                    <h3 className="uppercase tracking-widest font-black text-yellow-500 text-sm flex items-center gap-2 border-b border-gray-800 pb-4 mb-6"><Sparkles className="w-4 h-4" /> Final SEO & Publishing Matrix</h3>
                                    <form onSubmit={handlePublish} className="space-y-5">
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Title</label>
                                            <input type="text" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm focus:border-yellow-500 outline-none" value={prefilledData.title} onChange={e => setPrefilledData({ ...prefilledData, title: e.target.value })} disabled={status !== "review_seo"} />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Category</label>
                                            <input type="text" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm" value={prefilledData.category} readOnly disabled />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Sample Blueprint ($)</label>
                                                <input type="text" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm focus:border-yellow-500 outline-none" value={prefilledData.samplePrice} onChange={e => setPrefilledData({ ...prefilledData, samplePrice: e.target.value })} disabled={status !== "review_seo"} />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Dominant Fabric</label>
                                                <input type="text" className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm focus:border-yellow-500 outline-none" value={prefilledData.material} onChange={e => setPrefilledData({ ...prefilledData, material: e.target.value })} disabled={status !== "review_seo"} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase font-bold text-gray-500 mb-1">SEO Description</label>
                                            <textarea className="w-full h-24 bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm focus:border-yellow-500 outline-none resize-none" value={prefilledData.shortDescription} onChange={e => setPrefilledData({ ...prefilledData, shortDescription: e.target.value })} disabled={status !== "review_seo"} />
                                        </div>

                                        <div className="pt-6 border-t border-gray-800">
                                            <button
                                                type="submit"
                                                disabled={status !== "review_seo"}
                                                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-yellow-500/20"
                                            >
                                                {status === "uploading_cloud" ? <><CloudUpload className="animate-bounce w-5 h-5 mr-3" /> Pushing via SFTP...</> :
                                                    status === "publishing_db" ? <><Server className="animate-pulse w-5 h-5 mr-3" /> Writing to Live Database...</> :
                                                        <><CloudUpload className="w-5 h-5 mr-3" /> Push to Live Website</>}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* 4. Success State */}
                {status === "success" && (
                    <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-12 text-center shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex mx-auto items-center justify-center mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-widest text-green-400 mb-4">DEPLOYMENT SUCCESSFUL</h2>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
                            The high-res visual asset was securely hosted on the Hostinger server and the completed product profile was explicitly written to your production database.
                        </p>
                        <button
                            onClick={() => { setPrompt(""); setStatus("idle"); setGridImage(null); setSubViews({}); setActivePublishImage(null); setPrefilledData(null); setLogoBase64(null); }}
                            className="bg-gray-800 hover:bg-gray-700 text-white uppercase font-bold tracking-widest px-8 py-4 rounded-xl border border-gray-700 transition"
                        >
                            Start Next Project
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
