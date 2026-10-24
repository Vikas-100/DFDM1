import test from 'node:test';
import assert from 'node:assert';
import sharp from 'sharp';
import { 
  softmax, 
  sigmoid, 
  getInferenceSession, 
  runInference, 
  MODEL_REGISTRY 
} from '../server/modelManager.js';
import { preprocessForViT224 } from '../server/preprocessor.js';

test('ModelManager: Numerically stable Softmax converts logits to probabilities', () => {
  // Test simple balanced logits
  const probs = softmax([0, 0]);
  assert.strictEqual(probs.length, 2);
  assert.strictEqual(probs[0].toFixed(2), '0.50');
  assert.strictEqual(probs[1].toFixed(2), '0.50');

  // Test that sum is exactly 1
  const logits = [-0.6383, 0.6184];
  const p = softmax(logits);
  const sum = p.reduce((a, b) => a + b, 0);
  assert(Math.abs(sum - 1.0) < 1e-6, 'Softmax probabilities must sum to 1.0');
  assert(p[1] > p[0], 'Higher logit must have higher probability');

  // Test numerical stability with large numbers (no overflow/NaN)
  const largeLogits = [1000, 1001];
  const largeP = softmax(largeLogits);
  assert(Number.isFinite(largeP[0]) && Number.isFinite(largeP[1]));
  assert(Math.abs(largeP[0] + largeP[1] - 1.0) < 1e-6);
});

test('ModelManager: Sigmoid converts scalar logit to probability in [0, 1]', () => {
  assert.strictEqual(sigmoid(0), 0.5);
  assert(sigmoid(5) > 0.99);
  assert(sigmoid(-5) < 0.01);
  assert(sigmoid(500) <= 1.0);
  assert(sigmoid(-500) >= 0.0);
  assert(Number.isFinite(sigmoid(500)));
  assert(Number.isFinite(sigmoid(-500)));
});

test('ModelManager: Loads verified pretrained ONNX model from repository', async () => {
  assert(MODEL_REGISTRY['deepfake-vit-v2'], 'MODEL_REGISTRY must contain deepfake-vit-v2');
  assert(MODEL_REGISTRY['community-forensics-vit'], 'MODEL_REGISTRY must contain community-forensics-vit');

  const { session, config } = await getInferenceSession('deepfake-vit-v2');
  assert(session, 'ONNX Inference session must be created');
  assert.strictEqual(config.id, 'deepfake-vit-v2');
  assert.strictEqual(config.numClasses, 2);
  assert.strictEqual(config.labels[0], 'Realism');
  assert.strictEqual(config.labels[1], 'Deepfake');
});

test('ModelManager: Runs actual inference and returns genuine predictions', async () => {
  // Create a synthetic image buffer
  const testBuffer = await sharp({
    create: { width: 224, height: 224, channels: 3, background: { r: 120, g: 150, b: 180 } }
  }).jpeg().toBuffer();

  const { floatData, dims } = await preprocessForViT224(testBuffer);
  const result = await runInference(floatData, dims, 'deepfake-vit-v2');

  assert(result.modelName);
  assert.strictEqual(result.activation, 'softmax');
  assert(Array.isArray(result.rawLogits) && result.rawLogits.length === 2);
  assert(result.inferenceDurationMs >= 0);

  const { deepfake, authentic, classBreakdown } = result.probabilities;
  assert(Number.isFinite(deepfake) && deepfake >= 0 && deepfake <= 1);
  assert(Number.isFinite(authentic) && authentic >= 0 && authentic <= 1);
  assert(Math.abs(deepfake + authentic - 1.0) < 1e-5);
  assert.strictEqual(classBreakdown['Deepfake'], deepfake);
  assert.strictEqual(classBreakdown['Realism'], authentic);
});
