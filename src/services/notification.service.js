const httpStatus = require('http-status');
const { Notification } = require('../models');
const ApiError = require('../utils/ApiError');

const createNotification = async (body) => {
  return Notification.create(body);
};

const queryNotifications = async (filter, options) => {
  const notifs = await Notification.paginate(filter, options);
  return notifs;
};

const getNotificationById = async (id) => {
  return await Notification.findById(id);
};

const updateNotificationById = async (productId, updateBody) => {
  const Prod = await getNotificationById(productId);
  if (!Prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  return Notification.findByIdAndUpdate(productId, updateBody, { new: true });
};

const deleteNotificationById = async (productId) => {
  const Notification = await getNotificationById(productId);
  if (!Notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  await Notification.remove();
  return Notification;
};

module.exports = {
  createNotification,
  queryNotifications,
  getNotificationById,
  updateNotificationById,
  deleteNotificationById,
};
