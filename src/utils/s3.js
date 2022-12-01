const S3 = require('aws-sdk/clients/s3');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const multerS3 = require('multer-s3');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('./ApiError');
const httpStatus = require('http-status');
const { File } = require('../models');
const config = require('../config/config');

const fileBucket = config.s3.bucket.name;
const region = config.s3.bucket.region;
const accessKeyId = config.s3.bucket.accessKey;
const secretAccessKey = config.s3.bucket.privateKey;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('application/pdf')) {
    cb(null, true);
  } else {
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Not an image! Please upload only images/pdf.'), false);
  }
};

// const uploadPDfs = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: pdfBucket,
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, `${uuidv4()}-pdf`);
//     },
//   }),
//   limits: { fileSize: 3000000 }, // In bytes: 3000000 bytes = 3 MB
//   fileFilter: multerFilter,
// });

// exports.uploadUserPDfs = uploadPDfs.fields([
//   {
//     name: 'documents',
//     maxCount: 4,
//   },
//   {
//     name: 'privateDocuments',
//     maxCount: 2,
//   },
// ]);

const uploadFile = multer({
  storage: multerS3({
    s3: s3,
    bucket: fileBucket,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const fileName = `${uuidv4()}-${file.mimetype}`;
      File.create({
        name: file.originalname,
        s3key: fileName,
        mimetype: file.mimetype,
      });
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 3000000 }, // In bytes: 2000000 bytes = 3 MB
  fileFilter: multerFilter,
});

exports.uploadFilesArray = uploadFile.fields([
  {
    name: 'photo',
    maxCount: 1,
  },
  {
    name: 'cover_image',
    maxCount: 1,
  },
  {
    name: 'image',
    maxCount: 1,
  },
  {
    name: 'icon',
    maxCount: 1,
  },
  {
    name: 'cms',
    maxCount: 10,
  },
  {
    name: 'cover_image',
    maxCount: 1,
  },
  {
    name: 'display_image',
    maxCount: 1,
  },
  {
    name: 'sec1Image',
    maxCount: 1,
  },
  {
    name: 'sec2Image',
    maxCount: 1,
  },
  {
    name: 'sec3Image',
    maxCount: 1,
  },
  {
    name: 'privateDocumentsThumbnail',
    maxCount: 2,
  },
  {
    name: 'documentsThumbnail',
    maxCount: 4,
  },
]);

/* 
// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;
 */
// downloads a file from s3

function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: imageBucket,
  };

  return s3.getObject(downloadParams).createReadStream();
}

function deleteFileStream(fileKey) {
  const deleteParams = {
    Key: fileKey,
    Bucket: imageBucket,
  };

  return s3.deleteObject(deleteParams).promise();
}

function deletePDF(fileKey) {
  const deleteParams = {
    Key: fileKey,
    Bucket: pdfBucket,
  };

  return s3.deleteObject(deleteParams).promise();
}

function getPDFFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: pdfBucket,
  };

  return s3.getObject(downloadParams).createReadStream();
}

exports.readFile = catchAsync(async (req, res, next) => {
  const key = req.params.key;
  const file = await File.findOne({ s3key: key });
  res.header('Content-type', file.s3key);
  await getFileStream(key)
    .on('error', (e) => {
      throw new ApiError(httpStatus.BAD_REQUEST, e);
    })
    .pipe(res);
});

exports.deleteFile = catchAsync(async (req, res, next) => {
  const key = req.params.key;
  const data = deleteFileStream(key).on('error', (e) => {
    throw new ApiError(httpStatus.BAD_REQUEST, e);
  });
  res.status(httpStatus.OK).send(data);
});
