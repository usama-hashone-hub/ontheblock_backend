const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const taskSchema = mongoose.Schema(
  {
    schedule_date: {
      type: Date,
      required: true,
    },
    added_by: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.ObjectId,
      ref: 'Property',
      required: true,
    },
    inventory: {
      type: mongoose.Schema.ObjectId,
      ref: 'Inventory',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    get_notifications: {
      type: Boolean,
      default: true,
    },
    is_completed: {
      type: Boolean,
      default: false,
    },
    assign_to: {
      type: mongoose.Schema.ObjectId,
      ref: 'Handyman',
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.plugin(toJSON);
taskSchema.plugin(paginate);

taskSchema.pre('find', function (next) {
  this.populate('inventory');
  this.populate('assign_to');
  this.populate('property');
  this.populate('added_by');

  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
