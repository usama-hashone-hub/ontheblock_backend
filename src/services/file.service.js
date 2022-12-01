const httpStatus = require('http-status');
const { File } = require('../models');
const ApiError = require('../utils/ApiError');

const createFile = async (body) => {
  return File.create(body);
};

const queryFiles = async (filter, options) => {
  const properties = await File.paginate(filter, options);
  return properties;
};

const getFileById = async (id) => {
  return await File.findById(id);
};

const updateFileById = async (productId, updateBody) => {
  const Prod = await getFileById(productId);
  if (!Prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  return File.findByIdAndUpdate(productId, updateBody, { new: true });
};

const deleteFileById = async (productId) => {
  const File = await getFileById(productId);
  if (!File) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  await File.remove();
  return File;
};

module.exports = {
  createFile,
  queryFiles,
  getFileById,
  updateFileById,
  deleteFileById,
};
