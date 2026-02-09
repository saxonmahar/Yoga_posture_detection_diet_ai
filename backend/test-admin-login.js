// Test admin login directly
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

async function testLogin() {
  try {
    const email = 'admin@yogaai.com';
    const password = 'Admin@123';
    
    console.log('🔐 Testing login for:', email);
    
    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }
    
    console.log('✅ User found!');
    console.log('👤 Name:', user.fullName);
    console.log('📧 Email:', user.email);
    console.log('🛡️  Role:', user.role);
    console.log('✉️  Email Verified:', user.isEmailVerified);
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔑 Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password does not match!');
      process.exit(1);
    }
    
    console.log('\n✅ Login would succeed!');
    console.log('\n📦 User data that would be returned:');
    const userData = {
      id: user._id,
      name: user.fullName || user.name,
      email: user.email,
      age: user.age,
      weight: user.weight,
      height: user.height,
      isPremium: user.isPremium || false,
      role: user.role || 'user',
      level: user.fitnessLevel || 'beginner',
      bodyType: user.bodyType || 'mesomorphic',
      goal: user.goal || 'maintain',
      bmi: user.bmi,
      profilePhoto: user.profilePhoto,
    };
    
    console.log(JSON.stringify(userData, null, 2));
    
    console.log('\n🎯 Role field:', userData.role);
    console.log('🎯 Is admin?', userData.role === 'admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLogin();
