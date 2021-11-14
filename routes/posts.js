import { Router } from "express";
import { uploadImageServerMiddleware } from "../middleware/upload_image_server.mdw.js";
import { uploadImageCloudinaryMiddleware } from "../middleware/upload_image_cloudinary.mdw.js";
import { postController } from '../controllers/index.js';
const router = Router();

router.post("/", uploadImageServerMiddleware, uploadImageCloudinaryMiddleware, postController.create);


export default router;
