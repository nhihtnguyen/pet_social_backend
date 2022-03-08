import { Router } from "express";
const router = Router();

import { UserController } from "../controllers/user.js";
import passport from "passport";

import { uploadImageCloudinaryMiddleware } from "../middleware/upload_image_cloudinary.mdw.js";
import { uploadImageServerMiddleware } from "../middleware/upload_image_server.mdw.js";

const controller = new UserController();

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) =>
  controller.getAll(req, res)
);
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.getByOwner(req, res)
);
router.get("/summary", (req, res) => controller.countUser(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
//router.post("/", (req, res) => controller.create(req, res));
router.put(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.update(req, res)
);
//router.put("/:id", (req, res) => controller.update(req, res));

router.put(
  "/avatar",
  passport.authenticate("jwt", { session: false }),
  uploadImageServerMiddleware,
  uploadImageCloudinaryMiddleware,
  (req, res) => controller.uploadImage(req, res)
);
router.put(
  "/background",
  passport.authenticate("jwt", { session: false }),
  uploadImageServerMiddleware,
  uploadImageCloudinaryMiddleware,
  (req, res) => controller.uploadImage(req, res)
);

export default router;
