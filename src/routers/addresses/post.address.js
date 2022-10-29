const express = require('express');
const router = express.Router();
const { isFieldEmpties } = require('../../helpers');
const { addresses } = require('../../../models');
const { auth } = require('../../helpers/auth');

const addAddress = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const {
      recipient,
      province_id,
      province,
      city_id,
      city_name,
      addressDetail,
      postalCode,
    } = req.body;

    const emptyFields = isFieldEmpties({
      recipient,
      province_id,
      province,
      city_id,
      city_name,
      addressDetail,
      postalCode,
    });

    if (emptyFields.length) {
      throw {
        code: 400,
        message: `${emptyFields} cannot be empty`,
        data: { result: emptyFields },
      };
    }

    let address = {
      user_id,
      recipient,
      province_id,
      province,
      city_id,
      city_name,
      addressDetail,
      postalCode,
    };

    const getAddress = await addresses.findAll({
      where: {
        user_id,
      },
      raw: true,
    });

    let isDefault = true;
    if (getAddress.length > 0) {
      isDefault = false;
    }

    address['isDefault'] = isDefault;

    const resUpdateUser = await addresses.create(address);

    if (resUpdateUser.affectedRows)
      throw { message: 'Failed to create address' };

    res.send({
      status: 'Success',
      message: 'Create Address Success',
    });
  } catch (error) {
    next(error);
  }
};

router.post('/add', auth, addAddress);

module.exports = router;
