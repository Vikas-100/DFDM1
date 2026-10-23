import { getAssetUrl } from '../utils/assets.js';

const RAW_PRESETS = [
  {
    id: 'preset-face-swap',
    name: 'AI Face Swap (Deepfake)',
    type: 'image',
    tag: 'Deepfake Detected',
    badge: 'InsightFace / SimSwap',
    src: '/assets/hero_fake.jpg',
    isFake: true,
    outcome: 'Potentially Manipulated / AI-Generated',
    outcomeKey: 'manipulated',
    authenticityScore: 4.8,
    deepfakeProbability: 95.2,
    verdict: 'POTENTIALLY MANIPULATED / AI-GENERATED',
    modelConfidence: {
      spatial: 96.2,
      frequency: 93.8,
      biometric: 95.4,
      corneal: 92.1,
      provenance: 96.5
    },
    manipulationFeatures: [
      {
        feature: 'Synthetic Blending Boundary Seam',
        status: 'FLAGGED',
        severity: 'critical',
        detail: 'Discontinuous gradient boundary detected along jawline and neck transition zone (ΔE = 8.4).'
      },
      {
        feature: 'Asymmetric Corneal Reflection Physics',
        status: 'FLAGGED',
        severity: 'critical',
        detail: 'Right eye specular highlight angle differs by 18° from ambient room illumination source.'
      },
      {
        feature: 'High-Frequency Convolutional Checkerboard',
        status: 'FLAGGED',
        severity: 'warning',
        detail: '2D Fourier power spectrum reveals periodic checkerboard lattice spikes characteristic of neural upsampling.'
      },
      {
        feature: 'Skin Pore Frequency Attenuation',
        status: 'FLAGGED',
        severity: 'warning',
        detail: 'Artificial bilinear smoothing across forehead and cheekbones with loss of high-pass pore definition.'
      }
    ],
    technicalSummary: 'Facial region was synthesized onto source body using latent feature replacement. Mask boundary seam exhibits pixel-level color jitter and missing micro-displacement.',
    estimatedSource: 'InsightFace / Roop Latent Face Swap Neural Pipeline',
    disclaimer: 'AI media detection generates probabilistic assessments based on learned artifact patterns. Models should be corroborated with provenance headers and forensic analysis.'
  },
  {
    id: 'preset-midjourney',
    name: 'Midjourney v6 Diffusion',
    type: 'image',
    tag: 'Synthetic Generation',
    badge: 'Diffusion Model',
    src: '/assets/sample_midjourney.jpg',
    isFake: true,
    outcome: 'Potentially Manipulated / AI-Generated',
    outcomeKey: 'manipulated',
    authenticityScore: 1.1,
    deepfakeProbability: 98.9,
    verdict: 'POTENTIALLY MANIPULATED / AI-GENERATED',
    modelConfidence: {
      spatial: 99.4,
      frequency: 98.7,
      biometric: 98.1,
      corneal: 99.2,
      provenance: 99.0
    },
    manipulationFeatures: [
      {
        feature: 'Generative Diffusion Residual Noise',
        status: 'FLAGGED',
        severity: 'critical',
        detail: 'Latent diffusion denoiser fingerprint identified. Noise distribution deviates from Poisson-Gaussian camera sensor physics.'
      },
      {
        feature: 'Pupil & Iris Pattern Asymmetry',
        status: 'FLAGGED',
        severity: 'critical',
        detail: 'Geometric iris contraction does not follow anatomical circular curvature; synthetic polygonal pupil edges.'
      },
      {
        feature: 'Hair Strand Structural Hallucinations',
        status: 'FLAGGED',
        severity: 'warning',
        detail: 'Non-continuous hair geometry fusing into surrounding ear cartilage without physical root attachment.'
      },
      {
        feature: 'Cryptographic EXIF Signature Missing',
        status: 'FLAGGED',
        severity: 'warning',
        detail: 'Missing original camera raw sensor serialization and embedded shutter telemetry.'
      }
    ],
    technicalSummary: 'Full synthetic image created by iterative latent diffusion. No genuine optical capture characteristics detected.',
    estimatedSource: 'Midjourney v6 / SDXL Generative Diffusion',
    disclaimer: 'AI media detection generates probabilistic assessments based on learned artifact patterns. Models should be corroborated with provenance headers and forensic analysis.'
  },
  {
    id: 'preset-real-portrait',
    name: 'Authentic DSLR Portrait',
    type: 'image',
    tag: 'Authentic Media',
    badge: 'DSLR Camera Raw',
    src: '/assets/hero_real.jpg',
    isFake: false,
    outcome: 'Likely Authentic',
    outcomeKey: 'authentic',
    authenticityScore: 98.6,
    deepfakeProbability: 1.4,
    verdict: 'LIKELY AUTHENTIC MEDIA VERIFIED',
    modelConfidence: {
      spatial: 99.1,
      frequency: 98.4,
      biometric: 99.0,
      corneal: 97.8,
      provenance: 98.2
    },
    manipulationFeatures: [
      {
        feature: 'Natural Skin Micro-Texture & Pore Frequency',
        status: 'PASSED',
        severity: 'safe',
        detail: 'Continuous Gaussian sensor noise pattern (PRNU) consistent with 35mm optical camera sensor.'
      },
      {
        feature: 'Corneal Specular Reflection Consistency',
        status: 'PASSED',
        severity: 'safe',
        detail: 'Bilateral iris reflections match environmental window light source position and angle.'
      },
      {
        feature: 'Facial Boundary & Jawline Gradient',
        status: 'PASSED',
        severity: 'safe',
        detail: 'Seamless organic blending between facial contours, beard hair follicles, and shirt collar.'
      },
      {
        feature: '2D FFT Fourier Power Spectrum',
        status: 'PASSED',
        severity: 'safe',
        detail: 'Follows natural 1/f spatial frequency falloff with zero artificial upsampling lattice spikes.'
      }
    ],
    technicalSummary: 'Ensemble model scan shows zero evidence of deep learning diffusion or generative adversarial interpolation. Sensor noise matches natural silicon photodiode response.',
    estimatedSource: 'Canon EOS 5D Mark IV / 50mm f/1.8 lens optical capture',
    disclaimer: 'A "Likely Authentic" result indicates no detectable manipulation signatures were identified by the model, but is not an absolute warranty against novel or undetectable editing techniques.'
  },
  {
    id: 'preset-inconclusive',
    name: 'Ambiguous Compression Seam',
    type: 'image',
    tag: 'Inconclusive Result',
    badge: 'Indeterminate Margin',
    src: '/assets/usecase_journalism.jpg',
    isFake: false,
    isInconclusive: true,
    outcome: 'Inconclusive',
    outcomeKey: 'inconclusive',
    authenticityScore: 52.4,
    deepfakeProbability: 47.6,
    confidenceScore: 52.4,
    verdict: 'INCONCLUSIVE FORENSIC RESULT',
    inconclusiveReason: 'Model confidence margin (4.8%) is below the reliability threshold (25.0%). The image exhibits conflicting latent noise signatures and heavy recompression artifacts, preventing a conclusive determination.',
    modelConfidence: {
      spatial: 51.2,
      frequency: 48.5,
      biometric: 53.0,
      corneal: 49.8,
      provenance: 50.5
    },
    manipulationFeatures: [
      {
        feature: 'Vision Transformer Attention Patch Distribution',
        status: 'INDETERMINATE',
        severity: 'warning',
        detail: 'Conflicting latent activations between natural photographic scene and digital broadcast studio graphics.'
      },
      {
        feature: 'Error Level Compression Boundary Profile',
        status: 'INDETERMINATE',
        severity: 'warning',
        detail: 'Multi-generational social media re-compression masks primary optical sensor noise characteristics.'
      },
      {
        feature: 'Biometric & Ambient Lighting Physics',
        status: 'PASSED',
        severity: 'safe',
        detail: 'Facial planes align consistently with multiple monitor illumination sources.'
      }
    ],
    technicalSummary: 'Forensic evaluation yielded an inconclusive outcome. Confidence margin falls within the indeterminate decision region (35%–65%). Media cannot be definitively classified as authentic or manipulated without secondary sensor corroboration.',
    estimatedSource: 'Multi-Compressed Digital Broadcast Stream',
    disclaimer: 'AI media detection generates probabilistic assessments based on learned artifact patterns. An inconclusive result indicates that evidence is ambiguous and cannot be certified.'
  },
  {
    id: 'preset-video-deepfake',
    name: 'AI Video Deepfake (Lip-Sync)',
    type: 'video',
    tag: 'Deepfake Video',
    badge: 'Wav2Lip / LivePortrait',
    src: '/assets/type_video.jpg',
    isFake: true,
    authenticityScore: 3.4,
    deepfakeProbability: 96.6,
    verdict: 'AI-GENERATED / VIDEO DEEPFAKE DETECTED',
    modelConfidence: {
      spatial: 97.3,
      frequency: 95.1,
      biometric: 96.8,
      corneal: 94.2,
      provenance: 98.0
    },
    manipulationFeatures: [
      {
        feature: 'Temporal Facial Boundary Jitter & Mask Seam',
        status: 'FLAGGED',
        severity: 'critical',
        detail: 'Discontinuous optical flow across frames along facial mask perimeter; inter-frame boundary flicker ΔV = 14.2px.'
      },
      {
        feature: 'Audio-Visual Viseme Lip-Sync Drift',
        status: 'FLAGGED',
        severity: 'critical',
        detail: 'SyncNet confidence dropped to 0.28; mouth articulation visemes lag acoustic speech phonemes by 72ms.'
      },
      {
        feature: 'Latent Background Texture Warping',
        status: 'FLAGGED',
        severity: 'warning',
        detail: 'High-frequency background grid distortion around head movement contours indicating neural upsampling morphing.'
      },
      {
        feature: 'Missing Camera Hardware GOP Metadata',
        status: 'FLAGGED',
        severity: 'warning',
        detail: 'Stream lacks professional camera SMPTE serialization, hardware timecode, and optical shutter telemetry.'
      }
    ],
    technicalSummary: 'Video stream contains synthetic lip synchronization and neural facial reenactment. Motion vectors exhibit temporal warping and unnatural viseme phase delay.',
    estimatedSource: 'Wav2Lip / DeepFaceLive / Runway Gen-3 Neural Pipeline'
  },
  {
    id: 'preset-video-news',
    name: 'Broadcast Video Clip',
    type: 'video',
    tag: 'Authentic Video',
    badge: 'Live News Feed',
    src: '/assets/type_video.jpg',
    isFake: false,
    authenticityScore: 97.4,
    deepfakeProbability: 2.6,
    verdict: 'AUTHENTIC BROADCAST STREAM',
    modelConfidence: {
      spatial: 98.0,
      frequency: 96.8,
      biometric: 97.5,
      corneal: 97.0,
      provenance: 97.7
    },
    manipulationFeatures: [
      {
        feature: 'Audio-Visual Phoneme Lip-Sync Alignment',
        status: 'PASSED',
        severity: 'safe',
        detail: 'SyncNet mouth viseme landmarks match spoken acoustic speech formant frequencies within 12ms.'
      },
      {
        feature: 'Natural Eye Saccades & Blink Distribution',
        status: 'PASSED',
        severity: 'safe',
        detail: 'Blink rate follows standard human spontaneous distribution (14.2 blinks/min) with natural eye saccades.'
      },
      {
        feature: 'Temporal Inter-Frame Continuity',
        status: 'PASSED',
        severity: 'safe',
        detail: 'Consistent motion vectors across 120 keyframes without warping or boundary ghosting.'
      },
      {
        feature: 'Broadcast Hardware Encoding Signature',
        status: 'PASSED',
        severity: 'safe',
        detail: 'SMPTE timecode telemetry and broadcast encoder GOP structure verified intact.'
      }
    ],
    technicalSummary: 'Multi-frame temporal inspection confirmed authentic biological speaker movement and synchronized live acoustics.',
    estimatedSource: 'Professional Sony Venice 2 Broadcast Camera'
  },
  {
    id: 'preset-audio-clone',
    name: 'AI Voice Clone / Scam Call',
    type: 'audio',
    tag: 'Synthetic Audio',
    badge: 'Neural Vocoder Clone',
    src: '/assets/type_audio.jpg',
    isFake: true,
    authenticityScore: 2.8,
    deepfakeProbability: 97.2,
    verdict: 'SYNTHETIC VOICE CLONE DETECTED',
    modelConfidence: {
      spatial: 94.0,
      frequency: 97.8,
      biometric: 96.5,
      corneal: 95.0,
      provenance: 97.4
    },
    manipulationFeatures: [
      {
        feature: 'Neural Vocoder High-Frequency Cliff (>16kHz)',
        status: 'FLAGGED',
        severity: 'critical',
        detail: 'Sharp phase cutoff at 16kHz characteristic of HiFi-GAN and BigVGAN neural speech synthesis models.'
      },
      {
        feature: 'Robotic Pitch Jitter & Quantization',
        status: 'FLAGGED',
        severity: 'critical',
        detail: 'Absence of biological laryngeal micro-tremors (F0 jitter 0.11% vs natural human baseline of 0.85%).'
      },
      {
        feature: 'Glottal Pulse Shape Inconsistency',
        status: 'FLAGGED',
        severity: 'warning',
        detail: 'Synthetic excitation waveform lacks natural respiratory airflow turbulence and vocal cord asymmetry.'
      },
      {
        feature: 'Acoustic Room Impulse Incongruity',
        status: 'FLAGGED',
        severity: 'warning',
        detail: 'Flat synthetic speech envelope with absence of physical environmental acoustic reverberation.'
      }
    ],
    technicalSummary: 'Audio track was generated using zero-shot voice cloning with latent speech transformer and neural vocoder. Spectral cutoff and pitch quantization confirmed.',
    estimatedSource: 'ElevenLabs / VALL-E Neural Speech Cloner'
  },
  {
    id: 'preset-audio-real',
    name: 'Authentic Studio Voice',
    type: 'audio',
    tag: 'Authentic Voice',
    badge: 'Studio Microphone',
    src: '/assets/type_audio.jpg',
    isFake: false,
    authenticityScore: 98.4,
    deepfakeProbability: 1.6,
    verdict: 'AUTHENTIC ACOUSTIC SPEECH CONFIRMED',
    modelConfidence: {
      spatial: 98.5,
      frequency: 98.2,
      biometric: 98.0,
      corneal: 97.5,
      provenance: 98.8
    },
    manipulationFeatures: [
      {
        feature: 'Natural Human Vocal Micro-Tremors',
        status: 'PASSED',
        severity: 'safe',
        detail: 'Organic F0 pitch jitter measured at 0.92% with natural biological breathing pauses.'
      },
      {
        feature: 'Continuous Full-Band Acoustic Spectrum',
        status: 'PASSED',
        severity: 'safe',
        detail: 'Smooth natural harmonic roll-off up to 22.05kHz with zero artificial vocoder brickwall filter cuts.'
      },
      {
        feature: 'Authentic Room Acoustic Decay',
        status: 'PASSED',
        severity: 'safe',
        detail: 'Coherent acoustic reverberation matching physical studio diaphragm microphone placement.'
      },
      {
        feature: 'Analog Dynamic Transducer Response',
        status: 'PASSED',
        severity: 'safe',
        detail: 'Verified organic analog wave pressure without discrete neural latent quantization.'
      }
    ],
    technicalSummary: 'Acoustic inspection verified natural biological vocal cord dynamics, rich harmonic formant structures, and authentic physical room impulse response.',
    estimatedSource: 'Shure SM7B Dynamic Studio Microphone'
  }
];

export const SAMPLE_PRESETS = RAW_PRESETS.map((p) => ({
  ...p,
  src: getAssetUrl(p.src)
}));

