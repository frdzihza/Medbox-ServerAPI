'use strict';
const { Model } = require('sequelize');
const stock_opnames = require('./stock_opnames');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transactions.belongsTo(models.users, {
        foreignKey: 'user_id',
      });
      transactions.hasOne(models.addresses, {
        foreignKey: 'address_id',
      });
      transactions.hasMany(models.transaction_details, {
        foreignKey: 'transaction_id',
      });
      transactions.hasMany(models.stock_opnames, {
        foreignKey: 'transaction_id',
      });
    }
  }
  transactions.init(
    {
      transaction_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      prescriptionImage: {
        type: DataTypes.STRING(255),
      },
      prescriptionImage: {
        type: DataTypes.STRING,
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
      address_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'addresses',
          key: 'address_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      totalPrice: {
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM(
          'awaiting_payment',
          'awaiting_payment_confirmation',
          'processing_order',
          'order_cancelled',
          'delivering_order',
          'order_confirmed',
        ),
        defaultValue: 'awaiting_payment',
      },
      courier: {
        type: DataTypes.STRING,
      },
      deliveryCost: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'transactions',
    },
  );
  return transactions;
};
