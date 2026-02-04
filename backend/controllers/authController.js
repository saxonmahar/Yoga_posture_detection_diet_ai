// controllers/authController.js
const User = require("../models/user");

// GET /api/auth/me - Get current logged-in user
const getMeController = async (req, res) => {
  try {
    // req.user is set by authMiddleware after token verification
    const userId = req.user?.id || req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    // Find user by ID and exclude password
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Map user data to match frontend expectations
    const userData = {
      id: user._id,
      name: user.fullName || user.name,
      email: user.email,
      age: user.age,
      weight: user.weight,
      height: user.height,
      isPremium: user.isPremium || false,
      level: user.fitnessLevel || 'beginner',
      profilePhoto: user.profilePhoto, // Add profile photo to user data
      stats: {
        totalWorkouts: user.stats?.totalWorkouts || 0,
        currentStreak: user.stats?.currentStreak || 0,
        averageAccuracy: user.stats?.averageAccuracy || 0,
        goal: user.wellnessGoals?.[0]?.toLowerCase().replace(' ', '-') || 'maintain',
        activityLevel: 'moderately_active',
        weight: user.weight || 70,
        height: user.height || 170,
        age: user.age || 25
      }
    };

    console.log('🔍 /ME DEBUG - User from DB:', {
      id: user._id,
      email: user.email,
      profilePhoto: user.profilePhoto
    });
    console.log('🔍 /ME DEBUG - Mapped userData:', {
      id: userData.id,
      email: userData.email,
      profilePhoto: userData.profilePhoto
    });

    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
};

// POST /api/auth/logout - Logout user (clear cookie)
const logoutController = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again later.'
    });
  }
};

module.exports = { getMeController, logoutController };

