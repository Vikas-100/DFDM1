import React, { useState } from 'react';
import { FAQ_DATA } from '../data/faqs';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="faq-section section-padding">
      <div className="container">
        <div className="section-header">
          <div className="badge-pill" style={{ marginBottom: '14px' }}>
            <HelpCircle size={14} />
            <span>Common Questions</span>
          </div>
          <h2>Frequently Asked Questions</h2>
          <p>
            Learn about deepfake forensic science, neural detection architectures, privacy protocols, and media verification accuracy.
          </p>
        </div>

        <div className="faq-accordion-wrap">
          {FAQ_DATA.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className={`faq-item glass-card ${isOpen ? 'open' : ''}`}
              >
                <button 
                  className="faq-question-btn"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{item.question}</span>
                  <ChevronDown className={`chevron-icon ${isOpen ? 'rotate' : ''}`} size={18} />
                </button>
                {isOpen && (
                  <div className="faq-answer-pane">
                    <p className="faq-answer-text">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .faq-section {
          position: relative;
        }
        .faq-accordion-wrap {
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .faq-item {
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid var(--border-card);
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
          transition: all 0.2s ease;
        }
        .faq-item:hover {
          border-color: rgba(99, 102, 241, 0.35);
        }
        .faq-item.open {
          border-color: rgba(6, 182, 212, 0.4);
          background: #ffffff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
        }
        .faq-question-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          text-align: left;
          color: #0f172a;
        }
        .faq-question-text {
          font-size: 1.05rem;
          font-weight: 600;
          font-family: var(--font-display);
          line-height: 1.4;
          padding-right: 16px;
        }
        .chevron-icon {
          color: var(--cyan);
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }
        .chevron-icon.rotate {
          transform: rotate(180deg);
        }
        .faq-answer-pane {
          padding: 0 24px 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        .faq-answer-text {
          padding-top: 14px;
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }
      `}</style>
    </section>
  );
}
