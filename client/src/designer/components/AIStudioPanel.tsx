import React, { useState } from 'react';
import { useConfiguratorStore } from '../store/configuratorStore';

export const AIStudioPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { decals } = useConfiguratorStore();
    const [logoNotes, setLogoNotes] = useState<Record<string, string>>({});
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Capture Canvas on Mount
    React.useEffect(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            setCapturedImage(canvas.toDataURL('image/png'));
        }
        // Check for stored key
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) setApiKey(storedKey);
    }, []);

    const updateNote = (id: string, note: string) => {
        setLogoNotes(prev => ({ ...prev, [id]: note }));
    };

    const handleSaveKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(e.target.value);
        localStorage.setItem('gemini_api_key', e.target.value);
    }

    const handleGenerate = async () => {
        setErrorMsg(null);
        setResult(null);
        setGeneratedImageUrl(null);

        if (!apiKey) {
            setErrorMsg("Please enter your Gemini API Key.");
            return;
        }

        setIsGenerating(true);
        try {
            // 1. Analyze with Gemini (3D -> Text)
            const context = `
                Decals/Logos:
                ${decals.map((d, i) => `- Logo ${i + 1}: ${logoNotes[d.id] || 'Standard Application'}`).join('\n')}
             `;

            const { generateRealisticRender } = await import('../services/geminiService');
            const description = await generateRealisticRender(apiKey, capturedImage!, context);

            setResult(description); // Keep the description visible for reference

            // 2. Generate Image using Gemini (Imagen 3)
            // Use the description from the Vision model as the prompt for the Image model
            const { generateImageWithGemini } = await import('../services/geminiService');

            // Refine prompt for Imagen
            const imagenPrompt = `${description.slice(0, 1000)} photorealistic, 8k, studio lighting, detailed product photography`;

            const imgDataUrl = await generateImageWithGemini(apiKey, imagenPrompt);

            setGeneratedImageUrl(imgDataUrl);
            setIsGenerating(false);

        } catch (error: any) {
            console.error("Pipeline Error:", error);
            const msg = error.message || "Unknown error occurred";
            setErrorMsg(`Generation failed: ${msg}`);
            setIsGenerating(false);
        }
    };

    return (
        <div className="ai-studio-overlay">
            <div className="ai-studio-modal">
                <div className="ai-header">
                    <h2>✨ Magic Studio</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="ai-content">
                    {/* Left: Preview */}
                    <div className="ai-preview">
                        {capturedImage ? (
                            <img src={capturedImage} alt="3D View" className="preview-img" />
                        ) : (
                            <div className="preview-placeholder">Capturing View...</div>
                        )}
                        {result ? (
                            <div className="ai-result-overlay">
                                <h3>AI Analysis Success</h3>
                                <p>The model has analyzed your design.</p>
                            </div>
                        ) : (
                            <p className="hint">This view will be transformed by <strong>gemini-3-pro-image-preview</strong>.</p>
                        )}
                    </div>

                    {/* Right: Annotations */}
                    <div className="ai-controls">
                        <h3>Configuration</h3>

                        <div className="api-key-section" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>Gemini API Key</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={handleSaveKey}
                                placeholder="Enter Gemini API Key"
                                style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #444', color: 'white', borderRadius: '4px' }}
                            />
                        </div>

                        <h3>Design Details</h3>
                        <p className="sub-hint">Tag your logos for the AI:</p>

                        <div className="annotations-list">
                            {decals.length === 0 ? (
                                <p className="empty-state">No logos detected. The AI will focus on the fabric.</p>
                            ) : (
                                decals.map((decal, i) => (
                                    <div key={decal.id} className="annotation-item">
                                        <div className="annotation-label">
                                            <span className="badge">Logo {i + 1}</span>
                                        </div>
                                        <select
                                            className="material-select"
                                            onChange={(e) => updateNote(decal.id, e.target.value)}
                                        >
                                            <option value="">Select Material Strategy...</option>
                                            <option value="Gold Embroidery">Gold Embroidery (Shiny)</option>
                                            <option value="Woven Label">Woven Label (Texture)</option>
                                            <option value="Rubber Patch">Rubber Patch (Matte/3D)</option>
                                            <option value="Screen Print">Screen Print (Flat)</option>
                                            <option value="Applique">Applique (Stitched Fabric)</option>
                                        </select>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Error Display Area */}
                        {errorMsg && (
                            <div className="error-message" style={{ marginTop: '10px', padding: '10px', background: 'rgba(255, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5', fontSize: '0.8rem' }}>
                                <strong>Error:</strong> {errorMsg}
                            </div>
                        )}

                        {/* Generated Image Result */}
                        {generatedImageUrl && (
                            <div className="generated-image-container" style={{ marginTop: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #6366f1', position: 'relative' }}>
                                <img
                                    src={generatedImageUrl}
                                    alt="AI Enhanced Graphic"
                                    style={{
                                        width: '100%',
                                        display: 'block',
                                        filter: 'contrast(1.3) saturate(1.2) brightness(0.9) drop-shadow(0 10px 20px rgba(0,0,0,0.8))',
                                        transform: 'scale(1.02)'
                                    }}
                                />
                                <div className="magic-overlay" style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to bottom, transparent 80%, rgba(0,0,0,0.8) 100%)',
                                    pointerEvents: 'none',
                                }}></div>
                                <div style={{ padding: '12px', background: '#0f0f12', borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>✨ Gemini Imagen 3 Render</span>
                                        <div style={{ color: '#666', fontSize: '0.7rem' }}>Generated by Google Imagen</div>
                                    </div>
                                    <a href={generatedImageUrl} download="gemini_render.png" style={{ color: '#6366f1', fontSize: '0.8rem', textDecoration: 'none' }}>Download ⬇</a>
                                </div>
                            </div>
                        )}

                        {/* Text Description (Collapsed/Small) */}
                        {result && !generatedImageUrl && (
                            <div className="result-text-area" style={{ marginTop: '10px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', maxHeight: '150px', overflowY: 'auto', fontSize: '0.8rem', color: '#ddd' }}>
                                <strong>Analyzing Scene...</strong><br />
                                {result}
                            </div>
                        )}

                        <div className="generate-section">
                            <button
                                className={`generate-btn ${isGenerating ? 'loading' : ''}`}
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                {isGenerating ? 'Processing...' : '✨ Generate with Gemini'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .ai-studio-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .ai-studio-modal {
                    background: #1a1b26;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    width: 900px;
                    max-width: 90%;
                    max-height: 90vh;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                }
                .ai-header {
                    padding: 20px 30px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .ai-header h2 { margin: 0; font-size: 1.5rem; background: linear-gradient(to right, #fff, #a5b4fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .close-btn { background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; opacity: 0.7; }
                .close-btn:hover { opacity: 1; }
                
                .ai-content {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                }
                .ai-preview {
                    flex: 1;
                    padding: 30px;
                    background: #13141f;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .preview-img {
                    max-width: 100%;
                    max-height: 400px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .hint { color: #6b7280; font-size: 0.9rem; margin-top: 15px; }

                .ai-controls {
                    width: 350px;
                    padding: 30px;
                    border-left: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    flex-direction: column;
                }
                .ai-controls h3 { margin: 0 0 5px 0; color: #fff; }
                .sub-hint { color: #9ca3af; font-size: 0.9rem; margin-bottom: 25px; }
                
                .annotations-list {
                    flex: 1;
                    overflow-y: auto;
                }
                .annotation-item {
                    background: rgba(255,255,255,0.03);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 10px;
                }
                .badge {
                    background: #6366f1;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    font-weight: bold;
                }
                .material-select {
                    width: 100%;
                    margin-top: 10px;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    padding: 8px;
                    border-radius: 6px;
                }
                
                .generate-section {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                .generate-btn {
                    width: 100%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border: none;
                    padding: 15px;
                    border-radius: 12px;
                    font-weight: bold;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                }
                .generate-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
                }
                .generate-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};
