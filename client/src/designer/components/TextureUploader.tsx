import React, { useCallback, useRef } from 'react';
import { useConfiguratorStore } from '../store/configuratorStore';

export const TextureUploader: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        textureUrl, textureScale, setTextureUrl, setTextureScale,
        selectedMeshName, meshPatterns, setMeshPattern,
        meshTextureSettings, setMeshTextureSettings
    } = useConfiguratorStore();

    const currentSettings = selectedMeshName
        ? (meshTextureSettings[selectedMeshName] || { scale: 1, tiled: true })
        : { scale: textureScale, tiled: true };

    const activeTextureUrl = selectedMeshName
        ? (meshPatterns[selectedMeshName] || null)
        : textureUrl;

    const handleSetTexture = useCallback((url: string | null) => {
        if (selectedMeshName) {
            setMeshPattern(selectedMeshName, url);
            // Always default to 0.01 scale when loading a new texture
            if (url) {
                setMeshTextureSettings(selectedMeshName, { scale: 1, tiled: true });
            }
        } else {
            setTextureUrl(url);
            if (url) {
                setTextureScale(1);
            }
        }
    }, [selectedMeshName, setMeshPattern, setTextureUrl, setTextureScale, setMeshTextureSettings]);

    const handleScaleChange = useCallback((scale: number) => {
        // Only enforce a tiny minimum to avoid divide-by-zero, no max cap
        const clampedScale = Math.max(0.01, scale);
        if (selectedMeshName) {
            setMeshTextureSettings(selectedMeshName, { scale: clampedScale });
        } else {
            setTextureScale(clampedScale);
        }
    }, [selectedMeshName, setMeshTextureSettings, setTextureScale]);

    const handleTiledChange = useCallback((tiled: boolean) => {
        if (selectedMeshName) {
            setMeshTextureSettings(selectedMeshName, { tiled });
        }
    }, [selectedMeshName, setMeshTextureSettings]);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            handleSetTexture(url);
        }
    }, [handleSetTexture]);

    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            handleSetTexture(url);
        }
    }, [handleSetTexture]);

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
    }, []);

    // Increment/Decrement handlers
    // Increment/Decrement handlers
    // + : Increase Scale = bigger pattern
    const incrementScale = () => handleScaleChange(currentSettings.scale + 0.1);
    const decrementScale = () => handleScaleChange(currentSettings.scale - 0.1);

    return (
        <div className="texture-uploader">
            {/* Context Indicator */}
            {selectedMeshName ? (
                <div className="context-badge">
                    <span className="context-icon">🎯</span>
                    <span>Applying to: <strong>{selectedMeshName}</strong></span>
                </div>
            ) : (
                <div className="context-badge global">
                    <span className="context-icon">🌐</span>
                    <span>Applying to: <strong>Whole Garment</strong></span>
                </div>
            )}

            {/* Upload Zone */}
            <div
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {activeTextureUrl ? (
                    <div className="texture-preview-container">
                        <img src={activeTextureUrl} alt="Texture preview" className="texture-preview-img" />
                        <button
                            className="preview-remove-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSetTexture(null);
                            }}
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="upload-icon">🎨</div>
                        <span className="upload-text">Upload Texture</span>
                        <span className="upload-hint">PNG, JPG • Seamless patterns work best</span>
                    </>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
            />

            {/* Preset Textures Section */}
            <div className="preset-section">
                <div className="preset-header">
                    <span className="preset-title">🎨 Preset Patterns</span>
                </div>
                <div className="preset-grid">
                    <div
                        className={`preset-item ${activeTextureUrl === 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/OJAxgHPWHBkOFaxa.png' ? 'active' : ''}`}
                        onClick={() => handleSetTexture('https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/OJAxgHPWHBkOFaxa.png')}
                    >
                        <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/OJAxgHPWHBkOFaxa.png" alt="Woodland Camo" />
                        <span className="preset-label">Woodland</span>
                    </div>
                    <div
                        className={`preset-item ${activeTextureUrl === 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/vnBMpEZHVeEfEZzE.png' ? 'active' : ''}`}
                        onClick={() => handleSetTexture('https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/vnBMpEZHVeEfEZzE.png')}
                    >
                        <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/vnBMpEZHVeEfEZzE.png" alt="Desert Camo" />
                        <span className="preset-label">Desert</span>
                    </div>
                    <div
                        className={`preset-item ${activeTextureUrl === 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/aVVxfZrGedLvxeUh.png' ? 'active' : ''}`}
                        onClick={() => handleSetTexture('https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/aVVxfZrGedLvxeUh.png')}
                    >
                        <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/aVVxfZrGedLvxeUh.png" alt="Urban Camo" />
                        <span className="preset-label">Urban</span>
                    </div>
                    <div
                        className={`preset-item ${activeTextureUrl === 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/zQgmukgBTEGfYSZd.png' ? 'active' : ''}`}
                        onClick={() => handleSetTexture('https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/zQgmukgBTEGfYSZd.png')}
                    >
                        <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663026792105/zQgmukgBTEGfYSZd.png" alt="Arctic Camo" />
                        <span className="preset-label">Arctic</span>
                    </div>
                </div>
            </div>

            {/* Texture Scale Controls - Always visible when texture applied */}
            {activeTextureUrl && (
                <div className="texture-controls animate-slide-up">
                    {/* Tiling Toggle */}
                    {selectedMeshName && (
                        <div className="toggle-group-container">
                            <span className="toggle-label">Pattern Mode</span>
                            <div className="toggle-buttons">
                                <button
                                    className={`toggle-btn ${currentSettings.tiled ? 'active' : ''}`}
                                    onClick={() => handleTiledChange(true)}
                                >
                                    🔁 Tiled
                                </button>
                                <button
                                    className={`toggle-btn ${!currentSettings.tiled ? 'active' : ''}`}
                                    onClick={() => handleTiledChange(false)}
                                >
                                    📐 Fit
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Pattern Size Section */}
                    <div className="size-control-section">
                        <div className="size-header">
                            <span className="size-label">Pattern Size</span>
                        </div>

                        {/* Large Slider with Button Controls */}
                        {/* Large Slider with Button Controls */}
                        <div className="size-slider-container">
                            <button className="size-btn minus" onClick={decrementScale}>−</button>
                            <div className="slider-wrapper">
                                <input
                                    type="range"
                                    className="size-slider"
                                    min="0.01"
                                    max="100"
                                    step="0.1"
                                    value={Math.min(currentSettings.scale, 100)}
                                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                                />
                                <div
                                    className="slider-fill"
                                    style={{ width: `${Math.min((currentSettings.scale / 100) * 100, 100)}%` }}
                                />
                            </div>
                            <button className="size-btn plus" onClick={incrementScale}>+</button>
                        </div>

                        {/* Manual Number Input - Unlimited Range */}
                        <div className="size-input-container">
                            <input
                                type="number"
                                className="size-number-input"
                                min="0.01"
                                step="0.1"
                                value={currentSettings.scale}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    if (!isNaN(val) && val > 0) {
                                        handleScaleChange(val);
                                    }
                                }}
                            />
                            <span className="size-unit">size</span>
                        </div>

                        <span className="size-hint">
                            {currentSettings.tiled
                                ? '← Denser | Original (1) | Bigger →'
                                : 'Adjusts texture stretch'}
                        </span>

                        {/* Remove Button */}
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                            <button className="remove-btn" onClick={() => handleSetTexture(null)}>
                                🗑️ Remove Texture
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .texture-uploader {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .context-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
                .context-badge.global {
                    background: rgba(124, 58, 237, 0.1);
                    border-color: rgba(124, 58, 237, 0.3);
                }
                .context-icon {
                    font-size: 1rem;
                }
                .context-badge strong {
                    color: var(--text-primary);
                }
                .texture-preview-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .texture-preview-img {
                    max-width: 100%;
                    max-height: 80px;
                    object-fit: contain;
                    border-radius: 8px;
                }
                .preview-remove-btn {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 24px;
                    height: 24px;
                    background: #ef4444;
                    border: 2px solid var(--bg-app);
                    border-radius: 50%;
                    color: white;
                    font-size: 0.8rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .texture-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    padding: 20px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                }
                .toggle-group-container {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .toggle-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .toggle-buttons {
                    display: flex;
                    gap: 8px;
                }
                .toggle-btn {
                    flex: 1;
                    padding: 10px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 10px;
                    color: var(--text-secondary);
                    font-size: 0.8rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .toggle-btn:hover {
                    border-color: var(--accent-primary);
                }
                .toggle-btn.active {
                    background: var(--accent-gradient);
                    border-color: transparent;
                    color: white;
                }
                
                /* Size Control Section */
                .size-control-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .size-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .size-label {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                /* Slider Container with Buttons */
                .size-slider-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .size-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    border: 1px solid var(--glass-border);
                    background: var(--glass-bg-strong);
                    color: var(--text-primary);
                    font-size: 1.5rem;
                    font-weight: 300;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .size-btn:hover {
                    background: var(--accent-primary);
                    border-color: var(--accent-primary);
                }
                .size-btn:active {
                    transform: scale(0.95);
                }
                
                /* Slider Wrapper */
                .slider-wrapper {
                    flex: 1;
                    position: relative;
                    height: 44px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    overflow: hidden;
                }
                .slider-fill {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    background: var(--accent-gradient);
                    opacity: 0.4;
                    pointer-events: none;
                    transition: width 0.1s;
                }
                .size-slider {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                    cursor: pointer;
                    margin: 0;
                    padding: 0 8px;
                }
                .size-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 28px;
                    height: 28px;
                    background: var(--accent-gradient);
                    border: 3px solid white;
                    border-radius: 50%;
                    cursor: grab;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }
                .size-slider::-webkit-slider-thumb:active {
                    cursor: grabbing;
                    transform: scale(1.1);
                }
                .size-slider::-moz-range-thumb {
                    width: 28px;
                    height: 28px;
                    background: var(--accent-gradient);
                    border: 3px solid white;
                    border-radius: 50%;
                    cursor: grab;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }
                
                /* Manual Number Input */
                .size-input-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                }
                .size-number-input {
                    width: 100px;
                    padding: 10px 12px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    color: var(--text-primary);
                    font-size: 1.1rem;
                    font-weight: 600;
                    font-family: monospace;
                    text-align: center;
                    outline: none;
                }
                .size-number-input:focus {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 3px var(--accent-glow);
                }
                .size-unit {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }
                .size-hint {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    text-align: center;
                }
                
                /* Preset Textures Section */
                .preset-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .preset-header {
                    display: flex;
                    align-items: center;
                }
                .preset-title {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .preset-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                }
                .preset-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    padding: 8px;
                    background: var(--glass-bg);
                    border: 2px solid transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .preset-item:hover {
                    background: var(--glass-bg-strong);
                    border-color: var(--accent-primary);
                    transform: translateY(-2px);
                }
                .preset-item.active {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 12px var(--accent-glow);
                }
                .preset-item img {
                    width: 100%;
                    aspect-ratio: 1;
                    object-fit: cover;
                    border-radius: 8px;
                }
                .preset-label {
                    font-size: 0.65rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};
