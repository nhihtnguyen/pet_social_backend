import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { Pet, Post, User, UserPet, PetPost, PetFollower } = db;
import { Sequelize } from "sequelize";
import { REQUIRE_FIELDS } from "../constants/require_fields.js";

const Op = Sequelize.Op;
export class PetController extends BaseController {
  constructor() {
    super(Pet);
  }
  async uploadImage(req, res) {
    try {
      const userPet = await UserPet.findOne({
        where: { pet_id: req.params.id },
      });
      if (!userPet) {
        return res.status(404).send("Pet not found");
      }
      if (req.user.id != userPet.user_id) {
        return res.status(401).send("Unauthorized");
      }

      const record = await this._Model.findOne({
        where: { id: req.params.id },
      });

      let updateField = req.path.split("/");
      updateField = updateField[updateField.length - 1].trim();

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
      res.status(400).json(error.message);
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
      res.status(500).json(error.message);
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

  async getSummary(req, res) {
    const petId = req.params.id;
    try {
      const totalPosts = await PetPost.count({
        where: { pet_id: petId },
      });
      const totalFollowers = await PetFollower.count({
        where: { pet_id: petId },
      });
      res
        .status(200)
        .json({ total_posts: totalPosts, total_followers: totalFollowers });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async listPets(req, res) {
    const pet_ids = req.query.pet_ids.split(",");
    try {
      const list_pets = await Pet.findAll({
        where: { id: pet_ids },
      });
      res.status(200).json(list_pets);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async update(req, res) {
    try {
      let userPet = await UserPet.findOne({
        where: { pet_id: req.params.id, user_id: req.user.id },
      });
      if (!userPet) {
        return res.status(400).send("Unauthorized");
      }
      let record = await this._Model.findOne({ where: { id: req.params.id } });
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
  async getPopularPet(req, res) {
    try {
      const nowDate = new Date();
      const lastWeek = new Date()
      lastWeek.setDate(nowDate.getDate() - 7);

      const where = { created_at: { [Op.between]: [lastWeek, nowDate] } }
      const pets = await PetFollower.findAll({
        attributes: [
          "pet_id",
          [Sequelize.fn('COUNT', Sequelize.col('follower_id')), 'count']
        ],
        group: ['pet_id'],
        order: [['count', 'DESC']],
        where
      });
      console.log(pets);
      res.status(200).json(pets);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
}
