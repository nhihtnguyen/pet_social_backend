import BaseController from "./base_controller.js";
import { REQUIRE_FIELDS } from "../constants/require_fields.js";
import db from "../models/index.cjs";
const { Participant, Event } = db;

export class ParticipantController extends BaseController {
  constructor() {
    super(Participant);
  }

  async getByEventId(req, res) {
    try {
      const where = { event_id: req.params.id };
      const page = req.query.page || 1;
      const limit = req.query.limit || 5;
      const offset = (page - 1) * limit || 0;
      const participants = await this._Model.findAll({
        include: [
          { model: Event, attributes: ["name"]}
        ],
        where,
        offset,
        limit,
      });
      res.status(200).json(participants);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }

  async addParticipantToEvent(req, res) {
    try {
      const custom_fields = { ...req.body, event_id: req.params.id };
      const participant = await this._Model.create(custom_fields, {
        fields: REQUIRE_FIELDS[this._Model.modelName],
      });
      res.status(200).json(participant);
    } catch (err) {
      res.status(400).json(err.message);
    }
  }


}
