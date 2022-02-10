import { Router } from "express";
import { ParticipantController } from "../controllers/participant.js";
const router = Router();

const controller = new ParticipantController();

router.get("/event/:id", (req, res) => controller.getByEventId(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", (req, res) =>
  controller.create(req, res)
);
router.post("/event/:id", (req, res) =>
  controller.addParticipantToEvent(req, res)
);
router.put(
  "/:id",
  (req, res) => controller.update(req, res)
);
router.delete("/:id", (req, res) => controller.delete(req, res));
export default router;
