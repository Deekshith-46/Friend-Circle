const bcrypt = require('bcryptjs');
const Staff = require('../../models/admin/Staff');

// Create staff (by admin)
exports.createStaff = async (req, res) => {
	try {
		const { email, password, status, permissions } = req.body;
		if (!email || !password) {
			return res.status(400).json({ success: false, message: 'Email and password are required.' });
		}
		const existing = await Staff.findOne({ email });
		if (existing) {
			return res.status(400).json({ success: false, message: 'Staff email already exists.' });
		}
		const passwordHash = await bcrypt.hash(password, 10);
		const staff = new Staff({
			adminId: req.admin._id,
			email,
			passwordHash,
			status: status === 'unpublish' ? 'unpublish' : 'publish',
			permissions: permissions || {}
		});
		await staff.save();
		return res.status(201).json({ success: true, data: staff });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Update staff by id (partial update by admin)
exports.updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, status, permissions } = req.body;

        const update = {};
        if (email) update.email = email;
        if (typeof status === 'string') {
            update.status = status === 'unpublish' ? 'unpublish' : 'publish';
        }
        if (permissions && typeof permissions === 'object') {
            update.permissions = permissions;
        }
        if (password) {
            update.passwordHash = await bcrypt.hash(password, 10);
        }

        const staff = await Staff.findByIdAndUpdate(id, update, { new: true });
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff not found' });
        }
        return res.json({ success: true, data: staff });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// List all staff (by admin)
exports.listStaff = async (_req, res) => {
	try {
		const staff = await Staff.find().populate('adminId', 'name email');
		return res.json({ success: true, data: staff });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Delete staff by id (by admin)
exports.deleteStaff = async (req, res) => {
	try {
		const { id } = req.params;
		await Staff.findByIdAndDelete(id);
		return res.json({ success: true, message: 'Staff deleted.' });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};


