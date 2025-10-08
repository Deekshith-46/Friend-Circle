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
	firstName: { type: String },
	lastName: { type: String },
	aadharNumber: { type: String },
	panNumber: { type: String },
	image: { type: String },
	referralCode: { type: String, unique: true, sparse: true },
	status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
	reviewStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
	kycStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('AgencyUser', agencyUserSchema);


