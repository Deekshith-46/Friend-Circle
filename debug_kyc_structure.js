// Script to debug the current KYC structure of users
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FemaleUser = require('./src/models/femaleUser/FemaleUser');

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI);

const debugKYCStructure = async () => {
  try {
    console.log('Debugging KYC structure...');
    
    // Find all female users with kycDetails
    const users = await FemaleUser.find({
      kycDetails: {
        $exists: true,
        $ne: null
      }
    });
    
    console.log(`Found ${users.length} users with KYC details`);
    
    for (const user of users) {
      console.log(`\nUser ID: ${user._id}`);
      console.log('KYC Details structure:');
      console.log(JSON.stringify(user.kycDetails, null, 2));
      console.log('Has method property:', user.kycDetails.hasOwnProperty('method'));
      console.log('Has accountDetails property:', user.kycDetails.hasOwnProperty('accountDetails'));
      console.log('Has upiId property:', user.kycDetails.hasOwnProperty('upiId'));
      console.log('Has bank property:', user.kycDetails.hasOwnProperty('bank'));
      console.log('Has upi property:', user.kycDetails.hasOwnProperty('upi'));
    }
    
    // Close connection
    mongoose.connection.close();
    console.log('\nDebug completed!');
  } catch (error) {
    console.error('Debug failed:', error);
    mongoose.connection.close();
  }
};

// Run debug
debugKYCStructure();