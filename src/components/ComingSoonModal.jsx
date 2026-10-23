import React, { useEffect } from 'react';
import { X, Film, Mic, Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export function ComingSoonModal({ isOpen, onClose, type = 'video' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isVideo = type === 'video';

  const modalData = isVideo
    ? {
        icon: <Film size={36} className="modal-header-icon video" />,
        badge: 'Upcoming Feature',
        title: '🎬 Video Detection — Coming Soon',
        description:
          'Video deepfake detection will be available in a future update. We are working to bring this feature to TruthLens.',
        specsTitle: 'Engine In Development',
        specs: [
          'Temporal Optical Flow & Inter-Frame Boundary Jitter Scan',
          'SyncNet Audio-Visual Viseme-to-Phoneme Lip-Sync Alignment',
          'De-anonymized 120-Keyframe Hardware GOP Sequence Audit',
          'Automated Frame-by-Frame 68-Point Landmark Extraction'
        ],
        availableAlternative: 'Image deepfake detection is fully functional right now. You can extract individual frames from your video and upload them as JPG, PNG, or WEBP for instant multi-model forensics.'
      }
    : {
        icon: <Mic size={36} className="modal-header-icon audio" />,
        badge: 'Upcoming Feature',
        title: '🎙️ Audio Detection — Coming Soon',
        description:
          'Audio deepfake detection will be available in a future update. Stay tuned for upcoming features.',
        specsTitle: 'Engine In Development',
        specs: [
          'High-Frequency Mel-Spectrogram Vocoder Cutoff (>16kHz)',
          'Biological Laryngeal Pitch Jitter & Organic Glottal Pulse Checks',
          'Defense against Zero-Shot Voice Clones (ElevenLabs, VALL-E, RVC)',
          'Synthetic Room Acoustic Reverberation Discontinuity Scan'
        ],
        availableAlternative: 'Image forensics is active and fully functional. You can test synthetic faces, Midjourney/Flux portraits, and digital photo manipulations today.'
      };

  return (
    <div className="cs-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="cs-modal-title">
      <div className="cs-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Glow bar */}
        <div className={`cs-glow-bar ${isVideo ? 'video' : 'audio'}`} />

        {/* Close button */}
        <button className="cs-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="cs-header">
          <div className={`cs-icon-wrap ${isVideo ? 'video' : 'audio'}`}>
            {modalData.icon}
          </div>
          <div className="cs-badge-pill">
            <Clock size={12} />
            <span>{modalData.badge}</span>
          </div>
          <h2 id="cs-modal-title" className="cs-title">
            {modalData.title}
          </h2>
          <p className="cs-desc">
            {modalData.description}
          </p>
        </div>

        {/* Technical Specs Roadmap */}
        <div className="cs-specs-box">
          <div className="cs-specs-header">
            <Sparkles size={14} className="sparkle-icon" />
            <span>{modalData.specsTitle}</span>
          </div>
          <ul className="cs-specs-list">
            {modalData.specs.map((spec, i) => (
              <li key={i} className="cs-spec-item">
                <span className="bullet-dot" />
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Notice on Current Available Feature */}
        <div className="cs-tip-box">
          <ShieldCheck size={18} className="tip-icon" />
          <p>{modalData.availableAlternative}</p>
        </div>

        {/* Actions */}
        <div className="cs-footer">
          <button 
            className="btn-primary cs-action-btn"
            onClick={() => {
              onClose();
              const el = document.getElementById('studio');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Use Image Detection Now</span>
            <ArrowRight size={16} />
          </button>
          <button className="btn-secondary cs-close-text-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <style>{`
        .cs-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(11, 15, 25, 0.78);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: csFadeIn 0.25s ease-out;
        }

        @keyframes csFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .cs-modal-card {
          position: relative;
          width: 100%;
          max-width: 540px;
          background: #0f172a;
          color: #f8fafc;
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: var(--radius-xl, 24px);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.55), 0 0 40px rgba(99, 102, 241, 0.15);
          padding: 32px 28px 26px;
          overflow: hidden;
          animation: csSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes csSlideUp {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .cs-glow-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .cs-glow-bar.video {
          background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6);
          box-shadow: 0 0 16px rgba(99, 102, 241, 0.6);
        }

        .cs-glow-bar.audio {
          background: linear-gradient(90deg, #06b6d4, #3b82f6, #6366f1);
          box-shadow: 0 0 16px rgba(6, 182, 212, 0.6);
        }

        .cs-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.06);
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }

        .cs-close-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          transform: scale(1.05);
        }

        .cs-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 22px;
        }

        .cs-icon-wrap {
          width: 68px;
          height: 68px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .cs-icon-wrap.video {
          background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%);
          border: 1px solid rgba(99, 102, 241, 0.4);
          color: #818cf8;
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.25);
        }

        .cs-icon-wrap.audio {
          background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%);
          border: 1px solid rgba(6, 182, 212, 0.4);
          color: #38bdf8;
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.25);
        }

        .cs-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
          margin-bottom: 12px;
        }

        .cs-title {
          font-size: 1.45rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #ffffff;
          margin-bottom: 10px;
        }

        .cs-desc {
          font-size: 0.95rem;
          color: #cbd5e1;
          line-height: 1.55;
          max-width: 460px;
        }

        .cs-specs-box {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md, 14px);
          padding: 16px 18px;
          margin-bottom: 16px;
        }

        .cs-specs-header {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
          margin-bottom: 10px;
        }

        .sparkle-icon {
          color: #818cf8;
        }

        .cs-specs-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cs-spec-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.84rem;
          color: #e2e8f0;
          line-height: 1.4;
        }

        .bullet-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          margin-top: 6px;
          flex-shrink: 0;
        }

        .cs-tip-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: var(--radius-md, 14px);
          padding: 12px 16px;
          font-size: 0.82rem;
          color: #a7f3d0;
          line-height: 1.45;
          margin-bottom: 24px;
        }

        .tip-icon {
          color: #10b981;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .cs-footer {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cs-action-btn {
          flex: 1;
          padding: 11px 18px;
          font-size: 0.92rem;
        }

        .cs-close-text-btn {
          padding: 11px 20px;
          font-size: 0.92rem;
          background: rgba(255, 255, 255, 0.05);
          color: #cbd5e1;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .cs-close-text-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        @media (max-width: 560px) {
          .cs-modal-card {
            padding: 24px 18px 20px;
          }
          .cs-title {
            font-size: 1.25rem;
          }
          .cs-footer {
            flex-direction: column;
          }
          .cs-action-btn, .cs-close-text-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
