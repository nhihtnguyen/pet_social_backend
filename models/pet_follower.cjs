'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PetFollower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };
  PetFollower.init({
    pet_id: DataTypes.INTEGER,
    following_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PetFollower',
  });
  return PetFollower;
};