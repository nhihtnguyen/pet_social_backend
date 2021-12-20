import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { User } = db;

export class UserController extends BaseController {
  constructor() {
    super(User);
  }
  async uploadImage(req, res) {
    try {
      let updateField = req.path.split("/")[1];
      let record = await this._Model.findOne({ where: { id: req.user.id } });
      if (!record) {
        return res.status(401).send("Unauthorized");
      }
      const newAvatar = await record.update({
        updateField: req.body.media_URL,
      });
      res.status(200).json(newAvatar);
    } catch (err) {
      console.error(err);
      res.status(400).json(err);
    }
  }

  async getByOwner(req, res) {
    const user_id = req.user.id;
    return this._Model
      .findByPk(user_id, {
        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
          "phone_number",
          "is_blocked",
          "is_active",
          "avatar",
          "background",
        ],
      })
      .then((record) => {
        if (!record) {
          return res.status(404).send("Record Not Found");
        }
        res.status(200).json(record);
      })
      .catch((err) => {
        console.error(err.message);
        res.status(400).json(err);
      });
  }

  async getById(req, res) {
    return this._Model
      .findByPk(req.params.id, {
        attributes: [
          "id",
          "first_name",
          "last_name",
          "email",
          "phone_number",
          "is_blocked",
          "is_active",
          "avatar",
          "background",
        ],
      })
      .then((record) => {
        if (!record) {
          return res.status(404).send("Record Not Found");
        }
        res.status(200).json(record);
      })
      .catch((err) => {
        console.error(err.message);
        res.status(400).json(err);
      });
  }
}
