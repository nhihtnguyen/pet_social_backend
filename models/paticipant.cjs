'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Paticipant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Paticipant.belongsTo(models.User, {foreignKey: 'user_id'})
      Paticipant.belongsTo(models.Event, {foreignKey: 'event_id'})
      Paticipant.belongsTo(models.Pet, {foreignKey: 'pet_id'})
    }
  };
  Paticipant.init({
    user_id: DataTypes.INTEGER,
    event_id: DataTypes.INTEGER,
    pet_id: DataTypes.INTEGER,
    media_URL: DataTypes.TEXT,
    caption: DataTypes.STRING,
    upvote: DataTypes.INTEGER,
    paticipated_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Paticipant',
  });
  return Paticipant;
};