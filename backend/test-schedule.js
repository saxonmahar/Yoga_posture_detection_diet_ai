// Test script to verify schedule system functionality
require('dotenv').config();
const mongoose = require('mongoose');
const Schedule = require('./models/schedule');
const User = require('./models/user');

const connectDB = require('./DbConfig/db.config');

async function testScheduleSystem() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Find a test user (or create one)
    let testUser = await User.findOne({ email: 'sanjaymahar2058@gmail.com' });
    if (!testUser) {
      console.log('Test user not found. Please register first.');
      process.exit(1);
    }

    console.log('Test user found:', testUser.email);

    // Create a test session for today
    const today = new Date();
    const todaySession = new Schedule({
      user: testUser._id,
      title: 'Morning Yoga - Test Session',
      date: today,
      time: '07:00',
      duration: 30,
      poses: ['warrior2', 'tree', 'downdog'],
      difficulty: 'beginner',
      status: 'scheduled'
    });

    await todaySession.save();
    console.log('Created today session:', todaySession.title);

    // Create a test session for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowSession = new Schedule({
      user: testUser._id,
      title: 'Evening Yoga - Test Session',
      date: tomorrow,
      time: '18:00',
      duration: 45,
      poses: ['goddess', 'plank', 'tpose'],
      difficulty: 'intermediate',
      status: 'scheduled'
    });

    await tomorrowSession.save();
    console.log('Created tomorrow session:', tomorrowSession.title);

    // Test the static methods
    console.log('\n--- Testing Static Methods ---');
    
    const todaySessions = await Schedule.getTodaySessions(testUser._id);
    console.log('Today sessions count:', todaySessions.length);
    todaySessions.forEach(session => {
      console.log(`- ${session.title} at ${session.time}`);
    });

    const upcomingSessions = await Schedule.getUpcomingSessions(testUser._id, 5);
    console.log('Upcoming sessions count:', upcomingSessions.length);
    upcomingSessions.forEach(session => {
      console.log(`- ${session.title} on ${session.date.toDateString()} at ${session.time}`);
    });

    // Test date range query
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const monthSessions = await Schedule.getUserSchedule(testUser._id, startOfMonth, endOfMonth);
    console.log('Month sessions count:', monthSessions.length);

    console.log('\n✅ Schedule system test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

testScheduleSystem();