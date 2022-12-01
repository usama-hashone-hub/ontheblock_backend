const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const reportSchema = mongoose.Schema(
  {
    reportedTo: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    reportedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    rent: {
      type: mongoose.Schema.ObjectId,
      ref: 'Rent',
      required: [true, 'Rent is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'Resolved'],
      default: 'pending',
    },
    description: {
      type: String,
      required: true,
    },
    issues: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.plugin(toJSON);
reportSchema.plugin(paginate);

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
