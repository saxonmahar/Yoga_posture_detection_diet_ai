// Setup YOUR admin account
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

async function setupYourAdmin() {
  try {
    console.log('🔧 Setting up YOUR admin account...\n');
    
    // 1. Delete the old admin@yogaai.com
    const oldAdmin = await User.findOne({ email: 'admin@yogaai.com' });
    if (oldAdmin) {
      await User.deleteOne({ email: 'admin@yogaai.com' });
      console.log('✅ Deleted old admin account (admin@yogaai.com)');
    }
    
    // 2. Find or create your account
    let yourAccount = await User.findOne({ email: 'sanjaymahar2058@gmail.com' });
    
    if (yourAccount) {
      console.log('✅ Found your account');
      
      // Update to admin
      const hashedPassword = await bcrypt.hash('1234567890', 10);
      yourAccount.password = hashedPassword;
      yourAccount.role = 'admin';
      yourAccount.isEmailVerified = true;
      await yourAccount.save();
      
      console.log('✅ Updated your account to admin');
    } else {
      console.log('✅ Creating new admin account for you');
      
      const hashedPassword = await bcrypt.hash('1234567890', 10);
      
      yourAccount = await User.create({
        fullName: 'Sanjay Mahar',
        email: 'sanjaymahar2058@gmail.com',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        fitnessLevel: 'advanced',
        age: 25,
        weight: 70,
        height: 170,
        bmi: 24.2,
        bodyType: 'mesomorphic',
        goal: 'maintain',
        agreedToTerms: true
      });
      
      console.log('✅ Created your admin account');
    }
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('🎉 YOUR ADMIN ACCOUNT IS READY!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📧 Email: sanjaymahar2058@gmail.com');
    console.log('🔑 Password: 1234567890');
    console.log('🛡️  Role: admin');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n🚀 Login at: http://localhost:3002/admin');
    console.log('\n💡 When you sell this product:');
    console.log('   Run: node change-admin.js new-owner@email.com newpassword');
    console.log('   This will replace your admin with the new owner\'s credentials');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupYourAdmin();
