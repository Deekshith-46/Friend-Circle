const MaleUser = require('../../models/maleUser/MaleUser');
const Image = require('../../models/maleUser/Image');
const Package = require('../../models/maleUser/Package');
const generateToken = require('../../utils/generateToken');  // Utility function to generate JWT token
const sendOtp = require('../../utils/sendOtp');  // Utility function to send OTP via email

// Register Male User and Send OTP
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000);  // Generate 4-digit OTP

  try {
    // Check if the email is already registered
    const existingUser = await MaleUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Create a new MaleUser
    const newUser = new MaleUser({ firstName, lastName, email, password, otp });
    await newUser.save();

    // Send OTP via email (using a utility function like SendGrid or any mail service)
    await sendOtp(email, otp);  // Assumed that sendOtp function handles OTP sending

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Login Male User (Send OTP)
exports.loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await MaleUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: 'Please verify your account first.' });
    }
    // Check if user is active
    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated by admin or staff.' });
    }

    // Generate new OTP for login
    const otp = Math.floor(1000 + Math.random() * 9000);
    user.otp = otp;
    await user.save();

    // Send OTP via email
    await sendOtp(email, otp);

    res.json({
      success: true,
      message: 'OTP sent to your email for login verification.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify Login OTP
exports.verifyLoginOtp = async (req, res) => {
  const {  otp } = req.body;

  try {
    const user = await MaleUser.findOne({ otp, isVerified: true });
    
    if (user) {
      // Clear OTP after successful login
      user.otp = undefined;
      await user.save();

      // Generate JWT token
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP or user not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify OTP and activate the user's account
exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await MaleUser.findOne({ otp, isVerified: false });

    if (user) {
      user.isVerified = true;  // Mark the user as verified
      user.otp = undefined;  // Clear OTP after verification
      await user.save();

      const token = generateToken(user._id);  // Generate JWT token

      res.json({
        success: true,
        message: 'OTP verified successfully.',
        token
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP or OTP already used.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Upload Images (multipart form-data)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    const uploadedUrls = req.files.map((f) => f.path);

    // Save each image in Image collection
    for (const url of uploadedUrls) {
      const newImage = new Image({ maleUserId: req.user.id, imageUrl: url });
      await newImage.save();
    }

    // Also persist to MaleUser.images array
    const user = await MaleUser.findById(req.user.id);
    user.images = Array.isArray(user.images) ? [...user.images, ...uploadedUrls] : uploadedUrls;
    await user.save();

    res.json({ success: true, message: 'Images uploaded successfully.', urls: uploadedUrls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Buy Coins
exports.buyCoins = async (req, res) => {
  const { packageId } = req.body;
  try {
    const selectedPackage = await Package.findById(packageId);
    const maleUser = await MaleUser.findById(req.user.id);
    maleUser.balance += selectedPackage.coins;
    await maleUser.save();
    res.json({ success: true, message: `Coins added: ${selectedPackage.coins}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
