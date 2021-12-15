import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { Pet, Post } = db;

export class PetController extends BaseController {
  constructor() {
    super(Pet);
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
          limit: 1,
        },
      ],
    });

    res.status(200).json(posts);
  }
}
