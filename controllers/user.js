import BaseController from "./base_controller.js";
import db from '../models/index.cjs';
const { User } = db;

class UserController extends BaseController {
  constructor() {
    super(User);
  }
}
const a = new BaseController(User);
export const userController = new BaseController(User);
