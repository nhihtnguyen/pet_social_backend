import { Router } from "express";
import { EventController } from "../controllers/event.js";

import { uploadImageServerMiddleware } from "../middleware/upload_image_server.mdw.js";
import { uploadImageCloudinaryMiddleware } from "../middleware/upload_image_cloudinary.mdw.js";
import { verifyImage } from "../middleware/verify_image.mdw.js";
import { verifyTextMiddleware } from "../middleware/verify_text.mdw.js";

const router = Router();
import passport from "passport";

const controller = new EventController();

router.get("/", (req, res) => controller.getAll(req, res));
router.get(
  "/:id/participants",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.getParticipants(req, res)
);
router.get("/:id/summary", (req, res) => controller.getSummary(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) =>
  controller.createOne(req, res)
);
router.post(
  "/:id/join",
  passport.authenticate("jwt", { session: false }),
  uploadImageServerMiddleware,
  verifyTextMiddleware("caption"),
  verifyImage,
  uploadImageCloudinaryMiddleware,
  (req, res) => controller.joinEvent(req, res)
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.update(req, res)
);

export default router;
