import dotenv from "dotenv";
dotenv.config();

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

export const uploadImageServerMiddleware = async (req, res, next) => {
  if (req.file) {
    let imageStatus = STATUS["allowed"];

    let newForm = new FormData();
    newForm.append("file", req.file);
    newForm.append("model_choice", "last");
    newForm.append("result_type", "json");

    try {
      imageStatus = await axiosClient.post("http://localhost:5000", newForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      imageStatus = checkImageStatus(imageStatus.data);
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
