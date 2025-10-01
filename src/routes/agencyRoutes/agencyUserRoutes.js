const express = require('express');
const router = express.Router();
const agencyUserController = require('../../controllers/agencyControllers/agencyUserController');
const auth = require('../../middlewares/authMiddleware');
const parser = require('../../config/multer');

// Registration and OTP
router.post('/register', agencyUserController.agencyRegister);
router.post('/verify-otp', agencyUserController.agencyVerifyOtp);

// Login and verify
router.post('/login', agencyUserController.agencyLogin);
router.post('/verify-login-otp', agencyUserController.agencyVerifyLoginOtp);

// Profile
router.get('/me', auth, agencyUserController.agencyMe);
router.put('/details', auth, agencyUserController.agencySaveDetails);

// Upload image via form-data (field: image)
router.post('/upload-image', auth, parser.single('image'), agencyUserController.agencyUploadImage);

// KYC Routes
router.use('/kyc', require('./kycRoutes'));

module.exports = router;


