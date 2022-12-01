const { handymanService } = require('../../services');
const pick = require('../../utils/pick');

const doc = async (document) => {
  return { ...document._doc };
};

const handymanResolver = {
  Query: {
    handymen: async (_, args, { req, res }) => {
      const filter = pick(args.filters, ['name', 'createdAt', 'updatedAt', 'occupation', 'contact_no', 'property']);
      const options = pick(args.options, ['sortBy', 'limit', 'page']);
      return await handymanService.queryHandymen(filter, options);
    },
  },
  Mutation: {
    addHandyman: async (_, args, context) => {
      return await doc(await handymanService.createHandyman(args.inputHandyman));
    },
    deleteHandyman: async (_, args, context) => {
      return await doc(await handymanService.deleteHandymanById(args.deleteHandymanInput.id));
    },
    updateHandyman: async (_, args, context) => {
      return await doc(await handymanService.updateHandymanById(args.id, args.updateHandymanInput));
    },
  },
};

module.exports = { handymanResolver };
