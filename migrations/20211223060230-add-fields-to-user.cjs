'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users','username', Sequelize.STRING);
    await queryInterface.addColumn('Users','facebook_id', Sequelize.STRING);
    await queryInterface.addColumn('Users','google_id', Sequelize.STRING);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users','username');
    await queryInterface.removeColumn('Users','facebook_id');
    await queryInterface.removeColumn('Users','google_id');
  }
};
