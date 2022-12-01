const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    parentCategory: Joi.string().custom(objectId),
    subCategories: Joi.array().items(Joi.string().custom(objectId)),
  }),
  files: Joi.object().keys({
    images: Joi.array().required(),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    name: Joi.string(),
    price: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    parentCategory: Joi.string().custom(objectId).optional(),
    subCategories: Joi.array().items(Joi.string().custom(objectId)).optional(),
  }),
  files: Joi.object().keys({
    images: Joi.array(),
  }),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
