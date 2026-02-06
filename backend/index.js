require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios");

const connectDB = require("./DbConfig/db.config");
const { logEmailConfigStatus } = require("./utils/emailConfigValidator");
const authRoutes = require("./routes/authRoutes");
const poseRoutes = require("./routes/poseRoutes");
const dietRoutes = require("./routes/dietRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const contactRoutes = require("./routes/contactRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const emailVerificationRoutes = require("./routes/emailVerificationRoutes");
const securityRoutes = require("./routes/securityRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const communityRoutes = require("./routes/communityRoutes");

const app = express();
const PORT = process.env.PORT || 5001;
const ML_API_URL = process.env.ML_API_URL || "http://localhost:5000"; // Correct ML port

// ----------------------------
// Middleware
// ----------------------------
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3002', 'http://localhost:3000'], // Allow specific frontend ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// ----------------------------
// Connect to MongoDB
// ----------------------------
connectDB(); // Single call only

// ----------------------------
// Routes
// ----------------------------
try {
    app.use("/api/auth", authRoutes);
    app.use("/api/pose", poseRoutes);
    app.use("/api/diet", dietRoutes);
    app.use("/api/analytics", analyticsRoutes);
    app.use("/api/contact", contactRoutes);
    app.use("/api/schedule", scheduleRoutes);
    app.use("/api/email", emailVerificationRoutes);
    app.use("/api/security", securityRoutes);
    app.use("/api/password", forgotPasswordRoutes);
    app.use("/api/ranking", require('./routes/rankingRoutes'));
    app.use("/api/community", communityRoutes);
    
    console.log('✅ All routes registered successfully');
} catch (error) {
    console.error('❌ Error registering routes:', error.message);
    console.error(error.stack);
}

// ----------------------------
// ML Proxy Endpoints
// ----------------------------
app.get("/api/ml/health", async (req, res) => {
    try {
        const response = await axios.get(`${ML_API_URL}/health`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'ML service unavailable',
            details: error.message,
            ml_url: ML_API_URL
        });
    }
});

// ----------------------------
// Root Endpoint
// ----------------------------
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Yoga Posture Detection & Diet AI API",
        ml_service: { url: ML_API_URL },
        mongo_uri: process.env.MONGO_URI
    });
});

// Simple test endpoint
app.get("/test-simple", (req, res) => {
    res.json({ success: true, message: "Simple test working!" });
});

// Photo test endpoint
app.get('/photo-test', (req, res) => {
    console.log('Photo test endpoint hit');
    res.json({ success: true, message: 'Photo test working!' });
});

// ----------------------------
// Start Server & Test ML Service
// ----------------------------
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🤖 ML Service URL: ${ML_API_URL}`);

    // Validate email configuration
    logEmailConfigStatus();

    // Test ML service separately without blocking server start
    const testMLService = async () => {
        try {
            const res = await axios.get(`${ML_API_URL}/health`);
            console.log(`✅ ML Service: ${res.data.status}`);
        } catch (err) {
            console.log(`❌ ML Service unavailable: ${err.message}`);
            console.log(`⚠️  Make sure the ML service is running on ${ML_API_URL}`);
        }
    };

    testMLService();
});
