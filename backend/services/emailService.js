const nodemailer = require('nodemailer');

// Create email transporter based on provider
const createTransporter = () => {
  const provider = process.env.EMAIL_PROVIDER || 'gmail';
  
  console.log('📧 Creating email transporter for provider:', provider);
  console.log('📧 SMTP_USER:', process.env.SMTP_USER);
  console.log('📧 SMTP_HOST:', process.env.SMTP_HOST);
  console.log('📧 SMTP_PORT:', process.env.SMTP_PORT);
  
  if (provider.toLowerCase() === 'smtp') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  
  // Default to Gmail
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
    }
  });
};

// Get sender email address
const getSenderEmail = () => {
  return process.env.SMTP_USER || process.env.EMAIL_USER;
};

// Get sender name
const getSenderName = () => {
  return process.env.EMAIL_FROM_NAME || 'YogaAI - Yoga Posture Detection';
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email, otp, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: getSenderName(),
        address: getSenderEmail()
      },
      to: email,
      subject: 'Verify Your Email - YogaAI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - YogaAI</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #06b6d4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px solid #10b981; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 5px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981, #06b6d4); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧘‍♀️ YogaAI</h1>
              <p>Welcome to Your Wellness Journey</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Thank you for registering with YogaAI. To complete your account setup, please verify your email address using the code below:</p>
              
              <div class="otp-box">
                <p>Your Verification Code:</p>
                <div class="otp-code">${otp}</div>
                <p><small>This code expires in 10 minutes</small></p>
              </div>
              
              <p>Enter this code on the verification page to activate your account and start your yoga journey with AI-powered pose detection and personalized diet recommendations.</p>
              
              <p><strong>Why verify your email?</strong></p>
              <ul>
                <li>🔒 Secure your account</li>
                <li>📧 Receive important updates</li>
                <li>🎯 Get personalized recommendations</li>
                <li>📊 Access your progress reports</li>
              </ul>
              
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 YogaAI - Intelligent Yoga & Wellness Platform</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: getSenderName(),
        address: getSenderEmail()
      },
      to: email,
      subject: 'Welcome to YogaAI! 🧘‍♀️',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to YogaAI</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #06b6d4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #10b981; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to YogaAI!</h1>
              <p>Your wellness journey starts now</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>Congratulations! Your email has been verified and your YogaAI account is now active.</p>
              
              <h3>🚀 What's Next?</h3>
              
              <div class="feature">
                <h4>🤖 AI Pose Detection</h4>
                <p>Get real-time feedback on your yoga poses with our advanced AI technology.</p>
              </div>
              
              <div class="feature">
                <h4>🍎 Personalized Diet Plans</h4>
                <p>Receive nutrition recommendations tailored to your fitness goals.</p>
              </div>
              
              <div class="feature">
                <h4>📊 Progress Tracking</h4>
                <p>Monitor your improvement with detailed analytics and insights.</p>
              </div>
              
              <div class="feature">
                <h4>📅 Session Scheduling</h4>
                <p>Plan your yoga sessions with our intelligent scheduling system.</p>
              </div>
              
              <p>Ready to begin? Log in to your dashboard and start your first session!</p>
              
              <p>Namaste,<br>The YogaAI Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Welcome email failed:', error);
    return { success: false, error: error.message };
  }
};

// Send login notification email
const sendLoginNotification = async (email, userName, loginDetails) => {
  try {
    const transporter = createTransporter();
    
    const { 
      ipAddress, 
      deviceInfo, 
      location, 
      loginTime, 
      isNewDevice, 
      isNewLocation,
      securityToken 
    } = loginDetails;

    const confirmUrl = `${process.env.FRONTEND_URL}/security/confirm?token=${securityToken}`;
    const denyUrl = `${process.env.FRONTEND_URL}/security/deny?token=${securityToken}`;

    const mailOptions = {
      from: {
        name: 'YogaAI Security',
        address: getSenderEmail()
      },
      to: email,
      subject: '🔐 New Login to Your YogaAI Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Login Notification - YogaAI</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .button { display: inline-block; padding: 12px 24px; margin: 10px 5px; text-decoration: none; border-radius: 6px; font-weight: bold; text-align: center; }
            .confirm-btn { background: #10b981; color: white; }
            .deny-btn { background: #ef4444; color: white; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Login Notification</h1>
              <p>We detected a new login to your account</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              
              ${isNewDevice || isNewLocation ? `
                <div class="warning">
                  <strong>⚠️ Security Alert:</strong> This login is from a ${isNewDevice ? 'new device' : ''}${isNewDevice && isNewLocation ? ' and ' : ''}${isNewLocation ? 'new location' : ''}.
                </div>
              ` : ''}
              
              <p>We detected a login to your YogaAI account with the following details:</p>
              
              <div class="info-box">
                <h3>📅 Login Details</h3>
                <p><strong>Time:</strong> ${new Date(loginTime).toLocaleString()}</p>
                <p><strong>IP Address:</strong> ${ipAddress}</p>
                <p><strong>Device:</strong> ${deviceInfo.browser} on ${deviceInfo.os}</p>
                ${location.city ? `<p><strong>Location:</strong> ${location.city}, ${location.country}</p>` : ''}
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <h3>Was this you?</h3>
                <a href="${confirmUrl}" class="button confirm-btn">✅ Yes, it was me</a>
                <a href="${denyUrl}" class="button deny-btn">❌ No, secure my account</a>
              </div>
              
              <div class="info-box">
                <h3>🛡️ Security Tips</h3>
                <ul>
                  <li>Never share your login credentials</li>
                  <li>Use a strong, unique password</li>
                  <li>Log out from shared devices</li>
                  <li>Report suspicious activity immediately</li>
                </ul>
              </div>
              
              <p><small>If you didn't request this login, please click "No, secure my account" immediately. We'll help you secure your account.</small></p>
              
              <p>Stay safe,<br>YogaAI Security Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Login notification sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Login notification failed:', error);
    return { success: false, error: error.message };
  }
};

// Send security alert email
const sendSecurityAlert = async (email, userName, alertDetails) => {
  try {
    const transporter = createTransporter();
    
    const { alertType, details, actionTaken } = alertDetails;

    const mailOptions = {
      from: {
        name: 'YogaAI Security Alert',
        address: getSenderEmail()
      },
      to: email,
      subject: `🚨 Security Alert - ${alertType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Security Alert - YogaAI</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .alert-box { background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .action-box { background: #f0fdf4; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 Security Alert</h1>
              <p>Important security notification</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              
              <div class="alert-box">
                <h3>⚠️ ${alertType}</h3>
                <p>${details}</p>
              </div>
              
              ${actionTaken ? `
                <div class="action-box">
                  <h3>🛡️ Action Taken</h3>
                  <p>${actionTaken}</p>
                </div>
              ` : ''}
              
              <h3>🔒 Recommended Actions:</h3>
              <ul>
                <li>Change your password immediately</li>
                <li>Review recent account activity</li>
                <li>Enable two-factor authentication</li>
                <li>Contact support if you need help</li>
              </ul>
              
              <p>If you have any concerns, please contact our support team immediately.</p>
              
              <p>Stay secure,<br>YogaAI Security Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Security alert sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Security alert failed:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'YogaAI Security',
        address: getSenderEmail()
      },
      to: email,
      subject: '🔐 Password Reset Request - YogaAI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - YogaAI</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .token-box { background: white; border: 2px solid #ef4444; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .token-code { font-size: 32px; font-weight: bold; color: #ef4444; letter-spacing: 5px; margin: 10px 0; }
            .warning-box { background: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
              <p>Reset your YogaAI account password</p>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>We received a request to reset your YogaAI account password. Use the code below to reset your password:</p>
              
              <div class="token-box">
                <p>Your Reset Code:</p>
                <div class="token-code">${resetToken}</div>
                <p><small>This code expires in 15 minutes</small></p>
              </div>
              
              <div class="warning-box">
                <h3>⚠️ Security Notice</h3>
                <ul>
                  <li>If you didn't request this reset, ignore this email</li>
                  <li>Never share this code with anyone</li>
                  <li>This code expires in 15 minutes</li>
                  <li>Only use this code on the official YogaAI website</li>
                </ul>
              </div>
              
              <p>If you continue to have problems, please contact our support team.</p>
              
              <p>Stay secure,<br>YogaAI Security Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Password reset email failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendLoginNotification,
  sendSecurityAlert,
  sendPasswordResetEmail
};