import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { User } = db;

export class UserController extends BaseController {
  constructor() {
    super(User);
  }
  async uploadImage(req, res) {
    try {
      console.log(req.body.media_url);
      let updateField = req.path.split("/");
      updateField = updateField[updateField.length - 1].trim();
      console.log(updateField);
      let record = await this._Model.findOne({ where: { id: req.user.id } });
      if (!record) {
        return res.status(401).send("Unauthorized");
      }
      record[`${updateField}`] = req.body.media_url;
      let newAvatar = await record.save();
      res.status(200).json(newAvatar);
    } catch (e) {
      console.log("Upload image User.......", e);
      res.status(500).json({ msg: "Server error" });
    }
  }
  async getByOwner(req, res) {
    const email = req.user.email;
    return this._Model
      .findOne({
        where: { email },
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
  async update(req, res) {
    try {
      const email = req.user.email;

      let record = await this._Model.findOne({
        where: { email },
      });
      if (!record) {
        return res.status(404).send("Record Not Found");
      }
      const updatedRecord = await record.update(req.body, {
        where: { id: req.params.id },
      });
      res.status(200).json(updatedRecord);
    } catch (err) {
      console.error(err.message);
      res.status(400).json(err);
    }
  }
}
