# Quick Start: Post-Yoga Meal Integration

## 🚀 Start in 3 Steps

### Step 1: Start Python Flask (Diet System)
```bash
cd backend/Diet_Recommendation_System
python app.py
```
✅ Should see: `Running on http://127.0.0.1:5002`

### Step 2: Start Node.js Backend
```bash
cd backend
npm start
```
✅ Should see: `Server running on port 5001`

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```
✅ Should see: `Local: http://localhost:3002`

## 🧘 Test the Integration

1. **Open browser**: `http://localhost:3002`
2. **Login** with your account
3. **Go to Pose Detection**: Click "AI Pose Detection" or navigate to `/pose-detection`
4. **Select a pose**: Click on any pose card (e.g., Tree Pose)
5. **Click "Start Pose"**: Webcam will start
6. **Hold the pose**: Keep >90% accuracy
7. **Get 3 perfect poses**: Watch for "BRAVO!" celebration
8. **Wait 2 seconds**: Meal card will appear automatically! 🍽️

## 🎯 What You'll See

### After Completing a Pose:
1. **Celebration**: "BRAVO! 3 Perfect Poses Completed!"
2. **Pose Complete Modal**: Options to choose next pose or end session
3. **Meal Card** (appears automatically):
   - Your session summary (calories, duration, accuracy)
   - Recovery needs (protein, carbs, water)
   - **Nepali food recommendation** with beautiful image
   - Local name in Nepali (e.g., दाल भात)
   - Nutrition breakdown
   - Price and prep time
   - Alternative meal options

### Example Output:
```
🧘 Great session! You burned 8 calories with excellent 92% accuracy! 🎯

Your Recovery Needs:
- 10 Calories
- 12g Protein
- 30g Carbs
- 1L Water

Perfect Recovery Meal:
🍽️ Dal Bhat (दाल भात)
- 350 calories
- 12g protein
- 65g carbs
- 5g fat
- ₹80
- 30 min prep
```

## 🐛 Quick Troubleshooting

### Meal card doesn't appear?
1. Check Python Flask is running: `http://localhost:5002/health`
2. Check browser console (F12) for errors
3. Complete the pose properly (3 perfect poses)

### Images don't load?
- Check internet connection (images from Unsplash)
- Images will fallback to placeholder if Unsplash fails

### Wrong meal type?
- Morning (5 AM - 12 PM): Breakfast foods
- Afternoon (12 PM - 5 PM): Lunch foods
- Evening (5 PM - 5 AM): Dinner foods

## 📊 Test Different Scenarios

### Test 1: Morning Session
- Time: 8:00 AM
- Pose: Tree Pose
- Expected: Breakfast foods (Chiura, Poha, Upma)

### Test 2: Afternoon Session
- Time: 2:00 PM
- Pose: Warrior II
- Expected: Lunch foods (Dal Bhat, Momo, Thukpa)

### Test 3: Evening Session
- Time: 7:00 PM
- Pose: Plank
- Expected: Dinner foods (Khichdi, Roti Sabzi, Soup)

## 🎉 Success!

If you see the meal card with Nepali food images and nutrition data, **the integration is working perfectly!**

Next steps:
- Try different poses
- Test at different times of day
- Click "View Full Diet Plan" to see more options
- Share feedback on the meal recommendations

---

**Need Help?** Check `POST_YOGA_MEAL_INTEGRATION.md` for detailed documentation.

