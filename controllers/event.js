import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { Event } = db;

export class EventController extends BaseController {
  constructor() {
    super(Event);
  }
}
