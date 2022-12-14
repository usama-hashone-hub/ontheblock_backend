const { File } = require('../../models');
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
    addMultipleFiles: async (_, args, context) => {
      let inputFiles = args.InputMultipleFiles?.files ?? [];
      let deleteFiles = args.InputMultipleFiles.deletedFiles;
      let folder = await folderService.getFolderById(args.folderId);

      let remainingFiles = [];
      if (deleteFiles) {
        remainingFiles = folder.files.filter((file) => !deleteFiles.includes(file.toString()));
        console.log(remainingFiles);
      } else {
        remainingFiles = folder.files;
      }

      const uploadfiles = inputFiles.map(async (file) => {
        return await fileService.createFile({
          name: file.name,
          path: file.path,
          mimetype: file.mimetype,
        });
      });

      let attachFilesToFoler = [];

      return await Promise.all(uploadfiles).then(async (files) => {
        let Newfiles = files.map((file) => file._id);

        attachFilesToFoler = [...Newfiles, ...remainingFiles];
        // console.log(attachFilesToFoler);
        return await folderService.updateFolderById(args.folderId, { files: attachFilesToFoler });
      });
    },
  },
};

module.exports = { fileResolver };
