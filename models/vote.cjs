"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Vote.init(
    {
      user_id: DataTypes.INTEGER,
      post_id: DataTypes.INTEGER,
      comment_id: DataTypes.INTEGER,
    },
    {
      hooks: {
        afterCreate: (vote, options) => {},
        afterDestroy: (vote, options) => {},
      },
      sequelize,
      modelName: "Vote",
    }
  );
  return Vote;
};
