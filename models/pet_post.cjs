"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PetPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PetPost.belongsTo(models.Post, {foreignKey: 'post_id'})
      PetPost.belongsTo(models.Pet, {foreignKey: 'pet_id'})
    }
  }
  PetPost.init(
    {
      post_id: DataTypes.INTEGER,
      pet_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PetPost",
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
  return PetPost;
};
