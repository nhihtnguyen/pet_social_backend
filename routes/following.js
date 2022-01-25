import { Router } from "express";
const router = Router();
import passport from "passport";

import { FollowingController } from "../controllers/following.js";

const controller = new FollowingController();

router.get("/", (req, res) => controller.getAll(req, res));
router.get(
  "/following",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.getUserFollowing(req, res)
);

router.get("/followers/:id", (req, res) =>
  controller.getPetFollowers(req, res)
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.getById(req, res)
);

//router.get("/", (req, res) => controller.getById(req, res));
router.post(
  "/follow",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.follow(req, res)
);
router.post(
  "/unfollow",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.unfollow(req, res)
);

export default router;
