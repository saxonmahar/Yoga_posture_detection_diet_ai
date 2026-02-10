// Test script to verify community stats endpoint
const mongoose = require('mongoose');
require('dotenv').config();

const PoseSession = require('./models/posesession');
const User = require('./models/user');

async function testCommunityStats() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get total registered users
    const totalUsers = await User.countDocuments();
    console.log('👥 Total registered users:', totalUsers);

    // Get users with sessions (active practitioners)
    const usersWithSessions = await PoseSession.distinct('userId');
    console.log('🧘 Users with sessions:', usersWithSessions.length);

    // Get total sessions count
    const totalSessions = await PoseSession.countDocuments({ status: 'completed' });
    console.log('📊 Total sessions:', totalSessions);

    // Calculate average accuracy across all users
    const sessions = await PoseSession.find({ status: 'completed' });
    
    let totalAccuracySum = 0;
    let totalPoseCount = 0;
    
    sessions.forEach(session => {
      if (session.poses && session.poses.length > 0) {
        session.poses.forEach(pose => {
          totalAccuracySum += pose.accuracyScore || 0;
          totalPoseCount++;
        });
      }
    });
    
    const averageAccuracy = totalPoseCount > 0 ? Math.round(totalAccuracySum / totalPoseCount) : 0;
    console.log('🎯 Community average accuracy:', averageAccuracy + '%');

    console.log('\n📊 Community Stats (as shown on Community page):');
    console.log({
      activeMembers: totalUsers, // Total registered users
      postsShared: totalSessions,
      averageAccuracy: averageAccuracy,
      totalSessions: totalSessions
    });

    await mongoose.connection.close();
    console.log('\n✅ Test complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testCommunityStats();
