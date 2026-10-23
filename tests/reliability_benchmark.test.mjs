import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { 
  preprocessForViT224, 
  preprocessForViT384, 
  validateImageBuffer, 
  ValidationError 
} from '../server/preprocessor.js';
import { 
  runEnsembleInference 
} from '../server/modelManager.js';
import { 
  evaluatePrediction, 
  OUTCOMES 
} from '../server/evaluator.js';

const realDir = path.resolve('tests/fixtures/real');
const fakeDir = path.resolve('tests/fixtures/fake');

test('Benchmark: Authentic camera photographs produce zero false positives', async () => {
  const realFiles = fs.readdirSync(realDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  assert(realFiles.length >= 5, 'Must have at least 5 benchmark real images');

  let falsePositives = 0;
  const evaluationResults = [];

  for (const filename of realFiles) {
    const buffer = fs.readFileSync(path.join(realDir, filename));
    const inferenceResult = await runEnsembleInference(buffer, {
      preprocessForViT224,
      preprocessForViT384
    });

    const evaluation = evaluatePrediction({
      probabilities: inferenceResult.probabilities,
      rawLogits: inferenceResult.rawLogits,
      modelName: inferenceResult.modelName,
      architecture: inferenceResult.architecture,
      fileName: filename,
      imageMetadata: inferenceResult.metadata
    });

    evaluationResults.push({
      file: filename,
      pFake: inferenceResult.probabilities.deepfake,
      outcome: evaluation.outcome,
      verdict: evaluation.verdict
    });

    if (evaluation.outcome === OUTCOMES.MANIPULATED) {
      falsePositives++;
    }
  }

  console.log('\n--- Authentic Photos Reliability Report ---');
  for (const res of evaluationResults) {
    console.log(`[Real] ${res.file.padEnd(28)}: P(Fake)=${(res.pFake * 100).toFixed(1)}% | Outcome: ${res.outcome}`);
  }

  // Critical requirement: ZERO false positives on genuine photographs
  assert.strictEqual(
    falsePositives, 
    0, 
    `False positive rate must be 0%. Found ${falsePositives} false positives.`
  );
});

test('Benchmark: Synthetic deepfakes are reliably caught without being labeled authentic', async () => {
  const fakeFiles = fs.readdirSync(fakeDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  assert(fakeFiles.length >= 5, 'Must have at least 5 benchmark fake images');

  let falseNegatives = 0; // fakes wrongly classified as authentic
  let caughtFakes = 0;
  const evaluationResults = [];

  for (const filename of fakeFiles) {
    const buffer = fs.readFileSync(path.join(fakeDir, filename));
    const inferenceResult = await runEnsembleInference(buffer, {
      preprocessForViT224,
      preprocessForViT384
    });

    const evaluation = evaluatePrediction({
      probabilities: inferenceResult.probabilities,
      rawLogits: inferenceResult.rawLogits,
      modelName: inferenceResult.modelName,
      architecture: inferenceResult.architecture,
      fileName: filename,
      imageMetadata: inferenceResult.metadata
    });

    evaluationResults.push({
      file: filename,
      pFake: inferenceResult.probabilities.deepfake,
      outcome: evaluation.outcome,
      verdict: evaluation.verdict
    });

    if (evaluation.outcome === OUTCOMES.AUTHENTIC) {
      falseNegatives++;
    }
    if (evaluation.outcome === OUTCOMES.MANIPULATED) {
      caughtFakes++;
    }
  }

  console.log('\n--- AI Synthetic Photos Detection Report ---');
  for (const res of evaluationResults) {
    console.log(`[Fake] ${res.file.padEnd(28)}: P(Fake)=${(res.pFake * 100).toFixed(1)}% | Outcome: ${res.outcome}`);
  }

  // Fakes must never be certified as Authentic
  assert.strictEqual(falseNegatives, 0, 'No deepfake should ever be classified as Likely Authentic');
  assert(caughtFakes > 0, 'At least some deepfakes must be detected with high confidence');
});

test('Benchmark: Compressed, resized, and grayscale images are handled robustly without false alarms', async () => {
  const sourceImage = fs.readFileSync(path.join(realDir, 'kodak_dog_real.jpg'));

  // 1. High compression JPEG (quality = 40)
  const compressedJpg = await sharp(sourceImage).jpeg({ quality: 40 }).toBuffer();
  // 2. Heavy downscale (120 x 94)
  const downscaledJpg = await sharp(sourceImage).resize(120, 94).jpeg().toBuffer();
  // 3. Grayscale conversion (1 channel)
  const grayscaleJpg = await sharp(sourceImage).grayscale().jpeg().toBuffer();

  const testVariants = [
    { name: 'compressed_q40.jpg', buf: compressedJpg },
    { name: 'downscaled_120px.jpg', buf: downscaledJpg },
    { name: 'grayscale_dog.jpg', buf: grayscaleJpg }
  ];

  for (const variant of testVariants) {
    const inferenceResult = await runEnsembleInference(variant.buf, {
      preprocessForViT224,
      preprocessForViT384
    });

    const evaluation = evaluatePrediction({
      probabilities: inferenceResult.probabilities,
      rawLogits: inferenceResult.rawLogits,
      modelName: inferenceResult.modelName,
      architecture: inferenceResult.architecture,
      fileName: variant.name,
      imageMetadata: inferenceResult.metadata
    });

    console.log(`[Variant] ${variant.name.padEnd(24)}: P(Fake)=${(inferenceResult.probabilities.deepfake * 100).toFixed(1)}% | Outcome: ${evaluation.outcome}`);

    // Must NOT false alarm as MANIPULATED
    assert.notStrictEqual(
      evaluation.outcome, 
      OUTCOMES.MANIPULATED, 
      `Degraded real image '${variant.name}' must not trigger false positive Manipulated verdict`
    );
  }
});

test('Benchmark: Invalid and unsupported uploads fail safely with clear validation errors', async () => {
  // Empty upload
  await assert.rejects(
    async () => validateImageBuffer(Buffer.alloc(0), 'empty.jpg'),
    (err) => err instanceof ValidationError && err.code === 'EMPTY_UPLOAD'
  );

  // Corrupted bytes
  await assert.rejects(
    async () => validateImageBuffer(Buffer.from('corrupted_random_bytes_not_an_image'), 'corrupted.jpg'),
    (err) => err instanceof ValidationError && err.code === 'CORRUPTED_IMAGE'
  );

  // Unsupported format (SVG)
  const svgBuffer = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>');
  await assert.rejects(
    async () => validateImageBuffer(svgBuffer, 'circle.svg'),
    (err) => err instanceof ValidationError && err.code === 'UNSUPPORTED_FORMAT'
  );
});

test('Benchmark: Mathematical Confusion Matrix and Forensic Metric Verification', async () => {
  const realFiles = fs.readdirSync(realDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  const fakeFiles = fs.readdirSync(fakeDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

  let tp = 0; // True Positive: Fake classified as Manipulated
  let fp = 0; // False Positive: Real classified as Manipulated
  let tn = 0; // True Negative: Real classified as Authentic
  let fn = 0; // False Negative: Fake classified as Authentic
  let inconclusiveReal = 0;
  let inconclusiveFake = 0;

  for (const filename of realFiles) {
    const buf = fs.readFileSync(path.join(realDir, filename));
    const res = await runEnsembleInference(buf, { preprocessForViT224, preprocessForViT384 });
    const evalResult = evaluatePrediction({
      probabilities: res.probabilities,
      rawLogits: res.rawLogits,
      modelName: res.modelName,
      architecture: res.architecture,
      fileName: filename,
      imageMetadata: res.metadata
    });

    if (evalResult.outcome === OUTCOMES.MANIPULATED) fp++;
    else if (evalResult.outcome === OUTCOMES.AUTHENTIC) tn++;
    else inconclusiveReal++;
  }

  for (const filename of fakeFiles) {
    const buf = fs.readFileSync(path.join(fakeDir, filename));
    const res = await runEnsembleInference(buf, { preprocessForViT224, preprocessForViT384 });
    const evalResult = evaluatePrediction({
      probabilities: res.probabilities,
      rawLogits: res.rawLogits,
      modelName: res.modelName,
      architecture: res.architecture,
      fileName: filename,
      imageMetadata: res.metadata
    });

    if (evalResult.outcome === OUTCOMES.MANIPULATED) tp++;
    else if (evalResult.outcome === OUTCOMES.AUTHENTIC) fn++;
    else inconclusiveFake++;
  }

  const falsePositiveRate = (fp + tn) > 0 ? (fp / (fp + tn)) : 0;
  const precision = (tp + fp) > 0 ? (tp / (tp + fp)) : 0;

  console.log('\n=============================================================');
  console.log('BENCHMARK EVALUATION METRICS');
  console.log('=============================================================');
  console.log(`Total Genuine Tested:  ${realFiles.length} (Inconclusive: ${inconclusiveReal}, Real: ${tn}, False Positives: ${fp})`);
  console.log(`Total AI Fakes Tested: ${fakeFiles.length} (Inconclusive: ${inconclusiveFake}, Caught Manipulated: ${tp}, False Negatives: ${fn})`);
  console.log(`False Positive Rate:   ${(falsePositiveRate * 100).toFixed(2)}%`);
  console.log(`Precision:             ${(precision * 100).toFixed(2)}%`);
  console.log('=============================================================\n');

  assert.strictEqual(fp, 0, 'False Positives must be exactly 0');
  assert.strictEqual(falsePositiveRate, 0, 'False Positive Rate must be 0%');
  assert(precision === 1.0, 'Precision on decided positive classifications must be 100%');
});
