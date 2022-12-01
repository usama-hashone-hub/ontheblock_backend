const httpStatus = require('http-status');
const { Handyman } = require('../models');
const ApiError = require('../utils/ApiError');

const createHandyman = async (body) => {
  return Handyman.create(body);
};

const queryHandymen = async (filter, options) => {
  const properties = await Handyman.paginate(filter, options);
  return properties;
};

const getHandymanById = async (id) => {
  return await Handyman.findById(id);
};

const updateHandymanById = async (productId, updateBody) => {
  const Prod = await getHandymanById(productId);
  if (!Prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Handyman not found');
  }
  return Handyman.findByIdAndUpdate(productId, updateBody, { new: true });
};

const deleteHandymanById = async (productId) => {
  const Handyman = await getHandymanById(productId);
  if (!Handyman) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Handyman not found');
  }
  await Handyman.remove();
  return Handyman;
};

module.exports = {
  createHandyman,
  queryHandymen,
  getHandymanById,
  updateHandymanById,
  deleteHandymanById,
};
