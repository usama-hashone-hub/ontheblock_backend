const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const propertyUseSchema = mongoose.Schema(
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

propertyUseSchema.plugin(toJSON);
propertyUseSchema.plugin(paginate);

const PropertyUse = mongoose.model('PropertyUse', propertyUseSchema);

module.exports = PropertyUse;
