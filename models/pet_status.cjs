'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PetStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PetStatus.belongsTo(models.Pet, { foreignKey: 'pet_id' });
    }
  }
  PetStatus.init(
    {
      pet_id: DataTypes.INTEGER,
      weight: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'PetStatus',
      underscored: true,
    }
  );
  return PetStatus;
};
