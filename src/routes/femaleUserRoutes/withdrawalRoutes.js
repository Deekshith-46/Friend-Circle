const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authMiddleware');
const ctrl = require('../../controllers/common/withdrawalController');

// Create withdrawal request (female)
router.post('/', auth, ctrl.createWithdrawalRequest);

// List my withdrawal requests
router.get('/', auth, ctrl.listMyWithdrawals);

module.exports = router;


