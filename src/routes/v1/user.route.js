const express = require('express');
const can = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/cart.validation');
const {
  homeController,
  orderController,
  productController,
  adController,
  generalController,
  rentController,
} = require('../../controllers');
const { productValidation, adValidation, generalValidation, rentValidation } = require('../../validations');

const router = express.Router();

router.route('/').get(homeController.getData);

router
  .route('/products')
  .get(can('manageProducts'), productController.getProducts)
  .post(can('manageProducts'), validate(productValidation.createProduct), productController.createProduct);

router
  .route('/product/:productId')
  .get(can('manageProducts'), productController.getProduct)
  .patch(can('manageProducts'), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(can('manageProducts'), validate(productValidation.deleteProduct), productController.deleteProduct);

router
  .route('/favs')
  .get(can('favs'), generalController.queryFavs)
  .post(can('favs'), validate(generalValidation.addFav), generalController.addFav)
  .delete(can('favs'), validate(generalValidation.delFav), generalController.delFav);

// router.route('/rent').post(can('getInRent'), validate(rentValidation.createRent), rentController.createRent);
//
// router
//   .route('/ads')
//   .get(can('manageAds'), adController.getAds)
//   .post(can('manageAds'), validate(adValidation.createAd), adController.createAd);

// router
//   .route('/ad/:adId')
//   .get(can('manageAds'), adController.getAd)
//   .patch(can('manageAds'), validate(adValidation.updateAd), adController.updateAd)
//   .delete(can('manageAds'), validate(adValidation.deleteAd), adController.deleteAd);

// router.route('/getRentInItems').get(can('getProducts'), rentController.getRentInItems);
// router.route('/getRentOutItems').get(can('getProducts'), rentController.getRentOutItems);

// router.route('/report').get(can('reportIssue'), validate(generalValidation.report), generalController.report);

// router.route('/blockUser').get(can('blockUser'), validate(generalValidation.blockUser), generalController.blockUser);
// router.route('/postSearch').get(can('search'), validate(generalValidation.postSearch), generalController.postSearch);

// router.route('order').post(can('createOrder'), validate(userValidation.createOrder), orderController.createOrder);

module.exports = router;
