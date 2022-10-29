'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transaction_details.belongsTo(models.transactions, {
        foreignKey: 'transaction_id',
      });
      transaction_details.hasOne(models.users, {
        foreignKey: 'user_id',
      });
      transaction_details.hasOne(models.carts, {
        foreignKey: 'cart_id',
      });
      transaction_details.belongsTo(models.products, {
        foreignKey: 'product_id',
      });
      transaction_details.hasMany(models.stock_opnames, {
        foreignKey: 'transaction_details_id',
      });
    }
  }
  transaction_details.init(
    {
      transaction_details_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'transactions',
          key: 'transaction_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'products',
          key: 'product_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
      cart_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'carts',
          key: 'cart_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      paymentProof: {
        type: DataTypes.STRING(255),
      },
    },
    {
      sequelize,
      modelName: 'transaction_details',
    },
  );
  return transaction_details;
};
