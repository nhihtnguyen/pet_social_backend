"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(models.Participant, { foreignKey: "event_id" });
    }
  }
  Event.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Event",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Event;
};
