const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// File Filter Function for Video, Audio, and Image
const fileFilter = (req, file, cb) => {
    const allowedVideoExts = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const allowedAudioExts = ['.mp3', '.wav', '.ogg', '.aac', '.m4a', '.flac'];
    const allowedImageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    const isVideo = allowedVideoExts.includes(ext) || mime.startsWith('video/');
    const isAudio = allowedAudioExts.includes(ext) || mime.startsWith('audio/');
    const isImage = allowedImageExts.includes(ext) || mime.startsWith('image/');

    if (isVideo || isAudio || isImage) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file format '${ext}'. Allowed formats: MP4, WEBM, MP3, WAV, JPG, PNG, WEBP, etc.`), false);
    }
};

// Multer Upload Instance with 100MB size limit
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB max file size
    }
});

module.exports = upload;
