const express = require('express');
const can = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const {
  userValidation,
  productValidation,
  paymentValidation,
  orderValidation,
  generalValidation,
  categoryValidation,
} = require('../../validations');
const {
  dashboardController,
  userController,
  productController,
  paymentController,
  orderController,
  feedbackController,
  categoryController,
} = require('../../controllers');
const { uploadImage } = require('../../utils/cloudinary');

const router = express.Router();

router.route('/').get(can('getDashboard'), dashboardController.getDashboard);

// User Mangement routes
router
  .route('/users')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(can('getUsers'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/user/:userId')
  .get(can('getUsers'), validate(userValidation.getUser), userController.getUser)
  .patch(can('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
  .delete(can('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

// Product Mangement routes
router
  .route('/products')
  // .post(can('manageProducts'), validate(productValidation.createProduct), productController.createProduct)
  .get(can('getProducts'), validate(productValidation.getProducts), productController.getProducts);

// router
//   .route('/product/:productId')
//   .get(can('getProducts'), validate(productValidation.getProduct), productController.getProduct)
//   .patch(can('manageProducts'), validate(productValidation.updateProduct), productController.updateProduct)
//   .delete(can('manageProducts'), validate(productValidation.deleteProduct), productController.deleteProduct);

router
  .route('/categories')
  .post(can('manageCategories'), uploadImage, validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(can('getCategories'), validate(categoryValidation.getCategories), categoryController.getCategories);

router
  .route('/category/:categoryId')
  .get(can('getCategories'), validate(categoryValidation.getCategory), categoryController.getCategory)
  .patch(
    can('manageCategories'),
    uploadImage,
    validate(categoryValidation.updateCategory),
    categoryController.updateCategory
  )
  .delete(can('manageCategories'), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

//Order routes
// router.route('/orders').get(can('getOrder'), validate(orderValidation.getOrders), orderController.getOrders);
// router.route('/order/:orderId').get(can('getOrder'), validate(orderValidation.getOrder), orderController.getOrder);

//Payment routes
// router.route('/payments').get(can('getPayment'), validate(paymentValidation.getPayments), paymentController.getPayments);
// router
//   .route('/payment/:paymentId')
//   .get(can('getPayment'), validate(paymentValidation.getPayment), paymentController.getPayment);

//Feedback routes
router
  .route('/feedbacks')
  .get(can('getFeedback'), validate(generalValidation.getFeedbacks), feedbackController.getFeedbacks);
router
  .route('/feedback/:feedbackId')
  .get(can('getFeedback'), validate(generalValidation.getFeedback), feedbackController.getFeedback);

module.exports = router;
