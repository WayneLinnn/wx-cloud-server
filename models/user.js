const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      // define associations here
      User.hasMany(models.LoginRecord, {
        foreignKey: "userId",
        as: "loginRecords",
      });
      User.hasMany(models.VerificationCode, {
        foreignKey: "userId",
        as: "verificationCodes",
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
      openId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      unionId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0, // 0: unknown, 1: male, 2: female
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1: active, 0: inactive
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true, // Enables createdAt and updatedAt
    }
  );

  return User;
};
