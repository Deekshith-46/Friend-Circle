const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Image storage configuration
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'admin_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Combined storage for profile completion (handles both images and videos)
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === 'images') {
      return {
        folder: 'admin_uploads',
        allowed_formats: ['jpg', 'jpeg', 'png'],
      };
    } else if (file.fieldname === 'video') {
      return {
        folder: 'female_videos',
        allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
        resource_type: 'video',
      };
    }
    return {
      folder: 'misc_uploads',
    };
  },
});

// Video storage configuration
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'female_videos',
    allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
    resource_type: 'video',
  },
});

const parser = multer({ storage: imageStorage });
const videoParser = multer({ 
  storage: videoStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  }
});

// Combined parser for profile completion (images + video)
const profileParser = multer({
  storage: profileStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

module.exports = { parser, videoParser, profileParser };
