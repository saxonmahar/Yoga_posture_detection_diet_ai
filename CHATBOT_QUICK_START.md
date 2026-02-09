# 🚀 Gemini Chatbot - Quick Start (5 Minutes)

## Step 1: Get Free API Key (2 minutes)

1. Open: **https://makersuite.google.com/app/apikey**
2. Sign in with Google account
3. Click **"Create API Key"**
4. Click **"Create API key in new project"**
5. **Copy** the generated key

## Step 2: Add to Backend (1 minute)

1. Open `backend/.env` file
2. Add this line at the end:
   ```
   GEMINI_API_KEY=paste_your_key_here
   ```
3. Save the file

## Step 3: Restart Backend (30 seconds)

```bash
# Stop current backend (Ctrl+C in terminal)
# Start again
cd backend
node index.js
```

## Step 4: Test Chatbot (1 minute)

1. Go to **http://localhost:3002/login**
2. Login with any account
3. Look for **purple chat button** (bottom-right corner)
4. Click it and type: **"How do I do Tree Pose?"**
5. Get instant AI response! 🎉

## ✅ Done!

Your chatbot is now working! Try these questions:

- "What should I eat after yoga?"
- "Tips for better balance?"
- "How can I improve my practice?"
- "Benefits of Warrior II pose?"

## 🐛 Not Working?

### Chat button not showing?
- Make sure you're logged in
- Refresh the page

### "API Key not configured" error?
- Check if GEMINI_API_KEY is in backend/.env
- Restart backend server
- Verify API key is correct

### Need detailed help?
See **GEMINI_CHATBOT_SETUP.md** for complete guide

---


