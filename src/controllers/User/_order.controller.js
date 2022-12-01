const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { orderService } = require('../../services');

const createOrder = catchAsync(async (req, res) => {
  if (req.user.cart.length <= 0) {
    throw new ApiError('Cart is empty');
  }
  const user = await orderService.createOrder(req.user);
  res.status(httpStatus.CREATED).send({ cart: user.cart });
});

const getOrders = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'price']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await orderService.queryOrders(filter, options);
  res.send(result);
});

const getOrder = catchAsync(async (req, res) => {
  const product = await orderService.getOrderById(req.params.orderId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  res.send(product);
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
};
