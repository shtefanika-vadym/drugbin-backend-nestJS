"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    await Promise.all([
      queryInterface.addColumn("recycle_drug", "recycleId", {
        type: Sequelize.STRING,
        allowNull: false,
      }),

      queryInterface.addColumn("recycle_drug", "cnp", {
        type: Sequelize.STRING,
        allowNull: true,
      }),

      queryInterface.addColumn("recycle_drug", "address", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     */

    await Promise.all([
      queryInterface.removeColumn("recycle_drug", "recycleId"),
      queryInterface.removeColumn("recycle_drug", "cnp"),
      queryInterface.removeColumn("recycle_drug", "address"),
    ]);
  },
};
