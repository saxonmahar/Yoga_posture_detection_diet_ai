const mongoose = require('mongoose');
require('dotenv').config();

const PoseSession = require('./models/posesession');
const UserProgress = require('./models/userProgress');
const User = require('./models/user');

async function checkUserSessions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users with "mahesh" in name or email
    const users = await User.find({
      $or: [
        { name: /mahesh/i },
        { email: /mahesh/i }
      ]
    });
    
    console.log('\n📊 Found Users:');
    if (users.length === 0) {
      console.log('❌ No users found with "mahesh" in name or email');
      
      // Show all users
      const allUsers = await User.find({}).limit(10);
      console.log('\n👥 All Users (first 10):');
      allUsers.forEach(u => {
        console.log(`  - ${u.name} (${u.email})`);
      });
      return;
    }

    for (const user of users) {
      console.log('\n' + '='.repeat(60));
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('User ID:', user._id);

      // Check for pose sessions (NEW - correct collection)
      const poseSessions = await PoseSession.find({ userId: user._id }).sort({ createdAt: -1 });
      
      // Check user progress (NEW - this is what diet page checks)
      const userProgress = await UserProgress.findOne({ user_id: user._id });
      
      console.log('\n🧘 Yoga Sessions (PoseSession collection):');
      console.log('Total sessions:', poseSessions.length);
      
      console.log('\n📈 User Progress (UserProgress collection):');
      if (userProgress) {
        console.log('Total sessions:', userProgress.overall_stats?.total_sessions || 0);
        console.log('Total practice time:', userProgress.overall_stats?.total_practice_time || 0, 'minutes');
        console.log('Current streak:', userProgress.overall_stats?.current_streak || 0);
        console.log('Longest streak:', userProgress.overall_stats?.longest_streak || 0);
        console.log('Favorite pose:', userProgress.overall_stats?.favorite_pose || 'None');
        console.log('Overall mastery:', userProgress.overall_stats?.overall_mastery_level || 'Beginner');
        console.log('Poses practiced:', userProgress.pose_progress?.length || 0);
      } else {
        console.log('❌ No user progress found');
      }
      
      if (poseSessions.length > 0) {
        console.log('\n📅 Most Recent Session:');
        const latest = poseSessions[0];
        console.log('  Date:', latest.createdAt);
        console.log('  Duration:', latest.duration, 'minutes');
        console.log('  Total Poses:', latest.totalPoses);
        console.log('  Status:', latest.status);
        if (latest.poses && latest.poses.length > 0) {
          console.log('  Poses:', latest.poses.map(p => `${p.poseName} (${p.accuracyScore}%)`).join(', '));
        }
      } else {
        console.log('\n❌ No pose sessions found for this user');
      }

      // Check localStorage simulation (what the frontend would see)
      console.log('\n🔍 Session Check Logic (Diet Page):');
      const sessionCount = userProgress?.overall_stats?.total_sessions || 0;
      console.log('Database check: total_sessions =', sessionCount);
      console.log('Would unlock diet?', sessionCount > 0 ? '✅ YES' : '❌ NO');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

checkUserSessions();
