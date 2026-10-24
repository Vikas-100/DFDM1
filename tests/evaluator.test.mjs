import test from 'node:test';
import assert from 'node:assert';
import { 
  evaluatePrediction, 
  OUTCOMES, 
  THRESHOLDS 
} from '../server/evaluator.js';

test('Evaluator: High deepfake probability yields "Potentially Manipulated / AI-Generated"', () => {
  const result = evaluatePrediction({
    probabilities: { deepfake: 0.85, authentic: 0.15 },
    rawLogits: [-1.2, 1.8],
    modelName: 'Vision Transformer Deepfake Detector v2',
    architecture: 'ViTForImageClassification',
    fileName: 'test_fake.jpg',
    imageMetadata: { width: 1024, height: 1024, format: 'jpeg' }
  });

  assert.strictEqual(result.outcome, OUTCOMES.MANIPULATED);
  assert.strictEqual(result.outcomeKey, 'manipulated');
  assert.strictEqual(result.isFake, true);
  assert.strictEqual(result.isAuthentic, false);
  assert.strictEqual(result.isInconclusive, false);
  assert.strictEqual(result.deepfakeProbability, 85.0);
  assert.strictEqual(result.authenticityScore, 15.0);
  assert(result.verdict.includes('POTENTIALLY MANIPULATED'));
});

test('Evaluator: Low deepfake probability yields "Likely Authentic"', () => {
  const result = evaluatePrediction({
    probabilities: { deepfake: 0.10, authentic: 0.90 },
    rawLogits: [2.1, -1.8],
    modelName: 'Vision Transformer Deepfake Detector v2',
    architecture: 'ViTForImageClassification',
    fileName: 'test_authentic.jpg',
    imageMetadata: { width: 1920, height: 1080, format: 'png' }
  });

  assert.strictEqual(result.outcome, OUTCOMES.AUTHENTIC);
  assert.strictEqual(result.outcomeKey, 'authentic');
  assert.strictEqual(result.isFake, false);
  assert.strictEqual(result.isAuthentic, true);
  assert.strictEqual(result.isInconclusive, false);
  assert.strictEqual(result.authenticityScore, 90.0);
  assert.strictEqual(result.deepfakeProbability, 10.0);
  assert(result.verdict.includes('LIKELY AUTHENTIC'));
  // Ensure cautious phrasing: does not claim 100% authenticity guarantee
  assert(result.disclaimer.includes('probabilistic assessments'));
});

test('Evaluator: Ambiguous decision boundary (low margin) yields "Inconclusive"', () => {
  // Probabilities are close (e.g. 52% fake, 48% real)
  const result = evaluatePrediction({
    probabilities: { deepfake: 0.52, authentic: 0.48 },
    rawLogits: [0.05, 0.10],
    modelName: 'Vision Transformer Deepfake Detector v2',
    architecture: 'ViTForImageClassification',
    fileName: 'test_ambiguous.jpg',
    imageMetadata: { width: 800, height: 600, format: 'jpeg' }
  });

  assert.strictEqual(result.outcome, OUTCOMES.INCONCLUSIVE);
  assert.strictEqual(result.outcomeKey, 'inconclusive');
  assert.strictEqual(result.isInconclusive, true);
  assert.strictEqual(result.isFake, false);
  assert.strictEqual(result.isAuthentic, false);
  assert(result.inconclusiveReason);
  assert(result.inconclusiveReason.includes('Ambiguous') || result.inconclusiveReason.includes('indeterminate'));
  assert(result.verdict.includes('INCONCLUSIVE'));
});

test('Evaluator: Borderline separation (< 25% margin) yields "Inconclusive"', () => {
  // 60% fake vs 40% real (margin is 20%, below 25% threshold)
  const result = evaluatePrediction({
    probabilities: { deepfake: 0.60, authentic: 0.40 },
    rawLogits: [0.2, 0.4],
    modelName: 'Vision Transformer Deepfake Detector v2',
    architecture: 'ViTForImageClassification',
    fileName: 'borderline.jpg',
    imageMetadata: { width: 500, height: 500, format: 'webp' }
  });

  assert.strictEqual(result.outcome, OUTCOMES.INCONCLUSIVE);
  assert.strictEqual(result.isInconclusive, true);
});

test('Evaluator: Safety guarantees - Never claims 100% accuracy or fabricated scores', () => {
  const result = evaluatePrediction({
    probabilities: { deepfake: 0.999, authentic: 0.001 },
    rawLogits: [-5.0, 5.0],
    modelName: 'Vision Transformer Deepfake Detector v2',
    architecture: 'ViTForImageClassification',
    fileName: 'high_score.jpg',
    imageMetadata: { width: 512, height: 512, format: 'jpeg' }
  });

  // Model confidence must match raw probability mathematically, not fabricated 100%
  assert.strictEqual(result.modelConfidence, 99.9);
  assert.notStrictEqual(result.modelConfidence, 100);
  assert(THRESHOLDS.HIGH_CONFIDENCE_FAKE > 0.5);
  assert(THRESHOLDS.HIGH_CONFIDENCE_REAL < 0.5);
  assert(THRESHOLDS.MIN_CONFIDENCE_MARGIN > 0.1);
});
