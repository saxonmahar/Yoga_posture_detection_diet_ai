// Script to list all users
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yoga_diet_ai')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

async function listUsers() {
  try {
    const users = await User.find().select('email name role createdAt');
    
    console.log('\n📋 All Users in Database:\n');
    console.log('═══════════════════════════════════════════════════════════');
    
    if (users.length === 0) {
      console.log('No users found in database.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role || 'user'}`);
        console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
        console.log('───────────────────────────────────────────────────────────');
      });
      
      console.log(`\nTotal Users: ${users.length}`);
      console.log('\n💡 To make a user admin, run:');
      console.log('   node make-admin.js <email>');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listUsers();