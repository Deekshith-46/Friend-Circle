// Script to migrate existing user documents to the new KYC structure
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FemaleUser = require('./src/models/femaleUser/FemaleUser');

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI);

const migrateKYCStructure = async () => {
  try {
    console.log('Starting KYC structure migration...');
    
    // Find all female users with kycDetails
    const users = await FemaleUser.find({
      kycDetails: {
        $exists: true,
        $ne: null
      }
    });
    
    console.log(`Found ${users.length} users with KYC details`);
    
    let migratedCount = 0;
    
    for (const user of users) {
      // Get the raw data from the database to check the actual structure
      const userData = user.toObject();
      
      // Check if user has old structure fields
      if (
        userData.kycDetails.method || 
        userData.kycDetails.accountDetails || 
        userData.kycDetails.upiId ||
        userData.kycDetails.verifiedAt
      ) {
        console.log(`Migrating user ${user._id}`);
        console.log('Old structure:', JSON.stringify(userData.kycDetails, null, 2));
        
        // Create new structure
        const newKycDetails = {
          bank: {},
          upi: {}
        };
        
        // Migrate bank details if they exist
        if (userData.kycDetails.method === 'account_details' && userData.kycDetails.accountDetails) {
          newKycDetails.bank = {
            name: userData.kycDetails.accountDetails.name,
            accountNumber: userData.kycDetails.accountDetails.accountNumber,
            ifsc: userData.kycDetails.accountDetails.ifsc,
            verifiedAt: userData.kycDetails.verifiedAt
          };
        }
        
        // Migrate UPI details if they exist
        if (userData.kycDetails.method === 'upi_id' && userData.kycDetails.upiId) {
          newKycDetails.upi = {
            upiId: userData.kycDetails.upiId,
            verifiedAt: userData.kycDetails.verifiedAt
          };
        }
        
        console.log('New structure:', JSON.stringify(newKycDetails, null, 2));
        
        // Update user document
        await FemaleUser.findByIdAndUpdate(user._id, {
          kycDetails: newKycDetails
        });
        
        migratedCount++;
      }
    }
    
    console.log(`Successfully migrated ${migratedCount} users to new KYC structure`);
    
    // Close connection
    mongoose.connection.close();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    mongoose.connection.close();
  }
};

// Run migration
migrateKYCStructure();