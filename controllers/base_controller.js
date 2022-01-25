import { REQUIRE_FIELDS } from "../constants/require_fields.js";

export default class BaseController {
  _Model;

  constructor(Model) {
    this._Model = Model;
  }

  async getAll(req, res) {
    return this._Model
      .findAll({ order: [["updated_at", "ASC"]] })
      .then((records) => {
        res.status(200).json(records);
      })
      .catch((err) => {
        console.error(err.message);
        res.status(400).json(err);
      });
  }

  async getById(req, res) {
    return this._Model
      .findByPk(req.params.id)
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

  async create(req, res) {
    return this._Model
      .create(req.body, {
        fields: REQUIRE_FIELDS[this._Model.modelName],
      })
      .then((record) => res.status(200).json(record))
      .catch((err) => {
        console.error(err.message);
        res.status(400).json(err);
      });
  }

  async update(req, res) {
    try {
      let record = await this._Model.findOne({ where: { id: req.params.id } });
      if (!record) {
        return res.status(404).send("Record Not Found");
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

  async delete(req, res) {
    try {
      let record = await this._Model.findOne({ where: { id: req.params.id } });
      if (!record) {
        return res.status(404).send("Record Not Found");
      }
      await this._Model.destroy({
        where: { id: req.params.id },
      });
      res.status(200).json({ msg: `Removed ${this._Model.modelName}` });
    } catch (err) {
      console.error(err.message);
      res.status(400).json(err);
    }
  }
}
