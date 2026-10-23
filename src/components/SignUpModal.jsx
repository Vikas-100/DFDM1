import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase,
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function SignUpModal({ isOpen, onClose, initialMode = 'signup', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'signup' | 'signin'
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('journalist');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
    setSuccessMessage('');
  }, [initialMode, isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
    if (score === 3) return { score: 3, label: 'Good', color: '#3b82f6' };
    return { score: 4, label: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid work or personal email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (mode === 'signup' && !agreeTerms) {
      setErrorMessage('Please agree to the ethical usage guidelines.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication / registration
    setTimeout(() => {
      setIsLoading(false);

      const userObject = {
        name: mode === 'signup' ? fullName.trim() : (email.split('@')[0] || 'Analyst'),
        email: email.trim().toLowerCase(),
        role: role,
        tier: 'Professional Analyst',
        monthlyScansLeft: 50,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };

      try {
        localStorage.setItem('truthlens_user', JSON.stringify(userObject));
      } catch (err) {
        // ignore localStorage errors
      }

      // Fire festive confetti upon account creation
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if confetti fails
      }

      setSuccessMessage(mode === 'signup' ? 'Account created successfully! Welcome to TruthLens.' : 'Welcome back!');
      
      if (onAuthSuccess) {
        onAuthSuccess(userObject);
      }

      setTimeout(() => {
        onClose();
      }, 1100);

    }, 800);
  };

  const handleQuickDemo = () => {
    const demoUser = {
      name: 'Sarah Chen',
      email: 'sarah.chen@forensics.org',
      role: 'investigative-journalist',
      tier: 'Verified Fact-Checker',
      monthlyScansLeft: 50,
      memberSince: 'Oct 2026'
    };
    try {
      localStorage.setItem('truthlens_user', JSON.stringify(demoUser));
    } catch (err) {}

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    setSuccessMessage('Signed in as Verified Analyst!');
    if (onAuthSuccess) onAuthSuccess(demoUser);
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="auth-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">
            <div className="auth-logo-icon">
              <ShieldCheck size={22} />
            </div>
            <div className="auth-brand-text">
              <span className="auth-title"><span className="auth-accent">DFD</span></span>
              <span className="auth-subtitle">Deepfake Detection Model</span>
            </div>
          </div>

          <h2 className="auth-heading">
            {mode === 'signup' ? 'Create Your Free Account' : 'Welcome Back'}
          </h2>
          <p className="auth-subtext">
            {mode === 'signup' 
              ? 'Access real-time Vision Transformer deepfake inference & certified media verification.' 
              : 'Sign in to access your forensic history, audit logs, and verified certificates.'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="auth-tabs">
            <button 
              type="button"
              className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setErrorMessage(''); }}
            >
              <Sparkles size={15} />
              <span>Sign Up Free</span>
            </button>
            <button 
              type="button"
              className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => { setMode('signin'); setErrorMessage(''); }}
            >
              <span>Sign In</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage ? (
          <div className="auth-alert success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        ) : null}

        {/* Error Alert */}
        {errorMessage ? (
          <div className="auth-alert error">
            <X size={18} />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name</label>
              <div className="input-wrap">
                <User size={18} className="input-icon" />
                <input 
                  id="auth-name"
                  type="text" 
                  placeholder="e.g. Elena Rostova" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Work or Personal Email</label>
            <div className="input-wrap">
              <Mail size={18} className="input-icon" />
              <input 
                id="auth-email"
                type="email" 
                placeholder="you@organization.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-role">Primary Use Case / Role</label>
              <div className="input-wrap">
                <Briefcase size={18} className="input-icon" />
                <select 
                  id="auth-role"
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="journalist">Fact-Checker & Investigative Journalist</option>
                  <option value="cybersecurity">Cybersecurity & Fraud Analyst</option>
                  <option value="researcher">Academic / AI Forensic Researcher</option>
                  <option value="creator">Digital Content Creator / Photographer</option>
                  <option value="legal">Legal, Compliance & Authentication Desk</option>
                  <option value="consumer">Everyday Media Verification</option>
                </select>
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="auth-password">Password</label>
              {mode === 'signin' && (
                <button 
                  type="button" 
                  className="link-btn" 
                  onClick={() => alert('Password reset instructions would be dispatched to your registered email in production.')}
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="input-wrap">
              <Lock size={18} className="input-icon" />
              <input 
                id="auth-password"
                type={showPassword ? 'text' : 'password'} 
                placeholder={mode === 'signup' ? 'Create a secure password (min 6 chars)' : 'Enter your password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                required
              />
              <button 
                type="button" 
                className="eye-toggle-btn" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength Indicator (Sign Up only) */}
            {mode === 'signup' && password.length > 0 && (
              <div className="strength-meter">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step} 
                      className="strength-bar"
                      style={{ 
                        background: step <= strength.score ? strength.color : '#e2e8f0' 
                      }} 
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {mode === 'signup' && (
            <label className="checkbox-wrap">
              <input 
                type="checkbox" 
                checked={agreeTerms} 
                onChange={(e) => setAgreeTerms(e.target.checked)} 
              />
              <span>
                I agree to the TruthLens <a href="#privacy" onClick={(e) => e.preventDefault()}>Ethical AI Guidelines</a> and <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>.
              </span>
            </label>
          )}

          {/* Primary Action Button */}
          <button 
            type="submit" 
            className="btn-primary auth-submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner" />
            ) : (
              <>
                <span>{mode === 'signup' ? 'Create Free Account' : 'Sign In'}</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Free Plan Perks Badge */}
        {mode === 'signup' && (
          <div className="auth-perks-banner">
            <div className="perk-item">
              <Check size={14} className="perk-icon" />
              <span>50 Free ViT Ensemble Scans / Mo</span>
            </div>
            <div className="perk-item">
              <Check size={14} className="perk-icon" />
              <span>SHA-256 Verifiable PDF Proofs</span>
            </div>
            <div className="perk-item">
              <Check size={14} className="perk-icon" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        )}

        {/* Quick Demo Sign In Shortcut */}
        <div className="auth-footer-note">
          <span>Testing the interface? </span>
          <button type="button" className="demo-sign-in-link" onClick={handleQuickDemo}>
            ⚡ Instant 1-Click Demo Login
          </button>
        </div>
      </div>

      <style>{`
        .auth-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: authFadeIn 0.25s ease-out;
        }

        .auth-modal-card {
          position: relative;
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 480px;
          padding: 36px 32px;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(226, 232, 240, 0.8);
          animation: authSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 90vh;
          overflow-y: auto;
        }

        .auth-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .auth-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
          transform: rotate(90deg);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .auth-brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .auth-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(79, 70, 229, 0.3);
        }

        .auth-brand-text {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .auth-title {
          font-family: var(--font-display, sans-serif);
          font-weight: 800;
          font-size: 1.15rem;
          color: #0f172a;
        }

        .auth-accent {
          color: #06b6d4;
        }

        .auth-subtitle {
          font-size: 0.62rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #64748b;
          font-weight: 600;
        }

        .auth-heading {
          font-family: var(--font-display, sans-serif);
          font-size: 1.55rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .auth-subtext {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.45;
          margin-bottom: 18px;
        }

        .auth-tabs {
          display: flex;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 4px;
          gap: 4px;
        }

        .auth-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .auth-tab-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .auth-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 16px;
          animation: authFadeIn 0.2s;
        }
        .auth-alert.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }
        .auth-alert.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .form-group label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #334155;
        }

        .label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .link-btn {
          background: none;
          border: none;
          color: #4f46e5;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .link-btn:hover {
          text-decoration: underline;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          pointer-events: none;
        }

        .input-wrap input,
        .input-wrap select {
          width: 100%;
          padding: 11px 14px 11px 42px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          font-size: 0.92rem;
          color: #0f172a;
          transition: all 0.2s;
          font-family: inherit;
        }

        .input-wrap input:focus,
        .input-wrap select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
        }

        .eye-toggle-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
        }
        .eye-toggle-btn:hover {
          color: #334155;
        }

        .strength-meter {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
        }

        .strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }

        .strength-bar {
          height: 4px;
          flex: 1;
          border-radius: 2px;
          transition: all 0.2s;
        }

        .strength-label {
          font-size: 0.75rem;
          font-weight: 600;
          min-width: 44px;
          text-align: right;
        }

        .checkbox-wrap {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.78rem;
          color: #64748b;
          cursor: pointer;
          user-select: none;
          line-height: 1.4;
        }

        .checkbox-wrap input {
          margin-top: 2px;
          accent-color: #4f46e5;
          width: 15px;
          height: 15px;
        }

        .checkbox-wrap a {
          color: #4f46e5;
          text-decoration: underline;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
          background: linear-gradient(135deg, #4f46e5, #06b6d4);
          color: #ffffff;
          border: none;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
        }

        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 0.8s linear infinite;
        }

        .auth-perks-banner {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 14px;
          margin-top: 18px;
        }

        .perk-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: #334155;
          font-weight: 500;
        }

        .perk-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        .auth-footer-note {
          text-align: center;
          font-size: 0.82rem;
          color: #64748b;
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
        }

        .demo-sign-in-link {
          background: none;
          border: none;
          color: #0284c7;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }
        .demo-sign-in-link:hover {
          color: #0369a1;
        }

        @keyframes authFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
