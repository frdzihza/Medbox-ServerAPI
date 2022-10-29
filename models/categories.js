'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      categories.hasOne(models.products, {
        foreignKey: 'product_id',
      });
      categories.hasOne(models.categories_list, {
        foreignKey: 'category_lists_id',
      });
    }
  }
  categories.init(
    {
      category_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      category_lists_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'categories_lists',
          key: 'category_lists_id',
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
        unique: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      categoryName: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'categories',
    },
  );
  return categories;
};
