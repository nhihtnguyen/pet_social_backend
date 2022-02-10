import BaseController from "./base_controller.js";
import { REQUIRE_FIELDS } from "../constants/require_fields.js";
import db from "../models/index.cjs";
import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
dotenv.config();
const { Post, PetPost, PostTag, User, Pet, Comment, Vote } = db;

const client = new Client({
  cloud: {
    id: 'pet-social:dXMtZWFzdDQuZ2NwLmVsYXN0aWMtY2xvdWQuY29tJDc2M2ZhNjc0Nzg3ZjQxNWU4ZjExNzM5MzFiMDFjOWZhJGEzMTE2OGI5ZmQ1YjRhZjQ4NDdjMmJjYmFiNTZkOGY3'
  },
  auth: {
    username: 'elastic',
    password: 'wrvfjcVQupzDqx2HFYqwHcB3'
  }
});

export class PostController extends BaseController {
  constructor() {
    super(Post);
  }

  async create(req, res) {
    console.log("body", req.body);
    const userId = req.user.id;
    const pet_ids = req.body.mentions.split(",");
    const mentions = pet_ids?.map((pet_id) => ({ pet_id }));
    const hashtags = req.body.caption.match(/#[a-z0-9_]+/g);
    const tags = hashtags?.map((tag) => ({ tag }));
    const custom_fields = { ...req.body, mentions, tags, user_id: userId };

    try {
      let record = await this._Model.create(custom_fields, {
        fields: REQUIRE_FIELDS.Post,
        include: [
          { model: PetPost, as: "mentions" },
          { model: PostTag, as: "tags" },
        ],
      });
      let pets = await Pet.findAll({
        where: { id: record.mentions.map((petPost) => petPost.pet_id) },
      });
      let user = await User.findByPk(record.user_id);
      record = JSON.parse(JSON.stringify(record));
      record.pet_names = pets.map((pet) => pet.name);
      record.user_name = user.first_name + " " + user.last_name;

      await client.index({
        index: "post",
        body: record,
      });

      console.log(record);
      return res.json(record);
    } catch (err) {
      console.error(err.message);
      res.status(400).json(err);
    }
  }
  async getById(req, res) {
    console.log('ahuhu')
    try {
      let post = await this._Model.findByPk(req.params.id, {
        include: [
          {
            model: PetPost,
            as: "mentions",
          },
          {
            model: User,
            attributes: ["avatar", "id", "first_name", "last_name"],
          },
        ],
      });
      if (!post) {
        return res.status(404).send("Record Not Found");
      } else {
        post = JSON.parse(JSON.stringify(post));
        post.total_comments = await Comment.count({
          where: { post_id: post.id },
        });
        res.status(200).json(post);
      }
    } catch (err) {
      res.status(400).json(err.message);
    }
  }

  async getExplore(req, res) {
    const page = req.query.page;
    //limit 5 record per page
    const limit = req.query.limit || 100;
    if (req.query.search) {
      return client
        .search({
          index: "post",
          from: (page - 1) * limit || 0,
          size: limit,
          body: {
            query: {
              multi_match: {
                fields: ["pet_names", "caption"],
                query: req.query.search,
                fuzziness: 1,
              },
            },
          },
        })
        .then((result) =>
          res.status(200).send(result.body.hits.hits.map((hit) => hit._source))
        );
    } else {
      return this._Model
        .findAll({
          order: [["updated_at", "ASC"]],
          limit: limit,
          offset: (page - 1) * limit || 0,
          include: [
            {
              model: User,
              attributes: ["avatar", "id", "first_name", "last_name"],
            },
          ],
        })
        .then((records) => {
          res.status(200).json(records);
        })
        .catch((err) => {
          console.error(err.message);
          res.status(400).json(err);
        });
    }
  }

  async getByOwner(req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 1;
    const offset = (page - 1) * limit || 0;
    const posts = await this._Model.findAll({
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: ["id", "avatar", "first_name", "last_name"],
          required: true,
          where: { "$User.id$": req.user.id },
        },
      ],
    });

    res.status(200).json(posts);
  }
  async getByUserID(req, res) {
    const userID = req.params.id;
    const page = req.query.page || 1;
    const limit = req.query.limit || 1;
    const offset = (page - 1) * limit || 0;
    const posts = await this._Model.findAll({
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: ["id", "avatar", "first_name", "last_name"],
          required: true,
          where: { "$User.id$": userID },
        },
      ],
    });

    res.status(200).json(posts);
  }
  async getByPetId(req, res) {
    const where = { pet_id: req.params.id };
    const page = req.query.page || 1;
    const limit = req.query.limit || 1;
    const offset = (page - 1) * limit || 0;
    const posts = await this._Model.findAll({
      limit,
      offset,
      include: [
        {
          model: Pet,
          as: "Pets",
          attributes: ["id"],
          required: true,
          where: { "$Pets.id$": userID },
        },
      ],
    });

    res.status(200).json(posts);
  }
  async update(req, res) {
    try {
      console.log(req.body);
      const caller = req.user.id;
      let record = await this._Model.findOne({ where: { id: req.params.id } });
      console.log(record);
      if (!record) {
        return res.status(404).send("Record Not Found");
      }
      if (record.user_id !== caller) {
        return res.status(401).send("Unauthorized");
      }
      const updatedRecord = await record.update(req.body, {
        where: { id: req.params.id },
        fields: REQUIRE_FIELDS[this._Model.Post],
      });
      return res.status(200).json(updatedRecord);
    } catch (err) {
      console.error(err.message);
      res.status(400).json(err);
    }
  }
}
