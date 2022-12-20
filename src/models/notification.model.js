const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const notificationSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    notification: {
      type: String,
      required: true,
    },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: 'Property',
    },
    task: {
      type: mongoose.Schema.ObjectId,
      ref: 'Task',
    },
    image: {
      type: String,
    },
    type: {
      type: String,
      enum: ['reminder', 'sale'],
      required: true,
    },
    to: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
