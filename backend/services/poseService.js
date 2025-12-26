const PoseSession = require('../models/posesession');
const axios = require('axios');

class PoseService {
    constructor() {
        this.pythonMLUrl = process.env.PYTHON_ML_URL || 'http://localhost:5001';
    }

    // Create new yoga session
    async createSession(userId, sessionData) {
        try {
            const session = new PoseSession({
                userId,
                ...sessionData,
                status: 'in-progress'
            });

            await session.save();
            return { success: true, session };
        } catch (error) {
            console.error('Create session error:', error);
            return { success: false, error: error.message };
        }
    }

    // Analyze pose using Python ML
    async analyzePose(imageBase64, poseName, userId) {
        try {
            console.log('📡 Sending to Python ML for analysis...');
            
            // Call Python Flask API
            const response = await axios.post(`${this.pythonMLUrl}/api/analyze-pose`, {
                image: imageBase64,
                pose_name: poseName,
                user_id: userId
            }, { timeout: 10000 });

            return {
                success: true,
                analysis: response.data,
                timestamp: new Date()
            };

        } catch (error) {
            console.error('Python ML API error:', error.message);
            
            // Fallback analysis
            return {
                success: true,
                analysis: this.fallbackAnalysis(poseName),
                timestamp: new Date(),
                note: 'Using fallback analysis'
            };
        }
    }

    // Fallback if Python service is down
    fallbackAnalysis(poseName) {
        const commonFeedback = {
            accuracy: 75 + Math.random() * 20,
            feedback: [
                {
                    category: 'alignment',
                    message: 'Good overall form',
                    correction: 'Keep your back straight',
                    severity: 'good'
                }
            ],
            jointAngles: {
                leftKnee: 170,
                rightKnee: 170,
                leftElbow: 175,
                rightElbow: 175
            }
        };

        // Pose-specific feedback
        const poseFeedbacks = {
            'tadasana': {
                feedback: [{ message: 'Stand tall like a mountain', severity: 'good' }]
            },
            'vrikshasana': {
                feedback: [{ message: 'Focus on balance', severity: 'warning' }]
            },
            'trikonasana': {
                feedback: [{ message: 'Extend through your fingertips', severity: 'good' }]
            }
        };

        return {
            ...commonFeedback,
            ...(poseFeedbacks[poseName] || {})
        };
    }

    // Add pose to session
    async addPoseToSession(sessionId, poseData) {
        try {
            const session = await PoseSession.findById(sessionId);
            if (!session) {
                return { success: false, error: 'Session not found' };
            }

            session.poses.push({
                ...poseData,
                startTimestamp: new Date(),
                poseId: `pose_${Date.now()}`
            });

            await session.save();
            return { success: true, session };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Complete session
    async completeSession(sessionId) {
        try {
            const session = await PoseSession.findById(sessionId);
            if (!session) {
                return { success: false, error: 'Session not found' };
            }

            session.endTime = new Date();
            session.status = 'completed';

            // Calculate session metrics
            if (session.poses.length > 0) {
                const validPoses = session.poses.filter(p => p.accuracyScore > 0);
                if (validPoses.length > 0) {
                    session.avgAccuracy = validPoses.reduce((sum, p) => sum + p.accuracyScore, 0) / validPoses.length;
                }
                session.totalPoses = session.poses.length;
            }

            await session.save();
            return { success: true, session };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get user sessions
    async getUserSessions(userId, limit = 10, page = 1) {
        try {
            const skip = (page - 1) * limit;

            const sessions = await PoseSession.find({ userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-poses.landmarks'); // Exclude heavy landmarks data

            const total = await PoseSession.countDocuments({ userId });

            return {
                success: true,
                sessions,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Get session details
    async getSessionDetails(sessionId) {
        try {
            const session = await PoseSession.findById(sessionId);
            if (!session) {
                return { success: false, error: 'Session not found' };
            }

            return { success: true, session };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Delete session
    async deleteSession(sessionId) {
        try {
            const result = await PoseSession.findByIdAndDelete(sessionId);
            if (!result) {
                return { success: false, error: 'Session not found' };
            }

            return { success: true, message: 'Session deleted' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new PoseService();