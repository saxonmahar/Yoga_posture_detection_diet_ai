// Check YOUR admin account
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

async function checkYourAdmin() {
  try {
    const admin = await User.findOne({ email: 'sanjaymahar2058@gmail.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Your account NOT found!');
      console.log('Run: node setup-your-admin.js');
      process.exit(1);
    }

    console.log('\n✅ Your account found!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('👤 Name:', admin.fullName || admin.name);
    console.log('📧 Email:', admin.email);
    console.log('🛡️  Role:', admin.role);
    console.log('✉️  Email Verified:', admin.isEmailVerified);
    console.log('🔑 Password Hash:', admin.password ? 'Set ✓' : 'NOT SET ✗');
    console.log('═══════════════════════════════════════════════════════════');
    
    if (admin.role !== 'admin') {
      console.log('\n⚠️  WARNING: Role is not "admin"!');
      console.log('Run: node setup-your-admin.js');
    } else {
      console.log('\n✅ Everything looks good!');
      console.log('Login at: http://localhost:3002/admin');
      console.log('Email: sanjaymahar2058@gmail.com');
      console.log('Password: 1234567890');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkYourAdmin();
