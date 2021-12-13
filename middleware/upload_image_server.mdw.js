import upload from "../utils/multer.js";
import multer from "multer";

export const uploadImageServerMiddleware = (req, res, next) => {
  const uploader = upload.single("image");
  uploader(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.json({ message: "Multer error when uploading" });
    } else if (err) {
      return res.json({ message: "Unknow error when uploading" });
    }
    next();
  });
};
