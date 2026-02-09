// Simple Admin Login Controller
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const adminLoginController = async (req, res) => {
  console.log('🔐 ADMIN LOGIN ATTEMPT');
  
  try {
    const { email, password } = req.body;
    console.log('📧 Email:', email);

    // Find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    console.log('✅ User found:', user.email);
    console.log('🛡️  User role:', user.role);

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    console.log('✅ Password correct');

    // Check if admin
    if (user.role !== 'admin') {
      console.log('❌ Not an admin! Role:', user.role);
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }

    console.log('✅ Admin verified!');

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // Simple admin data
    const adminData = {
      id: user._id,
      name: user.fullName || user.name,
      email: user.email,
      role: 'admin' // FORCE admin role
    };

    console.log('📦 Sending admin data:', adminData);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: { user: adminData }
    });

  } catch (err) {
    console.error("❌ Admin login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = adminLoginController;
