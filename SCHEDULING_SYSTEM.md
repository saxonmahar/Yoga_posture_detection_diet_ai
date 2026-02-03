# Yoga Scheduling System

## Overview
The comprehensive scheduling system allows users to plan, organize, and track their yoga sessions with advanced features like recurring sessions, templates, and progress tracking.

## Features

### 📅 Calendar Interface
- **Monthly View**: Visual calendar showing all scheduled sessions
- **Session Indicators**: Color-coded dots showing session status
  - 🟢 Green: Completed sessions
  - 🔵 Blue: Scheduled sessions  
  - 🔴 Red: Missed sessions
  - ⚫ Gray: Cancelled sessions
- **Interactive**: Click dates to create sessions, click sessions to view/edit
- **Quick Stats**: Monthly overview of sessions, completion rates

### ⚡ Session Management
- **Create Sessions**: Schedule individual yoga sessions
- **Edit Sessions**: Modify existing scheduled sessions
- **Complete Sessions**: Mark sessions as completed with accuracy tracking
- **Delete Sessions**: Remove unwanted sessions
- **Session Details**:
  - Title and description
  - Date and time
  - Duration (5-120 minutes)
  - Pose selection from available poses
  - Difficulty level (beginner/intermediate/advanced)
  - Personal notes

### 🔄 Recurring Sessions
- **Flexible Patterns**: Daily, weekly, or monthly recurring
- **Custom Days**: Select specific days of the week for weekly recurring
- **End Date**: Set when recurring sessions should stop
- **Conflict Detection**: Prevents double-booking at same time slots

### 📋 Schedule Templates
Pre-built workout programs for different fitness levels:

#### Beginner 3-Day Program
- 3 sessions per week (Mon/Wed/Fri)
- 20 minutes each
- Basic poses: T-Pose, Tree, Warrior II

#### Intermediate 4-Day Program  
- 4 sessions per week
- 35 minutes each
- Mixed morning/evening sessions
- Intermediate poses with combinations

#### Advanced Daily Practice
- 7 sessions per week
- 45 minutes each
- Comprehensive daily routine
- All pose types with advanced combinations

#### Stress Relief Program
- 5 evening sessions per week
- 25 minutes each
- Relaxation-focused poses
- Perfect for unwinding

### 📊 Analytics & Tracking
- **Completion Rate**: Percentage of scheduled sessions completed
- **Current Streak**: Consecutive days with completed sessions
- **Session History**: Track all past sessions with accuracy scores
- **Progress Insights**: Visual representation of consistency

### 🎯 Dashboard Integration
- **Today's Sessions**: Quick view of today's scheduled sessions
- **Upcoming Sessions**: Next 5 upcoming sessions
- **Quick Actions**: Direct access to schedule from dashboard
- **Goal Tracking**: Integration with daily wellness goals

## Technical Implementation

### Backend (Node.js/Express)
- **Schedule Model**: MongoDB schema with comprehensive session data
- **Controller**: Full CRUD operations for sessions and templates
- **Routes**: RESTful API endpoints with authentication
- **Middleware**: JWT authentication for all schedule operations

### Frontend (React/Vite)
- **SchedulePage**: Main scheduling interface
- **Calendar Component**: Interactive monthly calendar view
- **SessionModal**: Create/edit session form with validation
- **API Service**: Complete API integration for all operations

### Database Schema
```javascript
{
  user: ObjectId,           // User reference
  title: String,            // Session title
  date: Date,              // Session date
  time: String,            // Session time (HH:MM)
  duration: Number,        // Duration in minutes
  poses: [String],         // Selected poses
  difficulty: String,      // beginner/intermediate/advanced
  status: String,          // scheduled/completed/missed/cancelled
  recurring: {             // Recurring session settings
    enabled: Boolean,
    pattern: String,       // daily/weekly/monthly
    daysOfWeek: [Number],  // For weekly pattern
    endDate: Date
  },
  reminders: {             // Reminder settings
    enabled: Boolean,
    minutes: [Number]      // Minutes before session
  },
  notes: String,           // Personal notes
  completedAt: Date,       // Completion timestamp
  accuracy: Number,        // Pose accuracy when completed
  sessionData: {           // Detailed session results
    totalPoses: Number,
    averageAccuracy: Number,
    duration: Number
  }
}
```

## API Endpoints

### Schedule Management
- `GET /api/schedule` - Get user's schedule for date range
- `POST /api/schedule` - Create new session
- `PUT /api/schedule/:id` - Update existing session
- `PATCH /api/schedule/:id/complete` - Mark session as completed
- `DELETE /api/schedule/:id` - Delete session

### Templates
- `GET /api/schedule/templates` - Get available templates
- `POST /api/schedule/templates/apply` - Apply template to create sessions

## Usage Instructions

### Creating a Session
1. Navigate to Schedule page
2. Click "New Session" or click on a calendar date
3. Fill in session details (title, time, duration, poses)
4. Optionally set up recurring pattern
5. Save session

### Using Templates
1. Click "Templates" button on Schedule page
2. Select desired template (Beginner/Intermediate/Advanced/Stress Relief)
3. Choose start date and preferred time
4. Apply template to create 4 weeks of sessions

### Managing Sessions
- **View**: Click on any session in calendar to see details
- **Edit**: Click edit button in session modal
- **Complete**: Mark sessions as completed after practice
- **Delete**: Remove unwanted sessions

### Tracking Progress
- View completion rates and streaks on Schedule page
- Check today's sessions in sidebar
- Monitor upcoming sessions for planning
- Access detailed analytics from Dashboard

## Integration Points

### Dashboard
- Quick action card for easy schedule access
- Today's sessions widget
- Upcoming sessions preview

### Pose Detection
- Sessions can be completed through pose detection
- Accuracy scores automatically recorded
- Session data saved for progress tracking

### Progress Analytics
- Schedule completion feeds into overall progress
- Streak calculations for consistency tracking
- Session history for trend analysis

## Future Enhancements
- Push notifications for session reminders
- Social sharing of workout schedules
- Advanced analytics with charts and insights
- Integration with wearable devices
- Workout plan recommendations based on progress
- Group sessions and challenges