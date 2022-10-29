const express = require('express');
const router = express.Router();
const {
  transactions,
  products,
  transaction_details,
  addresses,
  stock_opnames,
} = require('../../../models');
const { auth } = require('../../helpers/auth');
const { Op } = require('sequelize');

const getStockOpname = async (req, res, next) => {
  try {
    const { product_id } = req.params;

    let { paramsStartDate, paramsEndDate } = req.query;

    let resGetStockOpname;

    if (paramsStartDate && paramsEndDate) {
      resGetStockOpname = await stock_opnames.findAll({
        where: {
          product_id,
          createdAt: { [Op.between]: [paramsStartDate, paramsEndDate] },
        },
        include: [
          {
            model: transactions,
            attributes: [
              'transaction_id',
              'user_id',
              'address_id',
              'totalPrice',
              'status',
              'courier',
              'deliveryCost',
              'prescriptionImage',
            ],
          },
          {
            model: products,
            attributes: [
              'product_id',
              'productName',
              'productPrice',
              'productImage',
              'description',
              'productStock',
              'isPublic',
              'packageType',
              'servingType',
            ],
          },
          {
            model: transaction_details,
            attributes: [
              'transaction_details_id',
              'transaction_id',
              'user_id',
              'product_id',
              'cart_id',
              'quantity',
              'paymentProof',
            ],
          },
        ],
      });
    } else if (paramsStartDate) {
      paramsEndDate = new Date('July 21, 3000 01:15:00');
      resGetStockOpname = await stock_opnames.findAll({
        where: {
          product_id,
          createdAt: { [Op.between]: [paramsStartDate, paramsEndDate] },
        },
        include: [
          {
            model: transactions,
            attributes: [
              'transaction_id',
              'user_id',
              'address_id',
              'totalPrice',
              'status',
              'courier',
              'deliveryCost',
              'prescriptionImage',
            ],
          },
          {
            model: products,
            attributes: [
              'product_id',
              'productName',
              'productPrice',
              'productImage',
              'description',
              'productStock',
              'isPublic',
              'packageType',
              'servingType',
            ],
          },
          {
            model: transaction_details,
            attributes: [
              'transaction_details_id',
              'transaction_id',
              'user_id',
              'product_id',
              'cart_id',
              'quantity',
              'paymentProof',
            ],
          },
        ],
      });
    } else if (paramsEndDate) {
      paramsStartDate = new Date(1970);
      resGetStockOpname = await stock_opnames.findAll({
        where: {
          product_id,
          createdAt: { [Op.between]: [paramsStartDate, paramsEndDate] },
        },
        include: [
          {
            model: transactions,
            attributes: [
              'transaction_id',
              'user_id',
              'address_id',
              'totalPrice',
              'status',
              'courier',
              'deliveryCost',
              'prescriptionImage',
            ],
          },
          {
            model: products,
            attributes: [
              'product_id',
              'productName',
              'productPrice',
              'productImage',
              'description',
              'productStock',
              'isPublic',
              'packageType',
              'servingType',
            ],
          },
          {
            model: transaction_details,
            attributes: [
              'transaction_details_id',
              'transaction_id',
              'user_id',
              'product_id',
              'cart_id',
              'quantity',
              'paymentProof',
            ],
          },
        ],
      });
    } else {
      resGetStockOpname = await stock_opnames.findAll({
        where: {
          product_id,
        },
        include: [
          {
            model: transactions,
            attributes: [
              'transaction_id',
              'user_id',
              'address_id',
              'totalPrice',
              'status',
              'courier',
              'deliveryCost',
              'prescriptionImage',
            ],
          },
          {
            model: products,
            attributes: [
              'product_id',
              'productName',
              'productPrice',
              'productImage',
              'description',
              'productStock',
              'isPublic',
              'packageType',
              'servingType',
            ],
          },
          {
            model: transaction_details,
            attributes: [
              'transaction_details_id',
              'transaction_id',
              'user_id',
              'product_id',
              'cart_id',
              'quantity',
              'paymentProof',
            ],
          },
        ],
      });
    }
    res.send({
      status: 'Success',
      resGetStockOpname,
    });
  } catch (error) {
    next(error);
  }
};
router.get('/:product_id', getStockOpname);

module.exports = router;
