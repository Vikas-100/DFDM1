import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DetectionStudio } from './components/DetectionStudio';
import { DifferentTypes } from './components/DifferentTypes';
import { HowItWorks } from './components/HowItWorks';
import { UseCases } from './components/UseCases';
import { TrustFeatures } from './components/TrustFeatures';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { CertificateModal } from './components/CertificateModal';
import { ComingSoonModal } from './components/ComingSoonModal';
import { SignUpModal } from './components/SignUpModal';

export default function App() {
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [activeCertResult, setActiveCertResult] = useState(null);
  const [activeCertHash, setActiveCertHash] = useState('');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('truthlens_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'signup' // 'signup' | 'signin'
  });

  // Coming Soon Notification / Modal State for upcoming Video & Audio features
  const [comingSoonModal, setComingSoonModal] = useState({
    isOpen: false,
    type: 'video' // 'video' | 'audio'
  });

  const [selectedModality, setSelectedModality] = useState('image');

  const handleOpenCertificate = (result, hash) => {
    setActiveCertResult(result);
    setActiveCertHash(hash);
    setCertModalOpen(true);
  };

  const handleOpenComingSoon = (type = 'video') => {
    setComingSoonModal({
      isOpen: true,
      type
    });
  };

  const handleCloseComingSoon = () => {
    setComingSoonModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleOpenAuth = (mode = 'signup') => {
    setAuthModal({
      isOpen: true,
      mode
    });
  };

  const handleCloseAuth = () => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('truthlens_user');
    } catch {}
    setCurrentUser(null);
  };

  const handleSelectModality = (type) => {
    if (type === 'video' || type === 'audio') {
      handleOpenComingSoon(type);
      return;
    }
    setSelectedModality('image');
    const el = document.getElementById('studio');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      {/* Top Navigation */}
      <Navbar 
        onOpenComingSoon={handleOpenComingSoon}
        onOpenAuth={handleOpenAuth}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Hero with Real vs Fake Split Comparison Slider */}
      <Hero 
        onOpenComingSoon={handleOpenComingSoon}
        onOpenAuth={handleOpenAuth}
      />

      {/* Different Deepfake Detection Online Cards */}
      <DifferentTypes 
        onSelectType={handleSelectModality} 
        onOpenComingSoon={handleOpenComingSoon}
      />

      {/* Interactive Core Detection Studio (Image Only - Video & Audio marked Coming Soon) */}
      <DetectionStudio 
        onGenerateCertificate={handleOpenCertificate} 
        selectedModality={selectedModality}
        onOpenComingSoon={handleOpenComingSoon}
      />

      {/* How It Works (Step-by-step pipeline) */}
      <HowItWorks onOpenComingSoon={handleOpenComingSoon} />

      {/* Real-World Use Cases (Teachers, Journalists, Creators, Families) */}
      <UseCases />

      {/* Why Thousands Trust Our Deepfake Detection Tool */}
      <TrustFeatures />

      {/* Testimonials Carousel */}
      <Testimonials />

      {/* Frequently Asked Questions */}
      <FAQ />

      {/* Pre-Footer Banner & Main Footer */}
      <Footer 
        onOpenComingSoon={handleOpenComingSoon}
        onOpenAuth={handleOpenAuth}
      />

      {/* Official Forensic Certificate Modal */}
      <CertificateModal 
        isOpen={certModalOpen} 
        onClose={() => setCertModalOpen(false)}
        result={activeCertResult}
        sha256Hash={activeCertHash}
      />

      {/* Dedicated Upcoming Video & Audio Detection Coming Soon Modal */}
      <ComingSoonModal 
        isOpen={comingSoonModal.isOpen}
        onClose={handleCloseComingSoon}
        type={comingSoonModal.type}
      />

      {/* User Authentication / Sign Up Modal */}
      <SignUpModal
        isOpen={authModal.isOpen}
        onClose={handleCloseAuth}
        initialMode={authModal.mode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

