const httpStatus = require('http-status');
const { Task } = require('../models');
const ApiError = require('../utils/ApiError');

const createTask = async (body) => {
  return Task.create(body);
};

const queryTasks = async (filter, options) => {
  const properties = await Task.paginate(filter, options);
  return properties;
};

const getTaskById = async (id) => {
  return await Task.findById(id);
};

const updateTaskById = async (productId, updateBody) => {
  const Prod = await getTaskById(productId);
  if (!Prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  return Task.findByIdAndUpdate(productId, updateBody, { new: true })
    .populate('property')
    .populate('assign_to')
    .populate('added_by')
    .populate('inventory');
};

const deleteTaskById = async (productId) => {
  const Task = await getTaskById(productId);
  if (!Task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  await Task.remove();
  return Task;
};

module.exports = {
  createTask,
  queryTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
};
