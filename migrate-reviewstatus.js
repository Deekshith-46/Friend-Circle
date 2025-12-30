const mongoose = require('mongoose');
require('dotenv').config();

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const result = await mongoose.connection.db.collection('femaleusers').updateMany(
      { reviewStatus: 'approved' },
      { $set: { reviewStatus: 'accepted' } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} users`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();