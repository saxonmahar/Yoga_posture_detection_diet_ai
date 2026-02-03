# 📧 Gmail App Password Setup Guide

## Why do you need this?
Your YogaAI application needs to send verification emails to users. Gmail requires an "App Password" for security when third-party applications send emails.

## 🔧 Step-by-Step Setup:

### 1. Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **"Security"** in the left sidebar
3. Find **"2-Step Verification"** and enable it if not already enabled
4. Follow the setup process (you'll need your phone)

### 2. Generate App Password
1. Still in Security settings, search for **"App passwords"**
2. Click on **"App passwords"**
3. You might need to sign in again
4. Select:
   - **App**: Mail
   - **Device**: Other (Custom name)
5. Enter **"YogaAI"** as the custom name
6. Click **"Generate"**

### 3. Copy the Password
- Google will show you a 16-character password like: `abcd efgh ijkl mnop`
- **Copy this password immediately** (you won't see it again)

### 4. Update Your .env File
1. Open `backend/.env` file
2. Replace `your-gmail-app-password-here` with the 16-character password
3. Save the file

```env
EMAIL_USER=sanjaymahar2058@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

### 5. Restart Backend
After updating the .env file, restart your backend server to load the new credentials.

## 🧪 Test Email Sending

Once set up, you can test by:
1. Registering with your real email address
2. Check your inbox for the verification email
3. Enter the OTP code on the verification page

## 🔒 Security Notes

- **Never share your app password**
- **Don't commit it to Git** (it's in .env which should be in .gitignore)
- **Use only for this application**
- **You can revoke it anytime** from Google Account settings

## ❓ Troubleshooting

**"Invalid credentials" error?**
- Make sure you're using the app password, not your regular Gmail password
- Check that 2-factor authentication is enabled
- Verify the email address matches exactly

**Still not working?**
- Try generating a new app password
- Make sure there are no extra spaces in the .env file
- Restart the backend after making changes

---

**Need help?** The app password should look like: `abcd efgh ijkl mnop` (16 characters with spaces)