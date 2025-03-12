const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LoginRecord extends Model {
    static associate(models) {
      LoginRecord.belongsTo(models.User, {
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
        references: {
          model: "users",
          key: "id",
        },
      },
      login_type: {
        type: DataTypes.ENUM("wechat", "phone"),
        allowNull: false,
      },
      login_time: {
        type: DataTypes.DATE,
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
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return LoginRecord;
};
