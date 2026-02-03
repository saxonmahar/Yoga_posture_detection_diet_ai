# 🧘‍♀️ YogaAI - Intelligent Yoga Practice Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://mongodb.com/)

> **A comprehensive AI-powered yoga platform combining real-time pose detection, personalized nutrition, and community engagement for holistic wellness.**

## 🌟 Overview

YogaAI is an advanced wellness platform that leverages cutting-edge computer vision and machine learning to provide real-time yoga pose analysis, personalized diet recommendations, and comprehensive progress tracking. Built with modern web technologies and powered by MediaPipe, it offers an immersive and intelligent yoga practice experience.

## ✨ Key Features

### 🎯 AI-Powered Pose Detection
- **Real-time Analysis**: MediaPipe-powered pose detection with 90%+ accuracy
- **6 Yoga Poses**: Warrior II, T Pose, Tree Pose, Goddess Pose, Downward Dog, Plank
- **Live Feedback**: Instant pose correction and accuracy scoring
- **Professional Validation**: Angle-based pose analysis with landmark detection

### 🍎 Intelligent Nutrition System
- **Personalized Diet Plans**: AI-generated meal recommendations based on workout intensity
- **Calorie Optimization**: Smart calorie distribution across breakfast, lunch, and dinner
- **Post-Workout Nutrition**: Targeted meal suggestions for recovery and energy
- **Dietary Preferences**: Customizable plans for various dietary requirements

### 📊 Advanced Analytics & Progress Tracking
- **Real-time Metrics**: Session accuracy, pose count, and performance analytics
- **Streak Tracking**: Daily practice streaks with motivational milestones
- **Progress Visualization**: Interactive charts and graphs showing improvement over time
- **Achievement System**: Unlockable badges and rewards for consistent practice

### 🌐 Community & Social Features
- **User Profiles**: Comprehensive profiles with stats, achievements, and social links
- **Community Feed**: Share progress, achievements, and connect with fellow practitioners
- **Challenges**: Join group challenges with progress tracking and rewards
- **Leaderboards**: Global rankings with crown/medal recognition system
- **Friends System**: Connect with other users, track online status, and share achievements

### 🎨 Premium User Experience
- **Modern UI/UX**: Glassmorphism design with smooth animations and transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Eye-friendly dark interface with gradient accents
- **Interactive Elements**: Hover effects, loading states, and micro-interactions

## 🏗️ System Architecture

### Frontend Stack
- **React 18** - Modern component-based UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Advanced animations and transitions
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful icon library

### Backend Stack
- **Node.js & Express** - RESTful API server
- **MongoDB & Mongoose** - NoSQL database with ODM
- **JWT Authentication** - Secure user authentication
- **bcryptjs** - Password hashing and security
- **Nodemailer** - Email service integration
- **Cookie Parser** - Session management
- **CORS** - Cross-origin resource sharing

### AI/ML Services
- **Python Flask** - ML service API endpoints
- **MediaPipe** - Google's pose detection framework
- **OpenCV** - Computer vision and image processing
- **NumPy** - Numerical computing for pose analysis
- **Pandas** - Data manipulation for diet recommendations

### Database Schema
- **Users**: Authentication, profiles, preferences
- **Yoga Sessions**: Practice history, pose accuracy, timestamps
- **Progress**: Streaks, achievements, analytics data
- **Diet Plans**: Personalized nutrition recommendations
- **Community**: Posts, friendships, challenges, leaderboards

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 18.0.0
Python >= 3.8
MongoDB >= 4.4
npm >= 8.0.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/saxonmahar/Yoga_posture_detection_diet_ai.git
cd Yoga_posture_detection_diet_ai
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Environment Setup**
```bash
# Backend environment
cp backend/.env.example backend/.env
# Configure MongoDB URI, JWT secrets, email credentials
# See QUICK_EMAIL_SETUP.md for email configuration help

# Frontend environment  
cp frontend/.env.example frontend/.env
# Configure API endpoints
```

4. **Start all services**
```bash
# Option 1: Start all services concurrently
npm run dev

# Option 2: Start services individually
# Frontend (React + Vite) - Port 3002
cd frontend && npm run dev

# Backend (Node.js + Express) - Port 5001
cd backend && npm run dev

# ML Service (Python + MediaPipe) - Port 5000
cd backend/Ml && python app.py

# Diet Service (Python + Flask) - Port 5002
cd backend/Diet_Recommendation_System && python app.py
```

### Service Endpoints
- **Frontend Application**: http://localhost:3002
- **Backend API**: http://localhost:5001
- **ML Pose Detection**: http://localhost:5000
- **Diet Recommendation**: http://localhost:5002

## 📱 Usage Guide

### Getting Started
1. **Registration**: Create your account with basic profile information
2. **Profile Setup**: Complete your wellness profile and preferences
3. **Pose Detection**: Start your first yoga session with real-time feedback
4. **Progress Tracking**: View your analytics and improvement metrics
5. **Diet Planning**: Get personalized nutrition recommendations
6. **Community**: Connect with other practitioners and join challenges

### Pose Detection Workflow
1. **Camera Setup**: Allow camera access for pose detection
2. **Pose Selection**: Choose from 6 available yoga poses
3. **Real-time Feedback**: Follow on-screen guidance for proper alignment
4. **Session Completion**: Complete 3 perfect poses for session success
5. **Results**: View accuracy scores and improvement suggestions

### Diet Integration
1. **Post-Workout**: Automatic diet plan generation after yoga sessions
2. **Customization**: Adjust calorie targets and dietary preferences
3. **Meal Planning**: Detailed breakfast, lunch, and dinner recommendations
4. **Nutrition Tracking**: Monitor calorie intake and nutritional balance

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
npm start           # Start production server
```

### ML Service Development
```bash
cd backend/Ml
python app.py       # Start ML pose detection service
```

### Diet Service Development
```bash
cd backend/Diet_Recommendation_System
python app.py       # Start diet recommendation service
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

### Pose Detection Endpoints
- `GET /api/ml/available-poses` - Get supported poses
- `POST /api/ml/detect-pose` - Real-time pose analysis
- `GET /api/ml/pose/{poseId}` - Get specific pose details

### Diet Recommendation Endpoints
- `POST /api/diet/recommend` - Generate diet plan
- `GET /api/diet/plans` - Get user's diet plans
- `PUT /api/diet/preferences` - Update dietary preferences

### Analytics Endpoints
- `GET /api/analytics/user/{userId}` - User analytics
- `POST /api/analytics/session` - Record yoga session
- `GET /api/analytics/progress` - Progress tracking data

## 🧪 Testing

### Unit Tests
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test
```

### Integration Tests
```bash
# API endpoint testing
npm run test:api

# ML service testing
cd backend/Ml && python -m pytest
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build:frontend

# Start production server
npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Environment Variables
```bash
# Backend (.env)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3002
ML_API_URL=http://localhost:5000

# Email Configuration (Required for user registration)
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-app-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM_NAME=YogaAI - Yoga Posture Detection

# Frontend (.env)
VITE_API_URL=http://localhost:5001
VITE_ML_API_URL=http://localhost:5000
```

> 📧 **Email Setup Required:** The application requires email configuration for user registration and verification. See [QUICK_EMAIL_SETUP.md](QUICK_EMAIL_SETUP.md) for easy setup instructions or [EMAIL_PROVIDERS_GUIDE.md](EMAIL_PROVIDERS_GUIDE.md) for detailed provider options.
VITE_DIET_API_URL=http://localhost:5002
```

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write comprehensive tests for new features
- Update documentation for API changes
- Follow semantic commit message conventions

## 📈 Performance & Scalability

### Optimization Features
- **Lazy Loading**: Component-based code splitting
- **Image Optimization**: Compressed assets and responsive images
- **Caching**: Browser caching and API response caching
- **Database Indexing**: Optimized MongoDB queries
- **CDN Integration**: Static asset delivery optimization

### Monitoring & Analytics
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Real-time performance monitoring
- **User Analytics**: Usage patterns and engagement metrics
- **Health Checks**: Service availability monitoring

## 🔒 Security

### Security Measures
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password encryption
- **Input Validation**: Joi schema validation
- **CORS Configuration**: Controlled cross-origin requests
- **Rate Limiting**: API request throttling
- **Data Sanitization**: XSS and injection prevention

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Final Year Project Team - Cosmos College of Management and Technology**

- **[Sanjay Mahar](mailto:sanjaymahar2058@gmail.com)** - Project Lead & Full Stack Developer
- **Shashank Yadav** - ML Engineer & AI Integration Specialist  
- **Anup Bhatt** - Backend Developer & Database Architect
- **Ashish Kumar Karn** - Frontend Developer & UI/UX Designer
- **Bishist Pandey** - UI/UX Designer & Quality Assurance

## 📞 Support & Contact

- **Email**: sanjaymahar2058@gmail.com
- **Phone**: 
- **Institution**: Cosmos College of Management and Technology
- **Academic Year**: 2021-2026

## 🙏 Acknowledgments

- **MediaPipe Team** - For the excellent pose detection framework
- **React Community** - For the robust frontend ecosystem
- **MongoDB** - For the flexible NoSQL database solution
- **Cosmos College** - For academic support and guidance
- **Open Source Community** - For the amazing tools and libraries

---

<div align="center">


[⭐ Star this repo](https://github.com/saxonmahar/Yoga_posture_detection_diet_ai) | [🐛 Report Bug](https://github.com/saxonmahar/Yoga_posture_detection_diet_ai/issues) | [💡 Request Feature](https://github.com/saxonmahar/Yoga_posture_detection_diet_ai/issues)

</div>
