const MaleUser = require('../../models/maleUser/MaleUser');
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const getUserId = require('../../utils/getUserId');
const Transaction = require('../../models/common/Transaction');
const AgencyUser = require('../../models/agency/AgencyUser');

// List users
exports.listUsers = async (req, res) => {
	try {
		const { type } = req.query; // 'male' | 'female' | 'agency' | undefined (all)
		let data;
		if (type === 'male') {
			data = await MaleUser.find();
		} else if (type === 'female') {
			data = await FemaleUser.find();
		} else if (type === 'agency') {
			data = await AgencyUser.find();
		} else {
			const [males, females, agencies] = await Promise.all([
				MaleUser.find(),
				FemaleUser.find(),
				AgencyUser.find()
			]);
			data = { males, females, agencies };
		}
		return res.json({ success: true, data });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Toggle status active/inactive
exports.toggleStatus = async (req, res) => {
	try {
		const { userType, userId, status } = req.body; // userType: 'male' | 'female'; status: 'active' | 'inactive'
		if (!['male', 'female'].includes(userType)) {
			return res.status(400).json({ success: false, message: 'Invalid userType' });
		}
		if (!['active', 'inactive'].includes(status)) {
			return res.status(400).json({ success: false, message: 'Invalid status' });
		}
		const Model = userType === 'male' ? MaleUser : FemaleUser;
		const user = await Model.findByIdAndUpdate(userId, { status }, { new: true });
		if (!user) return res.status(404).json({ success: false, message: 'User not found' });
		return res.json({ success: true, data: user });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Wallet/Coin operation (credit/debit) for specific user
exports.operateBalance = async (req, res) => {
    try {
        const { userType, userId, operationType, action, amount, message } = req.body;
        if (!['male', 'female'].includes(userType)) return res.status(400).json({ success: false, message: 'Invalid userType' });
        if (!['wallet', 'coin'].includes(operationType)) return res.status(400).json({ success: false, message: 'Invalid operationType' });
        if (!['credit', 'debit'].includes(action)) return res.status(400).json({ success: false, message: 'Invalid action' });
        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

        const Model = userType === 'male' ? MaleUser : FemaleUser;
        const user = await Model.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const balanceField = operationType === 'wallet' ? 'walletBalance' : 'coinBalance';
        const currentBalance = user[balanceField] || 0;
        const updatedBalance = action === 'credit' ? currentBalance + numericAmount : currentBalance - numericAmount;
        if (updatedBalance < 0) return res.status(400).json({ success: false, message: 'Insufficient balance' });

        user[balanceField] = updatedBalance;
        await user.save();

        const txn = await Transaction.create({
            userType,
            userId: user._id,
            operationType,
            action,
            amount: numericAmount,
            message: message || (action === 'credit' ? 'Balance credited' : 'Balance debited'),
            balanceAfter: updatedBalance,
            createdBy: req.admin?._id || req.staff?._id
        });

        return res.json({ success: true, data: { userId: user._id, [balanceField]: updatedBalance, transaction: txn } });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Approve/Reject registration for female or agency
exports.reviewRegistration = async (req, res) => {
    try {
        const { userType, userId, reviewStatus } = req.body; // userType: 'female' | 'agency'; reviewStatus: 'approved' | 'rejected'
        if (!['female', 'agency'].includes(userType)) return res.status(400).json({ success: false, message: 'Invalid userType' });
        if (!['approved', 'rejected'].includes(reviewStatus)) return res.status(400).json({ success: false, message: 'Invalid reviewStatus' });
        const Model = userType === 'female' ? FemaleUser : AgencyUser;
        const user = await Model.findByIdAndUpdate(userId, { reviewStatus }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        return res.json({ success: true, data: user });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Approve/Reject KYC by admin/staff
exports.reviewKYC = async (req, res) => {
    try {
        const { kycId, status, kycType } = req.body; // status: 'approved' | 'rejected', kycType: 'female' | 'agency'
        if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
        if (!['female', 'agency'].includes(kycType)) return res.status(400).json({ success: false, message: 'Invalid kycType' });
        
        let kyc;
        if (kycType === 'female') {
            const FemaleKYC = require('../../models/femaleUser/KYC');
            kyc = await FemaleKYC.findByIdAndUpdate(kycId, { status, verifiedBy: req.admin?._id || req.staff?._id }, { new: true });
            if (!kyc) return res.status(404).json({ success: false, message: 'Female KYC not found' });
            // Update FemaleUser kycStatus when KYC is approved
            if (status === 'approved') {
                await FemaleUser.findByIdAndUpdate(kyc.user, { kycStatus: 'approved' });
            }
        } else {
            const AgencyKYC = require('../../models/agency/KYC');
            kyc = await AgencyKYC.findByIdAndUpdate(kycId, { status, verifiedBy: req.admin?._id || req.staff?._id }, { new: true });
            if (!kyc) return res.status(404).json({ success: false, message: 'Agency KYC not found' });
            // Update AgencyUser kycStatus when KYC is approved
            if (status === 'approved') {
                await AgencyUser.findByIdAndUpdate(kyc.user, { kycStatus: 'approved' });
            }
        }
        
        return res.json({ success: true, data: kyc });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// List pending registrations (female/agency) for admin review
exports.listPendingRegistrations = async (req, res) => {
    try {
        const { userType } = req.query; // 'female' | 'agency' | undefined (all)
        let data = {};
        if (!userType || userType === 'female') {
            data.females = await FemaleUser.find({ reviewStatus: 'pending' }).select('-otp -passwordHash');
        }
        if (!userType || userType === 'agency') {
            data.agencies = await AgencyUser.find({ reviewStatus: 'pending' }).select('-otp');
        }
        return res.json({ success: true, data });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// List pending KYCs for admin review
exports.listPendingKYCs = async (req, res) => {
    try {
        const FemaleKYC = require('../../models/femaleUser/KYC');
        const AgencyKYC = require('../../models/agency/KYC');
        
        const [femaleKycs, agencyKycs] = await Promise.all([
            FemaleKYC.find({ status: 'pending' }).populate('user', 'name email mobileNumber'),
            AgencyKYC.find({ status: 'pending' }).populate('user', 'firstName lastName email mobileNumber')
        ]);
        
        return res.json({ success: true, data: { femaleKycs, agencyKycs } });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};
// List transactions for a user with optional date filters
exports.listTransactions = async (req, res) => {
    try {
        const { userType, userId } = req.params;
        const { operationType, startDate, endDate } = req.query;
        if (!['male', 'female'].includes(userType)) return res.status(400).json({ success: false, message: 'Invalid userType' });

        const filter = { userType, userId };
        if (operationType && ['wallet', 'coin'].includes(operationType)) {
            filter.operationType = operationType;
        }
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const inclusiveEnd = new Date(endDate);
                inclusiveEnd.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = inclusiveEnd;
            }
        }

        const txns = await Transaction.find(filter).sort({ createdAt: -1 });
        return res.json({ success: true, data: txns });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Delete user by admin (for testing purposes)
exports.deleteUser = async (req, res) => {
    try {
        const { userType, userId } = req.params; // userType: 'male' | 'female' | 'agency'
        if (!['male', 'female', 'agency'].includes(userType)) {
            return res.status(400).json({ success: false, message: 'Invalid userType' });
        }

        let Model;
        if (userType === 'male') {
            Model = MaleUser;
        } else if (userType === 'female') {
            Model = FemaleUser;
        } else {
            Model = AgencyUser;
        }

        const user = await Model.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.json({ 
            success: true, 
            message: `${userType} user deleted successfully`,
            deletedUser: { id: user._id, email: user.email }
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};


