const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

const checkUserPhoto = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/yoga_app');
    console.log('✅ Connected to MongoDB');

    // Find all users and their profile photos
    const users = await User.find({}, 'fullName email profilePhoto').lean();
    
    console.log('\n📊 User Profile Photo Status:');
    console.log('================================');
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User: ${user.fullName || 'No Name'}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Profile Photo: ${user.profilePhoto || '❌ No photo saved'}`);
      
      if (user.profilePhoto) {
        console.log(`   ✅ Photo exists: ${user.profilePhoto}`);
      } else {
        console.log(`   ❌ No profile photo saved for this user`);
      }
    });

    console.log('\n💡 Next Steps:');
    console.log('1. If no photo is saved, upload one via Profile page after login');
    console.log('2. If photo exists but not showing, restart backend server');
    console.log('3. Check browser console for any errors');

  } catch (error) {
    console.error('❌ Error checking user photos:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
};

checkUserPhoto();