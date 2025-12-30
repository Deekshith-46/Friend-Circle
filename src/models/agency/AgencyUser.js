const mongoose = require('mongoose');

const agencyUserSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	mobileNumber: { type: String, required: true, unique: true },
	otp: {
		type: Number,
		required: function() {
			return !this.isVerified;
		}
	},
	isVerified: { type: Boolean, default: false },
	isActive: { type: Boolean, default: false }, // Only true after OTP verification
	firstName: { type: String },
	lastName: { type: String },
	aadharOrPanNum: { type: String },
	image: { type: String },
	referralCode: { type: String, unique: true, sparse: true },
	status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
	profileCompleted: { type: Boolean, default: false },
	reviewStatus: { type: String, enum: ['completeProfile', 'pending', 'accepted', 'rejected'], default: 'completeProfile' },
	kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('AgencyUser', agencyUserSchema);


