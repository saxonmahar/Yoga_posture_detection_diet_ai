// Change admin to new owner (for when you sell the product)
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

const newEmail = process.argv[2];
const newPassword = process.argv[3];
const newName = process.argv[4] || 'System Administrator';

if (!newEmail || !newPassword) {
  console.log('❌ Please provide email and password');
  console.log('Usage: node change-admin.js new-owner@email.com newpassword "Owner Name"');
  process.exit(1);
}

async function changeAdmin() {
  try {
    console.log('🔄 Changing admin to new owner...\n');
    
    // 1. Delete ALL existing admins
    const deletedCount = await User.deleteMany({ role: 'admin' });
    console.log(`✅ Deleted ${deletedCount.deletedCount} old admin account(s)`);
    
    // 2. Create new admin
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const newAdmin = await User.create({
      fullName: newName,
      email: newEmail,
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
      fitnessLevel: 'advanced',
      age: 30,
      weight: 70,
      height: 170,
      bmi: 24.2,
      bodyType: 'mesomorphic',
      goal: 'maintain',
      agreedToTerms: true
    });
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🎉 NEW ADMIN ACCOUNT CREATED!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('👤 Name:', newName);
    console.log('📧 Email:', newEmail);
    console.log('🔑 Password:', newPassword);
    console.log('🛡️  Role: admin');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n🚀 New owner can login at: http://localhost:3002/admin');
    console.log('   Email:', newEmail);
    console.log('   Password:', newPassword);
    console.log('\n✅ Old admin credentials are no longer valid');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

changeAdmin();
