# ⚡ Quick Reference Guide

> Fast lookup for common tasks, paths, and commands

## 🚀 Start Servers

```bash
# All at once (Windows)
start-servers.bat

# Individual servers
cd backend && npm start                                    # API (5001)
cd backend && node photo-server.js                         # Photos (5010)
cd backend/Ml && python app.py                             # ML (5000)
cd backend/Diet_Recommendation_System && python app.py     # Diet (5002)
cd frontend && npm run dev                                 # Frontend (3002)
```

## 📂 Important Files

| Purpose | Path |
|---------|------|
| Backend Entry | `backend/index.js` |
| Frontend Entry | `frontend/src/main.jsx` |
| Pose Detection | `frontend/src/components/pose-detection/PoseCamera.jsx` |
| Diet Page | `frontend/src/pages/DietPlanPage.jsx` |
| Dashboard | `frontend/src/pages/Dashboard.jsx` |
| ML Service | `backend/Ml/app.py` |
| Diet Service | `backend/Diet_Recommendation_System/app.py` |
| Auth Context | `frontend/src/context/AuthContext.jsx` |
| User Model | `backend/models/user.js` |
| Session Model | `backend/models/posesession.js` |

## 🛣️ API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/analytics/session` | POST | Save yoga session |
| `/api/analytics/user/:id` | GET | Get user analytics |
| `/api/diet/recommend` | POST | Get diet plan |
| `/api/ml/detect-pose` | POST | Detect pose |
| `/api/chat/message` | POST | Send chat message |
| `/api/admin/login` | POST | Admin login |

## 🔧 Utility Scripts

```bash
# Admin Management
node backend/setup-your-admin.js           # Create first admin
node backend/change-admin.js               # Change admin credentials
node backend/make-admin.js                 # Make user admin

# User Management
node backend/list-users.js                 # List all users
node backend/reset-user-password.js        # Reset user password

# Testing & Debug
node backend/check-user-sessions.js        # Check user sessions
node backend/test-session-save-debug.js    # Test session save
node backend/check-data.js                 # Verify database data
```

## 🗂️ Folder Structure Quick View

```
Yoga_posture_detection_diet_ai/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Auth & validation
│   ├── Ml/              # Python ML service
│   └── Diet_Recommendation_System/  # Python diet service
│
├── frontend/
│   └── src/
│       ├── pages/       # Route components
│       ├── components/  # Reusable components
│       ├── hooks/       # Custom hooks
│       ├── services/    # API calls
│       └── context/     # State management
│
└── [Documentation files]
```

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://...
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001
VITE_ML_API_URL=http://localhost:5000
VITE_DIET_API_URL=http://localhost:5002
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `PROJECT_STRUCTURE.md` | Complete project organization |
| `ARCHITECTURE_DIAGRAM.md` | Visual system architecture |
| `README.md` | Main project documentation |
| `SECURITY_GUIDE.md` | Security best practices |
| `HOW_ADMIN_WORKS.md` | Admin system guide |
| `POSE_ID_FIX_COMPLETE.md` | Latest bug fix |

## 🐛 Common Issues & Fixes

### Issue: Diet plan locked after completing pose
**Fix**: Check `POSE_ID_FIX_COMPLETE.md`

### Issue: Session not saving
**Fix**: Run `node backend/check-user-sessions.js`

### Issue: ML service not responding
**Fix**: Check port 5000 is free, restart ML service

### Issue: Frontend can't connect to backend
**Fix**: Verify all servers running, check CORS settings

## 📊 Database Collections

| Collection | Purpose |
|------------|---------|
| `users` | User accounts |
| `posesessions` | Yoga session records |
| `userprogresses` | Progress tracking |
| `chatmessages` | Chat history |
| `schedules` | Workout schedules |
| `foods` | Food database |
| `loginlogs` | Security logs |

## 🎯 Key Features

1. **Pose Detection** - Real-time MediaPipe pose tracking
2. **Diet Recommendations** - ML-based personalized diet
3. **AI Chatbot** - Google Gemini integration
4. **Progress Tracking** - Detailed analytics
5. **Admin Dashboard** - User management
6. **Payment Integration** - eSewa payment gateway
7. **Community Features** - Leaderboard & rankings

## 🔄 Git Workflow

```bash
git add .                          # Stage changes
git commit -m "message"            # Commit
git push origin main               # Push to GitHub
```

**Note**: `.env` files are protected by pre-commit hook

---

**Quick Links**:
- Full Structure: `PROJECT_STRUCTURE.md`
- Architecture: `ARCHITECTURE_DIAGRAM.md`
- Latest Fix: `POSE_ID_FIX_COMPLETE.md`
