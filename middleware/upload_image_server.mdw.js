import { upload } from "../utils/multer.js";
import multer from 'multer';

export const uploadImageServerMiddleware = async (req, res, next) => {
  const uploader = await upload.single("image");
  uploader(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.json({ message: "Multer error when uploading" });
    } else if (err) {
      res.json({ message: "Unknow error when uploading" });
    }
  });
  next();
};
