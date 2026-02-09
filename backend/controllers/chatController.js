const geminiService = require('../services/geminiService');
const ChatMessage = require('../models/chatMessage');
const User = require('../models/user');

// Send message to AI assistant
exports.sendMessage = async (req, res) => {
  try {
    const { message, context } = req.body;
    const userId = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get user details for context
    const user = await User.findById(userId).select('name isPremium');
    
    // Get user stats
    const YogaSession = require('../models/yogaSession');
    const totalSessions = await YogaSession.countDocuments({ user: userId });

    // Build user context
    const userContext = {
      name: user.name,
      isPremium: user.isPremium || false,
      totalSessions,
      currentPage: context?.page || '/'
    };

    // Check for quick response first (no API call)
    const quickResponse = geminiService.getQuickResponse(message);
    
    let aiResponse;
    if (quickResponse) {
      aiResponse = {
        success: true,
        message: quickResponse,
        tokensUsed: 0
      };
    } else {
      // Get recent conversation history
      const history = await ChatMessage.getRecentHistory(userId, 5);
      const formattedHistory = history.reverse().map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Get AI response
      aiResponse = await geminiService.chat(message, userContext, formattedHistory);
    }

    // Save user message
    await ChatMessage.create({
      user: userId,
      role: 'user',
      content: message,
      context: {
        page: context?.page,
        sessionId: context?.sessionId,
        userStats: {
          totalSessions,
          isPremium: user.isPremium
        }
      }
    });

    // Save assistant response
    await ChatMessage.create({
      user: userId,
      role: 'assistant',
      content: aiResponse.message,
      context: {
        page: context?.page,
        sessionId: context?.sessionId,
        userStats: {
          totalSessions,
          isPremium: user.isPremium
        }
      },
      tokensUsed: aiResponse.tokensUsed || 0
    });

    res.json({
      success: true,
      data: {
        message: aiResponse.message,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: error.message
    });
  }
};

// Guest chat (no authentication required)
exports.sendGuestMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Build guest context
    const guestContext = {
      name: 'Guest',
      isPremium: false,
      totalSessions: 0,
      currentPage: '/'
    };

    // Check for quick response first (no API call)
    const quickResponse = geminiService.getQuickResponse(message);
    
    let aiResponse;
    if (quickResponse) {
      aiResponse = {
        success: true,
        message: quickResponse,
        tokensUsed: 0
      };
    } else {
      // Get AI response (no history for guests)
      aiResponse = await geminiService.chat(message, guestContext, []);
    }

    res.json({
      success: true,
      data: {
        message: aiResponse.message,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Guest Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: error.message
    });
  }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const messages = await ChatMessage.find({ user: userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('role content timestamp context')
      .lean();

    const total = await ChatMessage.countDocuments({ user: userId });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get Chat History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history',
      error: error.message
    });
  }
};

// Clear chat history
exports.clearChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    await ChatMessage.deleteMany({ user: userId });

    res.json({
      success: true,
      message: 'Chat history cleared successfully'
    });

  } catch (error) {
    console.error('Clear Chat History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat history',
      error: error.message
    });
  }
};

// Get chat statistics
exports.getChatStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalMessages = await ChatMessage.countDocuments({ user: userId });
    const userMessages = await ChatMessage.countDocuments({ user: userId, role: 'user' });
    const assistantMessages = await ChatMessage.countDocuments({ user: userId, role: 'assistant' });
    
    const totalTokens = await ChatMessage.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$tokensUsed' } } }
    ]);

    const firstMessage = await ChatMessage.findOne({ user: userId })
      .sort({ timestamp: 1 })
      .select('timestamp')
      .lean();

    const lastMessage = await ChatMessage.findOne({ user: userId })
      .sort({ timestamp: -1 })
      .select('timestamp')
      .lean();

    res.json({
      success: true,
      data: {
        totalMessages,
        userMessages,
        assistantMessages,
        totalTokens: totalTokens[0]?.total || 0,
        firstMessageAt: firstMessage?.timestamp,
        lastMessageAt: lastMessage?.timestamp
      }
    });

  } catch (error) {
    console.error('Get Chat Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat statistics',
      error: error.message
    });
  }
};
