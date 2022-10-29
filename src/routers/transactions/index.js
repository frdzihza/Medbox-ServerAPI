const express = require('express');
const router = express.Router();


const postTransactionsRouter = require('./post.transactions');
const patchTransactionRouter = require('./patch.transactions')
const getTransactionRouter = require('./get.transactions')

router.use(postTransactionsRouter);
router.use(patchTransactionRouter);
router.use(getTransactionRouter);

module.exports = router;