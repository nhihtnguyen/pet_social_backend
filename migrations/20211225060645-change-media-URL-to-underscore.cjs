'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Posts', 'media_URL', 'media_url');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Posts', 'media_url', 'media_URL');
  }
};
