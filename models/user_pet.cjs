"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserPet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserPet.init(
    {
      user_id: DataTypes.INTEGER,
      pet_id: DataTypes.INTEGER,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "UserPet",
      underscored: true,
    }
  );
  return UserPet;
};
