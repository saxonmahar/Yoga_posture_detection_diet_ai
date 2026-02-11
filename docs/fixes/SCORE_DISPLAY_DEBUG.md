# Score Display Debugging - Real-Time Accuracy on Webcam

## Issue
User reports that the real-time accuracy score is NOT showing on the webcam overlay for any of the 6 poses after recent pose-switching fixes.

## Investigation

### Code Analysis
1. **drawLandmarks Function** (PoseCamera.jsx, line ~793)
   - Score overlay code EXISTS and looks correct
   - Checks: `if (result && result.accuracy_score !== undefined)`
   - Draws score box with dynamic colors based on accuracy
   - Shows score percentage, status text, and pose name

2. **ML API Response** (backend/Ml/app.py, line ~336)
   - ML API DOES return `accuracy_score` in the response
   - Response includes: `accuracy_score`, `feedback`, `corrections`, `pose_name`, `landmarks`

3. **Function Call** (PoseCamera.jsx, line 529)
   - `drawLandmarks(result.landmarks, result)` is called correctly
   - Both landmarks AND full result object are passed

### Debug Changes Added

Added console logs to track the issue:

1. **Line ~705** - Log result object when drawLandmarks is called:
   ```javascript
   console.log(`📊 RESULT OBJECT:`, result ? `accuracy_score=${result.accuracy_score}, pose_name=${result.pose_name}` : 'NULL');
   ```

2. **Line ~793** - Log before score overlay condition:
   ```javascript
   console.log(`🎯 SCORE OVERLAY CHECK: result=${!!result}, accuracy_score=${result?.accuracy_score}`);
   ```

3. **Line ~795** - Log when score overlay is being drawn:
   ```javascript
   console.log(`✅ DRAWING SCORE OVERLAY: ${result.accuracy_score}%`);
   ```

## Testing Instructions

1. **Open Browser Console** (F12)
2. **Start Pose Detection** - Select any pose (T Pose, Tree Pose, etc.)
3. **Watch Console Logs** - Look for these messages:
   - `📊 RESULT OBJECT: accuracy_score=XX, pose_name=...`
   - `🎯 SCORE OVERLAY CHECK: result=true, accuracy_score=XX`
   - `✅ DRAWING SCORE OVERLAY: XX%`

## Expected Outcomes

### If Score Shows:
- ✅ Console shows all 3 log messages
- ✅ Score box appears in top-left of webcam
- ✅ Score updates in real-time as you move
- **Issue is FIXED!**

### If Score Doesn't Show:

#### Scenario A: No result object
- Console shows: `📊 RESULT OBJECT: NULL`
- **Problem**: ML API not returning data or fetch failing
- **Fix**: Check ML API logs, verify endpoint is responding

#### Scenario B: Result exists but no accuracy_score
- Console shows: `📊 RESULT OBJECT: accuracy_score=undefined`
- **Problem**: ML API response missing accuracy_score field
- **Fix**: Check ML API response structure

#### Scenario C: Condition not met
- Console shows: `🎯 SCORE OVERLAY CHECK: result=false` or `accuracy_score=undefined`
- **Problem**: Result object or accuracy_score is undefined
- **Fix**: Verify result is passed correctly to drawLandmarks

#### Scenario D: Canvas issue
- Console shows all 3 logs but no visual score
- **Problem**: Canvas rendering issue or z-index problem
- **Fix**: Check canvas positioning, z-index, and drawing code

## Quick Verification

Run this in browser console while pose detection is active:
```javascript
// Check if canvas exists
console.log('Canvas:', document.querySelector('canvas'));

// Check canvas z-index
console.log('Canvas z-index:', window.getComputedStyle(document.querySelector('canvas')).zIndex);

// Check if canvas is visible
console.log('Canvas visible:', window.getComputedStyle(document.querySelector('canvas')).display);
```

## Next Steps

1. **Test with T Pose** (easiest pose)
2. **Check console logs** for the 3 debug messages
3. **Report findings**:
   - Are all 3 logs showing?
   - What are the values?
   - Is the score box visible?

## Files Modified
- `frontend/src/components/pose-detection/PoseCamera.jsx` - Added debug logs

## Status
🔍 **DEBUGGING IN PROGRESS** - Waiting for test results with new debug logs
