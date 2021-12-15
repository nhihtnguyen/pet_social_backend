import { Router } from "express";
import passport from "passport";
const router = Router();

import { PetController } from "../controllers/pet.js";

const controller = new PetController();

//router.get("/", (req, res) => controller.getAll(req, res));
router.get("/", (req, res) => controller.getByOwner(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) =>
  controller.createOne(req, res)
);
router.get("/posts/:id", (req, res) => controller.getPosts(req, res));

export default router;
