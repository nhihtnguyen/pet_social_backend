import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const MIN_CONFIDENCE = 0.4;
const A_CONFIDENCE = 0.7;
const STATUS = {
  allowed: 1,
  warning: 2,
  denied: 3,
};
const allowingClass = ["cat", "dog"];
const warningClass = ["person"];

export const checkImageStatus = (res) => {
  console.log("in temp", res);
  let allowed = 0;
  let warning = 0;
  for (let box of res) {
    if (box.confidence < 0.4) {
      continue;
    }
    if (box.confidence >= 0.7) {
      if (allowingClass.includes(box.name)) {
        allowed += 1;
        continue;
      }
      if (warningClass.includes(box.name)) {
        warning += 1;
        continue;
      }
    }

    if (allowingClass.includes(box.name)) {
      warning += 1;
      continue;
    }
    if (warningClass.includes(box.name)) {
      warning += 1;
      continue;
    }
  }

  if (allowed > 0) {
    return STATUS["allowed"];
  }
  if (warning > 0) {
    return STATUS["warning"];
  }
  return STATUS["denied"];
};

export const verifyImage = async (req, res, next) => {
  if (req.file) {
    let imageStatus = STATUS["allowed"];

    let newForm = new FormData();
    const file = await fs.readFileSync(req.file.path);
    newForm.append("file", file, req.file.originalname);
    newForm.append("model_choice", "last");
    newForm.append("result_type", "json");

    try {
      imageStatus = await axios.post(process.env.IMAGE_DETECTION_URL, newForm, {
        headers: {
          ...newForm.getHeaders(),
        },
      });
      imageStatus = checkImageStatus(imageStatus.data);
      console.log("imagestatus: ", imageStatus);
      if (imageStatus === STATUS["denied"]) {
        return res.json({ message: "Image is denied", status: imageStatus });
      }
      next();
    } catch (error) {
      // logging
      console.log(error);
      return res.json({
        message: "Error occur in service",
      });
    }
  }
};
