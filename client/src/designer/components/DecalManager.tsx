import React, { useCallback, useRef } from 'react';
import { useConfiguratorStore } from '../store/configuratorStore';

export const DecalManager: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        decals,
        selectedDecalId,
        updateDecal,
        removeDecal,
        selectDecal,
        isPlacingDecal,
        setPendingDecal
    } = useConfiguratorStore();

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPendingDecal(url);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [setPendingDecal]);

    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setPendingDecal(url);
        }
    }, [setPendingDecal]);

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
    }, []);

    const selectedDecal = decals.find(d => d.id === selectedDecalId);

    return (
        <div className="decal-manager">
            {/* Placement Mode Banner */}
            {isPlacingDecal && (
                <div className="placement-banner animate-fade-in">
                    <span className="placement-icon">🎯</span>
                    <div className="placement-text">
                        <strong>Click on the model to place your logo</strong>
                        <span>Position it where you want</span>
                    </div>
                    <button className="cancel-btn" onClick={() => setPendingDecal(null)}>
                        Cancel
                    </button>
                </div>
            )}

            {/* Upload Zone */}
            {!isPlacingDecal && (
                <div
                    className="upload-zone"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <div className="upload-icon">➕</div>
                    <span className="upload-text">Upload Logo</span>
                    <span className="upload-hint">PNG, JPG, SVG • Drag & drop or click</span>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
            />

            {/* Uploaded Logos Gallery */}
            {decals.length > 0 && (
                <div className="logos-section">
                    <div className="section-title">Uploaded Logos ({decals.length})</div>
                    <div className="logo-gallery">
                        {decals.map((decal) => (
                            <div
                                key={decal.id}
                                className={`logo-item ${selectedDecalId === decal.id ? 'active' : ''}`}
                                onClick={() => selectDecal(decal.id)}
                                style={{ position: 'relative' }}
                            >
                                <img src={decal.textureUrl} alt="Logo" />
                                <button
                                    className="logo-item-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeDecal(decal.id);
                                    }}
                                    style={{ opacity: 1 }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Selected Logo Controls */}
            {selectedDecal && (
                <div className="logo-controls animate-slide-up">
                    <div className="section-title">Adjust Logo</div>

                    <div className="slider-control">
                        <div className="slider-header">
                            <span className="slider-label">Rotation</span>
                            <span className="slider-value">{Math.round(selectedDecal.rotation[2] * 180 / Math.PI)}°</span>
                        </div>
                        <input
                            type="range"
                            className="slider-track"
                            min="-180"
                            max="180"
                            step="1"
                            value={(selectedDecal.rotation[2] * 180 / Math.PI)}
                            onChange={(e) => updateDecal(selectedDecal.id, { rotation: [0, 0, parseFloat(e.target.value) * Math.PI / 180] })}
                        />
                    </div>

                    <div className="slider-control">
                        <div className="slider-header">
                            <span className="slider-label">Size</span>
                            <span className="slider-value">{selectedDecal.scale[0].toFixed(1)}x</span>
                        </div>
                        <input
                            type="range"
                            className="slider-track"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={selectedDecal.scale[0]}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                updateDecal(selectedDecal.id, { scale: [val, val, val] });
                            }}
                        />
                    </div>

                    <div className="effect-selector">
                        <div className="section-title" style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Print Style</div>
                        <div className="effect-grid">
                            {[
                                { id: 'digital', label: 'Digital', icon: '🖨️' },
                                { id: 'screen', label: 'Screen', icon: '🎨' },
                                { id: 'embroidery', label: 'Embroidery', icon: '🧵' },
                                { id: 'applique', label: 'Applique', icon: '✂️' }
                            ].map((effect) => (
                                <button
                                    key={effect.id}
                                    className={`effect-btn ${selectedDecal.effect === effect.id || (!selectedDecal.effect && effect.id === 'digital') ? 'active' : ''}`}
                                    onClick={() => updateDecal(selectedDecal.id, { effect: effect.id as any })}
                                    title={`${effect.label} Effect`}
                                >
                                    <span className="effect-icon">{effect.icon}</span>
                                    <span className="effect-label">{effect.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="remove-btn" onClick={() => removeDecal(selectedDecal.id)}>
                        🗑️ Remove Logo
                    </button>
                </div>
            )}

            {/* Empty State Hint */}
            {decals.length === 0 && !isPlacingDecal && (
                <div className="empty-hint">
                    <span className="empty-icon">💡</span>
                    <p>PNG files with transparency work best for logos</p>
                </div>
            )}

            <style>{`
                .decal-manager {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .placement-banner {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(168, 85, 247, 0.2));
                    border: 1px solid rgba(124, 58, 237, 0.4);
                    border-radius: 16px;
                }
                .placement-icon {
                    font-size: 1.5rem;
                }
                .placement-text {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .placement-text strong {
                    color: var(--text-primary);
                    font-size: 0.9rem;
                }
                .placement-text span {
                    color: var(--text-muted);
                    font-size: 0.75rem;
                }
                .cancel-btn {
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: var(--text-primary);
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .cancel-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                .logos-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .logo-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: 16px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                }
                .empty-hint {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    background: var(--glass-bg);
                    border-radius: 12px;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }
                .empty-hint .empty-icon {
                    font-size: 1.2rem;
                }
                .effect-selector {
                    margin-top: 8px;
                }
                .effect-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }
                .effect-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    color: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.8rem;
                }
                .effect-btn:hover {
                    background: var(--glass-bg-strong);
                    color: var(--text-primary);
                }
                .effect-btn.active {
                    background: rgba(124, 58, 237, 0.2);
                    border-color: var(--accent-primary);
                    color: var(--text-primary);
                }
                .effect-icon {
                    font-size: 1.1rem;
                }
            `}</style>
        </div>
    );
};
