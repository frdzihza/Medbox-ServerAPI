require('../../../config/config.js');
const express = require('express');
const router = express.Router();
const { isFieldEmpties } = require('../../helpers');
const { hash, compare } = require('../../lib/bcryptjs');
const { createToken, verifyToken } = require('../../lib/token');
const { users } = require('../../../models');
const { sendMail, sendResetPasswordMail } = require('../../lib/nodemailer');
const { Op } = require('sequelize');
const { NUMBER } = require('sequelize');

const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const emptyFields = isFieldEmpties({
      name,
      email,
      password,
      phoneNumber,
    });
    if (emptyFields.length) {
      throw {
        code: 400,
        message: `Please enter correctly your :  ${emptyFields}`,
        data: { result: emptyFields },
      };
    }

    const checkUser = await users.findOne({ where: { email } });
    if (checkUser) {
      if (checkUser.email == email) {
        throw {
          code: 400,
          message: 'Email already exist',
        };
      }
    }

    const checkedUser = await users.findOne({ where: { phoneNumber } });
    if (checkedUser) {
      if (checkedUser.phoneNumber == phoneNumber) {
        throw {
          code: 400,
          message: 'Phone Number already exist',
        };
      }
    }

    // hash password
    const encryptedPassword = hash(password);

    // create user
    const newUser = await users.create({
      name: name,
      email: email,
      avatar: '/public/avatar/default-profile-icon.jpg',
      password: encryptedPassword,
      phoneNumber: `${phoneNumber}`,
    });

    const userId = newUser.dataValues.user_id;

    const token = createToken({ user_id: newUser.dataValues.user_id });

    await users.update({ user_token: token }, { where: { user_id: userId } });

    await sendMail({ email, token });

    res.send({
      status: 'success',
      message: 'succsess create user and send verification',
      data: {
        result: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

async function sendResetPasswordMailController(req, res, next) {
  try {
    const { email } = req.body;

    const token = createToken({ email });

    sendResetPasswordMail({ email, token });

    res.send({
      status: 'success',
      token,
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token } = req.params;
    const verifiedToken = verifyToken(token);

    const { email } = verifiedToken;

    const hashedPassword = hash(req.body.newPassword);

    const user = await users.findOne({ where: { email } });

    await user.update({ password: hashedPassword });

    const resUpdatePassword = await user.save();

    res.send({
      status: 'success',
      detail: resUpdatePassword,
    });
  } catch (error) {
    next(error);
  }
}

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const resFindUser = await users.findOne({
      where: { email },
    });

    if (resFindUser) {
      const user = resFindUser.dataValues;

      const isPasswordMatch = compare(password, user.password);
      if (!isPasswordMatch) {
        throw {
          code: 401,
          message: `Password or email is incorrect`,
        };
      }

      const token = createToken({
        user_id: user.user_id,
        name: user.name,
      });

      res.send({
        status: 'success',
        message: 'login success',
        data: {
          result: {
            user,
            user_token: token,
          },
        },
      });
    } else {
      throw {
        code: 405,
        message: 'incorrect email or password',
        errorType: 'Incorrect Login',
      };
    }
  } catch (error) {
    next(error);
  }
};

const resendEmailVerification = async (req, res, next) => {
  try {
    const { email, user_id } = req.body;

    const token = createToken({ user_id });

    const updateToken = await users.update(
      { user_token: token },
      { where: { user_id } },
    );

    await sendMail({ email, token });

    res.send({
      status: 'success',
      message: 'Success Resend Email Verification',
      data: {
        result: updateToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

router.post('/sendResetPasswordMail', sendResetPasswordMailController);
router.post('/resetPassword/:token', resetPassword);
router.post('/resendVerif', resendEmailVerification);
router.post('/register', registerUserController);
router.post('/login', loginUser);

module.exports = router;
