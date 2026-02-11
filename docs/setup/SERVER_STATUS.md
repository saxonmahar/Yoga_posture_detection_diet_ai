# 🚀 Yoga AI Project - All Servers Running

## ✅ Server Status (All Running)

### 1. Backend API Server
- **Status:** ✅ Running
- **Port:** 5001
- **URL:** http://localhost:5001
- **Process ID:** 4
- **Features:**
  - User authentication & authorization
  - Admin panel APIs
  - Chat with Gemini AI
  - Session management
  - Payment integration (eSewa)
  - Email services
- **Database:** ✅ Connected to MongoDB Atlas

### 2. Frontend (React + Vite)
- **Status:** ✅ Running
- **Port:** 3002
- **URL:** http://localhost:3002
- **Process ID:** 5
- **Features:**
  - User dashboard
  - Admin dashboard
  - Pose detection interface
  - Diet recommendations
  - AI chatbot
  - Payment pages

### 3. ML Service (Pose Detection)
- **Status:** ✅ Running
- **Port:** 5000
- **URL:** http://localhost:5000
- **Process ID:** 6
- **Features:**
  - MediaPipe pose detection
  - Real-time pose analysis
  - Accuracy scoring
  - Available poses endpoint
- **Health Check:** http://localhost:5000/health

### 4. Diet Recommendation Service
- **Status:** ✅ Running
- **Port:** 5002
- **URL:** http://localhost:5002
- **Process ID:** 7
- **Features:**
  - Personalized diet plans
  - Meal recommendations
  - Nutrition analysis
- **Debug Mode:** ON

### 5. Photo Upload Service
- **Status:** ✅ Running
- **Port:** 5010
- **URL:** http://localhost:5010
- **Process ID:** 8
- **Features:**
  - Profile photo uploads
  - Image storage
  - Photo management
- **Database:** ✅ Connected to MongoDB Atlas

---

## 🌐 Access URLs

### For Users:
- **Main App:** http://localhost:3002
- **Login:** http://localhost:3002/login
- **Register:** http://localhost:3002/register
- **Dashboard:** http://localhost:3002/dashboard
- **Pose Detection:** http://localhost:3002/pose-detection

### For Admin:
- **Admin Login:** http://localhost:3002/admin
- **Admin Dashboard:** http://localhost:3002/admin/dashboard
- **User Management:** http://localhost:3002/admin/users
- **Analytics:** http://localhost:3002/admin/analytics
- **Settings:** http://localhost:3002/admin/settings
- **Logs:** http://localhost:3002/admin/logs

### Admin Credentials:
- **Email:** sanjaymahar2058@gmail.com
- **Password:** 1234567890

---

## 📊 System Health

| Service | Status | Port | Response |
|---------|--------|------|----------|
| Backend API | ✅ Online | 5001 | Connected |
| Frontend | ✅ Online | 3002 | Ready |
| ML Service | ✅ Online | 5000 | MediaPipe Active |
| Diet Service | ✅ Online | 5002 | Debug Mode |
| Photo Service | ✅ Online | 5010 | Connected |
| MongoDB | ✅ Online | Cloud | Atlas Connected |

---

## 🔧 Managing Servers

### To Stop All Servers:
Use Kiro's process management or press `Ctrl+C` in each terminal

### To Restart a Server:
1. Stop the specific process
2. Navigate to the directory
3. Run the start command again

### Process IDs:
- Backend: Process 4
- Frontend: Process 5
- ML Service: Process 6
- Diet Service: Process 7
- Photo Service: Process 8

---

## 🎯 Quick Test Checklist

1. ✅ Open http://localhost:3002 - Homepage should load
2. ✅ Test chatbot on homepage (guest mode)
3. ✅ Register/Login as user
4. ✅ Complete a yoga session
5. ✅ Check diet recommendations
6. ✅ Login as admin at /admin
7. ✅ Verify session appears in admin dashboard

---

## 🐛 Troubleshooting

### If Frontend Won't Load:
- Check Process 5 is running
- Verify port 3002 is not in use
- Check browser console for errors

### If Sessions Don't Save:
- Verify Backend (Process 4) is running
- Check MongoDB connection
- Look for errors in backend logs

### If ML Detection Fails:
- Ensure Process 6 (ML Service) is running
- Check Python dependencies installed
- Verify MediaPipe is available

### If Admin Dashboard Shows 0:
- Complete at least one yoga session first
- Wait 30 seconds for auto-refresh
- Or manually refresh the page

---

**Last Updated:** February 10, 2026
**All Systems:** ✅ OPERATIONAL
**Ready for Testing:** YES
