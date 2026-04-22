import React from 'react';
import { useConfiguratorStore } from '../store/configuratorStore';
import { PRESET_MODELS, type ModelDefinition } from '../models';
import { ModelUploader } from './ModelUploader';

interface ModelLibraryProps {
    onClose?: () => void;
    onError?: (error: string) => void;
}

export const ModelLibrary: React.FC<ModelLibraryProps> = ({ onClose, onError }) => {
    const { setModelUrl, isLoading, modelUrl, setLoading, setLoadingProgress } = useConfiguratorStore();

    const handleSelectModel = async (model: ModelDefinition) => {
        if (isLoading) return;

        // Close drawer immediately for better UX
        if (onClose) onClose();

        try {
            setLoading(true);
            setLoadingProgress(0); // Reset progress

            // Use the new Caching Utility
            // This will check local storage -> download if missing -> return local URI
            const { getCachedModelUrl } = await import('../utils/assetCache');
            const cachedUrl = await getCachedModelUrl(model.file, (progress) => {
                setLoadingProgress(progress);
            });

            setModelUrl(cachedUrl);
        } catch (error: any) {
            console.error("Failed to load model:", error);
            const errorMessage = error.message || 'Unknown error occurred';
            if (onError) {
                onError(errorMessage);
            } else {
                alert(`Failed to load model: ${errorMessage}`);
            }
            setLoading(false);
        }
    };

    return (
        <div className="model-library">
            {/* Bento Grid of Models */}
            <div className="bento-grid">
                {PRESET_MODELS.map((model) => {
                    const isActive = modelUrl === model.file;
                    return (
                        <div
                            key={model.id}
                            className={`bento-card ${isActive ? 'active' : ''}`}
                            onClick={() => handleSelectModel(model)}
                        >
                            <div className="bento-thumb">
                                {model.thumbnail ? (
                                    <img
                                        src={model.thumbnail}
                                        alt={model.name}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const placeholder = e.currentTarget.parentElement?.querySelector('.bento-thumb-placeholder') as HTMLElement;
                                            if (placeholder) placeholder.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <span className="bento-thumb-placeholder" style={{ display: model.thumbnail ? 'none' : 'flex' }}>
                                    👕
                                </span>
                            </div>
                            <span className="bento-label">{model.name}</span>
                        </div>
                    );
                })}
            </div>

            {/* Divider */}
            <div className="section-divider">
                <span>OR UPLOAD</span>
            </div>

            {/* Upload Custom Model */}
            <ModelUploader />
        </div>
    );
};
