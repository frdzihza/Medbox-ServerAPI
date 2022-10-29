const express = require('express');
const router = express.Router();
const { addresses } = require('../../../models');
const { auth } = require('../../helpers/auth');

const getUserAddresses = async (req, res, next) => {
  try {
    const { user_id } = req.user;

    const resGetUserAddresses = await addresses.findAll({
      where: { user_id },
      order: [['isDefault', 'DESC']],
    });
    if (!resGetUserAddresses) throw { message: 'Address not found' };

    res.send({
      status: 'Success',
      message: 'Get All User Addresses Success',
      data: resGetUserAddresses,
    });
  } catch (error) {
    next(error);
  }
};

const getUserDefaultAddress = async (req, res, next) => {
  try {
    const { user_id } = req.user;

    const resGetUserAddresses = await addresses.findOne({
      where: { user_id, isDefault: true },
    });

    res.send({
      status: 'Success',
      message: 'Get User Default Address Success',
      data: resGetUserAddresses,
    });
  } catch (error) {
    next(error);
  }
};

router.get('/useraddresslists/', auth, getUserAddresses);
router.get('/userdefaultaddress/', auth, getUserDefaultAddress);

module.exports = router;
