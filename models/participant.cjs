"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Participant.belongsTo(models.User, { foreignKey: "user_id" });
      Participant.belongsTo(models.Event, { foreignKey: "event_id" });
      Participant.belongsTo(models.Pet, { foreignKey: "pet_id" });
    }
  }
  Participant.init(
    {
      user_id: DataTypes.INTEGER,
      event_id: DataTypes.INTEGER,
      pet_id: DataTypes.INTEGER,
      media_url: DataTypes.TEXT,
      caption: DataTypes.STRING,
      upvote: DataTypes.INTEGER,
      participated_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Participant",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Participant;
};
