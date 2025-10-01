const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authMiddleware');
const { dynamicPermissionCheck } = require('../../middlewares/permissionMiddleware');
const parser = require('../../config/multer');
const controller = require('../../controllers/adminControllers/userManagementController');

// List users (all/male/female) => query ?type=male|female
router.get('/', auth, dynamicPermissionCheck, controller.listUsers);

// Toggle status (accepts form-data or JSON)
router.post('/toggle-status', auth, dynamicPermissionCheck, parser.none(), controller.toggleStatus);

// Wallet/Coin operations for a user (accepts JSON or form-data)
router.post('/operate-balance', auth, dynamicPermissionCheck, parser.none(), controller.operateBalance);

// List transactions for a user with optional filters
router.get('/:userType/:userId/transactions', auth, dynamicPermissionCheck, controller.listTransactions);

// Approve/Reject registration review (female or agency)
router.post('/review-registration', auth, dynamicPermissionCheck, parser.none(), controller.reviewRegistration);

// Approve/Reject KYC
router.post('/review-kyc', auth, dynamicPermissionCheck, parser.none(), controller.reviewKYC);

// List pending registrations for admin review
router.get('/pending-registrations', auth, dynamicPermissionCheck, controller.listPendingRegistrations);

// List pending KYCs for admin review
router.get('/pending-kycs', auth, dynamicPermissionCheck, controller.listPendingKYCs);

module.exports = router;


