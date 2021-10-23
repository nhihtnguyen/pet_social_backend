import { REQUIRE_FIELDS } from "../constants/require_fields.js";
export default class BaseController {
  constructor(Model) {
    this.Model = Model;
  }

  getAll = (req, res) => {
    return this.Model.findAll({order: [['updatedAt', 'ASC']]})
    .then((records) => {
      res.status(200).json(records);
    })
    .catch((err) => { 
      console.error(err.message);
      res.status(400).json(err);
    });
  };

  getById = (req, res) => {
    return this.Model.findByPk(req.params.id)
    .then((record) => {
      if (!record) {return res.status(404).send("Record Not Found")}
      res.status(200).json(record);
    })
    .catch((err) => { 
      console.error(err.message);
      res.status(400).json(err);
    });
  }

  create = (req, res) => {
    return this.Model.create(req.body, {
      fields: REQUIRE_FIELDS[this.Model.modelName]
    })
    .then((record) => res.status(200).json(record))
    .catch((err) => { 
      console.error(err.message);
      res.status(400).json(err);
    });
  }

  update = async (req, res) => {
    try {
      let record = await this.Model.findOne({where: { id: req.params.id }});
      if (!record) { return res.status(404).send("Record Not Found")}
      const updatedRecord = await record.update(req.body, {
        where: { id: req.params.id },
        fields: REQUIRE_FIELDS[this.Model.modelName]
      });
      res.status(200).json(updatedRecord); 
    } catch (err) {
      console.error(err.message);
      res.status(400).json(err);
    }
  }

  delete = async (req, res) => {
    try {
      let record = await this.Model.findOne({where: { id: req.params.id }});
      if (!record) { return res.status(404).send("Record Not Found")}
      await this.Model.destroy({
        where: { id: req.params.id }
      });
      res.status(200).json({ msg: `Removed ${this.Model.modelName}`})
    } catch (err) {
      console.error(err.message);
      res.status(400).json(err);
    }
  }
}

