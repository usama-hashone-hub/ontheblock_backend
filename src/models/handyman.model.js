const { required } = require('joi');
const mongoose = require('mongoose');
const validator = require('validator');

const handymanSchema = mongoose.Schema(
  {
    occupation: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contact_no: {
      type: String,
      required: true,
    },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: 'Property',
      required: [true, 'Property is required'],
    },
  },
  {
    timestamps: true,
  }
);

handymanSchema.pre('find', function (next) {
  this.populate('property');
  next();
});

const Hamdyman = mongoose.model('Hamdyman', handymanSchema);

module.exports = Hamdyman;
