const express = require('express');
const router = express.Router();
const {
  transactions,
  carts,
  products,
  transaction_details,
  addresses,
} = require('../../../models');
const moment = require('moment');
const { auth } = require('../../helpers/auth');
const { Op } = require('sequelize');
const schedule = require('node-schedule');
const { uploadPrescriptionImage } = require('../../lib/multer');

const postTransaction = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { totalPrice, address_id, courier, deliveryCost } = req.body;
    const resFindCarts = await carts.findAll({
      where: {
        user_id,
      },
    });

    const resCreateTransaction = await transactions.create({
      user_id,
      totalPrice: totalPrice,
      address_id,
      courier,
      deliveryCost: deliveryCost,
    });

    const dueDate = moment(resCreateTransaction.dataValues.createdAt).add(
      1,
      'days',
    );

    const productExist = await Promise.all(
      resFindCarts.map(async (data) => {
        try {
          const existingProduct = await products.findOne({
            where: { product_id: data.dataValues.product_id },
          });
          return existingProduct.dataValues;
        } catch (error) {
          console.log(error);
        }
      }),
    );

    schedule.scheduleJob(new Date(dueDate), async () => {
      const checkingStatus = await transactions.findOne({
        where: {
          transaction_id: resCreateTransaction.dataValues.transaction_id,
          status: 'awaiting_payment',
        },
        attributes: ['transaction_id', 'user_id', 'address_id'],
      });

      resFindCarts.forEach(async (data) => {
        if (checkingStatus.dataValues.transaction_id) {
          await transactions.update(
            { status: 'order_cancelled' },
            {
              where: {
                transaction_id: resCreateTransaction.dataValues.transaction_id,
              },
            },
          );
          const updateProduct = await products.findOne({
            where: { product_id: data.dataValues.product_id },
          });
          await products.update(
            {
              productStock:
                updateProduct.dataValues.productStock +
                data.dataValues.quantity,
            },
            { where: { product_id: data.dataValues.product_id } },
          );
        }
      });
    });

    resFindCarts.forEach(async (data) => {
      const updateProduct = await products.findOne({
        where: { product_id: data.dataValues.product_id },
      });
      await products.update(
        {
          productStock:
            updateProduct.dataValues.productStock - data.dataValues.quantity,
        },
        { where: { product_id: data.dataValues.product_id } },
      );
      await carts.destroy({ where: { user_id } });
    });

    res.send({
      status: 'success',
      message: 'create transcation success!',
      data: {
        productExist,
      },
    });

    resFindCarts.forEach(async (data) => {
      await transaction_details.create({
        user_id: data.dataValues.user_id,
        quantity: data.dataValues.quantity,
        product_id: data.dataValues.product_id,
        transaction_id: resCreateTransaction.dataValues.transaction_id,
      });
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionsByIndex = async (req, res, next) => {
  try {
    const { selected } = req.body;

    let statusFind;

    switch (selected) {
      case 1:
        statusFind = 'processing_order';
        break;
      case 2:
        statusFind = 'delivering_order';
        break;
      case 3:
        statusFind = 'order_confirmed';
        break;
      case 4:
        statusFind = 'order_cancelled';
        break;
      case 5:
        statusFind = 'awaiting_payment';
        break;
      case 6:
        statusFind = 'awaiting_payment_confirmation';
        break;

      default:
        const { user_id } = req.params;
        const resFetchTransactions = await transactions.findAll({
          where: { user_id },
          attributes: [
            'transaction_id',
            'user_id',
            'address_id',
            'totalPrice',
            'status',
          ],

          include: [
            {
              model: transaction_details,
              include: [
                {
                  model: products,
                },
              ],
            },
          ],
        });

        res.send({
          status: 'success',
          message: 'Fetch Transaction Success',
          data: {
            resFetchTransactions,
            // resFetchAddress,
          },
        });
    }


    const { user_id } = req.params;
    const resFetchTransactions = await transactions.findAll({
      where: { user_id, status: statusFind },
      attributes: [
        'transaction_id',
        'user_id',
        'address_id',
        'totalPrice',
        'status',
      ],

      include: [
        {
          model: transaction_details,
          include: [
            {
              model: products,
            },
          ],
        },
      ],
    });
    res.send({
      status: 'success',
      message: 'Fetch Transaction Success',
      data: {
        resFetchTransactions,
        // resFetchAddress,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createUserPrescriptionTransaction = async (req, res, next) => {
  try {
    return res.send({
      status: 'Success',
      message: 'Upload Prescription Image Success',
      imageName: req.params.prescription_fileName,
    });
  } catch (error) {
    next(error);
  }
};

const createUserPrescriptionImage = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { address_id, courier, deliveryCost, imageName } = req.body;

    const imageSplit = imageName.split('.');

    const resCreateTransaction = await transactions.create({
      user_id,
      address_id,
      courier,
      deliveryCost: deliveryCost,
    });

    const resUpdatePrescription = await resCreateTransaction.update({
      prescriptionImage: `/public/prescriptionImage/${
        resCreateTransaction.dataValues.transaction_id
      }.${imageSplit[imageSplit.length - 1]}`,
    });

    res.send({
      status: 'success',
      message: 'Create Transcation Success!',
      data: {
        resCreateTransaction,
        prescriptionImageName: `${
          resCreateTransaction.dataValues.transaction_id
        }.${imageSplit[imageSplit.length - 1]}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

router.post('/createTransaction', auth, postTransaction);
router.post('/getTransactionsByIndex/:user_id', getTransactionsByIndex);
router.post(
  '/createPrescriptionTransaction/:prescription_fileName',
  auth,
  uploadPrescriptionImage.single('prescriptionImage'),
  createUserPrescriptionTransaction,
);
router.post('/uploadPrescriptionImage', auth, createUserPrescriptionImage);

module.exports = router;
