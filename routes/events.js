import { Router } from "express";
import { EventController } from "../controllers/event.js";
const router = Router();

const controller = new EventController();

router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", (req, res) =>
  controller.create(req, res)
);
router.put("/:id", (req, res) => controller.update(req, res));

export default router;
