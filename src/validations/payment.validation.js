const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getPayments = {
  query: Joi.object().keys({
    user: Joi.string().custom(objectId),
    totalAmount: Joi.number(),
    sortBy: Joi.string(),
    status: Joi.string(),
    orderNo: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  getPayment,
  getPayments,
};
