const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const poseDetector = require('../services/poseDetector');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/images';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `yoga_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
  }
}).single('image');

const yogaController = {
  // Detect pose from uploaded image
  detectPose: async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        
        if (!req.file) {
          return res.status(400).json({ error: 'Please upload an image file' });
        }
        
        console.log('Processing image:', req.file.filename);
        
        try {
          // Preprocess image (resize for better processing)
          const processedImagePath = `uploads/processed_${req.file.filename}`;
          await sharp(req.file.path)
            .resize(800, 600, { fit: 'inside' })
            .jpeg({ quality: 90 })
            .toFile(processedImagePath);
          
          // Detect pose using our pose detector
          const result = await poseDetector.detectPose(processedImagePath);
          
          if (result.error) {
            return res.status(400).json({ 
              success: false, 
              error: result.error 
            });
          }
          
          // Calculate score based on confidence and other factors
          const score = Math.round(result.confidence * 0.8 + 20); // 20-100 scale
          
          res.json({
            success: true,
            message: 'Pose detected successfully',
            data: {
              pose: result.pose,
              confidence: result.confidence + '%',
              score: score + '/100',
              corrections: result.corrections,
              landmarks: result.landmarks,
              image: {
                original: `/uploads/images/${req.file.filename}`,
                processed: `/uploads/processed_${req.file.filename}`,
                filename: req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype
              },
              analysis: {
                timestamp: new Date().toISOString(),
                processingTime: '1.2s', // Mock time
                modelVersion: '1.0'
              }
            }
          });
          
        } catch (processingError) {
          console.error('Image processing error:', processingError);
          // Fallback: use original image
          const result = await poseDetector.detectPose(req.file.path);
          
          res.json({
            success: true,
            message: 'Pose detected (using fallback processing)',
            data: {
              pose: result.pose,
              confidence: result.confidence + '%',
              corrections: result.corrections,
              image: {
                original: `/uploads/images/${req.file.filename}`,
                filename: req.file.filename
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Detection error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to detect pose',
        message: error.message 
      });
    }
  },

  // Upload image without detection
  uploadImage: async (req, res) => {
    try {
      upload(req, res, (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        
        res.json({
          success: true,
          message: 'Image uploaded successfully',
          data: {
            filename: req.file.filename,
            path: `/uploads/images/${req.file.filename}`,
            size: req.file.size,
            mimetype: req.file.mimetype,
            url: `http://localhost:5000/uploads/images/${req.file.filename}`,
            timestamp: new Date().toISOString()
          }
        });
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Upload failed',
        message: error.message 
      });
    }
  },

  // Analyze video frames
  analyzeVideo: async (req, res) => {
    try {
      const { videoUrl, frames, duration } = req.body;
      
      if (!videoUrl && (!frames || frames.length === 0)) {
        return res.status(400).json({ 
          error: 'Provide video URL or frames array' 
        });
      }
      
      // Mock video analysis using pose detector
      const videoResult = await poseDetector.processVideo(videoUrl || 'mock_video');
      
      const analysis = {
        duration: duration || '30 seconds',
        totalFrames: frames ? frames.length : videoResult.framesProcessed,
        framesAnalyzed: videoResult.framesProcessed,
        detectedPoses: videoResult.posesDetected,
        overallAccuracy: videoResult.accuracy + '%',
        corrections: [
          'Maintain steady breathing throughout',
          'Keep core engaged for stability',
          'Focus on alignment in each pose',
          'Transition smoothly between poses'
        ],
        score: Math.round(videoResult.accuracy * 0.1), // Convert to 0-10 scale
        caloriesBurned: Math.round(videoResult.framesProcessed * 0.1), // Mock calculation
        recommendations: [
          'Practice daily for 15 minutes',
          'Focus on balance poses',
          'Use a mirror for self-correction',
          'Record yourself to track progress'
        ],
        detailedAnalysis: {
          poseHoldTimes: {
            'Mountain Pose': '15 seconds',
            'Tree Pose': '10 seconds',
            'Warrior II': '5 seconds'
          },
          alignmentScore: '8.5/10',
          balanceScore: '7.8/10',
          flexibilityScore: '8.2/10'
        },
        timestamp: new Date().toISOString()
      };
      
      res.json({
        success: true,
        message: 'Video analysis completed',
        data: analysis
      });
    } catch (error) {
      console.error('Video analysis error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Video analysis failed',
        message: error.message 
      });
    }
  },

  // Get all yoga poses
  getAllPoses: async (req, res) => {
    try {
      const poses = [
        {
          id: 1,
          name: 'Mountain Pose (Tadasana)',
          difficulty: 'Beginner',
          category: 'Standing',
          description: 'Foundation pose for all standing poses. Stand tall like a mountain.',
          instructions: [
            'Stand with feet together or hip-width apart',
            'Distribute weight evenly on both feet',
            'Engage thigh muscles and lift kneecaps',
            'Lengthen spine upward',
            'Relax shoulders away from ears',
            'Arms at sides with palms facing forward',
            'Breathe deeply and hold for 30-60 seconds'
          ],
          benefits: [
            'Improves posture',
            'Strengthens thighs, knees, and ankles',
            'Relieves back pain',
            'Calms the mind',
            'Increases awareness'
          ],
          keyPoints: [
            'Feet grounded',
            'Spine elongated',
            'Shoulders relaxed',
            'Core engaged'
          ],
          image: '/images/mountain-pose.jpg',
          duration: '30-60 seconds'
        },
        {
          id: 2,
          name: 'Tree Pose (Vrikshasana)',
          difficulty: 'Beginner',
          category: 'Standing Balance',
          description: 'Balance pose that improves focus and stability. Stand steady like a tree.',
          instructions: [
            'Stand on left leg, ground through foot',
            'Place right foot on left inner thigh or calf (avoid knee)',
            'Bring hands to prayer position at chest',
            'Focus on a fixed point ahead',
            'Hold for 30 seconds',
            'Repeat on other side'
          ],
          benefits: [
            'Improves balance and coordination',
            'Strengthens legs and core',
            'Increases concentration and focus',
            'Stretches groins and inner thighs'
          ],
          keyPoints: [
            'Focus point (drishti)',
            'Foot placement on inner thigh',
            'Hips squared forward',
            'Core engaged'
          ],
          image: '/images/tree-pose.jpg',
          duration: '30 seconds each side'
        },
        {
          id: 3,
          name: 'Warrior II (Virabhadrasana II)',
          difficulty: 'Intermediate',
          category: 'Standing',
          description: 'Powerful standing pose that builds strength, stamina, and concentration.',
          instructions: [
            'Step feet wide apart (about 4 feet)',
            'Turn right foot out 90°, left foot in slightly',
            'Bend right knee over right ankle',
            'Extend arms parallel to floor',
            'Gaze over right middle finger',
            'Keep hips open to the side',
            'Hold for 30 seconds, then switch sides'
          ],
          benefits: [
            'Strengthens legs and ankles',
            'Stretches groins, chest, and lungs',
            'Increases stamina',
            'Relieves backaches'
          ],
          keyPoints: [
            'Front knee over ankle',
            'Back leg straight',
            'Hips open to side',
            'Arms parallel to floor'
          ],
          image: '/images/warrior-ii.jpg',
          duration: '30 seconds each side'
        }
      ];
      
      res.json({
        success: true,
        count: poses.length,
        data: poses,
        categories: ['Standing', 'Standing Balance', 'Inversion', 'Resting', 'Seated'],
        difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting poses:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to load yoga poses' 
      });
    }
  },

  // Get specific pose by ID
  getPoseById: async (req, res) => {
    try {
      const poseId = parseInt(req.params.id);
      
      const poses = {
        1: {
          id: 1,
          name: 'Mountain Pose (Tadasana)',
          difficulty: 'Beginner',
          description: 'Foundation for all standing poses',
          instructions: [
            'Stand with feet together or hip-width apart',
            'Distribute weight evenly on both feet',
            'Engage thigh muscles and lift kneecaps',
            'Lengthen spine upward',
            'Relax shoulders away from ears',
            'Arms at sides with palms facing forward',
            'Breathe deeply and hold for 30-60 seconds'
          ],
          benefits: ['Improves posture', 'Strengthens legs', 'Calms mind'],
          keyPoints: ['Feet grounded', 'Spine straight', 'Shoulders relaxed'],
          duration: '30-60 seconds',
          image: '/images/mountain-pose.jpg'
        },
        2: {
          id: 2,
          name: 'Tree Pose (Vrikshasana)',
          difficulty: 'Beginner',
          description: 'Balance pose that improves focus',
          instructions: [
            'Stand on left leg, ground through foot',
            'Place right foot on left inner thigh or calf',
            'Bring hands to prayer position at chest',
            'Focus on a fixed point ahead',
            'Hold for 30 seconds',
            'Repeat on other side'
          ],
          benefits: ['Improves balance', 'Strengthens legs', 'Increases focus'],
          keyPoints: ['Focus point', 'Foot placement', 'Hips squared'],
          duration: '30 seconds each side',
          image: '/images/tree-pose.jpg'
        },
        3: {
          id: 3,
          name: 'Warrior II (Virabhadrasana II)',
          difficulty: 'Intermediate',
          description: 'Powerful standing pose for strength',
          instructions: [
            'Step feet wide apart',
            'Turn right foot out 90°',
            'Bend right knee over ankle',
            'Extend arms parallel to floor',
            'Gaze over right hand',
            'Hold for 30 seconds'
          ],
          benefits: ['Strengthens legs', 'Opens hips', 'Builds stamina'],
          keyPoints: ['Knee over ankle', 'Back leg straight', 'Hips open'],
          duration: '30 seconds each side',
          image: '/images/warrior-ii.jpg'
        }
      };
      
      const pose = poses[poseId];
      
      if (!pose) {
        return res.status(404).json({ 
          success: false, 
          error: 'Pose not found. Available IDs: 1-3' 
        });
      }
      
      res.json({
        success: true,
        data: pose
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to get pose',
        message: error.message 
      });
    }
  },

  // Get feedback for a pose
  getPoseFeedback: async (req, res) => {
    try {
      const { poseName, userData, detectedAngles } = req.body;
      
      if (!poseName) {
        return res.status(400).json({ 
          error: 'Pose name is required' 
        });
      }
      
      // Use pose detector to generate feedback
      const mockImagePath = 'mock_image.jpg';
      const detectionResult = await poseDetector.detectPose(mockImagePath);
      
      // Generate personalized feedback
      const score = detectionResult.confidence;
      const isGoodForm = score > 80;
      
      const feedback = {
        pose: poseName,
        score: score + '/100',
        formStatus: isGoodForm ? 'Good Form' : 'Needs Improvement',
        overallFeedback: isGoodForm ? 
          'Excellent! You\'re maintaining good alignment.' : 
          'Good effort! Focus on the corrections below.',
        strengths: [
          'Good body awareness',
          'Steady breathing',
          'Proper intention'
        ],
        areasForImprovement: detectionResult.corrections,
        detailedTips: [
          'Practice in front of a mirror',
          'Record yourself to see progress',
          'Focus on one correction at a time',
          'Breathe deeply throughout'
        ],
        practiceRecommendations: [
          'Hold pose for 30 seconds, 3 repetitions',
          'Practice daily for best results',
          'Combine with breathing exercises'
        ],
        nextSteps: isGoodForm ? 
          'Try holding for longer or closing your eyes' : 
          'Practice with support (wall/chair) first',
        landmarks: detectionResult.landmarks,
        timestamp: new Date().toISOString()
      };
      
      res.json({
        success: true,
        data: feedback
      });
    } catch (error) {
      console.error('Feedback generation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to generate feedback',
        message: error.message 
      });
    }
  }
};

module.exports = yogaController;