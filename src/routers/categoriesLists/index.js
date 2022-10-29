const express = require('express');
const router = express.Router();

const postCategoriesRouter = require('./post.categoriesList');
const patchCategoriesRouter = require('./patch.categoriesList')
const getCategoriesRouter = require('./get.categoriesList')
const deleteCategoriesRouter = require('./delete.categoriesList')

router.use(postCategoriesRouter);
router.use(patchCategoriesRouter)
router.use(getCategoriesRouter);
router.use(deleteCategoriesRouter);

module.exports = router;