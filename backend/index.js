require("dotenv").config();
const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const connectDB = require("./DbConfig/db.config");

// Import REAL routes
const poseRoutes = require("./routes/poseRoutes");
const dietRoutes = require("./routes/dietRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

// CORS (simple + controlled)
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Database
|--------------------------------------------------------------------------
*/
connectDB();

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
app.use("/api/auth", authRoutes);

// REAL ROUTES (not test anymore)
app.use("/api/pose", poseRoutes);      // Pose detection & yoga sessions
app.use("/api/diet", dietRoutes);      // Diet & nutrition tracking
app.use("/api/analytics", analyticsRoutes); // Progress analytics

// Health check / root route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Yoga Posture Detection & Diet AI API",
        version: "1.0.0",
        status: "running",
        endpoints: {
            auth: {
                login: "POST /api/auth/login",
                register: "POST /api/auth/register"
            },
            pose: {
                createSession: "POST /api/pose/sessions",
                analyzePose: "POST /api/pose/analyze",
                getSessions: "GET /api/pose/sessions",
                getSessionDetails: "GET /api/pose/sessions/:id"
            },
            diet: {
                logMeal: "POST /api/diet/meals",
                getTodayMeals: "GET /api/diet/meals/today",
                getRecommendation: "POST /api/diet/recommendations"
            },
            analytics: {
                getAnalytics: "GET /api/analytics/overview",
                getStreaks: "GET /api/analytics/streaks",
                saveProgress: "POST /api/analytics/progress"
            }
        }
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/
app.listen(PORT, () => {
    console.log(`\n🚀 ========================================`);
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`📚 ========================================`);
    console.log(`🔗 Auth API:      http://localhost:${PORT}/api/auth`);
    console.log(`🧘 Pose API:      http://localhost:${PORT}/api/pose`);
    console.log(`🍎 Diet API:      http://localhost:${PORT}/api/diet`);
    console.log(`📊 Analytics API: http://localhost:${PORT}/api/analytics`);
    console.log(`========================================\n`);
});