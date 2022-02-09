import { Router } from "express";
import { uploadImageServerMiddleware } from "../middleware/upload_image_server.mdw.js";
import { uploadImageCloudinaryMiddleware } from "../middleware/upload_image_cloudinary.mdw.js";
import { verifyImage } from "../middleware/verify_image.mdw.js";
import { verifyTextMiddleware } from "../middleware/verify_text.mdw.js";
import { PostController } from "../controllers/post.js";
import passport from "passport";
const router = Router();

const controller = new PostController();
router.get("/user/:id", (req, res) => controller.getByUserID(req, res));

//router.get("/", (req, res) => controller.getAll(req, res));
router.get("/explore", (req, res) => controller.getExplore(req, res));
//router.get("/recommend", (req, res) => controller.getAll(req, res));

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.getByOwner(req, res)
);
router.get("/:id/count_comments", (req, res) =>
  controller.getNumberOfComments(req, res)
);

router.get("/:id", (req, res) => controller.getById(req, res));
router.get("/pet/:id", (req, res) => controller.getByPetId(req, res));
router.put("/:id/report_image", (req, res) =>
  controller.report("image_status")(req, res)
);
router.put("/:id/report_text", (req, res) =>
  controller.report("caption_status")(req, res)
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  uploadImageServerMiddleware,
  verifyTextMiddleware("caption"),
  verifyImage,
  uploadImageCloudinaryMiddleware,
  (req, res) => controller.create(req, res)
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  uploadImageServerMiddleware,
  uploadImageCloudinaryMiddleware,
  (req, res) => controller.update(req, res)
);

export default router;
