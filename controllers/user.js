import BaseController from "./base_controller.js";
import db from '../models/index.cjs';
const { User } = db;

export const userController = new BaseController(User);
