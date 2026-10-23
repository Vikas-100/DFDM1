import test from 'node:test';
import assert from 'node:assert';
import sharp from 'sharp';
import { 
  validateImageBuffer, 
  preprocessForViT224, 
  preprocessForViT384, 
  ValidationError,
  MAX_FILE_SIZE_BYTES 
} from '../server/preprocessor.js';

test('Preprocessor: Rejects empty buffer with clear error', async () => {
  await assert.rejects(
    async () => validateImageBuffer(Buffer.alloc(0), 'empty.jpg'),
    (err) => {
      assert(err instanceof ValidationError);
      assert.strictEqual(err.code, 'EMPTY_UPLOAD');
      assert(err.message.includes('empty'));
      return true;
    }
  );
});

test('Preprocessor: Rejects oversized file (> 15 MB)', async () => {
  const largeBuffer = Buffer.alloc(MAX_FILE_SIZE_BYTES + 1024);
  await assert.rejects(
    async () => validateImageBuffer(largeBuffer, 'large.jpg'),
    (err) => {
      assert(err instanceof ValidationError);
      assert.strictEqual(err.code, 'FILE_TOO_LARGE');
      assert(err.message.includes('exceeds maximum'));
      return true;
    }
  );
});

test('Preprocessor: Rejects corrupted file with clear error', async () => {
  const corruptedBuffer = Buffer.from('NOT_A_REAL_IMAGE_DATA_CORRUPTED');
  await assert.rejects(
    async () => validateImageBuffer(corruptedBuffer, 'corrupted.jpg'),
    (err) => {
      assert(err instanceof ValidationError);
      assert.strictEqual(err.code, 'CORRUPTED_IMAGE');
      assert(err.message.includes('corrupted'));
      return true;
    }
  );
});

test('Preprocessor: Rejects unsupported format (e.g. GIF / SVG / TIFF)', async () => {
  // Generate a valid GIF buffer
  const gifBuffer = await sharp({
    create: {
      width: 50,
      height: 50,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 1 }
    }
  }).gif().toBuffer();

  await assert.rejects(
    async () => validateImageBuffer(gifBuffer, 'test.gif'),
    (err) => {
      assert(err instanceof ValidationError);
      assert.strictEqual(err.code, 'UNSUPPORTED_FORMAT');
      assert(err.message.includes('JPG, JPEG, PNG, and WEBP'));
      return true;
    }
  );
});

test('Preprocessor: Supports and validates JPG, JPEG, PNG, WEBP', async () => {
  // Test JPG
  const jpegBuffer = await sharp({
    create: { width: 100, height: 100, channels: 3, background: { r: 128, g: 128, b: 128 } }
  }).jpeg().toBuffer();
  const metaJpg = await validateImageBuffer(jpegBuffer, 'sample.jpg');
  assert.strictEqual(metaJpg.format, 'jpeg');

  // Test PNG
  const pngBuffer = await sharp({
    create: { width: 100, height: 100, channels: 4, background: { r: 0, g: 255, b: 0, alpha: 0.8 } }
  }).png().toBuffer();
  const metaPng = await validateImageBuffer(pngBuffer, 'sample.png');
  assert.strictEqual(metaPng.format, 'png');

  // Test WEBP
  const webpBuffer = await sharp({
    create: { width: 100, height: 100, channels: 3, background: { r: 0, g: 0, b: 255 } }
  }).webp().toBuffer();
  const metaWebp = await validateImageBuffer(webpBuffer, 'sample.webp');
  assert.strictEqual(metaWebp.format, 'webp');
});

test('Preprocessor: Correctly resizes, converts RGB, and normalizes for ViT-224', async () => {
  // Create an RGBA test image with non-square dimensions (300 x 200)
  const rgbaBuffer = await sharp({
    create: { width: 300, height: 200, channels: 4, background: { r: 200, g: 100, b: 50, alpha: 0.5 } }
  }).png().toBuffer();

  const result = await preprocessForViT224(rgbaBuffer);

  // Check tensor dimensions [1, 3, 224, 224]
  assert.deepStrictEqual(result.dims, [1, 3, 224, 224]);
  assert.strictEqual(result.floatData.length, 3 * 224 * 224);

  // Check normalized values are finite and within normalized range
  for (let i = 0; i < 100; i++) {
    const val = result.floatData[i];
    assert(Number.isFinite(val), `Value at index ${i} must be finite`);
    assert(val >= -2.0 && val <= 2.0, `Normalized value ${val} should be in reasonable range`);
  }
});
