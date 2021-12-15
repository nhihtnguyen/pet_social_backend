import { Router } from "express";
const router = Router();

import { UserController } from "../controllers/user.js";
import passport from "passport";

const controller = new UserController();

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) =>
  controller.getAll(req, res)
);
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", (req, res) => controller.create(req, res));

export default router;
