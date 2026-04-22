import React, { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useConfiguratorStore } from '../store/configuratorStore';

export const ColorPickerPanel: React.FC = () => {
    const {
        selectedMeshName,
        meshColors,
        setMeshColor,
        addRecentColor,
        recentColors
    } = useConfiguratorStore();

    // Local state for smooth dragging
    const [localColor, setLocalColor] = useState('#ffffff');

    // Get current mesh color
    const currentColor = selectedMeshName ? (meshColors[selectedMeshName] || '#ffffff') : '#ffffff';

    // Sync local color when selection changes
    useEffect(() => {
        setLocalColor(currentColor);
    }, [currentColor, selectedMeshName]);

    // Handle color change
    const handleColorChange = (color: string) => {
        setLocalColor(color);
        if (selectedMeshName) {
            setMeshColor(selectedMeshName, color);
        }
    };

    // Handle drag end
    const handleDragEnd = () => {
        if (selectedMeshName) {
            addRecentColor(localColor);
        }
    };

    if (!selectedMeshName) return null;

    return (
        <div className="compact-color-picker">
            {/* Compact Color Wheel */}
            <div
                className="color-wheel-container"
                onMouseUp={handleDragEnd}
                onTouchEnd={handleDragEnd}
            >
                <HexColorPicker
                    color={localColor}
                    onChange={handleColorChange}
                />
            </div>

            {/* Recent Colors - Small Icons */}
            {recentColors.length > 0 && (
                <div className="recent-row">
                    <span className="recent-label">Recent:</span>
                    <div className="recent-swatches">
                        {recentColors.slice(0, 8).map((color, index) => (
                            <button
                                key={`${color}-${index}`}
                                className={`mini-swatch ${localColor.toUpperCase() === color.toUpperCase() ? 'active' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                    handleColorChange(color);
                                    addRecentColor(color);
                                }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

