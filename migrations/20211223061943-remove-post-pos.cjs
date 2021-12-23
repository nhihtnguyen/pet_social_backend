'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Posts','pos');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Posts','pos', Sequelize.ENUM("allowed", "warning"));
  }
};
