'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('PostTags', 'tag', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('PostTags', 'tag', {
        type: Sequelize.STRING,
        allowNull: true
      });
  }
}
