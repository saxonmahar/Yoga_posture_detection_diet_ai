const LoginSecurity = require("../models/loginSecurity");
const User = require("../models/User");
const { sendSecurityAlert } = require("../services/emailService");

// Confirm login security
const confirmLogin = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Security token is required"
      });
    }

    // Find login record by security token
    const loginRecord = await LoginSecurity.findOne({
      securityToken: token,
      userConfirmed: 'pending',
      loginAttemptAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Within 24 hours
    }).populate('user');

    if (!loginRecord) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired security token"
      });
    }

    // Update login record as confirmed
    loginRecord.userConfirmed = 'confirmed';
    loginRecord.confirmedAt = new Date();
    await loginRecord.save();

    res.status(200).json({
      success: true,
      message: "Login confirmed successfully. Thank you for keeping your account secure!",
      user: loginRecord.user.fullName
    });

  } catch (error) {
    console.error("Confirm login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during confirmation"
    });
  }
};

// Deny login and secure account
const denyLogin = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Security token is required"
      });
    }

    // Find login record by security token
    const loginRecord = await LoginSecurity.findOne({
      securityToken: token,
      userConfirmed: 'pending',
      loginAttemptAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Within 24 hours
    }).populate('user');

    if (!loginRecord) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired security token"
      });
    }

    // Update login record as denied
    loginRecord.userConfirmed = 'denied';
    loginRecord.confirmedAt = new Date();
    await loginRecord.save();

    // Mark all recent sessions from this IP/device as suspicious
    await LoginSecurity.updateMany({
      user: loginRecord.user._id,
      ipAddress: loginRecord.ipAddress,
      status: 'success',
      loginAttemptAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    }, {
      isSuspicious: true,
      userConfirmed: 'denied'
    });

    // Send security alert email
    try {
      await sendSecurityAlert(loginRecord.user.email, loginRecord.user.fullName, {
        alertType: 'Unauthorized Login Attempt',
        details: `We detected an unauthorized login attempt to your account from IP ${loginRecord.ipAddress} using ${loginRecord.deviceInfo.browser} on ${loginRecord.deviceInfo.os}.`,
        actionTaken: 'We have flagged this login as suspicious and recommend you change your password immediately.'
      });
    } catch (emailError) {
      console.error('Failed to send security alert:', emailError);
    }

    res.status(200).json({
      success: true,
      message: "Login denied and account secured. We've sent you additional security information.",
      user: loginRecord.user.fullName,
      securityActions: [
        "Login marked as unauthorized",
        "Similar logins flagged as suspicious", 
        "Security alert email sent",
        "Recommend changing password"
      ]
    });

  } catch (error) {
    console.error("Deny login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during security action"
    });
  }
};

// Get security dashboard data
const getSecurityDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get recent login activity (last 30 days)
    const recentLogins = await LoginSecurity.find({
      user: userId,
      loginAttemptAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ loginAttemptAt: -1 }).limit(20);

    // Get security stats
    const stats = {
      totalLogins: await LoginSecurity.countDocuments({ user: userId, status: 'success' }),
      failedAttempts: await LoginSecurity.countDocuments({ user: userId, status: 'failed' }),
      suspiciousLogins: await LoginSecurity.countDocuments({ user: userId, isSuspicious: true }),
      uniqueDevices: await LoginSecurity.distinct('userAgent', { user: userId, status: 'success' }).then(agents => agents.length),
      uniqueLocations: await LoginSecurity.distinct('ipAddress', { user: userId, status: 'success' }).then(ips => ips.length)
    };

    // Get pending confirmations
    const pendingConfirmations = await LoginSecurity.find({
      user: userId,
      userConfirmed: 'pending',
      emailNotificationSent: true,
      loginAttemptAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({
      success: true,
      data: {
        recentLogins: recentLogins.map(login => ({
          id: login._id,
          date: login.loginAttemptAt,
          ipAddress: login.ipAddress,
          device: `${login.deviceInfo.browser} on ${login.deviceInfo.os}`,
          location: login.location.city ? `${login.location.city}, ${login.location.country}` : 'Unknown',
          status: login.status,
          isNewDevice: login.isNewDevice,
          isNewLocation: login.isNewLocation,
          isSuspicious: login.isSuspicious,
          confirmed: login.userConfirmed
        })),
        stats,
        pendingConfirmations: pendingConfirmations.length
      }
    });

  } catch (error) {
    console.error("Security dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load security dashboard"
    });
  }
};

module.exports = {
  confirmLogin,
  denyLogin,
  getSecurityDashboard
};