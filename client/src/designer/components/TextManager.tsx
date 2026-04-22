import React, { useState, useCallback, useMemo } from 'react';
import { useConfiguratorStore } from '../store/configuratorStore';

// Curated Google Fonts list
const GOOGLE_FONTS = [
    { name: 'Roboto', label: 'Roboto' },
    { name: 'Open Sans', label: 'Open Sans' },
    { name: 'Lato', label: 'Lato' },
    { name: 'Montserrat', label: 'Montserrat' },
    { name: 'Oswald', label: 'Oswald' },
    { name: 'Playfair Display', label: 'Playfair Display' },
    { name: 'Bebas Neue', label: 'Bebas Neue' },
    { name: 'Dancing Script', label: 'Dancing Script' },
    { name: 'Pacifico', label: 'Pacifico' },
    { name: 'Lobster', label: 'Lobster' },
];

export const TextManager: React.FC = () => {
    const {
        texts,
        selectedTextId,
        updateText,
        removeText,
        selectText,
        isPlacingText,
        setPendingText
    } = useConfiguratorStore();

    // Local state for text input
    const [inputText, setInputText] = useState('');
    const [selectedFont, setSelectedFont] = useState('Roboto');
    const [selectedColor, setSelectedColor] = useState('#ffffff');

    const handleAddText = useCallback(() => {
        if (!inputText.trim()) return;
        setPendingText({
            text: inputText.trim(),
            fontFamily: selectedFont,
            color: selectedColor
        });
    }, [inputText, selectedFont, selectedColor, setPendingText]);

    const selectedTextConfig = useMemo(() =>
        texts.find(t => t.id === selectedTextId),
        [texts, selectedTextId]
    );

    return (
        <div className="text-manager">
            {/* Placement Mode Banner */}
            {isPlacingText && (
                <div className="placement-banner animate-fade-in">
                    <span className="placement-icon">🎯</span>
                    <div className="placement-text">
                        <strong>Click on the model to place your text</strong>
                        <span>Position it where you want</span>
                    </div>
                    <button className="cancel-btn" onClick={() => setPendingText(null)}>
                        Cancel
                    </button>
                </div>
            )}

            {/* Text Input Section */}
            {!isPlacingText && (
                <div className="text-input-section">
                    <div className="section-title">Add Text</div>

                    {/* Text Input */}
                    <div className="text-input-wrapper">
                        <input
                            type="text"
                            className="text-input-field"
                            placeholder="Enter your text..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            maxLength={50}
                        />
                    </div>

                    {/* Font Selector */}
                    <div className="font-selector-wrapper">
                        <label className="input-label">Font</label>
                        <select
                            className="font-selector"
                            value={selectedFont}
                            onChange={(e) => setSelectedFont(e.target.value)}
                            style={{ fontFamily: selectedFont }}
                        >
                            {GOOGLE_FONTS.map(font => (
                                <option
                                    key={font.name}
                                    value={font.name}
                                    style={{ fontFamily: font.name }}
                                >
                                    {font.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Color Picker */}
                    <div className="color-picker-wrapper">
                        <label className="input-label">Color</label>
                        <div className="color-input-row">
                            <input
                                type="color"
                                className="color-picker-input"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                            />
                            <input
                                type="text"
                                className="color-hex-input"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    {inputText && (
                        <div className="text-preview-wrapper">
                            <label className="input-label">Preview</label>
                            <div
                                className="text-preview"
                                style={{
                                    fontFamily: selectedFont,
                                    color: selectedColor
                                }}
                            >
                                {inputText}
                            </div>
                        </div>
                    )}

                    {/* Add Button */}
                    <button
                        className="add-text-btn"
                        onClick={handleAddText}
                        disabled={!inputText.trim()}
                    >
                        ➕ Add to Model
                    </button>
                </div>
            )}

            {/* Applied Texts Gallery */}
            {texts.length > 0 && (
                <div className="texts-section">
                    <div className="section-title">Applied Texts ({texts.length})</div>
                    <div className="text-gallery">
                        {texts.map((textConfig) => (
                            <div
                                key={textConfig.id}
                                className={`text-item ${selectedTextId === textConfig.id ? 'active' : ''}`}
                                onClick={() => selectText(textConfig.id)}
                            >
                                <span
                                    className="text-item-preview"
                                    style={{
                                        fontFamily: textConfig.fontFamily,
                                        color: textConfig.color
                                    }}
                                >
                                    {textConfig.text.length > 10
                                        ? textConfig.text.substring(0, 10) + '...'
                                        : textConfig.text}
                                </span>
                                <button
                                    className="text-item-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeText(textConfig.id);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Selected Text Controls */}
            {selectedTextConfig && (
                <div className="text-controls animate-slide-up">
                    <div className="section-title">Adjust Text</div>

                    {/* Rotation Slider */}
                    <div className="slider-control">
                        <div className="slider-header">
                            <span className="slider-label">Rotation</span>
                            <span className="slider-value">{Math.round(selectedTextConfig.rotation[2] * 180 / Math.PI)}°</span>
                        </div>
                        <input
                            type="range"
                            className="slider-track"
                            min="-180"
                            max="180"
                            step="1"
                            value={(selectedTextConfig.rotation[2] * 180 / Math.PI)}
                            onChange={(e) => updateText(selectedTextConfig.id, {
                                rotation: [0, 0, parseFloat(e.target.value) * Math.PI / 180]
                            })}
                        />
                    </div>

                    {/* Size Slider */}
                    <div className="slider-control">
                        <div className="slider-header">
                            <span className="slider-label">Size</span>
                            <span className="slider-value">{selectedTextConfig.scale[0].toFixed(1)}x</span>
                        </div>
                        <input
                            type="range"
                            className="slider-track"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={selectedTextConfig.scale[0]}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                updateText(selectedTextConfig.id, { scale: [val, val, val] });
                            }}
                        />
                    </div>

                    {/* Color Change for Selected Text */}
                    <div className="slider-control">
                        <div className="slider-header">
                            <span className="slider-label">Color</span>
                        </div>
                        <div className="color-input-row">
                            <input
                                type="color"
                                className="color-picker-input"
                                value={selectedTextConfig.color}
                                onChange={(e) => updateText(selectedTextConfig.id, { color: e.target.value })}
                            />
                            <input
                                type="text"
                                className="color-hex-input"
                                value={selectedTextConfig.color}
                                onChange={(e) => updateText(selectedTextConfig.id, { color: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Font Change for Selected Text */}
                    <div className="slider-control">
                        <div className="slider-header">
                            <span className="slider-label">Font</span>
                        </div>
                        <select
                            className="font-selector"
                            value={selectedTextConfig.fontFamily}
                            onChange={(e) => updateText(selectedTextConfig.id, { fontFamily: e.target.value })}
                            style={{ fontFamily: selectedTextConfig.fontFamily }}
                        >
                            {GOOGLE_FONTS.map(font => (
                                <option
                                    key={font.name}
                                    value={font.name}
                                    style={{ fontFamily: font.name }}
                                >
                                    {font.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button className="remove-btn" onClick={() => removeText(selectedTextConfig.id)}>
                        🗑️ Remove Text
                    </button>
                </div>
            )}

            {/* Empty State Hint */}
            {texts.length === 0 && !isPlacingText && (
                <div className="empty-hint">
                    <span className="empty-icon">💡</span>
                    <p>Add text with custom fonts and colors to personalize your design</p>
                </div>
            )}

            <style>{`
                .text-manager {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .text-input-section {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .text-input-wrapper {
                    width: 100%;
                }
                .text-input-field {
                    width: 100%;
                    padding: 14px 16px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    color: var(--text-primary);
                    font-size: 1rem;
                    font-family: var(--font-family);
                    outline: none;
                    transition: all 0.2s;
                }
                .text-input-field:focus {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
                }
                .text-input-field::placeholder {
                    color: var(--text-muted);
                }
                .input-label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .font-selector-wrapper,
                .color-picker-wrapper,
                .text-preview-wrapper {
                    width: 100%;
                }
                .font-selector {
                    width: 100%;
                    padding: 12px 16px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    color: var(--text-primary);
                    font-size: 0.95rem;
                    cursor: pointer;
                    outline: none;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 16px center;
                    padding-right: 40px;
                }
                .font-selector:focus {
                    border-color: var(--accent-primary);
                }
                .font-selector option {
                    background: #1a1a1a;
                    color: white;
                    padding: 12px;
                }
                .color-input-row {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
                .color-picker-input {
                    width: 52px;
                    height: 42px;
                    padding: 0;
                    border: 2px solid var(--glass-border);
                    border-radius: 10px;
                    cursor: pointer;
                    background: transparent;
                }
                .color-picker-input::-webkit-color-swatch-wrapper {
                    padding: 2px;
                }
                .color-picker-input::-webkit-color-swatch {
                    border: none;
                    border-radius: 6px;
                }
                .color-hex-input {
                    flex: 1;
                    padding: 12px 14px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 10px;
                    color: var(--text-primary);
                    font-family: monospace;
                    font-size: 0.9rem;
                    outline: none;
                }
                .color-hex-input:focus {
                    border-color: var(--accent-primary);
                }
                .text-preview {
                    padding: 16px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    font-size: 1.4rem;
                    text-align: center;
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    word-break: break-word;
                }
                .add-text-btn {
                    width: 100%;
                    padding: 14px 20px;
                    background: var(--accent-gradient);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
                }
                .add-text-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
                }
                .add-text-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .texts-section {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .text-gallery {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 12px;
                }
                .text-item {
                    position: relative;
                    padding: 12px;
                    background: var(--glass-bg);
                    border: 2px solid transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 60px;
                }
                .text-item:hover {
                    border-color: var(--accent-primary);
                    background: var(--glass-bg-strong);
                }
                .text-item.active {
                    border-color: var(--accent-primary);
                    background: rgba(124, 58, 237, 0.2);
                    box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
                }
                .text-item-preview {
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-align: center;
                    word-break: break-word;
                }
                .text-item-delete {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    width: 24px;
                    height: 24px;
                    background: #ef4444;
                    border: 2px solid var(--bg-app);
                    border-radius: 50%;
                    color: white;
                    font-size: 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }
                .text-item-delete:hover {
                    transform: scale(1.1);
                    background: #ff5f5f;
                }
                .text-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding: 16px;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                }
            `}</style>
        </div>
    );
};
