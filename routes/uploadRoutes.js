const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/uploadMiddleware');

// Helper response formatter
const formatResponse = (file, req) => {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    return {
        success: true,
        message: 'File uploaded successfully!',
        file: {
            filename: file.filename,
            originalName: file.originalname,
            url: fileUrl,
            relativePath: `/uploads/${file.filename}`,
            size: file.size,
            mimeType: file.mimetype
        }
    };
};

// @route   POST /api/upload/video
// @desc    Upload video file securely
router.post('/video', (req, res, next) => {
    upload.single('video')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File size limit exceeded! Maximum allowed size is 100MB.' });
            }
            return res.status(400).json({ success: false, message: err.message || 'Video upload failed.' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please select a video file to upload.' });
        }

        res.status(200).json(formatResponse(req.file, req));
    });
});

// @route   POST /api/upload/audio
// @desc    Upload audio/music file securely
router.post('/audio', (req, res, next) => {
    upload.single('audio')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File size limit exceeded! Maximum allowed size is 100MB.' });
            }
            return res.status(400).json({ success: false, message: err.message || 'Audio upload failed.' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please select an audio file to upload.' });
        }

        res.status(200).json(formatResponse(req.file, req));
    });
});

// @route   POST /api/upload/image
// @desc    Upload overlay image file securely
router.post('/image', (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File size limit exceeded! Maximum allowed size is 100MB.' });
            }
            return res.status(400).json({ success: false, message: err.message || 'Image upload failed.' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please select an image file to upload.' });
        }

        res.status(200).json(formatResponse(req.file, req));
    });
});

// @route   POST /api/upload/ai-audio-generate
// @desc    Generate ambient audio track from text prompt
router.post('/ai-audio-generate', async (req, res) => {
    try {
        const { prompt, category = 'vlog' } = req.body;
        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ success: false, message: 'Please provide a prompt describing the audio you want to generate.' });
        }

        // Return synthesized Web Audio API sound data / procedural atmospheric sound metadata
        res.status(200).json({
            success: true,
            message: 'AI Audio generated successfully!',
            data: {
                prompt: prompt.trim(),
                category,
                title: `AI Track: ${prompt.trim().slice(0, 25)}...`,
                duration: 15
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || 'AI audio generation failed.' });
    }
});

module.exports = router;
