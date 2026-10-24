import test from 'node:test';
import assert from 'node:assert';
import http from 'http';
import sharp from 'sharp';
import { createServer } from '../server/index.js';

let server;
let baseUrl;

test.before(async () => {
  const app = createServer();
  await new Promise((resolve) => {
    server = http.createServer(app).listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('API Integration: GET /api/health returns 200 OK and health status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'ok');
  assert(data.service.includes('TruthLens'));
});

test('API Integration: GET /api/model-info returns model architecture and labels', async () => {
  const res = await fetch(`${baseUrl}/api/model-info`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.activeModel, 'deepfake-vit-v2');
  assert(data.modelDetails.name.includes('Vision Transformer'));
  assert.strictEqual(data.modelDetails.labels[0], 'Realism');
  assert.strictEqual(data.modelDetails.labels[1], 'Deepfake');
  assert(data.thresholds);
  assert(Array.isArray(data.supportedOutcomes));
});

test('API Integration: POST /api/detect rejects empty upload with 400 Bad Request', async () => {
  const form = new FormData(); // No file appended

  const res = await fetch(`${baseUrl}/api/detect`, {
    method: 'POST',
    body: form
  });

  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert(data.error.includes('No image file uploaded'));
});

test('API Integration: POST /api/detect rejects corrupted file with 400 Bad Request', async () => {
  const corruptedBlob = new Blob(['THIS_IS_CORRUPTED_NON_IMAGE_BYTES'], { type: 'image/jpeg' });
  const form = new FormData();
  form.append('image', corruptedBlob, 'corrupted.jpg');

  const res = await fetch(`${baseUrl}/api/detect`, {
    method: 'POST',
    body: form
  });

  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.success, false);
  assert(data.error.includes('corrupted') || data.code === 'CORRUPTED_IMAGE');
});

test('API Integration: POST /api/detect performs real inference on valid image', async () => {
  // Generate a valid PNG test image
  const validPng = await sharp({
    create: { width: 256, height: 256, channels: 3, background: { r: 100, g: 140, b: 200 } }
  }).png().toBuffer();

  const blob = new Blob([validPng], { type: 'image/png' });
  const form = new FormData();
  form.append('image', blob, 'sample_test.png');

  const res = await fetch(`${baseUrl}/api/detect`, {
    method: 'POST',
    body: form
  });

  assert.strictEqual(res.status, 200);
  const data = await res.json();

  assert.strictEqual(data.success, true);
  assert(data.analysisId.startsWith('tl-'));
  assert.strictEqual(data.fileInfo.name, 'sample_test.png');
  assert.strictEqual(data.fileInfo.format, 'png');
  assert(data.fileInfo.sha256);

  // Model details check
  assert(data.modelInfo.name.includes('Vision Transformer'));
  assert(Array.isArray(data.modelInfo.rawLogits));
  assert.strictEqual(data.modelInfo.rawLogits.length, 2);

  // Evaluation outcome check
  assert(['Likely Authentic', 'Potentially Manipulated / AI-Generated', 'Inconclusive'].includes(data.evaluation.outcome));
  assert(Number.isFinite(data.evaluation.deepfakeProbability));
  assert(Number.isFinite(data.evaluation.authenticityScore));
  assert(data.evaluation.disclaimer);
});

test('API Integration: Repeated uploads produce distinct analysis IDs and do not reuse stale results', async () => {
  const img1 = await sharp({
    create: { width: 120, height: 120, channels: 3, background: { r: 50, g: 50, b: 50 } }
  }).jpeg().toBuffer();

  const img2 = await sharp({
    create: { width: 120, height: 120, channels: 3, background: { r: 240, g: 240, b: 240 } }
  }).jpeg().toBuffer();

  // First upload
  const form1 = new FormData();
  form1.append('image', new Blob([img1], { type: 'image/jpeg' }), 'first.jpg');
  const res1 = await fetch(`${baseUrl}/api/detect`, { method: 'POST', body: form1 });
  const data1 = await res1.json();

  // Second upload
  const form2 = new FormData();
  form2.append('image', new Blob([img2], { type: 'image/jpeg' }), 'second.jpg');
  const res2 = await fetch(`${baseUrl}/api/detect`, { method: 'POST', body: form2 });
  const data2 = await res2.json();

  assert.notStrictEqual(data1.analysisId, data2.analysisId, 'Analysis IDs must be unique');
  assert.notStrictEqual(data1.fileInfo.sha256, data2.fileInfo.sha256, 'File hashes must differ for different images');
});
