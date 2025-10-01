const AdminUser = require('../../models/admin/AdminUser');
const Staff = require('../../models/admin/Staff');
const bcrypt = require('bcryptjs');
const generateToken = require('../../utils/generateToken');
const createAuditLog = require('../../utils/createAuditLog');

// Login Admin or Staff (unified login with user type selection)
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    if (userType === 'admin') {
      const admin = await AdminUser.findOne({ email });
      if (!admin) return res.status(400).json({ success: false, message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

      res.json({
        success: true,
        data: {
          token: generateToken(admin._id),
          user: { id: admin._id, name: admin.name, email: admin.email, type: 'admin' }
        }
      });
    } else if (userType === 'staff') {
      const staff = await Staff.findOne({ email, status: 'publish' });
      if (!staff) return res.status(400).json({ success: false, message: 'Invalid credentials or staff not active' });

      const isMatch = await bcrypt.compare(password, staff.passwordHash);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

      res.json({
        success: true,
        data: {
          token: generateToken(staff._id),
          user: { id: staff._id, email: staff.email, type: 'staff', permissions: staff.permissions }
        }
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user type' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Current Admin Profile
exports.getProfile = async (req, res) => {
  try {
    res.json({ success: true, data: req.admin });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Admin (name, password)
exports.updateAdmin = async (req, res) => {
  try {
    const { name, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10);

    const admin = await AdminUser.findByIdAndUpdate(req.admin._id, updateData, { new: true });
    await createAuditLog(req.admin._id, 'UPDATE', 'AdminUser', admin._id, updateData);

    res.json({ success: true, data: admin });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete Admin Account
exports.deleteAdmin = async (req, res) => {
  try {
    await AdminUser.findByIdAndDelete(req.admin._id);
    await createAuditLog(req.admin._id, 'DELETE', 'AdminUser', req.admin._id, {});
    res.json({ success: true, message: 'Admin account deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
