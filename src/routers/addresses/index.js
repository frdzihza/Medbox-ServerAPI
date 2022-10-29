const express = require('express');
const router = express.Router();

const getAddressRouter = require('./get.address');
const postAddressRouter = require('./post.address');
const patchAddressRouter = require('./patch.address');
const deleteAddressRouter = require('./delete.address');

router.use(getAddressRouter);
router.use(postAddressRouter);
router.use(patchAddressRouter);
router.use(deleteAddressRouter);

module.exports = router;
