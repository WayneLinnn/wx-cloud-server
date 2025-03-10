"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VerificationCode extends Model {
    static associate(models) {
      // 无需关联关系
    }
  }

  VerificationCode.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "VerificationCode",
      tableName: "verification_codes",
      underscored: true,
      timestamps: true,
      indexes: [
        {
          fields: ["phone", "code"],
        },
        {
          fields: ["expires_at"],
        },
      ],
    }
  );

  return VerificationCode;
};
