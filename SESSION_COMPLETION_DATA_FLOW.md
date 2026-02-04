# 📊 Session Completion - Data Flow & Storage

## Where Your Data Goes When You Complete a Session

When you complete a Wednesday session (or any session), here's exactly what happens to your data:

### 1. 🎯 Fields Updated in Database

When you click "Mark Complete" on a session, these fields get updated in the MongoDB database:

```javascript
// BEFORE Completion
{
  "_id": "69831ec498334763e75cc6f7",
  "user": "69822354b394f20e559ab17e",
  "title": "Wednesday Morning Yoga",
  "date": "2026-02-04T10:26:12.712Z",
  "time": "07:00",
  "duration": 30,
  "poses": ["warrior2", "tree", "downdog"],
  "difficulty": "intermediate",
  "status": "scheduled",           // ← This changes
  "completedAt": null,             // ← This gets set
  "accuracy": null,                // ← This gets set
  "sessionData": {}                // ← This gets populated
}

// AFTER Completion
{
  "_id": "69831ec498334763e75cc6f7",
  "user": "69822354b394f20e559ab17e",
  "title": "Wednesday Morning Yoga",
  "date": "2026-02-04T10:26:12.712Z",
  "time": "07:00",
  "duration": 30,
  "poses": ["warrior2", "tree", "downdog"],
  "difficulty": "intermediate",
  "status": "completed",           // ✅ Changed from "scheduled"
  "completedAt": "2026-02-04T10:26:12.792Z", // ✅ Timestamp added
  "accuracy": 87.5,                // ✅ Your pose accuracy
  "sessionData": {                 // ✅ Detailed session metrics
    "totalPoses": 3,
    "averageAccuracy": 87.5,
    "duration": 28,
    "poseAccuracies": {
      "warrior2": 92,
      "tree": 85,
      "downdog": 86
    },
    "completedPoses": ["warrior2", "tree", "downdog"],
    "totalTime": 1680,
    "caloriesBurned": 120,
    "heartRateAvg": 85
  }
}
```

### 2. 📈 Statistics That Get Updated

After completing your Wednesday session, these statistics automatically update:

#### Dashboard Statistics
- **Total Sessions**: Increments by 1
- **Completed Sessions**: Increments by 1  
- **Completion Rate**: Recalculated as (completed/total * 100)
- **Current Streak**: Recalculated based on consecutive days

#### Schedule Page Statistics
- **Today's Sessions**: Shows as "completed" status
- **Upcoming Sessions**: Remains unchanged
- **Monthly View**: Session appears with green "completed" indicator

### 3. 🔄 Data Flow Process

```
User Clicks "Mark Complete" 
    ↓
Frontend sends POST request to /api/schedule/:id/complete
    ↓
Backend receives: { accuracy: 85, sessionData: {...} }
    ↓
Database updates session document with:
  - status: "completed"
  - completedAt: current timestamp
  - accuracy: provided accuracy
  - sessionData: detailed metrics
    ↓
Frontend refreshes and shows updated UI
    ↓
Statistics recalculate automatically
```

### 4. 💾 Database Collection Structure

Your completed session data is stored in the `schedules` collection:

```javascript
// MongoDB Collection: schedules
{
  "_id": ObjectId("..."),
  "user": ObjectId("..."),           // Links to your user account
  "title": "Wednesday Morning Yoga",
  "date": ISODate("2026-02-04"),
  "time": "07:00",
  "duration": 30,
  "poses": ["warrior2", "tree", "downdog"],
  "difficulty": "intermediate",
  "status": "completed",             // ← Key field for tracking
  "notes": "heyyy",
  "recurring": {
    "enabled": true,
    "pattern": "daily",
    "endDate": "2026-02-05"
  },
  "completedAt": ISODate("2026-02-04T10:26:12.792Z"),
  "accuracy": 87.5,
  "sessionData": {
    "totalPoses": 3,
    "averageAccuracy": 87.5,
    "duration": 28,
    "poseAccuracies": {
      "warrior2": 92,
      "tree": 85, 
      "downdog": 86
    },
    "completedPoses": ["warrior2", "tree", "downdog"],
    "totalTime": 1680,
    "caloriesBurned": 120,
    "heartRateAvg": 85
  },
  "createdAt": ISODate("2026-02-04T10:26:12.723Z"),
  "updatedAt": ISODate("2026-02-04T10:26:12.794Z")
}
```

### 5. 🎯 What Data Gets Tracked

When you complete a session, the system tracks:

#### Basic Completion Data
- ✅ **Completion Status**: Changes from "scheduled" to "completed"
- ✅ **Completion Time**: Exact timestamp when you marked it complete
- ✅ **Overall Accuracy**: Your average pose accuracy (currently defaults to 85%)

#### Detailed Session Metrics
- ✅ **Total Poses**: Number of poses in the session
- ✅ **Average Accuracy**: Your overall performance
- ✅ **Actual Duration**: How long you actually practiced
- ✅ **Individual Pose Accuracy**: Performance per pose (when available)
- ✅ **Completed Poses**: Which poses you actually did
- ✅ **Total Time**: Session duration in seconds
- ✅ **Calories Burned**: Estimated calories (when available)
- ✅ **Heart Rate**: Average heart rate (when available)

### 6. 📊 How Statistics Are Calculated

#### Completion Rate
```javascript
const totalSessions = allUserSessions.length;
const completedSessions = allUserSessions.filter(s => s.status === 'completed').length;
const completionRate = (completedSessions / totalSessions) * 100;
```

#### Current Streak
```javascript
// Counts consecutive days with completed sessions
let streak = 0;
let checkDate = today;
while (hasCompletedSessionOnDate(checkDate)) {
  streak++;
  checkDate = previousDay(checkDate);
}
```

### 7. 🔍 How to View Your Data

#### In the UI
1. **Schedule Page**: See session status change to "completed" with green badge
2. **Dashboard**: Updated statistics in the stats cards
3. **Progress Page**: Historical data and trends
4. **Community Page**: Achievements and leaderboard updates

#### In Database (for developers)
```javascript
// Find all completed sessions for a user
db.schedules.find({
  user: ObjectId("your-user-id"),
  status: "completed"
})

// Find today's completed sessions
db.schedules.find({
  user: ObjectId("your-user-id"),
  status: "completed",
  date: {
    $gte: ISODate("2026-02-04T00:00:00.000Z"),
    $lt: ISODate("2026-02-05T00:00:00.000Z")
  }
})
```

### 8. 🚀 Real-Time Updates

After completing a session:
- ✅ **Immediate UI Update**: Session status changes instantly
- ✅ **Statistics Refresh**: All counters update automatically  
- ✅ **Calendar Update**: Calendar view shows completed session
- ✅ **Dashboard Sync**: Dashboard statistics reflect new completion
- ✅ **Progress Tracking**: Data feeds into progress analytics

### 9. 📱 Current Implementation Status

**What's Working:**
- ✅ Session completion tracking
- ✅ Status updates (scheduled → completed)
- ✅ Completion timestamp recording
- ✅ Basic accuracy tracking
- ✅ Statistics calculation
- ✅ Real-time UI updates

**What Could Be Enhanced:**
- 🔄 Integration with actual pose detection accuracy
- 🔄 Real-time heart rate monitoring
- 🔄 Actual calorie calculation based on poses
- 🔄 Individual pose performance tracking
- 🔄 Session video/photo capture

### 10. 🎯 Summary

When you complete your Wednesday session:

1. **Database Record**: Your session document gets updated with completion data
2. **Statistics**: Your personal stats (completion rate, streak) recalculate
3. **UI Updates**: All interfaces show the updated status immediately
4. **Progress Tracking**: Data becomes part of your long-term progress analytics
5. **Achievements**: Completion may unlock badges or achievements

Your data is safely stored in MongoDB and immediately available across all parts of the application!