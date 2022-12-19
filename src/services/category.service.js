const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

const createCategory = async (body) => {
  let cat = await Category.create(body);

  if (body.parentCategory) {
    await updateCategoryById(body.parentCategory, { $push: { subCategories: cat._id } });
  }

  return cat;
};

const queryCategories = async (filter, options) => {
  options['populate'] = [
    {
      path: 'subCategories',
      model: 'Category',
      populate: {
        path: 'subCategories',
        model: 'Category',
      },
    },
  ];

  const categories = await Category.paginate({ ...filter, ...{ parentCategory: { $exists: false } } }, options);
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
