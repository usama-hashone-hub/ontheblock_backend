const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const inventorySchema = mongoose.Schema(
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
    },
    type: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: 'Property',
      required: [true, 'Property is required'],
    },
    added_by: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    brand: {
      type: String,
    },
    model_no: {
      type: String,
    },
    serail_no: {
      type: String,
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

inventorySchema.plugin(toJSON);
inventorySchema.plugin(paginate);

// inventorySchema.index({ loc: '2dsphere' });

inventorySchema.pre('find', function (next) {
  this.populate('type');
  this.populate('added_by');
  next();
});

inventorySchema.pre('save', function (next) {
  this.populate('type');
  this.populate('added_by');
  next();
});

inventorySchema.pre('update', function (next) {
  this.populate('type');
  this.populate('added_by');
  next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
