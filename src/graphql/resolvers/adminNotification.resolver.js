const { GraphQLError } = require('graphql');
const { adminNotificationService } = require('../../services');
const { checkUser } = require('../../utils/GraphqlAuth');
const pick = require('../../utils/pick');

const doc = async (document) => {
  return { ...document._doc };
};

const adminNotificationResolver = {
  Query: {
    adminNotifications: async (_, args, context) => {
      // await checkUser(context, 'getCategories');
      const filter = pick(args.filters, ['month', 'createdAt', 'updatedAt']);
      let options = pick(args.options, ['sortBy', 'limit', 'page']);

      return await adminNotificationService.queryAdminNotifications(filter, options);
    },
  },
  Mutation: {
    addAdminNotification: async (_, args, context) => {
      // await checkUser(context, 'manageCategories');
      return await doc(await adminNotificationService.createAdminNotification(args.inputAdminNotification));
    },
    deleteAdminNotification: async (_, args, context) => {
      // await checkUser(context, 'manageCategories');
      return await doc(await adminNotificationService.deleteAdminNotificationById(args.id));
    },
    updateAdminNotification: async (_, args, context) => {
      // await checkUser(context, 'manageCategories');
      return await doc(
        await adminNotificationService.updateAdminNotificationById(args.id, args.updateAdminNotificationInput)
      );
    },
  },
};

module.exports = { adminNotificationResolver };
