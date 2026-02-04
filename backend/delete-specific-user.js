const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

const deleteSpecificUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const emailToDelete = 'maharsanjay123@gmail.com';
    
    // Find the user first to confirm it exists
    const user = await User.findOne({ email: emailToDelete });
    
    if (!user) {
      console.log(`❌ User with email ${emailToDelete} not found in database`);
      return;
    }

    console.log(`📋 Found user to delete:`);
    console.log(`   Name: ${user.fullName || 'No Name'}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Created: ${user.createdAt || 'Unknown'}`);
    
    // Delete the user
    const result = await User.deleteOne({ email: emailToDelete });
    
    if (result.deletedCount === 1) {
      console.log(`✅ Successfully deleted user: ${emailToDelete}`);
      console.log(`🎉 You can now register with this email again!`);
    } else {
      console.log(`❌ Failed to delete user: ${emailToDelete}`);
    }

  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

deleteSpecificUser();