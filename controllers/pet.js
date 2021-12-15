import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { Pet, Post, User, UserPet } = db;
import { REQUIRE_FIELDS } from "../constants/require_fields.js";

export class PetController extends BaseController {
  constructor() {
    super(Pet);
  }
  async createOne(req, res) {
    try {
      // Create pet
      const pet = await this._Model.create(req.body, {
        fields: REQUIRE_FIELDS[this._Model.modelName],
      });
      // Set owner
      if (!pet) {
        return res.status(400).json("Pet is not created");
      }
      const body = req.body;
      body.user_id = req.user.id;
      body.pet_id = pet.id;
      req.body = body;
      const result = await UserPet.create(req.body, {
        fields: REQUIRE_FIELDS[UserPet.modelName],
      });
      if (!result) {
        return res.status(400).json("Failed to set owner");
      }
      return res.status(200).json(pet);
    } catch (error) {
      res.status(400).json(error);
    }
  }
  async getPosts(req, res) {
    const where = { id: req.params.id };
    const page = req.query.page || 1;
    const limit = req.query.limit || 1;
    const offset = (page - 1) * limit || 0;
    const posts = await this._Model.findOne({
      where,
      include: [
        {
          model: Post,
          as: "Posts",
          required: true,
        },
      ],
    });

    res.status(200).json(posts);
  }
  async getByOwner(req, res) {
    const userId = req.query.user_id;
    const pets = await Pet.findAll({
      include: [
        {
          model: User,
          as: "pet",
          required: true,
          attributes: [],
          where: {
            "$pet.id$": userId,
          },
        },
      ],
    });
    res.status(200).json(pets);
  }
}
