import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { Comment, User } = db;
import { REQUIRE_FIELDS } from "../constants/require_fields.js";
export class CommentController extends BaseController {
  constructor() {
    super(Comment);
  }
  async getByPostId(req, res) {
    const replyFor = req.query.reply || null;
    const where = { post_id: req.params.id, reply_for: replyFor };
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const offset = (page - 1) * limit || 0;
    const comments = await this._Model.findAll({
      include: [{ model: User, attributes: ["first_name", "last_name"] }],
      where,
      order: [["id", "DESC"]],
      offset,
      limit,
    });
    res.status(200).json(comments);
  }

  async createOne(req, res) {
    const body = req.body;
    body.user_id = req.user.id;
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
}
