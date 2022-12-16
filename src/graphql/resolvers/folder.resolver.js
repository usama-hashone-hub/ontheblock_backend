const { folderService } = require('../../services');
const { checkUser } = require('../../utils/GraphqlAuth');
const pick = require('../../utils/pick');

const doc = async (document) => {
  return { ...document._doc };
};

const folderResolver = {
  Query: {
    folders: async (_, args, context) => {
      await checkUser(context, 'getFolders');
      let added_by = context.user._id;
      const filter = pick({ ...args.filters, added_by }, [
        'name',
        'inventory',
        'property',
        'added_by',
        'createdAt',
        'updatedAt',
      ]);
      const options = pick(args.options, ['sortBy', 'limit', 'page']);
      return await folderService.queryFolders(filter, options);
    },
  },
  Mutation: {
    addFolder: async (_, args, context) => {
      return await doc(await folderService.createFolder(args.inputFolder));
    },
    deleteFolder: async (_, args, context) => {
      return await doc(await folderService.deleteFolderById(args.deleteFolderInput.id));
    },
    updateFolder: async (_, args, context) => {
      return await doc(await folderService.updateFolderById(args.id, args.updateFolderInput));
    },
  },
};

module.exports = { folderResolver };
