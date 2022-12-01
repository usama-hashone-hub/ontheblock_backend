const mongoose = require('mongoose');
const validator = require('validator');

const folderSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    files: {
      type: [mongoose.Schema.ObjectId],
      ref: 'File',
      required: [true, 'files are required'],
    },
    inventory: {
      type: mongoose.Schema.ObjectId,
      ref: 'Inventory',
    },
    added_by: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'user is required'],
    },
  },
  {
    timestamps: true,
  }
);

folderSchema.pre('find', function (next) {
  this.populate('files');
  this.populate('inventory');
  this.populate('added_by');
  next();
});

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
