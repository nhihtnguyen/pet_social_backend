'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users','background',Sequelize.STRING);
    await queryInterface.addColumn('Pets','background',Sequelize.STRING);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users','background');
    await queryInterface.removeColumn('Pets','background');
  }
};
