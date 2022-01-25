import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { Pet, Post, User, UserPet, PetPost } = db;
import { REQUIRE_FIELDS } from "../constants/require_fields.js";

export class PetController extends BaseController {
  constructor() {
    super(Pet);
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
    try {
      const petID = req.params.id;
      const page = req.query.page || 1;
      const limit = req.query.limit || 1;
      const offset = (page - 1) * limit || 0;
      const posts = await Post.findAll({
        limit,
        offset,
        include: [
          {
            model: PetPost,
            as: "mentions",
            where: { pet_id: petID },
          },
        ],
      });
      res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  async getByUserId(req, res) {
    const userId = req.query.user_id;
    try {
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
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getByOwner(req, res) {
    try {
      const userId = req.user.id;
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
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  async getBySibling(req, res) {
    try {
      const userPet = await UserPet.findOne({
        where: { pet_id: req.params.id },
      });
      const user = await User.findOne({ where: { id: userPet.user_id } });
      console.log(user);
      const pets = await Pet.findAll({
        include: [
          {
            model: User,
            as: "pet",
            required: true,
            attributes: [],
            through: {
              where: {
                "$pet.id$": user.id,
              },
            },
          },
        ],
      });
      res.status(200).json([user, ...pets]);
    } catch (error) {
      // Logging
      console.log(error);
      res.status(500).json(error);
    }
  }
}
