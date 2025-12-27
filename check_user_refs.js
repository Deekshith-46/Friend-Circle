const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dating_app';

async function checkUserInterests() {
  try {
    await mongoose.connect(MONGO_URI);
    
    const FemaleUser = require('./src/models/femaleUser/FemaleUser');
    const Interest = require('./src/models/admin/Interest');
    const Language = require('./src/models/admin/Language');
    
    // Find the user from your example
    const userId = '694e99d62067d37df0ff62e9';
    const user = await FemaleUser.findById(userId);
    
    console.log('User interests IDs:', user.interests);
    console.log('User languages IDs:', user.languages);
    
    // Check which interests exist
    if (user.interests && user.interests.length > 0) {
      const existingInterests = await Interest.find({ _id: { $in: user.interests } });
      console.log('Existing interests from user refs:', existingInterests.map(i => ({ id: i._id, title: i.title })));
      console.log('Missing interests count:', user.interests.length - existingInterests.length);
    }
    
    // Check which languages exist
    if (user.languages && user.languages.length > 0) {
      const existingLanguages = await Language.find({ _id: { $in: user.languages } });
      console.log('Existing languages from user refs:', existingLanguages.map(l => ({ id: l._id, title: l.title })));
      console.log('Missing languages count:', user.languages.length - existingLanguages.length);
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    await mongoose.disconnect();
  }
}

checkUserInterests();