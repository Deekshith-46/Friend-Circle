const AgencyUser = require('../../models/agency/AgencyUser');
const AgencyImage = require('../../models/agency/Image');
const generateToken = require('../../utils/generateToken');
const sendOtp = require('../../utils/sendOtp');

// Agency signup: email + mobileNumber => create, send OTP to email
exports.agencyRegister = async (req, res) => {
	const { email, mobileNumber } = req.body;
	const otp = Math.floor(1000 + Math.random() * 9000);
	try {
		const existing = await AgencyUser.findOne({ $or: [{ email }, { mobileNumber }] });
		
		if (existing) {
			// If agency exists but is not verified, allow re-registration
			if (!existing.isVerified || !existing.isActive) {
				// Update existing agency with new OTP
				existing.otp = otp;
				existing.isVerified = false;
				existing.isActive = false;
				await existing.save();
				await sendOtp(email, otp);
				
				return res.status(201).json({ 
					success: true, 
					message: 'OTP sent to your email for verification.',
					otp: otp // For testing purposes
				});
			} else {
				// Agency is already verified and active
				return res.status(400).json({ 
					success: false, 
					message: 'Agency already exists and is verified. Please login instead.' 
				});
			}
		}
		
		const agency = new AgencyUser({ 
			email, 
			mobileNumber, 
			otp,
			isVerified: false,
			isActive: false
		});
		await agency.save();
		await sendOtp(email, otp);
		return res.status(201).json({ success: true, message: 'OTP sent to your email.', otp: otp }); // For testing purposes
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Verify registration OTP
exports.agencyVerifyOtp = async (req, res) => {
	const { otp } = req.body;
	try {
		const agency = await AgencyUser.findOne({ otp, isVerified: false });
		if (!agency) return res.status(400).json({ success: false, message: 'Invalid OTP' });
		agency.isVerified = true;
		agency.isActive = true;
		agency.otp = undefined;
		agency.status = 'active';
		await agency.save();
		const token = generateToken(agency._id);
		return res.json({ success: true, token });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Login (email only) => send OTP
exports.agencyLogin = async (req, res) => {
	const { email } = req.body;
	try {
		const agency = await AgencyUser.findOne({ email });
		if (!agency) return res.status(404).json({ success: false, message: 'Agency not found.' });
    if (agency.reviewStatus !== 'approved') return res.status(403).json({ success: false, message: 'Your registration is under review or rejected.' });
		if (!agency.isVerified) return res.status(400).json({ success: false, message: 'Please verify your account first.' });
		const otp = Math.floor(1000 + Math.random() * 9000);
		agency.otp = otp;
		await agency.save();
		await sendOtp(email, otp);
		return res.json({ success: true, message: 'OTP sent to your email for login verification.', otp: otp }); // For testing purposes
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Verify login OTP
exports.agencyVerifyLoginOtp = async (req, res) => {
	const { otp } = req.body;
	try {
		const agency = await AgencyUser.findOne({ otp, isVerified: true });
		if (!agency) return res.status(400).json({ success: false, message: 'Invalid OTP' });
		agency.otp = undefined;
		await agency.save();
		const token = generateToken(agency._id);
		return res.json({ success: true, message: 'Login successful.', token });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Save profile details
exports.agencySaveDetails = async (req, res) => {
	const { firstName, lastName, aadharNumber, panNumber, referralCode } = req.body;
	try {
		const agency = await AgencyUser.findById(req.user.id);
		if (!agency) return res.status(404).json({ success: false, message: 'Agency not found' });
		if (firstName !== undefined) agency.firstName = firstName;
		if (lastName !== undefined) agency.lastName = lastName;
		if (aadharNumber !== undefined) agency.aadharNumber = aadharNumber;
		if (panNumber !== undefined) agency.panNumber = panNumber;
		if (referralCode !== undefined) agency.referralCode = referralCode;
		await agency.save();
		return res.json({ success: true, data: agency });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Upload single image via Cloudinary form-data
exports.agencyUploadImage = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ success: false, message: 'No image uploaded.' });
		}
		const imageUrl = req.file.path;
		const record = new AgencyImage({ agencyUserId: req.user.id, imageUrl });
		await record.save();
		const agency = await AgencyUser.findById(req.user.id);
		agency.image = imageUrl;
		await agency.save();
		return res.json({ success: true, message: 'Image uploaded successfully.', url: imageUrl });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};

// Get profile
exports.agencyMe = async (req, res) => {
	try {
		const agency = await AgencyUser.findById(req.user.id).select('-otp');
		if (!agency) return res.status(404).json({ success: false, message: 'Agency not found' });
		return res.json({ success: true, data: agency });
	} catch (err) {
		return res.status(500).json({ success: false, error: err.message });
	}
};


