const express = require('express');
const router = express.Router();
const { uploadProductImage } = require('../../lib/multer');
const { auth } = require('../../helpers/auth');
const { QueryTypes } = require('sequelize');
const {
  products,
  sequelize,
  categories,
  categories_list,
  product_details,
  stock_opnames,
} = require('../../../models');

async function postNewProductController(req, res, next) {
  try {
    const {
      categoryInfo,
      description,
      packageType,
      productImage,
      productName,
      productPrice,
      productStock,
      defaultQuantity,
      servingType,
    } = req.body;

    const imageExtNameSplit = productImage.split('.');
    const categorySplit = categoryInfo.split('=-=');

    const resCreateProduct = await products.create({
      productName,
      productPrice: parseInt(productPrice),
      description,
      productStock: parseInt(productStock),
      defaultQuantity,
      servingType,
      isPublic: false,
      packageType,
    });

    await resCreateProduct.update({
      productImage: `/public/productImages/${
        resCreateProduct.dataValues.product_id
      }.${imageExtNameSplit[imageExtNameSplit.length - 1]}`,
    });

    const resCreateCategory = await categories.create({
      category_lists_id: categorySplit[0],
      product_id: resCreateProduct.dataValues.product_id,
      categoryName: categorySplit[1],
    });

    setTimeout(() => {
      res.send({
        status: 'success',
        resCreateProduct,
        resCreateCategory,
      });
    }, 2000);
  } catch (error) {
    next(error);
  }
}

async function postNewProductImageController(req, res, next) {
  try {
    res.send({
      status: 'success',
      imageName: req.params.product_filename,
    });
  } catch (error) {
    next(error);
  }
}

const postNewConvertedProduct = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { productName, formula, amount } = req.body;
    const checkProduct = await products.findOne({
      where: { productName },
    });

    if (checkProduct)
      throw {
        code: 400,
        message: 'Product Name exists',
      };

    let price = 0;

    const getInitialStock = await Promise.all(
      formula.map(async (data) => {
        const resProduct = await products.findOne({
          where: { productName: data.productName },
        });

        const kuantitas = data.quantity * amount;

        price +=
          (resProduct.productPrice / resProduct.defaultQuantity) *
          data.quantity;

        const resDetail = await product_details.findOne({
          where: { product_id: resProduct.product_id },
        });

        if (!resDetail) {
          const newDetail = await product_details.create(
            {
              product_id: resProduct.product_id,
              current_quantity: resProduct.defaultQuantity,
              default_quantity: resProduct.defaultQuantity,
            },
            { transaction: t },
          );

          await resProduct.update(
            {
              productStock: resProduct.productStock - 1,
            },
            { transaction: t },
          );

          if (
            kuantitas > newDetail.current_quantity ||
            kuantitas == newDetail.current_quantity
          ) {
            const sisa = kuantitas % newDetail.default_quantity;
            const buka = Math.floor(kuantitas / newDetail.default_quantity);
            const newQuantity = newDetail.default_quantity - sisa;

            if (sisa == 0) {
              const defaultUpdate = await newDetail.update(
                {
                  current_quantity: resProduct.defaultQuantity,
                },
                { transaction: t },
              );
            } else {
              const updateQuantity = await newDetail.update(
                {
                  current_quantity: newQuantity,
                },
                { transaction: t },
              );
            }

            const newStock = resProduct.productStock - buka;

            if (newStock < 0) {
              throw Error('Produk tidak mencukupi');
            }

            const updateStock = await resProduct.update(
              {
                productStock: newStock,
              },
              { transaction: t },
            );
            const createStockOpname = await stock_opnames.create(
              {
                stock: buka,
                product_id: resProduct.product_id,
                activity: 'unit_conversion',
              },
              {
                transaction: t,
              },
            );
          } else if (kuantitas < newDetail.current_quantity) {
            const newQuantity = newDetail.current_quantity - kuantitas;
            const updateQuantity = await newDetail.update(
              {
                current_quantity: newQuantity,
              },
              { transaction: t },
            );
          }
          return newDetail;
        } else {
          if (
            kuantitas > resDetail.current_quantity ||
            kuantitas == resDetail.current_quantity
          ) {
            const sisaKurangCurrent = kuantitas - resDetail.current_quantity;
            const sisa = sisaKurangCurrent % resDetail.default_quantity;
            const buka = Math.floor(kuantitas / resDetail.default_quantity);
            const newQuantity = resDetail.default_quantity - sisa;
            if (sisa == 0) {
              const updateQuantity = await resDetail.update(
                {
                  current_quantity: resDetail.default_quantity,
                },
                { transaction: t },
              );
            } else {
              const updateQuantity = await resDetail.update(
                {
                  current_quantity: newQuantity,
                },
                { transaction: t },
              );
            }

            const newStock = resProduct.productStock - buka;

            if (newStock < 0) {
              throw Error('Produk tidak mencukupi');
            }

            const updateStock = await resProduct.update(
              {
                productStock: newStock,
              },
              { transaction: t },
            );
            const createStockOpname = await stock_opnames.create(
              {
                stock: buka,
                product_id: resProduct.product_id,
                activity: 'unit_conversion',
              },
              {
                transaction: t,
              },
            );
          } else if (kuantitas < resDetail.current_quantity) {
            const newQuantity = resDetail.current_quantity - kuantitas;
            const updateQuantity = await resDetail.update(
              {
                current_quantity: newQuantity,
              },
              { transaction: t },
            );
          }
          return data, resDetail;
        }
      }),
    );

    const newConcoction = await products.create({
      productName: productName,
      formula: formula,
      productStock: amount,
      defaultQuantity: 1,
      isPublic: 0,
      packageType: 'concoction',
      servingType: 'concoction',
      description: 'this is a concoction',
      productImage: '/public/productImages/default-concoction.png',
      productPrice: price * amount,
    });

    await t.commit();

    res.send({
      status: 'success',
      message: 'new concoction created',
      data: {
        newConcoction,
      },
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

router.post('/newProduct', postNewProductController);
router.post(
  '/newProductImage/:product_filename',
  uploadProductImage.single('productImageFile'),
  postNewProductImageController,
);
router.post('/concoction', postNewConvertedProduct);

module.exports = router;
