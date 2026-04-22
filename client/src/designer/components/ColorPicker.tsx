import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { useConfiguratorStore } from '../store/configuratorStore';

const COLOR_PRESETS = [
    { name: 'Ocean Blue', value: '#1e88e5' },
    { name: 'Sunset Orange', value: '#ff7043' },
    { name: 'Forest Green', value: '#43a047' },
    { name: 'Royal Purple', value: '#7e57c2' },
    { name: 'Rose Pink', value: '#ec407a' },
    { name: 'Midnight Black', value: '#212121' },
    { name: 'Pure White', value: '#fafafa' },
    { name: 'Warm Beige', value: '#d7ccc8' },
    { name: 'Navy', value: '#1a237e' },
    { name: 'Burgundy', value: '#880e4f' },
    { name: 'Olive', value: '#827717' },
    { name: 'Coral', value: '#ff8a65' },
];

export const ColorPicker: React.FC = () => {
    const {
        primaryColor,
        secondaryColor,
        setPrimaryColor,
        setSecondaryColor,
        selectedMeshName,
        meshColors,
        setMeshColor,
        recentColors,
        addRecentColor,
        availableMeshes,
        selectMesh
    } = useConfiguratorStore();

    const [activeTarget, setActiveTarget] = React.useState<'mesh' | 'primary' | 'secondary'>(selectedMeshName ? 'mesh' : 'primary');

    React.useEffect(() => {
        if (selectedMeshName) setActiveTarget('mesh');
    }, [selectedMeshName]);

    const getColor = () => {
        if (activeTarget === 'mesh' && selectedMeshName) return meshColors[selectedMeshName] || '#ffffff';
        if (activeTarget === 'primary') return primaryColor;
        if (activeTarget === 'secondary') return secondaryColor;
        return '#ffffff';
    };

    const setColor = (c: string) => {
        if (activeTarget === 'mesh' && selectedMeshName) setMeshColor(selectedMeshName, c);
        else if (activeTarget === 'primary') setPrimaryColor(c);
        else if (activeTarget === 'secondary') setSecondaryColor(c);
    };

    const handleRelease = () => {
        addRecentColor(getColor());
    };

    return (
        <div className="color-picker-compact">
            {/* Parts Explorer / Selection Fallback */}
            <div className="parts-explorer-section">
                <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Parts Explorer</span>
                    {selectedMeshName && <span style={{ fontSize: '10px', color: '#6366f1' }}>Selection Active</span>}
                </div>
                <select
                    className="part-select-dropdown"
                    value={selectedMeshName || ''}
                    onChange={(e) => selectMesh(e.target.value)}
                >
                    <option value="" disabled>Click to select thin parts (Stitches, etc.)</option>
                    {availableMeshes.map(meshName => (
                        <option key={meshName} value={meshName}>
                            {meshName.replace(/_/g, ' ')}
                        </option>
                    ))}
                </select>
            </div>

            {/* Target Toggles */}
            <div className="color-target-tabs">
                {selectedMeshName && (
                    <button
                        className={`target-tab ${activeTarget === 'mesh' ? 'active' : ''}`}
                        onClick={() => setActiveTarget('mesh')}
                    >
                        Selected Part
                    </button>
                )}
                <button
                    className={`target-tab ${activeTarget === 'primary' ? 'active' : ''}`}
                    onClick={() => setActiveTarget('primary')}
                >
                    Base
                </button>
                <button
                    className={`target-tab ${activeTarget === 'secondary' ? 'active' : ''}`}
                    onClick={() => setActiveTarget('secondary')}
                >
                    Accents
                </button>
            </div>

            <div className="picker-container">
                <HexColorPicker
                    color={getColor()}
                    onChange={setColor}
                    onMouseUp={handleRelease}
                    style={{ width: '100%', height: '110px' }}
                />
            </div>

            {/* Presets */}
            <div className="presets-section">
                <div className="section-label">Presets</div>
                <div className="presets-grid-scroll">
                    {COLOR_PRESETS.map((p) => (
                        <button
                            key={p.value}
                            className="color-preset-compact"
                            style={{ backgroundColor: p.value }}
                            onClick={() => {
                                setColor(p.value);
                                addRecentColor(p.value);
                            }}
                            title={p.name}
                        />
                    ))}
                </div>
            </div>

            {/* Recent */}
            {recentColors.length > 0 && (
                <div className="presets-section">
                    <div className="section-label">Recent</div>
                    <div className="presets-grid-scroll">
                        {recentColors.map((c, i) => (
                            <button
                                key={i}
                                className="color-preset-compact"
                                style={{ backgroundColor: c }}
                                onClick={() => setColor(c)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
