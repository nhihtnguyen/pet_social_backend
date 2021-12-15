import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { User } = db;

export class UserController extends BaseController {
  constructor() {
    super(User);
  }
}
