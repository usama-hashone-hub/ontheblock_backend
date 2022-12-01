const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const Feedback = require('../../models/feedback.model');

const getFeedbacks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'price']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await Feedback.paginate(filter, options);
  res.send(result);
});

const getFeedback = catchAsync(async (req, res) => {
  const result = await Feedback.findById(req.params.paymentId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found');
  }
  res.send(result);
});
module.exports = { getFeedbacks, getFeedback };
