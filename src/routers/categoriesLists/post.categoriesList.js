const express = require('express');
const router = express.Router();
const { categories_list } = require('../../../models');
const { uploadCategories } = require('../../lib/multer');

const postNewCategories = async (req, res, next) => {
  try {
    const { category, categoryImage } = req.body;
    const getCategories = await categories_list.findAll({
      where: { category },
    });
    if (getCategories.length) {
      throw { code: 400, message: 'Category already exist' };
    }

    const imageExtNameSplit = categoryImage.split('.');

    const newCategories = await categories_list.create({
      category,
    });

    const test = await newCategories.update({
      categoryImage: `/public/categoriesImage/${
        newCategories.dataValues.category_lists_id
      }.${imageExtNameSplit[imageExtNameSplit.length - 1]}`,
    });

    res.send({
      status: 'success',
      message: 'Success create new category',
      data: {
        newCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

const uploadCategoryImage = async (req, res, next) => {
  try {
    return res.send({
      status: 'Success',
      message: 'Success upload category image',
      imageName: req.params.category_filename,
    });
  } catch (error) {
    next(error);
  }
};

router.post('/', postNewCategories);
router.post(
  '/upload/:category_filename',
  uploadCategories.single('categoriesImage'),
  uploadCategoryImage,
);

module.exports = router;
