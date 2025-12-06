const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/images';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
});

// Get all yoga poses
router.get('/poses', (req, res) => {
  const poses = [
    { 
      id: 1, 
      name: 'Mountain Pose (Tadasana)', 
      difficulty: 'Beginner',
      description: 'Stand tall with feet together, arms at sides',
      benefits: ['Improves posture', 'Strengthens legs', 'Calms mind']
    },
    { 
      id: 2, 
      name: 'Tree Pose (Vrikshasana)', 
      difficulty: 'Beginner', 
      description: 'Stand on one leg, other foot on inner thigh',
      benefits: ['Improves balance', 'Strengthens legs', 'Increases focus']
    },
    { 
      id: 3, 
      name: 'Warrior II (Virabhadrasana II)', 
      difficulty: 'Intermediate',
      description: 'Step feet wide, bend front knee, arms parallel to floor',
      benefits: ['Strengthens legs', 'Opens hips', 'Builds stamina']
    },
    { 
      id: 4, 
      name: 'Downward Dog (Adho Mukha Svanasana)', 
      difficulty: 'Intermediate',
      description: 'Form an inverted V-shape with body',
      benefits: ['Strengthens arms', 'Stretches hamstrings', 'Relieves back pain']
    },
    { 
      id: 5, 
      name: 'Child\'s Pose (Balasana)', 
      difficulty: 'Beginner',
      description: 'Kneel and sit back on heels, fold forward',
      benefits: ['Relaxes body', 'Relieves stress', 'Stretches back']
    }
  ];
  
  res.json({
    success: true,
    count: poses.length,
    poses: poses
  });
});

// Detect pose from uploaded image
router.post('/detect', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please upload an image file' 
      });
    }
    
    console.log('Processing image:', req.file.filename);
    
    // Mock pose detection (replace with actual ML model)
    const poses = [
      'Mountain Pose (Tadasana)',
      'Tree Pose (Vrikshasana)', 
      'Warrior II (Virabhadrasana II)',
      'Downward Dog (Adho Mukha Svanasana)',
      'Child\'s Pose (Balasana)'
    ];
    
    const randomPose = poses[Math.floor(Math.random() * poses.length)];
    const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%
    
    // Generate corrections based on pose
    const corrections = {
      'Mountain Pose (Tadasana)': [
        'Stand taller, elongate spine',
        'Relax shoulders away from ears',
        'Engage core muscles',
        'Distribute weight evenly'
      ],
      'Tree Pose (Vrikshasana)': [
        'Find a focal point for balance',
        'Press foot firmly into inner thigh',
        'Keep hips squared forward',
        'Bring hands to prayer position'
      ],
      'Warrior II (Virabhadrasana II)': [
        'Front knee should be over ankle',
        'Back leg straight and strong',
        'Hips open to the side',
        'Arms parallel to floor'
      ],
      'Downward Dog (Adho Mukha Svanasana)': [
        'Press palms firmly into mat',
        'Lengthen spine',
        'Bend knees if hamstrings are tight',
        'Heels toward floor'
      ],
      'Child\'s Pose (Balasana)': [
        'Sink hips back toward heels',
        'Rest forehead on mat',
        'Relax shoulders',
        'Breathe deeply'
      ]
    };
    
    res.json({
      success: true,
      message: 'Pose detected successfully',
      data: {
        pose: randomPose,
        confidence: confidence + '%',
        corrections: corrections[randomPose] || ['Keep proper alignment', 'Breathe deeply'],
        imageUrl: `/uploads/images/${req.file.filename}`,
        filename: req.file.filename,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Pose detection error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process image',
      message: error.message 
    });
  }
});

// Simple image upload (without detection)
router.post('/upload', upload.single('image'), (req, res) => {
  try {
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
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Upload failed',
      message: error.message 
    });
  }
});

// Analyze video (mock endpoint)
router.post('/analyze-video', (req, res) => {
  try {
    const { videoUrl, frames } = req.body;
    
    res.json({
      success: true,
      message: 'Video analysis completed',
      data: {
        duration: '30 seconds',
        framesAnalyzed: frames ? frames.length : 120,
        detectedPoses: ['Mountain Pose', 'Tree Pose', 'Warrior II'],
        overallAccuracy: '87%',
        caloriesBurned: 45,
        corrections: [
          'Maintain steady breathing',
          'Keep core engaged',
          'Focus on alignment'
        ],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Video analysis failed' 
    });
  }
});

// Get specific pose by ID
router.get('/pose/:id', (req, res) => {
  const poses = {
    1: {
      id: 1,
      name: 'Mountain Pose (Tadasana)',
      difficulty: 'Beginner',
      description: 'Foundation for all standing poses',
      instructions: [
        'Stand with feet together',
        'Distribute weight evenly',
        'Engage thigh muscles',
        'Lengthen spine upward',
        'Relax shoulders',
        'Breathe deeply'
      ],
      benefits: ['Improves posture', 'Strengthens legs', 'Reduces back pain'],
      duration: '30-60 seconds',
      image: '/images/mountain-pose.jpg'
    },
    2: {
      id: 2,
      name: 'Tree Pose (Vrikshasana)',
      difficulty: 'Beginner',
      description: 'Balance pose that improves focus',
      instructions: [
        'Stand on left leg',
        'Place right foot on left inner thigh',
        'Bring hands to prayer position',
        'Focus on a point ahead',
        'Hold for 30 seconds',
        'Repeat on other side'
      ],
      benefits: ['Improves balance', 'Strengthens legs', 'Increases concentration'],
      duration: '30 seconds each side'
    }
  };
  
  const poseId = parseInt(req.params.id);
  const pose = poses[poseId];
  
  if (!pose) {
    return res.status(404).json({ 
      success: false, 
      error: 'Pose not found' 
    });
  }
  
  res.json({
    success: true,
    pose: pose
  });
});

module.exports = router;