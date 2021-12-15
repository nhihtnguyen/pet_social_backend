import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { PetFollower, Pet, User } = db;

export class FollowingController extends BaseController {
  constructor() {
    super(PetFollower);
  }
  async follow(req, res) {
    const body = req.body;
    body.follower_id = req.user.id;
    req.body = body;
    return this.create(req, res);
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
    const petId = req.query.pet_id;
    console.log(petId);
    const where = { post_id: req.params.id };
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const offset = (page - 1) * limit || 0;
    const users = await User.findAll({
      attributes: ["id", "avatar"],
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
