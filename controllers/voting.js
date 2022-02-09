import BaseController from "./base_controller.js";
import db from "../models/index.cjs";
const { Vote, Post, User, Comment } = db;

export class VotingController extends BaseController {
  constructor() {
    super(Vote);
  }

  async vote(req, res) {
    try {
      const where = {
        post_id: req.body.post_id,
        user_id: req.user.id,
        comment_id: req.body.comment_id || null,
      };
      let voteRecord = await this._Model.findOne({ where });

      if (voteRecord) {
        return res.status(304).send("Record exist");
      }

      const body = req.body;
      body.user_id = req.user.id;
      let postRecord = await Post.findOne({ where: { id: req.body.post_id } });
      if (!postRecord) {
        return res.status(404).send("Post Not Found");
      }

      if (req?.body?.comment_id) {
        let commentRecord = await Comment.findOne({
          where: { id: req?.body?.comment_id },
        });
        if (!commentRecord) {
          return res.status(404).send("Comment Not Found");
        }
        commentRecord["upvote"] = commentRecord["upvote"]
          ? commentRecord["upvote"] + 1
          : 1;

        let recordUpdate = await commentRecord.save();
      } else {
        postRecord["upvote"] = postRecord["upvote"]
          ? postRecord["upvote"] + 1
          : 1;

        let recordUpdate = await postRecord.save();
      }
      req.body = body;
      return this.create(req, res);
    } catch (error) {
      console.error(error.message);
      res.status(400).json(error);
    }
  }
  async unvote(req, res) {
    try {
      let where = {
        post_id: req.body.post_id,
        user_id: req.user.id,
        comment_id: req.body.comment_id || null,
      };
      let record = await this._Model.findOne({
        where,
      });
      if (!record) {
        return res.status(404).send("Record Not Found");
      }
      let postRecord = await Post.findOne({ where: { id: req.body.post_id } });

      if (req?.body?.comment_id) {
        let commentRecord = await Comment.findOne({
          where: { id: req?.body?.comment_id },
        });
        if (!commentRecord) {
          return res.status(404).send("Comment Not Found");
        }
        commentRecord["upvote"] = commentRecord["upvote"]
          ? commentRecord["upvote"] - 1
          : 0;

        let recordUpdate = await commentRecord.save();
      } else {
        postRecord["upvote"] = postRecord["upvote"]
          ? postRecord["upvote"] - 1
          : 0;

        let recordUpdate = await postRecord.save();
      }
      await this._Model.destroy({ where });
      res.status(200).json({ msg: `Removed ${this._Model.modelName}` });
    } catch (err) {
      console.error(err.message);
      res.status(400).json(err);
    }
  }
  async getOne(req, res) {
    try {
      const where = {
        post_id: req.query.post_id,
        user_id: req.user.id,
        comment_id: req.query.comment_id || null,
      };

      let record = await this._Model.findOne({ where });
      if (Boolean(!record)) {
        return res.status(404).send("Record not found");
      }
      return res.status(200).json(record);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
}
