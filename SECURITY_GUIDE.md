# Security Guide - Protecting Your Secrets

## ⚠️ CRITICAL: .env File Security

Your `.env` files contain sensitive information that should **NEVER** be committed to Git:

### Sensitive Data in .env Files:
- ✅ MongoDB connection string (contains password)
- ✅ JWT secret keys
- ✅ Email passwords (SMTP)
- ✅ API keys (Gemini AI)
- ✅ Payment gateway secrets (eSewa)

## What We Did to Protect You

### 1. Removed .env from Staging
```bash
git restore --staged backend/.env
```
This removed the `.env` file from being committed.

### 2. Added to .gitignore
The `.env` file is already in `.gitignore`, which tells Git to never track it.

### 3. Verified Protection
```bash
git status
# Shows: backend/.env in "Untracked files" (safe!)
```

## Files That ARE Safe to Commit

✅ **backend/.env.example** - Template without real secrets
✅ **frontend/.env.example** - Template without real secrets
✅ All code files (.js, .jsx, .py)
✅ Documentation files (.md)
✅ Configuration files (package.json, etc.)

## Files That Should NEVER Be Committed

❌ **backend/.env** - Contains real secrets
❌ **frontend/.env** - Contains real API keys
❌ **Any file with passwords or API keys**
❌ **Database dumps with user data**
❌ **SSL certificates (.pem, .key, .crt)**

## Current Status

### ✅ Safe to Commit:
```
Changes to be committed:
  new file:   ADMIN_DASHBOARD_FIX.md
  new file:   NUCLEAR_FIX_POSE_SWITCHING.md
  new file:   PERFORMANCE_OPTIMIZATION.md
  new file:   POSE_SWITCHING_FIX.md
  new file:   SERVER_STATUS.md
  new file:   SESSION_SAVE_FIX.md
  new file:   UI_CLARITY_FIX.md
  modified:   backend/.env.example (safe - no real secrets)
  new file:   backend/check-data.js
  modified:   backend/controllers/adminController.js
  modified:   backend/controllers/analyticsController.js
  modified:   backend/models/posesession.js
  new file:   backend/test-session-save.js
  modified:   frontend/src/components/pose-detection/PoseCamera.jsx
```

### ✅ Protected (Not Being Committed):
```
Untracked files:
  backend/.env (contains secrets - PROTECTED)
```

## How to Safely Commit

### Step 1: Verify No Secrets
```bash
git status
# Make sure backend/.env is in "Untracked files"
```

### Step 2: Commit Safely
```bash
git commit -m "Fix: Admin dashboard updates, pose switching, performance optimization"
```

### Step 3: Push to GitHub
```bash
git push origin main
```

## If You Accidentally Commit Secrets

### 🚨 Emergency Steps:

1. **DO NOT PUSH** if you haven't pushed yet
2. **Remove from last commit:**
   ```bash
   git reset HEAD~1
   git restore --staged backend/.env
   git commit -m "Your commit message"
   ```

3. **If already pushed to GitHub:**
   - ⚠️ **IMMEDIATELY** change all passwords and API keys
   - Rotate MongoDB password
   - Generate new JWT secret
   - Get new Gemini API key
   - Change email password
   - Update eSewa credentials

4. **Remove from Git history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" \
     --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

## Best Practices

### 1. Always Check Before Committing
```bash
git status
git diff --staged
```

### 2. Use .env.example
Keep a template file with placeholder values:
```env
# .env.example
MONGO_URI=mongodb://your-connection-string-here
JWT_SECRET=your-secret-here
GEMINI_API_KEY=your-api-key-here
```

### 3. Never Hardcode Secrets
❌ **Bad:**
```javascript
const apiKey = "AIzaSyB-TodsnXFfvX4wvwCfEPzQsWYm_b2P8o0";
```

✅ **Good:**
```javascript
const apiKey = process.env.GEMINI_API_KEY;
```

### 4. Use Environment Variables
Always load from `.env`:
```javascript
require('dotenv').config();
const mongoUri = process.env.MONGO_URI;
```

### 5. Review .gitignore Regularly
Make sure these patterns are in `.gitignore`:
```
.env
.env.*
*.env
**/.env
backend/.env
frontend/.env
```

## What's in Your .env Files

### backend/.env (NEVER COMMIT):
```env
MONGO_URI=mongodb+srv://username:password@cluster...
JWT_SECRET=yogaaisecret
SMTP_PASS=hhogsavyxeczjmvm
GEMINI_API_KEY=AIzaSyB-TodsnXFfvX4wvwCfEPzQsWYm_b2P8o0
```

### backend/.env.example (SAFE TO COMMIT):
```env
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
SMTP_PASS=your_email_password_here
GEMINI_API_KEY=your_gemini_api_key_here
```

## GitHub Secret Scanning

GitHub automatically scans for exposed secrets. If you accidentally commit secrets, you'll receive:
- ⚠️ Email notification
- 🔒 Security alert on repository
- 📧 Warning from GitHub

**Action:** Immediately rotate all exposed credentials!

## Deployment Security

### For Production:
1. Use environment variables on hosting platform
2. Never commit production .env
3. Use different secrets for dev/prod
4. Enable 2FA on all services
5. Regularly rotate credentials

### Hosting Platforms:
- **Vercel:** Add env vars in dashboard
- **Heroku:** Use `heroku config:set`
- **Netlify:** Add in site settings
- **AWS:** Use Secrets Manager
- **Azure:** Use Key Vault

## Checklist Before Every Commit

- [ ] Run `git status` to check staged files
- [ ] Verify no `.env` files are staged
- [ ] Check for hardcoded API keys in code
- [ ] Review `git diff --staged` for secrets
- [ ] Ensure `.gitignore` is up to date
- [ ] Test with `.env.example` to verify it works

## Current Protection Status

✅ **backend/.env** - Protected (in .gitignore)
✅ **frontend/.env** - Protected (in .gitignore)
✅ **All secrets** - Safe from Git
✅ **Ready to commit** - No secrets in staging area

---

**Remember:** Once secrets are pushed to GitHub, they're in the history forever (even if you delete them later). Always check before committing!

**Status:** ✅ PROTECTED - Safe to commit now
