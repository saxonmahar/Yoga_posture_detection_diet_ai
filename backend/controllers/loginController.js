// controllers/authController.js
const User = require("../models/User"); // Your User model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use env variable in production

// POST /api/auth/login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Cannot be accessed by JS
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax", // Lax for dev, Strict for prod
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/", // Ensure cookie is available for all paths
    });

    // Map user data to match frontend expectations (same structure as getMeController)
    const userData = {
      id: user._id,
      name: user.fullName || user.name,
      email: user.email,
      age: user.age,
      weight: user.weight,
      height: user.height,
      isPremium: user.isPremium || false,
      level: user.fitnessLevel || 'beginner',
      bodyType: user.bodyType || 'mesomorphic',
      goal: user.goal || 'maintain',
      bmi: user.bmi,
      stats: {
        totalWorkouts: user.stats?.totalWorkouts || 0,
        currentStreak: user.stats?.currentStreak || 0,
        averageAccuracy: user.stats?.averageAccuracy || 0,
        goal: user.goal || 'maintain',
        activityLevel: 'moderately_active',
        weight: user.weight || 70,
        height: user.height || 170,
        age: user.age || 25
      }
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user: userData },
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error. Please try again later.",
      });
  }
};

module.exports = loginController;
