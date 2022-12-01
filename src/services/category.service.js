const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

const createCategory = async (body) => {
  return Category.create(body);
};

const queryCategories = async (filter, options) => {
  const categories = await Category.paginate(filter, options);
  return categories;
};

const getCategoryById = async (id) => {
  return await Category.findById(id);
};

const updateCategoryById = async (categoryId, updateBody) => {
  const Prod = await getCategoryById(categoryId);
  if (!Prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return Category.findByIdAndUpdate(categoryId, updateBody, { new: true });
};

const deleteCategoryById = async (categoryId) => {
  const Category = await getCategoryById(categoryId);
  if (!Category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await Category.remove();
  return Category;
};

module.exports = {
  createCategory,
  queryCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
