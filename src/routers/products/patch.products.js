const express = require('express');
const router = express.Router();
const { uploadProductImage } = require('../../lib/multer');
const { auth } = require('../../helpers/auth');
const { QueryTypes } = require('sequelize');
const {
  products,
  sequelize,
  categories,
  categories_list,
  product_details,
  stock_opnames,
} = require('../../../models');
require('dotenv').config();

async function updateProductController(req, res, next) {
  try {
    const { productInputs, currentProduct } = req.body;

    const { product_id } = req.params;

    const categorySplit = productInputs.categoryInfo.split('=-=');
    const resFindProduct = await products.findOne({ where: { product_id } });

    const extName = productInputs.productImage.split('.');

    const resUpdateProduct = await resFindProduct.update({
      productName: productInputs.productName,
      productPrice: productInputs.productPrice,
      productImage: `/public/productImages/${product_id}.${extName[1]}`,
      description: productInputs.description,
      defaultQuantity: productInputs.defaultQuantity,
      productStock: productInputs.productStock,
      packageType: productInputs.packageType,
      servingType: productInputs.servingType,
    });

    const resFindAvailableCategory = await categories.findOne({
      where: { product_id: resUpdateProduct.dataValues.product_id },
    });

    const resUpdateCategory = await resFindAvailableCategory.update({
      category_lists_id: categorySplit[0],
      product_id: resUpdateProduct.dataValues.product_id,
      categoryName: categorySplit[1],
    });

    res.send({
      status: 'success',
      resUpdateProduct,
      resUpdateCategory,
    });
  } catch (error) {
    next(error);
  }
}

const addProductStock = async (req, res, next) => {
  try {
    const { productStock } = req.body;

    const { product_id } = req.params;

    const getProductStock = await products.findOne({
      where: {
        product_id,
      },
      raw: true,
    });

    const totalStock = getProductStock['productStock'] + productStock;

    const addProductStock = await products.update(
      { productStock: totalStock },
      {
        where: {
          product_id,
        },
      },
    );

    const createHistoryProduct = await stock_opnames.create(
      { product_id, activity: 'tambah_stok', stock: productStock },
      {
        where: {
          product_id,
        },
      },
    );

    res.send({
      status: 'Success',
      message: 'Add Product Stock Success',
      data: createHistoryProduct,
    });
  } catch (error) {
    next(error);
  }
};

const updateAddedStock = async (req, res, next) => {
  try {
    const { productStock } = req.body;
    const { product_id } = req.params;
    const { stock_opname_id } = req.params;

    const getStockOpnameID = await stock_opnames.findOne({
      where: {
        stock_opname_id,
      },
      raw: true,
    });

    const getProductStock = await products.findOne({
      where: {
        product_id,
      },
      raw: true,
    });

    let remainingTotal =
      getProductStock['productStock'] +
      Math.abs(getStockOpnameID['stock'] - productStock);

    if (productStock < getStockOpnameID['stock']) {
      remainingTotal =
        getProductStock['productStock'] -
        (getStockOpnameID['stock'] - productStock);
    }

    const addProductStock = await products.update(
      { productStock: remainingTotal },
      {
        where: {
          product_id,
        },
      },
    );

    const createHistoryProduct = await stock_opnames.update(
      { stock: productStock },
      {
        where: {
          product_id,
          stock_opname_id,
        },
      },
    );
    res.send({
      status: 'Success',
      message: 'Update Added Product Success',
    });
  } catch (error) {
    next(error);
  }
};

router.patch('/productsUpdate/:product_id', updateProductController);
router.patch('/addStock/:product_id', addProductStock);
router.patch(
  '/updateAddedStock/:product_id/:stock_opname_id',
  updateAddedStock,
);

module.exports = router;
