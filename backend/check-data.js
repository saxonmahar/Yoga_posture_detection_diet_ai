// Quick script to check database data
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const PoseSession = require('./models/posesession');

async function checkData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check users
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ isPremium: true });
    console.log('👥 USERS:');
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Premium Users: ${premiumUsers}`);
    
    // Get sample user
    const sampleUser = await User.findOne().select('fullName email isPremium stats.lastLogin createdAt');
    if (sampleUser) {
      console.log(`   Sample User: ${sampleUser.fullName} (${sampleUser.email})`);
      console.log(`   Last Login: ${sampleUser.stats?.lastLogin || 'Never'}`);
    }

    // Check sessions
    console.log('\n🧘 SESSIONS:');
    const totalSessions = await PoseSession.countDocuments();
    console.log(`   Total Sessions: ${totalSessions}`);
    
    // Get today's sessions
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todaySessions = await PoseSession.countDocuments({
      createdAt: { $gte: todayStart }
    });
    console.log(`   Today's Sessions: ${todaySessions}`);

    // Get recent sessions
    const recentSessions = await PoseSession.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'fullName email')
      .select('userId sessionName avgAccuracy duration totalPoses createdAt');

    console.log('\n📊 RECENT SESSIONS:');
    recentSessions.forEach((session, index) => {
      console.log(`   ${index + 1}. ${session.userId?.fullName || 'Unknown'}`);
      console.log(`      Session: ${session.sessionName}`);
      console.log(`      Poses: ${session.totalPoses}, Accuracy: ${session.avgAccuracy}%`);
      console.log(`      Duration: ${session.duration} min`);
      console.log(`      Date: ${session.createdAt.toLocaleString()}`);
    });

    // Calculate revenue
    const totalRevenue = premiumUsers * 500;
    console.log(`\n💰 REVENUE: Rs ${totalRevenue}`);

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkData();
