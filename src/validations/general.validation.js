const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getFeedbacks = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    name: Joi.string(),
    email: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getFeedback = {
  params: Joi.object().keys({
    blockUser: Joi.string().custom(objectId).required(),
  }),
};

const blockUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

const addFav = {
  query: Joi.object().keys({
    campaign: Joi.string().custom(objectId).required(),
  }),
};
const delFav = {
  query: Joi.object().keys({
    campaign: Joi.string().custom(objectId).required(),
  }),
};

const postSearch = {
  query: Joi.object().keys({
    text: Joi.string().required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const report = {
  body: Joi.object().keys({
    reportedTo: Joi.string().custom(objectId).required(),
    reportedBy: Joi.string().custom(objectId).required(),
    product: Joi.string().custom(objectId).required(),
    rent: Joi.string().custom(objectId).required(),
    description: Joi.string().custom(objectId).required(),
    issues: Joi.string().custom(objectId).required(),
  }),
};
module.exports = {
  getFeedback,
  getFeedbacks,
  addFav,
  delFav,
  report,
  postSearch,
  blockUser,
};
