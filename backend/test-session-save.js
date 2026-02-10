// Test script to manually save a session
require('dotenv').config();
const mongoose = require('mongoose');
const PoseSession = require('./models/posesession');

async function testSessionSave() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Create a test session
    const testSession = new PoseSession({
      userId: new mongoose.Types.ObjectId('69822354b394f20e559ab17e'), // Your user ID
      sessionName: 'Test Yoga Session',
      sessionType: 'yoga',
      startTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      endTime: new Date(),
      duration: 5,
      status: 'completed',
      totalPoses: 1,
      avgAccuracy: 85,
      poses: [{
        poseId: 'yog2',
        poseName: 'T Pose',
        accuracyScore: 85,
        holdDuration: 30
      }]
    });

    await testSession.save();
    console.log('✅ Test session saved:', testSession._id);

    // Count total sessions
    const totalSessions = await PoseSession.countDocuments();
    console.log(`\n📊 Total sessions in database: ${totalSessions}`);

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testSessionSave();
