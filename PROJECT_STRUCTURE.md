# 🗂️ Project Structure & Organization Guide

> **Complete reference for all paths, routes, and file locations**  
> Last Updated: February 10, 2026

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Root Directory Structure](#root-directory-structure)
3. [Backend Structure](#backend-structure)
4. [Frontend Structure](#frontend-structure)
5. [API Routes Reference](#api-routes-reference)
6. [File Path Reference](#file-path-reference)
7. [Documentation Index](#documentation-index)

---

## 🎯 Project Overview

**Project Name**: Yoga Posture Detection & Diet AI  
**Type**: Full-stack MERN + Python ML Application  
**Architecture**: Microservices (4 servers)

### Server Ports
- **Frontend**: `http://localhost:3002` (React + Vite)
- **Backend API**: `http://localhost:5001` (Node.js + Express)
- **ML Service**: `http://localhost:5000` (Python + MediaPipe)
- **Diet Service**: `http://localhost:5002` (Python + Flask)
- **Photo Service**: `http://localhost:5010` (Node.js + Express)

---

## 📁 Root Directory Structure

```
Yoga_posture_detection_diet_ai/
├── 📂 backend/              # Node.js backend server
├── 📂 frontend/             # React frontend application
├── 📂 node_modules/         # Root dependencies (if any)
├── 📄 package.json          # Root package config
├── 📄 README.md             # Main project documentation
├── 📄 .gitignore            # Git ignore rules
├── 🚀 start-servers.bat     # Windows batch script to start all servers
└── 📚 [30+ .md files]       # Documentation (see Documentation Index)
```

### Root Documentation Files (30+)
All documentation files are currently in the root directory.
See [Documentation Index](#documentation-index) for complete list.

---

## 🔧 Backend Structure

```
backend/
├── 📂 controllers/          # Request handlers (business logic)
│   ├── adminController.js
│   ├── analyticsController.js
│   ├── authController.js
│   ├── chatController.js
│   ├── communityController.js
│   ├── dietController.js
│   ├── emailVerificationController.js
│   ├── forgotPasswordController.js
│   ├── loginController.js
│   ├── paymentController.js
│   ├── photoController.js
│   ├── poseController.js
│   ├── rankingController.js
│   ├── registerController.js
│   ├── scheduleController.js
│   ├── secureLoginController.js
│   └── securityController.js
│
├── 📂 models/               # MongoDB schemas
│   ├── chatMessage.js       # Chat history
│   ├── food.js              # Food items
│   ├── loginLog.js          # Login tracking
│   ├── loginSecurity.js     # Security settings
│   ├── posesession.js       # Yoga session records
│   ├── progress.js          # User progress
│   ├── schedule.js          # Workout schedules
│   ├── user.js              # User accounts
│   ├── userProgress.js      # Detailed progress tracking
│   └── yogaSession.js       # Legacy session model
│
├── 📂 routes/               # API endpoint definitions
│   ├── adminRoutes.js       # /api/admin/*
│   ├── analyticsRoutes.js   # /api/analytics/*
│   ├── authRoutes.js        # /api/auth/*
│   ├── chatRoutes.js        # /api/chat/*
│   ├── communityRoutes.js   # /api/community/*
│   ├── dietRoutes.js        # /api/diet/*
│   ├── paymentRoutes.js     # /api/payment/*
│   ├── photoRoutes.js       # /api/photos/*
│   ├── poseRoutes.js        # /api/pose/*
│   ├── rankingRoutes.js     # /api/ranking/*
│   └── scheduleRoutes.js    # /api/schedule/*
│
├── 📂 services/             # Business logic & external APIs
│   ├── analyticsService.js  # Analytics calculations
│   ├── dietService.js       # Diet recommendations
│   ├── emailService.js      # Email sending
│   ├── emailValidationService.js
│   ├── geminiService.js     # Google Gemini AI chatbot
│   ├── poseService.js       # Pose detection logic
│   └── yogaDietService.js   # Yoga-specific diet
│
├── 📂 middleware/           # Express middleware
│   ├── adminMiddleware.js   # Admin authentication
│   ├── authMiddleware.js    # User authentication
│   ├── loginMiddleware.js   # Login validation
│   └── registerMiddleware.js
│
├── 📂 DbConfig/             # Database configuration
│   └── db.config.js         # MongoDB connection
│
├── 📂 utils/                # Utility functions
│   └── emailConfigValidator.js
│
├── 📂 data/                 # Static data files
│   └── nepali-foods.json    # Nepali food database
│
├── 📂 uploads/              # User uploaded files
│   └── profiles/            # Profile pictures
│
├── 📂 Ml/                   # Python ML service (MediaPipe)
│   ├── app.py               # Flask server (port 5000)
│   ├── main1.py - main6.py  # Pose detection scripts
│   ├── pose_utils.py        # Utility functions
│   ├── professional_pose_detector.py
│   ├── pose_landmarker.task # MediaPipe model
│   ├── requirements.txt     # Python dependencies
│   └── Video/               # Training & test images
│       ├── TRAIN/           # Training dataset
│       └── TEST/            # Test dataset
│
├── 📂 Diet_Recommendation_System/  # Python diet service
│   ├── app.py               # Flask server (port 5002)
│   ├── Data_sets/           # Diet datasets
│   │   ├── breakfast_data.csv
│   │   ├── lunch_data.csv
│   │   ├── dinner_data.csv
│   │   ├── nepali_breakfast.csv
│   │   ├── nepali_lunch.csv
│   │   └── nepali_dinner.csv
│   ├── Diet_Recommendation_System.ipynb
│   ├── requirements.txt
│   └── test-post-yoga.js    # API test script
│
├── 📄 Utility Scripts (in root)
│   ├── change-admin.js      # Change admin credentials
│   ├── check-data.js        # Verify database data
│   ├── check-user-sessions.js  # Check user sessions
│   ├── list-users.js        # List all users
│   ├── make-admin.js        # Make user admin
│   ├── reset-user-password.js
│   ├── set-admin-password.js
│   ├── setup-your-admin.js  # Initial admin setup
│   ├── test-community-stats.js
│   ├── test-session-save-debug.js
│   └── test-session-save.js
│
├── 📄 index.js              # Main server entry point
├── 📄 photo-server.js       # Photo upload server (port 5010)
├── 📄 package.json          # Dependencies
├── 📄 .env                  # Environment variables (NOT in git)
└── 📄 .env.example          # Environment template
```

## ⚛️ Frontend Structure

```
frontend/
├── 📂 src/
│   ├── 📂 pages/            # Route components
│   │   ├── HomePage.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DietPlanPage.jsx
│   │   ├── PoseDetectionPage.jsx
│   │   ├── ProgressPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SchedulePage.jsx
│   │   ├── LeaderboardPage.jsx
│   │   ├── CommunityPage.jsx
│   │   ├── Premium.jsx
│   │   ├── PremiumDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── AdminAnalytics.jsx
│   │   ├── AdminLogs.jsx
│   │   ├── AdminSettings.jsx
│   │   ├── AboutPage.jsx
│   │   ├── FeaturesPage.jsx
│   │   ├── PricingPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── [more pages...]
│   │
│   ├── 📂 components/       # Reusable components
│   │   ├── 📂 common/
│   │   │   ├── Button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── PhotoUpload.jsx
│   │   │   └── PoseDetection.jsx
│   │   ├── 📂 layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── 📂 pose-detection/
│   │   │   ├── PoseCamera.jsx          # Main pose detection
│   │   │   ├── PoseFeedback.jsx
│   │   │   ├── PoseInstructions.jsx
│   │   │   ├── PrePoseInstructions.jsx
│   │   │   └── ProfessionalPoseSelector.jsx
│   │   ├── 📂 diet-plan/
│   │   │   ├── DietRecommendations.jsx
│   │   │   ├── MacroCard.jsx
│   │   │   ├── MealCard.jsx
│   │   │   └── PostYogaMealCard.jsx    # Post-workout meal
│   │   ├── 📂 dashboard/
│   │   │   ├── StatCard.jsx
│   │   │   ├── ProgressChart.jsx
│   │   │   ├── QuickActionCard.jsx
│   │   │   ├── RankingWidget.jsx
│   │   │   └── RecentActivity.jsx
│   │   ├── 📂 analytics/
│   │   │   └── ProgressDashboard.jsx
│   │   ├── 📂 chat/
│   │   │   ├── ChatWidget.jsx          # Logged-in chat
│   │   │   └── GuestChatWidget.jsx     # Guest chat
│   │   ├── 📂 progress/
│   │   │   ├── AchievementCard.jsx
│   │   │   └── ChartCard.jsx
│   │   ├── 📂 ranking/
│   │   │   └── YogaLeaderboard.jsx
│   │   └── 📂 schedule/
│   │       ├── Calendar.jsx
│   │       └── SessionModal.jsx
│   │
│   ├── 📂 hooks/            # Custom React hooks
│   │   ├── index.jsx
│   │   ├── useDiet.js
│   │   ├── useDietplan.js
│   │   ├── useNutrition.js
│   │   ├── usePoseDetection.js
│   │   ├── useProgress.js
│   │   ├── useUserProfile.js
│   │   ├── useWebcam.js
│   │   ├── useWorkoutSchedule.js
│   │   ├── useYoga.js
│   │   └── useYogaSession.js
│   │
│   ├── 📂 context/          # React Context providers
│   │   └── AuthContext.jsx  # Authentication state
│   │
│   ├── 📂 services/         # API service layer
│   │   ├── 📂 api/
│   │   │   ├── client.js    # Axios instance
│   │   │   ├── interceptors.js
│   │   │   ├── auth.js
│   │   │   ├── diet.js
│   │   │   ├── schedule.js
│   │   │   ├── user.js
│   │   │   ├── yoga.js
│   │   │   └── index.js
│   │   ├── 📂 auth/
│   │   │   ├── auth.service.js
│   │   │   └── client.js
│   │   ├── 📂 diet/
│   │   │   ├── diet.service.js
│   │   │   ├── meal.service.js
│   │   │   └── mockdata.js
│   │   ├── 📂 yoga/
│   │   │   ├── pose.service.js
│   │   │   └── yoga.service.js
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── communityService.js
│   │   ├── photoService.js
│   │   ├── progressService.js
│   │   ├── rankingService.js
│   │   ├── ttsService.js    # Text-to-speech
│   │   └── index.js
│   │
│   ├── 📂 config/           # Configuration files
│   │   ├── api.config.js    # API endpoints
│   │   ├── app.config.js    # App settings
│   │   └── theme.config.js  # Theme settings
│   │
│   ├── 📂 constants/        # Constants & enums
│   │   ├── diet.constants.js
│   │   └── yoga.constants.js
│   │
│   ├── 📂 utils/            # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── poseData.js
│   │
│   ├── 📂 styles/           # Global styles
│   │   ├── globals.css
│   │   ├── animations.css
│   │   └── premium-design.css
│   │
│   ├── 📂 animations/       # Framer Motion configs
│   │   ├── framer-config.jsx
│   │   ├── page-transitions.jsx
│   │   ├── pose-animations.jsx
│   │   └── yoga-poses.jsx
│   │
│   ├── 📂 router/           # React Router setup
│   │   └── Router.jsx
│   │
│   ├── 📂 types/            # TypeScript types
│   │   └── index.ts
│   │
│   ├── 📄 App.jsx           # Main App component
│   ├── 📄 main.jsx          # Entry point
│   ├── 📄 App.css
│   └── 📄 index.css
│
├── 📂 public/               # Static assets
│   ├── 📂 images/
│   │   ├── 📂 poses/        # Pose reference images
│   │   └── 📂 team/         # Team photos
│   ├── index.html
│   └── test-ml-api.html
│
├── 📂 dist/                 # Build output (generated)
├── 📄 package.json
├── 📄 vite.config.js        # Vite configuration
├── 📄 tailwind.config.js    # Tailwind CSS config
├── 📄 postcss.config.js
├── 📄 eslint.config.js
├── 📄 .env                  # Environment variables
└── 📄 .env.example          # Environment template
```

## 🛣️ API Routes Reference

### Backend API (Port 5001)

#### Authentication Routes (`/api/auth`)
```javascript
POST   /api/auth/register              // Register new user
POST   /api/auth/login                 // User login
POST   /api/auth/logout                // User logout
POST   /api/auth/verify-email          // Verify email
POST   /api/auth/forgot-password       // Request password reset
POST   /api/auth/reset-password        // Reset password
GET    /api/auth/me                    // Get current user
```

#### Admin Routes (`/api/admin`)
```javascript
POST   /api/admin/login                // Admin login
GET    /api/admin/users                // Get all users
GET    /api/admin/users/:id            // Get user by ID
PUT    /api/admin/users/:id            // Update user
DELETE /api/admin/users/:id            // Delete user
GET    /api/admin/analytics            // System analytics
GET    /api/admin/logs                 // System logs
PUT    /api/admin/settings             // Update settings
```

#### Analytics Routes (`/api/analytics`)
```javascript
POST   /api/analytics/session          // Record yoga session
GET    /api/analytics/user/:userId     // Get user analytics
GET    /api/analytics/progress/:userId // Get progress data
```

#### Diet Routes (`/api/diet`)
```javascript
POST   /api/diet/recommend             // Get diet recommendations
POST   /api/diet/post-yoga             // Post-yoga meal suggestions
GET    /api/diet/meals                 // Get meal database
GET    /api/diet/nutrition/:foodId     // Get nutrition info
```

#### Pose Routes (`/api/pose`)
```javascript
POST   /api/pose/detect                // Detect pose from image
GET    /api/pose/available             // Get available poses
GET    /api/pose/:poseId               // Get pose details
```

#### Chat Routes (`/api/chat`)
```javascript
POST   /api/chat/message               // Send chat message
GET    /api/chat/history/:userId       // Get chat history
POST   /api/chat/guest                 // Guest chat (no auth)
```

#### Community Routes (`/api/community`)
```javascript
GET    /api/community/stats            // Community statistics
GET    /api/community/leaderboard      // Top users
POST   /api/community/post             // Create post
GET    /api/community/posts            // Get posts
```

#### Ranking Routes (`/api/ranking`)
```javascript
GET    /api/ranking/global             // Global leaderboard
GET    /api/ranking/weekly             // Weekly rankings
GET    /api/ranking/user/:userId       // User rank
```

#### Schedule Routes (`/api/schedule`)
```javascript
GET    /api/schedule/:userId           // Get user schedule
POST   /api/schedule                   // Create schedule
PUT    /api/schedule/:id               // Update schedule
DELETE /api/schedule/:id               // Delete schedule
```

#### Photo Routes (`/api/photos`)
```javascript
POST   /api/photos/upload              // Upload profile photo
GET    /api/photos/:userId             // Get user photos
DELETE /api/photos/:photoId            // Delete photo
```

#### Payment Routes (`/api/payment`)
```javascript
POST   /api/payment/esewa/initiate     // Start eSewa payment
POST   /api/payment/esewa/verify       // Verify payment
GET    /api/payment/history/:userId    // Payment history
```

### ML Service API (Port 5000)

```python
POST   /api/ml/detect-pose             # Detect pose from image
       Body: { image: base64, pose_type: string, user_name: string }
       Returns: { success, landmarks, accuracy_score, feedback, corrections }
```

### Diet Service API (Port 5002)

```python
POST   /recommend                      # General diet recommendation
       Body: { age, weight, height, gender, activity_level }
       
POST   /recommend-post-yoga            # Post-yoga meal recommendation
       Body: { calories_burned, duration, poses, time_of_day }
       Returns: { meal, nutrition, image_url }
```

### Photo Service (Port 5010)

```javascript
POST   /upload                         // Upload photo
GET    /photos/:filename               // Get photo
DELETE /photos/:filename               // Delete photo
```

---

## 📂 File Path Reference

### Important File Paths

#### Configuration Files
```
backend/.env                           # Backend environment variables
backend/.env.example                   # Backend env template
frontend/.env                          # Frontend environment variables
frontend/.env.example                  # Frontend env template
backend/DbConfig/db.config.js          # MongoDB connection
frontend/src/config/api.config.js      # API endpoints
```

#### Entry Points
```
backend/index.js                       # Backend server (port 5001)
backend/photo-server.js                # Photo server (port 5010)
backend/Ml/app.py                      # ML service (port 5000)
backend/Diet_Recommendation_System/app.py  # Diet service (port 5002)
frontend/src/main.jsx                  # Frontend entry
```

#### Key Components
```
frontend/src/components/pose-detection/PoseCamera.jsx     # Main pose detection
frontend/src/components/diet-plan/PostYogaMealCard.jsx    # Post-yoga meals
frontend/src/components/chat/ChatWidget.jsx               # AI chatbot
frontend/src/pages/Dashboard.jsx                          # User dashboard
frontend/src/pages/DietPlanPage.jsx                       # Diet plan page
```

#### Models & Schemas
```
backend/models/user.js                 # User schema
backend/models/posesession.js          # Session records
backend/models/userProgress.js         # Progress tracking
backend/models/chatMessage.js          # Chat history
```

#### Services
```
backend/services/geminiService.js      # Google Gemini AI
backend/services/analyticsService.js   # Analytics calculations
backend/services/yogaDietService.js    # Yoga-specific diet
frontend/src/services/ttsService.js    # Text-to-speech
```

#### Data Files
```
backend/data/nepali-foods.json                                    # Nepali foods
backend/Diet_Recommendation_System/Data_sets/nepali_breakfast.csv # Breakfast
backend/Diet_Recommendation_System/Data_sets/nepali_lunch.csv     # Lunch
backend/Diet_Recommendation_System/Data_sets/nepali_dinner.csv    # Dinner
```

#### ML Models & Training Data
```
backend/Ml/pose_landmarker.task                    # MediaPipe model
backend/Ml/Video/TRAIN/                            # Training images
backend/Ml/Video/TEST/                             # Test images
```

---

## 📚 Documentation Index

### Setup & Configuration
- `README.md` - Main project documentation
- `SECURITY_GUIDE.md` - Security best practices
- `EMAIL_PROVIDERS_GUIDE.md` - Email setup guide
- `ESEWA_SETUP.md` - Payment integration
- `SERVER_STATUS.md` - Server status & ports

### Feature Documentation
- `HOW_ADMIN_WORKS.md` - Admin system guide
- `GEMINI_CHATBOT_SETUP.md` - AI chatbot setup
- `CHATBOT_QUICK_START.md` - Quick chatbot guide
- `CHATBOT_FINAL_SETUP.md` - Complete chatbot setup
- `CHATBOT_IMPLEMENTATION_SUMMARY.md` - Chatbot overview

### Diet System
- `DIET_INTEGRATION_COMPLETE.md` - Diet system overview
- `DIET_ENHANCEMENT_PLAN.md` - Future enhancements
- `QUICK_START_DIET_INTEGRATION.md` - Quick start
- `POST_YOGA_MEAL_INTEGRATION.md` - Post-workout meals
- `FOOD_IMAGES_SETUP.md` - Food image setup
- `DIET_PAGE_PROTECTION.md` - Access control
- `DIET_PROTECTION_FIX_COMPLETE.md` - Protection fixes
- `DIET_PAGE_HOOKS_FIX.md` - React Hooks fixes
- `TEST_DIET_PROTECTION.md` - Testing guide

### Bug Fixes & Improvements
- `POSE_ID_FIX_COMPLETE.md` - Pose ID validation fix
- `SESSION_SAVE_FIX.md` - Session save fixes
- `POSE_SWITCHING_FIX.md` - Pose switching fix
- `NUCLEAR_FIX_POSE_SWITCHING.md` - Complete pose fix
- `PROGRESS_DISPLAY_FIX.md` - Progress display fix
- `SCORE_DISPLAY_DEBUG.md` - Score display debug
- `UI_CLARITY_FIX.md` - UI improvements
- `UI_FIXES_SUMMARY.md` - All UI fixes
- `PERFORMANCE_OPTIMIZATION.md` - Performance tips
- `ADMIN_DASHBOARD_FIX.md` - Admin fixes
- `COMMUNITY_STATS_UPDATE.md` - Community stats

### System Architecture
- `SYSTEM_INTEGRATION_PLAN.md` - Integration overview
- `INTEGRATION_SUMMARY.md` - System integration
- `CURRENT_STATUS.md` - Current project status

---

## 🔄 Data Flow

### User Authentication Flow
```
1. User → Frontend (Login.jsx)
2. Frontend → Backend API (/api/auth/login)
3. Backend → MongoDB (User model)
4. Backend → JWT Token
5. Token → Frontend (AuthContext)
6. Protected Routes → Authenticated
```

### Pose Detection Flow
```
1. User → PoseCamera.jsx (webcam)
2. Webcam → Capture frame
3. Frame → ML Service (port 5000)
4. ML Service → MediaPipe model
5. MediaPipe → Landmarks + accuracy
6. Landmarks → PoseCamera (draw on canvas)
7. Session data → Backend API (/api/analytics/session)
8. Backend → MongoDB (PoseSession + UserProgress)
```

### Diet Recommendation Flow
```
1. User → DietPlanPage.jsx
2. Check session → Backend API (/api/analytics/user/:id)
3. If sessions > 0 → Show diet plan
4. User data → Diet Service (port 5002)
5. Diet Service → ML algorithm
6. Recommendations → Frontend
7. Display → DietRecommendations.jsx
```

### Post-Yoga Meal Flow
```
1. Complete pose → PoseCamera.jsx
2. Session data → Prepare meal request
3. Request → Diet Service (/recommend-post-yoga)
4. Diet Service → Analyze workout
5. Meal suggestion → PostYogaMealCard.jsx
6. Display → User sees meal
```

---

## 🚀 Quick Start Commands

### Start All Servers
```bash
# Windows
start-servers.bat

# Manual start
cd backend && npm start                    # Port 5001
cd backend && node photo-server.js         # Port 5010
cd backend/Ml && python app.py             # Port 5000
cd backend/Diet_Recommendation_System && python app.py  # Port 5002
cd frontend && npm run dev                 # Port 3002
```

### Utility Scripts
```bash
# Admin management
node backend/setup-your-admin.js           # Create admin
node backend/change-admin.js               # Change admin
node backend/make-admin.js                 # Make user admin

# User management
node backend/list-users.js                 # List all users
node backend/reset-user-password.js        # Reset password

# Testing & debugging
node backend/check-user-sessions.js        # Check sessions
node backend/test-session-save-debug.js    # Test session save
node backend/check-data.js                 # Verify data
```

---

## 📝 Notes

### Important Paths to Remember
- **Backend API Base**: `http://localhost:5001/api`
- **ML Service**: `http://localhost:5000/api/ml`
- **Diet Service**: `http://localhost:5002`
- **Frontend**: `http://localhost:3002`

### Environment Variables Required
```env
# Backend (.env)
MONGO_URI=mongodb://...
JWT_SECRET=...
GEMINI_API_KEY=...
EMAIL_USER=...
EMAIL_PASS=...

# Frontend (.env)
VITE_API_URL=http://localhost:5001
VITE_ML_API_URL=http://localhost:5000
VITE_DIET_API_URL=http://localhost:5002
```

### Git Ignore Rules
- `backend/.env` - Protected by pre-commit hook
- `frontend/.env` - Protected by pre-commit hook
- `node_modules/` - Dependencies
- `dist/` - Build output
- `uploads/` - User uploads

---

**Last Updated**: February 10, 2026  
**Maintained By**: Development Team  
**Version**: 1.0.0
