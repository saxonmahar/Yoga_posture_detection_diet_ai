# Diet Recommendation Enhancement Plan
## Connecting Yoga Practice with Personalized Nutrition

---

## Current State Analysis

### What You Have ✅
1. **ML-based diet recommendation system** (Python Flask on port 5002)
2. **KMeans clustering** for diverse meal suggestions
3. **Basic macro tracking** (calories, protein, carbs, fat)
4. **Three meal types** (Breakfast, Lunch, Dinner)
5. **Goal-based recommendations** (weight loss, gain, maintain)
6. **Yoga session tracking** with calories burned and accuracy
7. **User profiles** with age, height, weight, activity level

### What's Missing ❌
1. **No connection** between yoga sessions and diet
2. **Generic food images** (Unsplash random)
3. **No local Nepali/Indian foods**
4. **No meal timing** based on yoga practice
5. **No visual meal logging**
6. **No social features** for food sharing
7. **No meal planning** (only tracking)
8. **No shopping lists**

---

## Enhancement Strategy

### Phase 1: Connect Yoga with Diet (PRIORITY)

#### 1.1 Post-Yoga Recovery Meals
**When**: Right after completing a yoga session

**What to Show**:
```
🧘 Great session! You burned 150 calories in 25 minutes

💪 Recovery Meal Recommendations:
- High protein for muscle recovery
- Complex carbs to restore energy
- Anti-inflammatory foods for joint health

Recommended: Dal with brown rice, Greek yogurt with fruits
```

**Implementation**:
- Detect when user completes yoga session
- Calculate calories burned (already have this)
- Identify poses practiced (flexibility, strength, balance)
- Adjust meal recommendations based on:
  - Calories burned → increase portions
  - Pose types → specific nutrients
  - Time of day → appropriate meal type

#### 1.2 Pre-Yoga Energy Meals
**When**: User schedules a yoga session

**What to Show**:
```
⏰ Yoga session in 2 hours

🍎 Pre-Workout Meal Suggestions:
- Light and easily digestible
- Quick energy release
- Won't cause bloating

Recommended: Banana with peanut butter, Green tea
```

#### 1.3 Goal-Based Integration
**Connect yoga goals with diet goals**:

| Yoga Focus | Diet Adjustment | Example Foods |
|------------|----------------|---------------|
| Flexibility poses (Tree, Warrior) | Anti-inflammatory, joint health | Turmeric milk, walnuts, salmon |
| Strength poses (Plank, Downward Dog) | High protein, muscle building | Paneer, eggs, lentils |
| Balance poses (Tree, Goddess) | Brain health, omega-3 | Almonds, fish, chia seeds |
| Cardio flow (Sun Salutation) | Energy boost, hydration | Coconut water, dates, bananas |

---

### Phase 2: Localization (Nepali/Indian Foods)

#### 2.1 Replace Generic Foods with Local Options

**Current Problem**: Your CSV files probably have generic foods

**Solution**: Create Nepali/Indian food database

**Breakfast Options**:
- Dal-bhat (lentils with rice)
- Sel roti with yogurt
- Chiura (beaten rice) with tea
- Paratha with pickle
- Upma with coconut chutney
- Poha (flattened rice)

**Lunch Options**:
- Dal-bhat-tarkari (complete meal)
- Momo (steamed dumplings)
- Thukpa (noodle soup)
- Rajma-chawal (kidney beans with rice)
- Chole bhature
- Biryani (portion controlled)

**Dinner Options**:
- Light dal with roti
- Khichdi (rice and lentils)
- Vegetable curry with chapati
- Grilled paneer with salad
- Soup with whole wheat bread

**Street Food Alternatives**:
```
Instead of:          Try:
Samosa (400 cal)  →  Baked samosa (200 cal)
Pakora (350 cal)  →  Air-fried pakora (180 cal)
Pani puri         →  Homemade with less oil
Chaat             →  Fruit chaat (no fried)
```

#### 2.2 Budget-Friendly Options
**Add price tags to meals**:
- Under ₹50: Dal-chawal, Chiura
- ₹50-100: Momo, Thukpa
- ₹100-200: Paneer dishes, Fish curry
- ₹200+: Premium options

---

### Phase 3: Visual & Interactive Experience

#### 3.1 Real Food Photos
**Replace Unsplash random images with**:
- Actual photos of Nepali/Indian dishes
- Portion size references (use hand/plate comparisons)
- Step-by-step cooking photos

**Image Sources**:
1. Take photos yourself (most authentic)
2. Use free stock photos from:
   - Pexels (search "Indian food", "Nepali food")
   - Unsplash (specific dish names)
   - Pixabay
3. Partner with local restaurants for photos

#### 3.2 Swipe-to-Log Interface
**Instagram-style meal logging**:
```
[Photo of meal]
❤️ Like    💬 Comment    📊 Log

Swipe right → Log as eaten
Swipe left → Skip
Tap → See nutrition details
```

#### 3.3 Portion Size Visualization
**Show visual guides**:
- Fist = 1 cup of rice
- Palm = 1 serving of protein
- Thumb = 1 tablespoon of oil
- Handful = 1 serving of snacks

---

### Phase 4: Timing & Context

#### 4.1 Meal Timing Based on Yoga Schedule

**Morning Yoga (6-8 AM)**:
```
Pre-yoga (6 AM): Light snack
Post-yoga (8 AM): Full breakfast
Lunch (12 PM): Regular
Dinner (7 PM): Light
```

**Evening Yoga (6-8 PM)**:
```
Breakfast (8 AM): Regular
Lunch (12 PM): Regular
Pre-yoga (5 PM): Light snack
Post-yoga (8 PM): Light dinner
```

#### 4.2 Push Notifications
**Smart timing**:
- "Great morning session! Here's your breakfast" (right after yoga)
- "Yoga in 2 hours - have a light snack now" (before scheduled session)
- "Don't forget to hydrate! 💧" (during the day)
- "Meal prep Sunday! Plan your week" (Sunday morning)

---

### Phase 5: Meal Planning (Not Just Tracking)

#### 5.1 Weekly Meal Prep Guide
**Sunday Planning Feature**:
```
📅 Your Week Ahead

Monday: Dal-bhat, Momo, Khichdi
Tuesday: Paratha, Rajma-chawal, Soup
Wednesday: Upma, Thukpa, Roti-sabzi
...

🛒 Shopping List:
- Rice: 2 kg
- Lentils: 1 kg
- Vegetables: Tomato, Onion, Spinach
- Spices: Turmeric, Cumin
```

#### 5.2 Ingredient-Based Suggestions
**"What can I cook?" feature**:
```
You have: Rice, Lentils, Tomatoes

You can make:
1. Dal-bhat (20 min)
2. Khichdi (25 min)
3. Tomato rice (15 min)
```

#### 5.3 Batch Cooking Tips
**For busy users**:
- Cook dal for 3 days
- Prep vegetables on Sunday
- Freeze portions
- Quick assembly meals

---

### Phase 6: Social Proof & Community

#### 6.1 Community Meal Sharing
**Let users share their meals**:
```
[Photo of user's dal-bhat]
@username: "Post-yoga recovery meal! 💪"
❤️ 24 likes    💬 5 comments

"Looks delicious!"
"Recipe please?"
```

#### 6.2 Success Stories
**Show what works**:
```
Top 5 Meals Among Users Who:
- Improved flexibility by 20%: Turmeric milk, Walnuts
- Lost 5kg: Dal-bhat (controlled portions)
- Gained muscle: Paneer dishes, Eggs
```

#### 6.3 Meal Challenges
**Gamification**:
- "Eat 5 recommended meals this week = 100 points"
- "Try 3 new recipes = Unlock badge"
- "Share your meal = Get featured"

---

### Phase 7: Simplicity First

#### 7.1 Three Simple Choices
**Don't overwhelm users**:
```
Breakfast (Pick 1):
🥣 Option A: Chiura with yogurt (250 cal)
🍳 Option B: Paratha with pickle (300 cal)
☕ Option C: Upma with tea (280 cal)

[Tap to select]
```

#### 7.2 No Calorie Counting Initially
**Progressive disclosure**:
- Week 1: Just pick meals (no numbers)
- Week 2: Show calories (if interested)
- Week 3: Show macros (if advanced)

#### 7.3 Quick Actions
**One-tap features**:
- "I ate this" button
- "Make again" button
- "Too spicy/bland" feedback
- "Substitute ingredient" option

---

## Implementation Priority

### Must Have (Do First) 🔥
1. **Connect yoga session with diet** (post-workout meals)
2. **Add local Nepali/Indian foods** to database
3. **Show real food photos** (even if just 20-30 dishes)
4. **Simple 3-choice meal selection**

### Should Have (Do Next) ⭐
5. **Pre-yoga meal suggestions**
6. **Budget filters** (under ₹100)
7. **Meal timing** based on schedule
8. **Basic meal planning** (weekly view)

### Nice to Have (Do Later) 💡
9. **Social meal sharing**
10. **Push notifications**
11. **Shopping lists**
12. **Recipe videos**

---

## Technical Implementation Notes

### Database Changes Needed
```javascript
// Add to meal schema
{
  foodName: String,
  localName: String,  // "Dal-bhat"
  category: String,   // "Nepali", "Indian", "Continental"
  price: Number,      // In NPR
  imageUrl: String,   // Real photo URL
  prepTime: Number,   // Minutes
  difficulty: String, // "Easy", "Medium", "Hard"
  ingredients: [String],
  recipe: String,
  isVegetarian: Boolean,
  isVegan: Boolean,
  spiceLevel: Number, // 1-5
  bestFor: String,    // "pre-yoga", "post-yoga", "recovery"
  nutrients: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    vitamins: [String]
  }
}
```

### API Endpoints to Add
```
POST /api/diet/post-yoga-meal
- Input: sessionId, caloriesBurned, posesCompleted
- Output: Recommended recovery meals

GET /api/diet/pre-yoga-meal
- Input: scheduledTime, currentTime
- Output: Light meal suggestions

POST /api/diet/log-meal-photo
- Input: photo, mealType, timestamp
- Output: Logged meal with AI recognition (future)

GET /api/diet/weekly-plan
- Input: userId, startDate
- Output: 7-day meal plan with shopping list

GET /api/diet/community-favorites
- Input: goal (flexibility, strength, weight-loss)
- Output: Top meals from similar users
```

### Frontend Components to Create
1. **PostYogaMealCard** - Shows after session completion
2. **MealSwipeCard** - Instagram-style swipeable meals
3. **WeeklyPlanView** - Calendar with meals
4. **ShoppingListView** - Checkable ingredient list
5. **CommunityFeedView** - Social meal sharing
6. **PortionGuideModal** - Visual portion sizes

---

## Success Metrics

### Track These KPIs:
1. **Engagement**: % users who view diet after yoga
2. **Adoption**: % users who log meals
3. **Retention**: Users who return to diet page
4. **Satisfaction**: Meal ratings (1-5 stars)
5. **Health**: Average accuracy improvement + diet adherence

### Target Goals:
- 70% of users view diet after yoga session
- 40% of users log at least 1 meal per day
- 4.0+ average meal rating
- 15% improvement in yoga accuracy for users following diet

---

## Next Steps

1. **Review this plan** - Does it align with your vision?
2. **Prioritize features** - Which ones do you want first?
3. **Gather food data** - Start collecting Nepali/Indian food info
4. **Take food photos** - Or find free stock photos
5. **Update database** - Add new fields to food schema
6. **Implement Phase 1** - Connect yoga with diet

---

**Remember**: Start simple, iterate based on user feedback. Don't build everything at once!
