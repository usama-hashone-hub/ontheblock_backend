const httpStatus = require('http-status');
const { Folder } = require('../models');
const ApiError = require('../utils/ApiError');

const createFolder = async (body) => {
  return Folder.create(body);
};

const queryFolders = async (filter, options) => {
  const properties = await Folder.paginate(filter, options);
  return properties;
};

const getFolderById = async (id) => {
  return await Folder.findById(id);
};

const updateFolderById = async (productId, updateBody) => {
  const Prod = await getFolderById(productId);
  if (!Prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Folder not found');
  }
  return Folder.findByIdAndUpdate(productId, updateBody, { new: true });
};

const deleteFolderById = async (productId) => {
  const Folder = await getFolderById(productId);
  if (!Folder) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Folder not found');
  }
  await Folder.remove();
  return Folder;
};

module.exports = {
  createFolder,
  queryFolders,
  getFolderById,
  updateFolderById,
  deleteFolderById,
};
