const { required } = require('joi');
const mongoose = require('mongoose');
const validator = require('validator');

const fileSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    s3key: {
      type: String,
      default: 'null',
      required: true,
    },
    path: {
      type: String,
      default: 'null',
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const File = mongoose.model('File', fileSchema);

module.exports = File;
