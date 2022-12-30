const { propertyUseService } = require('../../services');
const pick = require('../../utils/pick');

const doc = async (document) => {
  return { ...document._doc };
};

const propertyUseResolver = {
  Query: {
    propertyUses: async (_, args, { req, res }) => {
      const filter = pick(args.filters, ['name', 'is_default', 'createdAt', 'updatedAt']);
      const options = pick(args.options, ['sortBy', 'limit', 'page']);
      return await propertyUseService.queryPropertyUses(filter, options);
    },
  },
  Mutation: {
    createPropertyUse: async (_, args, context) => {
      return await doc(await propertyUseService.createPropertyUse(args.inputPropertyUse));
    },
    deletePropertyUse: async (_, args, context) => {
      return await doc(await propertyUseService.deletePropertyUseById(args.deletePropertyUseInput.id));
    },
    updatePropertyUse: async (_, args, context) => {
      return await doc(await propertyUseService.updatePropertyUseById(args.id, args.updatePropertyUseInput));
    },
  },
};

module.exports = { propertyUseResolver };
