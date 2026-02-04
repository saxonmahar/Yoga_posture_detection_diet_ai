// Test script to show exactly what data gets stored when completing a session
require('dotenv').config();
const mongoose = require('mongoose');
const Schedule = require('./models/schedule');
const User = require('./models/user');

const connectDB = require('./DbConfig/db.config');

async function testSessionCompletion() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Find test user
    const testUser = await User.findOne({ email: 'sanjaymahar2058@gmail.com' });
    if (!testUser) {
      console.log('Test user not found. Please register first.');
      process.exit(1);
    }

    console.log('Test user found:', testUser.email);

    // Create a test session for today
    const today = new Date();
    const testSession = new Schedule({
      user: testUser._id,
      title: 'Wednesday Morning Yoga',
      date: today,
      time: '07:00',
      duration: 30,
      poses: ['warrior2', 'tree', 'downdog'],
      difficulty: 'intermediate',
      status: 'scheduled',
      notes: 'Test session for completion'
    });

    await testSession.save();
    console.log('\n📅 Created test session:');
    console.log('- ID:', testSession._id);
    console.log('- Title:', testSession.title);
    console.log('- Status:', testSession.status);
    console.log('- Date:', testSession.date.toDateString());
    console.log('- Time:', testSession.time);
    console.log('- Poses:', testSession.poses);
    console.log('- CompletedAt:', testSession.completedAt);
    console.log('- Accuracy:', testSession.accuracy);
    console.log('- SessionData:', testSession.sessionData);

    // Now complete the session with real data
    const completionData = {
      accuracy: 87.5,
      sessionData: {
        totalPoses: 3,
        averageAccuracy: 87.5,
        duration: 28, // Actual duration completed
        poseAccuracies: {
          warrior2: 92,
          tree: 85,
          downdog: 86
        },
        completedPoses: ['warrior2', 'tree', 'downdog'],
        totalTime: 28 * 60, // in seconds
        caloriesBurned: 120,
        heartRateAvg: 85
      }
    };

    console.log('\n🔄 Completing session with data:');
    console.log('- Accuracy:', completionData.accuracy);
    console.log('- Session Data:', JSON.stringify(completionData.sessionData, null, 2));

    // Mark as completed
    await testSession.markCompleted(completionData);

    console.log('\n✅ Session completed! Updated fields:');
    console.log('- Status:', testSession.status);
    console.log('- CompletedAt:', testSession.completedAt);
    console.log('- Accuracy:', testSession.accuracy);
    console.log('- SessionData:', JSON.stringify(testSession.sessionData, null, 2));

    // Show the complete document as stored in database
    const savedSession = await Schedule.findById(testSession._id);
    console.log('\n💾 Complete document in database:');
    console.log(JSON.stringify(savedSession, null, 2));

    // Test the statistics calculation
    const todaySessions = await Schedule.getTodaySessions(testUser._id);
    const completedToday = todaySessions.filter(s => s.status === 'completed');
    
    console.log('\n📊 Statistics after completion:');
    console.log('- Today sessions:', todaySessions.length);
    console.log('- Completed today:', completedToday.length);
    console.log('- Completion rate today:', completedToday.length / todaySessions.length * 100 + '%');

    // Clean up test data
    await Schedule.findByIdAndDelete(testSession._id);
    console.log('\n🧹 Test session cleaned up');

    console.log('\n✅ Session completion test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

testSessionCompletion();