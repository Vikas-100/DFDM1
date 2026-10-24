import React, { useEffect } from 'react';
import { 
  ShieldCheck, 
  X, 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  QrCode, 
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function CertificateModal({ isOpen, onClose, result, sha256Hash }) {
  useEffect(() => {
    if (isOpen && result && !result.isFake) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if confetti fails
      }
    }
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const certId = `VM-${result.id ? result.id.replace('preset-', '').toUpperCase() : 'AUTH'}-${(sha256Hash || result.fileInfo?.sha256 || 'VERIFY').slice(0, 6).toUpperCase()}`;
  const dateStr = result.timestamp ? new Date(result.timestamp).toUTCString() : 'Verification Session';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert('Verification link copied to clipboard!');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Certificate Printable Document */}
        <div className="certificate-document" id="printable-cert">
          {/* Certificate Header */}
          <div className="cert-header">
            <div className="cert-brand">
              <div className="cert-logo-icon">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h2 className="cert-brand-title">TRUTHLENS AI LABS</h2>
                <span className="cert-brand-sub">Digital Media Forensics & Biometric Authentication Protocol</span>
              </div>
            </div>
            <div className="cert-id-tag">
              <span className="id-label">CERTIFICATE ID</span>
              <span className="id-value">{certId}</span>
            </div>
          </div>

          <div className="cert-divider" />

          {/* Title Banner */}
          <div className="cert-title-area">
            <h1 className="cert-main-title">FORENSIC MEDIA VERIFICATION AUDIT</h1>
            <p className="cert-date">ISSUED ON: {dateStr} • UTC PROTOCOL v3.4</p>
          </div>

          {/* Verdict Highlight */}
          <div className={`cert-verdict-box ${result.isInconclusive ? 'inconclusive' : result.isFake ? 'fake' : 'real'}`}>
            <div className="verdict-icon-wrap">
              {result.isInconclusive ? <AlertTriangle size={32} /> : result.isFake ? <AlertTriangle size={32} /> : <CheckCircle size={32} />}
            </div>
            <div className="verdict-details">
              <span className="verdict-pre">FORENSIC DETERMINATION:</span>
              <h3 className="verdict-headline">{result.verdict}</h3>
              <p className="verdict-subtext">{result.technicalSummary}</p>
            </div>
            <div className="verdict-score-seal">
              <span className="seal-num">
                {result.isInconclusive
                  ? (result.confidenceScore || Math.max(result.authenticityScore, result.deepfakeProbability))
                  : result.isFake 
                  ? (result.deepfakeProbability || (100 - result.authenticityScore).toFixed(1)) 
                  : result.authenticityScore}%
              </span>
              <span className="seal-txt">{result.isInconclusive ? 'CONFIDENCE SCORE' : result.isFake ? 'MANIPULATION PROBABILITY' : 'AUTHENTICITY INDEX'}</span>
            </div>
          </div>

          {/* Media Telemetry Grid */}
          <div className="cert-grid">
            <div className="cert-data-group">
              <span className="cert-label">SUBJECT FILE NAME:</span>
              <span className="cert-val">{result.name}</span>
            </div>
            <div className="cert-data-group">
              <span className="cert-label">MEDIA MODALITY:</span>
              <span className="cert-val">{result.type.toUpperCase()} ARCHIVE STREAM</span>
            </div>
            <div className="cert-data-group">
              <span className="cert-label">AUTHENTICITY RATING:</span>
              <span className="cert-val" style={{ color: result.isFake ? '#dc2626' : '#059669', fontWeight: '700' }}>
                {result.authenticityScore}% {result.isFake ? '[CRITICAL ANOMALY]' : '[VERIFIED GENUINE]'}
              </span>
            </div>
            <div className="cert-data-group">
              <span className="cert-label">DEEPFAKE / AI RISK:</span>
              <span className="cert-val" style={{ color: result.isFake ? '#dc2626' : '#059669', fontWeight: '700' }}>
                {result.deepfakeProbability || (100 - result.authenticityScore).toFixed(1)}% {result.isFake ? '[MANIPULATION DETECTED]' : '[CLEAN SENSOR PASS]'}
              </span>
            </div>
            <div className="cert-data-group full-width">
              <span className="cert-label">CRYPTOGRAPHIC SHA-256 HASH:</span>
              <span className="cert-val mono">{sha256Hash}</span>
            </div>
            <div className="cert-data-group full-width">
              <span className="cert-label">ESTIMATED CAPTURE HARDWARE / SYNTHETIC ENGINE:</span>
              <span className="cert-val highlight">{result.estimatedSource}</span>
            </div>
          </div>

          {/* Models Breakdown */}
          <div className="cert-submodels">
            <h4 className="submodels-title">PARALLEL NEURAL MODEL ENSEMBLE AUDIT</h4>
            <div className="submodels-row">
              <div className="submodel-item">
                <span className="sub-name">Spatial Feature ResNet</span>
                <span className="sub-score">{result.modelConfidence?.spatial}%</span>
              </div>
              <div className="submodel-item">
                <span className="sub-name">2D Fourier FFT Lattice</span>
                <span className="sub-score">{result.modelConfidence?.frequency}%</span>
              </div>
              <div className="submodel-item">
                <span className="sub-name">Biometric Facial Mesh</span>
                <span className="sub-score">{result.modelConfidence?.biometric}%</span>
              </div>
              <div className="submodel-item">
                <span className="sub-name">C2PA Provenance Signature</span>
                <span className="sub-score">{result.modelConfidence?.provenance}%</span>
              </div>
            </div>
          </div>

          {/* Manipulation Audit Log */}
          <div className="cert-audit-log">
            <h4 className="audit-title">IDENTIFIED ANOMALIES & FORENSIC OBSERVATIONS</h4>
            <div className="audit-items">
              {result.manipulationFeatures?.map((item, i) => (
                <div key={i} className="audit-row">
                  <span className={`audit-badge ${item.severity}`}>[{item.status}]</span>
                  <span className="audit-item-title">{item.feature}:</span>
                  <span className="audit-item-detail">{item.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures & QR Code */}
          <div className="cert-footer">
            <div className="cert-qr-block">
              <div className="qr-box">
                <QrCode size={54} />
              </div>
              <div className="qr-text">
                <span>Scan to Verify Online</span>
                <span className="qr-meta">SHA-256 Validated</span>
              </div>
            </div>

            <div className="cert-signatures">
              <div className="signature-box">
                <div className="signature-line" />
                <span className="signer-title">Chief Forensics Scientist</span>
                <span className="signer-org">TruthLens Autonomous Engine</span>
              </div>
              <div className="signature-box">
                <div className="signature-line" />
                <span className="signer-title">Cryptographic Seal</span>
                <span className="signer-org">C2PA Certified Audit Standard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="modal-actions-bar">
          <button className="btn-secondary" onClick={handleCopyLink}>
            <Copy size={16} />
            <span>Copy Link</span>
          </button>
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          overflow-y: auto;
        }
        .modal-container {
          position: relative;
          width: 100%;
          max-width: 820px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: var(--radius-xl);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f1f5f9;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        .modal-close-btn:hover {
          color: #0f172a;
          background: #e2e8f0;
        }
        .certificate-document {
          padding: 36px 40px;
          overflow-y: auto;
          background: #ffffff;
          color: #0f172a;
        }
        .cert-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .cert-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .cert-logo-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }
        .cert-brand-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #0f172a;
        }
        .cert-brand-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .cert-id-tag {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-family: var(--font-mono);
        }
        .id-label {
          font-size: 0.65rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
        }
        .id-value {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--cyan);
        }
        .cert-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
          margin: 20px 0;
        }
        .cert-title-area {
          text-align: center;
          margin-bottom: 24px;
        }
        .cert-main-title {
          font-size: 1.5rem;
          letter-spacing: 0.08em;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .cert-date {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }
        .cert-verdict-box {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 18px 24px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          border: 1px solid transparent;
        }
        .cert-verdict-box.fake {
          background: rgba(239, 68, 68, 0.06);
          border-color: rgba(239, 68, 68, 0.3);
        }
        .cert-verdict-box.fake .verdict-icon-wrap { color: #ef4444; }
        .cert-verdict-box.fake .verdict-headline { color: #dc2626; }
        .cert-verdict-box.fake .seal-num { color: #ef4444; }

        .cert-verdict-box.inconclusive {
          background: rgba(245, 158, 11, 0.08);
          border-color: rgba(245, 158, 11, 0.35);
        }
        .cert-verdict-box.inconclusive .verdict-icon-wrap { color: #d97706; }
        .cert-verdict-box.inconclusive .verdict-headline { color: #b45309; }
        .cert-verdict-box.inconclusive .seal-num { color: #d97706; }

        .cert-verdict-box.real {
          background: rgba(16, 185, 129, 0.06);
          border-color: rgba(16, 185, 129, 0.3);
        }
        .cert-verdict-box.real .verdict-icon-wrap { color: #10b981; }
        .cert-verdict-box.real .verdict-headline { color: #059669; }
        .cert-verdict-box.real .seal-num { color: #10b981; }

        .verdict-details {
          flex: 1;
        }
        .verdict-pre {
          font-size: 0.7rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          letter-spacing: 0.08em;
        }
        .verdict-headline {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          margin: 2px 0 4px;
        }
        .verdict-subtext {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }
        .verdict-score-seal {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-left: 20px;
          border-left: 1px solid rgba(0, 0, 0, 0.1);
          min-width: 110px;
        }
        .seal-num {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 800;
        }
        .seal-txt {
          font-size: 0.58rem;
          color: var(--text-muted);
          text-align: center;
          letter-spacing: 0.05em;
        }

        /* Grid */
        .cert-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          background: #f8fafc;
          border: 1px solid var(--border-card);
          padding: 16px;
          border-radius: var(--radius-md);
          margin-bottom: 22px;
        }
        .cert-data-group {
          display: flex;
          flex-direction: column;
        }
        .cert-data-group.full-width {
          grid-column: span 2;
        }
        .cert-label {
          font-size: 0.68rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          margin-bottom: 2px;
        }
        .cert-val {
          font-size: 0.85rem;
          font-weight: 600;
          color: #0f172a;
        }
        .cert-val.mono {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #0284c7;
          word-break: break-all;
        }
        .cert-val.highlight {
          color: #4f46e5;
        }

        /* Submodels */
        .cert-submodels {
          margin-bottom: 22px;
        }
        .submodels-title {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .submodels-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .submodel-item {
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          background: #f8fafc;
          border: 1px solid var(--border-card);
          display: flex;
          flex-direction: column;
        }
        .sub-name {
          font-size: 0.68rem;
          color: var(--text-secondary);
        }
        .sub-score {
          font-family: var(--font-mono);
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          margin-top: 4px;
        }

        /* Audit */
        .cert-audit-log {
          margin-bottom: 26px;
        }
        .audit-title {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .audit-items {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .audit-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-size: 0.78rem;
        }
        .audit-badge {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .audit-badge.critical { color: #dc2626; }
        .audit-badge.warning { color: #d97706; }
        .audit-badge.safe { color: #059669; }
        .audit-item-title {
          color: #0f172a;
          font-weight: 600;
          flex-shrink: 0;
        }
        .audit-item-detail {
          color: var(--text-secondary);
        }

        /* Footer */
        .cert-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }
        .cert-qr-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .qr-box {
          background: #f1f5f9;
          color: #000000;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .qr-text {
          display: flex;
          flex-direction: column;
          font-size: 0.75rem;
        }
        .qr-meta {
          font-size: 0.65rem;
          color: var(--cyan);
          font-family: var(--font-mono);
        }
        .cert-signatures {
          display: flex;
          gap: 24px;
        }
        .signature-box {
          display: flex;
          flex-direction: column;
          width: 140px;
        }
        .signature-line {
          height: 1px;
          background: rgba(0, 0, 0, 0.2);
          margin-bottom: 6px;
        }
        .signer-title {
          font-size: 0.72rem;
          font-weight: 600;
          color: #0f172a;
        }
        .signer-org {
          font-size: 0.62rem;
          color: var(--text-muted);
        }

        .modal-actions-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 24px;
          background: #f8fafc;
          border-top: 1px solid var(--border-card);
        }

        @media (max-width: 768px) {
          .certificate-document {
            padding: 24px 16px;
          }
          .cert-verdict-box {
            flex-direction: column;
            text-align: center;
          }
          .verdict-score-seal {
            border-left: none;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: 12px 0 0;
          }
          .submodels-row {
            grid-template-columns: 1fr 1fr;
          }
          .cert-footer {
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}
