const { taskService } = require('../../services');
const pick = require('../../utils/pick');
const moment = require('moment');
const { Task } = require('../../models');
const mongoose = require('mongoose');
const { checkUser } = require('../../utils/GraphqlAuth');

const doc = async (document) => {
  return { ...document._doc };
};

const taskResolver = {
  Query: {
    tasks: async (_, args, context) => {
      await checkUser(context, 'getTasks');
      let added_by = context.user._id;
      const filter = pick({ ...args.filters, added_by }, [
        '_id',
        'schedule_date',
        'is_completed',
        'inventory',
        'assign_to',
        'added_by',
        'createdAt',
        'updatedAt',
      ]);
      const options = pick(args.options, ['sortBy', 'limit', 'page']);
      return await taskService.queryTasks(filter, options);
    },
    monthlyTasksList: async (_, args) => {
      return await Task.aggregate(
        this.aggregate([
          {
            $addFields: {
              month: {
                $month: '$schedule_date',
              },
              // day: {
              //   $dayOfMonth: '$schedule_date',
              // },
              // year: {
              //   $year: '$schedule_date',
              // },
              // dayOfWeek: {
              //   $dayOfWeek: '$schedule_date',
              // },
            },
          },
          {
            $match: {
              added_by: mongoose.Types.ObjectId(args.userId),
              month: args.month,
            },
          },
        ])
      );
    },
    upcommingTasksList: async (_, args, context) => {
      await checkUser(context, 'getTasks');
      let currDate = moment().format();

      const filter = { added_by: context.user._id, schedule_date: { $gte: currDate } };
      const options = pick(args.options, ['sortBy', 'limit', 'page']);
      return await taskService.queryTasks(filter, options);
    },
  },
  Mutation: {
    addTask: async (_, args, context) => {
      return await doc(await taskService.createTask(args.inputTask));
    },
    deleteTask: async (_, args, context) => {
      return await doc(await taskService.deleteTaskById(args.deleteTaskInput.id));
    },
    updateTask: async (_, args, context) => {
      return await doc(await taskService.updateTaskById(args.id, args.updateTaskInput));
    },
  },
};

module.exports = { taskResolver };
