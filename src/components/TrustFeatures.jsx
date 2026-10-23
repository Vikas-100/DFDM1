import React from 'react';
import { Cpu, ShieldCheck, Eye, Lock } from 'lucide-react';

export function TrustFeatures() {
  const pillars = [
    {
      icon: Cpu,
      title: 'Multi-Model Neural Ensemble',
      desc: 'We combine Vision Transformers, EfficientNet backbones, 2D Fourier transforms, and SyncNet audio detectors to minimize false positives and outsmart evasive generative models.'
    },
    {
      icon: Lock,
      title: 'Zero-Knowledge Privacy Guarantee',
      desc: 'Your uploaded media is processed in ephemeral memory and discarded immediately. We never train public models on your data or archive your private files.'
    },
    {
      icon: Eye,
      title: 'Explainable AI & Visual Heatmaps',
      desc: 'No opaque black boxes. TruthLens provides interactive Error Level Analysis (ELA), 68-point facial landmark meshes, and high-frequency spectral spike readouts.'
    },
    {
      icon: ShieldCheck,
      title: 'C2PA Coalition Provenance',
      desc: 'Certified compatibility with Coalition for Content Provenance and Authenticity (C2PA) standards, validating cryptographic hardware camera signatures.'
    }
  ];

  return (
    <section className="trust-section section-padding">
      <div className="container">
        <div className="section-header">
          <div className="badge-pill cyan" style={{ marginBottom: '14px' }}>
            <ShieldCheck size={14} />
            <span>Enterprise Security & Trust</span>
          </div>
          <h2>Why Thousands Trust Our Deepfake Detection Tool</h2>
          <p>
            Engineered with cryptographic rigor, peer-reviewed neural architectures, and zero-compromise privacy standards.
          </p>
        </div>

        <div className="trust-grid">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="trust-card glass-card">
                <div className="trust-icon-box">
                  <Icon size={24} />
                </div>
                <h3 className="trust-card-title">{p.title}</h3>
                <p className="trust-card-desc">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .trust-section {
          background: #f8fafc;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .trust-card {
          padding: 30px 24px;
          border-radius: var(--radius-xl);
          background: #ffffff;
          border: 1px solid var(--border-card);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          transition: all 0.3s ease;
        }
        .trust-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.07);
        }
        .trust-icon-box {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(6, 182, 212, 0.08));
          border: 1px solid rgba(99, 102, 241, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--cyan);
          margin-bottom: 20px;
        }
        .trust-card-title {
          font-size: 1.15rem;
          color: #0f172a;
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .trust-card-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        @media (max-width: 992px) {
          .trust-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .trust-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
