const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { rentService, productService, paymentService } = require('../../services');
const { getPath } = require('../../utils/cloudinary');
const config = require('../../config/config');
const moment = require('moment');

const createRent = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.product);
  const obj = req.body;

  const days = moment(req.body.startDate).diff(req.body.endDate, 'days');
  const weeks = moment(req.body.startDate).diff(req.body.endDate, 'weeks');

  //updated according to the client reqs
  let totalAmount = product.ratesPerDay * days;
  let tax = (config.tax / totalAmount) * 100;
  let deposit = (product.deposit / totalAmount) * 100;
  let delivery = (config.delivery / totalAmount) * 100;

  obj = { ...obj, totalAmount, tax, deposit, delivery };

  const payment = await paymentService.createPayment(obj);

  obj = { ...obj, payment: payment._id };

  const rent = await rentService.createRent(req.body);

  const updatedProduct = await productService.updateProductById(rent.product, { status: 'rentOut', lastRentOut: rent._id });

  res.status(httpStatus.CREATED).send(rent);
});

const getRents = catchAsync(async (req, res) => {
  let pickObj = pick(req.query, ['name', 'price']);

  if (req.user.role != 'admin') {
    pickObj = { ...pick, user: req.user._id };
  }

  const filter = pickObj;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await rentService.queryRents(filter, options);
  res.send(result);
});

const getRentInItems = catchAsync(async (req, res) => {
  const filter = { rentInBy: req.user._id };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await rentService.queryRents(filter, options);
  res.send(result);
});

const getRentOutItems = catchAsync(async (req, res) => {
  const filter = { rentOutBy: req.user._id };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await rentService.queryRents(filter, options);
  res.send(result);
});

const getRent = catchAsync(async (req, res) => {
  const product = await rentService.getRentById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Rent not found');
  }
  res.send(product);
});

const updateRent = catchAsync(async (req, res) => {
  let product = await rentService.getRentById(req.params.productId);
  let images = product.images;

  if (req.body?.deleteImages) {
    images = images.filter((image) => !req.body.deleteImages.includes(image));
  }

  if (req.files?.images) {
    let i = await getPath(req.files?.images);
    i.map((image) => images.push(image));
  }

  req.body.images = images;
  product = await rentService.updateRentById(req.params.productId, req.body);
  res.send(product);
});

const deleteRent = catchAsync(async (req, res) => {
  await rentService.deleteRentById(req.params.productId);
  res.status(httpStatus.OK).send({
    status: 200,
  });
});

module.exports = { createRent, getRents, getRent, updateRent, deleteRent, getRentInItems, getRentOutItems };
