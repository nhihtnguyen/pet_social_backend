import BaseController from "./base_controller.js";
import db from '../models/index.cjs';
const { Pet } = db;

export class PetController extends BaseController {
  constructor(){
    super(Pet);
  }
}