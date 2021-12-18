"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: "user_id" });
      User.hasMany(models.Paticipant, { foreignKey: "user_id" });
      User.hasMany(models.Comment, { foreignKey: "user_id" });
      User.belongsTo(models.Country, { foreignKey: "countryCode" });
      User.belongsToMany(models.Pet, {
        through: "PetFollower",
        foreignKey: "follower_id",
        as: "follower",
      });
      User.belongsToMany(models.Pet, {
        through: "UserPet",
        foreignKey: "user_id",
        as: "owner",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      is_blocked: DataTypes.BOOLEAN,
      country_code: DataTypes.INTEGER,
      avatar: DataTypes.TEXT,
      background: DataTypes.TEXT,
      password: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
      underscored: true,
    }
  );
  return User;
};
