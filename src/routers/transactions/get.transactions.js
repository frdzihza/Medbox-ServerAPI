const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const {
  transactions,
  products,
  transaction_details,
  addresses,
  users,
} = require('../../../models');
const { auth } = require('../../helpers/auth');

const adminGetTransactionsByIndex = async (req, res, next) => {
  try {
    const { selected } = req.params;
    let order_by = req.query.order_by;
    let ordered_method = req.query.ordered_method;
    let transactionID = req.query.transaction;

    if (order_by == 'undefined' || ordered_method == 'undefined') {
      order_by = 'transaction_id';
      ordered_method = 'DESC';
    }

    let { page, pageSize } = req.query;

    page = +page;
    pageSize = +pageSize;

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    var statusFind;
    let whereController = { prescriptionImage: null };
    if (transactionID != 'undefined') {
      whereController['transaction_id'] = parseInt(transactionID);
    }

    switch (selected) {
      case '1' || 1:
        statusFind = 'processing_order';
        break;
      case '2' || 2:
        statusFind = 'delivering_order';
        break;
      case '3' || 3:
        statusFind = 'order_confirmed';
        break;
      case '4' || 4:
        statusFind = 'order_cancelled';
        break;
      case '5' || 5:
        statusFind = 'awaiting_payment';
        break;
      case '6' || 6:
        statusFind = 'awaiting_payment_confirmation';
        break;

      default:
        const resFetchTransactions = await transactions.findAll({
          where: whereController,
          attributes: [
            'transaction_id',
            'user_id',
            'address_id',
            'totalPrice',
            'status',
            'courier',
            'deliveryCost',
            'createdAt',
          ],
          limit: limit,
          offset: offset,
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
          order: [[order_by, ordered_method]],
        });

        res.send({
          status: 'success',
          message: 'Fetch Transaction Success',
          data: {
            resFetchTransactions,
          },
        });
    }

    const resFetchTransactions = await transactions.findAll({
      where: { status: statusFind, prescriptionImage: null },
      attributes: [
        'transaction_id',
        'user_id',
        'address_id',
        'totalPrice',
        'status',
        'courier',
        'deliveryCost',
        'createdAt',
      ],
      limit: limit,
      offset: offset,
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
      },
    });
  } catch (error) {
    next(error);
  }
};

const adminGetAllTransactionByPrescription = async (req, res, next) => {
  try {
    let { page, pageSize } = req.query;

    page = +page;
    pageSize = +pageSize;

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

    const resFetchTransactions = await transactions.findAll({
      where: { totalPrice: null },
      attributes: [
        'transaction_id',
        'prescriptionImage',
        'user_id',
        'address_id',
        'status',
        'courier',
        'deliveryCost',
        'createdAt',
      ],
      limit: limit,
      offset: offset,
    });

    const resFetchTransactionsNext = await transactions.findAll({
      where: { totalPrice: null },
      attributes: ['transaction_id'],
      limit: limit,
      offset: page * pageSize,
    });

    res.send({
      status: 'Success',
      message: 'Fetch All Transaction by Prescription Success',
      data: {
        resFetchTransactions,
        resFetchTransactionsNext,
      },
    });
  } catch (error) {
    next(error);
  }
};

const userGetTransactionByPrescription = async (req, res, next) => {
  try {
    const { user_id } = req.user;

    const resFetchTransactions = await transactions.findAll({
      where: { user_id, totalPrice: null },
      attributes: ['prescriptionImage'],
    });

    res.send({
      status: 'Success',
      message: 'Fetch User Transaction by Prescription Success',
      data: {
        resFetchTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const resFetchTransactions = await transactions.findAll({
      where: { user_id },
      attributes: [
        'transaction_id',
        'user_id',
        'address_id',
        'totalPrice',
        'status',
        'courier',
        'deliveryCost',
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
    const resFetchAddress = await addresses.findAll({
      where: { address_id: resFetchTransactions[0].address_id },
      attributes: [
        `address_id`,
        `user_id`,
        `addressDetail`,
        `recipient`,
        `postalCode`,
        `province_id`,
        `province`,
        `city_id`,
        `city_name`,
        `isDefault`,
      ],
    });

    res.send({
      status: 'success',
      message: 'Fetch Transaction Success',
      data: {
        resFetchTransactions,
        resFetchAddress,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionsById = async (req, res, next) => {
  try {
    const { transaction_id } = req.params;
    const resFetchTransactions = await transactions.findOne({
      where: { transaction_id },
      attributes: [
        'transaction_id',
        'user_id',
        'address_id',
        'totalPrice',
        'status',
        'courier',
        'deliveryCost',
      ],
    });
    const resFetchAddress = await addresses.findAll({
      where: { address_id: resFetchTransactions.address_id },
      attributes: [
        `address_id`,
        `user_id`,
        `addressDetail`,
        `recipient`,
        `postalCode`,
        `province_id`,
        `province`,
        `city_id`,
        `city_name`,
        `isDefault`,
      ],
    });

    res.send({
      status: 'success',
      message: 'Fetch Transaction Success',
      data: {
        resFetchTransactions,
        resFetchAddress,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionDetails = async (req, res, next) => {
  try {
    const { transaction_id } = req.params;
    const resFetchTransactionDetails = await transaction_details.findAll({
      where: { transaction_id },
      include: [products],
    });

    res.send({
      status: 'success',
      message: 'Fetch details Success',
      data: {
        resFetchTransactionDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionsByIndex = async (req, res, next) => {
  try {
    const selected = parseInt(req.params.selected);
    const user_id = parseInt(req.params.user_id);
    let { page, pageSize } = req.query;

    page = +page;
    pageSize = +pageSize;

    const limit = pageSize;
    const offset = (page - 1) * pageSize;

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
        statusFind = 0;
        break;
    }

    if (!statusFind) {
      const resFetchTransactions = await transactions.findAll({
        where: { user_id, prescriptionImage: null },
        attributes: [
          'transaction_id',
          'user_id',
          'address_id',
          'totalPrice',
          'status',
        ],
        limit: limit,
        offset: offset,
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
        },
      });
      return;
    }

    const resFetchTransactions = await transactions.findAll({
      where: { user_id, status: statusFind, prescriptionImage: null },
      attributes: [
        'transaction_id',
        'user_id',
        'address_id',
        'totalPrice',
        'status',
      ],
      limit: limit,
      offset: offset,
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
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllTransactions = async (req, res, next) => {
  try {
    let { paramsStartDate, paramsEndDate } = req.query;

    let allTransaction;

    if (paramsStartDate && paramsEndDate) {
      allTransaction = await transactions.findAll({
        where: {
          status: 'order_confirmed',
          createdAt: { [Op.between]: [paramsStartDate, paramsEndDate] },
        },
        attributes: [
          'transaction_id',
          'user_id',
          'address_id',
          'totalPrice',
          'status',
          'courier',
          'deliveryCost',
          'createdAt',
          'updatedAt',
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
          {
            model: users,
          },
        ],
      });
    } else if (paramsStartDate) {
      paramsEndDate = new Date('July 21, 3000 01:15:00');
      allTransaction = await transactions.findAll({
        where: {
          status: 'order_confirmed',
          createdAt: { [Op.between]: [paramsStartDate, paramsEndDate] },
        },
        attributes: [
          'transaction_id',
          'user_id',
          'address_id',
          'totalPrice',
          'status',
          'courier',
          'deliveryCost',
          'createdAt',
          'updatedAt',
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
          {
            model: users,
          },
        ],
      });
    } else if (paramsEndDate) {
      paramsStartDate = new Date(1970);
      allTransaction = await transactions.findAll({
        where: {
          status: 'order_confirmed',
          createdAt: { [Op.between]: [paramsStartDate, paramsEndDate] },
        },
        attributes: [
          'transaction_id',
          'user_id',
          'address_id',
          'totalPrice',
          'status',
          'courier',
          'deliveryCost',
          'createdAt',
          'updatedAt',
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
          {
            model: users,
          },
        ],
      });
    } else {
      allTransaction = await transactions.findAll({
        where: { status: 'order_confirmed' },
        attributes: [
          'transaction_id',
          'user_id',
          'address_id',
          'totalPrice',
          'status',
          'courier',
          'deliveryCost',
          'createdAt',
          'updatedAt',
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
          {
            model: users,
          },
        ],
      });
    }

    res.send({
      status: 'Success',
      allTransaction,
    });
  } catch (error) {
    next(error);
  }
};

router.get(
  '/admin/transactionsByIndex/:selected',
  auth,
  adminGetTransactionsByIndex,
);
router.get(
  '/admin/transactionsByPrescription',
  adminGetAllTransactionByPrescription,
);
router.get('/userPrescription', auth, userGetTransactionByPrescription);
router.get('/:user_id', auth, getTransactions);
router.get('/transById/:transaction_id', auth, getTransactionsById);
router.get('/getDetails/:transaction_id', auth, getTransactionDetails);
router.get(
  '/getTransactionsByIndex/:user_id/:selected',
  auth,
  getTransactionsByIndex,
);
router.get('/all/products/', getAllTransactions);

module.exports = router;
