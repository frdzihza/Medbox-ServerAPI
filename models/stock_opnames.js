'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class stock_opnames extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      stock_opnames.belongsTo(models.products, {
        foreignKey: 'product_id',
      });
      stock_opnames.belongsTo(models.transactions, {
        foreignKey: 'transaction_id',
      });
      stock_opnames.belongsTo(models.transaction_details, {
        foreignKey: 'transaction_details_id',
      });
    }
  }
  stock_opnames.init(
    {
      stock_opname_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      transaction_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'transactions',
          key: 'transaction_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      transaction_details_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'transaction_details',
          key: 'transaction_details_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      stock: {
        type: DataTypes.INTEGER,
      },
      activity: {
        type: DataTypes.ENUM('terjual', 'tambah_stok', 'unit_conversion'),
      },
    },
    {
      sequelize,
      modelName: 'stock_opnames',
    },
  );
  return stock_opnames;
};
