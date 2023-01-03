const { inventoryService } = require('../../services');
const { checkUser } = require('../../utils/GraphqlAuth');
const pick = require('../../utils/pick');

const doc = async (document) => {
  return { ...document._doc };
};

const inventoryResolver = {
  Query: {
    inventories: async (_, args, context) => {
      await checkUser(context, 'getInventories');
      let added_by = context.user._id;
      const filter = pick({ ...args.filters, added_by }, [
        'name',
        'createdAt',
        'updatedAt',
        'brand',
        'model_no',
        'serail_no',
        'is_active',
        'property',
        'type',
        'added_by',
      ]);
      let options = pick(args.options, ['sortBy', 'limit', 'page']);
      options['populate'] = [
        { path: 'added_by', model: 'User' },
        { path: 'type', model: 'Category' },
        { path: 'property', model: 'Property' },
      ];
      return await inventoryService.queryInventories(filter, options);
    },
  },
  Mutation: {
    addInventory: async (_, args, context) => {
      return await doc(await inventoryService.createInventory(args.inputInventory));
    },
    deleteInventory: async (_, args, context) => {
      return await doc(await inventoryService.deleteInventoryById(args.deleteInventoryInput.id));
    },
    updateInventory: async (_, args, context) => {
      return await doc(await inventoryService.updateInventoryById(args.id, args.updateInventoryInput));
    },
  },
};

module.exports = { inventoryResolver };
