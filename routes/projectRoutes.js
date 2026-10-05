const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Project = require('../models/Project');
const User = require('../models/User');

// Middleware to optionally extract authenticated user
const optionalAuth = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey_vlog_editor_2026_key');
            req.user = await User.findById(decoded.id).select('-password');
        } catch (e) {
            console.warn('Optional auth token check failed:', e.message);
        }
    }
    next();
};

// @route   POST /api/projects
// @desc    Create or save a new vlog project
router.post('/', optionalAuth, async (req, res) => {
    try {
        const {
            projectName,
            videoMetadata,
            filters,
            textOverlay,
            imageOverlay,
            audioSettings,
            trimSettings,
            transitionSettings,
            state
        } = req.body;

        const newProject = new Project({
            projectName: projectName || (state && state.projectName) || 'My Vlog Project',
            user: req.user ? req.user._id : undefined,
            videoMetadata: videoMetadata || {},
            filters: filters || (state && state.filters) || {},
            textOverlay: textOverlay || (state && state.text) || {},
            imageOverlay: imageOverlay || (state && state.overlay) || {},
            audioSettings: audioSettings || {},
            trimSettings: trimSettings || (state && state.trim) || {},
            transitionSettings: transitionSettings || (state && state.transition) || {},
            state: state || {}
        });

        const savedProject = await newProject.save();

        res.status(201).json({
            success: true,
            message: 'Vlog project saved to MongoDB successfully!',
            data: savedProject
        });
    } catch (error) {
        console.error('Error saving vlog project:', error);
        res.status(500).json({ success: false, message: 'Server error saving vlog project', error: error.message });
    }
});

// @route   GET /api/projects
// @desc    Fetch all vlog projects for current user or recent
router.get('/', optionalAuth, async (req, res) => {
    try {
        const filter = req.user ? { user: req.user._id } : {};
        const projects = await Project.find(filter).sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        console.error('Error fetching vlog projects:', error);
        res.status(500).json({ success: false, message: 'Server error fetching vlog projects', error: error.message });
    }
});

// @route   GET /api/projects/:id
// @desc    Fetch a single vlog project by ID
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Vlog project not found.' });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error('Error fetching vlog project:', error);
        res.status(500).json({ success: false, message: 'Server error fetching vlog project', error: error.message });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update an existing vlog project
router.put('/:id', optionalAuth, async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Vlog project not found.' });
        }

        // Update fields if provided
        const {
            projectName,
            videoMetadata,
            filters,
            textOverlay,
            imageOverlay,
            audioSettings,
            trimSettings,
            transitionSettings,
            state
        } = req.body;

        if (projectName) project.projectName = projectName;
        if (videoMetadata) project.videoMetadata = videoMetadata;
        if (filters) project.filters = filters;
        if (textOverlay) project.textOverlay = textOverlay;
        if (imageOverlay) project.imageOverlay = imageOverlay;
        if (audioSettings) project.audioSettings = audioSettings;
        if (trimSettings) project.trimSettings = trimSettings;
        if (transitionSettings) project.transitionSettings = transitionSettings;
        if (state) project.state = state;

        project.updatedAt = Date.now();

        const updatedProject = await project.save();

        res.status(200).json({
            success: true,
            message: 'Vlog project updated successfully!',
            data: updatedProject
        });
    } catch (error) {
        console.error('Error updating vlog project:', error);
        res.status(500).json({ success: false, message: 'Server error updating vlog project', error: error.message });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a vlog project by ID
router.delete('/:id', optionalAuth, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Vlog project not found.' });
        }
        res.status(200).json({ success: true, message: 'Vlog project deleted successfully.' });
    } catch (error) {
        console.error('Error deleting vlog project:', error);
        res.status(500).json({ success: false, message: 'Server error deleting vlog project', error: error.message });
    }
});

module.exports = router;
