const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { userService } = require('../../services');

const getDashboard = catchAsync(async (req, res) => {
  res.send({ data: {} });
});

module.exports = { getDashboard };
