const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const propertyTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    is_default: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

propertyTypeSchema.plugin(toJSON);
propertyTypeSchema.plugin(paginate);

const PropertyType = mongoose.model('PropertyType', propertyTypeSchema);

module.exports = PropertyType;
