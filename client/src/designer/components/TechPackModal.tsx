import React, { useState } from 'react';
import { useConfiguratorStore } from '../store/configuratorStore';
import { generateTechPack } from '../utils/techPackGenerator';

interface TechPackModalProps {
    onClose: () => void;
}

export const TechPackModal: React.FC<TechPackModalProps> = ({ onClose }) => {
    const store = useConfiguratorStore();
    const [projectName, setProjectName] = useState('My Garment Design');
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState('');

    const handleGenerate = async () => {
        setIsGenerating(true);
        setStatus('Capturing 3D Views...');

        // IMPORTANT: We need access to the canvas to take screenshots
        // The canvas is in the main Scene component.
        const canvas = document.querySelector('canvas');
        if (!canvas) {
            setStatus('Error: Could not find 3D View');
            setIsGenerating(false);
            return;
        }

        // Helper to capture current view
        const capture = () => canvas.toDataURL('image/png');

        // Capture VIEWS - We need to rotate the camera programmatically
        // We act directly on the store's camera target/position or rely on manual snapshots?
        // Since we don't have direct access to the OrbitControls from here, 
        // a robust way is difficult without refactoring Scene.tsx to expose controls.
        // FOR NOW: We will stick to capturing the CURRENT view as "Front" 
        // and ideally we'd want to automate this. 
        // LIMITATION: Use current view for all or just one view for MVP.

        // Let's implement a "Semi-Auto" approach or just capture current view as Front.
        // To do it properly, we'd need to inject this logic into the Scene component.
        // For MVP: Let's capture the CURRENT view as the main render.

        // Use a timeout to allow UI update
        setTimeout(async () => {
            try {
                const frontView = capture();

                setStatus('Generating PDF...');

                const data = {
                    projectName,
                    date: new Date().toLocaleDateString(),
                    primaryColor: store.primaryColor,
                    secondaryColor: store.secondaryColor,
                    materialPreset: store.materialPreset,
                    meshColors: store.meshColors,
                    decals: store.decals,
                    texts: store.texts,
                    views: {
                        front: frontView,
                        back: '', // TODO: Automate rotation
                        left: '',
                        right: ''
                    }
                };

                await generateTechPack(data);

                setStatus('Done!');
                setTimeout(onClose, 1000);
            } catch (err) {
                console.error(err);
                setStatus('Failed to generate');
            } finally {
                setIsGenerating(false);
            }
        }, 100);
    };

    return (
        <div className="tech-pack-overlay">
            <div className="tech-pack-modal">
                <div className="modal-header">
                    <h2>🏭 Generate Tech Pack</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    <p className="description">
                        Create a professional PDF document for manufacturing.
                        Please position your model in the <strong>Front View</strong> before generating.
                    </p>

                    <div className="form-group">
                        <label>Project Name</label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="status-message">
                        {status && <span>{status}</span>}
                    </div>

                    <div className="actions">
                        <button className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button
                            className="generate-btn"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Processing...' : 'Download PDF'}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .tech-pack-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 3000;
                    backdrop-filter: blur(5px);
                }
                .tech-pack-modal {
                    background: #1e1e1e;
                    width: 400px;
                    border-radius: 12px;
                    border: 1px solid #333;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                    overflow: hidden;
                    color: white;
                    font-family: system-ui, sans-serif;
                }
                .modal-header {
                    padding: 15px 20px;
                    background: #252525;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #333;
                }
                .modal-header h2 { margin: 0; font-size: 1.1rem; }
                .close-btn { background: none; border: none; color: #aaa; font-size: 1.5rem; cursor: pointer; }
                .close-btn:hover { color: white; }
                
                .modal-content {
                    padding: 20px;
                }
                .description {
                    font-size: 0.9rem;
                    color: #aaa;
                    margin-bottom: 20px;
                    line-height: 1.4;
                }
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; font-size: 0.8rem; color: #888; margin-bottom: 5px; }
                .input-field {
                    width: 100%;
                    padding: 10px;
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 6px;
                    color: white;
                    font-size: 1rem;
                }
                
                .status-message {
                    height: 20px;
                    font-size: 0.8rem;
                    color: #6366f1;
                    margin-bottom: 15px;
                    text-align: center;
                }
                
                .actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                .cancel-btn {
                    padding: 8px 16px;
                    background: transparent;
                    border: 1px solid #444;
                    color: #ccc;
                    border-radius: 6px;
                    cursor: pointer;
                }
                .generate-btn {
                    padding: 8px 16px;
                    background: #6366f1;
                    border: none;
                    color: white;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                }
                .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; }
            `}</style>
        </div>
    );
};
