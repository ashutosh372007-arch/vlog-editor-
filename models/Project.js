const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: [true, 'Project name is required'],
        default: 'My Vlog Project',
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    videoMetadata: {
        fileName: { type: String, default: '' },
        duration: { type: Number, default: 0 },
        playbackRate: { type: Number, default: 1 },
        volume: { type: Number, default: 1 },
        isMuted: { type: Boolean, default: false }
    },
    filters: {
        brightness: { type: Number, default: 100 },
        contrast: { type: Number, default: 100 },
        saturation: { type: Number, default: 100 },
        grayscale: { type: Number, default: 0 },
        sepia: { type: Number, default: 0 },
        invert: { type: Number, default: 0 },
        blur: { type: Number, default: 0 }
    },
    textOverlay: {
        content: { type: String, default: '' },
        size: { type: Number, default: 28 },
        color: { type: String, default: '#ffffff' },
        position: { type: String, default: 'bottom' },
        fontStyle: { type: String, default: 'Arial' }
    },
    imageOverlay: {
        src: { type: String, default: '' },
        display: { type: String, default: 'none' },
        width: { type: mongoose.Schema.Types.Mixed, default: 150 },
        top: { type: String, default: '20px' },
        left: { type: String, default: 'auto' },
        right: { type: String, default: '20px' }
    },
    audioSettings: {
        musicFileName: { type: String, default: '' },
        musicVolume: { type: Number, default: 1 },
        masterVolume: { type: Number, default: 1 },
        isMuted: { type: Boolean, default: false }
    },
    trimSettings: {
        start: { type: Number, default: 0 },
        end: { type: Number, default: 10 }
    },
    transitionSettings: {
        type: { type: String, default: 'none' },
        duration: { type: Number, default: 1 }
    },
    aiVoiceSettings: {
        text: { type: String, default: '' },
        voiceURI: { type: String, default: '' },
        pitch: { type: Number, default: 1 },
        rate: { type: Number, default: 1 },
        volume: { type: Number, default: 1 },
        isGenerated: { type: Boolean, default: false }
    },
    aiAudioSettings: {
        prompt: { type: String, default: '' },
        title: { type: String, default: '' },
        volume: { type: Number, default: 1 },
        isGenerated: { type: Boolean, default: false },
        addedToTimeline: { type: Boolean, default: false }
    },
    state: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

ProjectSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Project', ProjectSchema);
