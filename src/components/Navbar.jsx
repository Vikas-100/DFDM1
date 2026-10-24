import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Layers, 
  HelpCircle, 
  Menu, 
  X, 
  UserPlus, 
  LogIn, 
  LogOut, 
  CheckCircle, 
  ChevronDown
} from 'lucide-react';

export function Navbar({ onOpenStudio, onOpenComingSoon: _onOpenComingSoon, onOpenAuth, currentUser, onSignOut }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'TL';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <nav className="navbar">
          {/* Logo */}
          <a href="#" className="nav-logo">
            <div className="logo-icon-wrap">
              <ShieldCheck className="logo-icon" size={24} />
              <div className="logo-glow" />
            </div>
            <div className="logo-text-group">
              <span className="logo-title">
                <span className="logo-accent">DFD</span>
              </span>
              <span className="logo-subtitle">Deepfake Detection Model</span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="nav-links">
            <a href="#studio" className="nav-link" onClick={() => onOpenStudio?.()}>
              <Cpu size={16} />
              <span>Detection Studio</span>
            </a>
            <a href="#how-it-works" className="nav-link">
              <Layers size={16} />
              <span>How It Works</span>
            </a>
            <a href="#detection-types" className="nav-link">
              <Sparkles size={16} />
              <span>Detection Online</span>
            </a>
            <a href="#use-cases" className="nav-link">
              <span>Use Cases</span>
            </a>
            <a href="#faq" className="nav-link">
              <HelpCircle size={16} />
              <span>FAQ</span>
            </a>
          </div>

          {/* Nav Actions */}
          <div className="nav-actions">
            <div className="live-status-pill">
              <span className="live-dot" />
              <span>Dual-ViT Live</span>
            </div>

            {currentUser ? (
              /* Signed-in user profile with dropdown */
              <div className="user-profile-menu-wrap" ref={dropdownRef}>
                <button 
                  className="user-profile-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  aria-label="User Account Menu"
                >
                  <div className="user-avatar-circle">
                    {getInitials(currentUser.name)}
                  </div>
                  <div className="user-info-text">
                    <span className="user-display-name">{currentUser.name}</span>
                    <span className="user-tier-tag">50 Scans Free</span>
                  </div>
                  <ChevronDown size={14} className={`dropdown-chevron ${profileDropdownOpen ? 'open' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="user-dropdown-card">
                    <div className="user-dropdown-header">
                      <div className="dropdown-avatar-large">
                        {getInitials(currentUser.name)}
                      </div>
                      <div className="dropdown-user-details">
                        <span className="dropdown-user-name">{currentUser.name}</span>
                        <span className="dropdown-user-email">{currentUser.email}</span>
                        <div className="dropdown-role-badge">
                          <CheckCircle size={12} />
                          <span>{currentUser.tier || 'Verified Analyst'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-quota-block">
                      <div className="quota-header">
                        <span>Monthly Scans Remaining</span>
                        <span className="quota-number">{currentUser.monthlyScansLeft || 50} / 50</span>
                      </div>
                      <div className="quota-track">
                        <div className="quota-bar" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <div className="dropdown-actions">
                      <button 
                        className="dropdown-action-btn"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          const el = document.getElementById('studio');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <Cpu size={15} />
                        <span>Run New Forensic Scan</span>
                      </button>
                      <button 
                        className="dropdown-action-btn danger"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onSignOut?.();
                        }}
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not signed in: Sign In & Sign Up buttons */
              <div className="auth-btn-group">
                <button 
                  type="button"
                  className="nav-signin-link"
                  onClick={() => onOpenAuth?.('signin')}
                >
                  <LogIn size={15} />
                  <span>Sign In</span>
                </button>

                <button 
                  type="button"
                  className="btn-primary nav-signup-cta"
                  onClick={() => onOpenAuth?.('signup')}
                >
                  <UserPlus size={16} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            <button 
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu glass-card">
            <a href="#studio" onClick={() => setMobileMenuOpen(false)}>Detection Studio</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#detection-types" onClick={() => setMobileMenuOpen(false)}>Detection Types</a>
            <a href="#use-cases" onClick={() => setMobileMenuOpen(false)}>Use Cases</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            
            {currentUser ? (
              <div className="mobile-auth-section">
                <div className="mobile-user-card">
                  <div className="user-avatar-circle">{getInitials(currentUser.name)}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                  </div>
                </div>
                <button 
                  className="btn-secondary"
                  style={{ width: '100%', marginTop: '8px' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignOut?.();
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="mobile-auth-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth?.('signup');
                  }}
                >
                  <UserPlus size={16} />
                  <span>Sign Up Free</span>
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ width: '100%' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth?.('signin');
                  }}
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid var(--border-card);
        }
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 76px;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .logo-icon-wrap {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 0 16px rgba(79, 70, 229, 0.25);
        }
        .logo-glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
          opacity: 0.7;
          pointer-events: none;
        }
        .logo-text-group {
          display: flex;
          flex-direction: column;
        }
        .logo-title {
          font-family: var(--font-display, sans-serif);
          font-weight: 800;
          font-size: 1.35rem;
          letter-spacing: 0.02em;
          line-height: 1.1;
        }
        .logo-accent {
          color: var(--cyan, #06b6d4);
          font-weight: 800;
          text-shadow: 0 0 16px rgba(6, 182, 212, 0.25);
        }
        .logo-subtitle {
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted, #64748b);
          font-weight: 600;
          white-space: nowrap;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--text-secondary, #475569);
          font-size: 0.92rem;
          font-weight: 500;
          padding: 6px 0;
          position: relative;
          text-decoration: none;
          transition: color 0.15s;
        }
        .nav-link:hover {
          color: #0f172a;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .live-status-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: var(--radius-full, 9999px);
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          font-size: 0.78rem;
          font-weight: 600;
          color: #059669;
          font-family: var(--font-mono, monospace);
        }
        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: pulseSlow 2s infinite;
        }
        .auth-btn-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-signin-link {
          background: none;
          border: none;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-signin-link:hover {
          color: #0f172a;
          background: #f1f5f9;
        }
        .nav-signup-cta {
          padding: 9px 18px;
          font-size: 0.88rem;
          font-weight: 600;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          color: #ffffff;
          border: none;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-signup-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(79, 70, 229, 0.35);
        }

        /* User Profile Menu */
        .user-profile-menu-wrap {
          position: relative;
        }
        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 30px;
          padding: 4px 12px 4px 4px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .user-profile-btn:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        .user-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.78rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-info-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .user-display-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #0f172a;
          line-height: 1.1;
        }
        .user-tier-tag {
          font-size: 0.68rem;
          color: #059669;
          font-weight: 600;
        }
        .dropdown-chevron {
          color: #64748b;
          transition: transform 0.2s;
        }
        .dropdown-chevron.open {
          transform: rotate(180deg);
        }

        .user-dropdown-card {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 270px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(226, 232, 240, 0.8);
          padding: 16px;
          z-index: 200;
          animation: authSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .user-dropdown-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f1f5f9;
        }
        .dropdown-avatar-large {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dropdown-user-details {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .dropdown-user-name {
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-user-email {
          font-size: 0.75rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dropdown-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #059669;
          font-weight: 600;
          margin-top: 3px;
        }
        .dropdown-quota-block {
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .quota-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.74rem;
          color: #64748b;
          margin-bottom: 6px;
        }
        .quota-number {
          font-weight: 700;
          color: #0f172a;
        }
        .quota-track {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }
        .quota-bar {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #06b6d4);
          border-radius: 3px;
        }
        .dropdown-actions {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding-top: 10px;
        }
        .dropdown-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #334155;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
        }
        .dropdown-action-btn:hover {
          background: #f8fafc;
          color: #0f172a;
        }
        .dropdown-action-btn.danger {
          color: #ef4444;
        }
        .dropdown-action-btn.danger:hover {
          background: #fef2f2;
        }

        .mobile-toggle {
          display: none;
          color: var(--text-primary, #0f172a);
          background: none;
          border: none;
          padding: 6px;
          cursor: pointer;
        }
        .mobile-menu {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 20px;
          margin-bottom: 16px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        .mobile-menu a {
          font-size: 1rem;
          font-weight: 500;
          padding: 8px 0;
          color: #0f172a;
          text-decoration: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        .mobile-user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 12px;
        }
        @media (max-width: 992px) {
          .nav-links, .live-status-pill, .auth-btn-group, .user-profile-menu-wrap {
            display: none;
          }
          .mobile-toggle {
            display: block;
          }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
      `}</style>
    </header>
  );
}
