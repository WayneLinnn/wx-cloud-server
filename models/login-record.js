"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LoginRecord extends Model {
    static associate(models) {
      // 定义关联关系
      LoginRecord.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  LoginRecord.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      login_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: "wechat: 微信登录, phone: 手机号登录",
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
