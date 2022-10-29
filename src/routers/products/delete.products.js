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

async function deleteProductController(req, res, next) {
  try {
    const { product_id } = req.params;

    const resDeleteProduct = await products.destroy({
      where: { product_id },
    });

    const resDeleteProductDetail = await product_details.destroy({
      where: { product_id },
    });

    res.send({
      status: 'success',
      message: 'success delete product',
    });
  } catch (error) {
    next(error);
  }
}

const deleteAddedStock = async (req, res, next) => {
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

    const remainingTotal =
      getProductStock['productStock'] - getStockOpnameID['stock'];

    const createHistoryProduct = await stock_opnames.destroy({
      where: {
        stock_opname_id,
      },
    });

    const addProductStock = await products.update(
      { productStock: remainingTotal },
      {
        where: {
          product_id,
        },
      },
    );
    res.send({
      status: 'Success',
      message: 'Delete Added Product Stock Success',
    });
  } catch (error) {
    next(error);
  }
};

router.delete('/:product_id', deleteProductController);
router.delete(
  '/deleteAddedStock/:product_id/:stock_opname_id',
  deleteAddedStock,
);

module.exports = router;
