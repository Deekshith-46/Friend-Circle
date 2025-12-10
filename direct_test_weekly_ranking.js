require('dotenv').config();
const connectDB = require('./src/config/db');
const statsController = require('./src/controllers/femaleUserControllers/statsController');

// Mock request and response objects
const mockReq = {
  user: {
    _id: '6933ebb8149b3fba441789db' // Srija's ID
  }
};

const mockRes = {
  json: function(data) {
    console.log('Response Data:');
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
    return this;
  },
  status: function(code) {
    console.log(`HTTP Status: ${code}`);
    return this;
  }
};

connectDB().then(async () => {
  console.log('Connected to database.');
  console.log('Testing weekly ranking function...');
  
  try {
    // Call our function directly
    await statsController.getWeeklyRanking(mockReq, mockRes);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
});