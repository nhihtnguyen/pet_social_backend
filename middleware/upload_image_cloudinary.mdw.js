import { uploadSingle } from "../services/cloudinary_service.js";

export const uploadImageCloudinaryMiddleware = async (req, res, next) => {
  try {
    const result = await uploadSingle(req.file.path, "post_uploaded_images");
    req.body.media_URL = result.url;
  } catch (err) {
    res.json({ message: err.message });
  }
  next();
};