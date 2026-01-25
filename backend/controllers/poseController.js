const poseService = require('../services/poseService');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

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

// MediaPipe AI Pose Detection
exports.detectPoseWithMediaPipe = async (req, res) => {
    try {
        const { image, poseType = 'warrior', enableTTS = true } = req.body;
        
        if (!image) {
            return res.status(400).json({
                success: false,
                error: 'Image data is required'
            });
        }

        // Save base64 image to temporary file
        const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        const tempImagePath = path.join(__dirname, '../temp', `pose_${Date.now()}.jpg`);
        
        // Ensure temp directory exists
        const tempDir = path.dirname(tempImagePath);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        fs.writeFileSync(tempImagePath, imageBuffer);

        // Call MediaPipe pose detector
        const scriptPath = path.join(__dirname, '../Ml/mediapipe_pose_detector.py');
        
        const pythonProcess = spawn('python', [
            scriptPath,
            '--image', tempImagePath,
            '--pose', poseType,
            '--tts', enableTTS.toString()
        ]);

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
            // Clean up temp file
            if (fs.existsSync(tempImagePath)) {
                fs.unlinkSync(tempImagePath);
            }

            if (code === 0) {
                try {
                    const result = JSON.parse(stdout);
                    res.json({
                        success: true,
                        message: 'Pose detected successfully',
                        ...result
                    });
                } catch (parseError) {
                    res.status(500).json({
                        success: false,
                        error: 'Failed to parse detection result',
                        details: stdout
                    });
                }
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Pose detection failed',
                    details: stderr
                });
            }
        });

        pythonProcess.on('error', (error) => {
            // Clean up temp file
            if (fs.existsSync(tempImagePath)) {
                fs.unlinkSync(tempImagePath);
            }
            
            res.status(500).json({
                success: false,
                error: 'Failed to start pose detection',
                details: error.message
            });
        });

    } catch (error) {
        console.error('MediaPipe pose detection error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

// Real-time pose detection endpoint
exports.startRealTimePoseDetection = async (req, res) => {
    try {
        const { poseType = 'warrior' } = req.body;
        
        console.log(`Starting real-time ${poseType} pose detection...`);
        
        const scriptPath = path.join(__dirname, '../Ml/mediapipe_pose_detector.py');
        
        const pythonProcess = spawn('python', [scriptPath, '--realtime', '--pose', poseType], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            const output = data.toString();
            stdout += output;
            console.log(`Real-time detection output:`, output);
        });

        pythonProcess.stderr.on('data', (data) => {
            const error = data.toString();
            stderr += error;
            console.error(`Real-time detection error:`, error);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Real-time pose detection finished with code ${code}`);
            
            if (code === 0) {
                res.status(200).json({
                    success: true,
                    message: `Real-time ${poseType} detection completed successfully`,
                    output: stdout
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: `Real-time ${poseType} detection failed`,
                    error: stderr,
                    output: stdout
                });
            }
        });

        pythonProcess.on('error', (error) => {
            console.error(`Failed to start real-time pose detection:`, error);
            res.status(500).json({
                success: false,
                message: 'Failed to start real-time pose detection',
                error: error.message
            });
        });

    } catch (error) {
        console.error('Real-time pose detection error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initialize real-time detection'
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