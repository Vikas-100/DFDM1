import sharp from 'sharp';

/**
 * Image Preprocessing and Validation Pipeline for AI Deepfake Detection.
 * Supports JPG, JPEG, PNG, and WEBP formats.
 * Handles corrupted images, unsupported formats, oversized files, RGB conversion,
 * and tensor normalization for Vision Transformer (ViT) architectures.
 */

// Permitted MIME types and file extensions
export const SUPPORTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]);

export const SUPPORTED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp'
]);

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB limit

// Normalization constants for ViT architectures
// ViT-224 (ImageNet/ViT standard rescaling: [-1, 1])
export const VIT_224_CONFIG = {
  width: 224,
  height: 224,
  mean: [0.5, 0.5, 0.5],
  std: [0.5, 0.5, 0.5],
  rescale: 1 / 255.0
};

// ViT-384 / CommunityForensics (CLIP normalization)
export const VIT_384_CONFIG = {
  shortestEdge: 440,
  cropSize: 384,
  mean: [0.48145466, 0.4578275, 0.40821073],
  std: [0.26862954, 0.26130258, 0.27577711],
  rescale: 1 / 255.0
};

/**
 * Validates raw file buffer, format, and metadata.
 * Throws descriptive Error if invalid, corrupted, or unsupported.
 */
export async function validateImageBuffer(buffer, originalFilename = '', mimeType = '') {
  // 1. Check for empty upload
  if (!buffer || buffer.length === 0) {
    throw new ValidationError('Upload is empty. Please provide a valid image file.', 'EMPTY_UPLOAD', 400);
  }

  // 2. Check file size
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (buffer.length / (1024 * 1024)).toFixed(2);
    throw new ValidationError(
      `File size (${sizeMb} MB) exceeds maximum allowed limit of 15 MB.`,
      'FILE_TOO_LARGE',
      400
    );
  }

  // 3. Inspect magic bytes & metadata using Sharp
  let metadata;
  try {
    metadata = await sharp(buffer, { failOn: 'error' }).metadata();
  } catch (err) {
    throw new ValidationError(
      `Uploaded file is corrupted or could not be decoded as a valid image: ${err.message}`,
      'CORRUPTED_IMAGE',
      400
    );
  }

  // 4. Validate format (JPG, JPEG, PNG, WEBP)
  const format = (metadata.format || '').toLowerCase();
  const validFormats = ['jpeg', 'png', 'webp'];
  if (!validFormats.includes(format)) {
    throw new ValidationError(
      `Unsupported format "${format || 'unknown'}". TruthLens accepts JPG, JPEG, PNG, and WEBP images only.`,
      'UNSUPPORTED_FORMAT',
      400
    );
  }

  // Also check original filename extension if provided
  if (originalFilename) {
    const ext = originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();
    if (ext && !SUPPORTED_EXTENSIONS.has(ext)) {
      throw new ValidationError(
        `File extension "${ext}" is not supported. Supported extensions: .jpg, .jpeg, .png, .webp.`,
        'UNSUPPORTED_EXTENSION',
        400
      );
    }
  }

  // 5. Check valid dimensions
  if (!metadata.width || !metadata.height || metadata.width < 16 || metadata.height < 16) {
    throw new ValidationError(
      `Image dimensions (${metadata.width}x${metadata.height}) are too small for forensic analysis. Minimum dimensions are 16x16 pixels.`,
      'INVALID_DIMENSIONS',
      400
    );
  }

  return metadata;
}

/**
 * Preprocesses image buffer for ViT-224 model.
 * 1. Converts any input (RGBA, Grayscale, CMYK) to standard 3-channel sRGB.
 * 2. Resizes to 224x224 maintaining aspect ratio via center crop (cover) with bicubic filtering.
 * 3. Normalizes pixel values: (pixel / 255 - 0.5) / 0.5.
 * 4. Outputs Float32Array in CHW order [1, 3, 224, 224].
 */
export async function preprocessForViT224(buffer) {
  const metadata = await validateImageBuffer(buffer);

  // Sharp pipeline: explicitly convert to standard sRGB, remove alpha, resize with bicubic interpolation
  const { data, info } = await sharp(buffer)
    .toColorspace('srgb')
    .removeAlpha()
    .resize(VIT_224_CONFIG.width, VIT_224_CONFIG.height, {
      fit: 'cover',
      position: 'center',
      kernel: 'cubic'
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const numPixels = VIT_224_CONFIG.width * VIT_224_CONFIG.height;
  const floatData = new Float32Array(3 * numPixels);

  const mean = VIT_224_CONFIG.mean;
  const std = VIT_224_CONFIG.std;

  for (let i = 0; i < numPixels; i++) {
    const r = data[i * 3] / 255.0;
    const g = data[i * 3 + 1] / 255.0;
    const b = data[i * 3 + 2] / 255.0;

    // Red channel
    floatData[i] = (r - mean[0]) / std[0];
    // Green channel
    floatData[numPixels + i] = (g - mean[1]) / std[1];
    // Blue channel
    floatData[2 * numPixels + i] = (b - mean[2]) / std[2];
  }

  return {
    floatData,
    dims: [1, 3, VIT_224_CONFIG.height, VIT_224_CONFIG.width],
    metadata: {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      channels: metadata.channels,
      space: metadata.space,
      hasAlpha: metadata.hasAlpha,
      processedWidth: info.width,
      processedHeight: info.height
    }
  };
}

/**
 * Preprocesses image buffer for ViT-384 (e.g. CommunityForensics).
 * Shortest edge resized to 440 (aspect ratio preserved), center-cropped to 384x384, CLIP-normalized.
 */
export async function preprocessForViT384(buffer) {
  const metadata = await validateImageBuffer(buffer);

  const w = metadata.width;
  const h = metadata.height;
  const scale = VIT_384_CONFIG.shortestEdge / Math.min(w, h);
  const targetW = Math.max(VIT_384_CONFIG.cropSize, Math.round(w * scale));
  const targetH = Math.max(VIT_384_CONFIG.cropSize, Math.round(h * scale));

  const left = Math.max(0, Math.floor((targetW - VIT_384_CONFIG.cropSize) / 2));
  const top = Math.max(0, Math.floor((targetH - VIT_384_CONFIG.cropSize) / 2));

  const { data, info } = await sharp(buffer)
    .toColorspace('srgb')
    .removeAlpha()
    .resize(targetW, targetH, { fit: 'fill', kernel: 'cubic' })
    .extract({
      left,
      top,
      width: VIT_384_CONFIG.cropSize,
      height: VIT_384_CONFIG.cropSize
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const numPixels = VIT_384_CONFIG.cropSize * VIT_384_CONFIG.cropSize;
  const floatData = new Float32Array(3 * numPixels);
  const mean = VIT_384_CONFIG.mean;
  const std = VIT_384_CONFIG.std;

  for (let i = 0; i < numPixels; i++) {
    const r = data[i * 3] / 255.0;
    const g = data[i * 3 + 1] / 255.0;
    const b = data[i * 3 + 2] / 255.0;

    floatData[i] = (r - mean[0]) / std[0];
    floatData[numPixels + i] = (g - mean[1]) / std[1];
    floatData[2 * numPixels + i] = (b - mean[2]) / std[2];
  }

  return {
    floatData,
    dims: [1, 3, VIT_384_CONFIG.cropSize, VIT_384_CONFIG.cropSize],
    metadata: {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      channels: metadata.channels,
      space: metadata.space,
      hasAlpha: metadata.hasAlpha,
      processedWidth: info.width,
      processedHeight: info.height
    }
  };
}

/**
 * Dispatches preprocessing according to model requirements
 */
export async function preprocessForModel(buffer, modelKey = 'deepfake-vit-v2') {
  if (modelKey === 'community-forensics-vit') {
    return preprocessForViT384(buffer);
  }
  return preprocessForViT224(buffer);
}

/**
 * Custom Error Class for Preprocessing and Image Validation
 */
export class ValidationError extends Error {
  constructor(message, code = 'VALIDATION_ERROR', statusCode = 400) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

