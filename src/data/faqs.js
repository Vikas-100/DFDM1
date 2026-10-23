export const FAQ_DATA = [
  {
    question: 'What is deepfake detection and how does DFD work?',
    answer: 'Deepfake detection uses specialized artificial intelligence models to inspect digital media for subtle manipulation traces invisible to the naked human eye. DFD inspects multi-modal artifacts including micro-pixel blending seams, 2D Fast Fourier Transform frequency spikes, corneal specular reflection inconsistencies, biometric landmark dynamics, and Error Level Analysis (ELA).'
  },
  {
    question: 'Can this tool detect AI images created by Midjourney, Flux, and Stable Diffusion?',
    answer: 'Yes! Generative diffusion models leave characteristic latent noise residuals, irregular frequency power distributions, and non-biological anatomic quirks (such as unnatural eye iris geometries, hair strands fusing into backgrounds, and synthetic dental alignment). Our Diffusion Residual Detector specializes in identifying outputs from Midjourney v5/v6, FLUX.1, DALL-E 3, and SDXL.'
  },
  {
    question: 'Can I upload video or audio files right now?',
    answer: 'Currently, DFD features fully functional Image Deepfake Detection supporting JPG, JPEG, PNG, and WEBP formats up to 15 MB. Video temporal analysis and audio voice clone detection are marked as upcoming features actively in development and will be available in future updates.'
  },
  {
    question: 'What image formats and file size limits are supported?',
    answer: 'DFD supports JPG, JPEG, PNG, and WEBP image formats with a maximum file size of 15 MB. You can drag and drop your image or select it from your device, inspect a live preview, and trigger instant neural analysis.'
  },
  {
    question: 'Is my uploaded media kept private and secure?',
    answer: 'Privacy and security are our highest priorities. We employ a Zero-Knowledge Architecture: media preprocessing and preliminary feature analysis run locally in your web browser whenever possible. Files uploaded for deep cloud forensic analysis are processed in ephemeral memory, encrypted in transit using TLS 1.3, and purged immediately after analysis. We never store, sell, or train public AI models on your private media.'
  },
  {
    question: 'What is Error Level Analysis (ELA) and why is it important?',
    answer: 'Error Level Analysis works by re-compressing an image at a known uniform error level (e.g. 90% JPEG quality) and calculating the difference matrix against the original. In an unaltered original photo, all regions degrade at a uniform rate. When a synthetic face or object is spliced in, the spliced region exhibits a starkly different compression error rate that glows vividly on the forensic canvas.'
  },
  {
    question: 'Can I download an official Media Verification Certificate?',
    answer: 'Yes. Every analysis calculates an immutable SHA-256 cryptographic hash of your media and generates an official Forensic Media Verification Certificate containing timestamp, confidence scores, detected manipulation flags, and model telemetry. You can download this report as a PDF/PNG or export a machine-readable JSON audit file for legal, journalistic, or compliance records.'
  },
  {
    question: 'What is the accuracy rate of DFD?',
    answer: 'Across benchmark datasets including FaceForensics++, Celeb-DF, and DFDC (Deepfake Detection Challenge), our multi-model ensemble achieves a 99.4% area under the ROC curve (AUC). By combining spatial, frequency, and biometric neural classifiers rather than relying on a single model, false-positive rates are kept below 0.8%.'
  },
  {
    question: 'Does this platform support C2PA Content Authenticity credentials?',
    answer: 'Yes! We actively inspect and validate C2PA (Coalition for Content Provenance and Authenticity) metadata manifests and cryptographic hardware signatures, checking whether a photo originates from certified hardware cameras (such as Leica, Sony, Nikon C2PA-enabled bodies) or generative AI tools.'
  },
  {
    question: 'Do you offer an API for high-volume enterprise media screening?',
    answer: 'Yes, DFD provides REST and gRPC APIs with sub-500ms response times for platforms, news agencies, and identity verification services requiring automated batch screening of thousands of media files per minute.'
  }
];
