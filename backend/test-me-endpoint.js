require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const { getMeController } = require('./controllers/authController');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const testMeEndpoint = async () => {
  await connectDB();
  
  try {
    console.log('🔍 Testing /me endpoint controller...\n');
    
    // Find user to get the ID
    const user = await User.findOne({ email: 'maharsanjay123@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('📊 User found in database:');
    console.log('ID:', user._id);
    console.log('Email:', user.email);
    console.log('Profile Photo:', user.profilePhoto);
    console.log('Profile Photo Exists:', !!user.profilePhoto);
    
    // Create mock request and response objects
    const mockReq = {
      user: {
        id: user._id
      }
    };
    
    const mockRes = {
      status: (code) => {
        console.log('\n📤 /me Response Status:', code);
        return mockRes;
      },
      json: (data) => {
        console.log('📤 /me Response Data:');
        console.log('=====================================');
        console.log(JSON.stringify(data, null, 2));
        
        if (data?.user) {
          const userData = data.user;
          console.log('\n📊 User Data in /me Response:');
          console.log('=============================');
          console.log('User ID:', userData.id);
          console.log('User Name:', userData.name);
          console.log('User Email:', userData.email);
          console.log('Profile Photo:', userData.profilePhoto);
          console.log('Profile Photo Type:', typeof userData.profilePhoto);
          console.log('Profile Photo Exists:', !!userData.profilePhoto);
          
          if (userData.profilePhoto) {
            console.log('✅ SUCCESS: Profile photo is included in /me response!');
          } else {
            console.log('❌ PROBLEM: Profile photo is missing from /me response!');
          }
        }
        return mockRes;
      }
    };
    
    console.log('\n🔄 Calling /me controller...');
    await getMeController(mockReq, mockRes);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
};

testMeEndpoint();