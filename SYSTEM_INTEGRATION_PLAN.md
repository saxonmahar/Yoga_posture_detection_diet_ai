# Diet System Integration Plan

## Current Situation

You have **TWO separate diet systems**:

### System A: Python Flask (Existing)
- **Location**: `backend/Diet_Recommendation_System/app.py`
- **Port**: 5002
- **Data**: CSV files (`breakfast_data.csv`, `lunch_data.csv`, `dinner_data.csv`)
- **Foods**: Generic international foods (Avocados, Corn Flakes, Berries, American Cheese)
- **Images**: URLs from internet (Bing, CloudFront, etc.)
- **Algorithm**: KMeans clustering for diversity
- **Pros**: ML-based, working, has images
- **Cons**: Not connected to yoga, generic foods, no Nepali foods

### System B: Node.js (New - What I Created)
- **Location**: `backend/services/yogaDietService.js`
- **Data**: JSON file (`backend/data/nepali-foods.json`)
- **Foods**: Nepali/Indian foods (Dal Bhat, Momo, Chiura, Thukpa)
- **Images**: Local paths (need your photos)
- **Algorithm**: Smart matching based on yoga session analysis
- **Pros**: Connected to yoga, local foods, contextual
- **Cons**: Needs local images, not using ML clustering

## The Problem

1. **Duplication**: Two systems doing similar things
2. **Disconnected**: Python system doesn't know about yoga sessions
3. **Generic vs Local**: Python has generic foods, new system has Nepali foods
4. **Images**: Python uses URLs, new system expects local files

## The Solution: **Hybrid Approach**

### Option 1: Keep Both, Use Strategically ✅ RECOMMENDED

**Use Python Flask for**:
- General diet recommendations (when user first visits diet page)
- Variety and ML-based clustering
- Existing functionality

**Use Node.js Yoga-Diet for**:
- Post-yoga recovery meals (contextual)
- Pre-yoga light meals
- Nepali food recommendations
- Yoga-connected features

**How they work together**:
```
User Journey:

1. User visits /diet-plan
   → Calls Python Flask (port 5002)
   → Gets ML-based recommendations
   → Shows generic foods with images

2. User completes yoga session
   → Calls Node.js endpoint (port 5001)
   → Gets yoga-specific Nepali foods
   → Shows post-yoga meal card

3. User wants Nepali foods
   → Calls Node.js /api/diet/nepali-foods
   → Gets local food options
   → Can filter by goal/category
```

### Option 2: Merge Everything into Python

**Add to Python Flask**:
- Nepali foods CSV
- Yoga session analysis
- Post-yoga endpoint
- Pre-yoga endpoint

**Pros**: Single system, consistent
**Cons**: More work, need to rewrite logic in Python

### Option 3: Merge Everything into Node.js

**Add to Node.js**:
- KMeans clustering algorithm
- All CSV data
- ML-based recommendations

**Pros**: Single system, all in JavaScript
**Cons**: Lose existing ML work, complex migration

## Recommended Implementation: **Option 1 (Hybrid)**

### Step 1: Add Nepali Foods to Python CSV

Create `backend/Diet_Recommendation_System/Data_sets/nepali_breakfast.csv`:
```csv
Food_items,Calories,Fats,Proteins,Carbohydrates,Fibre,Link
Dal Bhat,350,5,12,65,8,https://example.com/dal-bhat.jpg
Chiura,280,3,8,55,5,https://example.com/chiura.jpg
Sel Roti,320,6,10,58,4,https://example.com/sel-roti.jpg
```

### Step 2: Update Python Flask to Accept Yoga Context

Add new endpoint in `app.py`:
```python
@app.route('/recommend-post-yoga', methods=['POST'])
def recommend_post_yoga():
    data = request.json
    calories_burned = data.get('caloriesBurned', 0)
    pose_types = data.get('poseTypes', [])
    
    # Adjust recommendations based on yoga session
    # Use existing KMeans but filter for high protein if strength poses
    # Filter for anti-inflammatory if flexibility poses
    
    return jsonify(recommendations)
```

### Step 3: Keep Node.js for Quick Nepali Food Access

Use Node.js service for:
- Fast Nepali food queries
- Search functionality
- Goal-based filtering
- Pre-yoga suggestions

### Step 4: Update Frontend to Use Both

```javascript
// For general diet plan
const generalDiet = await fetch('http://localhost:5002/recommend', {
  method: 'POST',
  body: JSON.stringify(userData)
});

// For post-yoga meals
const postYogaMeals = await fetch('http://localhost:5001/api/diet/post-yoga-meals', {
  method: 'POST',
  body: JSON.stringify(sessionData)
});

// For Nepali foods
const nepaliFoods = await fetch('http://localhost:5001/api/diet/nepali-foods');
```

## Quick Fix for Images

### For Nepali Foods JSON

Instead of local paths, use image URLs:

```json
{
  "name": "Dal Bhat",
  "image": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
  ...
}
```

Or use your own hosted images:
```json
{
  "name": "Dal Bhat",
  "image": "https://yourdomain.com/images/dal-bhat.jpg",
  ...
}
```

Or keep local but make them work:
```json
{
  "name": "Dal Bhat",
  "image": "/images/food/breakfast/dal-bhat.jpg",
  ...
}
```

## What to Do Right Now

### Immediate Action:

1. **Keep using your Python Flask system** for the main diet page
2. **Add Nepali foods** to your CSV files
3. **Use the new Node.js system** only for post-yoga meal recommendations
4. **Update image URLs** in nepali-foods.json to use online images (like your CSV does)

### Code to Update:

I'll update the `nepali-foods.json` to use image URLs instead of local paths, matching your existing CSV approach.

---

**Bottom Line**: You don't need to replace your existing system. The new system **adds** yoga-specific features on top of what you already have. Both can coexist and serve different purposes!
