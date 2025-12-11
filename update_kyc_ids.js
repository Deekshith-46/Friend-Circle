// Script to add _id fields to existing KYC details
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FemaleUser = require('./src/models/femaleUser/FemaleUser');

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI);

const updateKYCIds = async () => {
  try {
    console.log('Updating KYC details with _id fields...');
    
    // Find the user
    const userId = '6933ebb8149b3fba441789db';
    const user = await FemaleUser.findById(userId);
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('Current structure:', JSON.stringify(user.kycDetails, null, 2));
    
    // Add _id fields if they don't exist
    if (user.kycDetails.bank && Object.keys(user.kycDetails.bank).length > 0 && !user.kycDetails.bank._id) {
      user.kycDetails.bank._id = new mongoose.Types.ObjectId();
    }
    
    if (user.kycDetails.upi && Object.keys(user.kycDetails.upi).length > 0 && !user.kycDetails.upi._id) {
      user.kycDetails.upi._id = new mongoose.Types.ObjectId();
    }
    
    await user.save();
    
    console.log('Updated structure:', JSON.stringify(user.kycDetails, null, 2));
    
    // Close connection
    mongoose.connection.close();
    console.log('_id fields added successfully!');
  } catch (error) {
    console.error('Failed to add _id fields:', error);
    mongoose.connection.close();
  }
};

// Run the script
updateKYCIds();