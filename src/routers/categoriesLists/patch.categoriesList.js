const express = require('express');
const router = express.Router();
const { categories_list } = require('../../../models');

const patchCategoryList = async (req, res, next) => {
  try {
    const { newCategory, currentCategory } = req.body;
    const { category_lists_id } = req.params;

    const resFindCategoryList = await categories_list.findOne({
      where: { category_lists_id },
    });
    const extName = newCategory.categoryImage.split('.');

    const resUpdateCategoryList = await resFindCategoryList.update({
      category: newCategory.category,
      categoryImage: `/public/categoriesImage/${category_lists_id}.${extName[1]}`,
    });

    res.send({
      status: 'Success',
      message: 'Success Update Category',
      data: {
        resUpdateCategoryList,
      },
    });
  } catch (error) {
    next(error);
  }
};

router.patch('/categoryUpdate/:category_lists_id', patchCategoryList);

module.exports = router;
