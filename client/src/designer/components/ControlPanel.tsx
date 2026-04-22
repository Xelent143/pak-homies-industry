import React, { useState } from 'react';
import { useConfiguratorStore } from '../store/configuratorStore';
import { ColorPicker } from './ColorPicker';
import { MaterialSelector } from './MaterialSelector';
import { TextureUploader } from './TextureUploader';
import { DecalManager } from './DecalManager';
import { ModelLibrary } from './ModelLibrary';

type TabType = 'color' | 'material' | 'texture' | 'decals' | 'models';

export const ControlPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('color');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { modelUrl, selectedDecalId } = useConfiguratorStore();

    // Auto-switch to Decals tab when a decal is selected (e.g. from sidebar)
    React.useEffect(() => {
        if (selectedDecalId) {
            setActiveTab('decals');
            setIsCollapsed(false); // Auto-expand if collapsed
        }
    }, [selectedDecalId]);

    const tabs: { id: TabType; label: string; icon: string }[] = [
        { id: 'models', label: 'Models', icon: '👕' },
        { id: 'color', label: 'Colors', icon: '🎨' },
        { id: 'material', label: 'Material', icon: '✨' },
        { id: 'texture', label: 'Pattern', icon: '▒' },
        { id: 'decals', label: 'Logos', icon: '🏷️' },
    ];

    return (
        <div
            className={`control-panel ${isCollapsed ? 'collapsed' : ''}`}
            onPointerDown={(e) => e.stopPropagation()} /* Prevent event bleeding to scene */
        >
            {/* Drag Handle Area - Click to Toggle */}
            <div
                className="handle-area"
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{
                    cursor: 'pointer',
                    padding: '8px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                }}
            >
                <div className="panel-handle" style={{ margin: 0 }} />
                <span style={{
                    fontSize: '0.6rem',
                    color: '#94a3b8',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {isCollapsed ? 'Scroll Up' : 'Scroll Down'}
                </span>
            </div>

            {/* Horizontal Tabs - Compact & Scrollable */}
            <div className="horizontal-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn-horizontal ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="content-area centered">
                {/* Always show tabs now, ModelLibrary handles the empty state logic via switching tabs or default view */}
                <div className="tab-content-wrapper">
                    {activeTab === 'models' && <ModelLibrary />}
                    {modelUrl ? (
                        <>
                            {activeTab === 'color' && <ColorPicker />}
                            {activeTab === 'material' && <MaterialSelector />}
                            {activeTab === 'texture' && <TextureUploader />}
                            {activeTab === 'decals' && <DecalManager />}
                        </>
                    ) : (
                        /* If no model loaded and not on models tab, show library anyway or prompt */
                        activeTab !== 'models' && (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                                <p>Please select a model first</p>
                                <button className="action-btn" onClick={() => setActiveTab('models')}>
                                    Go to Library
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Footer Action */}
            <div className="panel-footer">
                <button className="action-btn" onClick={() => useConfiguratorStore.getState().exportConfiguration()}>
                    <span>Apply Changes</span>
                    <span>→</span>
                </button>
            </div>
        </div>
    );
};
