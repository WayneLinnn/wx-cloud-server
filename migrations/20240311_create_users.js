"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      openid: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: true,
        comment: "WeChat openid",
      },
      session_key: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: "WeChat session key",
      },
      phone: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: true,
        comment: "User phone number",
      },
      nickname: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: "User nickname",
      },
      avatar_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: "User avatar URL",
      },
      last_login_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Last login timestamp",
      },
      login_type: {
        type: Sequelize.ENUM("wechat", "phone"),
        allowNull: false,
        defaultValue: "wechat",
        comment: "Login type: wechat or phone",
      },
      status: {
        type: Sequelize.ENUM("active", "inactive", "blocked"),
        allowNull: false,
        defaultValue: "active",
        comment: "User account status",
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
    await queryInterface.addIndex("users", ["openid"]);
    await queryInterface.addIndex("users", ["phone"]);
    await queryInterface.addIndex("users", ["status"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
