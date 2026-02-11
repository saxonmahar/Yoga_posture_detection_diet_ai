# Post-Yoga Meal Integration - Complete Guide

## ✅ What Has Been Implemented

### 1. Python Flask Backend Enhancement
**File**: `backend/Diet_Recommendation_System/app.py`

Added `/recommend-post-yoga` endpoint that:
- Accepts yoga session data (calories burned, duration, poses, accuracy, time of day)
- Analyzes pose types (flexibility, strength, balance, cardio)
- Filters Nepali foods based on session context
- Returns personalized meal recommendations with recovery needs

### 2. Nepali Food Database (CSV Files)
**Files**: 
- `backend/Diet_Recommendation_System/Data_sets/nepali_breakfast.csv` (10 foods)
- `backend/Diet_Recommendation_System/Data_sets/nepali_lunch.csv` (10 foods)
- `backend/Diet_Recommendation_System/Data_sets/nepali_dinner.csv` (10 foods)

**Features**:
- Authentic Nepali/Indian foods (Dal Bhat, Momo, Thukpa, etc.)
- Complete nutrition data (calories, protein, carbs, fat, fiber)
- Image URLs from Unsplash (no manual upload needed!)
- Local names in Nepali (देवनागरी)
- Price in NPR
- Prep time and best timing (pre-yoga, post-yoga, recovery)

### 3. PostYogaMealCard Component
**File**: `frontend/src/components/diet-plan/PostYogaMealCard.jsx`

Beautiful modal that shows:
- Session summary (calories burned, duration, accuracy)
- Personalized recovery message
- Recovery nutritional needs (calories, protein, carbs, hydration)
- Primary recommended meal with large image
- Meal details (nutrition, benefits, prep time, price)
- Alternative meal options
- Navigation to full diet plan

### 4. Integration with Pose Detection
**File**: `frontend/src/components/pose-detection/PoseCamera.jsx`

**Changes Made**:
1. Added `PostYogaMealCard` import
2. Added state for meal card: `showMealCard`, `mealCardSessionData`
3. Added `getTimeOfDay()` helper function
4. Modified pose completion logic to prepare session data
5. Automatically shows meal card 2 seconds after pose completion
6. Renders `PostYogaMealCard` component at the end

## 🚀 How It Works

### User Flow:
1. **User completes a yoga pose** (3 perfect poses achieved)
2. **Celebration shows** ("BRAVO! 3 Perfect Poses!")
3. **Pose complete modal appears** with options
4. **2 seconds later, meal card automatically appears** with:
   - Session summary
   - Recovery needs
   - Personalized Nepali food recommendations
   - Beautiful food images from Unsplash

### Data Flow:
```
PoseCamera (pose completed)
    ↓
Prepare session data:
  - caloriesBurned: 8 (from pose.estimatedCalories)
  - duration: 2 minutes (calculated from session time)
  - poses: [{ poseName: "Tree Pose", category: "Balance" }]
  - accuracy: 90% (average from session)
  - timeOfDay: "morning" (from current time)
    ↓
Show PostYogaMealCard
    ↓
Fetch from Python Flask (port 5002)
POST /recommend-post-yoga
    ↓
Python analyzes:
  - Pose types (flexibility/strength/balance)
  - Time of day (breakfast/lunch/dinner)
  - Calories burned
    ↓
Filter Nepali foods:
  - High protein if strength poses
  - High fiber if flexibility poses
  - Match meal type to time of day
    ↓
Return recommendations:
  - Primary meal (best match)
  - Alternatives (2-3 options)
  - Recovery needs
  - Personalized message
    ↓
Display in beautiful modal with:
  - Food images from Unsplash
  - Nutrition breakdown
  - Local Nepali names
  - Price and prep time
```

## 🧪 Testing

### Step 1: Start Python Flask Server
```bash
cd backend/Diet_Recommendation_System
python app.py
```
Server should start on `http://localhost:5002`

### Step 2: Test the Endpoint (Optional)
```bash
cd backend/Diet_Recommendation_System
node test-post-yoga.js
```

Expected output:
```json
{
  "success": true,
  "sessionSummary": {
    "caloriesBurned": 150,
    "duration": 25,
    "accuracy": 85,
    "poseTypes": ["flexibility"]
  },
  "recoveryNeeds": {
    "calories": 180,
    "protein": 12,
    "carbs": 30,
    "hydration": 2
  },
  "recommendations": {
    "primary": {
      "Food_items": "Dal Bhat",
      "Calories": 350,
      "Proteins": 12,
      "Link": "https://images.unsplash.com/...",
      "LocalName": "दाल भात"
    },
    "alternatives": [...]
  },
  "message": "🧘 Great session! You burned 150 calories with good 85% accuracy!"
}
```

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```

### Step 4: Complete a Yoga Pose
1. Navigate to `/pose-detection`
2. Select any pose (e.g., Tree Pose)
3. Click "Start Pose"
4. Hold the pose with >90% accuracy
5. Get 3 perfect poses
6. **Watch for the meal card to appear automatically!**

## 📊 Example Scenarios

### Scenario 1: Morning Flexibility Session
**Input**:
- Time: 8:00 AM
- Pose: Tree Pose (Balance/Flexibility)
- Duration: 3 minutes
- Calories: 6
- Accuracy: 92%

**Output**:
- Meal Type: Breakfast
- Primary: Chiura (चिउरा) - Light, pre-yoga friendly
- Message: "Your flexibility work benefits from anti-inflammatory foods"
- Alternatives: Poha, Upma

### Scenario 2: Evening Strength Session
**Input**:
- Time: 6:00 PM
- Pose: Plank Pose (Core/Strength)
- Duration: 4 minutes
- Calories: 8
- Accuracy: 88%

**Output**:
- Meal Type: Dinner
- Primary: Grilled Paneer Salad - High protein (20g)
- Message: "Your strength-focused session needs high protein for muscle recovery"
- Alternatives: Palak Paneer, Egg Curry

### Scenario 3: Afternoon Balance Session
**Input**:
- Time: 2:00 PM
- Pose: Warrior II (Legs/Balance)
- Duration: 5 minutes
- Calories: 8
- Accuracy: 95%

**Output**:
- Meal Type: Lunch
- Primary: Dal Bhat Tarkari - Complete meal (450 cal, 18g protein)
- Message: "Excellent 95% accuracy! 🎯"
- Alternatives: Momo, Thukpa

## 🎨 UI Features

### Meal Card Design:
- **Gradient background**: Slate-900 to Slate-800
- **Session stats**: 3 cards showing calories, duration, accuracy
- **Recovery needs**: 4 cards showing calories, protein, carbs, water
- **Primary meal**: Large image, nutrition breakdown, benefits
- **Alternative options**: 2-3 other meals to choose from
- **Action buttons**: 
  - "View Full Diet Plan" (navigates to /diet-plan)
  - "Maybe Later" (closes modal)

### Visual Elements:
- ✅ Checkmark icon for completion
- 🔥 Flame icon for calories
- ⏱️ Clock icon for duration
- 🎯 Target icon for accuracy
- ⭐ Award icon for perfect meal
- ✨ Sparkles for recovery needs

## 🔧 Configuration

### Python Flask Port
Default: `5002`
Change in: `backend/Diet_Recommendation_System/app.py`
```python
app.run(debug=True, port=5002)
```

### Frontend API URL
Default: `http://localhost:5002`
Change in: `frontend/src/components/diet-plan/PostYogaMealCard.jsx`
```javascript
const response = await fetch('http://localhost:5002/recommend-post-yoga', {
```

### Meal Card Timing
Default: Shows 2 seconds after pose completion
Change in: `frontend/src/components/pose-detection/PoseCamera.jsx`
```javascript
setTimeout(() => {
  setShowMealCard(true);
}, 2000); // Change this value (milliseconds)
```

## 🐛 Troubleshooting

### Issue: Meal card doesn't appear
**Solution**:
1. Check Python Flask is running on port 5002
2. Check browser console for errors
3. Verify `showMealCard` state is true
4. Check `mealCardSessionData` is not null

### Issue: Images don't load
**Solution**:
1. Check internet connection (images from Unsplash)
2. Check CSV files have valid `Link` column
3. Fallback to placeholder if image fails:
```javascript
onError={(e) => {
  e.target.src = `https://source.unsplash.com/400x300/?${foodName}`;
}}
```

### Issue: Wrong meal type (breakfast instead of dinner)
**Solution**:
1. Check `getTimeOfDay()` function logic
2. Verify time ranges:
   - Morning: 5 AM - 12 PM
   - Afternoon: 12 PM - 5 PM
   - Evening: 5 PM - 5 AM

### Issue: Python Flask not responding
**Solution**:
1. Check if port 5002 is already in use
2. Restart Python Flask server
3. Check CSV files exist in `Data_sets/` folder
4. Verify pandas and sklearn are installed:
```bash
pip install pandas scikit-learn flask flask-cors
```

## 📝 Future Enhancements

### Phase 2: Enhanced Features
- [ ] Save meal preferences to user profile
- [ ] Track meal consumption history
- [ ] Show calorie balance (burned vs consumed)
- [ ] Add meal rating system
- [ ] Show recipe instructions
- [ ] Add shopping list generation

### Phase 3: Social Features
- [ ] Share meals in community
- [ ] See what other users ate after similar sessions
- [ ] Meal challenges and achievements
- [ ] Nutrition coach chatbot

### Phase 4: Advanced Personalization
- [ ] Consider user's dietary restrictions (vegan, gluten-free)
- [ ] Factor in user's weight loss/gain goals
- [ ] Adjust portions based on user's BMI
- [ ] Seasonal food recommendations
- [ ] Local restaurant suggestions

## 🎉 Success Metrics

### User Engagement:
- **Meal card view rate**: % of users who see meal card after session
- **Click-through rate**: % who click "View Full Diet Plan"
- **Meal selection rate**: % who choose a recommended meal
- **Return rate**: % who come back for more sessions

### Health Impact:
- **Nutrition awareness**: Users learn about post-yoga recovery
- **Calorie balance**: Users understand energy expenditure
- **Local food promotion**: Users discover Nepali/Indian foods
- **Healthy habits**: Users connect exercise with nutrition

## 📚 Resources

### Documentation:
- Python Flask: https://flask.palletsprojects.com/
- Pandas: https://pandas.pydata.org/
- Scikit-learn KMeans: https://scikit-learn.org/stable/modules/clustering.html
- Unsplash API: https://unsplash.com/developers

### CSV Data Sources:
- USDA FoodData Central: https://fdc.nal.usda.gov/
- Indian Food Composition Tables: https://www.ifct2017.com/
- Nepali Food Database: Custom curated

---

**Status**: ✅ Integration Complete - Ready for Testing
**Date**: February 10, 2026
**Version**: 1.0.0

