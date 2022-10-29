const express = require('express');
const router = express.Router();

const postCartRouter = require('./post.cart');
const patchCartRouter = require('./patch.cart');
const getCartRouter = require('./get.cart');

router.use(postCartRouter);
router.use(patchCartRouter);
router.use(getCartRouter);

module.exports = router;
