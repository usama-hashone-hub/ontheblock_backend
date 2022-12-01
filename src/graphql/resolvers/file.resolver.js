const { fileService, folderService } = require('../../services');
const pick = require('../../utils/pick');

const doc = async (document) => {
  return { ...document._doc };
};

const fileResolver = {
  Query: {
    files: async (_, args, { req, res }) => {
      const filter = pick(args.filters, ['name', 'createdAt', 'updatedAt']);
      const options = pick(args.options, ['sortBy', 'limit', 'page']);
      return await fileService.queryFiles(filter, options);
    },
  },
  Mutation: {
    addFile: async (_, args, context) => {
      const file = await fileService.createFile(args.inputFile);

      await folderService.updateFolderById(args.folderId, { $push: { files: file._id } });

      return await doc(file);
    },
    deleteFile: async (_, args, context) => {
      return await doc(await fileService.deleteFileById(args.deleteFileInput.id));
    },
    updateFile: async (_, args, context) => {
      return await doc(await fileService.updateFileById(args.id, args.updateFileInput));
    },
  },
};

module.exports = { fileResolver };
