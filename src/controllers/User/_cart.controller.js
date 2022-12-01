const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { cartService } = require('../../services');

const getCart = catchAsync(async (req, res) => {
  const user = await cartService.addToCart(req.user);
  res.status(httpStatus.CREATED).send({ cart: user.cart });
});

const addToCart = catchAsync(async (req, res) => {
  const user = await cartService.addToCart(req.user, req.body);
  res.status(httpStatus.CREATED).send({ cart: user.cart });
});

const updateItemQuantity = catchAsync(async (req, res) => {
  const user = await cartService.updateItemQuantity(req.user, req.body);
  res.status(httpStatus.CREATED).send({ cart: user.cart });
});

const deleteFromCart = catchAsync(async (req, res) => {
  const user = await cartService.deleteFromCart(req.user, req.query.cartId);
  res.status(httpStatus.CREATED).send({ cart: user.cart });
});

module.exports = {
  getCart,
  addToCart,
  updateItemQuantity,
  deleteFromCart,
};
