import { getAssetUrl } from '../utils/assets.js';

const RAW_USE_CASES = [
  {
    id: 'teachers',
    badge: 'Education & Academia',
    title: 'Teachers Spotting Fake Historical Photos',
    description: 'Educators and history researchers frequently encounter viral AI-generated imagery depicting fabricated historical events, fake speeches, and doctored war photographs. DFD enables rapid authentication of archival images by checking photographic grain distribution, optical lens aberrations, and chronological metadata.',
    stats: '99.8% Accuracy on Vintage & Archival Scans',
    points: [
      'Detects synthetic aging filters versus genuine photographic emulsions',
      'Validates historical photographic technology constraints (shutter speed, grain structure)',
      'Provides clear visual explanations suitable for classroom analysis and critical thinking'
    ],
    image: '/assets/usecase_history.jpg',
    ctaText: 'Verify Historical Media'
  },
  {
    id: 'journalists',
    badge: 'Newsrooms & Fact-Checkers',
    title: 'Journalists Verifying Viral Media & Photos',
    description: 'In breaking news situations, malicious actors flood social media with deceptive deepfake photos and images depicting political leaders and armed conflicts. Fact-checking desks use DFD to verify viral image claims in seconds before publishing, preventing the spread of dangerous disinformation.',
    stats: 'Sub-second Verification on Live Images',
    points: [
      'Error Level Analysis (ELA) for image splicing and face-swap seam detection',
      'Instant Fourier frequency lattice scan for diffusion fingerprints',
      'Downloadable cryptographic audit certificates for editorial attribution and trust'
    ],
    image: '/assets/usecase_journalism.jpg',
    ctaText: 'Verify Breaking News'
  },
  {
    id: 'creators',
    badge: 'Content Creators & Artists',
    title: 'Creators Protecting Their Online Content',
    description: 'Digital artists, influencers, and photographers face identity theft where bad actors clone their faces and artwork to run illicit endorsements and impersonation scams. DFD empowers creators with verifiable cryptographic authenticity tags and rapid reporting tools to defend their digital likeness.',
    stats: 'Protected 85,000+ Creator Likenesses Worldwide',
    points: [
      'C2PA Content Credentials embedding to prove authentic human creation',
      'Continuous monitoring and fingerprinting for face swaps and diffusion steals',
      'Legally admissible tamper documentation for DMCA takedowns and identity defense'
    ],
    image: '/assets/usecase_creators.jpg',
    ctaText: 'Protect Your Identity'
  },
  {
    id: 'families',
    badge: 'Consumer & Family Defense',
    title: 'Families Catching Manipulated Photos & Identity Scams',
    description: 'Criminal syndicates now create synthetic photos and fake documents to run extortion and identity fraud scams. DFD analyzes incoming images to instantly identify synthetic facial artifacts and protect vulnerable families from fraud.',
    stats: 'Zero-Lag Acoustic Spectrogram Analysis',
    points: [
      'Catches synthetic vocoder pitch quantization in under 2 seconds of speech',
      'Zero-storage privacy architecture protects sensitive family phone conversations',
      'Clear, high-contrast alerts that non-technical seniors and families can understand immediately'
    ],
    image: '/assets/usecase_scamcall.jpg',
    ctaText: 'Analyze Suspicious Audio'
  }
];

export const USE_CASES = RAW_USE_CASES.map((u) => ({
  ...u,
  image: getAssetUrl(u.image)
}));

