import { Router } from 'express';
import { PostController } from '../controllers/post.js';
import passport from 'passport';
const router = Router();

const post_controller = new PostController();

router.get('/post', (req, res) => post_controller.searchPost(req, res));

export default router;
