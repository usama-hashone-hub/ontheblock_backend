const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const propertySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: mongoose.Schema.ObjectId,
      ref: 'PropertyType',
      required: [true, 'Property type is required'],
    },
    use: {
      type: mongoose.Schema.ObjectId,
      ref: 'PropertyUse',
    },
    added_by: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    owned_years: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    zip_code: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    // loc: {
    //   type: {
    //     type: String,
    //     default: 'Point',
    //     enum: ['Point'],
    //   },
    //   coordinates: [Number],
    // },
  },
  {
    timestamps: true,
  }
);

propertySchema.plugin(toJSON);
propertySchema.plugin(paginate);

// propertySchema.index({ loc: '2dsphere' });

propertySchema.pre('find', function (next) {
  this.populate('type');
  this.populate('added_by');
  next();
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
