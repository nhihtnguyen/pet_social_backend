import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { PetFollower, Pet, User } = db;

export class FollowingController extends BaseController {
  constructor() {
    super(PetFollower);
  }
  async getById(req, res) {
    console.log(req.params);
    return this._Model
      .findOne({ where: { pet_id: req.params.id, follower_id: req.user.id } })
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
  async follow(req, res) {
    try {
      const body = req.body;
      body.follower_id = req.user.id;
      let record = await Pet.findOne({ where: { id: req.body.pet_id } });
      if (!record) {
        return res.status(404).send("Pet Not Found");
      }
      req.body = body;
      return this.create(req, res);
    } catch (error) {
      console.error(error.message);
      res.status(400).json(error);
    }
  }
  async unfollow(req, res) {
    try {
      let record = await this._Model.findOne({
        where: { pet_id: req.body.pet_id, follower_id: req.user.id },
      });
      if (!record) {
        return res.status(404).send("Record Not Found");
      }
      await this._Model.destroy({
        where: { pet_id: req.body.pet_id, follower_id: req.user.id },
      });
      res.status(200).json({ msg: `Removed ${this._Model.modelName}` });
    } catch (err) {
      console.error(err.message);
      res.status(400).json(err);
    }
  }
  async getUserFollowing(req, res) {
    const userId = req.user.id;
    const where = { post_id: req.params.id };
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const offset = (page - 1) * limit || 0;
    const pets = await Pet.findAll({
      include: [
        {
          model: User,
          as: "following",
          required: true,
          attributes: [],
          where: {
            "$following.id$": userId,
          },
        },
      ],
    });
    res.status(200).json(pets);
  }
  async getPetFollowers(req, res) {
    const petId = req.params.id;
    console.log(petId);
    const where = { post_id: req.params.id };
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const offset = (page - 1) * limit || 0;
    const users = await User.findAll({
      attributes: ["id", "avatar", "first_name", "last_name", "username"],
      include: [
        {
          model: Pet,
          as: "follower",
          required: true,
          attributes: [],
          where: {
            "$follower.id$": petId,
          },
        },
      ],
    });
    res.status(200).json(users);
  }
}
