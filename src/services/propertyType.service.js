const httpStatus = require('http-status');
const { PropertyType } = require('../models');
const ApiError = require('../utils/ApiError');

const createPropertyType = async (body) => {
  return PropertyType.create(body);
};

const queryPropertyTypes = async (filter, options) => {
  const types = await PropertyType.paginate(filter, options);
  return types;
};

const getPropertyTypeById = async (id) => {
  return await PropertyType.findById(id);
};

const updatePropertyTypeById = async (categoryId, updateBody) => {
  const Prod = await getPropertyTypeById(categoryId);
  if (!Prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PropertyType not found');
  }
  return PropertyType.findByIdAndUpdate(categoryId, updateBody, { new: true });
};

const deletePropertyTypeById = async (categoryId) => {
  const PropertyType = await getPropertyTypeById(categoryId);
  if (!PropertyType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PropertyType not found');
  }
  await PropertyType.remove();
  return PropertyType;
};

module.exports = {
  createPropertyType,
  queryPropertyTypes,
  getPropertyTypeById,
  updatePropertyTypeById,
  deletePropertyTypeById,
};
