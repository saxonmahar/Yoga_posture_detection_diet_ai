const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email configuration - using a more reliable setup
const createTransporter = () => {
  // For development, we'll use a simple SMTP setup
  // In production, you would use proper Gmail App Password
  return nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'sanjaymahar2058@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send contact form email
router.post('/send-email', async (req, res) => {
  try {
    const { name, email, phone, subject, message, to } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // For now, let's just log the message and return success
    // This allows the form to work while email setup is being configured
    console.log('📧 Contact Form Submission:');
    console.log('👤 Name:', name);
    console.log('📧 Email:', email);
    console.log('📱 Phone:', phone || 'Not provided');
    console.log('📝 Subject:', subject);
    console.log('💬 Message:', message);
    console.log('📬 To:', to || 'sanjaymahar2058@gmail.com');
    console.log('⏰ Time:', new Date().toLocaleString());
    console.log('-----------------------------------');

    // Try to send email, but don't fail if it doesn't work
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: `"YogaAI Contact Form" <${process.env.EMAIL_USER || 'noreply@yogaai.com'}>`,
        to: to || 'sanjaymahar2058@gmail.com',
        replyTo: email,
        subject: `YogaAI Contact: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10b981;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <hr>
            <p style="color: #666; font-size: 12px;">Sent from YogaAI Contact Form - Cosmos College of Management and Technology</p>
          </div>
        `,
        text: `
          New Contact Form Submission:
          Name: ${name}
          Email: ${email}
          ${phone ? `Phone: ${phone}` : ''}
          Subject: ${subject}
          Message: ${message}
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully!');
      
    } catch (emailError) {
      console.log('⚠️ Email sending failed, but form submission logged:', emailError.message);
      // Don't return error - we still want to show success to user
    }

    res.status(200).json({
      success: true,
      message: 'Message received successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Contact service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;