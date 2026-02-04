// Debug script to check all collections and their data
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const connectDB = require('./DbConfig/db.config');

async function debugCollections() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Find your user
    const user = await User.findOne({ email: 'sanjaymahar2058@gmail.com' });
    if (!user) {
      console.log('User not found.');
      process.exit(1);
    }

    console.log('👤 User found:', user.email);
    console.log('📧 User ID:', user._id);

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 All collections in database:');
    
    for (const col of collections) {
      console.log(`\n🗂️  Collection: ${col.name}`);
      
      try {
        // Count total documents
        const totalCount = await mongoose.connection.db.collection(col.name).countDocuments();
        console.log(`   📊 Total documents: ${totalCount}`);
        
        // Count documents for this user (try different user field names)
        const userCount1 = await mongoose.connection.db.collection(col.name).countDocuments({ user: user._id });
        const userCount2 = await mongoose.connection.db.collection(col.name).countDocuments({ user_id: user._id });
        const userCount3 = await mongoose.connection.db.collection(col.name).countDocuments({ userId: user._id });
        
        if (userCount1 > 0) console.log(`   👤 User documents (user field): ${userCount1}`);
        if (userCount2 > 0) console.log(`   👤 User documents (user_id field): ${userCount2}`);
        if (userCount3 > 0) console.log(`   👤 User documents (userId field): ${userCount3}`);
        
        // If this user has documents in this collection, show them
        if (userCount1 > 0 || userCount2 > 0 || userCount3 > 0) {
          const userDocs1 = await mongoose.connection.db.collection(col.name).find({ user: user._id }).limit(3).toArray();
          const userDocs2 = await mongoose.connection.db.collection(col.name).find({ user_id: user._id }).limit(3).toArray();
          const userDocs3 = await mongoose.connection.db.collection(col.name).find({ userId: user._id }).limit(3).toArray();
          
          const allUserDocs = [...userDocs1, ...userDocs2, ...userDocs3];
          
          console.log(`   📄 Sample documents:`);
          allUserDocs.forEach((doc, index) => {
            console.log(`      ${index + 1}. ID: ${doc._id}`);
            if (doc.createdAt) console.log(`         Created: ${new Date(doc.createdAt).toDateString()}`);
            if (doc.session_date) console.log(`         Session Date: ${new Date(doc.session_date).toDateString()}`);
            if (doc.date) console.log(`         Date: ${new Date(doc.date).toDateString()}`);
            if (doc.title) console.log(`         Title: ${doc.title}`);
            if (doc.status) console.log(`         Status: ${doc.status}`);
            if (doc.overall_performance) console.log(`         Performance: ${JSON.stringify(doc.overall_performance)}`);
          });
        }
        
      } catch (error) {
        console.log(`   ❌ Error checking collection: ${error.message}`);
      }
    }

    console.log('\n✅ Debug completed!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

debugCollections();