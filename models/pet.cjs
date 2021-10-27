'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pet.hasMany(models.Paticipant, { foreignKey: 'pet_id'})
      // Pet.hasMany(models.UserPet, { foreignKey: 'pet_id'})
      // Pet.hasMany(models.PetFollower, { foreignKey: 'pet_id'})
      // Pet.hasMany(models.PetPost, { foreignKey: 'pet_id'})
      Pet.hasMany(models.PetStatus, { foreignKey: 'pet_id'})
      // Pet.hasMany(models.PetBadges, { foreignKey: 'pet_id'})
      Pet.belongsToMany(models.Post, {
        through: 'PetPost',
        foreignKey: 'pet_id'
      });
      Pet.belongsToMany(models.Badge, {
        through: 'PetBadge',
        foreignKey: 'pet_id'
      });
      Pet.belongsToMany(models.User, {
        through: 'PetFollower',
        foreignKey: 'pet_id',
        as: 'following'
      });
      Pet.belongsToMany(models.User, {
        through: 'UserPet',
        foreignKey: 'pet_id',
      });
    }
  };
  Pet.init({
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    type: DataTypes.STRING,
    gender: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Pet',
  });
  return Pet;
};