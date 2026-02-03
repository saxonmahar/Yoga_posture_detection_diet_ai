// Script to delete specific test user from MongoDB database
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/user');
const LoginSecurity = require('./models/loginSecurity');
const YogaSession = require('./models/yogaSession');
const Schedule = require('./models/schedule');

async function deleteTestUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get email from command line argument or use default
    const emailToDelete = process.argv[2] || 'sanjaymahar2058@gmail.com';

    console.log(`\n🗑️ Deleting user and related data for: ${emailToDelete}`);

    // Delete user
    const userResult = await User.deleteOne({ email: emailToDelete });
    console.log(`✅ Deleted ${userResult.deletedCount} user record(s)`);

    // Clean up related data
    try {
      const loginSecurityResult = await LoginSecurity.deleteMany({ email: emailToDelete });
      console.log(`✅ Deleted ${loginSecurityResult.deletedCount} login security record(s)`);
    } catch (error) {
      console.log('⚠️ LoginSecurity cleanup skipped (collection may not exist)');
    }

    try {
      const yogaSessionResult = await YogaSession.deleteMany({ userEmail: emailToDelete });
      console.log(`✅ Deleted ${yogaSessionResult.deletedCount} yoga session(s)`);
    } catch (error) {
      console.log('⚠️ YogaSession cleanup skipped (collection may not exist)');
    }

    try {
      const scheduleResult = await Schedule.deleteMany({ userEmail: emailToDelete });
      console.log(`✅ Deleted ${scheduleResult.deletedCount} schedule(s)`);
    } catch (error) {
      console.log('⚠️ Schedule cleanup skipped (collection may not exist)');
    }

    // Verify deletion
    const user = await User.findOne({ email: emailToDelete });
    if (user) {
      console.log(`❌ ${emailToDelete} still exists in database`);
    } else {
      console.log(`✅ ${emailToDelete} successfully removed from database`);
    }

    console.log('\n🎉 You can now register with this email again!');
    console.log('\n💡 Usage: node delete-test-user.js your-email@example.com');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the deletion
deleteTestUser();