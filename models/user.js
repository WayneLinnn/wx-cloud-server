"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 定义关联关系
      this.hasMany(models.LoginRecord, {
        foreignKey: "user_id",
        as: "loginRecords",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      openid: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: true,
      },
      nickname: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      avatar_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true, // 使用下划线命名
      timestamps: true, // 启用时间戳
    }
  );

  return User;
};
