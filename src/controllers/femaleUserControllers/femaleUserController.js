const FemaleUser = require('../../models/femaleUser/FemaleUser');
const generateToken = require('../../utils/generateToken');
const sendOtp = require('../../utils/sendOtp');
const FemaleImage = require('../../models/femaleUser/Image');

// Update user interests
exports.updateInterests = async (req, res) => {
  try {
    const { interestIds } = req.body;
    const userId = req.user._id;

    if (!interestIds || !Array.isArray(interestIds)) {
      return res.status(400).json({
        success: false,
        message: "Interest IDs array is required"
      });
    }

    const user = await FemaleUser.findByIdAndUpdate(
      userId,
      { interests: interestIds },
      { new: true }
    ).populate('interests', 'title');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      message: "Interests updated successfully",
      data: {
        interests: user.interests
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user languages
exports.updateLanguages = async (req, res) => {
  try {
    const { languageIds } = req.body;
    const userId = req.user._id;

    if (!languageIds || !Array.isArray(languageIds)) {
      return res.status(400).json({
        success: false,
        message: "Language IDs array is required"
      });
    }

    const user = await FemaleUser.findByIdAndUpdate(
      userId,
      { languages: languageIds },
      { new: true }
    ).populate('languages', 'title');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.json({
      success: true,
      message: "Languages updated successfully",
      data: {
        languages: user.languages
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// User Registration (Email and Mobile Number)
exports.registerUser = async (req, res) => {
  const { email, mobileNumber, referralCode } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP

  try {
    // Check if user already exists
    const existingUser = await FemaleUser.findOne({ $or: [{ email }, { mobileNumber }] });
    
    if (existingUser) {
      // If user exists but profile is not completed, allow re-registration
      if (!existingUser.profileCompleted) {
        // Delete the incomplete profile and allow fresh registration
        await FemaleUser.findByIdAndDelete(existingUser._id);
        // Continue with new registration below
      } else if (!existingUser.isVerified || !existingUser.isActive) {
        // Profile is complete but awaiting verification - resend OTP
        existingUser.otp = otp;
        await existingUser.save();
        await sendOtp(email, otp);
        
        return res.status(201).json({
          success: true,
          message: "OTP sent to your email for verification.",
          otp: otp // For testing purposes
        });
      } else {
        // User is already verified and active with complete profile
        return res.status(400).json({ 
          success: false, 
          message: "User already exists and is verified. Please login instead." 
        });
      }
    }

    // Create a temporary user entry with just email, mobile, and OTP
    // Profile details will be added after OTP verification
    const generateReferralCode = require('../../utils/generateReferralCode');
    let myReferral = generateReferralCode();
    while (await FemaleUser.findOne({ referralCode: myReferral })) {
      myReferral = generateReferralCode();
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

    const newUser = new FemaleUser({ 
      email, 
      mobileNumber, 
      otp, 
      referralCode: myReferral, 
      referredByFemale: referredByFemale?._id, 
      referredByAgency: referredByAgency?._id,
      isVerified: false,
      isActive: false,
      profileCompleted: false // Profile not completed yet
    });
    await newUser.save();
    await sendOtp(email, otp); // Send OTP via SendGrid

    res.status(201).json({
      success: true,
      message: "OTP sent to your email.",
      otp: otp // For testing purposes
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

    // Check if user has completed profile
    if (!user.profileCompleted) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please complete your profile first before logging in.' 
      });
    }

    // Registration review gate
    if (user.reviewStatus !== 'approved') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your registration is under review or rejected. Please wait for admin approval.' 
      });
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
      message: 'OTP sent to your email for login verification.',
      otp: otp // For testing purposes
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
      user.otp = undefined;   // Clear OTP after verification
      // NOTE: profileCompleted remains false until user completes profile
      // Referral bonus will be awarded after profile completion

      await user.save();
      res.json({ 
        success: true, 
        token,
        message: "OTP verified successfully. Please complete your profile to continue.",
        profileCompleted: false
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add Extra Information (Name, Age, Gender, etc.)
exports.addUserInfo = async (req, res) => {
  const { name, age, gender, bio, videoUrl, interests, languages } = req.body; // images is managed via upload endpoint
  try {
    const user = await FemaleUser.findById(req.user.id);
    user.name = name;
    user.age = age;
    user.gender = gender;
    user.bio = bio;
    user.videoUrl = videoUrl;
    user.interests = interests;
    user.languages = languages;
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Complete Profile - Must be called after OTP verification
// This marks the profile as complete and ready for admin review
exports.completeProfile = async (req, res) => {
  const { name, age, gender, bio, interests, languages } = req.body;
  
  try {
    const user = await FemaleUser.findById(req.user.id).populate('images');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if profile is already completed
    if (user.profileCompleted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Profile is already completed and under review.' 
      });
    }

    // Validate required fields for profile completion
    if (!name || !age || !gender || !bio) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, age, gender, and bio are required to complete profile.' 
      });
    }

    // Check if at least one image is uploaded
    if (!user.images || user.images.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image is required to complete profile.' 
      });
    }

    // Check if video is uploaded
    if (!user.videoUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'A video is required to complete profile.' 
      });
    }

    // Update user profile
    user.name = name;
    user.age = age;
    user.gender = gender;
    user.bio = bio;
    if (interests) user.interests = interests;
    if (languages) user.languages = languages;
    user.profileCompleted = true;
    user.reviewStatus = 'pending'; // Set review status to pending for admin approval

    // Award referral bonus after profile completion
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
          await Transaction.create({ 
            userType: 'female', 
            userId: referrer._id, 
            operationType: 'coin', 
            action: 'credit', 
            amount: FEMALE_BONUS, 
            message: `Referral bonus for inviting ${user.email}`, 
            balanceAfter: referrer.coinBalance, 
            createdBy: referrer._id 
          });
          await Transaction.create({ 
            userType: 'female', 
            userId: user._id, 
            operationType: 'coin', 
            action: 'credit', 
            amount: FEMALE_BONUS, 
            message: `Referral signup bonus using referral code`, 
            balanceAfter: user.coinBalance, 
            createdBy: user._id 
          });
          user.referralBonusAwarded = true;
        }
      } else if (user.referredByAgency) {
        user.coinBalance = (user.coinBalance || 0) + FEMALE_BONUS;
        await Transaction.create({ 
          userType: 'female', 
          userId: user._id, 
          operationType: 'coin', 
          action: 'credit', 
          amount: FEMALE_BONUS, 
          message: `Referral signup bonus via agency`, 
          balanceAfter: user.coinBalance, 
          createdBy: user._id 
        });
        user.referralBonusAwarded = true;
      }
    }

    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Profile completed successfully! Your account is now pending admin approval.',
      data: {
        profileCompleted: true,
        reviewStatus: 'pending'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Female User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await FemaleUser.findById(req.user.id).select('-otp').populate('images'); // Exclude OTP and populate images
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
  const { name, age, gender, bio, videoUrl, interests, languages } = req.body; // images is managed via upload endpoint
  try {
    const user = await FemaleUser.findById(req.user.id);
    if (name) user.name = name;
    if (age) user.age = age;
    if (gender) user.gender = gender;
    if (bio) user.bio = bio;
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

    const user = await FemaleUser.findById(req.user.id).populate('images');

    const currentCount = Array.isArray(user.images) ? user.images.length : 0;
    const remainingSlots = Math.max(0, 5 - currentCount);
    if (remainingSlots === 0) {
      return res.status(400).json({ success: false, message: 'Image limit reached. Maximum 5 images allowed.' });
    }

    const filesToProcess = req.files.slice(0, remainingSlots);
    const skipped = req.files.length - filesToProcess.length;

    const createdImageIds = [];
    for (const f of filesToProcess) {
      const newImage = await FemaleImage.create({ femaleUserId: req.user.id, imageUrl: f.path });
      createdImageIds.push(newImage._id);
    }

    user.images = [...(user.images || []).map(img => img._id ? img._id : img), ...createdImageIds];
    await user.save();

    return res.json({ success: true, message: 'Images uploaded successfully.', added: createdImageIds.length, skipped });
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
    const publicId = req.file.filename; // cloudinary public_id
    const resourceType = req.file.resource_type || 'video';
    const duration = req.file.duration;
    const bytes = req.file.bytes;
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
      // New structured payload for frontend consumers
      data: {
        url: videoUrl,
        secureUrl: videoUrl,
        publicId,
        resourceType,
        duration,
        bytes
      },
      // Backward compatibility
      videoUrl: videoUrl 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete an image by image id (owned by the authenticated female user)
exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const imageDoc = await FemaleImage.findById(imageId);
    if (!imageDoc) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    if (String(imageDoc.femaleUserId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this image' });
    }

    // Remove ref from user.images and delete image document
    await FemaleUser.updateOne({ _id: req.user.id }, { $pull: { images: imageDoc._id } });
    await FemaleImage.deleteOne({ _id: imageDoc._id });

    return res.json({ success: true, message: 'Image deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Cleanup incomplete profiles (can be run as a cron job or manually)
// Deletes profiles that are not completed within a specified time period
exports.cleanupIncompleteProfiles = async (req, res) => {
  try {
    // Delete profiles that are not completed and older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await FemaleUser.deleteMany({
      profileCompleted: false,
      createdAt: { $lt: sevenDaysAgo }
    });

    return res.json({ 
      success: true, 
      message: `Cleaned up ${result.deletedCount} incomplete profile(s)`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
