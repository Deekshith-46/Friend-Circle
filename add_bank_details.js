// Script to add bank details to an existing user's KYC
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FemaleUser = require('./src/models/femaleUser/FemaleUser');

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI);

const addBankDetails = async () => {
  try {
    console.log('Adding bank details to user...');
    
    // Find the user
    const userId = '6933ebb8149b3fba441789db';
    const user = await FemaleUser.findById(userId);
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('Current structure:', JSON.stringify(user.kycDetails, null, 2));
    
    // Add bank details to the existing structure
    user.kycDetails.bank = {
      name: "Srija",
      accountNumber: "123456789012",
      ifsc: "IFSC0000",
      verifiedAt: new Date()
    };
    
    await user.save();
    
    console.log('Updated structure:', JSON.stringify(user.kycDetails, null, 2));
    
    // Close connection
    mongoose.connection.close();
    console.log('Bank details added successfully!');
  } catch (error) {
    console.error('Failed to add bank details:', error);
    mongoose.connection.close();
  }
};

// Run the script
addBankDetails();