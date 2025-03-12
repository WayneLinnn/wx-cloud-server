const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.LoginRecord, {
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
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: true,
      },
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      avatar_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive", "banned"),
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return User;
};
