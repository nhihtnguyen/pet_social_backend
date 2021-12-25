'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      Country.hasMany(models.User, { foreignKey: 'country_code' });
      }
  };
  Country.init({
    name: DataTypes.STRING,
    continent_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Country',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Country;
};