// Script to make a user admin
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

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide an email address');
  console.log('Usage: node make-admin.js your-email@example.com');
  process.exit(1);
}

// Make user admin
async function makeAdmin() {
  try {
    const user = await User.findOne({ email: email });
    
    if (!user) {
      console.log(`❌ User not found with email: ${email}`);
      console.log('\n📋 Available users:');
      const allUsers = await User.find().select('email name');
      allUsers.forEach(u => console.log(`   - ${u.email} (${u.name})`));
      process.exit(1);
    }

    // Update user role to admin
    user.role = 'admin';
    await user.save();

    console.log('✅ Success!');
    console.log(`👤 User: ${user.name} (${user.email})`);
    console.log(`🛡️  Role: ${user.role}`);
    console.log('\n🎉 You can now access the admin dashboard at: http://localhost:3002/admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();