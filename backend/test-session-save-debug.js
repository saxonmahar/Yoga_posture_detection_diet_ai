const mongoose = require('mongoose');
require('dotenv').config();

const UserProgress = require('./models/userProgress');
const PoseSession = require('./models/posesession');

async function testSessionSave() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test user ID (maheshmahar)
    const testUserId = '6985b5b9ad6a49faa1e0a28f';

    console.log('\n📊 Testing Session Save for user:', testUserId);

    // Check current sessions
    const existingSessions = await PoseSession.find({ userId: testUserId });
    console.log('Current sessions in database:', existingSessions.length);

    // Check user progress
    const userProgress = await UserProgress.findOne({ user_id: testUserId });
    console.log('User progress exists:', !!userProgress);
    if (userProgress) {
      console.log('Total sessions in progress:', userProgress.overall_stats?.total_sessions || 0);
    }

    // Simulate a T-Pose session save
    console.log('\n💾 Simulating T-Pose session save...');
    
    const sessionPayload = {
      user_id: testUserId,
      total_duration: 2, // 2 minutes
      poses_practiced: [{
        pose_id: 'yog2', // FIXED: Use correct enum value 'yog2' instead of 'tpose'
        pose_name: 'T Pose',
        accuracy_score: 95,
        attempts_count: 3,
        hold_duration: 120, // 2 minutes in seconds
        completed_successfully: true,
        feedback_given: ['Good form', 'Arms aligned'],
        corrections_needed: [],
        timestamp: new Date()
      }],
      session_notes: 'T Pose practice session - Completed successfully'
    };

    // Create pose session
    const poseSession = new PoseSession({
      userId: sessionPayload.user_id,
      sessionName: sessionPayload.session_notes,
      sessionType: 'yoga',
      duration: sessionPayload.total_duration,
      startTime: new Date(Date.now() - sessionPayload.total_duration * 60 * 1000),
      endTime: new Date(),
      status: 'completed',
      totalPoses: 1,
      poses: sessionPayload.poses_practiced.map(pose => ({
        poseId: pose.pose_id,
        poseName: pose.pose_name,
        accuracyScore: pose.accuracy_score,
        holdDuration: pose.hold_duration,
        feedback: pose.feedback_given.map(msg => ({
          category: 'form',
          message: msg,
          severity: 'good'
        }))
      }))
    });

    await poseSession.save();
    console.log('✅ Pose session saved:', poseSession._id);

    // Update user progress
    let progress = await UserProgress.findOne({ user_id: testUserId });
    
    if (!progress) {
      console.log('Creating new user progress...');
      progress = new UserProgress({ user_id: testUserId });
    }

    // Update progress for T-Pose
    progress.updatePoseProgress('yog2', 'T Pose', 95, true); // FIXED: Use 'yog2' instead of 'tpose'
    progress.updateOverallStats();
    progress.overall_stats.total_practice_time += sessionPayload.total_duration;

    await progress.save();
    console.log('✅ User progress updated');
    console.log('Total sessions now:', progress.overall_stats.total_sessions);

    // Verify the save
    const updatedProgress = await UserProgress.findOne({ user_id: testUserId });
    console.log('\n📈 Final verification:');
    console.log('Total sessions:', updatedProgress.overall_stats.total_sessions);
    console.log('Current streak:', updatedProgress.overall_stats.current_streak);
    console.log('Total practice time:', updatedProgress.overall_stats.total_practice_time);

    console.log('\n✅ Test completed successfully!');
    console.log('User should now be able to access diet plan.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

testSessionSave();
