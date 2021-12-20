import { Router } from "express";
import { uploadImageServerMiddleware } from "../middleware/upload_image_server.mdw.js";
import { uploadImageCloudinaryMiddleware } from "../middleware/upload_image_cloudinary.mdw.js";
import { PostController } from "../controllers/post.js";
import passport from "passport";
const router = Router();

const controller = new PostController();
//router.get("/", (req, res) => controller.getAll(req, res));
router.get("/explore", (req, res) => controller.getExplore(req, res));
//router.get("/recommend", (req, res) => controller.getAll(req, res));

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.getByOwner(req, res)
);
router.get("/:id", (req, res) => controller.getById(req, res));
router.get("/pet/:id", (req, res) => controller.getByPetId(req, res));

router.post(
  "/",
  uploadImageServerMiddleware,
  uploadImageCloudinaryMiddleware,
  (req, res) => res.json(req.body)
);
router.put(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  uploadImageServerMiddleware,
  uploadImageCloudinaryMiddleware,
  (req, res) => controller.update(req, res)
);

export default router;
