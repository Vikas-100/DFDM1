import React from 'react';
import { USE_CASES } from '../data/usecases';
import { ArrowRight, CheckCircle2, Shield, Sparkles } from 'lucide-react';

export function UseCases({ onSelectPreset: _onSelectPreset }) {
  return (
    <section id="use-cases" className="usecases-section section-padding">
      <div className="container">
        <div className="section-header">
          <div className="badge-pill" style={{ marginBottom: '14px' }}>
            <Shield size={14} />
            <span>Real-World Impact</span>
          </div>
          <h2>Trusted Across Critical Industries</h2>
          <p>
            From newsrooms and historical archives to family protection and creative IP defense, discover how TruthLens defends authenticity in everyday high-stakes scenarios.
          </p>
        </div>

        <div className="usecases-list">
          {USE_CASES.map((uc, index) => {
            const isReversed = index % 2 === 1;
            return (
              <div 
                key={uc.id} 
                className={`usecase-row glass-card ${isReversed ? 'row-reversed' : ''}`}
              >
                {/* Content Side */}
                <div className="usecase-content">
                  <div className="badge-pill cyan" style={{ marginBottom: '14px', width: 'fit-content' }}>
                    <Sparkles size={13} />
                    <span>{uc.badge}</span>
                  </div>

                  <h3 className="usecase-title">{uc.title}</h3>
                  <p className="usecase-desc">{uc.description}</p>

                  {/* Bullet points */}
                  <div className="usecase-bullets">
                    {uc.points.map((pt, i) => (
                      <div key={i} className="bullet-row">
                        <CheckCircle2 size={16} className="bullet-check" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats Pill */}
                  <div className="stats-box">
                    <span className="stats-label">Performance Benchmark:</span>
                    <span className="stats-value">{uc.stats}</span>
                  </div>

                  {/* Action button */}
                  <button 
                    className="btn-primary usecase-btn"
                    onClick={() => {
                      const el = document.getElementById('studio');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <span>{uc.ctaText}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Image Side */}
                <div className="usecase-image-wrap">
                  <img src={uc.image} alt={uc.title} className="usecase-img" />
                  <div className="usecase-img-glow" />
                  <div className="usecase-watermark-tag">
                    <span>FORENSIC CASE STUDY #{index + 1}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .usecases-section {
          position: relative;
        }
        .usecases-list {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }
        .usecase-row {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 40px;
          padding: 36px;
          border-radius: var(--radius-xl);
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          align-items: center;
          transition: all 0.3s ease;
        }
        .usecase-row:hover {
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
        }
        .usecase-row.row-reversed {
          grid-template-columns: 1fr 1.1fr;
        }
        .usecase-row.row-reversed .usecase-content {
          order: 2;
        }
        .usecase-row.row-reversed .usecase-image-wrap {
          order: 1;
        }
        .usecase-content {
          display: flex;
          flex-direction: column;
        }
        .usecase-title {
          font-size: clamp(1.6rem, 2.4vw, 2.1rem);
          color: #0f172a;
          margin-bottom: 14px;
          line-height: 1.2;
        }
        .usecase-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .usecase-bullets {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }
        .bullet-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.88rem;
          color: var(--text-primary);
        }
        .bullet-check {
          color: var(--cyan);
          flex-shrink: 0;
          margin-top: 3px;
        }
        .stats-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          background: rgba(99, 102, 241, 0.06);
          border: 1px solid rgba(99, 102, 241, 0.2);
          margin-bottom: 24px;
          font-size: 0.82rem;
          width: fit-content;
        }
        .stats-label {
          color: #4f46e5;
          font-weight: 500;
        }
        .stats-value {
          color: #0f172a;
          font-weight: 700;
          font-family: var(--font-mono);
        }
        .usecase-btn {
          width: fit-content;
          padding: 12px 24px;
        }

        /* Image Wrap */
        .usecase-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #f1f5f9;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          border: 1px solid var(--border-card);
        }
        .usecase-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .usecase-row:hover .usecase-img {
          transform: scale(1.04);
        }
        .usecase-img-glow {
          position: absolute;
          inset: 0;
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.15);
          pointer-events: none;
        }
        .usecase-watermark-tag {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(6px);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: #0f172a;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        @media (max-width: 992px) {
          .usecase-row, .usecase-row.row-reversed {
            grid-template-columns: 1fr;
            padding: 24px;
          }
          .usecase-row.row-reversed .usecase-content {
            order: 1;
          }
          .usecase-row.row-reversed .usecase-image-wrap {
            order: 2;
          }
        }
      `}</style>
    </section>
  );
}
