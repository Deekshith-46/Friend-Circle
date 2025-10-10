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

module.exports = { parser, videoParser };
