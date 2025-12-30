const MaleUser = require('../../models/maleUser/MaleUser');
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const getUserId = require('../../utils/getUserId');
const Transaction = require('../../models/common/Transaction');
const AgencyUser = require('../../models/agency/AgencyUser');
const { isValidEmail, isValidMobile } = require('../../validations/validations');
const messages = require('../../validations/messages');

// Utility function to clean up invalid interests and languages references for a user
const cleanUpUserReferences = async (userId) => {
	try {
		const FemaleUser = require('../../models/femaleUser/FemaleUser');
		const Interest = require('../../models/admin/Interest');
		const Language = require('../../models/admin/Language');
		
		const user = await FemaleUser.findById(userId);
		if (!user) return null;
		
		let updateNeeded = false;
		let updatedInterests = [];
		let updatedLanguages = [];
		
		// Check and clean up interests
		if (user.interests && user.interests.length > 0) {
			const validInterests = await Interest.find({ 
				_id: { $in: user.interests } 
			});
			updatedInterests = validInterests.map(i => i._id);
			if (updatedInterests.length !== user.interests.length) {
				updateNeeded = true;
			}
		}
		
		// Check and clean up languages
		if (user.languages && user.languages.length > 0) {
			const validLanguages = await Language.find({ 
				_id: { $in: user.languages } 
			});
			updatedLanguages = validLanguages.map(l => l._id);
			if (updatedLanguages.length !== user.languages.length) {
				updateNeeded = true;
			}
		}
		
		// Update user if there are invalid references
		if (updateNeeded) {
			await FemaleUser.findByIdAndUpdate(userId, {
				interests: updatedInterests,
				languages: updatedLanguages
			});
			console.log(`Cleaned up references for user ${userId}`);
		}
		
		return {
			originalInterestsCount: user.interests ? user.interests.length : 0,
			validInterestsCount: updatedInterests.length,
			originalLanguagesCount: user.languages ? user.languages.length : 0,
			validLanguagesCount: updatedLanguages.length,
			cleaned: updateNeeded
		};
	} catch (error) {
		console.error('Error cleaning up user references:', error);
		return null;
	}
};

// Clean up user references (admin endpoint)
exports.cleanUserReferences = async (req, res) => {
	try {
		const { userId } = req.params;
		const result = await cleanUpUserReferences(userId);
		
		if (!result) {
			return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
		}
		
		return res.json({ 
			success: true, 
			message: messages.USER_MANAGEMENT.USER_REFERENCES_CLEANED,
			data: result 
		});
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// List users
exports.listUsers = async (req, res) => {
	try {
		const { type } = req.query; // 'male' | 'female' | 'agency' | undefined (all)
		let data;
		if (type === 'male') {
			data = await MaleUser.find();
		} else if (type === 'female') {
			data = await FemaleUser.find().populate({
				path: 'images',
				select: 'femaleUserId imageUrl createdAt updatedAt'
			}).populate({
				path: 'interests',
				select: 'title _id status'
			}).populate({
				path: 'languages',
				select: 'title _id status'
			});
		} else if (type === 'agency') {
			data = await AgencyUser.find();
		} else {
			const [males, females, agencies] = await Promise.all([
				MaleUser.find(),
				FemaleUser.find().populate({
					path: 'images',
					select: 'femaleUserId imageUrl createdAt updatedAt'
				}).populate({
					path: 'interests',
					select: 'title _id status'
				}).populate({
					path: 'languages',
					select: 'title _id status'
				}),
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
			return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_USER_TYPE });
		}
		if (!['active', 'inactive'].includes(status)) {
			return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_STATUS });
		}
		const Model = userType === 'male' ? MaleUser : FemaleUser;
		const user = await Model.findByIdAndUpdate(userId, { status }, { new: true });
		if (!user) return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
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
        if (!['wallet', 'coin'].includes(operationType)) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_OPERATION_TYPE });
        if (!['credit', 'debit'].includes(action)) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_ACTION });
        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_AMOUNT });

        const Model = userType === 'male' ? MaleUser : FemaleUser;
        const user = await Model.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });

        const balanceField = operationType === 'wallet' ? 'walletBalance' : 'coinBalance';
        const currentBalance = user[balanceField] || 0;
        const updatedBalance = action === 'credit' ? currentBalance + numericAmount : currentBalance - numericAmount;
        if (updatedBalance < 0) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INSUFFICIENT_BALANCE });

        user[balanceField] = updatedBalance;
        await user.save();

        const txn = await Transaction.create({
            userType,
            userId: user._id,
            operationType,
            action,
            amount: numericAmount,
            message: message || (action === 'credit' ? messages.USER_MANAGEMENT.BALANCE_CREDITED : messages.USER_MANAGEMENT.BALANCE_DEBITED),
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
        const { userType, userId, reviewStatus } = req.body; // userType: 'female' | 'agency'; reviewStatus: 'accepted' | 'rejected'
        if (!['female', 'agency'].includes(userType)) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_USER_TYPE });
        if (!['accepted', 'rejected'].includes(reviewStatus)) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_REVIEW_STATUS });
        const Model = userType === 'female' ? FemaleUser : AgencyUser;
        const user = await Model.findByIdAndUpdate(userId, { reviewStatus }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
        return res.json({ success: true, data: user });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Approve/Reject KYC by admin/staff
exports.reviewKYC = async (req, res) => {
    try {
        const { kycId, status, kycType, rejectionReason } = req.body; // status: 'approved' | 'rejected', kycType: 'female' | 'agency'
        if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_STATUS });
        if (!['female', 'agency'].includes(kycType)) return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_USER_KYC_TYPE });
        
        let kyc;
        if (kycType === 'female') {
            const FemaleKYC = require('../../models/femaleUser/KYC');
            kyc = await FemaleKYC.findByIdAndUpdate(kycId, { status, verifiedBy: req.admin?._id || req.staff?._id }, { new: true });
            if (!kyc) return res.status(404).json({ success: false, message: messages.USER_MANAGEMENT.FEMALE_KYC_NOT_FOUND });
            // Update FemaleUser kycStatus and kycDetails when KYC is approved
            if (status === 'approved') {
                // Update only the specific method that was approved
                const user = await FemaleUser.findById(kyc.user);
                
                // Initialize kycDetails with new structure if it doesn't exist or has old structure
                if (!user.kycDetails || !user.kycDetails.bank || !user.kycDetails.upi) {
                    user.kycDetails = {
                        bank: {},
                        upi: {}
                    };
                }
                
                const mongoose = require('mongoose');
                
                if (kyc.method === 'account_details' && kyc.accountDetails) {
                    // Update bank details with verified timestamp
                    user.kycDetails.bank = {
                        _id: user.kycDetails.bank._id || new mongoose.Types.ObjectId(),
                        name: kyc.accountDetails.name,
                        accountNumber: kyc.accountDetails.accountNumber,
                        ifsc: kyc.accountDetails.ifsc,
                        verifiedAt: new Date()
                    };
                } else if (kyc.method === 'upi_id' && kyc.upiId) {
                    // Update UPI details with verified timestamp
                    user.kycDetails.upi = {
                        _id: user.kycDetails.upi._id || new mongoose.Types.ObjectId(),
                        upiId: kyc.upiId,
                        verifiedAt: new Date()
                    };
                }
                
                // Set overall KYC status to approved
                user.kycStatus = 'approved';
                await user.save();
            } else if (status === 'rejected') {
                await FemaleUser.findByIdAndUpdate(kyc.user, { 
                    kycStatus: 'rejected',
                    kycDetails: { verifiedAt: new Date() }
                });
            }
        } else {
            const AgencyKYC = require('../../models/agency/KYC');
            kyc = await AgencyKYC.findByIdAndUpdate(kycId, { status, verifiedBy: req.admin?._id || req.staff?._id }, { new: true });
            if (!kyc) return res.status(404).json({ success: false, message: messages.USER_MANAGEMENT.AGENCY_KYC_NOT_FOUND });
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
            return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.INVALID_USER_TYPE });
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
            return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
        }

        return res.json({ 
            success: true, 
            message: messages.USER_MANAGEMENT.USER_DELETED_SUCCESS(userType),
            deletedUser: { id: user._id, email: user.email }
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Set coins per second rate for female user
exports.setFemaleCallRate = async (req, res) => {
    try {
        const { userId, coinsPerSecond } = req.body;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.USER_ID_REQUIRED });
        }
        
        if (coinsPerSecond === undefined || coinsPerSecond === null) {
            return res.status(400).json({ success: false, message: messages.USER_MANAGEMENT.COINS_PER_SECOND_REQUIRED });
        }
        
        const numericRate = Number(coinsPerSecond);
        if (!Number.isFinite(numericRate) || numericRate < 0) {
            return res.status(400).json({ 
                success: false, 
                message: messages.USER_MANAGEMENT.COINS_PER_SECOND_INVALID 
            });
        }
        
        const femaleUser = await FemaleUser.findByIdAndUpdate(
            userId,
            { coinsPerSecond: numericRate },
            { new: true }
        ).select('name email coinsPerSecond');
        
        if (!femaleUser) {
            return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
        }
        
        return res.json({
            success: true,
            message: messages.USER_MANAGEMENT.CALL_RATE_UPDATED(femaleUser.name, femaleUser.email),
            data: {
                userId: femaleUser._id,
                name: femaleUser.name,
                email: femaleUser.email,
                coinsPerSecond: femaleUser.coinsPerSecond
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};