'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    /**
     *
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      carts.belongsTo(models.products, {
        foreignKey: 'product_id',
      });
      carts.belongsTo(models.users, {
        foreignKey: 'user_id',
      });
    }
  }
  carts.init(
    {
      cart_id: {
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
      quantity: {
        allowNull: false,
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
    },
    {
      sequelize,
      modelName: 'carts',
    },
  );
  return carts;
};
