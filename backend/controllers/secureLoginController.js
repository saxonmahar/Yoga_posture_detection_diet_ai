const User = require("../models/user");
const LoginSecurity = require("../models/loginSecurity");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendLoginNotification, sendSecurityAlert } = require("../services/emailService");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Helper function to parse user agent
const parseUserAgent = (userAgent) => {
  const ua = userAgent.toLowerCase();
  
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';
  
  // Browser detection
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // OS detection
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios')) os = 'iOS';
  
  // Device detection
  const isMobile = ua.includes('mobile') || ua.includes('android') || ua.includes('ios');
  if (isMobile) device = 'Mobile';
  else if (ua.includes('tablet')) device = 'Tablet';
  
  return { browser, os, device, isMobile };
};

// Helper function to get location info (basic IP-based)
const getLocationInfo = async (ipAddress) => {
  // In production, you'd use a service like ipapi.co, ipinfo.io, etc.
  // For now, return basic info
  return {
    country: 'Unknown',
    region: 'Unknown', 
    city: 'Unknown',
    timezone: 'Unknown'
  };
};

// Enhanced login controller with security features
const secureLoginController = async (req, res) => {
  console.log('🔍 SECURE LOGIN CONTROLLER HIT - Email:', req.body.email);
  
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || 'Unknown';
    const userAgent = req.get('User-Agent') || 'Unknown';

    // Check if IP is blocked
    const isBlocked = await LoginSecurity.isIpBlocked(ipAddress);
    if (isBlocked) {
      await LoginSecurity.create({
        email: email.toLowerCase(),
        ipAddress,
        userAgent,
        deviceInfo: parseUserAgent(userAgent),
        status: 'blocked',
        failureReason: 'IP blocked due to too many failed attempts'
      });

      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Please try again later.",
        blocked: true
      });
    }

    // Check recent failed attempts for this email
    const recentFailures = await LoginSecurity.getRecentFailedAttempts(email);
    if (recentFailures >= 5) {
      await LoginSecurity.create({
        email: email.toLowerCase(),
        ipAddress,
        userAgent,
        deviceInfo: parseUserAgent(userAgent),
        status: 'blocked',
        failureReason: 'Too many failed attempts for this email'
      });

      return res.status(429).json({
        success: false,
        message: "Too many failed attempts for this email. Please try again later.",
        blocked: true
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password +profilePhoto");

    if (!user) {
      // Log failed attempt
      await LoginSecurity.create({
        email: email.toLowerCase(),
        ipAddress,
        userAgent,
        deviceInfo: parseUserAgent(userAgent),
        status: 'failed',
        failureReason: 'User not found'
      });

      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log failed attempt
      await LoginSecurity.create({
        user: user._id,
        email: email.toLowerCase(),
        ipAddress,
        userAgent,
        deviceInfo: parseUserAgent(userAgent),
        status: 'failed',
        failureReason: 'Invalid password'
      });

      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
        requiresVerification: true,
        email: user.email
      });
    }

    // Check for new device/location
    const { isNewDevice, isNewLocation } = await LoginSecurity.checkNewDeviceOrLocation(
      user._id, 
      ipAddress, 
      userAgent
    );

    const deviceInfo = parseUserAgent(userAgent);
    const location = await getLocationInfo(ipAddress);
    const isSuspicious = isNewDevice || isNewLocation;

    // Generate security token for email verification
    const securityToken = crypto.randomBytes(32).toString('hex');

    // Log successful login
    const loginRecord = await LoginSecurity.create({
      user: user._id,
      email: email.toLowerCase(),
      ipAddress,
      userAgent,
      deviceInfo,
      location,
      status: 'success',
      isNewDevice,
      isNewLocation,
      isSuspicious,
      securityToken,
      emailNotificationSent: false
    });

    // Send security notification if suspicious
    if (isSuspicious) {
      try {
        const emailResult = await sendLoginNotification(user.email, user.fullName, {
          ipAddress,
          deviceInfo,
          location,
          loginTime: new Date(),
          isNewDevice,
          isNewLocation,
          securityToken
        });

        if (emailResult.success) {
          loginRecord.emailNotificationSent = true;
          await loginRecord.save();
        }
      } catch (emailError) {
        console.error('Failed to send login notification:', emailError);
      }
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

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
      bodyType: user.bodyType || 'mesomorphic',
      goal: user.goal || 'maintain',
      bmi: user.bmi,
      profilePhoto: user.profilePhoto, // Add profile photo to user data
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
      security: {
        isNewDevice,
        isNewLocation,
        notificationSent: isSuspicious && loginRecord.emailNotificationSent
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = secureLoginController;