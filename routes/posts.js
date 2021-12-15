import { Router } from "express";
import { uploadImageServerMiddleware } from "../middleware/upload_image_server.mdw.js";
import { uploadImageCloudinaryMiddleware } from "../middleware/upload_image_cloudinary.mdw.js";
import { PostController } from "../controllers/post.js";
const router = Router();

const controller = new PostController();
//router.get("/", (req, res) => controller.getAll(req, res));
router.get("/explore", (req, res) => controller.getExplore(req, res));
//router.get("/recommend", (req, res) => controller.getAll(req, res));

router.get("/:id", (req, res) => controller.getById(req, res));
router.get("/pet/:id", (req, res) => controller.getByPetId(req, res));

router.post(
  "/",
  uploadImageServerMiddleware,
  uploadImageCloudinaryMiddleware,
  (req, res) => controller.create(req, res)
);

export default router;
