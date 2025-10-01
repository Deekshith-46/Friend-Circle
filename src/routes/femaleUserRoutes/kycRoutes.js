// /routes/femaleUserRoutes/kycRoutes.js
const express = require('express');
const router = express.Router();
const kycController = require('../../controllers/femaleUserControllers/kycController');
const auth = require('../../middlewares/authMiddleware');

// Submit KYC
router.post('/submit-kyc', auth, kycController.submitKYC);

// Admin verification of KYC
router.post('/verify-kyc', auth, kycController.verifyKYC);

module.exports = router;
