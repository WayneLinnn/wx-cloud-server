"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("verification_codes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
        comment: "Phone number",
      },
      code: {
        type: Sequelize.STRING(6),
        allowNull: false,
        comment: "Verification code",
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "Code expiration timestamp",
      },
      used: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Whether the code has been used",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    // Add indexes
    await queryInterface.addIndex("verification_codes", ["phone"]);
    await queryInterface.addIndex("verification_codes", ["code"]);
    await queryInterface.addIndex("verification_codes", ["expires_at"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("verification_codes");
  },
};
