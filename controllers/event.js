import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { Event, Participant, Vote } = db;

export class EventController extends BaseController {
  constructor() {
    super(Event);
  }
  async joinEvent(req, res) {
    try {
      const event_id = req.params.id;
      const user_id = req.user.id;
      let record = await Participant.create({ ...req.body, event_id, user_id });

      if (record) {
        res.status(200).json(record);
      }
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
  async getAll(req, res) {
    try {
      const page = req.query.page;
      const limit = req.query.limit || 10;
      let sortBy = req.query.sortBy;
      const records = await this._Model.findAll({
        order: [["updated_at", "ASC"]],
        limit: limit,
        offset: (page - 1) * limit || 0,
      });
      res.status(200).json(records);
    } catch (error) {
      console.error(error.message);
      res.status(400).json(err);
    }
  }
  async createOne(req, res) {
    const body = req.body;
    body.creator = req.user.id;
    req.body = body;
    return this.create(req, res);
  }
  async update(req, res) {
    try {
      const caller = req.user.id;
      let record = await this._Model.findOne({ where: { id: req.params.id } });
      if (!record) {
        return res.status(404).send("Record Not Found");
      }
      if (record.user_id !== caller) {
        return res.status(401).send("Unauthorized");
      }
      const updatedRecord = await record.update(req.body, {
        where: { id: req.params.id },
        fields: REQUIRE_FIELDS[this._Model.modelName],
      });
      res.status(200).json(updatedRecord);
    } catch (err) {
      console.error(err.message);
      res.status(400).json(err);
    }
  }
  async getParticipants(req, res) {
    try {
      const userId = req.user.id;
      const where = { event_id: req.params.id };
      const page = req.query.page || 1;
      const limit = req.query.limit || 5;
      const offset = (page - 1) * limit || 0;
      let records = await Participant.findAll({
        where,
        offset,
        limit,
        order: [["updated_at", "DESC"]],
      });
      if (!records) {
        return res.status(404).send("Event Not Found");
      }
      res.status(200).json(records);
    } catch (err) {
      console.error(err.message);
      res.status(400).json(err);
    }
  }
  async uploadThumbnail(req, res) {
    try {
      const event = await this._Model.findOne({
        where: { id: req.params.id },
      });
      if (!event) {
        return res.status(404).send("Event not found");
      }
      if (req.user.id != event.creator) {
        return res.status(401).send("Unauthorized");
      }

      let newAvatar = await record.save();
      res.status(200).json(newAvatar);
    } catch (e) {
      console.log("Upload image User.......", e);
      res.status(500).json({ msg: "Server error" });
    }
  }
  async getSummary(req, res) {
    try {
      const eventId = req.params.id;

      const totalParticipants = await Participant.count({
        where: { event_id: eventId },
      });
      const totalVotes = await Vote.count({
        where: { event_id: eventId },
      });
      res.status(200).json({
        total_participants: totalParticipants,
        total_votes: totalVotes,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  }
}
