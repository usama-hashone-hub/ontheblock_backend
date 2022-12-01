const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const moment = require('moment');

const messageSchema = mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.ObjectId,
      ref: 'Room',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    files: {
      type: [String],
    },
    at: {
      type: Date,
      default: moment().utc().format(),
    },
    type: {
      type: String,
      enum: ['file', 'text'],
      required: true,
    },
    to: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
      required: true,
    },
    from: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['readed', 'delevired'],
      default: 'delevired',
    },
    seenBy: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
