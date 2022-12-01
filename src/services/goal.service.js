const httpStatus = require('http-status');
const { Goal } = require('../models');
const ApiError = require('../utils/ApiError');

const createGoal = async (body) => {
  return Goal.create(body);
};

const queryGoals = async (filter, options) => {
  const goals = await Goal.paginate(filter, options);
  return goals;
};

const getGoalById = async (id) => {
  return await Goal.findById(id);
};

const updateGoalById = async (categoryId, updateBody) => {
  const Prod = await getGoalById(categoryId);
  if (!Prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Goal not found');
  }
  return Goal.findByIdAndUpdate(categoryId, updateBody, { new: true });
};

const deleteGoalById = async (categoryId) => {
  const Goal = await getGoalById(categoryId);
  if (!Goal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Goal not found');
  }
  await Goal.remove();
  return Goal;
};

module.exports = {
  createGoal,
  queryGoals,
  getGoalById,
  updateGoalById,
  deleteGoalById,
};
