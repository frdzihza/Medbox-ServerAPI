const multer = require('multer');
const path = require('path');
const appRoot = require('app-root-path');

const avatarPath = path.join(
  appRoot.path,
  'packages',
  'server',
  'public',
  'avatar',
);

const prescriptionImagePath = path.join(
  appRoot.path,
  'packages',
  'server',
  'public',
  'prescriptionImage',
);

const paymentPath = path.join(
  appRoot.path,
  'packages',
  'server',
  'public',
  'paymentProof',
);

const productImagePath = path.join(
  appRoot.path,
  'packages',
  'server',
  'public',
  'productImages',
);
const categoryImagePath = path.join(
  appRoot.path,
  'packages',
  'server',
  'public',
  'categoriesImage',
);

const storageAvatar = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarPath);
  },
  filename: function (req, file, cb) {
    const { user_id } = req.user;
    const splitExt = file.originalname.split('.');
    cb(null, `${user_id}-avatar.${splitExt[splitExt.length - 1]}`);
  },
});
const storageCategories = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, categoryImagePath);
  },
  filename: function (req, file, cb) {
    const { category_filename } = req.params;
    cb(null, `${category_filename}`);
    // cb(null, ".jpg");
  },
});

const productImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productImagePath);
  },
  filename: function (req, file, cb) {
    const { product_filename } = req.params;
    cb(null, `${product_filename}`);
  },
});

const storagePrescriptionImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, prescriptionImagePath);
  },
  filename: function (req, file, cb) {
    const { prescription_fileName } = req.params;
    cb(null, `${prescription_fileName}`);
  },
});

const storagePayment = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, paymentPath);
  },
  filename: function (req, file, cb) {
    const { transaction_id } = req.params;
    cb(null, `${transaction_id}-paymentProof.jpg`);
  },
});

const uploadAvatar = multer({
  storage: storageAvatar,
  limits: {
    fileSize: 1048576,
  },
  fileFilter(req, file, cb) {
    const allowedExtension = ['.jpg', '.jpeg', '.png', '.gif'];

    const extname = path.extname(file.originalname);

    if (!allowedExtension.includes(extname)) {
      const error = new Error(
        'Invalid file extension. You can only upload jpg, jpeg, png, or gif file.',
      );
      return cb(error);
    }

    cb(null, true);
  },
});

const uploadCategories = multer({
  storage: storageCategories,
  limits: {
    fileSize: 10485760,
  },
  fileFilter(req, file, cb) {
    const allowedExtension = ['.jpg', '.jpeg', '.png', '.gif'];

    const extname = path.extname(file.originalname);

    if (!allowedExtension.includes(extname)) {
      const error = new Error(
        'Invalid file extension. You can only upload jpg, jpeg, png, or gif file.',
      );
      return cb(error);
    }

    cb(null, true);
  },
});

const uploadProductImage = multer({
  storage: productImageStorage,
  limits: {
    fileSize: 10485760,
  },
  fileFilter(req, file, cb) {
    const allowedExtension = ['.jpg', '.jpeg', '.png', '.gif'];

    const extname = path.extname(file.originalname);

    if (!allowedExtension.includes(extname)) {
      const error = new Error(
        'Invalid file extension. You can only upload jpg, jpeg, png, or gif file',
      );
      return cb(error);
    }

    cb(null, true);
  },
});

const uploadPrescriptionImage = multer({
  storage: storagePrescriptionImage,
  limits: {
    fileSize: 1048576,
  },
  fileFilter(req, file, cb) {
    const allowedExtension = ['.jpg', '.png'];

    const extname = path.extname(file.originalname);

    if (!allowedExtension.includes(extname)) {
      const error = new Error(
        'Invalid file extension. You can only upload jpg or png file.',
      );
      return cb(error);
    }

    cb(null, true);
  },
});

const uploadPayment = multer({
  storage: storagePayment,
  limits: {
    fileSize: 1048576,
  },
  fileFilter(req, file, cb) {
    const allowedExtension = ['.jpg', '.jpeg', '.png', '.gif'];

    const extname = path.extname(file.originalname);

    if (!allowedExtension.includes(extname)) {
      const error = new Error(
        'Invalid file extension. You can only upload jpg, jpeg, png, or gif file',
      );
      return cb(error);
    }

    cb(null, true);
  },
});

module.exports = {
  uploadAvatar,
  uploadProductImage,
  uploadPrescriptionImage,
  uploadPayment,
  uploadCategories,
};
