# 🧘‍♀️ Yoga Posture Detection & Diet AI

An intelligent yoga practice platform with real-time pose detection, personalized diet recommendations, and progress analytics.

## ✨ Features

- **AI Pose Detection**: Real-time MediaPipe-powered pose analysis with 90%+ accuracy
- **6 Yoga Poses**: Warrior II, T Pose, Tree Pose, Goddess Pose, Downward Dog, Plank
- **Smart Diet Plans**: Personalized nutrition recommendations based on workout data
- **Progress Analytics**: User-specific tracking with streaks, accuracy, and achievements
- **Session Management**: Complete pose counting with BRAVO celebrations
- **Multi-User Support**: Individual progress tracking per user

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- MongoDB

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/saxonmahar/Yoga_posture_detection_diet_ai.git
cd Yoga_posture_detection_diet_ai
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Start all services**
```bash
# Frontend (React + Vite)
cd frontend && npm run dev

# Backend (Node.js + Express)
cd backend && npm run dev

# ML Service (Python + MediaPipe)
cd backend/Ml && python app.py

# Diet Service (Python + Flask)
cd backend/Diet_Recommendation_System && python app.py
```

## 🏗️ Architecture

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **ML Service**: Python + MediaPipe + OpenCV
- **Diet Service**: Python + Flask + Pandas

## 📊 Services

- **Frontend**: `http://localhost:3002`
- **Backend API**: `http://localhost:5001`
- **ML Service**: `http://localhost:5000`
- **Diet Service**: `http://localhost:5002`

## 🧘‍♀️ Usage

1. **Register/Login** to create your account
2. **Start Pose Detection** - Complete 3 perfect poses for BRAVO celebration
3. **Get Diet Plan** - Personalized nutrition based on your workout
4. **View Progress** - Track your yoga journey with real analytics

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📈 Progress Tracking

- **Real-time accuracy scoring** with MediaPipe landmarks
- **Streak tracking** for consecutive practice days
- **User-specific analytics** stored in MongoDB
- **Achievement system** with unlockable badges

## 🍎 Diet Integration

- **Post-workout nutrition** recommendations
- **Calorie-based meal planning** 
- **Personalized diet plans** based on practice intensity

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Sanjay Mahar** - Full Stack Development
- **Shashank Yadav** - ML & AI Integration
- **Anup Bhatt** - Backend Development
- **Ashish kumar karn** - Frontend Development
- **Bishist Pandey** - UI/UX Design
 