const axios = require('axios');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  }

  // System prompt for yoga assistant
  getSystemPrompt(userContext = {}) {
    return `You are YogaAI Assistant, a friendly and knowledgeable yoga and wellness coach. 

Your expertise includes:
- Yoga poses, techniques, and benefits
- Nutrition and diet advice for yoga practitioners
- Breathing techniques and meditation
- Progress tracking and motivation
- Wellness and mindfulness guidance

User Context:
${userContext.name ? `- Name: ${userContext.name}` : ''}
${userContext.currentPage ? `- Current Page: ${userContext.currentPage}` : ''}
${userContext.totalSessions ? `- Total Sessions: ${userContext.totalSessions}` : ''}
${userContext.isPremium ? '- Premium User' : '- Free User'}

Guidelines:
- Be warm, encouraging, and supportive
- Keep responses concise (2-3 paragraphs max)
- Use emojis sparingly for friendliness
- Provide actionable advice
- If asked about medical issues, suggest consulting a healthcare professional
- Focus on yoga, nutrition, and wellness topics
- If user asks about platform features, explain them clearly

Current conversation context: The user is seeking guidance about yoga and wellness.`;
  }

  // Generate context-aware prompt based on current page
  getContextPrompt(page) {
    const contexts = {
      '/pose-detection': 'The user is on the pose detection page. Help them with pose techniques, alignment tips, and common mistakes.',
      '/diet-plan': 'The user is viewing their diet plan. Provide nutrition advice, meal suggestions, and dietary tips for yoga practitioners.',
      '/progress': 'The user is checking their progress. Offer motivational insights, celebrate achievements, and suggest improvements.',
      '/dashboard': 'The user is on their dashboard. Provide general wellness tips and answer any yoga-related questions.',
      '/schedule': 'The user is planning their practice schedule. Help them create an effective routine and suggest optimal practice times.',
    };
    return contexts[page] || '';
  }

  async chat(message, userContext = {}, conversationHistory = []) {
    try {
      if (!this.apiKey) {
        throw new Error('Gemini API key not configured');
      }

      // Build conversation context
      const systemPrompt = this.getSystemPrompt(userContext);
      const contextPrompt = this.getContextPrompt(userContext.currentPage);

      // Format conversation history for Gemini
      const contents = [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'Hello! I\'m your YogaAI Assistant. I\'m here to help you with yoga poses, nutrition, and wellness guidance. How can I assist you today?' }]
        }
      ];

      // Add conversation history (last 5 messages for context)
      const recentHistory = conversationHistory.slice(-5);
      recentHistory.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });

      // Add context prompt if available
      if (contextPrompt) {
        contents.push({
          role: 'user',
          parts: [{ text: `Context: ${contextPrompt}` }]
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'I understand the context. How can I help?' }]
        });
      }

      // Add current user message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      // Call Gemini API
      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        {
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 500,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      // Extract response text
      const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponse) {
        throw new Error('No response from Gemini API');
      }

      return {
        success: true,
        message: aiResponse,
        tokensUsed: response.data?.usageMetadata?.totalTokenCount || 0
      };

    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      
      // Return fallback response
      return {
        success: false,
        message: this.getFallbackResponse(message),
        error: error.message
      };
    }
  }

  // Fallback responses when API fails
  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('pose') || lowerMessage.includes('asana')) {
      return 'I\'m here to help with yoga poses! While I\'m experiencing a temporary connection issue, I recommend checking our pose library for detailed instructions. Each pose includes proper alignment tips and benefits. Would you like to know about a specific pose?';
    }
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('food')) {
      return 'Nutrition is key to your yoga practice! While I\'m reconnecting, remember that a balanced diet with plenty of fruits, vegetables, and whole grains supports your practice. Check your personalized diet plan for specific recommendations based on your goals.';
    }
    
    if (lowerMessage.includes('progress') || lowerMessage.includes('improve')) {
      return 'Great question about progress! Consistency is key in yoga. Practice regularly, focus on proper form over speed, and celebrate small improvements. Your progress dashboard shows your journey - keep up the great work!';
    }
    
    return 'I\'m your YogaAI Assistant, but I\'m experiencing a temporary connection issue. I\'m here to help with yoga poses, nutrition advice, and wellness guidance. Please try again in a moment, or explore our comprehensive guides in the meantime!';
  }

  // Quick responses for common questions (no API call needed)
  getQuickResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    const quickResponses = {
      'hello': 'Hello! 👋 I\'m your YogaAI Assistant. I can help you with yoga poses, nutrition advice, and wellness guidance. What would you like to know?',
      'hi': 'Hi there! 😊 How can I assist you with your yoga practice today?',
      'help': 'I can help you with:\n\n🧘 Yoga poses and techniques\n🥗 Nutrition and diet advice\n📊 Progress tracking tips\n🧘‍♀️ Breathing and meditation\n💪 Wellness guidance\n\nWhat would you like to explore?',
      'thanks': 'You\'re welcome! 🙏 Keep up the great practice! Feel free to ask me anything else.',
      'thank you': 'My pleasure! 😊 I\'m here whenever you need guidance. Namaste! 🙏',
    };

    for (const [key, response] of Object.entries(quickResponses)) {
      if (lowerMessage === key || lowerMessage.includes(key)) {
        return response;
      }
    }

    return null;
  }
}

module.exports = new GeminiService();
