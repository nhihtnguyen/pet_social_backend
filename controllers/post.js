import BaseController from "./base_controller.js";
import db from '../models/index.cjs';
const { Post } = db;

export class PostController extends BaseController {
  constructor(){
    super(Post);
  }
}