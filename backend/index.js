require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios");

const connectDB = require("./DbConfig/db.config");
const authRoutes = require("./routes/authRoutes");
const poseRoutes = require("./routes/poseRoutes");
const dietRoutes = require("./routes/dietRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
const PORT = process.env.PORT || 5001;
const ML_API_URL = process.env.ML_API_URL || "http://localhost:5000"; // Correct ML port

// ----------------------------
// Middleware
// ----------------------------
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ----------------------------
// Connect to MongoDB
// ----------------------------
connectDB(); // Single call only

// ----------------------------
// Routes
// ----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/pose", poseRoutes);
app.use("/api/diet", dietRoutes);
app.use("/api/analytics", analyticsRoutes);

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

// ----------------------------
// Start Server & Test ML Service
// ----------------------------
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🤖 ML Service URL: ${ML_API_URL}`);

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
