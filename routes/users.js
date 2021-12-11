import { Router } from 'express';
const router = Router();

import { UserController } from '../controllers/user.js';

const controller = new UserController();

router.get('/', (req,res)=> controller.getAll(req, res));
router.post('/', (req, res) => controller.create(req, res));

export default router;
