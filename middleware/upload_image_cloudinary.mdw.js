import { uploadSingle } from '../services/cloudinary_service.js';

export const uploadImageCloudinaryMiddleware = async (req, res, next) => {
  if (req.file) {
    try {
      const result = await uploadSingle(req.file.path, 'post_uploaded_images');
      req.body.media_URL = result.url;
    } catch (err) {
      return res.json({ message: err.message });
    }
    next();
  } else {
    next();
  }
};
