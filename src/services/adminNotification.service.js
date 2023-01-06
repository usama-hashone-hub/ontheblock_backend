const httpStatus = require('http-status');
const { AdminNotification } = require('../models');
const ApiError = require('../utils/ApiError');

const createAdminNotification = async (body) => {
  return AdminNotification.create(body);
};

const queryAdminNotifications = async (filter, options) => {
  const notifs = await AdminNotification.paginate(filter, options);
  return notifs;
};

const getAdminNotificationById = async (id) => {
  return await AdminNotification.findById(id);
};

const updateAdminNotificationById = async (productId, updateBody) => {
  const Prod = await getAdminNotificationById(productId);
  if (!Prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AdminNotification not found');
  }
  return AdminNotification.findByIdAndUpdate(productId, updateBody, { new: true });
};

const deleteAdminNotificationById = async (productId) => {
  const AdminNotification = await getAdminNotificationById(productId);
  if (!AdminNotification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AdminNotification not found');
  }
  await AdminNotification.remove();
  return AdminNotification;
};

module.exports = {
  createAdminNotification,
  queryAdminNotifications,
  getAdminNotificationById,
  updateAdminNotificationById,
  deleteAdminNotificationById,
};
