import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Scene } from '../designer/components/Scene';
import { NavigationControls } from '../designer/components/NavigationControls';
import { ColorPickerPanel } from '../designer/components/ColorPickerPanel';
import { ModelLibrary } from '../designer/components/ModelLibrary';
import { DecalManager } from '../designer/components/DecalManager';
import { TextManager } from '../designer/components/TextManager';
import { TextureUploader } from '../designer/components/TextureUploader';
import { ExportPanel } from '../designer/components/ExportPanel';
import { useConfiguratorStore } from '../designer/store/configuratorStore';
import { DesignQuoteModal } from '../designer/components/DesignQuoteModal';
import '../designer/designer.css';

type DrawerTab = 'model' | 'logos' | 'text' | 'textures' | 'export' | null;

export default function Customize() {
  const [activeDrawer, setActiveDrawer] = useState<DrawerTab>(null);
  const [isSelectingTextureTarget, setIsSelectingTextureTarget] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const {
    decals, selectDecal, selectedDecalId, updateDecal,
    texts, selectText, selectedTextId, updateText,
    isPlacingText, setPendingText,
    selectedMeshName, selectMesh,
    triggerSnapshot, triggerQuoteCapture, quoteViews, quoteViewsReady, setModelUrl, modelUrl,
    meshPatterns, meshTextureSettings, setMeshTextureSettings,
    loadingProgress,
  } = useConfiguratorStore();

  const isLoading = useConfiguratorStore(state => state.isLoading);
  const selectedMeshHasTexture = selectedMeshName && meshPatterns[selectedMeshName];
  const currentTextureSettings = selectedMeshName
    ? (meshTextureSettings[selectedMeshName] || { scale: 1, tiled: true })
    : { scale: 1, tiled: true };

  useEffect(() => {
    if (isSelectingTextureTarget && selectedMeshName) {
      setActiveDrawer('textures');
      setIsSelectingTextureTarget(false);
    }
  }, [selectedMeshName, isSelectingTextureTarget]);

  const handleNavClick = (tab: DrawerTab) => {
    if (tab === 'textures') {
      if (!modelUrl) { setActiveDrawer('model'); return; }
      if (selectedMeshName) { setActiveDrawer('textures'); }
      else { setIsSelectingTextureTarget(true); setActiveDrawer(null); }
    } else {
      setIsSelectingTextureTarget(false);
      setActiveDrawer(activeDrawer === tab ? null : tab);
    }
  };

  // Open quote modal once all 4 views are captured
  useEffect(() => {
    if (quoteViewsReady && !isQuoteModalOpen) {
      setIsQuoteModalOpen(true);
    }
  }, [quoteViewsReady]);

  const handleSendDesign = () => {
    if (!modelUrl) {
      alert('Please select a garment model first before sending a quote.');
      return;
    }
    triggerQuoteCapture();
  };

  const handleRefresh = () => { setModelUrl(null); window.location.reload(); };
  const handleTextureScaleChange = (scale: number) => {
    if (selectedMeshName) setMeshTextureSettings(selectedMeshName, { scale: Math.max(0.01, scale) });
  };

  const renderDrawerContent = () => {
    switch (activeDrawer) {
      case 'model':
        return (<>
          <div className="drawer-header">
            <span className="drawer-title">Select Model</span>
            <button className="drawer-close" onClick={() => setActiveDrawer(null)}>×</button>
          </div>
          <div className="drawer-content animate-slide-up">
            <ModelLibrary onClose={() => setActiveDrawer(null)} onError={(err) => setLoadError(err)} />
          </div>
        </>);
      case 'logos':
        return (<>
          <div className="drawer-header">
            <span className="drawer-title">Logos</span>
            <button className="drawer-close" onClick={() => setActiveDrawer(null)}>×</button>
          </div>
          <div className="drawer-content animate-slide-up"><DecalManager /></div>
        </>);
      case 'text':
        return (<>
          <div className="drawer-header">
            <span className="drawer-title">Text</span>
            <button className="drawer-close" onClick={() => setActiveDrawer(null)}>×</button>
          </div>
          <div className="drawer-content animate-slide-up"><TextManager /></div>
        </>);
      case 'textures':
        return (<>
          <div className="drawer-header">
            <span className="drawer-title">
              Textures {selectedMeshName && <span style={{ opacity: 0.6, fontSize: '0.8em' }}>• {selectedMeshName}</span>}
            </span>
            <button className="drawer-close" onClick={() => setActiveDrawer(null)}>×</button>
          </div>
          <div className="drawer-content animate-slide-up"><TextureUploader /></div>
        </>);
      default:
        return null;
    }
  };

  // Get the active garment type label from the model URL
  const garmentTypeLabel = modelUrl
    ? (modelUrl.split('/').pop()?.replace('.glb', '').replace(/-/g, ' ') ?? 'Custom Garment')
    : 'Custom Garment';

  return (
    <>
    <div className="designer-root" style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}>
      {/* Pak Homies Industry-branded top bar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '52px', background: 'rgba(10,10,10,0.95)',
        borderBottom: '1px solid rgba(201,168,76,0.2)', flexShrink: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ color: '#c9a84c', fontWeight: 700, fontSize: '13px', textDecoration: 'none', letterSpacing: '0.05em' }}>
            ← Back
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '18px' }}>|</span>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            3D Product Customizer
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleSendDesign}
            title="Send Design with Quote"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: '6px',
              background: 'linear-gradient(135deg, #c9a84c, #e8c96a)',
              color: '#000', fontWeight: 700, fontSize: '12px',
              border: 'none', cursor: 'pointer', letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            📩 Send Design with Quote
          </button>
          <button className="icon-btn" onClick={triggerSnapshot} title="Screenshot">📸</button>
          <button className="icon-btn" onClick={() => setActiveDrawer('export')} title="Export">📥</button>
          <button className="icon-btn" onClick={handleRefresh} title="Reset">🔄</button>
        </div>
      </header>

      {/* 3D Viewport */}
      <div className="viewport" style={{ flex: 1, minHeight: 0, paddingBottom: '64px' }}>
        <Scene isDrawerOpen={!!activeDrawer} />
        <NavigationControls />

        {isSelectingTextureTarget && (
          <div className="selection-prompt animate-fade-in">
            <div className="prompt-content" style={{ flexDirection: 'column', textAlign: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="prompt-icon">🎯</span>
                <div className="prompt-text"><strong>Double click to select a part on model</strong></div>
              </div>
              <button className="prompt-cancel" onClick={() => setIsSelectingTextureTarget(false)} style={{ width: '100%', maxWidth: '200px' }}>Cancel</button>
            </div>
          </div>
        )}

        {isPlacingText && (
          <div className="selection-prompt animate-fade-in">
            <div className="prompt-content">
              <span className="prompt-icon">✏️</span>
              <div className="prompt-text">
                <strong>Place Your Text</strong>
                <span>Click on the model where you want to add text</span>
              </div>
              <button className="prompt-cancel" onClick={() => setPendingText(null)}>Cancel</button>
            </div>
          </div>
        )}

        {!isSelectingTextureTarget && !isPlacingText && !selectedMeshHasTexture && (
          <div className="viewport-overlay">
            <div className="viewport-hint">
              <div className="hint-item"><span className="hint-icon">👆</span><span>Drag to Rotate</span></div>
              <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.2)' }} />
              <div className="hint-item"><span className="hint-icon">🔍</span><span>Pinch to Zoom</span></div>
              <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.2)' }} />
              <div className="hint-item"><span className="hint-icon">👆x2</span><span>Double click to select</span></div>
            </div>
          </div>
        )}

        {decals.length > 0 && !isSelectingTextureTarget && !isPlacingText && (
          <div className="viewport-sidebar">
            {decals.map((decal) => (
              <div key={decal.id} className={`sidebar-item ${selectedDecalId === decal.id ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); selectDecal(decal.id); }}>
                <img src={decal.textureUrl} alt="Logo" />
              </div>
            ))}
          </div>
        )}

        {texts.length > 0 && !isSelectingTextureTarget && !isPlacingText && decals.length === 0 && (
          <div className="viewport-sidebar">
            {texts.map((tc) => (
              <div key={tc.id} className={`sidebar-item ${selectedTextId === tc.id ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); selectText(tc.id); }}>
                <span style={{ fontFamily: tc.fontFamily, color: tc.color, fontSize: '14px' }}>{tc.text.substring(0, 3)}</span>
              </div>
            ))}
          </div>
        )}

        {selectedTextId && texts.find(t => t.id === selectedTextId) && !isSelectingTextureTarget && !isPlacingText && (() => {
          const st = texts.find(t => t.id === selectedTextId)!;
          return (
            <div className="viewport-tools-left animate-scale-in">
              <div className="tool-group">
                <div className="tool-label">Rotate</div>
                <input type="range" min="0" max="360" value={Math.round(st.rotation[2] * 180 / Math.PI)}
                  onChange={(e) => updateText(st.id, { rotation: [0, 0, parseFloat(e.target.value) * Math.PI / 180] })}
                  className="glass-slider" />
              </div>
              <div className="tool-group">
                <div className="tool-label">Size</div>
                <input type="range" min="0.1" max="5" step="0.1" value={st.scale[0]}
                  onChange={(e) => { const v = parseFloat(e.target.value); updateText(st.id, { scale: [v, v, v] }); }}
                  className="glass-slider" />
              </div>
              <div className="tool-group">
                <div className="tool-label">Color</div>
                <input type="color" value={st.color} onChange={(e) => updateText(st.id, { color: e.target.value })}
                  style={{ width: '100%', height: '32px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
              </div>
              <button className="deselect-btn" onClick={() => selectText(null)}>✕ Deselect</button>
            </div>
          );
        })()}

        {selectedDecalId && decals.find(d => d.id === selectedDecalId) && !isSelectingTextureTarget && !isPlacingText && (() => {
          const sd = decals.find(d => d.id === selectedDecalId)!;
          return (
            <div className="viewport-tools-left animate-scale-in">
              <div className="tool-group">
                <div className="tool-label">Rotate</div>
                <input type="range" min="0" max="360" value={Math.round(sd.rotation[2] * 180 / Math.PI)}
                  onChange={(e) => updateDecal(sd.id, { rotation: [0, 0, parseFloat(e.target.value) * Math.PI / 180] })}
                  className="glass-slider" />
              </div>
              <div className="tool-group">
                <div className="tool-label">Size</div>
                <input type="range" min="0.1" max="5" step="0.1" value={sd.scale[0]}
                  onChange={(e) => { const v = parseFloat(e.target.value); updateDecal(sd.id, { scale: [v, v, v] }); }}
                  className="glass-slider" />
              </div>
              <button className="deselect-btn" onClick={() => selectDecal(null)}>✕ Deselect</button>
            </div>
          );
        })()}

        {selectedMeshHasTexture && !selectedDecalId && !selectedTextId && !isSelectingTextureTarget && !isPlacingText && activeDrawer !== 'textures' && (
          <div className="viewport-texture-slider animate-scale-in">
            <div className="texture-slider-body">
              <button className="texture-slider-close-floating" onClick={() => selectMesh(null)}>✕</button>
              <div className="texture-slider-controls">
                <button className="texture-size-btn" onClick={() => handleTextureScaleChange(currentTextureSettings.scale - 0.1)}>−</button>
                <div className="texture-slider-track-wrapper">
                  <input type="range" className="texture-slider-range" min="0.01" max="100" step="0.1"
                    value={Math.min(currentTextureSettings.scale, 100)}
                    onChange={(e) => handleTextureScaleChange(parseFloat(e.target.value))} />
                  <div className="texture-slider-fill" style={{ width: `${Math.min((currentTextureSettings.scale / 100) * 100, 100)}%` }} />
                </div>
                <button className="texture-size-btn" onClick={() => handleTextureScaleChange(currentTextureSettings.scale + 0.1)}>+</button>
              </div>
            </div>
          </div>
        )}

        {selectedMeshName && !selectedMeshHasTexture && !selectedDecalId && !selectedTextId && !isSelectingTextureTarget && !isPlacingText && activeDrawer !== 'textures' && (
          <div className="viewport-tools-left animate-scale-in">
            <ColorPickerPanel />
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay animate-fade-in">
          <div className="loading-backdrop" />
          <div className="loading-content-modern">
            <div className="spinner-wrapper">
              <div className="spinner-ring" />
              <div className="spinner-ring-glow" />
            </div>
            <div className="loading-text-group">
              <h3 className="loading-title">LOADING MODEL</h3>
              <p className="loading-percentage">{Math.round(loadingProgress)}%</p>
            </div>
            <div className="loading-bar-modern-track">
              <div className="loading-bar-modern-fill" style={{ width: `${loadingProgress}%` }} />
            </div>
            <p className="loading-hint-modern">Large models may take up to 1 minute to load…</p>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {loadError && (
        <div className="error-overlay animate-fade-in" onClick={() => setLoadError(null)}>
          <div className="error-modal" onClick={(e) => e.stopPropagation()}>
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Failed to Load Model</h3>
            <p className="error-message">{loadError}</p>
            <button className="error-dismiss-btn" onClick={() => setLoadError(null)}>Try Again</button>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button className={`nav-item ${activeDrawer === 'model' ? 'active' : ''}`} onClick={() => handleNavClick('model')}>
          <span className="nav-icon">👕</span><span className="nav-label">Model</span>
        </button>
        <button className={`nav-item ${activeDrawer === 'logos' ? 'active' : ''}`} onClick={() => handleNavClick('logos')}>
          <span className="nav-icon">🏷️</span><span className="nav-label">Logos</span>
        </button>
        <button className={`nav-item ${activeDrawer === 'text' || isPlacingText ? 'active' : ''}`} onClick={() => handleNavClick('text')}>
          <span className="nav-icon">✏️</span><span className="nav-label">Text</span>
        </button>
        <button className={`nav-item ${activeDrawer === 'textures' || isSelectingTextureTarget ? 'active' : ''}`} onClick={() => handleNavClick('textures')}>
          <span className="nav-icon">🎨</span><span className="nav-label">Textures</span>
        </button>
      </nav>

      {/* Drawer */}
      <div className={`drawer-overlay ${activeDrawer ? 'open' : ''}`} onClick={() => setActiveDrawer(null)} />
      <div className={`drawer ${activeDrawer && activeDrawer !== 'export' ? 'open' : ''}`}>
        <div className="drawer-handle" />
        {renderDrawerContent()}
      </div>

      {/* Export Modal */}
      {activeDrawer === 'export' && (
        <div className="export-modal-overlay" onClick={() => setActiveDrawer(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
            <ExportPanel />
            <button className="export-close-btn" onClick={() => setActiveDrawer(null)}>×</button>
          </div>
        </div>
      )}
    </div>

    {/* Design Quote Modal — rendered outside the fixed designer div so it can scroll */}
    <DesignQuoteModal
      isOpen={isQuoteModalOpen}
      onClose={() => setIsQuoteModalOpen(false)}
      garmentType={garmentTypeLabel}
    />
    </>
  );
}
