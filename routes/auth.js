import { Router } from "express";
import { AuthController } from "../controllers/auth.js";
const router = Router();

const controller = new AuthController();

router.post("/login", (req, res) => controller.login(req, res));
router.post("/register", (req, res) => controller.register(req, res));
router.post("/logout", (req, res) => controller.logout(req, res));
router.get("/refresh", (req, res) => controller.refresh(req, res));
router.post("/revoke", (req, res) => controller.revokeRefreshToken(req, res));

export default router;
