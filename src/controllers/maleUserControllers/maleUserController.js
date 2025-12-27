const MaleUser = require('../../models/maleUser/MaleUser');
const Image = require('../../models/maleUser/Image');
const FemaleUser = require('../../models/femaleUser/FemaleUser');
const MaleBlockList = require('../../models/maleUser/BlockList');
const FemaleBlockList = require('../../models/femaleUser/BlockList');
const Package = require('../../models/maleUser/Package');
const AdminConfig = require('../../models/admin/AdminConfig');
const generateToken = require('../../utils/generateToken');  // Utility function to generate JWT token
const generateReferralCode = require('../../utils/generateReferralCode');
const Transaction = require('../../models/common/Transaction');
const sendOtp = require('../../utils/sendOtp');  // Utility function to send OTP via email
const { isValidEmail, isValidMobile } = require('../../validations/validations');
const messages = require('../../validations/messages');

// Update user interests
exports.updateInterests = async (req, res) => {
  try {
    const { interestIds } = req.body;
    const userId = req.user._id;

    if (!interestIds || !Array.isArray(interestIds)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.INTEREST_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { interests: interestIds },
      { new: true }
    ).populate('interests', 'title');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
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
        message: messages.PROFILE.LANGUAGE_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { languages: languageIds },
      { new: true }
    ).populate('languages', 'title');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
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

// Update user hobbies
exports.updateHobbies = async (req, res) => {
  try {
    const { hobbies } = req.body;
    const userId = req.user._id;

    if (!hobbies || !Array.isArray(hobbies)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.HOBBIES_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { hobbies: hobbies },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Hobbies updated successfully",
      data: {
        hobbies: user.hobbies
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user sports
exports.updateSports = async (req, res) => {
  try {
    const { sports } = req.body;
    const userId = req.user._id;

    if (!sports || !Array.isArray(sports)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.SPORTS_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { sports: sports },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Sports updated successfully",
      data: {
        sports: user.sports
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user film preferences
exports.updateFilm = async (req, res) => {
  try {
    const { film } = req.body;
    const userId = req.user._id;

    if (!film || !Array.isArray(film)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.FILM_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { film: film },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Film preferences updated successfully",
      data: {
        film: user.film
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user music preferences
exports.updateMusic = async (req, res) => {
  try {
    const { music } = req.body;
    const userId = req.user._id;

    if (!music || !Array.isArray(music)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.MUSIC_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { music: music },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Music preferences updated successfully",
      data: {
        music: user.music
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Update user travel preferences
exports.updateTravel = async (req, res) => {
  try {
    const { travel } = req.body;
    const userId = req.user._id;

    if (!travel || !Array.isArray(travel)) {
      return res.status(400).json({
        success: false,
        message: messages.PROFILE.TRAVEL_REQUIRED
      });
    }

    const user = await MaleUser.findByIdAndUpdate(
      userId,
      { travel: travel },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.COMMON.USER_NOT_FOUND
      });
    }

    return res.json({
      success: true,
      message: "Travel preferences updated successfully",
      data: {
        travel: user.travel
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Register Male User and Send OTP
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, referralCode } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000);  // Generate 4-digit OTP

  try {
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }

    // Check if the email is already registered
    const existingUser = await MaleUser.findOne({ email });
    
    if (existingUser) {
      // If user exists but is not verified, allow re-registration
      if (!existingUser.isVerified || !existingUser.isActive) {
        // Update existing user with new OTP and referral info
        existingUser.otp = otp;
        existingUser.isVerified = false;
        existingUser.isActive = false;
        
        // Handle referral code if provided
        if (referralCode) {
          const referredByUser = await MaleUser.findOne({ referralCode });
          if (referredByUser) {
            existingUser.referredBy = referredByUser._id;
          }
        }
        
        await existingUser.save();
        await sendOtp(email, otp);
        
        return res.status(201).json({
          success: true,
          message: messages.AUTH.OTP_SENT_EMAIL,
          referralCode: existingUser.referralCode,
          otp: otp // For testing purposes
        });
      } else {
        // User is already verified and active
        return res.status(400).json({ 
          success: false, 
          message: messages.AUTH.USER_ALREADY_EXISTS
        });
      }
    }

    // Prepare referral linkage if provided and valid
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await MaleUser.findOne({ referralCode });
    }

    // Ensure unique referral code
    let myReferral = generateReferralCode();
    while (await MaleUser.findOne({ referralCode: myReferral })) {
      myReferral = generateReferralCode();
    }

    // Create a new MaleUser
    const newUser = new MaleUser({ 
      firstName, 
      lastName, 
      email, 
      password, 
      otp, 
      referredBy: referredByUser?._id, 
      referralCode: myReferral,
      isVerified: false,
      isActive: false
    });
    await newUser.save();

    // Send OTP via email (using a utility function like SendGrid or any mail service)
    await sendOtp(email, otp);  // Assumed that sendOtp function handles OTP sending

    res.status(201).json({
      success: true,
      message: messages.AUTH.OTP_SENT_EMAIL,
      referralCode: newUser.referralCode,
      otp: otp // For testing purposes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Login Male User (Send OTP)
exports.loginUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }

    // Check if the user exists
    const user = await MaleUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: messages.AUTH.ACCOUNT_NOT_VERIFIED });
    }
    // Check if user is active
    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: messages.AUTH.ACCOUNT_DEACTIVATED });
    }

    // Generate new OTP for login
    const otp = Math.floor(1000 + Math.random() * 9000);
    user.otp = otp;
    await user.save();

    // Send OTP via email
    await sendOtp(email, otp);

    res.json({
      success: true,
      message: messages.AUTH.OTP_SENT_LOGIN,
      otp: otp // For testing purposes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify Login OTP
exports.verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Validate email if provided
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }

    // If email is provided, look for user by both email and otp
    // If only otp is provided, look for user by otp who is verified
    let user;
    if (email) {
      user = await MaleUser.findOne({ email, otp, isVerified: true });
    } else if (otp) {
      user = await MaleUser.findOne({ otp, isVerified: true });
    } else {
      return res.status(400).json({ success: false, message: messages.COMMON.EMAIL_OR_OTP_REQUIRED });
    }
    
    if (user) {
      // Clear OTP after successful login
      user.otp = undefined;
      await user.save();

      // Generate JWT token
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: messages.AUTH.LOGIN_SUCCESS,
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } else {
      res.status(400).json({ success: false, message: messages.COMMON.INVALID_OTP });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify OTP and complete registration
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Validate email if provided
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: messages.COMMON.INVALID_EMAIL
      });
    }

    // If email is provided, look for user by both email and otp
    // If only otp is provided, look for user by otp who is not yet verified
    let user;
    if (email) {
      user = await MaleUser.findOne({ email, otp });
    } else if (otp) {
      user = await MaleUser.findOne({ otp, isVerified: false });
    } else {
      return res.status(400).json({ success: false, message: messages.COMMON.EMAIL_OR_OTP_REQUIRED });
    }
    
    if (!user) {
      return res.status(400).json({ success: false, message: messages.COMMON.INVALID_OTP });
    }
    
    // Get admin config for referral bonus
    const adminConfig = await AdminConfig.getConfig();
    const referralBonusAmount = adminConfig.referralBonus || 100; // Default to 100 coins if not set
    
    user.isVerified = true;
    user.isActive = true;    // Mark the user as active
    user.otp = undefined;  // Clear OTP after verification

    // Award referral bonus once after verification
    if (!user.referralBonusAwarded && user.referredBy) {
      const referrer = await MaleUser.findById(user.referredBy);
      if (referrer) {
        // Add referral bonus to coinBalance for male users (not walletBalance)
        referrer.coinBalance = (referrer.coinBalance || 0) + referralBonusAmount;
        user.coinBalance = (user.coinBalance || 0) + referralBonusAmount;
        await referrer.save();

        // Record transactions for both
        await Transaction.create({
          userType: 'male',
          userId: referrer._id,
          operationType: 'coin',
          action: 'credit',
          amount: referralBonusAmount,
          message: `Referral bonus for inviting ${user.email}`,
          balanceAfter: referrer.coinBalance,
          createdBy: referrer._id
        });
        await Transaction.create({
          userType: 'male',
          userId: user._id,
          operationType: 'coin',
          action: 'credit',
          amount: referralBonusAmount,
          message: `Referral signup bonus using ${referrer.referralCode}`,
          balanceAfter: user.coinBalance,
          createdBy: user._id
        });

        user.referralBonusAwarded = true;
      }
    }

    await user.save();

    res.json({ 
      success: true, 
      message: messages.AUTH.OTP_VERIFIED,
      data: {
        token: generateToken(user._id),
        user: {
          id: user._id,
          email: user.email,
          isVerified: user.isVerified,
          isActive: user.isActive
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Upload Images (multipart form-data)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: messages.IMAGE.NO_IMAGES });
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

    res.json({ success: true, message: messages.IMAGE.IMAGE_UPLOAD_SUCCESS, urls: uploadedUrls });
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
    res.json({ success: true, message: messages.COINS.COINS_ADDED(selectedPackage.coins) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get Male User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await MaleUser.findById(req.user.id)
      .select('-otp -password')
      .populate('interests', 'title')
      .populate('languages', 'title');
      
    if (!user) {
      return res.status(404).json({ success: false, message: messages.COMMON.USER_NOT_FOUND });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// List/browse female users for male users (paginated)
exports.listFemaleUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    // Get list of users that the current male user has blocked
    const blockedByCurrentUser = await MaleBlockList.find({ maleUserId: req.user.id }).select('blockedUserId');
    const blockedByCurrentUserIds = blockedByCurrentUser.map(block => block.blockedUserId);
    
    // Get list of users who have blocked the current male user
    const blockedByOthers = await FemaleBlockList.find({ blockedUserId: req.user.id }).select('femaleUserId');
    const blockedByOthersIds = blockedByOthers.map(block => block.femaleUserId);

    const filter = { 
      status: 'active', 
      reviewStatus: 'approved',
      _id: { 
        $nin: [...blockedByCurrentUserIds, ...blockedByOthersIds] // Exclude users blocked by either party
      }
    };

    const [items, total] = await Promise.all([
      FemaleUser.find(filter)
        .select('name age bio images')
        .populate({ path: 'images', select: 'imageUrl', options: { limit: 1 } })
        .skip(skip)
        .limit(limit)
        .lean(),
      FemaleUser.countDocuments(filter)
    ]);

    const data = items.map((u) => ({
      _id: u._id,
      name: u.name,
      age: u.age,
      bio: u.bio,
      avatarUrl: Array.isArray(u.images) && u.images[0] ? u.images[0].imageUrl : null
    }));

    return res.json({ success: true, page, limit, total, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Delete an image by image id (owned by the authenticated male user)
exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const imageDoc = await Image.findById(imageId);
    if (!imageDoc) {
      return res.status(404).json({ success: false, message: messages.USER.IMAGE_NOT_FOUND });
    }
    if (String(imageDoc.maleUserId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: messages.USER.NOT_AUTHORIZED_DELETE_IMAGE });
    }
    await Image.deleteOne({ _id: imageDoc._id });

    // Remove url from MaleUser.images array if it exists there
    try {
      const user = await MaleUser.findById(req.user.id);
      if (Array.isArray(user.images)) {
        user.images = user.images.filter((url) => url !== imageDoc.imageUrl);
        await user.save();
      }
    } catch (_) {}

    return res.json({ success: true, message: messages.IMAGE.IMAGE_DELETED });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};