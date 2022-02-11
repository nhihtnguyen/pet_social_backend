import { Router } from "express";
const router = Router();
import passport from "passport";

import { VotingController } from "../controllers/voting.js";

const controller = new VotingController();

router.get(
  "/single",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.getOne(req, res)
);
// router.get(
//   "/voting",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => controller.getUserFollowing(req, res)
// );

router.get("/post/:id", (req, res) => controller.getPetFollowers(req, res));

//router.get("/", (req, res) => controller.getById(req, res));
router.post(
  "/vote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.vote(req, res)
);
router.post(
  "/unvote",
  passport.authenticate("jwt", { session: false }),
  (req, res) => controller.unvote(req, res)
);

export default router;
