const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    condition: Joi.string().required(),
    ratesPerDay: Joi.number().required(),
    ratesPerWeek: Joi.number().required(),
    ratesPerMonth: Joi.number().optional(),
    ratesPerYear: Joi.number().optional(),
    hasDelivery: Joi.boolean().required(),
    deliveryKM: Joi.number().required(),
    isInsured: Joi.boolean().required(),
    requiredAssembly: Joi.boolean().required(),
    isFeatured: Joi.boolean().optional(),
    categories: Joi.array().required(),
    loc: Joi.object().required(),
  }),
  files: Joi.object().keys({
    images: Joi.array().required(),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    title: Joi.string(),
    price: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    condition: Joi.string(),
    ratesPerDay: Joi.number(),
    ratesPerWeek: Joi.number(),
    ratesPerMonth: Joi.number().optional(),
    ratesPerYear: Joi.number().optional(),
    hasDelivery: Joi.boolean(),
    deliveryKM: Joi.number(),
    isInsured: Joi.boolean(),
    requiredAssembly: Joi.boolean(),
    isFeatured: Joi.boolean().optional(),
    categories: Joi.array(),
    loc: Joi.object(),
  }),
  files: Joi.object().keys({
    images: Joi.array(),
  }),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
