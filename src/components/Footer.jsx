import React from 'react';
import { ShieldCheck, ArrowRight, Activity, Globe, ExternalLink } from 'lucide-react';

export function Footer({ onOpenComingSoon, onOpenAuth }) {
  return (
    <footer className="footer-wrap">
      {/* Pre-Footer CTA Banner matching reference image */}
      <div className="container">
        <div className="pre-footer-banner glass-card">
          <div className="cta-banner-content">
            <h2 className="cta-banner-title">
              Free Online Deepfake Detection <br className="hide-mobile" />
              at Your Fingertips
            </h2>
            <p className="cta-banner-sub">
              Upload any image, video, or audio file to detect AI manipulations with 99.4% precision in seconds.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn-primary cta-banner-btn"
                onClick={() => {
                  const el = document.getElementById('studio');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Start Verifying Media Free</span>
                <ArrowRight size={18} />
              </button>
              <button 
                className="btn-secondary cta-banner-btn"
                style={{ background: 'rgba(255, 255, 255, 0.9)', color: '#0f172a' }}
                onClick={() => onOpenAuth?.('signup')}
              >
                <span>Sign Up for Free Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="main-footer">
        <div className="container">
          <div className="footer-grid">
            {/* Col 1: Brand */}
            <div className="footer-brand-col">
              <a href="#" className="nav-logo" style={{ marginBottom: '14px' }}>
                <div className="logo-icon-wrap" style={{ width: '36px', height: '36px' }}>
                  <ShieldCheck size={20} />
                </div>
                <div className="logo-text-group">
                  <span className="logo-title" style={{ fontSize: '1.3rem' }}>
                    <span style={{ color: 'var(--cyan)', fontWeight: 800, textShadow: '0 0 16px rgba(6, 182, 212, 0.25)' }}>DFD</span>
                  </span>
                  <span className="logo-subtitle">Deepfake Detection Model</span>
                </div>
              </a>
              <p className="footer-bio">
                DFD is an enterprise-grade media forensics platform dedicated to defending truth, identity, and trust in the era of generative synthetic media.
              </p>
              <div className="footer-status-pill">
                <span className="status-indicator-dot" />
                <span>All Forensic Ensembles Operational (99.98% Uptime)</span>
              </div>
            </div>

            {/* Col 2: Detection Tech */}
            <div className="footer-links-col">
              <h4 className="footer-col-title">Detection Engines</h4>
              <ul className="footer-nav-list">
                <li><a href="#detection-types">AI Face Swap Detector</a></li>
                <li><a href="#detection-types">Diffusion Model Scanner (Flux/Midjourney)</a></li>
                <li><a href="#detection-types">Viral Video Temporal Forensics</a></li>
                <li><a href="#detection-types">Synthetic Audio & Voice Clone</a></li>
                <li><a href="#how-it-works">Error Level Analysis (ELA) Engine</a></li>
                <li><a href="#how-it-works">2D FFT Frequency Lattice Scanner</a></li>
              </ul>
            </div>

            {/* Col 3: Use Cases */}
            <div className="footer-links-col">
              <h4 className="footer-col-title">Applications</h4>
              <ul className="footer-nav-list">
                <li><a href="#use-cases">Journalism & Fact-Checking Desks</a></li>
                <li><a href="#use-cases">Archival & Historical Image Verification</a></li>
                <li><a href="#use-cases">Creator Likeness & DMCA Protection</a></li>
                <li><a href="#use-cases">Family Voice Scam Call Defense</a></li>
                <li><a href="#studio">Automated Batch API Screening</a></li>
              </ul>
            </div>

            {/* Col 4: Trust & Standards */}
            <div className="footer-links-col">
              <h4 className="footer-col-title">Trust & Compliance</h4>
              <ul className="footer-nav-list">
                <li><a href="#faq">Zero-Knowledge Privacy Policy</a></li>
                <li><a href="#faq">C2PA Coalition Compatibility</a></li>
                <li><a href="#faq">ISO/IEC 27001 Certified Labs</a></li>
                <li><a href="#faq">Media Verification Methodology</a></li>
                <li><a href="#faq">API Developer Documentation</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p className="copyright-text">
              © {new Date().getFullYear()} DFD Technologies Inc. All rights reserved. Built for digital integrity.
            </p>
            <div className="footer-legal-links">
              <a href="#">Privacy Protocol</a>
              <span>•</span>
              <a href="#">Terms of Verification</a>
              <span>•</span>
              <a href="#">Security Disclosure</a>
              <span>•</span>
              <a href="#">Status</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrap {
          margin-top: 60px;
          border-top: 1px solid var(--border-card);
          background: #f8fafc;
        }
        .pre-footer-banner {
          margin-top: -60px;
          margin-bottom: 60px;
          padding: 60px 40px;
          border-radius: var(--radius-xl);
          background: linear-gradient(135deg, #4f46e5 0%, #2563eb 50%, #06b6d4 100%);
          border: 1px solid rgba(79, 70, 229, 0.2);
          text-align: center;
          box-shadow: 0 20px 45px rgba(79, 70, 229, 0.25);
        }
        .cta-banner-content {
          max-width: 720px;
          margin: 0 auto;
        }
        .cta-banner-title {
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 16px;
        }
        .cta-banner-sub {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 28px;
          line-height: 1.6;
        }
        .cta-banner-btn {
          padding: 16px 36px;
          font-size: 1.05rem;
          background: #ffffff;
          color: #4f46e5;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
        .cta-banner-btn:hover {
          background: #f8fafc;
          color: #3730a3;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }
        .main-footer {
          padding: 60px 0 30px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 50px;
        }
        .footer-bio {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 18px;
          max-width: 340px;
        }
        .footer-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          font-size: 0.75rem;
          color: #059669;
          font-family: var(--font-mono);
        }
        .status-indicator-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }
        .footer-col-title {
          font-size: 0.95rem;
          font-family: var(--font-display);
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 18px;
          letter-spacing: 0.02em;
        }
        .footer-nav-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-nav-list a {
          font-size: 0.85rem;
          color: var(--text-secondary);
          transition: color 0.2s ease;
        }
        .footer-nav-list a:hover {
          color: var(--cyan);
        }
        .footer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.07);
          flex-wrap: wrap;
          gap: 16px;
        }
        .copyright-text {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .footer-legal-links {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .footer-legal-links a:hover {
          color: var(--text-primary);
        }
        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .pre-footer-banner {
            padding: 40px 20px;
          }
        }
      `}</style>
    </footer>
  );
}
