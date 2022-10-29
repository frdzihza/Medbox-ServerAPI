const express = require('express');
const router = express.Router();

const getCategoriesRouter = require('./get.categories');


router.use(getCategoriesRouter);


module.exports = router;
