import React from 'react';
import { useConfiguratorStore } from '../store/configuratorStore';

export const NavigationControls: React.FC = () => {
    const { cameraTarget, setCameraTarget } = useConfiguratorStore();

    // Pan step size
    const STEP = 0.05;

    const move = (dx: number, dy: number) => {
        // dx/dy are effectively relative to the camera view in OrbitControls, 
        // but since we're updating the target directly in world space, 
        // it's a fixed world-space shift.
        setCameraTarget([
            cameraTarget[0] + dx,
            cameraTarget[1] + dy,
            cameraTarget[2]
        ]);
    };

    const reset = () => setCameraTarget([0, 0, 0]);

    return (
        <div className="nav-controls-overlay">
            <div className="nav-dpad">
                <button
                    className="nav-btn"
                    onClick={() => move(0, STEP)}
                    title="Pan Up"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                </button>

                <div className="nav-row">
                    <button
                        className="nav-btn"
                        onClick={() => move(-STEP, 0)}
                        title="Pan Left"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    <button
                        className="nav-btn center"
                        onClick={reset}
                        title="Reset View"
                    >
                        <div className="center-dot" />
                    </button>

                    <button
                        className="nav-btn"
                        onClick={() => move(STEP, 0)}
                        title="Pan Right"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>

                <button
                    className="nav-btn"
                    onClick={() => move(0, -STEP)}
                    title="Pan Down"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            </div>
            <div className="nav-label">DRAG MODEL</div>
        </div>
    );
};
