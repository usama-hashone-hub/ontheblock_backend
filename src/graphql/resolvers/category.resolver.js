const { GraphQLError } = require('graphql');
const { categoryService } = require('../../services');
const { checkUser } = require('../../utils/GraphqlAuth');
const pick = require('../../utils/pick');

const doc = async (document) => {
  return { ...document._doc };
};

const categoryResolver = {
  Query: {
    categories: async (_, args, context) => {
      // await checkUser(context, 'getCategories');
      const filter = pick(args.filters, ['name', 'createdAt', 'updatedAt']);
      let options = pick(args.options, ['sortBy', 'limit', 'page']);

      return await categoryService.queryCategories(filter, options);
    },
  },
  Mutation: {
    createCategory: async (_, args, context) => {
      // await checkUser(context, 'manageCategories');
      return await doc(await categoryService.createCategory(args.inputCategory));
    },
    deleteCategory: async (_, args, context) => {
      // await checkUser(context, 'manageCategories');
      return await doc(await categoryService.deleteCategoryById(args.deleteCategoryInput.id));
    },
    updateCategory: async (_, args, context) => {
      // await checkUser(context, 'manageCategories');
      return await doc(await categoryService.updateCategoryById(args.id, args.updateCategoryInput));
    },
  },
};

module.exports = { categoryResolver };
