import React from 'react';
import { useConfiguratorStore, MATERIAL_PRESETS } from '../store/configuratorStore';

const MATERIAL_ICONS: Record<string, string> = {
    cotton: '🧶',
    silk: '🪡',
    denim: '👖',
    leather: '🧥',
    velvet: '🎭',
    polyester: '⚡',
};

const MATERIAL_DESCRIPTIONS: Record<string, string> = {
    cotton: 'Soft, breathable, matte finish',
    silk: 'Smooth, lustrous, elegant sheen',
    denim: 'Rugged, textured, classic look',
    leather: 'Glossy, durable, premium feel',
    velvet: 'Plush, rich, luxurious texture',
    polyester: 'Lightweight, versatile, slight sheen',
};

export const MaterialSelector: React.FC = () => {
    const { materialPreset, setMaterialPreset } = useConfiguratorStore();

    return (
        <div className="material-selector">
            <h3 className="section-title">Fabric Type</h3>
            <div className="material-grid">
                {Object.entries(MATERIAL_PRESETS).map(([key, preset]) => (
                    <button
                        key={key}
                        className={`material-card ${materialPreset === key ? 'active' : ''}`}
                        onClick={() => setMaterialPreset(key)}
                    >
                        <span className="material-icon">{MATERIAL_ICONS[key]}</span>
                        <span className="material-name">{preset.name}</span>
                        <span className="material-desc">{MATERIAL_DESCRIPTIONS[key]}</span>
                    </button>
                ))}
            </div>

            <div className="material-preview">
                <h4>Material Properties</h4>
                <div className="property-bars">
                    <div className="property-bar">
                        <span className="property-label">Roughness</span>
                        <div className="bar-track">
                            <div
                                className="bar-fill"
                                style={{ width: `${(MATERIAL_PRESETS[materialPreset]?.roughness || 0.5) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="property-bar">
                        <span className="property-label">Metalness</span>
                        <div className="bar-track">
                            <div
                                className="bar-fill"
                                style={{ width: `${(MATERIAL_PRESETS[materialPreset]?.metalness || 0) * 100}%` }}
                            />
                        </div>
                    </div>
                    {MATERIAL_PRESETS[materialPreset]?.sheen !== undefined && (
                        <div className="property-bar">
                            <span className="property-label">Sheen</span>
                            <div className="bar-track">
                                <div
                                    className="bar-fill"
                                    style={{ width: `${(MATERIAL_PRESETS[materialPreset]?.sheen || 0) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
