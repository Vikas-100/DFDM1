import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { 
  preprocessForViT224, 
  preprocessForViT384, 
  ValidationError 
} from './preprocessor.js';
import { 
  runInference, 
  runEnsembleInference,
  MODEL_REGISTRY, 
  getInferenceSession 
} from './modelManager.js';
import { 
  evaluatePrediction, 
  THRESHOLDS, 
  OUTCOMES 
} from './evaluator.js';

const router = express.Router();

// Configure multer memory storage with 15MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB
  }
});

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TruthLens AI Forensic Detection Engine',
    version: '3.5.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Model info and status endpoint
 */
router.get('/model-info', async (req, res) => {
  try {
    const requestedModel = req.query.model || 'deepfake-vit-v2';
    const primary = MODEL_REGISTRY[requestedModel] || MODEL_REGISTRY['deepfake-vit-v2'];
    let isLoaded = false;
    let loadError = null;

    try {
      if (primary.id !== 'ensemble') {
        await getInferenceSession(primary.id);
      } else {
        await Promise.all([
          getInferenceSession('deepfake-vit-v2'),
          getInferenceSession('community-forensics-vit')
        ]);
      }
      isLoaded = true;
    } catch (err) {
      loadError = err.message;
    }

    res.json({
      success: true,
      activeModel: primary.id,
      availableModels: Object.keys(MODEL_REGISTRY),
      modelDetails: {
        id: primary.id,
        name: primary.name,
        repository: primary.repository,
        architecture: primary.architecture,
        inputDimensions: primary.inputDimensions,
        activation: primary.activation,
        labels: primary.labels,
        intendedUse: primary.intendedUse
      },
      thresholds: THRESHOLDS,
      supportedOutcomes: Object.values(OUTCOMES),
      status: isLoaded ? 'ready' : 'loading_failed',
      loadError
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: `Failed to retrieve model info: ${err.message}`
    });
  }
});

/**
 * Image Deepfake Detection Inference API
 * POST /api/detect
 * Body: multipart/form-data with field 'image'
 * Optional query/body param: 'model' ('ensemble' [default], 'deepfake-vit-v2', 'community-forensics-vit')
 */
router.post('/detect', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size exceeds 15 MB limit. Please select an image under 15 MB.',
          code: 'FILE_TOO_LARGE'
        });
      }
      return res.status(400).json({
        success: false,
        error: `File upload error: ${err.message}`,
        code: 'UPLOAD_ERROR'
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    // 1. Validate file presence
    if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No image file uploaded. Please select and upload a JPG, JPEG, PNG, or WEBP image.',
        code: 'EMPTY_UPLOAD'
      });
    }

    const { buffer, originalname, size } = req.file;
    const modelChoice = req.query.model || req.body?.model || 'ensemble';

    // 2. Preprocess and validate image (handles corrupted files, unsupported formats, RGB conversion)
    let inferenceResult;
    let metadata;

    if (modelChoice === 'deepfake-vit-v2') {
      const prep = await preprocessForViT224(buffer);
      metadata = prep.metadata;
      inferenceResult = await runInference(prep.floatData, prep.dims, 'deepfake-vit-v2');
    } else if (modelChoice === 'community-forensics-vit') {
      const prep = await preprocessForViT384(buffer);
      metadata = prep.metadata;
      inferenceResult = await runInference(prep.floatData, prep.dims, 'community-forensics-vit');
    } else {
      // Default: Dual-ViT Ensemble for calibrated general + facial detection
      inferenceResult = await runEnsembleInference(buffer, {
        preprocessForViT224,
        preprocessForViT384
      });
      metadata = inferenceResult.metadata;
    }

    // 3. Compute real SHA-256 hash for chain of custody
    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');

    // 4. Run prediction reliability evaluator (calibrated 3-outcome decision boundary)
    const evaluation = evaluatePrediction({
      probabilities: inferenceResult.probabilities,
      rawLogits: inferenceResult.rawLogits,
      modelName: inferenceResult.modelName,
      architecture: inferenceResult.architecture,
      fileName: originalname,
      imageMetadata: metadata
    });

    // 5. Return genuine prediction without modification or simulated override
    const responsePayload = {
      success: true,
      analysisId: `tl-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      timestamp: new Date().toISOString(),
      fileInfo: {
        name: originalname,
        sizeBytes: size,
        format: metadata.format,
        dimensions: `${metadata.width}x${metadata.height}`,
        channels: metadata.channels,
        sha256: sha256Hash
      },
      modelInfo: {
        name: inferenceResult.modelName,
        repository: inferenceResult.repository,
        architecture: inferenceResult.architecture,
        inferenceTimeMs: inferenceResult.inferenceDurationMs,
        rawLogits: inferenceResult.rawLogits,
        activation: inferenceResult.activation,
        probabilities: inferenceResult.probabilities,
        individualModels: inferenceResult.individualModels || undefined
      },
      evaluation
    };

    return res.status(200).json(responsePayload);

  } catch (err) {
    console.error('[TruthLens AI API Error]', err);

    if (err instanceof ValidationError) {
      return res.status(err.statusCode || 400).json({
        success: false,
        error: err.message,
        code: err.code
      });
    }

    return res.status(500).json({
      success: false,
      error: `Model execution failed: ${err.message}`,
      code: 'INFERENCE_ERROR'
    });
  }
});

export default router;
