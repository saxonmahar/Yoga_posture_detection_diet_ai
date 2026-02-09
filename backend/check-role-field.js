require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

async function checkRole() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const user = await User.findOne({ email: 'sanjaymahar2058@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.fullName);
    console.log('🛡️  Role field value:', user.role);
    console.log('🔍 Role type:', typeof user.role);
    console.log('🔍 Role is undefined?', user.role === undefined);
    console.log('\n📋 Full user object (relevant fields):');
    console.log(JSON.stringify({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    }, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkRole();
