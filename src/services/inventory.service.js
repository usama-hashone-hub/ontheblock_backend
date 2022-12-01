const httpStatus = require('http-status');
const { Inventory } = require('../models');
const ApiError = require('../utils/ApiError');

const createInventory = async (body) => {
  return Inventory.create(body);
};

const queryInventories = async (filter, options) => {
  const properties = await Inventory.paginate(filter, options);
  return properties;
};

const getInventoryById = async (id) => {
  return await Inventory.findById(id);
};

const updateInventoryById = async (productId, updateBody) => {
  const Prod = await getInventoryById(productId);
  if (!Prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found');
  }
  return Inventory.findByIdAndUpdate(productId, updateBody, { new: true });
};

const deleteInventoryById = async (productId) => {
  const Inventory = await getInventoryById(productId);
  if (!Inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found');
  }
  await Inventory.remove();
  return Inventory;
};

module.exports = {
  createInventory,
  queryInventories,
  getInventoryById,
  updateInventoryById,
  deleteInventoryById,
};
