'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categories_list extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      categories_list.hasMany(models.categories, {
        foreignKey: 'category_lists_id',
      });
    }
  }
  categories_list.init(
    {
      category_lists_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      category: {
        type: DataTypes.STRING,
        unique: true,
      },
      categoryImage: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'categories_list',
    },
  );
  return categories_list;
};
