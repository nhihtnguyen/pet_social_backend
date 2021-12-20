import BaseController from './base_controller.js';
import db from '../models/index.cjs';
const { User } = db;

export class UserController extends BaseController {
  constructor() {
    super(User);
  }
  async uploadImage(req, res) {
    try {
      console.log(req.body.media_url);
      let updateField = req.path.split('/');
      updateField = updateField[updateField.length - 1].trim();
      console.log(updateField);
      let record = await this._Model.findOne({ where: { id: req.user.id } });
      if (!record) {
        return res.status(401).send('Unauthorized');
      }
      record[`${updateField}`] = req.body.media_url;
      let newAvatar = await record.save();
      res.status(200).json(newAvatar);
    } catch (e) {
      console.log('Upload image User.......', e);
      res.status(500).json({ msg: 'Server error' });
    }
  }
}
