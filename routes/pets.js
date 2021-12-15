import { Router } from "express";
const router = Router();

import { PetController } from "../controllers/pet.js";

const controller = new PetController();

router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.get("/posts/:id", (req, res) => controller.getPosts(req, res));

export default router;
