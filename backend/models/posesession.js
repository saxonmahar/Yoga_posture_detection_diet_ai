const mongoose = require('mongoose');

const poseSessionSchema = new mongoose.Schema({
    // User reference
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    
    // Session information
    sessionName: {
        type: String,
        default: 'Yoga Practice Session'
    },
    sessionType: {
        type: String,
        enum: ['yoga', 'workout', 'meditation', 'custom'],
        default: 'yoga'
    },
    
    // Timing
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    
    // Yoga specific
    yogaStyle: {
        type: String,
        enum: ['hatha', 'vinyasa', 'ashtanga', 'iyengar', 'yin', 'restorative', 'power', 'custom'],
        default: 'hatha'
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    
    // Pose data array
    poses: [{
        poseId: {
            type: String,
            required: true
        },
        poseName: {
            type: String,
            required: true
        },
        // Common yoga poses
        poseType: {
            type: String,
            enum: [
                'standing', 'seated', 'forward-bend', 'backbend', 
                'twist', 'inversion', 'balance', 'supine', 'prone'
            ]
        },
        
        // Timing for each pose
        startTimestamp: Date,
        endTimestamp: Date,
        holdDuration: Number, // seconds
        
        // AI Analysis results
        accuracyScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        
        // Pose landmarks (from MediaPipe)
        landmarks: [{
            frameNumber: Number,
            timestamp: Date,
            points: [{
                x: Number,
                y: Number,
                z: Number,
                visibility: Number,
                landmarkId: Number
            }]
        }],
        
        // Joint angles for analysis
        jointAngles: {
            leftKnee: Number,
            rightKnee: Number,
            leftElbow: Number,
            rightElbow: Number,
            leftHip: Number,
            rightHip: Number,
            spineAngle: Number
        },
        
        // AI Feedback
        feedback: [{
            category: {
                type: String,
                enum: ['alignment', 'balance', 'depth', 'stability', 'form']
            },
            message: String,
            correction: String,
            severity: {
                type: String,
                enum: ['excellent', 'good', 'warning', 'critical'],
                default: 'good'
            }
        }],
        
        // Comparison with ideal pose
        similarityPercentage: Number,
        keyDifferences: [String],
        improvementTips: [String],
        
        // User rating
        userRating: {
            type: Number,
            min: 1,
            max: 5
        },
        notes: String
    }],
    
    // Session metrics
    totalPoses: {
        type: Number,
        default: 0
    },
    avgAccuracy: {
        type: Number,
        default: 0
    },
    caloriesBurned: {
        type: Number,
        default: 0
    },
    
    // AI-generated summary
    sessionSummary: {
        strengths: [String],
        areasToImprove: [String],
        overallScore: Number,
        recommendations: [String]
    },
    
    // Media files (optional)
    videoUrl: String,
    thumbnailUrl: String,
    
    // Status
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'abandoned'],
        default: 'completed'
    },
    
    // User notes
    userNotes: String,
    tags: [String]
}, {
    timestamps: true
});

// Calculate duration before saving
poseSessionSchema.pre('save', function(next) {
    if (this.endTime && this.startTime) {
        const durationMs = this.endTime - this.startTime;
        this.duration = Math.round(durationMs / 60000); // Convert to minutes
    }
    
    // Calculate average accuracy if poses exist
    if (this.poses && this.poses.length > 0) {
        const validPoses = this.poses.filter(pose => pose.accuracyScore > 0);
        if (validPoses.length > 0) {
            const totalAccuracy = validPoses.reduce((sum, pose) => sum + pose.accuracyScore, 0);
            this.avgAccuracy = Math.round(totalAccuracy / validPoses.length);
        }
        this.totalPoses = this.poses.length;
    }
    
    // Calculate calories (simple formula: ~5 calories per minute for yoga)
    if (this.duration > 0) {
        this.caloriesBurned = Math.round(this.duration * 5);
    }
    
    next();
});

// Indexes for faster queries
poseSessionSchema.index({ userId: 1, createdAt: -1 });
poseSessionSchema.index({ sessionType: 1 });
poseSessionSchema.index({ 'poses.poseName': 1 });
poseSessionSchema.index({ status: 1 });

// Virtual for session duration in seconds
poseSessionSchema.virtual('durationSeconds').get(function() {
    return this.duration * 60;
});

const PoseSession = mongoose.model('PoseSession', poseSessionSchema);

module.exports = PoseSession;