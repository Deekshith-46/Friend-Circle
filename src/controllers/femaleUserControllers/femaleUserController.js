const FemaleUser = require('../../models/femaleUser/FemaleUser');
const generateToken = require('../../utils/generateToken');
const sendOtp = require('../../utils/sendOtp');
const FemaleImage = require('../../models/femaleUser/Image');

// User Registration (Email and Mobile Number)
exports.registerUser = async (req, res) => {
  const { email, mobileNumber, referralCode } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP

  try {
    // Check if user already exists
    const existingUser = await FemaleUser.findOne({ $or: [{ email }, { mobileNumber }] });
    
    if (existingUser) {
      // If user exists but is not verified, allow re-registration
      if (!existingUser.isVerified || !existingUser.isActive) {
        // Update existing user with new OTP and referral info
        existingUser.otp = otp;
        existingUser.isVerified = false;
        existingUser.isActive = false;
        
        // Handle referral code if provided
        if (referralCode) {
          const FemaleModel = require('../../models/femaleUser/FemaleUser');
          const AgencyModel = require('../../models/agency/AgencyUser');
          const referredByFemale = await FemaleModel.findOne({ referralCode });
          if (referredByFemale) {
            existingUser.referredByFemale = referredByFemale._id;
            existingUser.referredByAgency = null;
          } else {
            const referredByAgency = await AgencyModel.findOne({ referralCode });
            if (referredByAgency) {
              existingUser.referredByAgency = referredByAgency._id;
              existingUser.referredByFemale = null;
            }
          }
        }
        
        await existingUser.save();
        await sendOtp(email, otp);
        
        return res.status(201).json({
          success: true,
          message: "OTP sent to your email for verification."
        });
      } else {
        // User is already verified and active
        return res.status(400).json({ 
          success: false, 
          message: "User already exists and is verified. Please login instead." 
        });
      }
    }

    // Link referral if provided: can be a FemaleUser or AgencyUser code
    let referredByFemale = null;
    let referredByAgency = null;
    if (referralCode) {
      const FemaleModel = require('../../models/femaleUser/FemaleUser');
      const AgencyModel = require('../../models/agency/AgencyUser');
      referredByFemale = await FemaleModel.findOne({ referralCode });
      if (!referredByFemale) {
        referredByAgency = await AgencyModel.findOne({ referralCode });
      }
    }

    // Ensure unique referral code for this user
    const generateReferralCode = require('../../utils/generateReferralCode');
    let myReferral = generateReferralCode();
    while (await FemaleUser.findOne({ referralCode: myReferral })) {
      myReferral = generateReferralCode();
    }

    const newUser = new FemaleUser({ 
      email, 
      mobileNumber, 
      otp, 
      referralCode: myReferral, 
      referredByFemale: referredByFemale?._id, 
      referredByAgency: referredByAgency?._id,
      isVerified: false,
      isActive: false
    });
    await newUser.save();
    await sendOtp(email, otp); // Send OTP via SendGrid

    res.status(201).json({
      success: true,
      message: "OTP sent to your email."
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Login Female User (Send OTP)
exports.loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await FemaleUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Registration review gate
    if (user.reviewStatus !== 'approved') {
      return res.status(403).json({ success: false, message: 'Your registration is under review or rejected.' });
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
  const { otp } = req.body;

  try {
    const user = await FemaleUser.findOne({ otp, isVerified: true });
    
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
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP or user not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// OTP Verification for Registration
exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await FemaleUser.findOne({ otp, isVerified: false });

    if (user) {
      const token = generateToken(user._id);
      user.isVerified = true; // Mark the user as verified
      user.isActive = true;   // Mark the user as active
      user.otp = undefined;   // Optionally clear OTP after verification

      // Award referral bonus once after verification
      if (!user.referralBonusAwarded && (user.referredByFemale || user.referredByAgency)) {
        const Transaction = require('../../models/common/Transaction');
        const FEMALE_BONUS = 15; // coins to both

        if (user.referredByFemale) {
          const FemaleModel = require('../../models/femaleUser/FemaleUser');
          const referrer = await FemaleModel.findById(user.referredByFemale);
          if (referrer) {
            referrer.coinBalance = (referrer.coinBalance || 0) + FEMALE_BONUS;
            user.coinBalance = (user.coinBalance || 0) + FEMALE_BONUS;
            await referrer.save();
            await Transaction.create({ userType: 'female', userId: referrer._id, operationType: 'coin', action: 'credit', amount: FEMALE_BONUS, message: `Referral bonus for inviting ${user.email}`, balanceAfter: referrer.coinBalance, createdBy: referrer._id });
            await Transaction.create({ userType: 'female', userId: user._id, operationType: 'coin', action: 'credit', amount: FEMALE_BONUS, message: `Referral signup bonus using referral code`, balanceAfter: user.coinBalance, createdBy: user._id });
            user.referralBonusAwarded = true;
          }
        } else if (user.referredByAgency) {
          // Agency refers female; only female gets bonus or both? Requirement says agency can refer to females. We'll credit the female only.
          user.coinBalance = (user.coinBalance || 0) + FEMALE_BONUS;
          await Transaction.create({ userType: 'female', userId: user._id, operationType: 'coin', action: 'credit', amount: FEMALE_BONUS, message: `Referral signup bonus via agency`, balanceAfter: user.coinBalance, createdBy: user._id });
          user.referralBonusAwarded = true;
        }
      }

      await user.save();
      res.json({ success: true, token });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add Extra Information (Name, Age, Gender, etc.)
exports.addUserInfo = async (req, res) => {
  const { name, age, gender, bio, images, videoUrl, interests, languages } = req.body;
  try {
    const user = await FemaleUser.findById(req.user.id);
    user.name = name;
    user.age = age;
    user.gender = gender;
    user.bio = bio;
    user.images = images;
    user.videoUrl = videoUrl;
    user.interests = interests;
    user.languages = languages;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Female User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await FemaleUser.findById(req.user.id).select('-otp'); // Exclude OTP
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update Female User Info
exports.updateUserInfo = async (req, res) => {
  const { name, age, gender, bio, images, videoUrl, interests, languages } = req.body;
  try {
    const user = await FemaleUser.findById(req.user.id);
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (bio) user.bio = bio;
    if (images) user.images = images;
    if (videoUrl) user.videoUrl = videoUrl;
    if (interests) user.interests = interests;
    if (languages) user.languages = languages;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete Female User Account
exports.deleteUser = async (req, res) => {
  try {
    await FemaleUser.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: 'User account deleted successfully.' });
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

    for (const url of uploadedUrls) {
      const newImage = new FemaleImage({ femaleUserId: req.user.id, imageUrl: url });
      await newImage.save();
    }

    const user = await FemaleUser.findById(req.user.id);
    user.images = Array.isArray(user.images) ? [...user.images, ...uploadedUrls] : uploadedUrls;
    await user.save();

    res.json({ success: true, message: 'Images uploaded successfully.', urls: uploadedUrls });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Upload Video (multipart form-data)
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video uploaded.' });
    }

    const videoUrl = req.file.path;
    const user = await FemaleUser.findById(req.user.id);
    
    // Delete old video if exists
    if (user.videoUrl) {
      // You might want to delete the old video from Cloudinary here
      // For now, we'll just replace the URL
    }
    
    user.videoUrl = videoUrl;
    await user.save();

    res.json({ 
      success: true, 
      message: 'Video uploaded successfully.', 
      videoUrl: videoUrl 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
