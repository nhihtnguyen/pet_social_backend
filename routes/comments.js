import { Router } from "express";
import { CommentController } from "../controllers/comment.js";
const router = Router();
import passport from "passport";

const controller = new CommentController();

router.get("/post/:id", (req, res) => controller.getByPostId(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) =>
  controller.createOne(req, res)
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.update(req, res)
);

export default router;
