const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { paymentService } = require('../../services');

const getPayments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user', 'totalAmount', 'status', 'orderNo']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await paymentService.queryPayments(filter, options);
  res.send(result);
});

const getPayment = catchAsync(async (req, res) => {
  const product = await paymentService.getPaymentById(req.params.paymentId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  res.send(product);
});

module.exports = { getPayments, getPayment };
