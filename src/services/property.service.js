const httpStatus = require('http-status');
const { Property } = require('../models');
const ApiError = require('../utils/ApiError');

const createProperty = async (body) => {
  return Property.create(body);
};

const queryProperties = async (filter, options) => {
  const properties = await Property.paginate(filter, options);
  return properties;
};

const getPropertyById = async (id) => {
  return await Property.findById(id);
};

const updatePropertyById = async (productId, updateBody) => {
  const Prod = await getPropertyById(productId);
  if (!Prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Property not found');
  }
  return Property.findByIdAndUpdate(productId, updateBody, { new: true });
};

const deletePropertyById = async (productId) => {
  const Property = await getPropertyById(productId);
  if (!Property) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Property not found');
  }
  await Property.remove();
  return Property;
};

module.exports = {
  createProperty,
  queryProperties,
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
};
