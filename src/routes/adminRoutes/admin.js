const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authMiddleware');
const { dynamicPermissionCheck } = require('../../middlewares/permissionMiddleware');
const { parser } = require('../../config/multer');
const controller = require('../../controllers/adminControllers/adminController');

router.post('/login', controller.loginAdmin);
router.get('/me', auth, controller.getProfile);
router.put('/me', auth, controller.updateAdmin);
// Delete Admin Account
router.delete('/me', auth, controller.deleteAdmin);

// Admin Config Routes
router.get('/config', auth, dynamicPermissionCheck, controller.getAdminConfig);
router.post('/config/min-call-coins', auth, dynamicPermissionCheck, parser.none(), controller.updateMinCallCoins);
router.post('/config/coin-to-rupee-rate', auth, dynamicPermissionCheck, parser.none(), controller.updateCoinToRupeeRate);
router.post('/config/min-withdrawal-amount', auth, dynamicPermissionCheck, parser.none(), controller.updateMinWithdrawalAmount);

module.exports = router;