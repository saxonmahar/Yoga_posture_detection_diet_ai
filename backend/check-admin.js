// Script to check admin user
require('dotenv').config();
const mongoose = require('mongoose');
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

async function checkAdmin() {
  try {
    const admin = await User.findOne({ email: 'admin@yogaai.com' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user NOT found!');
      console.log('Run: node create-admin-user.js');
      process.exit(1);
    }

    console.log('\n✅ Admin user found!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('👤 Name:', admin.fullName || admin.name);
    console.log('📧 Email:', admin.email);
    console.log('🛡️  Role:', admin.role);
    console.log('✉️  Email Verified:', admin.isEmailVerified);
    console.log('🔑 Password Hash:', admin.password ? 'Set ✓' : 'NOT SET ✗');
    console.log('═══════════════════════════════════════════════════════════');
    
    if (admin.role !== 'admin') {
      console.log('\n⚠️  WARNING: Role is not "admin"!');
      console.log('Run: node make-admin.js admin@yogaai.com');
    } else {
      console.log('\n✅ Everything looks good!');
      console.log('Login at: http://localhost:3002/admin');
      console.log('Email: admin@yogaai.com');
      console.log('Password: Admin@123');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAdmin();
