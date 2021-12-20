'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Relationship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Relationship.belongsTo(models.User, {
        foreignKey: 'follower_id',
        as: 'follower',
      });
      Relationship.belongsTo(models.User, {
        foreignKey: 'following_id',
        as: 'following',
      });
    }
  }
  Relationship.init(
    {
      follower_id: DataTypes.INTEGER,
      following_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Relationship',
      underscored: true,
    }
  );
  return Relationship;
};
