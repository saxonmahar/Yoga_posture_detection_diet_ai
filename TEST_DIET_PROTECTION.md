# Test Diet Protection - Step by Step

## Quick Test for "maheshmaher" User

### Step 1: Clear Browser Data
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run this command:
```javascript
localStorage.clear();
console.log('✅ localStorage cleared');
location.reload();
```

### Step 2: Login as maheshmaher
1. Go to login page
2. Login with: maheshmahar2005@gmail.com
3. Watch console for: `🧹 Clearing stale session data from localStorage...`

### Step 3: Check Dashboard
1. Go to Dashboard
2. Look at "Personalized Diet" card
3. **Expected Result:**
   - Card should have 🔒 lock icon in top-right
   - Badge should say "Complete Session" (not "Available")
   - Card should be slightly dimmed/grayed out
   - Clicking should do NOTHING

4. Check console for:
```
⚠️ Dashboard: User has 0 sessions - LOCKING diet
```

### Step 4: Try Accessing Diet Directly
1. Try navigating to `/diet-plan` in URL
2. **Expected Result:**
   - Should show "Complete a Yoga Session First!" screen
   - Big purple icon with utensils
   - "Start Your First Yoga Session" button
   - Cannot see actual diet plan

3. Check console for:
```
⚠️ Diet page: User has 0 sessions - LOCKING diet
```

### Step 5: Complete a Session
1. Click "AI Pose Detection" card
2. Select any pose (e.g., Tree Pose)
3. Complete 3 perfect poses
4. Wait for post-yoga meal card
5. Click "See Full Diet Plan" or go back to dashboard

### Step 6: Verify Unlock
1. Go to Dashboard
2. Look at "Personalized Diet" card
3. **Expected Result:**
   - NO lock icon
   - Badge says "Available"
   - Card is bright and clickable
   - Clicking opens diet plan

4. Check console for:
```
✅ Dashboard: User has 1 sessions - UNLOCKING diet
```

### Step 7: Test Persistence
1. Logout
2. Login again as same user
3. Check dashboard
4. **Expected Result:**
   - Diet card still UNLOCKED
   - Database remembers the session

## Visual Indicators

### LOCKED Card (0 Sessions)
```
┌─────────────────────────────┐
│  🔒                         │
│  🍽️  Personalized Diet     │
│                             │
│  Access your AI-curated     │
│  nutrition plan             │
│                             │
│  [Complete Session]         │
└─────────────────────────────┘
   ↑ Grayed out, not clickable
```

### UNLOCKED Card (1+ Sessions)
```
┌─────────────────────────────┐
│                             │
│  🍽️  Personalized Diet     │
│                             │
│  Access your AI-curated     │
│  nutrition plan             │
│                             │
│  [Available]           →    │
└─────────────────────────────┘
   ↑ Bright, clickable, arrow
```

## Console Commands for Testing

### Check localStorage
```javascript
console.log('hasCompletedYogaSession:', localStorage.getItem('hasCompletedYogaSession'));
console.log('yogaSessionData:', localStorage.getItem('yogaSessionData'));
```

### Manually Clear Session Data
```javascript
localStorage.removeItem('hasCompletedYogaSession');
localStorage.removeItem('yogaSessionData');
localStorage.removeItem('multiPoseSessionComplete');
console.log('✅ Session data cleared');
location.reload();
```

### Check Database Sessions (Backend)
```bash
cd backend
node check-user-sessions.js
```

## Expected Console Output

### On Login
```
🧹 Clearing stale session data from localStorage...
🔍 Login Response: {success: true, data: {...}}
✅ User loaded from /me endpoint: maheshmahar
```

### On Dashboard Load (0 Sessions)
```
⚠️ Dashboard: User has 0 sessions - LOCKING diet
```

### On Dashboard Load (1+ Sessions)
```
✅ Dashboard: User has 1 sessions - UNLOCKING diet
```

### On Diet Page Access (0 Sessions)
```
⚠️ Diet page: User has 0 sessions - LOCKING diet
```

### On Diet Page Access (1+ Sessions)
```
✅ Diet page: User has 1 sessions - UNLOCKING diet
```

## Troubleshooting

### Problem: Diet still unlocked with 0 sessions
**Solution:**
1. Clear localStorage completely
2. Logout and login again
3. Hard refresh (Ctrl+Shift+R)

### Problem: Diet locked even after completing session
**Solution:**
1. Check if session saved to database:
   ```bash
   cd backend
   node check-user-sessions.js
   ```
2. Check backend console for session save errors
3. Verify backend server is running on port 5001

### Problem: Console shows database error
**Solution:**
1. Check if backend is running
2. Check MongoDB connection
3. Verify user is authenticated (has valid token)

## Success Criteria

✅ User with 0 sessions → Diet LOCKED
✅ User completes 1 session → Diet UNLOCKS
✅ Logout/Login → Diet stays UNLOCKED
✅ Different user with 0 sessions → Diet LOCKED
✅ No cross-user data pollution
✅ Database is source of truth
✅ localStorage syncs with database
