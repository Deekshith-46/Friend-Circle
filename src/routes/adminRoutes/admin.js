const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/authMiddleware');
const controller = require('../../controllers/adminControllers/adminController');

router.post('/login', controller.loginAdmin);
router.get('/me', auth, controller.getProfile);
router.put('/me', auth, controller.updateAdmin);
// Delete Admin Account
router.delete('/me', auth, controller.deleteAdmin);

module.exports = router;
