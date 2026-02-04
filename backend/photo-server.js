require("dotenv").config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('./models/user');
const { verifyToken } = require('./middleware/authMiddleware');
const connectDB = require('./DbConfig/db.config');

const app = express();
const PORT = 5010;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3002', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Configure multer for photo uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads/profiles');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `profile-${req.user.id}-${uniqueSuffix}${extension}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Routes
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Photo upload server running!' });
});

app.get('/api/photo/test', (req, res) => {
    console.log('Photo test endpoint hit');
    res.json({ success: true, message: 'Photo routes are working!' });
});

app.post('/api/photo/upload', verifyToken, upload.single('profilePhoto'), async (req, res) => {
    console.log('Photo upload endpoint hit');
    console.log('User:', req.user);
    console.log('File:', req.file);
    
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const photoUrl = `/uploads/profiles/${req.file.filename}`;
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePhoto: photoUrl },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('Photo uploaded successfully:', photoUrl);
        res.json({
            success: true,
            message: 'Profile photo uploaded successfully',
            photoUrl: photoUrl,
            user: user
        });

    } catch (error) {
        console.error('Photo upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload photo',
            error: error.message
        });
    }
});

app.delete('/api/photo/delete', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.profilePhoto) {
            const filePath = path.join(__dirname, user.profilePhoto);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        user.profilePhoto = null;
        await user.save();

        res.json({
            success: true,
            message: 'Profile photo deleted successfully'
        });

    } catch (error) {
        console.error('Photo delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete photo',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Photo upload server running on port ${PORT}`);
    console.log(`📸 Photo endpoints available at http://localhost:${PORT}/api/photo/`);
});