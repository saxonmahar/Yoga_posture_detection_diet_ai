# 🚀 Quick Email Setup for YogaAI

## For New Users/Administrators

Your YogaAI system needs email configuration to send verification codes and notifications. **You don't need to use personal Gmail credentials!**

## 📧 **Easy Setup Options**

### **Option 1: Create a Dedicated Gmail Account (Recommended)**

1. **Create a new Gmail account** specifically for your YogaAI app:
   - Example: `yourapp.notifications@gmail.com`
   - Example: `yogaai.system@gmail.com`

2. **Enable 2-Factor Authentication** on this account

3. **Generate App Password:**
   - Go to Google Account Settings → Security
   - Click "2-Step Verification" → "App passwords"
   - Generate password for "YogaAI"
   - Copy the 16-character password

4. **Update your `.env` file:**
   ```env
   EMAIL_PROVIDER=smtp
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=yourapp.notifications@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

### **Option 2: Use Your Existing Email Provider**

Most email providers support SMTP. Common examples:

**For Yahoo Mail:**
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-yahoo-app-password
```

**For Outlook/Hotmail:**
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-outlook-password
```

**For Custom Domain:**
```env
EMAIL_PROVIDER=smtp
SMTP_HOST=mail.your-domain.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@your-domain.com
SMTP_PASS=your-email-password
```

### **Option 3: Professional Email Services (Free Tiers Available)**

**SendGrid (100 emails/day free):**
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@your-domain.com
```

**Mailgun (5,000 emails/month free for 3 months):**
```env
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain.com
MAILGUN_FROM_EMAIL=noreply@your-domain.com
```

## 🧪 **Testing Your Setup**

1. **Update your `.env` file** with chosen provider
2. **Restart your backend server**
3. **Test registration** with a real email address
4. **Check inbox** for verification email

## 🔒 **Security Best Practices**

- ✅ Use dedicated email accounts for your app
- ✅ Never share your personal email credentials
- ✅ Use app passwords instead of regular passwords
- ✅ Keep your `.env` file secure and never commit it to Git

## ❓ **Need Help?**

1. Check `EMAIL_PROVIDERS_GUIDE.md` for detailed setup instructions
2. Use the test files in your project root to verify email functionality
3. Check backend console logs for email sending errors

**The system is ready - you just need to configure one email provider!**