require('dotenv').config();
const mongoose = require('mongoose');
const LoginLog = require('./models/loginLog');

async function checkLoginLogs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const logs = await LoginLog.find().sort({ loginTime: -1 }).limit(10);
    
    console.log(`📊 Total login logs: ${await LoginLog.countDocuments()}\n`);
    
    if (logs.length === 0) {
      console.log('❌ No login logs found in database');
      console.log('\n💡 Login logs will be created when users log in.');
      console.log('   Try logging in as a user to create login logs.');
    } else {
      console.log('✅ Recent login logs:\n');
      logs.forEach((log, index) => {
        console.log(`${index + 1}. ${log.userName} (${log.email})`);
        console.log(`   Time: ${log.loginTime}`);
        console.log(`   IP: ${log.ipAddress}`);
        console.log(`   Device: ${log.deviceInfo?.browser} on ${log.deviceInfo?.os}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkLoginLogs();
