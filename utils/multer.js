import multer, { MulterError } from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { __dirname } from "../app.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "uploaded_images");
    fs.mkdir(dir, (err) => cb(null, "uploaded_images"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${new Date().valueOf()}${crypto
        .createHash("md5")
        .update(file.fieldname)
        .digest("hex")}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new MulterError(-1, "Unsupported file format"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
