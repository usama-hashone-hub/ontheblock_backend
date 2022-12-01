const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const addToCart = {
  body: Joi.object().keys({
    campaign: Joi.string().required().custom(objectId),
    quantity: Joi.number().required(),
    price: Joi.number().required(),
  }),
};

const updateItemQuantity = {
  body: Joi.object().keys({
    cartId: Joi.string().required().custom(objectId),
    campaign: Joi.string().required().custom(objectId),
    quantity: Joi.number().required(),
  }),
};

const deleteFromCart = {
  body: Joi.object().keys({
    cartId: Joi.string().required().custom(objectId),
  }),
};

const createOrder = {
  body: Joi.object().keys({
    cartId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  addToCart,
  updateItemQuantity,
  deleteFromCart,
  createOrder,
};
