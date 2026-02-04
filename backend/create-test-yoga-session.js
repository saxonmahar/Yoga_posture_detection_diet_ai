// Create a test yoga session to simulate Wednesday completion
require('dotenv').config();
const mongoose = require('mongoose');
const YogaSession = require('./models/yogaSession');
const User = require('./models/user');

const connectDB = require('./DbConfig/db.config');

async function createTestYogaSession() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Find your user
    const user = await User.findOne({ email: 'sanjaymahar2058@gmail.com' });
    if (!user) {
      console.log('User not found.');
      process.exit(1);
    }

    console.log('👤 User found:', user.email);

    // Create a yoga session for Wednesday (yesterday or a recent day)
    const wednesday = new Date('2026-02-03'); // Adjust this to a recent Wednesday
    
    const yogaSession = new YogaSession({
      user_id: user._id,
      session_date: wednesday,
      total_duration: 25, // 25 minutes
      poses_practiced: [
        {
          pose_id: 'yog1',
          pose_name: 'Warrior II',
          accuracy_score: 88,
          attempts_count: 3,
          hold_duration: 30,
          completed_successfully: true,
          feedback_given: ['Great posture!', 'Keep your arms parallel'],
          timestamp: new Date(wednesday.getTime() + 5 * 60 * 1000) // 5 minutes into session
        },
        {
          pose_id: 'yog2', 
          pose_name: 'Tree Pose',
          accuracy_score: 92,
          attempts_count: 2,
          hold_duration: 45,
          completed_successfully: true,
          feedback_given: ['Excellent balance!'],
          timestamp: new Date(wednesday.getTime() + 12 * 60 * 1000) // 12 minutes into session
        },
        {
          pose_id: 'yog3',
          pose_name: 'Downward Dog',
          accuracy_score: 85,
          attempts_count: 1,
          hold_duration: 60,
          completed_successfully: true,
          feedback_given: ['Good alignment'],
          timestamp: new Date(wednesday.getTime() + 18 * 60 * 1000) // 18 minutes into session
        }
      ],
      session_notes: 'Great Wednesday morning session! Felt energized.'
    });

    await yogaSession.save();

    console.log('\n✅ Created Wednesday yoga session:');
    console.log('- Session ID:', yogaSession._id);
    console.log('- Date:', yogaSession.session_date.toDateString());
    console.log('- Duration:', yogaSession.total_duration, 'minutes');
    console.log('- Poses completed:', yogaSession.overall_performance.poses_completed);
    console.log('- Average accuracy:', yogaSession.overall_performance.average_accuracy + '%');
    console.log('- Total poses attempted:', yogaSession.overall_performance.total_poses_attempted);

    console.log('\n📊 Pose details:');
    yogaSession.poses_practiced.forEach((pose, index) => {
      console.log(`${index + 1}. ${pose.pose_name}: ${pose.accuracy_score}% (${pose.completed_successfully ? 'Completed' : 'Failed'})`);
    });

    console.log('\n🎯 This session should now appear in your statistics!');
    console.log('Go to the Schedule page to see updated numbers.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

createTestYogaSession();