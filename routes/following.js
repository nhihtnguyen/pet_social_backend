import { Router } from "express";
const router = Router();
import passport from "passport";

import { FollowingController } from "../controllers/following.js";

const controller = new FollowingController();

router.get("/", (req, res) => controller.getAll(req, res));
//router.get("/", (req, res) => controller.getById(req, res));
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) =>
  controller.follow(req, res)
);
router.get(
  "/following",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.getUserFollowing(req, res)
);

router.get("/followers", (req, res) => controller.getPetFollowers(req, res));

export default router;
