'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'phoneNumber', 'phone_number');
    await queryInterface.renameColumn('Users', 'firstName', 'first_name');
    await queryInterface.renameColumn('Users', 'lastName', 'last_name');
    await queryInterface.renameColumn('Users', 'isActive', 'is_active');
    await queryInterface.renameColumn('Users', 'isBlocked', 'is_blocked');
    await queryInterface.renameColumn('Users', 'countryCode', 'country_code');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Users', 'phone_number', 'phoneNumber');
    await queryInterface.renameColumn('Users', 'first_name', 'firstName');
    await queryInterface.renameColumn('Users', 'last_name', 'lastName');
    await queryInterface.renameColumn('Users', 'is_active', 'isActive');
    await queryInterface.renameColumn('Users', 'is_blocked', 'isBlocked');
    await queryInterface.renameColumn('Users', 'country_code', 'countryCode');
  }
};
