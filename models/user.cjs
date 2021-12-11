'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: 'user_id'})
      User.hasMany(models.Paticipant, { foreignKey: 'user_id'})
      User.belongsTo(models.Country, { foreignKey: 'countryCode' });
      User.belongsToMany(models.Pet, {
        through: 'PetFollower',
        foreignKey: 'following_id',
        as: 'follower'
      });
      User.belongsToMany(models.Pet, {
        through: 'UserPet',
        foreignKey: 'user_id',
        as: 'owner'
      });
    }
  };
  User.init({
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    isBlocked: DataTypes.BOOLEAN,
    countryCode: DataTypes.INTEGER,
    avatar: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true,
  });
  return User;
};
