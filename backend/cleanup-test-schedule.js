// Cleanup test schedule data
require('dotenv').config();
const mongoose = require('mongoose');
const Schedule = require('./models/schedule');
const User = require('./models/user');

const connectDB = require('./DbConfig/db.config');

async function cleanupTestSchedule() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Find test user
    const testUser = await User.findOne({ email: 'sanjaymahar2058@gmail.com' });
    if (!testUser) {
      console.log('Test user not found.');
      process.exit(1);
    }

    // Delete all test sessions
    const result = await Schedule.deleteMany({ 
      user: testUser._id,
      title: { $regex: /Test Session/ }
    });

    console.log(`Deleted ${result.deletedCount} test sessions`);
    console.log('✅ Cleanup completed successfully!');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

cleanupTestSchedule();