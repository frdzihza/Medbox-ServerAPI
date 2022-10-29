const express = require('express');
const router = express.Router();
const { auth } = require('../../helpers/auth');
const { carts } = require('../../../models');

const patchCart = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { cart_id, product_id } = req.params;
    const { quantity } = req.body;

    // const quantityDeleted = await carts.destroy({
    //   where: {
    //     user_id,
    //     product_id,
    //   },
    // });
    // if (quantityDeleted) {

    // }
    const resFindProduct = await carts.findOne({
      where: { product_id, user_id },
    });

    if (resFindProduct.dataValues) {
      const quantityPatched = await carts.update(
        {
          quantity,
        },
        {
          where: { product_id, user_id },
        },
      );

      res.send({
        status: 'Success',
        message: 'Success Edit Cart',
        data: {
          quantityPatched,
        },
      });
    } else {
      throw {
        code: 408,
        message: 'you dont have this product in your cart!',
      };
    }

  } catch (error) {
    next(error);
  }
};

const deleteCart = async (req, res, next) => {
  try {
    const { product_id } = req.params;

    const cartDelete = await carts.findOne({
      where: {
        product_id,
      },
    });
    await cartDelete.destroy({ where: { product_id } });

    res.send({
      status: 'Success',
      message: 'Cart Deleted',
    });
  } catch (error) {
    next(error);
  }
};

router.patch('/patchCart/:product_id', auth, patchCart);
router.delete('/:product_id', auth, deleteCart);
module.exports = router;
