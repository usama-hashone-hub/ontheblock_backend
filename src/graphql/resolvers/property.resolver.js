const { propertyService } = require('../../services');
const { checkUser } = require('../../utils/GraphqlAuth');
const pick = require('../../utils/pick');

const doc = async (document) => {
  return { ...document._doc };
};

const propertyResolver = {
  Query: {
    properties: async (_, args, context) => {
      await checkUser(context, 'getProperties');
      let added_by = context.user._id;

      const filter = pick({ ...args.filters, added_by }, [
        'name',
        'type',
        'bedrooms',
        'bathrooms',
        'owned_years',
        'city',
        'country',
        'zip_code',
        'is_active',
        'added_by',
        'createdAt',
        'updatedAt',
      ]);
      const options = pick(args.options, ['sortBy', 'limit', 'page']);
      return await propertyService.queryProperties(filter, options);
    },
  },
  Mutation: {
    createProperty: async (_, args, context) => {
      return await doc(await propertyService.createProperty(args.inputProperty));
    },
    deleteProperty: async (_, args, context) => {
      return await doc(await propertyService.deletePropertyById(args.deletePropertyInput.id));
    },
    updateProperty: async (_, args, context) => {
      return await doc(await propertyService.updatePropertyById(args.id, args.updatePropertyInput));
    },
  },
};

module.exports = { propertyResolver };
