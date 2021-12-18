"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Badge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Badge.belongsToMany(models.Pet, {
        through: "PetBadge",
        foreignKey: "badge_id",
      });
    }
  }
  Badge.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Badge",
      underscored: true,
    }
  );
  return Badge;
};
