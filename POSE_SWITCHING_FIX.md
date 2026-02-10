# Pose Switching Landmark Bug - FIXED ✅

## Problem Description

When switching from one pose to another (e.g., Tree Pose → T Pose), two issues occurred:

1. **Visual Bug:** Canvas was showing the **old landmarks from the previous pose** instead of clearing
2. **Detection Bug:** ML API was receiving the **wrong pose name** (still Tree Pose instead of T Pose), causing incorrect feedback like "❌ Detected T-Pose instead of Tree Pose!"

### User Experience Issue:
1. Complete Tree Pose detection
2. Select "Next Pose" and choose T Pose
3. **BUG 1:** Canvas still shows Tree Pose landmarks/skeleton
4. **BUG 2:** TTS says "Detected T-Pose instead of Tree Pose!" (because it's comparing T-Pose against Tree Pose)
5. **EXPECTED:** Canvas should clear and detect T Pose correctly

## Root Causes

### Issue 1: Canvas Not Clearing
The pose switching logic was:
- ✅ Resetting state variables (pose count, frames, etc.)
- ✅ Stopping TTS audio
- ❌ **NOT clearing the canvas** - old landmarks remained visible
- ❌ **NOT stopping/restarting detection** - detection continued with old pose data

### Issue 2: Stale Pose Name in Detection
The `detectPose` function was using `currentSelectedPose` from a closure, which had a **stale value** due to React's asynchronous state updates:
- When switching poses, `setCurrentSelectedPose(selectedPose)` was called
- But the interval callback still had the OLD value in its closure
- So it kept sending the old pose name to the ML API

## Solutions Applied

### Fix 1: Clear Canvas on Pose Switch

Added canvas clearing logic when pose changes:

```javascript
// CRITICAL FIX: Clear the canvas when switching poses
if (canvasRef.current) {
  const ctx = canvasRef.current.getContext('2d');
  ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  console.log('🧹 Canvas cleared - old landmarks removed');
}
```

### Fix 2: Stop and Restart Detection

Added detection stop/restart logic for clean transition:

```javascript
// Stop current detection if running
const wasDetecting = isDetecting;
if (isDetecting && detectionIntervalRef.current) {
  clearInterval(detectionIntervalRef.current);
  detectionIntervalRef.current = null;
  setIsDetecting(false);
  console.log('⏸️ Detection stopped for pose switch');
}

// ... reset states ...

// Restart detection after a brief delay if it was running
if (wasDetecting && isStreaming) {
  setTimeout(() => {
    console.log(`▶️ Restarting detection for new pose: ${selectedPose}`);
    setGuidancePhase('analysis');
    setIsGivingInstructions(false);
    
    // Manually restart detection with the new pose
    setIsDetecting(true);
    detectionIntervalRef.current = setInterval(async () => {
      await detectPose();
    }, 200);
  }, 500);
}
```

### Fix 3: Use selectedPose Prop Directly

Changed the detection to use `selectedPose` prop instead of `currentSelectedPose` state to avoid stale closure values:

```javascript
// Use selectedPose directly to avoid stale closure issues
const poseToDetect = selectedPose || currentSelectedPose;
console.log(`📤 Sending to ML API: pose_type=${poseToDetect}`);
const response = await fetch(`${ML_API_URL}/api/ml/detect-pose`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image: imageData,
    pose_type: poseToDetect,  // ✅ Now uses the correct, updated pose
    user_name: 'User'
  })
});
```

### Fix 4: Reset Additional States

Added resets for:
- Landmark count: `setLandmarkCount(0)`
- Guidance phase: `setGuidancePhase('preparation')`
- Instruction step: `setCurrentInstructionStep(0)`
- Instruction flag: `setIsGivingInstructions(false)`

## Complete Fix Summary

When switching poses, the system now:

1. ✅ Stops TTS audio
2. ✅ Stops current detection loop
3. ✅ **Clears the canvas** (removes old landmarks)
4. ✅ Updates pose state immediately
5. ✅ Resets all pose-specific states
6. ✅ Resets landmark count to 0
7. ✅ Resets guidance phase
8. ✅ Resets session data
9. ✅ Restarts detection after 500ms delay
10. ✅ **Uses correct pose name** in ML API calls

## Testing Instructions

### Test Case 1: Tree Pose → T Pose
1. Start pose detection with Tree Pose
2. Perform Tree Pose until landmarks appear
3. Click "Next Pose" and select T Pose
4. **VERIFY:** Canvas clears immediately
5. **VERIFY:** New T Pose landmarks appear (not Tree Pose)
6. **VERIFY:** TTS gives T Pose feedback (not "Detected T-Pose instead of Tree Pose")
7. **VERIFY:** Console shows: `📤 Sending to ML API: pose_type=yog2`

### Test Case 2: Multiple Pose Switches
1. Start with Warrior II (yog1)
2. Switch to Goddess Pose (yog4)
3. Switch to Plank Pose (yog6)
4. Switch to Downward Dog (yog5)
5. **VERIFY:** Each switch clears canvas and shows correct new pose
6. **VERIFY:** ML API receives correct pose_type each time

### Test Case 3: Detection State
1. Start detection with any pose
2. Wait for landmarks to appear
3. Switch to different pose
4. **VERIFY:** Detection stops briefly (500ms)
5. **VERIFY:** Detection restarts automatically
6. **VERIFY:** New pose is detected correctly with proper feedback

## Console Logs to Watch

When switching poses, you should see:
```
🔄 Updating currentSelectedPose: yog3 → yog2
🔇 TTS STOPPED - Pose switched!
⏸️ Detection stopped for pose switch
🧹 Canvas cleared - old landmarks removed
✅ Pose switched to: yog2 - States reset, canvas cleared
▶️ Restarting detection for new pose: yog2
📤 Sending to ML API: pose_type=yog2 (selectedPose=yog2, currentSelectedPose=yog2)
```

## Before vs After

### Before Fix:
- ❌ Old landmarks remain on canvas
- ❌ Wrong pose name sent to ML API
- ❌ Confusing feedback: "Detected T-Pose instead of Tree Pose!"
- ❌ Detection continues with old pose
- ❌ Landmark count doesn't reset

### After Fix:
- ✅ Canvas clears immediately
- ✅ Correct pose name sent to ML API
- ✅ Accurate feedback for the new pose
- ✅ Clean visual transition
- ✅ Detection restarts for new pose
- ✅ All states properly reset
- ✅ Correct landmarks for new pose

## Technical Details

### React State Closure Issue
The original bug was a classic React closure problem:
- `setInterval` captures variables in its closure
- When state updates, the closure still has old values
- Solution: Use props directly instead of state in closures

### State Update Order
Fixed by updating state in the correct order:
1. Update `currentSelectedPose` first
2. Clear canvas and reset states
3. Restart detection with new interval (creates new closure with updated values)

## Additional Benefits

1. **Better Performance:** Detection stops during transition
2. **Cleaner UX:** No visual artifacts from previous pose
3. **Accurate Detection:** Fresh start for each new pose
4. **Proper State Management:** All states synchronized
5. **Correct ML Analysis:** Right pose compared against right reference

## Related Components

This fix ensures proper coordination between:
- Canvas rendering (`canvasRef`)
- Detection loop (`detectionIntervalRef`)
- Pose state (`selectedPose`, `currentSelectedPose`)
- Landmark rendering (`drawLandmarks`)
- Session management (`sessionData`)
- ML API communication (`detectPose`)

---

**Date Fixed:** February 10, 2026
**Status:** ✅ RESOLVED
**Impact:** High - Affects all pose switching scenarios
**Testing:** Required before deployment
**Bugs Fixed:** 2 (Canvas clearing + Stale pose name)
