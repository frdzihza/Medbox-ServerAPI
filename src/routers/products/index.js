const express = require('express');
const router = express.Router();

const deleteProductsRouter = require('./delete.products');
const patchProductsRouter = require('./patch.products');
const postProductsRouter = require('./post.products');
const getProductsRouter = require('./get.products');

router.use(deleteProductsRouter);
router.use(patchProductsRouter);
router.use(postProductsRouter);
router.use(getProductsRouter);

module.exports = router;
