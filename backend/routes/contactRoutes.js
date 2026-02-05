const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

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

    console.log('📧 Contact Form Submission:');
    console.log('👤 Name:', name);
    console.log('📧 Email:', email);
    console.log('📱 Phone:', phone || 'Not provided');
    console.log('📝 Subject:', subject);
    console.log('💬 Message:', message);
    console.log('📬 To:', to || 'sanjaymahar2058@gmail.com');
    console.log('⏰ Time:', new Date().toLocaleString());
    console.log('-----------------------------------');

    // Send contact email using the existing email service
    const result = await sendContactEmail(email, name, phone, subject, message, to);
    
    if (result.success) {
      console.log('✅ Contact email sent successfully!');
      res.status(200).json({
        success: true,
        message: 'Message sent successfully! We will get back to you within 24 hours.'
      });
    } else {
      console.log('⚠️ Email sending failed:', result.error);
      // Still return success to user, but log the error
      res.status(200).json({
        success: true,
        message: 'Message received! We will get back to you soon.'
      });
    }

  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Send contact email function
const sendContactEmail = async (senderEmail, senderName, phone, subject, message, recipientEmail) => {
  try {
    const nodemailer = require('nodemailer');
    
    // Create transporter using the same config as emailService
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: {
        name: 'YogaAI Contact Form',
        address: process.env.SMTP_USER
      },
      to: recipientEmail || 'sanjaymahar2058@gmail.com',
      replyTo: senderEmail,
      subject: `YogaAI Contact: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Contact Form Submission - YogaAI</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #06b6d4); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .message-box { background: #f0fdf4; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Contact Form Submission</h1>
              <p>YogaAI - Yoga Posture Detection & Diet AI</p>
            </div>
            <div class="content">
              <h2>Contact Details</h2>
              
              <div class="info-box">
                <h3>👤 Sender Information</h3>
                <p><strong>Name:</strong> ${senderName}</p>
                <p><strong>Email:</strong> ${senderEmail}</p>
                ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })} NPT</p>
              </div>
              
              <div class="message-box">
                <h3>💬 Message</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              
              <div class="info-box">
                <h3>📋 Next Steps</h3>
                <ul>
                  <li>Reply directly to this email to respond to ${senderName}</li>
                  <li>The sender's email (${senderEmail}) is set as the reply-to address</li>
                  <li>Expected response time: Within 24 hours</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 YogaAI - Cosmos College of Management and Technology</p>
              <p>This message was sent through the YogaAI contact form</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Contact Form Submission - YogaAI
        
        Sender Information:
        Name: ${senderName}
        Email: ${senderEmail}
        ${phone ? `Phone: ${phone}` : ''}
        Subject: ${subject}
        Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })} NPT
        
        Message:
        ${message}
        
        ---
        Reply directly to this email to respond to the sender.
        YogaAI - Cosmos College of Management and Technology
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Contact email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Contact email failed:', error);
    return { success: false, error: error.message };
  }
};

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Contact service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;