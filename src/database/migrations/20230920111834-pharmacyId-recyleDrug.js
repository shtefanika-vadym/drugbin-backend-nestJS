"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     */
    await queryInterface.addColumn("recycle_drug", "hospitalId", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     */

    await queryInterface.removeColumn("recycle_drug", "hospitalId");
  },
};
