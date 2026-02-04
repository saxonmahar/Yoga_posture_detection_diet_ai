// Add yoga sessions for Tuesday and Wednesday in February 2026
require('dotenv').config();
const mongoose = require('mongoose');
const YogaSession = require('./models/yogaSession');
const User = require('./models/user');

const connectDB = require('./DbConfig/db.config');

async function addFebruarySessions() {
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

    // Create Tuesday session (Feb 3, 2026)
    const tuesday = new Date('2026-02-03T07:00:00.000Z');
    
    const tuesdaySession = new YogaSession({
      user_id: user._id,
      session_date: tuesday,
      total_duration: 30, // 30 minutes
      poses_practiced: [
        {
          pose_id: 'yog1',
          pose_name: 'Warrior II',
          accuracy_score: 85,
          attempts_count: 2,
          hold_duration: 45,
          completed_successfully: true,
          feedback_given: ['Good stance!', 'Keep arms strong'],
          timestamp: new Date(tuesday.getTime() + 5 * 60 * 1000)
        },
        {
          pose_id: 'yog2', 
          pose_name: 'Tree Pose',
          accuracy_score: 88,
          attempts_count: 3,
          hold_duration: 30,
          completed_successfully: true,
          feedback_given: ['Great balance!', 'Focus on breathing'],
          timestamp: new Date(tuesday.getTime() + 12 * 60 * 1000)
        },
        {
          pose_id: 'yog3',
          pose_name: 'Downward Dog',
          accuracy_score: 82,
          attempts_count: 1,
          hold_duration: 60,
          completed_successfully: true,
          feedback_given: ['Nice alignment'],
          timestamp: new Date(tuesday.getTime() + 20 * 60 * 1000)
        }
      ],
      session_notes: 'Tuesday morning practice - feeling strong!'
    });

    await tuesdaySession.save();
    console.log('\n✅ Created Tuesday session:');
    console.log('- Date:', tuesdaySession.session_date.toDateString());
    console.log('- Duration:', tuesdaySession.total_duration, 'minutes');
    console.log('- Poses completed:', tuesdaySession.overall_performance.poses_completed);
    console.log('- Average accuracy:', tuesdaySession.overall_performance.average_accuracy + '%');

    // Create additional Wednesday session (Feb 4, 2026) to complement existing ones
    const wednesday = new Date('2026-02-04T18:00:00.000Z'); // Evening session
    
    const wednesdayEveningSession = new YogaSession({
      user_id: user._id,
      session_date: wednesday,
      total_duration: 25, // 25 minutes
      poses_practiced: [
        {
          pose_id: 'yog4',
          pose_name: 'Goddess Pose',
          accuracy_score: 91,
          attempts_count: 2,
          hold_duration: 40,
          completed_successfully: true,
          feedback_given: ['Excellent form!', 'Strong foundation'],
          timestamp: new Date(wednesday.getTime() + 5 * 60 * 1000)
        },
        {
          pose_id: 'yog5', 
          pose_name: 'Plank Pose',
          accuracy_score: 89,
          attempts_count: 1,
          hold_duration: 50,
          completed_successfully: true,
          feedback_given: ['Perfect alignment!'],
          timestamp: new Date(wednesday.getTime() + 15 * 60 * 1000)
        }
      ],
      session_notes: 'Wednesday evening session - great way to end the day!'
    });

    await wednesdayEveningSession.save();
    console.log('\n✅ Created Wednesday evening session:');
    console.log('- Date:', wednesdayEveningSession.session_date.toDateString());
    console.log('- Duration:', wednesdayEveningSession.total_duration, 'minutes');
    console.log('- Poses completed:', wednesdayEveningSession.overall_performance.poses_completed);
    console.log('- Average accuracy:', wednesdayEveningSession.overall_performance.average_accuracy + '%');

    // Check total sessions for February
    const februaryStart = new Date('2026-02-01T00:00:00.000Z');
    const februaryEnd = new Date('2026-02-28T23:59:59.999Z');
    
    const allFebruarySessions = await YogaSession.find({
      user_id: user._id,
      session_date: {
        $gte: februaryStart,
        $lte: februaryEnd
      }
    }).sort({ session_date: 1 });

    console.log('\n📊 FEBRUARY 2026 SUMMARY:');
    console.log('='.repeat(50));
    console.log(`📅 Total sessions: ${allFebruarySessions.length}`);
    
    // Group by date
    const sessionsByDate = {};
    allFebruarySessions.forEach(session => {
      const dateKey = session.session_date.toDateString();
      if (!sessionsByDate[dateKey]) {
        sessionsByDate[dateKey] = [];
      }
      sessionsByDate[dateKey].push(session);
    });

    Object.keys(sessionsByDate).forEach(date => {
      const sessions = sessionsByDate[date];
      const totalAccuracy = sessions.reduce((sum, s) => sum + s.overall_performance.average_accuracy, 0);
      const avgAccuracy = Math.round(totalAccuracy / sessions.length);
      
      console.log(`📅 ${date}: ${sessions.length} session(s), ${avgAccuracy}% avg accuracy`);
    });

    const totalPoses = allFebruarySessions.reduce((sum, s) => sum + s.overall_performance.poses_completed, 0);
    const totalAccuracy = allFebruarySessions.reduce((sum, s) => sum + s.overall_performance.average_accuracy, 0);
    const overallAvgAccuracy = Math.round(totalAccuracy / allFebruarySessions.length);

    console.log('\n🎯 FEBRUARY STATISTICS:');
    console.log(`📈 Total sessions: ${allFebruarySessions.length}`);
    console.log(`🧘 Total poses completed: ${totalPoses}`);
    console.log(`📊 Overall average accuracy: ${overallAvgAccuracy}%`);
    console.log(`🔥 Days practiced: ${Object.keys(sessionsByDate).length}`);
    console.log(`⚡ Current streak: ${Object.keys(sessionsByDate).length} days`);

    console.log('\n✅ February sessions updated successfully!');
    console.log('🔄 Go to the Schedule page to see updated statistics.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

addFebruarySessions();