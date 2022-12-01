const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const roomSchema = mongoose.Schema(
  {
    users: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
      required: true,
    },
    connectedUsers: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User',
      required: true,
    },
    lastMessage: {
      type: mongoose.Schema.ObjectId,
      ref: 'Message',
      required: false,
    },
    chatName: {
      type: String,
      required: false,
    },
    primeUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

roomSchema.plugin(toJSON);
roomSchema.plugin(paginate);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
