const poseService = require('../services/poseService');

exports.createSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sessionName, yogaStyle, difficulty } = req.body;

        const result = await poseService.createSession(userId, {
            sessionName,
            yogaStyle,
            difficulty
        });

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.status(201).json({
            success: true,
            message: 'Session created successfully',
            session: result.session
        });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create session'
        });
    }
};

exports.analyzePose = async (req, res) => {
    try {
        const userId = req.user.id;
        const { image, poseName } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                error: 'Image is required'
            });
        }

        const result = await poseService.analyzePose(image, poseName, userId);

        res.json({
            success: true,
            message: 'Pose analyzed successfully',
            ...result
        });
    } catch (error) {
        console.error('Analyze pose error:', error);
        res.status(500).json({
            success: false,
            error: 'Pose analysis failed'
        });
    }
};

exports.addPoseToSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const poseData = req.body;

        const result = await poseService.addPoseToSession(sessionId, poseData);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json({
            success: true,
            message: 'Pose added to session',
            session: result.session
        });
    } catch (error) {
        console.error('Add pose error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add pose'
        });
    }
};

exports.completeSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const result = await poseService.completeSession(sessionId);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json({
            success: true,
            message: 'Session completed',
            session: result.session
        });
    } catch (error) {
        console.error('Complete session error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to complete session'
        });
    }
};

exports.getUserSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        const result = await poseService.getUserSessions(userId, parseInt(limit), parseInt(page));

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch sessions'
        });
    }
};

exports.getSessionDetails = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const result = await poseService.getSessionDetails(sessionId);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json({
            success: true,
            session: result.session
        });
    } catch (error) {
        console.error('Get session details error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch session details'
        });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const result = await poseService.deleteSession(sessionId);

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json({
            success: true,
            message: 'Session deleted successfully'
        });
    } catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete session'
        });
    }
};