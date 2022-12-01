const { folderService } = require('../../services');
const pick = require('../../utils/pick');

const doc = async (document) => {
  return { ...document._doc };
};

const folderResolver = {
  Query: {
    folders: async (_, args, { req, res }) => {
      const filter = pick(args.filters, ['name', 'inventory', 'added_by', 'createdAt', 'updatedAt']);
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
