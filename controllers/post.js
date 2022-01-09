import BaseController from "./base_controller.js";
import { REQUIRE_FIELDS } from "../constants/require_fields.js";
import db from "../models/index.cjs";
import { Client } from "@elastic/elasticsearch";
const { Post, PetPost, PostTag, User, Pet } = db;

const client = new Client({ node: "http://localhost:9200" });

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
      /*
      await client.index({
        index: "post",
        body: record,
      });
      */

      console.log(record);
      return res.json(record);
    } catch (err) {
      console.error(err.message);
      res.status(400).json(err);
    }
  }
  async getById(req, res) {
    return this._Model
      .findByPk(req.params.id, {
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

  async getByPetId(req, res) {
    const where = { pet_id: req.params.id };
    const page = req.query.page || 1;
    const limit = req.query.limit || 1;
    const offset = (page - 1) * limit || 0;
    const posts = await this._Model.findAll({
      paginate: {},
      include: [
        {
          model: Pet,
          as: "Pets",
          attributes: ["id"],
          required: true,
          through: {
            attributes: [],
            where: {
              "$Pets.id$": req.params.id,
            },
          },
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
