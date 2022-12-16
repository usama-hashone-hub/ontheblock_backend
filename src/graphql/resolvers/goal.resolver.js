const { goalService } = require('../../services');
const pick = require('../../utils/pick');

const doc = async (document) => {
  return { ...document._doc };
};

const goalResolver = {
  Query: {
    goals: async (_, args) => {
      console.log({ ...args.filters, is_active: true });
      const filter = pick({ ...args.filters, is_active: true }, ['name', 'createdAt', 'updatedAt', 'is_active']);
      const options = pick(args.options, ['sortBy', 'limit', 'page']);
      return await goalService.queryGoals(filter, options);
    },
  },
  Mutation: {
    createGoal: async (_, args, context) => {
      return await doc(await goalService.createGoal(args.inputGoal));
    },
    deleteGoal: async (_, args, context) => {
      return await doc(await goalService.deleteGoalById(args.deleteGoalInput.id));
    },
    updateGoal: async (_, args, context) => {
      return await doc(await goalService.updateGoalById(args.id, args.updateGoalInput));
    },
  },
};

module.exports = { goalResolver };
