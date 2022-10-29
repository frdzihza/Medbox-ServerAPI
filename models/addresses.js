'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class addresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      addresses.hasOne(models.users, {
        foreignKey: 'user_id',
      });
      addresses.belongsTo(models.transactions, {
        foreignKey: 'address_id',
      });
    }
  }
  addresses.init(
    {
      address_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      addressDetail: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      recipient: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      province_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      city_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'addresses',
    },
  );
  return addresses;
};
