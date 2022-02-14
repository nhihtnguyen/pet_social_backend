import { Router } from "express";
import passport from "passport";
const router = Router();

import { PetController } from "../controllers/pet.js";
import { PostController } from "../controllers/post.js";
import { uploadImageCloudinaryMiddleware } from "../middleware/upload_image_cloudinary.mdw.js";
import { uploadImageServerMiddleware } from "../middleware/upload_image_server.mdw.js";

const controller = new PetController();

router.get("/list", (req, res) => controller.listPets(req, res));
router.get("/", (req, res) => controller.getByUserId(req, res));
router.get(
  "/owner",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.getByOwner(req, res)
);
router.get("/popular-pet", (req, res) => controller.getPopularPet(req, res));
router.get("/:id/summary", (req, res) => controller.getSummary(req, res));
router.get("/:id/siblings", (req, res) => controller.getBySibling(req, res));
router.get("/:id/posts", (req, res) => controller.getPosts(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) =>
  controller.createOne(req, res)
);
//router.get("/posts/:id", (req, res) => controller.getPosts(req, res));
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.update(req, res)
);
router.put(
  "/:id/avatar",
  passport.authenticate("jwt", { session: false }),
  uploadImageServerMiddleware,
  uploadImageCloudinaryMiddleware,
  (req, res) => controller.uploadImage(req, res)
);
router.put(
  "/:id/background",
  passport.authenticate("jwt", { session: false }),
  uploadImageServerMiddleware,
  uploadImageCloudinaryMiddleware,
  (req, res) => controller.uploadImage(req, res)
);

// router.put(
//   ":id",
//   passport.authenticate("jwt", { session: false }),
//   uploadImageServerMiddleware,
//   uploadImageCloudinaryMiddleware,
//   (req, res) => controller.uploadImage(req, res)
// );

export default router;
