# 🏗️ System Architecture Diagram

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                    http://localhost:3002                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                        │  │
│  │  • Pages (Dashboard, Diet, Pose Detection, etc.)         │  │
│  │  • Components (PoseCamera, ChatWidget, etc.)             │  │
│  │  • Services (API calls, TTS, etc.)                       │  │
│  │  • Context (Auth, State Management)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES LAYER                        │
│                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │  Node.js API   │  │   ML Service   │  │  Diet Service  │   │
│  │   Port 5001    │  │   Port 5000    │  │   Port 5002    │   │
│  │                │  │                │  │                │   │
│  │  • Auth        │  │  • MediaPipe   │  │  • ML Diet     │   │
│  │  • Analytics   │  │  • Pose        │  │  • Nepali      │   │
│  │  • Chat        │  │    Detection   │  │    Foods       │   │
│  │  • Community   │  │  • Landmarks   │  │  • Post-Yoga   │   │
│  │  • Payment     │  │  • Accuracy    │  │    Meals       │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│          │                    │                    │             │
│          │                    │                    │             │
│  ┌────────────────┐          │                    │             │
│  │  Photo Server  │          │                    │             │
│  │   Port 5010    │          │                    │             │
│  │                │          │                    │             │
│  │  • Uploads     │          │                    │             │
│  │  • Profiles    │          │                    │             │
│  └────────────────┘          │                    │             │
└─────────────────────────────────────────────────────────────────┘
                    │           │                    │
                    │           │                    │
                    ▼           ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    MongoDB Database                         │ │
│  │                                                              │ │
│  │  Collections:                                               │ │
│  │  • users              - User accounts                       │ │
│  │  • posesessions       - Yoga session records               │ │
│  │  • userprogresses     - Progress tracking                  │ │
│  │  • chatmessages       - Chat history                       │ │
│  │  • schedules          - Workout schedules                  │ │
│  │  • foods              - Food database                      │ │
│  │  • loginlogs          - Security logs                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    File System                              │ │
│  │                                                              │ │
│  │  • backend/uploads/profiles/  - Profile pictures           │ │
│  │  • backend/Ml/Video/          - Training data              │ │
│  │  • backend/data/              - Static data files          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow Diagrams

### 1. User Login Flow
```
User (Browser)
    │
    │ 1. Enter credentials
    ▼
Login.jsx
    │
    │ 2. POST /api/auth/login
    ▼
Backend API (5001)
    │
    │ 3. Validate credentials
    ▼
MongoDB (users collection)
    │
    │ 4. User found
    ▼
JWT Token Generated
    │
    │ 5. Return token + user data
    ▼
AuthContext (Frontend)
    │
    │ 6. Store in state + localStorage
    ▼
Dashboard.jsx (Redirect)
```

### 2. Pose Detection Flow
```
User (Webcam)
    │
    │ 1. Video stream
    ▼
PoseCamera.jsx
    │
    │ 2. Capture frame (50ms interval)
    ▼
Base64 Image
    │
    │ 3. POST /api/ml/detect-pose
    │    { image, pose_type, user_name }
    ▼
ML Service (5000)
    │
    │ 4. Process with MediaPipe
    ▼
pose_landmarker.task (Model)
    │
    │ 5. Extract 33 landmarks
    ▼
Accuracy Calculation
    │
    │ 6. Return { landmarks, accuracy, feedback }
    ▼
PoseCamera.jsx
    │
    │ 7. Draw landmarks on canvas
    │ 8. Show accuracy score
    │ 9. Give TTS feedback
    ▼
User sees real-time feedback
    │
    │ 10. After 3 perfect poses
    ▼
POST /api/analytics/session
    │
    │ 11. Save to database
    ▼
MongoDB (posesessions + userprogresses)
```

### 3. Diet Recommendation Flow
```
User clicks "Diet Plan"
    │
    │ 1. Navigate to /diet-plan
    ▼
DietPlanPage.jsx
    │
    │ 2. Check session requirement
    │    GET /api/analytics/user/:userId
    ▼
Backend API (5001)
    │
    │ 3. Query UserProgress
    ▼
MongoDB (userprogresses)
    │
    │ 4. total_sessions > 0?
    ▼
If YES:
    │
    │ 5. POST /recommend-post-yoga
    │    { calories, duration, poses }
    ▼
Diet Service (5002)
    │
    │ 6. ML algorithm
    │ 7. Query CSV datasets
    ▼
Nepali Food CSVs
    │
    │ 8. Return meal + nutrition + image
    ▼
PostYogaMealCard.jsx
    │
    │ 9. Display meal recommendation
    ▼
User sees personalized meal

If NO:
    │
    │ Show "Complete a session first" screen
    ▼
User redirected to pose detection
```

### 4. Chat with AI Flow
```
User types message
    │
    │ 1. Enter text
    ▼
ChatWidget.jsx
    │
    │ 2. POST /api/chat/message
    │    { message, userId }
    ▼
Backend API (5001)
    │
    │ 3. Forward to Gemini
    ▼
geminiService.js
    │
    │ 4. Call Google Gemini API
    ▼
Google Gemini AI
    │
    │ 5. Generate response
    ▼
Backend API
    │
    │ 6. Save to MongoDB
    ▼
MongoDB (chatmessages)
    │
    │ 7. Return AI response
    ▼
ChatWidget.jsx
    │
    │ 8. Display message
    ▼
User sees AI response
```

## 🗂️ Component Hierarchy

### Frontend Component Tree
```
App.jsx
├── Router
│   ├── Public Routes
│   │   ├── HomePage
│   │   ├── Login
│   │   ├── Register
│   │   ├── AboutPage
│   │   ├── FeaturesPage
│   │   └── PricingPage
│   │
│   ├── Protected Routes (Auth Required)
│   │   ├── Dashboard
│   │   │   ├── StatCard (x4)
│   │   │   ├── ProgressChart
│   │   │   ├── QuickActionCard (x6)
│   │   │   └── RecentActivity
│   │   │
│   │   ├── PoseDetectionPage
│   │   │   ├── ProfessionalPoseSelector
│   │   │   └── PoseCamera
│   │   │       ├── Webcam
│   │   │       ├── Canvas (landmarks)
│   │   │       └── PostYogaMealCard
│   │   │
│   │   ├── DietPlanPage
│   │   │   ├── DietRecommendations
│   │   │   ├── MacroCard (x3)
│   │   │   └── MealCard (x3)
│   │   │
│   │   ├── ProgressPage
│   │   │   ├── ProgressDashboard
│   │   │   ├── ChartCard (x3)
│   │   │   └── AchievementCard (xN)
│   │   │
│   │   ├── ProfilePage
│   │   │   └── PhotoUpload
│   │   │
│   │   ├── SchedulePage
│   │   │   ├── Calendar
│   │   │   └── SessionModal
│   │   │
│   │   └── LeaderboardPage
│   │       └── YogaLeaderboard
│   │
│   └── Admin Routes (Admin Auth Required)
│       ├── AdminLogin
│       ├── AdminDashboard
│       ├── AdminUsers
│       ├── AdminAnalytics
│       ├── AdminLogs
│       └── AdminSettings
│
├── Layout Components (Global)
│   ├── Header
│   ├── Footer
│   └── ChatWidget / GuestChatWidget
│
└── Context Providers
    └── AuthContext
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
│                                                               │
│  Layer 1: Frontend Protection                                │
│  ├── Route Guards (ProtectedRoute component)                │
│  ├── Auth Context (JWT token validation)                    │
│  └── Local Storage (encrypted tokens)                       │
│                                                               │
│  Layer 2: API Authentication                                 │
│  ├── JWT Middleware (authMiddleware.js)                     │
│  ├── Admin Middleware (adminMiddleware.js)                  │
│  └── Token Verification                                      │
│                                                               │
│  Layer 3: Database Security                                  │
│  ├── Password Hashing (bcrypt)                              │
│  ├── Input Validation (Mongoose schemas)                    │
│  └── SQL Injection Prevention                               │
│                                                               │
│  Layer 4: Environment Protection                             │
│  ├── .env files (git ignored)                               │
│  ├── Pre-commit hooks (prevent .env commits)                │
│  └── API key encryption                                      │
│                                                               │
│  Layer 5: Rate Limiting & Logging                           │
│  ├── Login attempt tracking (loginLog model)                │
│  ├── Security logs (loginSecurity model)                    │
│  └── Failed attempt monitoring                              │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Deployment Architecture

```
Production Environment (Suggested)

┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Vercel/Netlify)                 │
│                    https://your-app.com                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (Heroku/Railway)              │
│                    https://api.your-app.com                  │
│                                                               │
│  ├── Node.js API (Main)                                     │
│  ├── Photo Service                                           │
│  ├── ML Service (Python)                                    │
│  └── Diet Service (Python)                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ MongoDB Atlas
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas (Cloud)                     │
│                    Managed Database                          │
└─────────────────────────────────────────────────────────────┘
```

---

**Created**: February 10, 2026  
**Purpose**: Visual reference for system architecture  
**Maintained By**: Development Team
