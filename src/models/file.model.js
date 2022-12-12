const { required } = require('joi');
const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

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

fileSchema.plugin(toJSON);
fileSchema.plugin(paginate);

const File = mongoose.model('File', fileSchema);

module.exports = File;
