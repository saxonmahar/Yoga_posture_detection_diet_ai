const Schedule = require('../models/schedule');
const YogaSession = require('../models/yogaSession');

// Helper function to calculate user's current streak
const calculateUserStreak = async (userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    // Go backwards day by day to calculate streak
    while (true) {
      const nextDay = new Date(checkDate);
      nextDay.setDate(checkDate.getDate() + 1);
      
      // Check both schedule sessions and yoga sessions
      const scheduleSession = await Schedule.findOne({
        user: userId,
        date: {
          $gte: checkDate,
          $lt: nextDay
        },
        status: 'completed'
      });

      const yogaSession = await YogaSession.findOne({
        user_id: userId,
        session_date: {
          $gte: checkDate,
          $lt: nextDay
        }
      });
      
      if (scheduleSession || yogaSession) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
      
      // Prevent infinite loop - max 365 days
      if (currentStreak >= 365) break;
    }
    
    return currentStreak;
  } catch (error) {
    console.error('Calculate streak error:', error);
    return 0;
  }
};

// Get user's schedule for a specific month/date range
const getSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, view = 'month' } = req.query;

    let start, end;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      // Default to current month
      const now = new Date();
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Set proper time boundaries
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const schedule = await Schedule.getUserSchedule(userId, start, end);

    // Get today's sessions with proper date filtering
    const todaySessions = await Schedule.getTodaySessions(userId);
    
    // Get upcoming sessions (excluding today)
    const upcomingSessions = await Schedule.getUpcomingSessions(userId, 5);

    // Calculate completion rate including both scheduled sessions and yoga sessions
    const scheduledSessions = schedule.length;
    const completedScheduledSessions = schedule.filter(s => s.status === 'completed').length;
    
    // Get yoga sessions (from pose detection) for the same period
    const yogaSessions = await YogaSession.find({
      user_id: userId,
      session_date: {
        $gte: start,
        $lte: end
      }
    });

    // Combined statistics
    const totalSessions = scheduledSessions + yogaSessions.length;
    const completedSessions = completedScheduledSessions + yogaSessions.length; // All yoga sessions are considered completed
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    // Calculate current streak
    const currentStreak = await calculateUserStreak(userId);

    console.log('Schedule data:', {
      scheduledSessions,
      completedScheduledSessions,
      yogaSessions: yogaSessions.length,
      totalSessions,
      completedSessions,
      userId
    });

    res.json({
      success: true,
      data: {
        schedule,
        todaySessions,
        upcomingSessions,
        stats: {
          totalSessions,
          completedSessions,
          completionRate: Math.round(completionRate),
          currentStreak,
          // Additional breakdown
          scheduledSessions,
          yogaSessions: yogaSessions.length,
          completedScheduledSessions
        },
        period: {
          startDate: start,
          endDate: end,
          view
        }
      }
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedule',
      error: error.message
    });
  }
};

// Create a new scheduled session
const createSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      date,
      time,
      duration,
      poses,
      difficulty,
      recurring,
      reminders,
      notes
    } = req.body;

    // Validate required fields
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Date and time are required'
      });
    }

    // Check for scheduling conflicts
    const existingSession = await Schedule.findOne({
      user: userId,
      date: new Date(date),
      time: time,
      status: { $in: ['scheduled', 'completed'] }
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: 'You already have a session scheduled at this time'
      });
    }

    const sessionData = {
      user: userId,
      title: title || 'Yoga Session',
      date: new Date(date),
      time,
      duration: duration || 30,
      poses: poses || [],
      difficulty: difficulty || 'beginner',
      recurring: recurring || { enabled: false },
      reminders: reminders || { enabled: true, minutes: [30, 15, 5] },
      notes: notes || ''
    };

    let sessions = [];

    // Handle recurring sessions
    if (recurring && recurring.enabled) {
      sessions = await createRecurringSessions(sessionData, recurring);
    } else {
      const session = new Schedule(sessionData);
      await session.save();
      sessions = [session];
    }

    res.status(201).json({
      success: true,
      message: `Successfully scheduled ${sessions.length} session(s)`,
      data: sessions
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session',
      error: error.message
    });
  }
};

// Helper function to create recurring sessions
const createRecurringSessions = async (sessionData, recurring) => {
  const sessions = [];
  const startDate = new Date(sessionData.date);
  const endDate = recurring.endDate ? new Date(recurring.endDate) : new Date(startDate.getTime() + (90 * 24 * 60 * 60 * 1000)); // Default 90 days

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Check if this date matches the recurring pattern
    let shouldCreate = false;

    switch (recurring.pattern) {
      case 'daily':
        shouldCreate = true;
        break;
      case 'weekly':
        if (recurring.daysOfWeek && recurring.daysOfWeek.includes(currentDate.getDay())) {
          shouldCreate = true;
        }
        break;
      case 'monthly':
        if (currentDate.getDate() === startDate.getDate()) {
          shouldCreate = true;
        }
        break;
    }

    if (shouldCreate) {
      // Check for conflicts
      const existingSession = await Schedule.findOne({
        user: sessionData.user,
        date: currentDate,
        time: sessionData.time,
        status: { $in: ['scheduled', 'completed'] }
      });

      if (!existingSession) {
        const session = new Schedule({
          ...sessionData,
          date: new Date(currentDate)
        });
        await session.save();
        sessions.push(session);
      }
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return sessions;
};

// Update a scheduled session
const updateSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    const updates = req.body;

    const session = await Schedule.findOne({
      _id: sessionId,
      user: userId
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Don't allow updating completed sessions
    if (session.status === 'completed' && updates.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify completed sessions'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'date', 'time', 'duration', 'poses', 'difficulty', 'notes', 'status'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        session[field] = updates[field];
      }
    });

    await session.save();

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update session',
      error: error.message
    });
  }
};

// Mark session as completed
const completeSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    const { accuracy, sessionData } = req.body;

    const session = await Schedule.findOne({
      _id: sessionId,
      user: userId
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Session already completed'
      });
    }

    await session.markCompleted({ accuracy, sessionData });

    res.json({
      success: true,
      message: 'Session marked as completed',
      data: session
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete session',
      error: error.message
    });
  }
};

// Delete a scheduled session
const deleteSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    const session = await Schedule.findOneAndDelete({
      _id: sessionId,
      user: userId
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete session',
      error: error.message
    });
  }
};

// Get schedule templates/suggestions
const getScheduleTemplates = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const templates = [
      {
        id: 'beginner-3day',
        name: 'Beginner 3-Day Program',
        description: 'Perfect for starting your yoga journey',
        sessions: 3,
        duration: 20,
        difficulty: 'beginner',
        schedule: [
          { day: 1, time: '07:00', poses: ['tpose', 'tree'] }, // Monday
          { day: 3, time: '07:00', poses: ['warrior2', 'goddess'] }, // Wednesday
          { day: 5, time: '07:00', poses: ['downdog', 'plank'] } // Friday
        ]
      },
      {
        id: 'intermediate-4day',
        name: 'Intermediate 4-Day Program',
        description: 'Build strength and flexibility',
        sessions: 4,
        duration: 35,
        difficulty: 'intermediate',
        schedule: [
          { day: 1, time: '06:30', poses: ['warrior2', 'tree', 'downdog'] },
          { day: 2, time: '18:00', poses: ['tpose', 'goddess', 'plank'] },
          { day: 4, time: '06:30', poses: ['tree', 'downdog', 'warrior2'] },
          { day: 6, time: '09:00', poses: ['goddess', 'plank', 'tpose'] }
        ]
      },
      {
        id: 'advanced-daily',
        name: 'Advanced Daily Practice',
        description: 'Comprehensive daily yoga routine',
        sessions: 7,
        duration: 45,
        difficulty: 'advanced',
        schedule: [
          { day: 0, time: '06:00', poses: ['warrior2', 'tree', 'downdog', 'plank'] },
          { day: 1, time: '06:00', poses: ['tpose', 'goddess', 'tree', 'downdog'] },
          { day: 2, time: '06:00', poses: ['warrior2', 'plank', 'goddess', 'tree'] },
          { day: 3, time: '06:00', poses: ['downdog', 'tpose', 'warrior2', 'plank'] },
          { day: 4, time: '06:00', poses: ['tree', 'goddess', 'downdog', 'tpose'] },
          { day: 5, time: '06:00', poses: ['plank', 'warrior2', 'tree', 'goddess'] },
          { day: 6, time: '09:00', poses: ['goddess', 'downdog', 'tpose', 'warrior2'] }
        ]
      },
      {
        id: 'stress-relief',
        name: 'Stress Relief Program',
        description: 'Evening sessions for relaxation',
        sessions: 5,
        duration: 25,
        difficulty: 'beginner',
        schedule: [
          { day: 1, time: '19:00', poses: ['tree', 'goddess'] },
          { day: 2, time: '19:00', poses: ['tpose', 'tree'] },
          { day: 3, time: '19:00', poses: ['goddess', 'downdog'] },
          { day: 4, time: '19:00', poses: ['tree', 'tpose'] },
          { day: 5, time: '19:00', poses: ['goddess', 'tree'] }
        ]
      }
    ];

    // Filter templates based on user's level
    const userLevel = 'beginner'; // Default level
    const recommendedTemplates = templates.filter(template => 
      template.difficulty === userLevel || template.id === 'stress-relief'
    );

    res.json({
      success: true,
      data: {
        templates,
        recommended: recommendedTemplates,
        userLevel
      }
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedule templates',
      error: error.message
    });
  }
};

// Apply a schedule template
const applyTemplate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { templateId, startDate, customTime } = req.body;

    // Get the template (same templates as in getScheduleTemplates)
    const templates = [
      {
        id: 'beginner-3day',
        name: 'Beginner 3-Day Program',
        description: 'Perfect for starting your yoga journey',
        sessions: 3,
        duration: 20,
        difficulty: 'beginner',
        schedule: [
          { day: 1, time: '07:00', poses: ['tpose', 'tree'] }, // Monday
          { day: 3, time: '07:00', poses: ['warrior2', 'goddess'] }, // Wednesday
          { day: 5, time: '07:00', poses: ['downdog', 'plank'] } // Friday
        ]
      },
      {
        id: 'intermediate-4day',
        name: 'Intermediate 4-Day Program',
        description: 'Build strength and flexibility',
        sessions: 4,
        duration: 35,
        difficulty: 'intermediate',
        schedule: [
          { day: 1, time: '06:30', poses: ['warrior2', 'tree', 'downdog'] },
          { day: 2, time: '18:00', poses: ['tpose', 'goddess', 'plank'] },
          { day: 4, time: '06:30', poses: ['tree', 'downdog', 'warrior2'] },
          { day: 6, time: '09:00', poses: ['goddess', 'plank', 'tpose'] }
        ]
      },
      {
        id: 'advanced-daily',
        name: 'Advanced Daily Practice',
        description: 'Comprehensive daily yoga routine',
        sessions: 7,
        duration: 45,
        difficulty: 'advanced',
        schedule: [
          { day: 0, time: '06:00', poses: ['warrior2', 'tree', 'downdog', 'plank'] },
          { day: 1, time: '06:00', poses: ['tpose', 'goddess', 'tree', 'downdog'] },
          { day: 2, time: '06:00', poses: ['warrior2', 'plank', 'goddess', 'tree'] },
          { day: 3, time: '06:00', poses: ['downdog', 'tpose', 'warrior2', 'plank'] },
          { day: 4, time: '06:00', poses: ['tree', 'goddess', 'downdog', 'tpose'] },
          { day: 5, time: '06:00', poses: ['plank', 'warrior2', 'tree', 'goddess'] },
          { day: 6, time: '09:00', poses: ['goddess', 'downdog', 'tpose', 'warrior2'] }
        ]
      },
      {
        id: 'stress-relief',
        name: 'Stress Relief Program',
        description: 'Evening sessions for relaxation',
        sessions: 5,
        duration: 25,
        difficulty: 'beginner',
        schedule: [
          { day: 1, time: '19:00', poses: ['tree', 'goddess'] },
          { day: 2, time: '19:00', poses: ['tpose', 'tree'] },
          { day: 3, time: '19:00', poses: ['goddess', 'downdog'] },
          { day: 4, time: '19:00', poses: ['tree', 'tpose'] },
          { day: 5, time: '19:00', poses: ['goddess', 'tree'] }
        ]
      }
    ];

    const template = templates.find(t => t.id === templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    const sessions = [];
    const start = new Date(startDate);

    // Create sessions for the next 4 weeks
    for (let week = 0; week < 4; week++) {
      for (const scheduleItem of template.schedule) {
        const sessionDate = new Date(start);
        sessionDate.setDate(start.getDate() + (week * 7) + scheduleItem.day);

        const sessionData = {
          user: userId,
          title: `${template.name} - Session`,
          date: sessionDate,
          time: customTime || scheduleItem.time,
          duration: template.duration,
          poses: scheduleItem.poses,
          difficulty: template.difficulty,
          notes: `Auto-generated from ${template.name} template`
        };

        // Check for conflicts
        const existingSession = await Schedule.findOne({
          user: userId,
          date: sessionDate,
          time: sessionData.time,
          status: { $in: ['scheduled', 'completed'] }
        });

        if (!existingSession) {
          const session = new Schedule(sessionData);
          await session.save();
          sessions.push(session);
        }
      }
    }

    res.json({
      success: true,
      message: `Successfully created ${sessions.length} sessions from ${template.name}`,
      data: {
        template,
        sessions: sessions.length,
        startDate: start
      }
    });
  } catch (error) {
    console.error('Apply template error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply template',
      error: error.message
    });
  }
};

module.exports = {
  getSchedule,
  createSession,
  updateSession,
  completeSession,
  deleteSession,
  getScheduleTemplates,
  applyTemplate
};