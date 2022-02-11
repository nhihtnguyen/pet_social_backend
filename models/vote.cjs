"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Vote.belongsTo(models.Comment, { foreignKey: "comment_id" });
    }
  }
  Vote.init(
    {
      user_id: DataTypes.INTEGER,
      post_id: DataTypes.INTEGER,
      event_id: DataTypes.INTEGER,

      participant_id: DataTypes.INTEGER,
      comment_id: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
      },
    },
    {
      hooks: {
        afterCreate: (vote, options) => {},
        afterDestroy: (vote, options) => {},
      },
      sequelize,
      modelName: "Vote",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Vote;
};
