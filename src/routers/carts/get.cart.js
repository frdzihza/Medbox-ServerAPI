const express = require('express');
const { carts, products } = require('../../../models');
const { auth } = require('../../helpers/auth');
const router = express.Router();

// const getCartProductController = async (req, res, next) => {
//   try {
//     const { user_id } = req.user;
//     const { product_id } = req.params;
//     const resGetCartProduct = await carts.findAll({
//       where: product_id,
//       //{
//       //   [Op.and]: [{ product_id }, { user_id }],
//       // },
//     });
//     res.send({
//       status: 'Success',
//       message: 'Success get all same product in carts',
//       data: resGetCartProduct,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const getCartsController = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    // const resGetCarts = await carts.findAll({
    //   raw: true,
    //   order: [['createdAt', 'DESC']],
    //   where: { user_id },
    // });

    // const mappedUser = resGetCarts.map((cart) => {
    //   return cart.user_id;
    // });

    // const userFound = [];

    // for (const user_id of mappedUser) {
    //   const getCart = await carts.findOne({ where: { user_id } });
    //   userFound.push(getCart);
    // }

    // const resCartUser = resGetCarts.map((cart, index) => {
    //   cart = userFound[index];
    //   return cart;
    // });

    // const productMap = [];
    // const cartMap = [];
    const cart = await carts.findAll({
      where: { user_id },
      include: [products],
    });

    res.send({
      status: 'Success',
      message: 'Success get all carts',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

router.get('/getCarts/:user_id', auth, getCartsController);
// router.get('/getCartProduct/:product_id', auth, getCartProductController);

module.exports = router;
