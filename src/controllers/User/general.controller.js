const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { userService, generalService, productService } = require('../../services');
const { getPath } = require('../../utils/cloudinary');
const ImageKit = require('imagekit');

const addFav = catchAsync(async (req, res) => {
  const fav = await generalService.addFav(req.user, req.query.productId);
  res.status(httpStatus.OK).send({ fav: fav.favProducts });
});

const delFav = catchAsync(async (req, res) => {
  const fav = await generalService.delFav(req.user, req.query.productId);
  res.status(httpStatus.OK).send({ fav: fav.favProducts });
});

const queryFavs = catchAsync(async (req, res) => {
  const fav = await generalService.queryFavs(req.user);
  res.send({ fav: fav.favProducts });
});

const report = catchAsync(async (req, res) => {
  return await generalService.createReport(req.body);
  //email will be send to user and admin
});

const blockUser = catchAsync(async (req, res) => {
  const user = await generalService.blockUser(req.user, req.query.userId);
  res.status(httpStatus.OK).send({ blockUser: user.blockUser });
});

const postSearch = catchAsync(async (req, res) => {
  const filter = { title: { $regex: '.*' + req.query.text + '.*' } };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const select = { _id: 1, title: 1 };
  const products = await productService.queryProducts(filter, options, select);
  res.send(products);
});

const uploadImages = catchAsync(async (req, res) => {
  let images = [];
  if (req.files?.images) images = await getPath(req.files?.images);
  res.status(httpStatus.OK).send({ images });
});

const getImageKitToken = catchAsync(async (req, res) => {
  var imagekit = new ImageKit({
    publicKey: 'public_9oA6a9dbCTuAWI1qrlnQcdi2h/U=',
    privateKey: 'private_uI05KYEBY48GyrXEh8UKe+CY5s8=',
    urlEndpoint: 'https://ik.imagekit.io/ak4gva2wf',
  });

  var authenticationParameters = imagekit.getAuthenticationParameters();
  console.log(authenticationParameters);

  res.status(httpStatus.OK).send({ ...authenticationParameters });
});

module.exports = { queryFavs, delFav, addFav, report, blockUser, postSearch, uploadImages, getImageKitToken };
