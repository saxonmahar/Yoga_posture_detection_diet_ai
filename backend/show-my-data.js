// Script to show your current schedule data in the database
require('dotenv').config();
const mongoose = require('mongoose');
const Schedule = require('./models/schedule');
const User = require('./models/user');

const connectDB = require('./DbConfig/db.config');

async function showMyData() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Find your user
    const user = await User.findOne({ email: 'sanjaymahar2058@gmail.com' });
    if (!user) {
      console.log('User not found. Please register first.');
      process.exit(1);
    }

    console.log('👤 User found:', user.email);
    console.log('📧 User ID:', user._id);

    // Get all your sessions
    const allSessions = await Schedule.find({ user: user._id }).sort({ date: -1, time: 1 });
    
    console.log('\n📅 ALL YOUR SESSIONS:');
    console.log('='.repeat(80));
    
    if (allSessions.length === 0) {
      console.log('No sessions found. Create some sessions first!');
    } else {
      allSessions.forEach((session, index) => {
        console.log(`\n${index + 1}. ${session.title}`);
        console.log(`   📅 Date: ${session.date.toDateString()}`);
        console.log(`   ⏰ Time: ${session.time}`);
        console.log(`   ⏱️  Duration: ${session.duration} minutes`);
        console.log(`   🧘 Poses: ${session.poses.join(', ')}`);
        console.log(`   📊 Difficulty: ${session.difficulty}`);
        console.log(`   ✅ Status: ${session.status}`);
        
        if (session.status === 'completed') {
          console.log(`   🎯 Completed At: ${session.completedAt}`);
          console.log(`   📈 Accuracy: ${session.accuracy}%`);
          if (session.sessionData && Object.keys(session.sessionData).length > 0) {
            console.log(`   📊 Session Data:`, JSON.stringify(session.sessionData, null, 6));
          }
        }
        
        if (session.notes) {
          console.log(`   📝 Notes: ${session.notes}`);
        }
        console.log(`   🆔 ID: ${session._id}`);
      });
    }

    // Show statistics
    const totalSessions = allSessions.length;
    const completedSessions = allSessions.filter(s => s.status === 'completed').length;
    const scheduledSessions = allSessions.filter(s => s.status === 'scheduled').length;
    const missedSessions = allSessions.filter(s => s.status === 'missed').length;
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions * 100).toFixed(1) : 0;

    console.log('\n📊 YOUR STATISTICS:');
    console.log('='.repeat(50));
    console.log(`📈 Total Sessions: ${totalSessions}`);
    console.log(`✅ Completed: ${completedSessions}`);
    console.log(`📅 Scheduled: ${scheduledSessions}`);
    console.log(`❌ Missed: ${missedSessions}`);
    console.log(`🎯 Completion Rate: ${completionRate}%`);

    // Show today's sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaySessions = await Schedule.find({
      user: user._id,
      date: { $gte: today, $lt: tomorrow }
    });

    console.log('\n📅 TODAY\'S SESSIONS:');
    console.log('='.repeat(50));
    if (todaySessions.length === 0) {
      console.log('No sessions scheduled for today');
    } else {
      todaySessions.forEach(session => {
        console.log(`- ${session.title} at ${session.time} (${session.status})`);
      });
    }

    // Show upcoming sessions
    const upcomingSessions = await Schedule.find({
      user: user._id,
      date: { $gte: tomorrow },
      status: 'scheduled'
    }).limit(5).sort({ date: 1, time: 1 });

    console.log('\n🔮 UPCOMING SESSIONS:');
    console.log('='.repeat(50));
    if (upcomingSessions.length === 0) {
      console.log('No upcoming sessions scheduled');
    } else {
      upcomingSessions.forEach(session => {
        console.log(`- ${session.title} on ${session.date.toDateString()} at ${session.time}`);
      });
    }

    console.log('\n✅ Data display completed!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

showMyData();