import React, { useCallback, useState } from 'react';
import { useConfiguratorStore } from '../store/configuratorStore';
import { TechPackModal } from './TechPackModal';

export const ExportPanel: React.FC = () => {
    const { exportConfiguration, loadConfiguration, resetConfiguration } = useConfiguratorStore();
    const [showTechPackModal, setShowTechPackModal] = useState(false);

    const handleScreenshot = useCallback(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'garment-render.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    }, []);

    const handleExportConfig = useCallback(() => {
        const config = exportConfiguration();
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'garment-config.json';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    }, [exportConfiguration]);

    const handleImportConfig = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const config = JSON.parse(ev.target?.result as string);
                        loadConfiguration(config);
                    } catch (error) {
                        console.error('Invalid configuration file');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }, [loadConfiguration]);

    return (
        <div className="export-panel">
            <h3 className="section-title">Export & Save</h3>

            <div className="export-actions">
                <button className="export-button primary" onClick={handleScreenshot}>
                    <span className="button-icon">📸</span>
                    <span className="button-text">
                        <strong>Screenshot</strong>
                        <small>Download PNG render</small>
                    </span>
                </button>

                {/* NEW: Tech Pack Generator */}
                <button
                    className="export-button"
                    onClick={() => setShowTechPackModal(true)}
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
                >
                    <span className="button-icon">🏭</span>
                    <span className="button-text">
                        <strong>Tech Pack</strong>
                        <small>PDF for Manufacturing</small>
                    </span>
                </button>

                <button className="export-button" onClick={handleExportConfig}>
                    <span className="button-icon">💾</span>
                    <span className="button-text">
                        <strong>Save Config</strong>
                        <small>Export as JSON</small>
                    </span>
                </button>

                <button className="export-button" onClick={handleImportConfig}>
                    <span className="button-icon">📂</span>
                    <span className="button-text">
                        <strong>Load Config</strong>
                        <small>Import JSON file</small>
                    </span>
                </button>

                <button className="export-button danger" onClick={resetConfiguration}>
                    <span className="button-icon">🔄</span>
                    <span className="button-text">
                        <strong>Reset</strong>
                        <small>Clear all changes</small>
                    </span>
                </button>
            </div>

            <div className="export-info">
                <h4>Export Tips</h4>
                <ul>
                    <li>Use Tech Pack for factory orders</li>
                    <li>Pause rotation before screenshotting</li>
                    <li>Save configs to share designs</li>
                </ul>
            </div>

            {showTechPackModal && (
                <TechPackModal onClose={() => setShowTechPackModal(false)} />
            )}
        </div>
    );
};
