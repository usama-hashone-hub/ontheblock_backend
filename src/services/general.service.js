const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');
const { userService } = require('.');
const Report = require('../models/report.model');

const addFav = async (user, product) => {
  let isFav = user.favCampaigns.includes(product);
  if (isFav) {
    throw new ApiError(httpStatus.OK, 'already fav.');
  }
  return userService.updateUserById(user.id, { $push: { favProducts: product } });
};

const delFav = async (user, product) => {
  return userService.updateUserById(user.id, { $pull: { favProducts: product } });
};

const queryFavs = async (user) => {
  return User.findById(user.id).populate('favProducts');
};

const createReport = async (report) => {
  return Report.create(report);
};

const blockUser = async (user, userId) => {
  return userService.updateUserById(user.id, { $push: { blockUser: userId } }, { new: true });
};

module.exports = { addFav, delFav, queryFavs, createReport, blockUser };
