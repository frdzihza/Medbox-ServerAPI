const express = require('express');
const router = express.Router();
const { isFieldEmpties } = require('../../helpers/');
const { users } = require('../../../models');
const { auth } = require('../../helpers/auth');
const { uploadAvatar } = require('../../lib/multer');
const { hash, compare } = require('../../lib/bcryptjs');

const changePassword = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { oldPassword, password } = req.body;

    const resFindUser = await users.findOne({
      where: { user_id },
    });

    if (resFindUser) {
      const user = resFindUser.dataValues;
      const isPasswordMatch = compare(oldPassword, user.password);
      if (isPasswordMatch) {
        const encryptedPassword = hash(password);
        const resUpdatePassword = await users.update(
          {
            password: encryptedPassword,
          },
          {
            where: { user_id },
          },
        );
        res.send({
          status: 'success',
          message: 'password updated',
          result: resUpdatePassword,
        });
      } else {
        throw {
          code: 406,
          message: 'incorrect password',
          errorType: 'Incorrect password',
        };
      }
    }
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { name, email, gender, birthDate } = req.body;

    const emptyFields = isFieldEmpties({
      email,
    });

    if (emptyFields.length) {
      throw {
        code: 400,
        message: 'Email cannot be empty',
        data: { result: emptyFields },
      };
    }

    const resGetEmail = await users.findOne({
      where: { email },
    });

    if (resGetEmail && resGetEmail.dataValues.user_id != user_id)
      throw { code: 401, message: 'Email is already used' };

    const resUpdateUser = await users.update(
      {
        name,
        email,
        gender,
        birthDate,
      },
      {
        where: { user_id },
      },
    );

    if (resUpdateUser.affectedRows) throw { message: 'Failed to update user' };

    res.send({
      status: 'Success',
      message: 'Update Profile Success',
    });
  } catch (error) {
    next(error);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { filename } = req.file;
    const finalFileName = `/public/avatar/${filename}`;

    const resUpdateAvatar = await users.update(
      {
        avatar: finalFileName,
      },
      {
        where: {
          user_id,
        },
      },
    );

    if (resUpdateAvatar.affectedRows)
      throw { message: 'Failed to update avatar' };

    res.send({
      status: 'Success',
      message: 'Update Avatar Success',
    });
  } catch (error) {
    next(error);
  }
};

router.patch('/changepassword', auth, changePassword);
router.patch('/profile', auth, updateUserProfile);
router.patch('/avatar', auth, uploadAvatar.single('avatar'), updateUserAvatar);

module.exports = router;
