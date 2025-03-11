const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class LoginRecord extends Model {
    static associate(models) {
      LoginRecord.belongsTo(models.User, {
        foreignKey: "userId",
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      loginType: {
        type: DataTypes.STRING,
        allowNull: false, // 'wechat' or 'phone'
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      loginStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "LoginRecord",
      tableName: "login_records",
      timestamps: true,
    }
  );

  return LoginRecord;
};
