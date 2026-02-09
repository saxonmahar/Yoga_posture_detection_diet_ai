// Script to reset user password (NOT admin)
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/yoga_diet_ai';
console.log('🔗 Connecting to MongoDB...');

mongoose.connect(mongoUri)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('❌ Please provide email and password');
  console.log('Usage: node reset-user-password.js email@example.com newpassword');
  process.exit(1);
}

async function resetPassword() {
  try {
    const user = await User.findOne({ email: email });
    
    if (!user) {
      console.log(`❌ User not found with email: ${email}`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.role = 'user'; // Make sure it's a regular user, not admin
    user.isEmailVerified = true;
    await user.save();

    console.log('✅ Success!');
    console.log(`👤 User: ${user.fullName || user.name} (${user.email})`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👥 Role: ${user.role}`);
    console.log(`✉️  Email Verified: ${user.isEmailVerified}`);
    console.log('\n🎉 You can now login at: http://localhost:3002/login');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
