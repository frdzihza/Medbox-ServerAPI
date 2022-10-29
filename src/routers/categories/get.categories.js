const express = require('express');
const router = express.Router();
const { categories_list } = require('../../../models');

async function getAllCategoriesController(req, res, next) {
  try {
    const resGetAllCategoriesLists = await categories_list.findAll();

    res.send({
      status: 'success',
      categories: resGetAllCategoriesLists,
    });
  } catch (error) {
    next(error);
  }
}

async function getLandingCategoriesController(req, res, next) {
  try {
    const resGetCategories = await categories_list.findAll({
      limit: 9,
    });

    res.send({
      status: 'success',
      resGetCategories,
    });
  } catch (error) {
    next(error);
  }
}

router.get('/getAll', getAllCategoriesController);
router.get('/getLandingCategories', getLandingCategoriesController);

module.exports = router;
