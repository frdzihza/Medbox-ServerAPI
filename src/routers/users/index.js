const express = require('express');
const router = express.Router();

const postUserRegisterRouter = require('./post.user');
const patchUserRouter = require('./patch.user');
const userVerifyRouter = require('./get.user');

router.use(postUserRegisterRouter);
router.use(patchUserRouter);
router.use(userVerifyRouter);

module.exports = router;
