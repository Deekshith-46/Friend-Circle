const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/admin', require('./routes/adminRoutes/admin'));
app.use('/admin/interests', require('./routes/adminRoutes/interest'));
app.use('/admin/languages', require('./routes/adminRoutes/language'));
app.use('/admin/religions', require('./routes/adminRoutes/religion'));
app.use('/admin/relation-goals', require('./routes/adminRoutes/relationGoal'));
app.use('/admin/gifts', require('./routes/adminRoutes/gift'));
app.use('/admin/pages', require('./routes/adminRoutes/page'));
app.use('/admin/faqs', require('./routes/adminRoutes/faq'));
app.use('/admin/plans', require('./routes/adminRoutes/plan'));
app.use('/admin/packages', require('./routes/adminRoutes/package'));
app.use('/admin/staff', require('./routes/adminRoutes/staff'));
app.use('/admin/users', require('./routes/adminRoutes/users'));


// Routes for Female User
app.use('/female-user', require('./routes/femaleUserRoutes/femaleUserRoutes'));  // Female User Registration & Info
// Routes for Female User
app.use('/female-user/favourites', require('./routes/femaleUserRoutes/favouritesRoutes'));  // Favourites Routes for FemaleUser
app.use('/female-user/chat', require('./routes/femaleUserRoutes/chatRoutes'));  // Female User Chat
app.use('/female-user/earnings', require('./routes/femaleUserRoutes/earningsRoutes'));  // Female User Earnings
app.use('/female-user/kyc', require('./routes/femaleUserRoutes/kycRoutes'));  // KYC Routes
app.use('/female-user/blocklist', require('./routes/femaleUserRoutes/blockListRoutes'));  // Blocklist Routes

// Routes for Male User
app.use('/male-user', require('./routes/maleUserRoutes/maleUserRoutes')); // Male User Routes
// Routes for Male User
app.use('/male-user/favourites', require('./routes/maleUserRoutes/favouritesRoutes'));  // Favourites Routes
app.use('/male-user/chat', require('./routes/maleUserRoutes/chatRoutes')); // Chat Routes
app.use('/male-user/blocklist', require('./routes/maleUserRoutes/blockListRoutes')); // Block List Routes
app.use('/male-user/profile', require('./routes/maleUserRoutes/profileRoutes')); // Profile Routes

// Routes for Agency User
app.use('/agency', require('./routes/agencyRoutes/agencyUserRoutes'));

// Error middleware
app.use(require('./middlewares/errorMiddleware'));

module.exports = app;
