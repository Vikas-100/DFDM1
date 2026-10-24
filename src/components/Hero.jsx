import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Star, 
  Upload, 
  Sparkles, 
  Zap, 
  Eye, 
  Lock, 
  SlidersHorizontal
} from 'lucide-react';
import { getAssetUrl } from '../utils/assets.js';

export function Hero({ onStartInspection: _onStartInspection, onOpenComingSoon: _onOpenComingSoon, onOpenAuth }) {
  // Slider position (percentage 0 - 100)
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showMeshOverlay, setShowMeshOverlay] = useState(true);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(clamped);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="hero-content">
            <div className="badge-pill">
              <Zap size={14} className="badge-icon-spin" />
              <span>Next-Gen AI Media Forensics 3.0</span>
            </div>

            <h1 className="hero-title">
              AI Deepfake <br />
              <span className="gradient-text-primary">Detection Online Free</span>
            </h1>

            <p className="hero-desc">
              Detect whether an uploaded <strong>image</strong> (JPG, PNG, WEBP) is potentially AI-generated or manipulated. Powered by multi-layer neural networks, Error Level Analysis (ELA), and biological landmark verification. Video and audio deepfake detection are coming soon.
            </p>

            {/* Social Proof Stars */}
            <div className="rating-bar">
              <div className="stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span className="rating-score">4.9 / 5</span>
              <span className="rating-divider">•</span>
              <span className="rating-meta">140,000+ Images Verified</span>
            </div>

            {/* CTA Buttons */}
            <div className="hero-cta-group">
              <button 
                className="btn-primary hero-btn-main"
                onClick={() => {
                  const el = document.getElementById('studio');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Upload size={18} />
                <span>Upload Image & Test</span>
              </button>
              <button 
                type="button"
                className="btn-secondary"
                onClick={() => onOpenAuth?.('signup')}
              >
                <Sparkles size={16} style={{ color: 'var(--cyan)' }} />
                <span>Sign Up Free (50 Scans/Mo)</span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="hero-trust-row">
              <div className="trust-item">
                <ShieldCheck size={16} className="trust-icon green" />
                <span>99.4% Ensemble Precision</span>
              </div>
              <div className="trust-item">
                <Lock size={16} className="trust-icon cyan" />
                <span>Zero-Log Privacy</span>
              </div>
              <div className="trust-item">
                <Sparkles size={16} className="trust-icon purple" />
                <span>C2PA Standard Compatible</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Real vs Fake Split Comparison Slider */}
          <div className="hero-visual-card glass-card">
            <div className="visual-card-header">
              <div className="visual-header-title">
                <SlidersHorizontal size={16} className="slider-icon" />
                <span>Forensic Comparison Slider</span>
              </div>
              <div className="visual-controls">
                <button 
                  className={`overlay-toggle-btn ${showMeshOverlay ? 'active' : ''}`}
                  onClick={() => setShowMeshOverlay(!showMeshOverlay)}
                  title="Toggle Landmark Analysis"
                >
                  <Eye size={14} />
                  <span>{showMeshOverlay ? 'Hide Landmarks' : 'Show Landmarks'}</span>
                </button>
              </div>
            </div>

            {/* Comparison Viewer Container */}
            <div 
              className="comparison-viewer"
              ref={containerRef}
              onMouseDown={(e) => {
                setIsDragging(true);
                handleMove(e.clientX);
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onTouchStart={(e) => {
                if (e.touches[0]) handleMove(e.touches[0].clientX);
              }}
            >
              {/* Fake (Modified) Image Background */}
              <div className="image-layer fake-layer">
                <img 
                  src={getAssetUrl('/assets/hero_fake.jpg')} 
                  alt="AI Deepfake Face Swap" 
                  className="comparison-img"
                  draggable="false"
                />
                <div className="status-tag fake-tag">
                  <span className="dot fake" />
                  <span>Fake (AI Face Swapped)</span>
                </div>

                {/* Simulated Landmark / Seam Heatmap Overlay */}
                {showMeshOverlay && (
                  <div className="visual-hud-overlay">
                    <div className="seam-indicator" style={{ top: '68%', left: '46%' }}>
                      <div className="seam-pulse" />
                      <span className="seam-text">▲ Jawline Seam (ΔE=8.4)</span>
                    </div>
                    <div className="seam-indicator" style={{ top: '44%', left: '56%' }}>
                      <div className="seam-pulse" />
                      <span className="seam-text">▲ Specular Asymmetry</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Real (Original) Image Clipped Layer */}
              <div 
                className="image-layer real-layer"
                style={{ width: `${sliderPos}%` }}
              >
                <img 
                  src={getAssetUrl('/assets/hero_real.jpg')} 
                  alt="Authentic Camera Original" 
                  className="comparison-img"
                  draggable="false"
                />
                <div className="status-tag real-tag">
                  <span className="dot real" />
                  <span>Real (Authentic DSLR)</span>
                </div>

                {showMeshOverlay && (
                  <div className="visual-hud-overlay">
                    <div className="verified-box" style={{ top: '22%', left: '26%', width: '48%', height: '56%' }}>
                      <span className="verified-text">✓ BIOMETRIC PASS</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Draggable Divider Handle */}
              <div 
                className="slider-divider"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="slider-line" />
                <div className="slider-handle">
                  <span className="handle-arrow">◀</span>
                  <span className="handle-arrow">▶</span>
                </div>
              </div>
            </div>

            {/* Bottom Insight Bar */}
            <div className="visual-footer">
              <div className="insight-chip">
                <span className="insight-label">Detected Type:</span>
                <span className="insight-val red">InsightFace Latent Swap</span>
              </div>
              <div className="insight-chip">
                <span className="insight-label">Confidence:</span>
                <span className="insight-val">94.8% Probability Fake</span>
              </div>
              <div className="insight-tip">
                <span>Drag slider to inspect facial seams</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          padding: 60px 0 80px;
          position: relative;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .hero-title {
          font-size: clamp(2.4rem, 4.2vw, 3.8rem);
          line-height: 1.1;
          letter-spacing: -0.03em;
        }
        .hero-desc {
          font-size: 1.12rem;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 540px;
        }
        .hero-desc strong {
          color: #0f172a;
        }
        .rating-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
        }
        .stars-row {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .rating-score {
          font-weight: 700;
          color: #0f172a;
        }
        .rating-divider {
          color: var(--text-muted);
        }
        .rating-meta {
          color: var(--text-secondary);
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
          flex-wrap: wrap;
        }
        .hero-btn-main {
          padding: 14px 28px;
          font-size: 1rem;
        }
        .hero-trust-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 12px;
          flex-wrap: wrap;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .trust-icon.green { color: var(--real-green); }
        .trust-icon.cyan { color: var(--cyan); }
        .trust-icon.purple { color: #a855f7; }

        /* Comparison Slider Card */
        .hero-visual-card {
          padding: 18px;
          border-radius: var(--radius-xl);
          background: #ffffff;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06);
        }
        .visual-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          padding: 0 6px;
        }
        .visual-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .slider-icon {
          color: var(--cyan);
        }
        .overlay-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.03);
          color: var(--text-secondary);
          border: 1px solid var(--border-card);
        }
        .overlay-toggle-btn.active {
          background: rgba(6, 182, 212, 0.15);
          color: #0891b2;
          border-color: rgba(6, 182, 212, 0.4);
        }

        /* Comparison Viewer Container */
        .comparison-viewer {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: ew-resize;
          user-select: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          background: #f1f5f9;
        }
        .image-layer {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .comparison-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }
        .real-layer {
          z-index: 2;
          border-right: 2px solid #ffffff;
        }
        .real-layer .comparison-img {
          width: calc(100% * 100 / var(--w, 100));
        }

        /* Status Tags */
        .status-tag {
          position: absolute;
          top: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          backdrop-filter: blur(10px);
          z-index: 5;
        }
        .real-tag {
          left: 14px;
          background: rgba(16, 185, 129, 0.85);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
        }
        .fake-tag {
          right: 14px;
          background: rgba(239, 68, 68, 0.85);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ffffff;
        }

        /* Visual HUD elements */
        .visual-hud-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .seam-indicator {
          position: absolute;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .seam-pulse {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #ef4444;
          background: rgba(239, 68, 68, 0.3);
          animation: pulseSlow 1.5s infinite;
        }
        .seam-text {
          margin-top: 4px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          color: #fca5a5;
          background: rgba(0, 0, 0, 0.85);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(239, 68, 68, 0.4);
          white-space: nowrap;
        }
        .verified-box {
          position: absolute;
          border: 2px dashed rgba(16, 185, 129, 0.8);
          border-radius: 8px;
          padding: 6px;
        }
        .verified-text {
          position: absolute;
          top: -24px;
          left: 0;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          color: #6ee7b7;
          background: rgba(0, 0, 0, 0.85);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        /* Divider & Handle */
        .slider-divider {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 0;
          z-index: 10;
          pointer-events: none;
        }
        .slider-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: -1px;
          width: 2px;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
        }
        .slider-handle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ffffff;
          color: #080c15;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 800;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 255, 255, 0.5);
          pointer-events: auto;
        }
        .handle-arrow {
          font-size: 0.65rem;
          color: #4f46e5;
        }

        /* Footer Insight */
        .visual-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
          padding: 0 4px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .insight-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-family: var(--font-mono);
        }
        .insight-label {
          color: var(--text-muted);
        }
        .insight-val {
          font-weight: 600;
          color: var(--text-primary);
        }
        .insight-val.red {
          color: #dc2626;
        }
        .insight-tip {
          font-size: 0.76rem;
          color: var(--text-muted);
          font-style: italic;
        }

        @media (max-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .hero-content {
            text-align: center;
            align-items: center;
          }
          .hero-desc {
            max-width: 100%;
          }
          .hero-cta-group, .hero-trust-row, .rating-bar {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
