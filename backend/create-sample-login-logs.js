require('dotenv').config();
const mongoose = require('mongoose');
const LoginLog = require('./models/loginLog');
const User = require('./models/user');

async function createSampleLogs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get some users from database
    const users = await User.find().limit(5);
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      process.exit(1);
    }

    console.log(`📊 Found ${users.length} users\n`);

    // Create sample login logs for the last few hours
    const sampleLogs = [];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const oses = ['Windows', 'macOS', 'Linux', 'Android', 'iOS'];
    const devices = ['Desktop', 'Mobile', 'Tablet'];

    for (let i = 0; i < Math.min(users.length, 10); i++) {
      const user = users[i % users.length];
      const minutesAgo = i * 15; // 15 minutes apart
      
      sampleLogs.push({
        user: user._id,
        email: user.email,
        userName: user.fullName || user.name || 'Unknown User',
        loginTime: new Date(Date.now() - minutesAgo * 60 * 1000),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0...',
        deviceInfo: {
          browser: browsers[Math.floor(Math.random() * browsers.length)],
          os: oses[Math.floor(Math.random() * oses.length)],
          device: devices[Math.floor(Math.random() * devices.length)]
        },
        status: 'success'
      });
    }

    // Insert sample logs
    await LoginLog.insertMany(sampleLogs);
    
    console.log(`✅ Created ${sampleLogs.length} sample login logs\n`);
    
    // Display them
    const logs = await LoginLog.find().sort({ loginTime: -1 }).limit(10);
    logs.forEach((log, index) => {
      console.log(`${index + 1}. ${log.userName} (${log.email})`);
      console.log(`   Time: ${log.loginTime.toLocaleString()}`);
      console.log(`   IP: ${log.ipAddress}`);
      console.log(`   Device: ${log.deviceInfo?.browser} on ${log.deviceInfo?.os}`);
      console.log('');
    });

    console.log('✅ Sample login logs created successfully!');
    console.log('   Refresh your admin dashboard to see them.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createSampleLogs();
