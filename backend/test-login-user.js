require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const testLoginUser = async () => {
  await connectDB();
  
  try {
    console.log('🔍 Testing login user data retrieval...\n');
    
    // Find user by email (same as login controller)
    const user = await User.findOne({ email: 'maharsanjay123@gmail.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('📊 Raw User Data from Database:');
    console.log('================================');
    console.log('ID:', user._id);
    console.log('Name:', user.fullName || user.name);
    console.log('Email:', user.email);
    console.log('Profile Photo:', user.profilePhoto);
    console.log('Profile Photo Type:', typeof user.profilePhoto);
    console.log('Profile Photo Exists:', !!user.profilePhoto);
    
    console.log('\n📊 All User Fields:');
    console.log('===================');
    console.log(JSON.stringify(user.toObject(), null, 2));
    
    // Test the mapping (same as login controller)
    const userData = {
      id: user._id,
      name: user.fullName || user.name,
      email: user.email,
      age: user.age,
      weight: user.weight,
      height: user.height,
      isPremium: user.isPremium || false,
      level: user.fitnessLevel || 'beginner',
      bodyType: user.bodyType || 'mesomorphic',
      goal: user.goal || 'maintain',
      bmi: user.bmi,
      profilePhoto: user.profilePhoto, // This should include the photo
      stats: {
        totalWorkouts: user.stats?.totalWorkouts || 0,
        currentStreak: user.stats?.currentStreak || 0,
        averageAccuracy: user.stats?.averageAccuracy || 0,
        goal: user.goal || 'maintain',
        activityLevel: 'moderately_active',
        weight: user.weight || 70,
        height: user.height || 170,
        age: user.age || 25
      }
    };
    
    console.log('\n📊 Mapped User Data (Login Response):');
    console.log('=====================================');
    console.log('ID:', userData.id);
    console.log('Name:', userData.name);
    console.log('Email:', userData.email);
    console.log('Profile Photo:', userData.profilePhoto);
    console.log('Profile Photo Type:', typeof userData.profilePhoto);
    console.log('Profile Photo Exists:', !!userData.profilePhoto);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
};

testLoginUser();