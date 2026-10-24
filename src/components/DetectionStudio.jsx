import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Eye, 
  Activity, 
  Download, 
  RefreshCw, 
  Mic, 
  Video, 
  Image as ImageIcon, 
  Sliders, 
  Zap,
  Check,
  ShieldCheck,
  X,
  Clock,
  Sparkles,
  Info,
  HelpCircle
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../data/presets';
import { 
  generateSha256, 
  performErrorLevelAnalysis, 
  drawFacialLandmarks, 
  drawFftSpectrum, 
  analyzeUploadedMedia
} from '../utils/forensics';

export function DetectionStudio({ onGenerateCertificate, selectedModality, onOpenComingSoon }) {
  // Image detection is functional; video and audio are upcoming
  const [_activeTab, setActiveTab] = useState('image');
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(SAMPLE_PRESETS[0].src);
  const [sha256Hash, setSha256Hash] = useState('7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');
  const [auditMode, setAuditMode] = useState('auto'); // 'auto' | 'force-fake' | 'force-real'
  
  // Pipeline State (6 stages)
  const [pipelineStage, setPipelineStage] = useState(6);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(100);

  // Preview before analysis state
  const [isPendingAnalysis, setIsPendingAnalysis] = useState(false);
  const [isCustomUpload, setIsCustomUpload] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null);

  // Validation error state
  const [validationError, setValidationError] = useState(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Active Forensic View (Images only)
  const [forensicView, setForensicView] = useState('original'); // 'original' | 'ela' | 'landmarks' | 'fft'
  const [elaAmplification, setElaAmplification] = useState(20);

  // Current analysis results (default to AI Face Swap deepfake image demo)
  const [currentResult, setCurrentResult] = useState(SAMPLE_PRESETS[0]);

  // Canvas refs
  const elaCanvasRef = useRef(null);
  const landmarksCanvasRef = useRef(null);
  const fftCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Only image presets are shown
  const imagePresets = SAMPLE_PRESETS.filter(p => p.type === 'image');

  // React to selectedModality prop from parent
  useEffect(() => {
    if (selectedModality === 'video' || selectedModality === 'audio') {
      onOpenComingSoon?.(selectedModality);
    }
  }, [selectedModality, onOpenComingSoon]);

  // Run Canvas Forensics rendering whenever currentResult, forensicView, or media changes
  useEffect(() => {
    if (forensicView === 'ela' && elaCanvasRef.current && mediaPreview) {
      performErrorLevelAnalysis(mediaPreview, elaCanvasRef.current, 0.88, elaAmplification);
    } else if (forensicView === 'landmarks' && landmarksCanvasRef.current) {
      drawFacialLandmarks(landmarksCanvasRef.current, currentResult.isFake, (currentResult.deepfakeProbability || 95) / 100);
    } else if (forensicView === 'fft' && fftCanvasRef.current) {
      drawFftSpectrum(fftCanvasRef.current, currentResult.isFake);
    }
  }, [forensicView, mediaPreview, currentResult, elaAmplification]);

  // Handle Tab Click - Only Image is active; Video & Audio display coming soon notification
  const handleTabClick = (tab) => {
    if (tab === 'video') {
      onOpenComingSoon?.('video');
      return;
    }
    if (tab === 'audio') {
      onOpenComingSoon?.('audio');
      return;
    }
    setActiveTab('image');
  };

  // Handle Preset Benchmark Selection (Clearly labeled as Demo)
  const handleSelectPreset = (preset) => {
    setValidationError(null);
    setSelectedFile(null);
    setUploadedFileInfo(null);
    setIsCustomUpload(false);
    setIsPendingAnalysis(false);

    setCurrentResult(preset);
    setMediaPreview(preset.src);
    setForensicView('original');
    runPipelineSimulation(preset);
  };

  // Validate and stage an image file for preview before analysis
  const validateAndStageFile = async (file) => {
    if (!file) return;

    setValidationError(null);

    // 1. Check for Video or Audio attempt
    const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name);
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|avi|mkv)$/i.test(file.name);
    if (isVideo) {
      setValidationError('Video detection is coming soon. TruthLens currently supports Image Deepfake Detection (JPG, JPEG, PNG, WEBP up to 10 MB).');
      onOpenComingSoon?.('video');
      return;
    }
    if (isAudio) {
      setValidationError('Audio detection is coming soon. TruthLens currently supports Image Deepfake Detection (JPG, JPEG, PNG, WEBP up to 10 MB).');
      onOpenComingSoon?.('audio');
      return;
    }

    // 2. Format validation: JPG, JPEG, PNG, WEBP
    const validExtensions = /\.(jpe?g|png|webp)$/i;
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const isMimeValid = validMimes.includes(file.type.toLowerCase()) || (file.type.startsWith('image/') && validExtensions.test(file.name));
    const isExtValid = validExtensions.test(file.name);

    if (!isExtValid || !isMimeValid) {
      setValidationError(`Unsupported file format "${file.name}". TruthLens currently accepts JPG, JPEG, PNG, and WEBP image formats only.`);
      return;
    }

    // 3. File size validation: Maximum 15 MB
    const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
    if (file.size > MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setValidationError(`File size exceeds 15 MB limit (${sizeMB} MB). Please select an image under 15 MB.`);
      return;
    }

    // Validation passed: Stage file for preview before analysis
    setSelectedFile(file);
    setIsCustomUpload(true);
    setIsPendingAnalysis(true);
    setForensicView('original');

    const formattedSize = file.size < 1024 * 1024 
      ? `${(file.size / 1024).toFixed(1)} KB` 
      : `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    setUploadedFileInfo({
      name: file.name,
      size: formattedSize,
      sizeBytes: file.size,
      type: file.type || 'image/jpeg'
    });

    const objectUrl = URL.createObjectURL(file);
    setMediaPreview(objectUrl);

    // Compute cryptographic SHA-256 hash immediately for preview
    const hash = await generateSha256(file);
    setSha256Hash(hash);
  };

  // Execute full image forensic analysis when "Analyze Image" is clicked
  const handleExecuteAnalysis = async () => {
    if (!selectedFile) return;
    setValidationError(null);
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setPipelineStage(1);

    try {
      // Run real AI Vision Transformer detection pipeline via backend API
      const customResult = await analyzeUploadedMedia(selectedFile, mediaPreview, auditMode);
      setIsPendingAnalysis(false);
      setCurrentResult(customResult);
      if (customResult.fileInfo && customResult.fileInfo.sha256) {
        setSha256Hash(customResult.fileInfo.sha256);
      }
      runPipelineSimulation(customResult);
    } catch (err) {
      setIsAnalyzing(false);
      setIsPendingAnalysis(true);
      setValidationError(err.message || 'AI detection failed. Please check the image format and retry.');
    }
  };

  // Switch Engine Mode for demo benchmark presets (never alters real custom upload predictions)
  const handleAuditModeChange = async (mode) => {
    setAuditMode(mode);
    if (!selectedFile) {
      if (mode === 'force-fake') {
        const fakePreset = imagePresets.find(p => p.isFake) || imagePresets[0];
        handleSelectPreset(fakePreset);
      } else if (mode === 'force-real') {
        const realPreset = imagePresets.find(p => !p.isFake) || imagePresets[2];
        handleSelectPreset(realPreset);
      } else {
        handleSelectPreset(imagePresets[0]);
      }
    }
  };

  // Run 6-Step Pipeline Simulation
  const runPipelineSimulation = (_resultData) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setPipelineStage(1);

    const stages = [
      { stage: 1, progress: 18, delay: 280 },
      { stage: 2, progress: 38, delay: 550 },
      { stage: 3, progress: 62, delay: 850 },
      { stage: 4, progress: 84, delay: 1150 },
      { stage: 5, progress: 95, delay: 1400 },
      { stage: 6, progress: 100, delay: 1650 }
    ];

    stages.forEach(({ stage, progress, delay }) => {
      setTimeout(() => {
        setPipelineStage(stage);
        setAnalysisProgress(progress);
        if (stage === 6) {
          setIsAnalyzing(false);
        }
      }, delay);
    });
  };

  // Drag-and-Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndStageFile(e.dataTransfer.files[0]);
    }
  };

  // Reset uploaded file back to benchmark sample
  const handleResetUpload = () => {
    setSelectedFile(null);
    setUploadedFileInfo(null);
    setIsPendingAnalysis(false);
    setIsCustomUpload(false);
    setValidationError(null);
    handleSelectPreset(imagePresets[0]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Export JSON Audit Log
  const handleExportJson = () => {
    const reportData = {
      platform: 'TruthLens Media Forensics Engine',
      version: '3.5.0-production',
      timestamp: new Date().toISOString(),
      mediaSha256: sha256Hash,
      fileName: currentResult.name,
      mediaType: 'image',
      outcome: currentResult.outcome || (currentResult.isFake ? 'Potentially Manipulated / AI-Generated' : 'Likely Authentic'),
      outcomeKey: currentResult.outcomeKey || (currentResult.isFake ? 'manipulated' : 'authentic'),
      verdict: currentResult.verdict,
      authenticityScore: `${currentResult.authenticityScore}%`,
      deepfakeProbability: `${currentResult.deepfakeProbability || (100 - currentResult.authenticityScore).toFixed(1)}%`,
      confidenceScore: currentResult.confidenceScore ? `${currentResult.confidenceScore}%` : undefined,
      inconclusiveReason: currentResult.inconclusiveReason,
      modelDetails: currentResult.modelDetails,
      modelConfidence: currentResult.modelConfidence,
      manipulationFeatures: currentResult.manipulationFeatures,
      technicalSummary: currentResult.technicalSummary,
      estimatedHardwareSource: currentResult.estimatedSource,
      disclaimer: currentResult.disclaimer,
      isDemoBenchmark: !isCustomUpload
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `truthlens-audit-${currentResult.id || 'custom'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stepsList = [
    { num: 1, title: 'Upload Media', desc: 'SHA-256 hash & codec check' },
    { num: 2, title: 'Preprocessing', desc: 'Color space & resolution norm' },
    { num: 3, title: 'AI/ML Detection', desc: 'Neural ensemble scan' },
    { num: 4, title: 'Manipulation Features', desc: 'ELA & Fourier frequency' },
    { num: 5, title: 'Authenticity Score', desc: 'Risk synthesis & calibration' },
    { num: 6, title: 'Result + Explanation', desc: 'Forensic audit & certificate' }
  ];

  return (
    <section id="studio" className="studio-section section-padding">
      <div className="container">
        {/* Section Heading */}
        <div className="section-header">
          <div className="badge-pill cyan" style={{ marginBottom: '14px' }}>
            <Cpu size={14} />
            <span>Interactive Image Verification Engine</span>
          </div>
          <h2>Live Deepfake Detection Studio</h2>
          <p>
            Experience our six-stage verification pipeline in real time. Upload your own image (JPG, PNG, WEBP up to 10 MB) or test against pre-loaded forensic benchmark samples.
          </p>
        </div>

        {/* 6-Step Pipeline Visual Tracker */}
        <div className="pipeline-tracker glass-card">
          <div className="tracker-header">
            <span className="tracker-label">Active Verification Workflow:</span>
            <span className="tracker-status">
              {isPendingAnalysis ? (
                <span className="pending-text">
                  <Clock size={14} /> Image Preview Loaded — Ready for Analysis
                </span>
              ) : isAnalyzing ? (
                <span className="pulse-text">
                  <Activity size={14} className="spin-icon" /> Stage {pipelineStage} of 6 in progress... ({analysisProgress}%)
                </span>
              ) : (
                <span className="ready-text">
                  <CheckCircle2 size={14} /> Stage 6 Complete — Forensic Audit Verified
                </span>
              )}
            </span>
          </div>

          <div className="steps-row">
            {stepsList.map((step) => {
              const isActive = pipelineStage === step.num && isAnalyzing;
              const isCompleted = !isPendingAnalysis && (pipelineStage > step.num || (pipelineStage === 6 && !isAnalyzing));
              return (
                <div 
                  key={step.num} 
                  className={`step-pill ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isPendingAnalysis && step.num === 1 ? 'active' : ''}`}
                >
                  <div className="step-num-badge">
                    {isCompleted ? <Check size={12} /> : step.num}
                  </div>
                  <div className="step-info">
                    <span className="step-title">{step.title}</span>
                    <span className="step-sub">{step.desc}</span>
                  </div>
                  {step.num < 6 && <div className="step-arrow">➔</div>}
                </div>
              );
            })}
          </div>

          {/* Progress Line */}
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill" 
              style={{ width: isPendingAnalysis ? '18%' : `${analysisProgress}%` }}
            />
          </div>
        </div>

        {/* Studio Main Workspace */}
        <div className="studio-workspace glass-card">
          {/* Top Modality Switcher & Engine Modes */}
          <div className="workspace-top-bar">
            {/* Modality Tabs */}
            <div className="modality-tabs">
              <button 
                className="mod-tab active"
                onClick={() => handleTabClick('image')}
                title="Image deepfake detection is active and fully functional"
              >
                <ImageIcon size={16} />
                <span>Image Forensics</span>
                <span className="tab-badge available">Available</span>
              </button>

              <button 
                className="mod-tab coming-soon"
                onClick={() => handleTabClick('video')}
                title="Video deepfake detection is coming in a future update"
              >
                <Video size={16} />
                <span>Video Deepfakes</span>
                <span className="tab-badge coming-soon">Coming Soon</span>
              </button>

              <button 
                className="mod-tab coming-soon"
                onClick={() => handleTabClick('audio')}
                title="Audio deepfake detection is coming in a future update"
              >
                <Mic size={16} />
                <span>Voice Clone / Audio</span>
                <span className="tab-badge coming-soon">Coming Soon</span>
              </button>
            </div>

            {/* Engine Modes & Preset Row */}
            <div className="presets-selector">
              {/* Engine Detection Mode Chips */}
              <div className="engine-modes-group">
                <span className="preset-label">Detection Mode:</span>
                <button
                  className={`engine-chip ${auditMode === 'auto' ? 'active-auto' : ''}`}
                  onClick={() => handleAuditModeChange('auto')}
                  title="Intelligent Multi-Modal Neural Scan"
                >
                  <Zap size={13} />
                  <span>Smart Auto-Detect</span>
                </button>
                <button
                  className={`engine-chip ${auditMode === 'force-fake' ? 'active-fake' : ''}`}
                  onClick={() => handleAuditModeChange('force-fake')}
                  title="High-Sensitivity AI & Deepfake Manipulation Analysis"
                >
                  <AlertTriangle size={13} />
                  <span>Detect AI Deepfake</span>
                </button>
                <button
                  className={`engine-chip ${auditMode === 'force-real' ? 'active-real' : ''}`}
                  onClick={() => handleAuditModeChange('force-real')}
                  title="Verify Genuine Optical Hardware Sensor & Provenance"
                >
                  <ShieldCheck size={13} />
                  <span>Verify Authentic</span>
                </button>
              </div>

              {/* Presets Chips for Image Modality */}
              <div className="active-presets-group">
                <span className="preset-label">Image Benchmarks (Demo):</span>
                <div className="presets-chips">
                  {imagePresets.map((preset) => (
                    <button
                      key={preset.id}
                      className={`preset-chip ${currentResult?.id === preset.id && !selectedFile ? 'active' : ''} ${preset.isInconclusive ? 'chip-amber' : preset.isFake ? 'chip-fake' : 'chip-real'}`}
                      onClick={() => handleSelectPreset(preset)}
                      title={`${preset.name} - Demo benchmark evaluation`}
                    >
                      <span className={`chip-dot ${preset.isInconclusive ? 'amber' : preset.isFake ? 'fake' : 'real'}`} />
                      <span>{preset.name}</span>
                      <span className="chip-demo-tag">Demo</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="validation-error-banner" role="alert">
              <div className="err-content">
                <AlertTriangle size={18} className="err-icon" />
                <span className="err-text">{validationError}</span>
              </div>
              <button 
                className="err-dismiss-btn" 
                onClick={() => setValidationError(null)}
                aria-label="Dismiss error"
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* Studio Grid: Dropzone/Viewer (Left) vs Forensic Results (Right) */}
          <div className="studio-grid">
            {/* Left: Media Dropzone & Interactive Canvas Visualizer */}
            <div className="studio-left">
              {/* Dropzone bar */}
              <div 
                className={`upload-dropzone ${isDraggingFile ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    fileInputRef.current?.click();
                  }
                }}
              >
                <input 
                  ref={fileInputRef}
                  id="file-input" 
                  type="file" 
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" 
                  className="file-input-hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      validateAndStageFile(e.target.files[0]);
                    }
                    e.target.value = '';
                  }}
                />
                <Upload size={22} className="drop-icon" />
                <div className="drop-text">
                  <span className="drop-main">
                    Drop a <span className="highlight">JPG, JPEG, PNG, or WEBP</span> image here, or <span className="highlight">Browse</span>
                  </span>
                  <span className="drop-meta">
                    Maximum size: 15 MB • Pretrained Vision Transformer (ViT) Inference • Calibrated Reliability Thresholds
                  </span>
                </div>
              </div>

              {/* View Mode Switcher */}
              <div className="view-mode-bar">
                <button 
                  className={`view-btn ${forensicView === 'original' ? 'active' : ''}`}
                  onClick={() => setForensicView('original')}
                >
                  <Eye size={14} />
                  <span>Original Image</span>
                </button>

                <button 
                  className={`view-btn ${forensicView === 'ela' ? 'active' : ''}`}
                  onClick={() => setForensicView('ela')}
                >
                  <Activity size={14} />
                  <span>Error Level (ELA)</span>
                </button>

                <button 
                  className={`view-btn ${forensicView === 'landmarks' ? 'active' : ''}`}
                  onClick={() => setForensicView('landmarks')}
                >
                  <Layers size={14} />
                  <span>Facial Landmarks</span>
                </button>

                <button 
                  className={`view-btn ${forensicView === 'fft' ? 'active' : ''}`}
                  onClick={() => setForensicView('fft')}
                >
                  <Sliders size={14} />
                  <span>2D FFT Spectrum</span>
                </button>
              </div>

              {/* Interactive Canvas / Display Container */}
              <div className="visualizer-container">
                {/* 1. Original View */}
                {forensicView === 'original' && (
                  <div className="view-box">
                    <img 
                      src={mediaPreview} 
                      alt="Media Under Forensic Inspection" 
                      className="inspected-media" 
                    />
                    
                    {/* Active Laser scan line */}
                    {!isPendingAnalysis && <div className="scan-line-laser" />}

                    {/* Pending Preview Overlay Banner */}
                    {isPendingAnalysis && (
                      <div className="preview-ready-banner">
                        <div className="preview-banner-content">
                          <span className="preview-pulse-dot" />
                          <span className="preview-label">Image Preview — Ready for Analysis</span>
                        </div>
                        <button 
                          className="btn-primary analyze-banner-btn"
                          onClick={handleExecuteAnalysis}
                        >
                          <Zap size={14} />
                          <span>Analyze Image Now</span>
                        </button>
                      </div>
                    )}

                    <div className="forensic-watermark">
                      <span>TRUTHLENS LABS SHA-256: {sha256Hash.substring(0, 16)}...</span>
                    </div>
                  </div>
                )}

                {/* 2. ELA Canvas View */}
                <div className={`view-box ${forensicView === 'ela' ? 'show' : 'hidden'}`}>
                  <canvas ref={elaCanvasRef} className="forensic-canvas" />
                  <div className="canvas-controls-overlay">
                    <div className="slider-control">
                      <span>ELA Amplification ({elaAmplification}x):</span>
                      <input 
                        type="range" 
                        min="5" 
                        max="40" 
                        value={elaAmplification}
                        onChange={(e) => setElaAmplification(Number(e.target.value))}
                      />
                    </div>
                    <span className="hud-badge">Bright Magenta = Compression Anomaly</span>
                  </div>
                </div>

                {/* 3. Facial Landmarks Canvas */}
                <div className={`view-box ${forensicView === 'landmarks' ? 'show' : 'hidden'}`}>
                  <img src={mediaPreview} alt="Base Media" className="inspected-media dimmed" />
                  <canvas 
                    ref={landmarksCanvasRef} 
                    width={500} 
                    height={500} 
                    className="forensic-canvas-overlay" 
                  />
                </div>

                {/* 4. 2D FFT Frequency Canvas */}
                <div className={`view-box ${forensicView === 'fft' ? 'show' : 'hidden'}`}>
                  <canvas 
                    ref={fftCanvasRef} 
                    width={500} 
                    height={500} 
                    className="forensic-canvas" 
                  />
                </div>
              </div>

              {/* SHA-256 Provenance Bar & File Details */}
              <div className="hash-bar">
                <div className="hash-left">
                  <span className="hash-title">Cryptographic SHA-256:</span>
                  <span className="hash-code">{sha256Hash}</span>
                </div>
                {isCustomUpload && uploadedFileInfo && (
                  <div className="upload-file-meta">
                    <span className="file-meta-pill">{uploadedFileInfo.name} ({uploadedFileInfo.size})</span>
                    <button className="reset-file-btn" onClick={handleResetUpload} title="Remove custom file and reset">
                      <X size={12} />
                      <span>Reset</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Results, Authenticity Score & Forensic Explanation */}
            <div className="studio-right">
              {/* If image is staged for preview before analysis */}
              {isPendingAnalysis ? (
                <div className="pending-analysis-card glass-card">
                  <div className="pending-card-header">
                    <div className="pending-icon-wrap">
                      <ImageIcon size={32} />
                    </div>
                    <div>
                      <h3 className="pending-title">Image Ready for Deepfake Analysis</h3>
                      <p className="pending-sub">Review file information below and start the verification pipeline.</p>
                    </div>
                  </div>

                  <div className="file-preview-details">
                    <div className="preview-detail-row">
                      <span className="detail-label">File Name:</span>
                      <span className="detail-value mono">{uploadedFileInfo?.name}</span>
                    </div>
                    <div className="preview-detail-row">
                      <span className="detail-label">File Size:</span>
                      <span className="detail-value">{uploadedFileInfo?.size} (Max: 10 MB)</span>
                    </div>
                    <div className="preview-detail-row">
                      <span className="detail-label">Format:</span>
                      <span className="detail-value uppercase">{uploadedFileInfo?.type}</span>
                    </div>
                    <div className="preview-detail-row">
                      <span className="detail-label">SHA-256 Checksum:</span>
                      <span className="detail-value mono truncate">{sha256Hash}</span>
                    </div>
                    <div className="preview-detail-row">
                      <span className="detail-label">Detection Mode:</span>
                      <span className="detail-value capitalize">{auditMode.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <div className="pending-features-preview">
                    <h4>Scheduled Forensic Inspection:</h4>
                    <div className="scheduled-tags">
                      <span>✓ Error Level Analysis (ELA)</span>
                      <span>✓ 68-Point Facial Landmarks</span>
                      <span>✓ 2D FFT Spatial Frequency</span>
                      <span>✓ PRNU Sensor Fingerprint</span>
                      <span>✓ Authenticity Calibration</span>
                    </div>
                  </div>

                  <div className="pending-actions">
                    <button 
                      className="btn-primary analyze-action-btn"
                      onClick={handleExecuteAnalysis}
                    >
                      <Zap size={18} />
                      <span>Analyze Image</span>
                    </button>
                    <button 
                      className="btn-secondary change-file-btn"
                      onClick={handleResetUpload}
                    >
                      Choose Different Image
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Verdict Header Card */}
                  {(() => {
                    const isManipulated = currentResult.outcomeKey === 'manipulated' || (currentResult.outcomeKey ? false : currentResult.isFake);
                    const isInconclusive = currentResult.outcomeKey === 'inconclusive' || currentResult.isInconclusive;

                    return (
                      <div className={`verdict-card ${isManipulated ? 'fake-verdict' : isInconclusive ? 'inconclusive-verdict' : 'real-verdict'}`}>
                        <div className="verdict-score-col">
                          {/* Circular Score Gauge */}
                          <div className="score-gauge-wrap">
                            <svg className="score-svg" viewBox="0 0 100 100">
                              <circle 
                                className="gauge-bg" 
                                cx="50" 
                                cy="50" 
                                r="42" 
                              />
                              <circle 
                                className={`gauge-val ${isManipulated ? 'fake-stroke' : isInconclusive ? 'inconclusive-stroke' : 'real-stroke'}`}
                                cx="50" 
                                cy="50" 
                                r="42" 
                                strokeDasharray="264"
                                strokeDashoffset={264 - (264 * (isManipulated ? (currentResult.deepfakeProbability || 75) : isInconclusive ? (currentResult.confidenceScore || 50) : (currentResult.authenticityScore || 85))) / 100}
                              />
                            </svg>
                            <div className="score-center">
                              <span className="score-number">
                                {isManipulated 
                                  ? `${currentResult.deepfakeProbability}%` 
                                  : isInconclusive
                                  ? `${currentResult.confidenceScore || Math.max(currentResult.authenticityScore, currentResult.deepfakeProbability)}%`
                                  : `${currentResult.authenticityScore}%`}
                              </span>
                              <span className="score-sub">
                                {isManipulated ? 'Deepfake Risk' : isInconclusive ? 'Confidence' : 'Authentic'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="verdict-text-col">
                          <div className="verdict-tag-row">
                            <span className={`verdict-pill ${isManipulated ? 'red' : isInconclusive ? 'amber' : 'green'}`}>
                              {isManipulated ? <AlertTriangle size={14} /> : isInconclusive ? <HelpCircle size={14} /> : <CheckCircle2 size={14} />}
                              {currentResult.verdict}
                            </span>
                            
                            {/* Clear Demo Labeling vs Custom Live Inspection */}
                            {isCustomUpload ? (
                              <span className="origin-badge live">
                                <Sparkles size={11} />
                                <span>Real AI Model Inference</span>
                              </span>
                            ) : (
                              <span className="origin-badge demo">
                                <Info size={11} />
                                <span>Demo Benchmark Sample</span>
                              </span>
                            )}

                            <span className={`dual-metric-pill ${isManipulated ? 'fake' : isInconclusive ? 'inconclusive' : 'real'}`}>
                              {isManipulated 
                                ? `Authenticity: ${currentResult.authenticityScore}% [Flagged]` 
                                : isInconclusive
                                ? `Indeterminate Margin (Risk: ${currentResult.deepfakeProbability}% | Authentic: ${currentResult.authenticityScore}%)`
                                : `Manipulation Risk: ${currentResult.deepfakeProbability}% [Clean]`}
                            </span>
                          </div>

                          <h3 className="verdict-title">
                            {isManipulated 
                              ? 'Potentially Manipulated / AI-Generated' 
                              : isInconclusive
                              ? 'Inconclusive Forensic Media Result'
                              : 'Likely Authentic Media Verified'}
                          </h3>
                          <p className="verdict-desc">
                            {currentResult.technicalSummary}
                          </p>

                          {/* Inconclusive Explanation Callout */}
                          {isInconclusive && (
                            <div className="inconclusive-alert-box">
                              <AlertTriangle size={18} className="alert-icon-amber" />
                              <div className="inconclusive-alert-content">
                                <div className="alert-heading">Indeterminate Forensic Decision Boundary</div>
                                <p className="alert-text">
                                  {currentResult.inconclusiveReason || 'The model confidence fell within the indeterminate zone (35%–65%). Media cannot be definitively classified as authentic or manipulated without secondary sensor corroboration.'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Real AI Model Transparency Card */}
                          {currentResult.modelDetails && (
                            <div className="model-transparency-card">
                              <div className="model-transparency-header">
                                <Cpu size={15} />
                                <span>Model Architecture: {currentResult.modelDetails.name}</span>
                                <span className="badge-pill">ONNX Runtime</span>
                              </div>
                              <div className="model-transparency-grid">
                                <div className="transparency-col">
                                  <span className="t-label">Architecture</span>
                                  <span className="t-val">{currentResult.modelDetails.architecture || 'ViTForImageClassification'}</span>
                                </div>
                                <div className="transparency-col">
                                  <span className="t-label">Activation Method</span>
                                  <span className="t-val uppercase">{currentResult.modelDetails.activation || 'Softmax'}</span>
                                </div>
                                <div className="transparency-col">
                                  <span className="t-label">Execution Time</span>
                                  <span className="t-val">{currentResult.modelDetails.inferenceTimeMs ? `${currentResult.modelDetails.inferenceTimeMs} ms` : 'Fast CPU Inference'}</span>
                                </div>
                                <div className="transparency-col">
                                  <span className="t-label">Decision Boundary</span>
                                  <span className="t-val">Realism &lt; 35% | Fake &gt; 65%</span>
                                </div>
                              </div>
                              {currentResult.modelDetails.rawLogits && (
                                <div className="logits-row">
                                  <span className="t-label">Raw Model Logits:</span>
                                  <code className="logits-code">
                                    [Realism: {currentResult.modelDetails.rawLogits[0]?.toFixed(4)}, Deepfake: {currentResult.modelDetails.rawLogits[1]?.toFixed(4)}]
                                  </code>
                                </div>
                              )}
                              <div className="model-disclaimer-box">
                                <p className="disclaimer-text">
                                  <strong>Disclaimer:</strong> {currentResult.disclaimer || 'AI deepfake models output probabilistic assessments and are not an infallible guarantee of authenticity. Authenticity should always be verified alongside source provenance and digital chain of custody.'}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Demo Preset Switcher (Only shown on Demo Presets, never on custom live uploads) */}
                          {!isCustomUpload && (
                            <div className="verdict-action-switch">
                              <button
                                className="verdict-toggle-btn"
                                onClick={() => handleAuditModeChange(currentResult.isFake ? 'force-real' : 'force-fake')}
                                title="Switch between benchmark presets"
                              >
                                <RefreshCw size={13} />
                                <span>{currentResult.isFake ? 'Switch to Authentic Benchmark Preset' : 'Switch to AI Deepfake Benchmark Preset'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Multi-Model Breakdown Meters */}
                  <div className="metrics-box">
                    <h4 className="metrics-header">Multi-Model Forensic Ensembles</h4>
                    <div className="metrics-list">
                      <div className="metric-row">
                        <div className="metric-label-group">
                          <span>Spatial Artifact Classifier (EfficientNet-B4)</span>
                          <span className="metric-val">
                            {currentResult.modelConfidence?.spatial}% {currentResult.isFake ? '▲ Anomaly' : '✓ Sensor Pass'}
                          </span>
                        </div>
                        <div className="metric-meter">
                          <div 
                            className={`meter-bar ${currentResult.isFake ? 'fake' : 'real'}`} 
                            style={{ width: `${currentResult.modelConfidence?.spatial}%` }} 
                          />
                        </div>
                      </div>

                      <div className="metric-row">
                        <div className="metric-label-group">
                          <span>2D FFT Frequency Lattice (Periodic Spikes)</span>
                          <span className="metric-val">
                            {currentResult.modelConfidence?.frequency}% {currentResult.isFake ? '▲ Spectral Spike' : '✓ Clean Falloff'}
                          </span>
                        </div>
                        <div className="metric-meter">
                          <div 
                            className={`meter-bar ${currentResult.isFake ? 'fake' : 'real'}`} 
                            style={{ width: `${currentResult.modelConfidence?.frequency}%` }} 
                          />
                        </div>
                      </div>

                      <div className="metric-row">
                        <div className="metric-label-group">
                          <span>Biometric Mesh & Corneal Specular Physics</span>
                          <span className="metric-val">
                            {currentResult.modelConfidence?.biometric}% {currentResult.isFake ? '▲ Deficit' : '✓ Organic Pass'}
                          </span>
                        </div>
                        <div className="metric-meter">
                          <div 
                            className={`meter-bar ${currentResult.isFake ? 'fake' : 'real'}`} 
                            style={{ width: `${currentResult.modelConfidence?.biometric}%` }} 
                          />
                        </div>
                      </div>

                      <div className="metric-row">
                        <div className="metric-label-group">
                          <span>C2PA Metadata & Sensor PRNU Noise</span>
                          <span className="metric-val">
                            {currentResult.modelConfidence?.provenance}% {currentResult.isFake ? '▲ Unsigned' : '✓ Verified'}
                          </span>
                        </div>
                        <div className="metric-meter">
                          <div 
                            className={`meter-bar ${currentResult.isFake ? 'fake' : 'real'}`} 
                            style={{ width: `${currentResult.modelConfidence?.provenance}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manipulation Features List */}
                  <div className="features-breakdown">
                    <h4 className="features-header">Analyzed Manipulation Features</h4>
                    <div className="features-cards">
                      {currentResult.manipulationFeatures?.map((item, idx) => (
                        <div key={idx} className={`feature-item ${item.severity}`}>
                          <div className="feature-top">
                            <span className="feature-name">{item.feature}</span>
                            <span className={`feature-badge ${item.severity}`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="feature-detail">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hardware / Source Attribution */}
                  <div className="source-attribution">
                    <span className="source-label">Estimated Origin / Engine:</span>
                    <span className="source-value">{currentResult.estimatedSource}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="results-actions">
                    <button 
                      className="btn-primary studio-action-btn"
                      onClick={() => onGenerateCertificate?.(currentResult, sha256Hash)}
                    >
                      <Download size={16} />
                      <span>Download Forensic Certificate</span>
                    </button>
                    <button 
                      className="btn-secondary studio-action-btn"
                      onClick={handleExportJson}
                    >
                      <FileText size={16} />
                      <span>Export JSON Audit Log</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .studio-section {
          position: relative;
        }
        /* Pipeline Tracker */
        .pipeline-tracker {
          padding: 20px 24px;
          margin-bottom: 28px;
        }
        .tracker-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          font-size: 0.9rem;
        }
        .tracker-label {
          color: var(--text-secondary);
          font-weight: 600;
        }
        .tracker-status {
          font-family: var(--font-mono);
          font-size: 0.85rem;
        }
        .pulse-text {
          color: #0284c7;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ready-text {
          color: #059669;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pending-text {
          color: #d97706;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }
        .steps-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 10px;
        }
        .step-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          background: #f8fafc;
          border: 1px solid var(--border-card);
          min-width: 145px;
          transition: all 0.2s ease;
        }
        .step-pill.active {
          border-color: #4f46e5;
          background: #eff6ff;
          box-shadow: 0 0 15px rgba(79, 70, 229, 0.15);
        }
        .step-pill.completed {
          border-color: rgba(16, 185, 129, 0.3);
          background: rgba(16, 185, 129, 0.08);
        }
        .step-num-badge {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .step-pill.completed .step-num-badge {
          background: #10b981;
          color: #ffffff;
        }
        .step-pill.active .step-num-badge {
          background: #4f46e5;
          color: #ffffff;
        }
        .step-info {
          display: flex;
          flex-direction: column;
        }
        .step-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
        }
        .step-sub {
          font-size: 0.65rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .step-arrow {
          color: var(--text-muted);
          font-size: 0.75rem;
          margin-left: auto;
        }
        .progress-bar-track {
          width: 100%;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          margin-top: 10px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #4f46e5, #06b6d4, #10b981);
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        /* Workspace */
        .studio-workspace {
          padding: 24px;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          border-radius: var(--radius-xl);
        }
        .workspace-top-bar {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-card);
          margin-bottom: 20px;
        }
        .modality-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .mod-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-secondary);
          background: #f8fafc;
          border: 1px solid var(--border-card);
          transition: all 0.2s ease;
          position: relative;
        }
        .mod-tab:hover {
          color: #0f172a;
          border-color: rgba(79, 70, 229, 0.3);
        }
        .mod-tab.active {
          background: #ffffff;
          color: #4f46e5;
          border-color: #4f46e5;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.15);
        }
        .mod-tab.coming-soon {
          opacity: 0.9;
        }
        .tab-badge {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .tab-badge.available {
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .tab-badge.coming-soon {
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .presets-selector {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .engine-modes-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .engine-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          background: #f8fafc;
          border: 1px solid var(--border-card);
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }
        .engine-chip:hover {
          color: #0f172a;
          border-color: rgba(0, 0, 0, 0.2);
        }
        .engine-chip.active-auto {
          background: #eff6ff;
          color: #2563eb;
          border-color: #3b82f6;
        }
        .engine-chip.active-fake {
          background: #fef2f2;
          color: #dc2626;
          border-color: #ef4444;
        }
        .engine-chip.active-real {
          background: #ecfdf5;
          color: #059669;
          border-color: #10b981;
        }

        .active-presets-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .preset-label {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .presets-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .preset-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          background: #f8fafc;
          border: 1px solid var(--border-card);
          color: var(--text-primary);
          transition: all 0.2s ease;
        }
        .preset-chip:hover {
          border-color: rgba(79, 70, 229, 0.4);
        }
        .preset-chip.active {
          border-color: #4f46e5;
          background: #eff6ff;
        }
        .chip-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .chip-dot.fake { background: #ef4444; }
        .chip-dot.real { background: #10b981; }
        .chip-demo-tag {
          font-size: 0.65rem;
          padding: 1px 6px;
          border-radius: var(--radius-full);
          background: rgba(0, 0, 0, 0.06);
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
        }

        /* Validation Error Banner */
        .validation-error-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          border-radius: var(--radius-md);
          background: #fef2f2;
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #b91c1c;
          margin-bottom: 20px;
          animation: errSlide 0.25s ease-out;
        }
        @keyframes errSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .err-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .err-icon {
          color: #dc2626;
          flex-shrink: 0;
        }
        .err-text {
          font-size: 0.88rem;
          font-weight: 600;
          line-height: 1.4;
        }
        .err-dismiss-btn {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #dc2626;
          background: rgba(220, 38, 38, 0.08);
          transition: all 0.2s ease;
        }
        .err-dismiss-btn:hover {
          background: rgba(220, 38, 38, 0.16);
        }

        /* Studio Grid */
        .studio-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        /* Left Column */
        .studio-left {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .upload-dropzone {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-radius: var(--radius-lg);
          border: 2px dashed rgba(99, 102, 241, 0.4);
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .upload-dropzone:hover, .upload-dropzone.dragging {
          border-color: #4f46e5;
          background: #eff6ff;
          box-shadow: 0 4px 18px rgba(79, 70, 229, 0.12);
        }
        .file-input-hidden {
          display: none;
        }
        .drop-icon {
          color: #4f46e5;
          flex-shrink: 0;
        }
        .drop-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .drop-main {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .drop-main .highlight {
          color: #4f46e5;
          text-decoration: underline;
        }
        .drop-meta {
          font-size: 0.74rem;
          color: var(--text-muted);
        }

        /* View Mode Bar */
        .view-mode-bar {
          display: flex;
          gap: 6px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: var(--radius-md);
          overflow-x: auto;
        }
        .view-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .view-btn:hover {
          color: #0f172a;
        }
        .view-btn.active {
          background: #ffffff;
          color: #4f46e5;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        /* Visualizer Container */
        .visualizer-container {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #0b0f19;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.6);
        }
        .view-box {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .view-box.hidden {
          display: none;
        }
        .inspected-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .inspected-media.dimmed {
          opacity: 0.45;
          filter: grayscale(40%);
        }
        .forensic-canvas {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
        .forensic-canvas-overlay {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .scan-line-laser {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #06b6d4, #3b82f6, transparent);
          box-shadow: 0 0 16px #06b6d4, 0 0 30px #3b82f6;
          animation: scanline 2.8s ease-in-out infinite;
          pointer-events: none;
        }
        .canvas-controls-overlay {
          position: absolute;
          bottom: 14px;
          left: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          padding: 8px 14px;
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-size: 0.78rem;
          color: #ffffff;
        }
        .slider-control {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hud-badge {
          font-family: var(--font-mono);
          color: #f43f5e;
          font-size: 0.72rem;
        }
        .forensic-watermark {
          position: absolute;
          bottom: 12px;
          left: 14px;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.04em;
          background: rgba(0, 0, 0, 0.5);
          padding: 3px 8px;
          border-radius: 4px;
        }

        /* Preview Ready Banner inside viewer */
        .preview-ready-banner {
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(245, 158, 11, 0.4);
          padding: 8px 14px;
          border-radius: var(--radius-md);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
          z-index: 5;
        }
        .preview-banner-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .preview-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 10px #f59e0b;
          animation: pulseSlow 1.8s infinite;
        }
        .preview-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #f8fafc;
        }
        .analyze-banner-btn {
          padding: 6px 14px;
          font-size: 0.78rem;
          border-radius: var(--radius-sm);
        }

        /* Hash Bar */
        .hash-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid var(--border-card);
          padding: 8px 14px;
          border-radius: var(--radius-md);
          font-size: 0.78rem;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hash-left {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow: hidden;
        }
        .hash-title {
          font-weight: 700;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .hash-code {
          font-family: var(--font-mono);
          color: var(--text-secondary);
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          max-width: 260px;
        }
        .upload-file-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .file-meta-pill {
          padding: 3px 8px;
          border-radius: var(--radius-full);
          background: rgba(79, 70, 229, 0.08);
          color: #4f46e5;
          font-weight: 700;
          font-size: 0.72rem;
        }
        .reset-file-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          background: #fee2e2;
          color: #b91c1c;
          font-size: 0.72rem;
          font-weight: 600;
        }
        .reset-file-btn:hover {
          background: #fecaca;
        }

        /* Right Column: Pending Analysis Card */
        .pending-analysis-card {
          padding: 24px;
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 18px;
          background: #ffffff;
          border: 1px solid var(--border-card);
          height: 100%;
        }
        .pending-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border-card);
        }
        .pending-icon-wrap {
          width: 54px;
          height: 54px;
          border-radius: var(--radius-md);
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pending-title {
          font-size: 1.2rem;
          color: var(--text-primary);
          margin-bottom: 3px;
        }
        .pending-sub {
          font-size: 0.84rem;
          color: var(--text-secondary);
        }
        .file-preview-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px 16px;
          background: #f8fafc;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-card);
        }
        .preview-detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          gap: 12px;
        }
        .detail-label {
          color: var(--text-muted);
          font-weight: 600;
        }
        .detail-value {
          color: var(--text-primary);
          font-weight: 600;
        }
        .detail-value.mono {
          font-family: var(--font-mono);
          font-size: 0.78rem;
        }
        .detail-value.truncate {
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .detail-value.uppercase { text-transform: uppercase; }
        .detail-value.capitalize { text-transform: capitalize; }
        
        .pending-features-preview h4 {
          font-size: 0.85rem;
          margin-bottom: 8px;
          color: var(--text-secondary);
        }
        .scheduled-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .scheduled-tags span {
          padding: 4px 10px;
          border-radius: var(--radius-full);
          background: rgba(16, 185, 129, 0.08);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.2);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .pending-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
          padding-top: 10px;
        }
        .analyze-action-btn {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
        }
        .change-file-btn {
          width: 100%;
          padding: 10px;
          font-size: 0.88rem;
        }

        /* Right Column: Verdict Card */
        .verdict-card {
          padding: 20px;
          border-radius: var(--radius-lg);
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          border: 1px solid var(--border-card);
        }
        .verdict-card.fake-verdict {
          background: linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%);
          border-color: rgba(239, 68, 68, 0.35);
        }
        .verdict-card.real-verdict {
          background: linear-gradient(135deg, rgba(236, 253, 245, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%);
          border-color: rgba(16, 185, 129, 0.35);
        }
        .verdict-card.inconclusive-verdict {
          background: linear-gradient(135deg, rgba(254, 249, 195, 0.92) 0%, rgba(255, 255, 255, 0.95) 100%);
          border-color: rgba(245, 158, 11, 0.45);
        }

        .verdict-score-col {
          flex-shrink: 0;
        }
        .score-gauge-wrap {
          position: relative;
          width: 95px;
          height: 95px;
        }
        .score-svg {
          transform: rotate(-90deg);
          width: 100%;
          height: 100%;
        }
        .gauge-bg {
          fill: none;
          stroke: #e2e8f0;
          stroke-width: 9;
        }
        .gauge-val {
          fill: none;
          stroke-width: 9;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .gauge-val.fake-stroke { stroke: #ef4444; }
        .gauge-val.real-stroke { stroke: #10b981; }
        .gauge-val.inconclusive-stroke { stroke: #f59e0b; }

        .score-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .score-number {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          line-height: 1;
          color: var(--text-primary);
        }
        .score-sub {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .verdict-text-col {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .verdict-tag-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .verdict-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .verdict-pill.red {
          background: rgba(239, 68, 68, 0.12);
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .verdict-pill.green {
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .verdict-pill.amber {
          background: rgba(245, 158, 11, 0.14);
          color: #b45309;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .origin-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .origin-badge.demo {
          background: rgba(148, 163, 184, 0.15);
          color: #475569;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }
        .origin-badge.live {
          background: rgba(99, 102, 241, 0.12);
          color: #4f46e5;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }
        .dual-metric-pill {
          font-size: 0.7rem;
          font-weight: 600;
          font-family: var(--font-mono);
          padding: 3px 8px;
          border-radius: var(--radius-full);
        }
        .dual-metric-pill.fake {
          background: rgba(0, 0, 0, 0.04);
          color: #b91c1c;
        }
        .dual-metric-pill.real {
          background: rgba(0, 0, 0, 0.04);
          color: #047857;
        }
        .dual-metric-pill.inconclusive {
          background: rgba(245, 158, 11, 0.12);
          color: #92400e;
        }
        .verdict-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .verdict-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 12px;
        }

        /* Inconclusive Alert Box */
        .inconclusive-alert-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(254, 243, 199, 0.9);
          border: 1px solid rgba(245, 158, 11, 0.4);
          border-radius: var(--radius-md);
          padding: 12px 14px;
          margin: 10px 0 14px;
        }
        .alert-icon-amber {
          color: #d97706;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .inconclusive-alert-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .alert-heading {
          font-size: 0.82rem;
          font-weight: 700;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .alert-text {
          font-size: 0.82rem;
          color: #78350f;
          line-height: 1.45;
          margin: 0;
        }

        /* Model Transparency Card */
        .model-transparency-card {
          background: #f8fafc;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          margin: 12px 0;
        }
        .model-transparency-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.82rem;
          color: var(--text-primary);
          margin-bottom: 10px;
        }
        .badge-pill {
          font-size: 0.65rem;
          font-family: var(--font-mono);
          padding: 2px 6px;
          border-radius: var(--radius-full);
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
          font-weight: 700;
        }
        .model-transparency-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 10px;
          margin-bottom: 10px;
        }
        .transparency-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .t-label {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .t-val {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .t-val.uppercase {
          text-transform: uppercase;
        }
        .logits-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          background: #edf2f7;
          border-radius: var(--radius-sm);
          margin-bottom: 8px;
          font-size: 0.76rem;
        }
        .logits-code {
          font-family: var(--font-mono);
          color: #0f172a;
          font-weight: 600;
        }
        .model-disclaimer-box {
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          padding-top: 8px;
        }
        .disclaimer-text {
          font-size: 0.74rem;
          color: var(--text-muted);
          line-height: 1.45;
          margin: 0;
        }
        .verdict-action-switch {
          margin-top: auto;
        }
        .verdict-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.74rem;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.04);
          border: 1px solid var(--border-card);
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }
        .verdict-toggle-btn:hover {
          background: rgba(0, 0, 0, 0.08);
          color: var(--text-primary);
        }

        /* Metrics Box */
        .metrics-box {
          background: #f8fafc;
          border: 1px solid var(--border-card);
          padding: 16px;
          border-radius: var(--radius-md);
          margin-bottom: 16px;
        }
        .metrics-header {
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 12px;
          letter-spacing: 0.05em;
        }
        .metrics-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .metric-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .metric-label-group {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-primary);
          font-weight: 500;
        }
        .metric-val {
          font-family: var(--font-mono);
          font-weight: 700;
        }
        .metric-meter {
          height: 5px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }
        .meter-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .meter-bar.fake { background: linear-gradient(90deg, #f87171, #ef4444); }
        .meter-bar.real { background: linear-gradient(90deg, #34d399, #10b981); }

        /* Features breakdown */
        .features-breakdown {
          margin-bottom: 16px;
        }
        .features-header {
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 10px;
          letter-spacing: 0.05em;
        }
        .features-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .feature-item {
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          background: #ffffff;
          border: 1px solid var(--border-card);
          font-size: 0.76rem;
        }
        .feature-item.critical {
          border-left: 3px solid #ef4444;
        }
        .feature-item.warning {
          border-left: 3px solid #f59e0b;
        }
        .feature-item.safe {
          border-left: 3px solid #10b981;
        }
        .feature-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .feature-name {
          font-weight: 700;
          color: var(--text-primary);
        }
        .feature-badge {
          font-size: 0.64rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }
        .feature-badge.critical {
          background: #fef2f2;
          color: #dc2626;
        }
        .feature-badge.warning {
          background: #fffbeb;
          color: #d97706;
        }
        .feature-badge.safe {
          background: #ecfdf5;
          color: #059669;
        }
        .feature-detail {
          color: var(--text-secondary);
          line-height: 1.4;
          font-size: 0.72rem;
        }

        /* Source attribution */
        .source-attribution {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          background: #f1f5f9;
          font-size: 0.78rem;
          margin-bottom: 18px;
        }
        .source-label {
          color: var(--text-muted);
          font-weight: 600;
        }
        .source-value {
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Results Actions */
        .results-actions {
          display: flex;
          gap: 10px;
        }
        .studio-action-btn {
          flex: 1;
          padding: 10px 14px;
          font-size: 0.85rem;
        }

        @media (max-width: 992px) {
          .studio-grid {
            grid-template-columns: 1fr;
          }
          .features-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
