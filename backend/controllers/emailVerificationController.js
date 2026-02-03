const User = require("../models/User");
const { generateOTP, sendVerificationEmail, sendWelcomeEmail } = require("../services/emailService");

// Verify email with OTP
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    // Find user with matching email and verification token
    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationToken: otp,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code"
      });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.fullName);

    res.status(200).json({
      success: true,
      message: "Email verified successfully! Welcome to YogaAI.",
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during verification"
    });
  }
};

// Resend verification email
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find unverified user
    const user = await User.findOne({
      email: email.toLowerCase(),
      isEmailVerified: false
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or already verified"
      });
    }

    // Generate new OTP
    const newOTP = generateOTP();
    const newExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new verification token
    user.emailVerificationToken = newOTP;
    user.emailVerificationExpires = newExpires;
    await user.save();

    // Send new verification email
    const emailResult = await sendVerificationEmail(user.email, newOTP, user.fullName);

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email"
      });
    }

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully"
    });

  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while resending email"
    });
  }
};

// Check verification status
const checkVerificationStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      isEmailVerified: user.isEmailVerified,
      email: user.email
    });

  } catch (error) {
    console.error("Check verification status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  verifyEmail,
  resendVerificationEmail,
  checkVerificationStatus
};