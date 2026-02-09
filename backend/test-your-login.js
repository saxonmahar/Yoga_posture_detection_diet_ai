// Test YOUR login
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
    const email = 'sanjaymahar2058@gmail.com';
    const password = '1234567890';
    
    console.log('🔐 Testing login for:', email);
    console.log('🔑 Password:', password);
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }
    
    console.log('\n✅ User found!');
    console.log('👤 Name:', user.fullName);
    console.log('📧 Email:', user.email);
    console.log('🛡️  Role:', user.role);
    
    // Test password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('\n🔑 Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password does NOT match!');
      console.log('💡 The password in database is different from "1234567890"');
      process.exit(1);
    }
    
    console.log('\n✅ Login would succeed!');
    console.log('✅ Email: sanjaymahar2058@gmail.com');
    console.log('✅ Password: 1234567890');
    console.log('✅ Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testLogin();
