"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LoginRecord extends Model {
    static associate(models) {
      // 定义关联关系
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  LoginRecord.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      login_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      login_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      ip_address: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "LoginRecord",
      tableName: "login_records",
      underscored: true,
      timestamps: true,
    }
  );

  return LoginRecord;
};
