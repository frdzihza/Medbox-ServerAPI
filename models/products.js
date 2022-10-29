'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      products.hasMany(models.carts, {
        foreignKey: 'product_id',
      });
      products.hasMany(models.categories, {
        foreignKey: 'product_id',
      });
      products.hasMany(models.product_details, {
        foreignKey: 'product_id',
      });
      products.hasMany(models.stock_opnames, {
        foreignKey: 'product_id',
      });
      products.hasMany(models.transactions, {
        foreignKey: 'product_id',
      });
      products.hasOne(models.transaction_details, {
        foreignKey: 'transaction_details_id',
      });
      // Error: products.belongsTo called with something that's not a subclass of Sequelize.Model
    }
  }
  products.init(
    {
      product_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      productName: {
        type: DataTypes.STRING(255),
      },
      productPrice: {
        type: DataTypes.INTEGER,
      },
      productImage: {
        type: DataTypes.STRING(255),
      },
      description: {
        type: DataTypes.STRING,
      },
      defaultQuantity: {
        type: DataTypes.INTEGER,
      },
      productStock: {
        type: DataTypes.INTEGER,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      defaultQuantity: {
        type: DataTypes.INTEGER,
      },
      packageType: {
        type: DataTypes.STRING,
      },
      servingType: {
        type: DataTypes.STRING,
      },
      formula: {
        type: DataTypes.JSON,
      },
    },
    {
      sequelize,
      modelName: 'products',
    },
  );
  return products;
};
