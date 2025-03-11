const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class VerificationCode extends Model {
    static associate(models) {
      VerificationCode.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  VerificationCode.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      purpose: {
        type: DataTypes.STRING,
        allowNull: false, // 'login', 'register', 'reset'
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "VerificationCode",
      tableName: "verification_codes",
      timestamps: true,
    }
  );

  return VerificationCode;
};
