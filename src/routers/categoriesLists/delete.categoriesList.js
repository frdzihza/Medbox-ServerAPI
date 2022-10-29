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
} = require('../../../models');

async function deleteCategoryController(req, res, next) {
  try {
    const { category_lists_id } = req.params;

    const resDeleteProduct = await categories_list.destroy({
      where: { category_lists_id },
    });

    res.send({
      status: 'success',
      message: 'success delete product',
    });
  } catch (error) {
    next(error);
  }
}

router.delete('/:category_lists_id', deleteCategoryController);

module.exports = router;
