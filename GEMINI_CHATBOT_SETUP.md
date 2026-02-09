# 🤖 Gemini AI Chatbot - Setup Guide

## ✨ Overview

Your YogaAI project now includes an intelligent AI chatbot powered by Google's Gemini API. The chatbot provides:

- 🧘 Yoga pose guidance and tips
- 🥗 Nutrition and diet advice
- 📊 Progress insights and motivation
- 🧘‍♀️ Breathing and meditation guidance
- 💪 Wellness coaching

## 🎯 Features

### Smart Context Awareness
- Knows which page user is on
- Provides relevant suggestions based on context
- Remembers conversation history
- Personalizes responses based on user stats

### Beautiful UI
- Floating chat widget (bottom-right corner)
- Smooth animations with Framer Motion
- Dark theme matching your app design
- Mobile-responsive design

### User Experience
- Available for all logged-in users
- Chat history saved in database
- Quick responses for common questions
- Typing indicators and loading states
- Clear chat history option

## 🚀 Setup Instructions

### Step 1: Get Gemini API Key (FREE)

1. **Visit Google AI Studio**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Select "Create API key in new project" or choose existing project
   - Copy the generated API key

3. **Free Tier Limits**
   - 60 requests per minute
   - Perfect for development and small-scale production
   - No credit card required!

### Step 2: Configure Backend

1. **Add API Key to .env**
   ```bash
   cd backend
   ```

2. **Edit `.env` file**
   ```env
   # Add this line at the end
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Restart Backend Server**
   ```bash
   # Stop current server (Ctrl+C)
   # Start again
   node index.js
   ```

### Step 3: Test the Chatbot

1. **Login to your app**
   - Go to http://localhost:3002/login
   - Login with any user account

2. **Look for chat button**
   - You'll see a purple floating button in bottom-right corner
   - It has "AI" badge on it

3. **Start chatting!**
   - Click the button to open chat
   - Try asking: "How do I do Warrior II pose?"
   - Or: "What should I eat after yoga?"

## 💡 Usage Examples

### Yoga Pose Help
```
User: "How do I improve my Tree Pose balance?"
AI: "Great question! Here are some tips for better balance in Tree Pose:

1. Focus on a fixed point (drishti) at eye level
2. Engage your core muscles
3. Press your standing foot firmly into the ground
4. Start with your foot on your calf, not knee
5. Use a wall for support while learning

Practice regularly and your balance will improve! 🧘‍♀️"
```

### Nutrition Advice
```
User: "What should I eat before morning yoga?"
AI: "For morning yoga, eat something light 30-60 minutes before:

🍌 Banana with almond butter
🥤 Smoothie with fruits and protein
🍞 Toast with avocado
🥣 Small bowl of oatmeal

Avoid heavy meals that might make you feel sluggish. Stay hydrated! 💧"
```

### Progress Motivation
```
User: "I'm struggling to stay consistent"
AI: "I understand! Consistency is challenging but achievable:

✅ Start small - even 10 minutes daily counts
✅ Set a specific time for practice
✅ Track your progress (you've done 15 sessions!)
✅ Join community challenges for motivation
✅ Celebrate small wins

You're already on the right path by being here! Keep going! 💪"
```

## 🎨 Customization Options

### Change Chat Position
Edit `frontend/src/components/chat/ChatWidget.jsx`:
```jsx
// Change from bottom-right to bottom-left
className="fixed bottom-6 left-6 z-50..."
```

### Adjust Response Length
Edit `backend/services/geminiService.js`:
```javascript
generationConfig: {
  maxOutputTokens: 500, // Change this number
}
```

### Modify System Prompt
Edit `backend/services/geminiService.js` in `getSystemPrompt()` method to change AI personality and expertise.

## 📊 Chat Features

### For Users
- ✅ Unlimited conversations
- ✅ Chat history saved
- ✅ Context-aware responses
- ✅ Quick responses for common questions
- ✅ Clear chat history option

### For Admins
- ✅ View chat statistics
- ✅ Monitor API usage
- ✅ Track user engagement
- ✅ Analyze common questions

## 🔧 API Endpoints

### Send Message
```
POST /api/chat/message
Headers: Authorization: Bearer <token>
Body: {
  "message": "How do I do Tree Pose?",
  "context": {
    "page": "/pose-detection"
  }
}
```

### Get Chat History
```
GET /api/chat/history?limit=50&page=1
Headers: Authorization: Bearer <token>
```

### Clear Chat History
```
DELETE /api/chat/history
Headers: Authorization: Bearer <token>
```

### Get Chat Statistics
```
GET /api/chat/stats
Headers: Authorization: Bearer <token>
```

## 💰 Cost Management

### Free Tier (Recommended for Start)
- **Limit**: 60 requests/minute
- **Cost**: FREE
- **Perfect for**: Development, testing, small user base

### Optimization Tips
1. **Quick Responses**: Common questions answered without API call
2. **Caching**: Frequent questions cached in database
3. **Rate Limiting**: Prevent abuse with user limits
4. **Context Trimming**: Only send last 5 messages for context

### Monitoring Usage
Check your API usage at: https://makersuite.google.com/app/apikey

## 🐛 Troubleshooting

### Chat Button Not Showing
- ✅ Make sure you're logged in
- ✅ Check browser console for errors
- ✅ Verify ChatWidget is imported in App.jsx

### "API Key Not Configured" Error
- ✅ Check GEMINI_API_KEY in backend/.env
- ✅ Restart backend server after adding key
- ✅ Verify API key is valid at Google AI Studio

### Slow Responses
- ✅ Normal response time: 1-3 seconds
- ✅ Check your internet connection
- ✅ Verify API key hasn't hit rate limits

### Chat History Not Loading
- ✅ Check MongoDB connection
- ✅ Verify user is authenticated
- ✅ Check browser console for errors

## 🎓 For Your Academic Project

### Presentation Points
1. **AI Integration**: Demonstrates modern AI capabilities
2. **User Experience**: Enhances user engagement
3. **Technical Skills**: Shows full-stack + AI integration
4. **Innovation**: Unique feature in yoga apps
5. **Scalability**: Ready for production use

### Demo Script
1. Show chat button on dashboard
2. Ask about a yoga pose
3. Get nutrition advice
4. Show chat history feature
5. Demonstrate context awareness
6. Clear chat and start fresh

### Technical Highlights
- Google Gemini Pro API integration
- Real-time chat with WebSocket-like experience
- MongoDB chat history storage
- Context-aware AI responses
- Secure authentication
- Rate limiting and optimization

## 📚 Additional Resources

- **Gemini API Docs**: https://ai.google.dev/docs
- **Google AI Studio**: https://makersuite.google.com
- **API Pricing**: https://ai.google.dev/pricing
- **Best Practices**: https://ai.google.dev/docs/best_practices

## 🎉 Success!

Your YogaAI chatbot is now ready! Users can get instant help with:
- Yoga poses and techniques
- Nutrition and diet planning
- Progress tracking motivation
- Wellness guidance
- Platform navigation

The chatbot makes your project stand out and provides real value to users! 🚀

---

**Need Help?** Check the troubleshooting section or review the code comments in:
- `backend/services/geminiService.js`
- `backend/controllers/chatController.js`
- `frontend/src/components/chat/ChatWidget.jsx`
