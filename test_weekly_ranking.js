require('dotenv').config();
const connectDB = require('./src/config/db');
const FemaleUser = require('./src/models/femaleUser/FemaleUser');
const Transaction = require('./src/models/common/Transaction');

connectDB().then(async () => {
  console.log('Connected to database.');
  
  try {
    // Test the weekly ranking logic
    const currentUserId = '6933ebb8149b3fba441789db'; // Srija's ID
    
    // Calculate this week's date range (Monday to Sunday)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    
    // Adjust to get Monday of this week
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    console.log('Start of week:', startOfWeek);
    console.log('End of week:', endOfWeek);
    
    // Get all female users with their weekly earnings
    const femaleUsers = await FemaleUser.find({ 
      status: 'active',
      reviewStatus: 'approved'
    });
    
    console.log(`Found ${femaleUsers.length} female users`);
    
    // Calculate weekly earnings for each user
    const userEarnings = [];
    
    for (const user of femaleUsers) {
      try {
        const transactions = await Transaction.find({
          userId: user._id,
          userType: 'female',
          action: 'credit',
          createdAt: {
            $gte: startOfWeek,
            $lt: endOfWeek
          }
        });
        
        const weeklyEarning = transactions.reduce((sum, t) => sum + t.amount, 0);
        
        // Only include users with earnings > 0
        if (weeklyEarning > 0) {
          userEarnings.push({
            userId: user._id,
            name: user.name,
            earning: weeklyEarning
          });
        }
      } catch (err) {
        console.error(`Error calculating weekly earning for user ${user._id}:`, err);
      }
    }
    
    console.log('User earnings:', userEarnings);
    
    // Sort users by earnings (descending)
    userEarnings.sort((a, b) => b.earning - a.earning);
    
    console.log('Sorted user earnings:', userEarnings);
    
    // Find current user's data
    const currentUserData = userEarnings.find(u => u.userId.toString() === currentUserId.toString());
    
    console.log('Current user data:', currentUserData);
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
});