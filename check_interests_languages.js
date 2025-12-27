const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dating_app';

async function checkDocuments() {
  try {
    await mongoose.connect(MONGO_URI);
    
    // Dynamically import models after connecting
    const Interest = require('./src/models/admin/Interest');
    const Language = require('./src/models/admin/Language');
    
    // Check specific interests (from your admin response)
    const interestIds = ['68d4f9dfdd3c0ef9b8ebbf19', '68d4fac1dd3c0ef9b8ebbf20'];
    console.log('Checking interests with IDs:', interestIds);
    const interests = await Interest.find({ _id: { $in: interestIds } });
    console.log('Interests found:', interests.map(i => ({ id: i._id, title: i.title, status: i.status })));
    
    // Check specific languages (from your admin response)
    const languageIds = ['68d4fc53dd3c0ef9b8ebbf35', '68d4fc69dd3c0ef9b8ebbf3a'];
    console.log('\nChecking languages with IDs:', languageIds);
    const languages = await Language.find({ _id: { $in: languageIds } });
    console.log('Languages found:', languages.map(l => ({ id: l._id, title: l.title, status: l.status })));
    
    // Check all interests and languages in the database
    const allInterests = await Interest.find({});
    console.log('\nAll interests in database:', allInterests.map(i => ({ id: i._id, title: i.title, status: i.status })));
    
    const allLanguages = await Language.find({});
    console.log('\nAll languages in database:', allLanguages.map(l => ({ id: l._id, title: l.title, status: l.status })));
    
    await mongoose.disconnect();
    console.log('\nDatabase check completed.');
  } catch (err) {
    console.error('Error:', err);
    await mongoose.disconnect();
  }
}

checkDocuments();