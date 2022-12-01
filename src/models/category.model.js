const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const categroySchema = mongoose.Schema(
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
    subCategories: {
      type: [mongoose.Schema.ObjectId],
      ref: 'Category',
    },
    parentCategory: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
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

categroySchema.plugin(toJSON);
categroySchema.plugin(paginate);

const Category = mongoose.model('Category', categroySchema);

module.exports = Category;
