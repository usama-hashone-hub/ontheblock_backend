const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    username: Joi.string().required(),
    role: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const verifyForgotPasswordCode = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.number().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const verifyCodeEmail = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const verifyCode = {
  body: Joi.object().keys({
    code: Joi.number().required(),
    email: Joi.string().required().email(),
  }),
};

const validatePhone = {
  body: Joi.object().keys({
    phone: Joi.string().required(),
    email: Joi.string().required(),
  }),
};

const verifyPhone = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    code: Joi.number().required(),
  }),
};

const updateProfileAttributes = {
  body: Joi.object().keys({
    name: Joi.string(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyCode,
  validatePhone,
  verifyPhone,
  verifyCodeEmail,
  verifyForgotPasswordCode,
  updateProfileAttributes,
};
