const { propertyTypeService } = require('../../services');
const pick = require('../../utils/pick');

const doc = async (document) => {
  return { ...document._doc };
};

const propertyTypeResolver = {
  Query: {
    propertyTypes: async (_, args, { req, res }) => {
      const filter = pick(args.filters, ['name', 'is_default', 'is_active', 'createdAt', 'updatedAt']);
      const options = pick(args.options, ['sortBy', 'limit', 'page']);
      return await propertyTypeService.queryPropertyTypes(filter, options);
    },
  },
  Mutation: {
    createPropertyType: async (_, args, context) => {
      return await doc(await propertyTypeService.createPropertyType(args.inputPropertyType));
    },
    deletePropertyType: async (_, args, context) => {
      return await doc(await propertyTypeService.deletePropertyTypeById(args.deletePropertyTypeInput.id));
    },
    updatePropertyType: async (_, args, context) => {
      return await doc(await propertyTypeService.updatePropertyTypeById(args.id, args.updatePropertyTypeInput));
    },
  },
};

module.exports = { propertyTypeResolver };
