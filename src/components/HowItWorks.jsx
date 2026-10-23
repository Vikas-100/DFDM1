import React, { useState } from 'react';
import { 
  Upload, 
  Cpu, 
  Search, 
  BarChart, 
  ShieldCheck, 
  FileCheck, 
  ArrowRight,
  Layers,
  Sparkles,
  Zap,
  Lock
} from 'lucide-react';

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Upload Media',
      subtitle: 'Instant Ingestion & Hashing',
      icon: Upload,
      description: 'Upload any image (JPG, JPEG, PNG, WEBP up to 10 MB). Our zero-knowledge client engine calculates a cryptographic SHA-256 hash immediately in your browser to maintain strict chain-of-custody verification. Video and audio detection will be available in upcoming updates.',
      details: [
        'Client-side cryptographic SHA-256 fingerprinting',
        'C2PA manifest extraction and EXIF metadata check',
        'Format normalization and lossy compression compensation'
      ],
      previewTag: 'INPUT: RAW ENCODED MEDIA'
    },
    {
      num: '02',
      title: 'Preprocessing',
      subtitle: 'Biometric & Frame Extraction',
      icon: Layers,
      description: 'High-speed neural extractors isolate regions of interest. For images and video, our 68-point facial landmark detector maps the subject’s head pose, eye gaze, and mouth visemes. For audio, speech tracks are separated from background noise and converted into Mel-Spectrogram frames.',
      details: [
        '68-point 3D facial mesh alignment & gaze tracking',
        'Temporal video frame decomposition (up to 120 keyframes)',
        'Mel-frequency cepstral coefficients (MFCC) acoustic slicing'
      ],
      previewTag: 'PIPELINE: NORMALIZATION & LANDMARKING'
    },
    {
      num: '03',
      title: 'AI/ML Detection',
      subtitle: 'Multi-Model Neural Ensembles',
      icon: Cpu,
      description: 'The extracted features are processed in parallel through specialized deep convolutional networks (EfficientNet, Vision Transformers, and SyncNet). The ensemble analyzes high-level semantic inconsistencies that human eyes cannot perceive.',
      details: [
        'Spatial artifact classifier for latent diffusion signatures',
        '2D Fast Fourier Transform (FFT) high-frequency analysis',
        'Temporal blink rate & lip-sync audio-visual congruence'
      ],
      previewTag: 'NEURAL ENSEMBLE: PARALLEL INFERENCE'
    },
    {
      num: '04',
      title: 'Analyze Manipulation Features',
      subtitle: 'Pixel & Frequency Diagnostics',
      icon: Search,
      description: 'Our diagnostic engines run Error Level Analysis (ELA) to expose compression boundaries where faces or objects were pasted in. Optical reflection physics in the corneas are cross-referenced with ambient lighting angles to spot synthetic irises.',
      details: [
        'Dynamic Error Level Analysis (ELA) canvas rendering',
        'Corneal specular reflection physics consistency',
        'Neural vocoder 16kHz phase-cutoff isolation'
      ],
      previewTag: 'FORENSICS: MULTI-LAYER ANOMALY CHECK'
    },
    {
      num: '05',
      title: 'Authenticity Score',
      subtitle: 'Probabilistic Ensemble Synthesis',
      icon: BarChart,
      description: 'Individual model probabilities are synthesized using Bayesian calibration to produce an Authenticity Score from 0% to 100%. The system determines whether the file is Authentic Camera Raw, Latent AI Synthesis, or a Face-Swap Deepfake.',
      details: [
        'Calibrated probability weighting across 5 sub-models',
        'Confidence margin calculation (±1.2% tolerance)',
        'False-positive suppression via C2PA provenance cross-check'
      ],
      previewTag: 'SCORING: 0% - 100% PROBABILITY'
    },
    {
      num: '06',
      title: 'Result + Explanation',
      subtitle: 'Audit Report & Verifiable Certificate',
      icon: FileCheck,
      description: 'A transparent, explainable forensic report is rendered. You can inspect interactive heatmaps, toggle facial landmark meshes, read plain-English manipulation summaries, and download an official cryptographic verification certificate.',
      details: [
        'Interactive Grad-CAM and ELA visual toggle overlays',
        'Plain-English and forensic engineering explanations',
        'Verifiable certificate with QR code and SHA-256 hash'
      ],
      previewTag: 'OUTPUT: CERTIFICATE & EXPORT'
    }
  ];

  return (
    <section id="how-it-works" className="hiw-section section-padding">
      <div className="container">
        <div className="section-header">
          <div className="badge-pill cyan" style={{ marginBottom: '14px' }}>
            <Zap size={14} />
            <span>End-to-End Pipeline</span>
          </div>
          <h2>How Deepfake Detection Works</h2>
          <p>
            From raw media ingestion to multi-layer forensic scoring — follow how DFD verifies digital truth in seconds.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="hiw-steps-grid">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <div 
                key={step.num} 
                className={`hiw-step-card glass-card ${isSelected ? 'active-step' : ''}`}
                onClick={() => setActiveStep(idx)}
              >
                <div className="step-card-top">
                  <div className="step-badge-num">{step.num}</div>
                  <div className="step-icon-wrap">
                    <Icon size={20} />
                  </div>
                </div>

                <h3 className="step-card-title">{step.title}</h3>
                <span className="step-card-sub">{step.subtitle}</span>
                <p className="step-card-desc">{step.description}</p>

                {/* Bullets */}
                <ul className="step-details-list">
                  {step.details.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>

                <div className="step-preview-tag">
                  <span>{step.previewTag}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Bottom Banner */}
        <div className="hiw-bottom-banner glass-card">
          <div className="banner-content">
            <div className="banner-left">
              <ShieldCheck size={32} className="banner-shield" />
              <div>
                <h4 className="banner-title">Ready to verify your images through this pipeline?</h4>
                <p className="banner-sub">Test your own images with sub-second analysis (Video and audio coming soon).</p>
              </div>
            </div>
            <button 
              className="btn-primary"
              onClick={() => {
                const el = document.getElementById('studio');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Launch Studio</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .hiw-section {
          position: relative;
        }
        .hiw-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }
        .hiw-step-card {
          padding: 26px;
          border-radius: var(--radius-xl);
          background: #ffffff;
          border: 1px solid var(--border-card);
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
        }
        .hiw-step-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
        }
        .hiw-step-card.active-step {
          border-color: var(--cyan);
          background: #f0fdfa;
          box-shadow: 0 6px 25px rgba(6, 182, 212, 0.12);
        }
        .step-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .step-badge-num {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--cyan);
          background: rgba(6, 182, 212, 0.1);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(6, 182, 212, 0.25);
        }
        .step-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
        }
        .hiw-step-card.active-step .step-icon-wrap {
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          color: #ffffff;
        }
        .step-card-title {
          font-size: 1.25rem;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .step-card-sub {
          font-size: 0.8rem;
          color: #4f46e5;
          font-weight: 600;
          margin-bottom: 14px;
        }
        .step-card-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 18px;
        }
        .step-details-list {
          list-style: none;
          padding: 0;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .step-details-list li {
          font-size: 0.78rem;
          color: var(--text-secondary);
          position: relative;
          padding-left: 14px;
          line-height: 1.4;
        }
        .step-details-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--cyan);
        }
        .step-preview-tag {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: #0284c7;
          background: #f0f9ff;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(2, 132, 199, 0.2);
          width: fit-content;
        }

        /* Bottom Banner */
        .hiw-bottom-banner {
          padding: 24px 32px;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.06), rgba(6, 182, 212, 0.06));
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        .banner-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }
        .banner-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .banner-shield {
          color: var(--cyan);
          flex-shrink: 0;
        }
        .banner-title {
          font-size: 1.15rem;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .banner-sub {
          font-size: 0.88rem;
          color: var(--text-secondary);
        }

        @media (max-width: 992px) {
          .hiw-steps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
