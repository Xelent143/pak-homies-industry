import React, { useCallback, useRef } from 'react';
import { useConfiguratorStore } from '../store/configuratorStore';

export const ModelUploader: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { isLoading, loadingProgress, setModelUrl } = useConfiguratorStore();

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setModelUrl(url);
        }
    }, [setModelUrl]);

    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file && file.name.endsWith('.glb')) {
            const url = URL.createObjectURL(file);
            setModelUrl(url);
        }
    }, [setModelUrl]);

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
    }, []);



    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
                className="upload-card modern-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {isLoading ? (
                    <div className="upload-loading">
                        <div className="upload-spinner"></div>
                        <p>Loading... {loadingProgress.toFixed(0)}%</p>
                    </div>
                ) : (
                    <div className="upload-content">
                        <div className="upload-icon-wrapper">
                            <span className="upload-icon">📂</span>
                        </div>
                        <div className="upload-text-group">
                            <span className="upload-title">Upload Custom Model</span>
                            <span className="upload-subtitle">Supports .GLB and .GLTF</span>
                        </div>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept=".glb,.gltf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
            />
        </div>
    );
};
