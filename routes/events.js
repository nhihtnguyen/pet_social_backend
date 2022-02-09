import { Router } from "express";
import { EventController } from "../controllers/event.js";
const router = Router();
import passport from "passport";

const controller = new EventController();

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
