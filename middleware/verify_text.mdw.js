import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import FormData from "form-data";

import { readFile } from "fs/promises";
const bad_words_dic = JSON.parse(
  await readFile(new URL("../services/bad_words.json", import.meta.url))
);

const STATUS = {
  allowed: 1,
  warning: 2,
  denied: 3,
};

export const checkCaptionStatus = (caption) => {
  // Remember to add slide window size option
  if (caption === null || caption === undefined) {
    return "";
  }
  const word_list = caption?.split(" ");
  for (let word of word_list) {
    if (bad_words_dic[word.toLowerCase()]) {
      return STATUS["denied"];
    }
  }
  return STATUS["allowed"];
};

export const verifyTextMiddleware =
  (fieldNameBody) => async (req, res, next) => {
    let captionStatus = STATUS["allowed"];
    console.log("1");

    // Check null
    if (req.body[fieldNameBody] && req.body[fieldNameBody] === "") {
      //
      return res.json({ message: "Text is required" });
    }
    console.log("1");
    // Check bad words
    try {
      captionStatus = checkCaptionStatus(req.body[fieldNameBody]);
    } catch (error) {
      // logging
      console.log(error);
      return res.status(500).json({
        message: "Error occur in text verifying",
      });
    }

    if (
      captionStatus !== STATUS["denied"] &&
      req.body[fieldNameBody].split(" ").length >= 4
    ) {
      // Check caption 2
      try {
        let newForm = new FormData();
        newForm.append("text", req.body[fieldNameBody]);
        newForm.append("model_choice", "model_1");
        captionStatus = await axios.post(process.env.NLP_URL, newForm, {
          headers: { ...newForm.getHeaders() },
        });
        captionStatus =
          Number(captionStatus.data["result"]) === 1.0
            ? STATUS["allowed"]
            : STATUS["warning"];
      } catch (error) {
        // logging
        console.log(error);
        return res.status(500).json({
          message: "Error occur in pet-text verifying",
        });
      }
    }
    if (captionStatus === STATUS["denied"]) {
      return res.status(400).json({
        message: "Text is denied",
        status: captionStatus,
      });
    }
    next();
  };
