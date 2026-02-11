# Progress Display Fix - Sessions Not Showing

## Problem
User completed yoga sessions but the Progress page showed "0 sessions" and displayed the empty state instead of showing their progress data.

## Root Cause
**Model Mismatch**: The application was using TWO DIFFERENT database models:

1. **Saving sessions**: `PoseSession` model (in `analyticsController.js`)
   - Field: `userId`
   - Field: `endTime` (session date)
   - Field: `poses` (array of poses)
   - Field: `duration` (in minutes)

2. **Reading sessions**: `YogaSession` model (in `analyticsService.js`)
   - Field: `user_id`
   - Field: `session_date`
   - Field: `poses_practiced`
   - Field: `total_duration`

**Result**: Sessions were being saved successfully to `PoseSession` collection, but analytics was querying the `YogaSession` collection, which was empty!

## Backend Logs Evidence
```
✅ Pose session saved: new ObjectId('698b0bbe2cd984d71f85a7b2')
✅ User progress updated
📈 Fetching analytics for user: 69897aeee88471e8f0ec57ef
📈 Found 0 sessions for user 69897aeee88471e8f0ec57ef  ← WRONG!
```

## Solution
Updated `analyticsService.js` to use the correct `PoseSession` model and field names:

### Changes Made

1. **Import correct model**:
   ```javascript
   // OLD
   const YogaSession = require('../models/yogaSession');
   
   // NEW
   const PoseSession = require('../models/posesession');
   ```

2. **Query with correct fields**:
   ```javascript
   // OLD
   const sessions = await YogaSession.find({
       user_id: userId
   }).sort({ session_date: -1 });
   
   // NEW
   const sessions = await PoseSession.find({
       userId: userId,
       status: 'completed'
   }).sort({ endTime: -1 });
   ```

3. **Access correct field names**:
   - `session.poses` instead of `session.poses_practiced`
   - `pose.poseName` instead of `pose.pose_name`
   - `pose.accuracyScore` instead of `pose.accuracy_score`
   - `session.endTime` instead of `session.session_date`
   - `session.duration` instead of `session.total_duration`

4. **Convert to frontend format**:
   Added mapping to convert PoseSession format to the format expected by frontend:
   ```javascript
   const recentSessions = sessions.slice(0, 10).map(session => ({
       _id: session._id,
       session_date: session.endTime || session.createdAt,
       total_duration: session.duration,
       poses_practiced: session.poses.map(pose => ({
           pose_id: pose.poseId,
           pose_name: pose.poseName,
           accuracy_score: pose.accuracyScore,
           hold_duration: pose.holdDuration,
           completed_successfully: pose.accuracyScore >= 90
       })),
       session_notes: session.sessionName || session.userNotes
   }));
   ```

## Files Modified
- `backend/services/analyticsService.js` - Fixed model and field names

## Testing
1. Complete a yoga session (any pose)
2. Click "View My Progress" button
3. Should now see:
   - Total sessions count
   - Weekly performance chart with data
   - Pose accuracy breakdown
   - Achievements unlocked
   - AI insights

## Expected Backend Logs After Fix
```
✅ Pose session saved: new ObjectId('...')
✅ User progress updated
📈 Fetching analytics for user: 69897aeee88471e8f0ec57ef
📈 Found 3 sessions for user 69897aeee88471e8f0ec57ef  ← CORRECT!
✅ Analytics fetched successfully
```

## Status
✅ **FIXED** - Analytics service now correctly queries PoseSession model and displays user progress data.
