// Script to create a dedicated admin user
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

// Create admin user
async function createAdmin() {
  try {
    const adminEmail = 'admin@yogaai.com';
    const adminPassword = 'Admin@123';
    
    // Check if admin already exists
    let admin = await User.findOne({ email: adminEmail });
    
    if (admin) {
      console.log('⚠️  Admin user already exists. Updating...');
      
      // Update existing admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin.password = hashedPassword;
      admin.role = 'admin';
      admin.isEmailVerified = true;
      admin.fullName = 'System Administrator';
      await admin.save();
      
    } else {
      console.log('✨ Creating new admin user...');
      
      // Create new admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      admin = await User.create({
        fullName: 'System Administrator',
        email: adminEmail,
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
    }

    console.log('\n✅ Admin user ready!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('👤 Name: System Administrator');
    console.log('📧 Email: admin@yogaai.com');
    console.log('🔑 Password: Admin@123');
    console.log('🛡️  Role: admin');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n🎉 You can now login at: http://localhost:3002/admin');
    console.log('   Email: admin@yogaai.com');
    console.log('   Password: Admin@123');
    console.log('\n💡 Your personal account (sanjaymahar2058@gmail.com) remains unchanged.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
