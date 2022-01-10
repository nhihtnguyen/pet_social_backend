import bad_words_dic from "../services/bad_words.json";

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
    // Check null
    if (req.body[fieldNameBody] && req.body[fieldNameBody].strip() === "") {
      //
      return res.json({ message: "Text is required" });
    }

    // Check bad words
    try {
      captionStatus = checkCaptionStatus(req.body[fieldNameBody]);
    } catch (error) {
      // logging
      console.log(error);
      return res.json({
        message: "Error occur in text verifying",
      });
    }

    if (
      captionStatus !== STATUS["denied"] &&
      data.caption.split(" ").length >= 4
    ) {
      // Check caption 2
      try {
        let newForm = new FormData();
        newForm.append("text", req.body[fieldNameBody]);
        newForm.append("model_choice", "model_1");
        captionStatus = await axiosClient.post(
          "http://localhost:5005/text",
          newForm,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        captionStatus =
          Number(captionStatus.data["result"]) === 1.0
            ? STATUS["allowed"]
            : STATUS["warning"];
        if (captionStatus === STATUS["denied"]) {
          return res.json({
            message: "Text is denied",
            status: captionStatus,
          });
        }
        next();
      } catch (error) {
        // logging
        console.log(error);
        return res.json({
          message: "Error occur in pet-text verifying",
        });
      }
    }
  };
