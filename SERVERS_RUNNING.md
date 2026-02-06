# 🚀 All Servers Running Successfully

## ✅ Active Servers

### 1. **Backend API Server** (Main)
- **Port:** `5001`
- **URL:** `http://localhost:5001`
- **Process ID:** 8
- **Status:** ✅ Running
- **Purpose:** Main backend API (authentication, yoga sessions, analytics, community)
- **Command:** `node index.js`
- **Location:** `backend/`

### 2. **Frontend Development Server**
- **Port:** `3002`
- **URL:** `http://localhost:3002`
- **Process ID:** 4
- **Status:** ✅ Running
- **Purpose:** React frontend with Vite
- **Command:** `npm run dev`
- **Location:** `frontend/`

### 3. **ML Service (Pose Detection)**
- **Port:** `5000`
- **URL:** `http://localhost:5000`
- **Process ID:** 3
- **Status:** ✅ Running
- **Purpose:** AI pose detection using MediaPipe
- **Command:** `python app.py`
- **Location:** `backend/Ml/`

### 4. **Photo Upload Server**
- **Port:** `5010`
- **URL:** `http://localhost:5010`
- **Process ID:** 5
- **Status:** ✅ Running
- **Purpose:** Profile photo uploads
- **Command:** `node photo-server.js`
- **Location:** `backend/`

### 5. **Diet Recommendation System**
- **Port:** `5002`
- **URL:** `http://localhost:5002`
- **Process ID:** 9
- **Status:** ✅ Running
- **Purpose:** AI-powered diet recommendations
- **Command:** `python app.py`
- **Location:** `backend/Diet_Recommendation_System/`

---

## 🌐 Access Points

### Main Application
- **Frontend:** http://localhost:3002
- **Login:** http://localhost:3002/login
- **Register:** http://localhost:3002/register
- **Dashboard:** http://localhost:3002/dashboard
- **Community:** http://localhost:3002/community
- **About:** http://localhost:3002/about

### API Endpoints
- **Backend API:** http://localhost:5001/api
- **ML Pose Detection:** http://localhost:5000/api/ml
- **Diet Recommendations:** http://localhost:5002/recommend
- **Photo Upload:** http://localhost:5010/api/photos

---

## 🔍 Health Checks

Test if all servers are responding:

```bash
# Backend API
curl http://localhost:5001/

# Frontend (open in browser)
http://localhost:3002

# ML Service
curl http://localhost:5000/health

# Photo Server
curl http://localhost:5010/photo-test

# Diet System
curl http://localhost:5002/health
```

---

## 🛑 Stop All Servers

To stop all servers, use the process IDs:

```bash
# Stop Backend API
Process ID: 8

# Stop Frontend
Process ID: 4

# Stop ML Service
Process ID: 3

# Stop Photo Server
Process ID: 5

# Stop Diet System
Process ID: 9
```

Or use the Kiro IDE to stop processes from the process list.

---

## 🔄 Restart Servers

If you need to restart any server:

1. Stop the process using its ID
2. Run the command again from the correct directory

### Quick Restart Commands:

```bash
# Backend API
cd backend
node index.js

# Frontend
cd frontend
npm run dev

# ML Service
cd backend/Ml
python app.py

# Photo Server
cd backend
node photo-server.js

# Diet System
cd backend/Diet_Recommendation_System
python app.py
```

---

## 📊 Server Dependencies

```
Frontend (3002)
    ↓
Backend API (5001)
    ↓
├── ML Service (5000)
├── Photo Server (5010)
└── Diet System (5002)
```

---

**Status:** ✅ ALL SYSTEMS OPERATIONAL
**Date:** February 6, 2026
**Total Servers:** 5
