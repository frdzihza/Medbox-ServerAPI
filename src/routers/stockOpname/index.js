const express = require('express');
const router = express.Router();


const getStockOpnameRouter = require('./get.stockopnames');

router.use(getStockOpnameRouter);


module.exports = router;
