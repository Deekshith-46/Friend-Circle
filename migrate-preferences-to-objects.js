const mongoose = require('mongoose');
require('dotenv').config();

async function migratePreferences() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const femaleUsersCollection = db.collection('femaleusers');
    
    // Find all users with old string-based preferences
    const usersToMigrate = await femaleUsersCollection.find({
      $or: [
        { hobbies: { $exists: true, $type: 'array' } },
        { sports: { $exists: true, $type: 'array' } },
        { film: { $exists: true, $type: 'array' } },
        { music: { $exists: true, $type: 'array' } },
        { travel: { $exists: true, $type: 'array' } }
      ]
    }).toArray();
    
    console.log(`\n📊 Found ${usersToMigrate.length} users to migrate`);
    
    let migratedCount = 0;
    const crypto = require('crypto');
    
    for (const user of usersToMigrate) {
      const updates = {};
      let needsUpdate = false;
      
      // Helper function to convert string array to {id, name} array
      const convertToObjectArray = (arr) => {
        if (!Array.isArray(arr) || arr.length === 0) return arr;
        
        // Check if already migrated (first item is object with id and name)
        if (typeof arr[0] === 'object' && arr[0].id && arr[0].name) {
          return arr; // Already migrated
        }
        
        // Convert strings to objects
        return arr.map(item => {
          if (typeof item === 'string') {
            return {
              id: crypto.randomBytes(8).toString('hex'),
              name: item
            };
          }
          return item;
        });
      };
      
      // Migrate each preference field
      if (user.hobbies && Array.isArray(user.hobbies)) {
        const converted = convertToObjectArray(user.hobbies);
        if (JSON.stringify(converted) !== JSON.stringify(user.hobbies)) {
          updates.hobbies = converted;
          needsUpdate = true;
        }
      }
      
      if (user.sports && Array.isArray(user.sports)) {
        const converted = convertToObjectArray(user.sports);
        if (JSON.stringify(converted) !== JSON.stringify(user.sports)) {
          updates.sports = converted;
          needsUpdate = true;
        }
      }
      
      if (user.film && Array.isArray(user.film)) {
        const converted = convertToObjectArray(user.film);
        if (JSON.stringify(converted) !== JSON.stringify(user.film)) {
          updates.film = converted;
          needsUpdate = true;
        }
      }
      
      if (user.music && Array.isArray(user.music)) {
        const converted = convertToObjectArray(user.music);
        if (JSON.stringify(converted) !== JSON.stringify(user.music)) {
          updates.music = converted;
          needsUpdate = true;
        }
      }
      
      if (user.travel && Array.isArray(user.travel)) {
        const converted = convertToObjectArray(user.travel);
        if (JSON.stringify(converted) !== JSON.stringify(user.travel)) {
          updates.travel = converted;
          needsUpdate = true;
        }
      }
      
      // Update if needed
      if (needsUpdate) {
        await femaleUsersCollection.updateOne(
          { _id: user._id },
          { $set: updates }
        );
        migratedCount++;
        console.log(`✅ Migrated user ${user.email || user._id}`);
        console.log(`   Fields updated: ${Object.keys(updates).join(', ')}`);
      }
    }
    
    console.log(`\n🎉 Migration completed!`);
    console.log(`   Total users found: ${usersToMigrate.length}`);
    console.log(`   Users migrated: ${migratedCount}`);
    console.log(`   Users already up-to-date: ${usersToMigrate.length - migratedCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migratePreferences();
