'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       Post.hasMany(models.PostTag, {foreignKey: 'post_id', as: 'tags'});
       Post.hasMany(models.Comment, {foreignKey: 'post_id'});
       Post.hasMany(models.PetPost, {foreignKey: 'post_id', as: 'mentions'})
       Post.belongsTo(models.User, {foreignKey: 'user_id'});
    }
  };
  Post.init({
    user_id: DataTypes.INTEGER,
    media_URL: DataTypes.TEXT,
    caption: DataTypes.STRING,
    size: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      validate: {
        customValidator: (value) => {
        const enums = ['allowed','warning']
          if (!enums.includes(value)) {
            throw new Error('not a valid option')
          }
        }
      }
    },
    upvote: DataTypes.INTEGER,
    downvote: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};