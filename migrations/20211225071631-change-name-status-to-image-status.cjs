'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Posts', 'status', 'image_status');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Posts', 'image_status', 'status');
  }
};
