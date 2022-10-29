const express = require('express');
const { carts } = require('../../../models');
const { auth } = require('../../helpers/auth');
const router = express.Router();
const { Op } = require('sequelize');

const addToCartController = async (req, res, next) => {
  try {
    const { quantity, product_id, user_id } = req.body;

    const resFindProduct = await carts.findAll({
      where: {
        [Op.and]: [{ product_id }, { user_id }],
      },
    });

    if (!resFindProduct.length) {
      const resCreateCart = await carts.create({
        quantity,
        product_id,
        user_id,
      });
      res.send({
        status: 'success',
        message: 'create cart success!',
        data: {
          result: {
            user_id: user_id,
            quantity: quantity,
            product_id: product_id,
          },
        },
        detail: resCreateCart,
      });
    } else {
      await resFindProduct[0].update({
        quantity: resFindProduct[0].dataValues.quantity + quantity,
      });

      const resUpdateQuantity = await resFindProduct[0].save();

      res.send({
        status: 'success',
        message: 'cart updated!',
      });
    }
  } catch (error) {
    next(error);
  }
};

router.post('/addToCart/:product_id', auth, addToCartController);

module.exports = router;
