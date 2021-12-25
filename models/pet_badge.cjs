'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PetBadge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PetBadge.init({
    pet_id: DataTypes.INTEGER,
    badge_id: DataTypes.INTEGER,
    start: DataTypes.DATE,
    end: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PetBadge',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return PetBadge;
};