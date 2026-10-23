import React, { useState } from 'react';
import { TESTIMONIALS } from '../data/testimonials';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle } from 'lucide-react';

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="testimonials-section section-padding">
      <div className="container">
        <div className="testimonial-wrapper">
          <button className="carousel-nav-btn prev" onClick={prev} aria-label="Previous testimonial">
            <ChevronLeft size={22} />
          </button>

          <div className="testimonial-card glass-card">
            <div className="quote-icon-wrap">
              <Quote size={28} />
            </div>

            <p className="testimonial-quote">"{current.quote}"</p>

            {/* Author info */}
            <div className="author-row">
              <img src={current.avatar} alt={current.author} className="author-avatar" />
              <div className="author-details">
                <div className="author-name-line">
                  <span className="author-name">{current.author}</span>
                  {current.verified && (
                    <span className="verified-badge">
                      <CheckCircle size={13} />
                      <span>Verified Analyst</span>
                    </span>
                  )}
                </div>
                <span className="author-role">{current.role}</span>
              </div>
            </div>

            {/* Stars */}
            <div className="testimonial-stars">
              {[...Array(current.stars)].map((_, i) => (
                <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>

            {/* Dots */}
            <div className="carousel-dots">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`dot-indicator ${i === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <button className="carousel-nav-btn next" onClick={next} aria-label="Next testimonial">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      <style>{`
        .testimonials-section {
          position: relative;
        }
        .testimonial-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          max-width: 880px;
          margin: 0 auto;
        }
        .carousel-nav-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid var(--border-card);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .carousel-nav-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: rgba(0, 0, 0, 0.15);
          transform: scale(1.05);
        }
        .testimonial-card {
          padding: 40px;
          border-radius: var(--radius-xl);
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          width: 100%;
        }
        .quote-icon-wrap {
          color: var(--cyan);
          opacity: 0.8;
          margin-bottom: 20px;
        }
        .testimonial-quote {
          font-size: clamp(1.05rem, 1.8vw, 1.25rem);
          color: #1e293b;
          line-height: 1.7;
          margin-bottom: 28px;
          font-style: italic;
          max-width: 680px;
        }
        .author-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }
        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--cyan);
        }
        .author-details {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .author-name-line {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .author-name {
          font-weight: 700;
          color: #0f172a;
          font-size: 1rem;
        }
        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #059669;
          background: rgba(16, 185, 129, 0.1);
          padding: 2px 6px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(16, 185, 129, 0.25);
        }
        .author-role {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .testimonial-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 24px;
        }
        .carousel-dots {
          display: flex;
          gap: 8px;
        }
        .dot-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }
        .dot-indicator.active {
          width: 24px;
          border-radius: 4px;
          background: var(--cyan);
        }
        @media (max-width: 640px) {
          .testimonial-wrapper {
            flex-direction: column;
          }
          .testimonial-card {
            padding: 24px 20px;
          }
          .carousel-nav-btn {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
