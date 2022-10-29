'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      product_details.hasOne(models.products, {
        foreignKey: 'product_id',
      });
    }
  }
  product_details.init(
    {
      product_details_id: {
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
      current_quantity: {
        type: DataTypes.INTEGER,
      },
      default_quantity: {
        type: DataTypes.INTEGER,
      },
      isOpen: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: 'product_details',
    },
  );
  return product_details;
};
