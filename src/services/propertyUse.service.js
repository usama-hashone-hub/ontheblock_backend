const httpStatus = require('http-status');
const { PropertyUse } = require('../models');
const ApiError = require('../utils/ApiError');

const createPropertyUse = async (body) => {
  return PropertyUse.create(body);
};

const queryPropertyUses = async (filter, options) => {
  const types = await PropertyUse.paginate(filter, options);
  return types;
};

const getPropertyUseById = async (id) => {
  return await PropertyUse.findById(id);
};

const updatePropertyUseById = async (categoryId, updateBody) => {
  const Prod = await getPropertyUseById(categoryId);
  if (!Prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PropertyUse not found');
  }
  return PropertyUse.findByIdAndUpdate(categoryId, updateBody, { new: true });
};

const deletePropertyUseById = async (categoryId) => {
  const PropertyUse = await getPropertyUseById(categoryId);
  if (!PropertyUse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'PropertyUse not found');
  }
  await PropertyUse.remove();
  return PropertyUse;
};

module.exports = {
  createPropertyUse,
  queryPropertyUses,
  getPropertyUseById,
  updatePropertyUseById,
  deletePropertyUseById,
};
