// Check if there are yoga sessions in the yogasessions collection
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const connectDB = require('./DbConfig/db.config');

async function checkYogaSessions() {
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
    console.log('📧 User ID:', user._id);

    // Check all collections for yoga-related data
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 Available collections:');
    collections.forEach(col => console.log(`- ${col.name}`));

    // Check yogasessions collection
    try {
      const yogaSessions = await mongoose.connection.db.collection('yogasessions').find({ user: user._id }).toArray();
      console.log('\n🧘 YOGA SESSIONS (from pose detection):');
      console.log('='.repeat(60));
      
      if (yogaSessions.length === 0) {
        console.log('No yoga sessions found in yogasessions collection');
      } else {
        yogaSessions.forEach((session, index) => {
          console.log(`\n${index + 1}. Session ID: ${session._id}`);
          console.log(`   📅 Date: ${new Date(session.createdAt || session.date).toDateString()}`);
          console.log(`   🎯 Poses: ${session.poses ? session.poses.join(', ') : 'N/A'}`);
          console.log(`   📊 Accuracy: ${session.accuracy || 'N/A'}%`);
          console.log(`   ⏱️  Duration: ${session.duration || 'N/A'} minutes`);
          console.log(`   ✅ Status: ${session.status || 'N/A'}`);
          console.log(`   📝 Full data:`, JSON.stringify(session, null, 4));
        });
      }
    } catch (error) {
      console.log('❌ Error checking yogasessions:', error.message);
    }

    // Check posesessions collection
    try {
      const poseSessions = await mongoose.connection.db.collection('posesessions').find({ user: user._id }).toArray();
      console.log('\n🤸 POSE SESSIONS:');
      console.log('='.repeat(60));
      
      if (poseSessions.length === 0) {
        console.log('No pose sessions found in posesessions collection');
      } else {
        poseSessions.forEach((session, index) => {
          console.log(`\n${index + 1}. Session ID: ${session._id}`);
          console.log(`   📅 Date: ${new Date(session.createdAt || session.date).toDateString()}`);
          console.log(`   🎯 Pose: ${session.pose || 'N/A'}`);
          console.log(`   📊 Accuracy: ${session.accuracy || 'N/A'}%`);
          console.log(`   ⏱️  Duration: ${session.duration || 'N/A'} seconds`);
          console.log(`   📝 Full data:`, JSON.stringify(session, null, 4));
        });
      }
    } catch (error) {
      console.log('❌ Error checking posesessions:', error.message);
    }

    // Check userProgress collection
    try {
      const userProgress = await mongoose.connection.db.collection('userprogresses').find({ user: user._id }).toArray();
      console.log('\n📈 USER PROGRESS:');
      console.log('='.repeat(60));
      
      if (userProgress.length === 0) {
        console.log('No user progress found');
      } else {
        userProgress.forEach((progress, index) => {
          console.log(`\n${index + 1}. Progress ID: ${progress._id}`);
          console.log(`   📅 Date: ${new Date(progress.date).toDateString()}`);
          console.log(`   📊 Sessions: ${progress.sessionsCompleted || 0}`);
          console.log(`   🎯 Accuracy: ${progress.averageAccuracy || 'N/A'}%`);
          console.log(`   📝 Full data:`, JSON.stringify(progress, null, 4));
        });
      }
    } catch (error) {
      console.log('❌ Error checking user progress:', error.message);
    }

    console.log('\n✅ Data check completed!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkYogaSessions();