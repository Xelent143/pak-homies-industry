import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useConfiguratorStore } from '../store/configuratorStore';

interface DesignQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  garmentType: string;
}

export const DesignQuoteModal: React.FC<DesignQuoteModalProps> = ({ isOpen, onClose, garmentType }) => {
  const {
    quoteViews, quoteViewsReady, clearQuoteViews,
    decals, texts, meshPatterns,
  } = useConfiguratorStore();

  const [uploading, setUploading] = useState(false);
  const [uploadedViewUrls, setUploadedViewUrls] = useState<{ label: string; url: string }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedView, setSelectedView] = useState<string | null>(null);

  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    quantity: '100',
    timeline: '4-6 weeks',
    budgetRange: '',
    description: '',
  });

  const uploadDesignMutation = trpc.rfq.uploadDesignImage.useMutation();
  const submitRfqMutation = trpc.rfq.submitWithDesign.useMutation();

  // Upload all 4 views when they are ready
  useEffect(() => {
    if (!quoteViewsReady || !isOpen || quoteViews.length === 0) return;
    setUploading(true);
    setUploadedViewUrls([]);

    let completed = 0;
    const results: { label: string; url: string }[] = [];

    quoteViews.forEach((view) => {
      const base64 = view.dataUrl.replace(/^data:image\/jpeg;base64,/, '');
      uploadDesignMutation.mutate(
        { imageBase64: base64, mimeType: 'image/jpeg' },
        {
          onSuccess: (data) => {
            results.push({ label: view.label, url: data.url });
            completed++;
            if (completed === quoteViews.length) {
              const order = ['Front', 'Right', 'Back', 'Left'];
              results.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
              setUploadedViewUrls(results);
              setUploading(false);
            }
          },
          onError: () => {
            completed++;
            if (completed === quoteViews.length) setUploading(false);
          },
        }
      );
    });
  }, [quoteViewsReady, isOpen]);

  // Collect applied logos (decals)
  const appliedLogos = decals.map((d, i) => ({
    type: 'Logo' as const,
    src: d.textureUrl,
    label: `Logo ${i + 1}`,
  }));

  // Collect applied textures (mesh patterns)
  const appliedTextures = Object.entries(meshPatterns)
    .filter(([, url]) => !!url)
    .map(([mesh, url]) => ({
      type: 'Texture' as const,
      src: url!,
      label: mesh,
    }));

  // Collect text decals
  const appliedTexts = texts.map((t) => ({
    type: 'Text' as const,
    content: t.text,
    color: t.color,
    font: t.fontFamily,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const primaryUrl = uploadedViewUrls[0]?.url ?? undefined;
    const viewLinks = uploadedViewUrls.map((v) => `${v.label}: ${v.url}`).join('\n');
    const logoInfo = appliedLogos.length > 0
      ? `\nLogos applied: ${appliedLogos.length}\n${appliedLogos.map(l => l.src).join('\n')}`
      : '';
    const textInfo = appliedTexts.length > 0
      ? `\nText decals: ${appliedTexts.map(t => `"${t.content}" (${t.color})`).join(', ')}`
      : '';
    const textureInfo = appliedTextures.length > 0
      ? `\nTextures: ${appliedTextures.map(t => `${t.label}: ${t.src}`).join('\n')}`
      : '';
    const fullDescription = [
      form.description,
      '--- Design Views ---',
      viewLinks,
      logoInfo,
      textInfo,
      textureInfo,
    ].filter(Boolean).join('\n');

    submitRfqMutation.mutate(
      {
        ...form,
        description: fullDescription,
        productType: garmentType || 'Custom Garment',
        designImageUrl: primaryUrl,
        garmentType: garmentType || undefined,
      },
      { onSuccess: () => setSubmitted(true) }
    );
  };

  const handleClose = () => {
    setSubmitted(false);
    setUploadedViewUrls([]);
    setSelectedView(null);
    clearQuoteViews();
    onClose();
  };

  if (!isOpen) return null;

  // Show uploaded URLs if ready, otherwise show raw data URLs as preview
  const displayViews = uploadedViewUrls.length > 0
    ? uploadedViewUrls
    : quoteViews.map((v) => ({ label: v.label, url: v.dataUrl }));

  return (
    <div className="dqm-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="dqm-modal dqm-modal-wide">
        {/* Header */}
        <div className="dqm-header">
          <div>
            <h2 className="dqm-title">Send Design with Quote</h2>
            <p className="dqm-subtitle">All 4 views of your 3D design are attached to this request</p>
          </div>
          <button className="dqm-close" onClick={handleClose}>✕</button>
        </div>

        {submitted ? (
          <div className="dqm-success">
            <div className="dqm-success-icon">✅</div>
            <h3>Quote Request Sent!</h3>
            <p>We've received your design and all 4 views. Our team will get back to you within 24 hours.</p>
            <button className="dqm-btn-primary" onClick={handleClose}>Done</button>
          </div>
        ) : (
          <div className="dqm-body">

            {/* ── Design Views Grid ── */}
            <div className="dqm-preview-section">
              <h3 className="dqm-section-title">
                Your Design — 4 Views
                {garmentType && <span className="dqm-garment-badge-inline">🧥 {garmentType}</span>}
              </h3>

              {(uploading || (!quoteViewsReady && displayViews.length === 0)) ? (
                <div className="dqm-views-loading">
                  <div className="dqm-spinner" />
                  <span>Capturing all 4 views… please wait</span>
                </div>
              ) : (
                <div className="dqm-views-grid">
                  {displayViews.map((view) => (
                    <div
                      key={view.label}
                      className={`dqm-view-card ${selectedView === view.label ? 'dqm-view-card-active' : ''}`}
                      onClick={() => setSelectedView(selectedView === view.label ? null : view.label)}
                    >
                      <img src={view.url} alt={`${view.label} view`} className="dqm-view-img" />
                      <span className="dqm-view-label">{view.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline lightbox for enlarged view */}
              {selectedView && (
                <div className="dqm-lightbox" onClick={() => setSelectedView(null)}>
                  <img
                    src={displayViews.find(v => v.label === selectedView)?.url}
                    alt={selectedView}
                    className="dqm-lightbox-img"
                  />
                  <span className="dqm-lightbox-label">{selectedView} View — click to close</span>
                </div>
              )}

              {/* Applied Assets */}
              {(appliedLogos.length > 0 || appliedTextures.length > 0 || appliedTexts.length > 0) && (
                <div className="dqm-assets-section">
                  <h4 className="dqm-assets-title">Applied Assets</h4>
                  <div className="dqm-assets-row">
                    {appliedLogos.map((logo, i) => (
                      <div key={i} className="dqm-asset-chip">
                        <img src={logo.src} alt="Logo" className="dqm-asset-thumb" />
                        <span>{logo.label}</span>
                      </div>
                    ))}
                    {appliedTextures.map((tex, i) => (
                      <div key={i} className="dqm-asset-chip">
                        <img src={tex.src} alt={tex.label} className="dqm-asset-thumb" />
                        <span>{tex.label}</span>
                      </div>
                    ))}
                    {appliedTexts.map((t, i) => (
                      <div key={i} className="dqm-asset-chip dqm-text-chip">
                        <span className="dqm-text-preview" style={{ color: t.color, fontFamily: t.font }}>
                          {t.content.substring(0, 8)}{t.content.length > 8 ? '…' : ''}
                        </span>
                        <span>Text</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Quote Form ── */}
            <form className="dqm-form" onSubmit={handleSubmit}>
              <h3 className="dqm-section-title">Your Details</h3>
              <div className="dqm-row">
                <div className="dqm-field">
                  <label>Company Name *</label>
                  <input required placeholder="Your brand or company"
                    value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
                </div>
                <div className="dqm-field">
                  <label>Contact Name *</label>
                  <input required placeholder="Your full name"
                    value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
                </div>
              </div>
              <div className="dqm-row">
                <div className="dqm-field">
                  <label>Email *</label>
                  <input required type="email" placeholder="you@company.com"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="dqm-field">
                  <label>Phone / WhatsApp</label>
                  <input placeholder="+1 234 567 8900"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="dqm-row">
                <div className="dqm-field">
                  <label>Country</label>
                  <input placeholder="United States"
                    value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                </div>
                <div className="dqm-field">
                  <label>Quantity (units)</label>
                  <input placeholder="e.g. 100"
                    value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                </div>
              </div>
              <div className="dqm-row">
                <div className="dqm-field">
                  <label>Timeline</label>
                  <select value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })}>
                    <option value="2-3 weeks">2–3 weeks (Rush)</option>
                    <option value="4-6 weeks">4–6 weeks (Standard)</option>
                    <option value="6-8 weeks">6–8 weeks (Relaxed)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div className="dqm-field">
                  <label>Budget Range (USD)</label>
                  <select value={form.budgetRange} onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}>
                    <option value="">Select range</option>
                    <option value="Under $1,000">Under $1,000</option>
                    <option value="$1,000 – $5,000">$1,000 – $5,000</option>
                    <option value="$5,000 – $20,000">$5,000 – $20,000</option>
                    <option value="$20,000+">$20,000+</option>
                  </select>
                </div>
              </div>
              <div className="dqm-field dqm-field-full">
                <label>Additional Notes</label>
                <textarea rows={3}
                  placeholder="Fabric preferences, special requirements, branding details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <button
                type="submit"
                className="dqm-btn-primary dqm-submit"
                disabled={submitRfqMutation.isPending || uploading}
              >
                {submitRfqMutation.isPending ? 'Sending…' : '📩 Send Quote Request with All Views'}
              </button>
              {submitRfqMutation.isError && (
                <p className="dqm-error">Failed to send. Please try again.</p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignQuoteModal;
