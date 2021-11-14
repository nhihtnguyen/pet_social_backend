import BaseController from "./base_controller.js";
import db from '../models/index.cjs';
const { Post } = db;

export const postController = new BaseController(Post);
