import React from 'react';
import { Eye, Video, Mic, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { getAssetUrl } from '../utils/assets.js';

export function DifferentTypes({ onSelectType, onOpenComingSoon }) {
  const cards = [
    {
      id: 'image',
      title: 'AI Image & Face Detection',
      accuracy: '99.4%',
      status: 'available',
      statusLabel: 'Available Now',
      subtitle: 'Spot Face Swaps & Diffusion',
      image: getAssetUrl('/assets/type_face.jpg'),
      badge: 'Spatial & Biometrics',
      desc: 'Detects facial landmark warping, corneal highlight asymmetry, and GAN/diffusion checkerboard patterns across static photos.',
      highlights: ['Face-swap boundary seams', 'Midjourney & Flux portraits', 'Corneal reflection physics']
    },
    {
      id: 'video',
      title: 'AI Video Detection',
      accuracy: 'In Dev',
      status: 'coming-soon',
      statusLabel: 'Coming Soon',
      subtitle: 'Spot Viral Video Manipulations',
      image: getAssetUrl('/assets/type_video.jpg'),
      badge: 'Temporal & Lip-Sync',
      desc: 'Decomposes video streams to inspect frame-by-frame optical flow, spontaneous eye saccades, and viseme-to-phoneme lip sync.',
      highlights: ['Temporal motion vectors', 'Audio-visual lip alignment', 'Broadcast stream integrity']
    },
    {
      id: 'audio',
      title: 'AI Voice & Audio Detection',
      accuracy: 'In Dev',
      status: 'coming-soon',
      statusLabel: 'Coming Soon',
      subtitle: 'Spot Cloned Scam Calls',
      image: getAssetUrl('/assets/type_audio.jpg'),
      badge: 'Spectrogram & Vocoder',
      desc: 'Analyzes acoustic waveforms and mel-spectrograms for neural vocoder phase cutoffs and lack of biological glottal jitter.',
      highlights: ['HiFi-GAN & BigVGAN cuts', 'Zero-shot voice clones', 'Robotic pitch quantization']
    }
  ];

  return (
    <section id="detection-types" className="types-section section-padding">
      <div className="container">
        <div className="section-header">
          <div className="badge-pill" style={{ marginBottom: '14px' }}>
            <Eye size={14} />
            <span>Multi-Modal Coverage</span>
          </div>
          <h2>Different Deepfake Detection Online</h2>
          <p>
            Choose from our specialized forensics engines engineered for high-precision detection across images, viral video feeds, and synthetic voice clones.
          </p>
        </div>

        <div className="types-grid">
          {cards.map((card) => {
            const isComingSoon = card.status === 'coming-soon';
            return (
              <div key={card.id} className={`type-card glass-card ${isComingSoon ? 'card-coming-soon' : 'card-available'}`}>
                {/* Card Image with Accuracy & Status Badge */}
                <div className="card-image-wrap">
                  <img src={card.image} alt={card.title} className="card-img" />
                  <div className="card-overlay" />
                  
                  {/* Status pill top-left */}
                  <div className={`card-status-pill ${card.status}`}>
                    <span className={`status-dot ${card.status}`} />
                    <span>{card.statusLabel}</span>
                  </div>

                  {/* Accuracy pill top-right */}
                  <div className="card-accuracy-pill">
                    <span className={`acc-val ${isComingSoon ? 'acc-val-muted' : ''}`}>{card.accuracy}</span>
                    <span className="acc-label">{isComingSoon ? 'Roadmap' : 'Precision'}</span>
                  </div>

                  <div className="card-engine-tag">
                    {card.badge}
                  </div>
                </div>

                {/* Card Content */}
                <div className="card-body">
                  <div className="card-title-row">
                    <h3 className="card-title">{card.title}</h3>
                    {isComingSoon && (
                      <span className="coming-soon-chip">Coming Soon</span>
                    )}
                  </div>
                  <p className="card-sub">{card.subtitle}</p>
                  <p className="card-desc">{card.desc}</p>

                  {/* Highlights */}
                  <div className="card-highlights">
                    {card.highlights.map((h, i) => (
                      <div key={i} className="highlight-row">
                        <Check size={14} className={isComingSoon ? 'check-icon-muted' : 'check-icon'} />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  {isComingSoon ? (
                    <button 
                      className="card-cta-btn coming-soon-btn"
                      onClick={() => onOpenComingSoon?.(card.id)}
                      title={`${card.title} is coming soon`}
                    >
                      <span>{card.title} (Coming Soon)</span>
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button 
                      className="card-cta-btn"
                      onClick={() => {
                        onSelectType?.(card.id);
                        const el = document.getElementById('studio');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <span>Launch Image Forensics</span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .types-section {
          background: linear-gradient(180deg, transparent, rgba(248, 250, 252, 0.6), transparent);
        }
        .types-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .type-card {
          border-radius: var(--radius-xl);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid var(--border-card);
          transition: all 0.3s ease;
        }
        .type-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99, 102, 241, 0.45);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(99, 102, 241, 0.2);
        }
        .card-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #0f172a;
        }
        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .type-card:hover .card-img {
          transform: scale(1.05);
        }
        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, transparent 55%, rgba(15, 23, 42, 0.72) 100%);
          pointer-events: none;
        }
        .card-status-pill {
          position: absolute;
          top: 12px;
          left: 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .card-status-pill.available {
          background: rgba(16, 185, 129, 0.9);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .card-status-pill.coming-soon {
          background: rgba(245, 158, 11, 0.9);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        .status-dot.available {
          box-shadow: 0 0 6px #ffffff;
        }
        .card-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 4px;
        }
        .coming-soon-chip {
          padding: 3px 8px;
          border-radius: var(--radius-full);
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .acc-val-muted {
          color: #94a3b8 !important;
          font-size: 0.95rem !important;
        }
        .check-icon-muted {
          color: #94a3b8;
          flex-shrink: 0;
        }
        .coming-soon-btn {
          background: rgba(245, 158, 11, 0.06) !important;
          border-color: rgba(245, 158, 11, 0.25) !important;
          color: #b45309 !important;
        }
        .type-card:hover .coming-soon-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706) !important;
          color: #ffffff !important;
          border-color: transparent !important;
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35) !important;
        }
        .card-accuracy-pill {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 12px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(16, 185, 129, 0.4);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
        }
        .acc-val {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          color: #059669;
          line-height: 1;
        }
        .acc-label {
          font-size: 0.62rem;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .card-engine-tag {
          position: absolute;
          bottom: 12px;
          left: 14px;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          background: rgba(15, 23, 42, 0.8);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          font-family: var(--font-mono);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          letter-spacing: 0.02em;
        }
        .card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .card-title {
          font-size: 1.35rem;
          margin-bottom: 4px;
          color: var(--text-primary);
        }
        .card-sub {
          font-size: 0.85rem;
          color: var(--cyan);
          font-weight: 600;
          margin-bottom: 12px;
        }
        .card-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 18px;
        }
        .card-highlights {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 22px;
          flex: 1;
        }
        .highlight-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--text-primary);
        }
        .check-icon {
          color: #10b981;
          flex-shrink: 0;
        }
        .card-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px;
          border-radius: var(--radius-md);
          background: rgba(0, 0, 0, 0.03);
          border: 1px solid var(--border-card);
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .type-card:hover .card-cta-btn {
          background: linear-gradient(135deg, #4f46e5, #3b82f6);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
        }
        @media (max-width: 992px) {
          .types-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
