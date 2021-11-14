import multer from "multer";
import path from "path";
import { __dirname } from "../app.js";
import fs from "fs";

export default multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, "uploaded_images");
      fs.mkdir(dir, (err) => cb(null, dir));
    },
  }),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
