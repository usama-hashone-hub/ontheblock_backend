const multer = require('multer');
const cloudinary = require('cloudinary');
const fs = require('fs');
const ApiError = require('./ApiError');

cloudinary.config({
  cloud_name: 'dslxtg41i',
  api_key: '169771812493572',
  api_secret: 'hAx90kkZeZqvEFG0OLYH_jxcM9s',
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '.');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString());
  },
});

const multerPdfFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Not an image! Please upload only images.'));
  }
};

exports.uploadImage = multer({
  storage,
  fileFilter: multerPdfFilter,
}).fields([
  {
    name: 'photo',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 10,
  },
]);

const uploads = (file, folder) => {
  return new Promise(
    (resolve) => {
      cloudinary.uploader.upload(file, (result) => {
        resolve(result.url);
      });
    },
    {
      resource_type: 'auto',
      folder,
    }
  );
};

exports.getPath = async (files) => {
  return new Promise((resolve, reject) => {
    let a = files.map(async (file) => {
      await uploads(file.path, 'Images').then((res) => {
        try {
          file['url'] = res;
          fs.unlinkSync(file.path);
        } catch (err) {
          console.log(err);
        }
      });
    });
    Promise.all(a).then(function () {
      resolve(files.map((f) => f.url));
    });
  }).catch(function (e) {
    throw new ApiError(400, e);
  });
};
