const express = require('express');
const router = express.Router();
const {
  transactions,
  carts,
  products,
  transaction_details,
  stock_opnames,
} = require('../../../models');
const moment = require('moment');
const { auth } = require('../../helpers/auth');
const { Op } = require('sequelize');
const schedule = require('node-schedule');
const { uploadPayment } = require('../../lib/multer');

const patchTransaction = async (req, res, next) => {
  try {
    const { transStatus, trans } = req.body;
    const { transaction_id } = trans;

    const resFindTransaction = await transactions.findOne({
      where: { transaction_id, status: 'awaiting_payment' },
      attributes: ['transaction_id', 'user_id', 'address_id'],
    });

    if (resFindTransaction.dataValues) {
      const resPaymentSuccess = await transactions.update(
        {
          status: transStatus,
        },
        { where: { transaction_id } },
      );

      res.send({
        status: 'success',
        message: 'Payment Success',
        data: {
          resPaymentSuccess,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const updatePaymentProof = async (req, res, next) => {
  try {
    const { transaction_id } = req.params;
    const { filename } = req.file;
    const finalFileName = `/public/paymentProof/${filename}`;

    const resUpdateAvatar = await transaction_details.update(
      {
        paymentProof: finalFileName,
      },
      {
        where: {
          transaction_id,
          // user_id
        },
      },
    );

    if (resUpdateAvatar.affectedRows)
      throw { message: 'Failed to upload Payment Proof' };

    res.send({
      status: 'Success',
      message: 'Success upload payment proof',
    });
  } catch (error) {
    next(error);
  }
};

const cancelTransaction = async (req, res, next) => {
  try {
    const { transaction_id } = req.params;

    const resFindTransaction = await transactions.findOne({
      where: { transaction_id },
      attributes: ['transaction_id', 'user_id', 'address_id'],
    });

    if (resFindTransaction.dataValues) {
      const resFindTransactionDetail = await transaction_details.findAll({
        where: { transaction_id },
        include: [products],
      });

      resFindTransactionDetail.forEach(async (data) => {
        const resUpdateStock = await products.update(
          {
            productStock:
              data.dataValues.product.dataValues.productStock +
              data.dataValues.quantity,
          },
          {
            where: {
              product_id: data.dataValues.product.dataValues.product_id,
            },
          },
        );
        const resCancelOrder = await transactions.update(
          {
            status: 'order_cancelled',
          },
          { where: { transaction_id } },
        );
      });

      res.send({
        status: 'Success',
        message: 'order is cancelled',
        data: {
          resFindTransactionDetail,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const confirmTransaction = async (req, res, next) => {
  try {
    const { transaction_id } = req.params;

    const resFindTransaction = await transactions.findOne({
      where: { transaction_id },
      attributes: ['transaction_id', 'user_id', 'address_id'],
    });

    if (resFindTransaction.dataValues) {
      const resFindTransactionDetail = await transaction_details.findAll({
        where: { transaction_id },
        include: [products],
      });

      resFindTransactionDetail.forEach(async (data) => {
        // const resUpdateStock = await products.update(
        //   {
        //     productStock:
        //       data.dataValues.product.dataValues.productStock -
        //       data.dataValues.quantity,
        //   },
        //   {
        //     where: {
        //       product_id: data.dataValues.product.dataValues.product_id,
        //     },
        //   },
        // );
        const resConfirmOrder = await transactions.update(
          {
            status: 'order_confirmed',
          },
          { where: { transaction_id } },
        );
      });
      res.send({
        status: 'Success',
        message: 'order is confirmed',
        data: {
          resFindTransactionDetail,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const adminConfirmDeliver = async (req, res, next) => {
  try {
    const { transaction_id } = req.params;

    const resFindTransaction = await transaction_details.findAll({
      where: { transaction_id },
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
      ],
    });

    resFindTransaction.map(async (data) => {
      await stock_opnames.create({
        product_id: data.dataValues.product_id,
        transaction_id: data.dataValues.transaction_id,
        transaction_details_id: data.dataValues.transaction_details_id,
        stock: data.dataValues.quantity,
        activity: 'terjual',
      });
    });

    const resconfirmDeliver = await transactions.update(
      {
        status: 'delivering_order',
      },
      { where: { transaction_id } },
    );

    res.send({
      status: 'Success',
      message: 'Confirmation Success. Order is being delivered.',
      data: {
        resconfirmDeliver,
      },
    });
  } catch (error) {
    next(error);
  }
};

const adminCancelOrder = async (req, res, next) => {
  try {
    const { transaction_id } = req.params;

    const resCancelOrder = await transactions.update(
      {
        status: 'order_cancelled',
      },
      { where: { transaction_id } },
    );
    res.send({
      status: 'Success',
      message: 'Cancel Order Success.',
      data: {
        resCancelOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

const adminPaymentConfirm = async (req, res, next) => {
  try {
    const { transaction_id } = req.params;

    const resconfirmDeliver = await transactions.update(
      {
        status: 'processing_order',
      },
      { where: { transaction_id } },
    );
    res.send({
      status: 'Success',
      message: 'Confirmation Success. Order is confirmed.',
      data: {
        resconfirmDeliver,
      },
    });
  } catch (error) {
    next(error);
  }
};

const adminConfirmPrescription = async (req, res, next) => {
  try {
    const { transaction_id, product_id, user_id } = req.body;
    const createTransactionDetail = await transaction_details.create({
      transaction_id: transaction_id,
      product_id: product_id,
      user_id: user_id,
      quantity: 1,
    });

    if (createTransactionDetail) {
      const resProduct = await products.findOne({
        where: createTransactionDetail.product_id,
      });
      const harga = resProduct.dataValues.productPrice;
      const resConfirmPrescription = await transactions.update(
        {
          prescriptionImage: null,
          totalPrice: harga,
        },
        { where: { transaction_id: createTransactionDetail.transaction_id } },
      );
      res.send({
        status: 'success',
        message: 'prescription confirmed',
        data: {
          resConfirmPrescription,
          createTransactionDetail,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const adminCancelPayment = async (req, res, next) => {
  try {
    const { transaction_id } = req.params;

    const resCancelOrder = await transactions.update(
      {
        status: 'awaiting_payment',
      },
      { where: { transaction_id } },
    );
    res.send({
      status: 'Success',
      message: 'Cancel Order Success.',
      data: {
        resCancelOrder,
      },
    });
  } catch (error) {
    next(error);
  }
};

router.patch('/patchTransaction', auth, patchTransaction);
router.patch(
  '/paymentProof/:transaction_id',
  auth,
  uploadPayment.single('paymentProof'),
  updatePaymentProof,
);
router.patch('/cancelTransaction/:transaction_id', cancelTransaction);
router.patch('/confirmTransaction/:transaction_id', confirmTransaction);
router.patch('/adminConfirmDeliver/:transaction_id', adminConfirmDeliver);
router.patch('/adminCancelOrder/:transaction_id', adminCancelOrder);
router.patch('/adminPaymentConfirm/:transaction_id', adminPaymentConfirm);
router.patch('/adminCancelPayment/:transaction_id', adminCancelPayment);
router.patch('/adminConfirm', adminConfirmPrescription);

module.exports = router;
