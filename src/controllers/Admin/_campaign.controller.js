const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { campaignService } = require('../../services');

const createCampaign = catchAsync(async (req, res) => {
  const campaign = await campaignService.createCampaign(req.body);
  res.status(httpStatus.CREATED).send(campaign);
});

const getCampaigns = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'price']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await campaignService.queryCampaigns(filter, options);
  res.send(result);
});

const getCampaign = catchAsync(async (req, res) => {
  const campaign = await campaignService.getCampaignById(req.params.campaignId);
  if (!campaign) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Campaign not found');
  }
  res.send(campaign);
});

const updateCampaign = catchAsync(async (req, res) => {
  const campaign = await campaignService.updateCampaignById(req.params.campaignId, req.body);
  res.status(httpStatus.OK).send(campaign);
});

const deleteCampaign = catchAsync(async (req, res) => {
  await campaignService.deleteCampaignById(req.params.campaignId);
  res.status(httpStatus.OK).send({
    status: 200,
  });
});

const publishCampaign = catchAsync(async (req, res) => {
  let camp = await campaignService.getCampaignById(req.params.campaignId);

  if (camp.prizes.length <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Please add at least one prize befoure publishing.');
  }

  if (camp.notes.length <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Please add at least one note befoure publishing.');
  }

  const campaign = await campaignService.updateCampaignById(req.params.campaignId, req.body);
  res.status(httpStatus.OK).send(campaign);
});

//campaign prizes methods

const addPrize = catchAsync(async (req, res) => {
  const campaign = await campaignService.addPrize(req.query.campaignId, req.body);
  res.status(httpStatus.CREATED).send(campaign);
});

const updatePrize = catchAsync(async (req, res) => {
  const campaign = await campaignService.updatePrize(req.query.campaignId, req.query.prizeId, req.body);
  res.status(httpStatus.OK).send(campaign);
});

const deletePrize = catchAsync(async (req, res) => {
  let campaign = await campaignService.deletePrize(req.query.campaignId, req.query.prizeId);
  res.status(httpStatus.OK).send(campaign);
});

//campaign prizes methods

const addNote = catchAsync(async (req, res) => {
  const campaign = await campaignService.addNote(req.query.campaignId, req.body);
  res.status(httpStatus.CREATED).send(campaign);
});

const updateNote = catchAsync(async (req, res) => {
  const campaign = await campaignService.updateNote(req.query.campaignId, req.query.noteId, req.body);
  res.status(httpStatus.OK).send(campaign);
});

const deleteNote = catchAsync(async (req, res) => {
  let campaign = await campaignService.deleteNote(req.query.campaignId, req.query.noteId);
  res.status(httpStatus.OK).send(campaign);
});

//campaign winners methods

const addWinner = catchAsync(async (req, res) => {
  const campaign = await campaignService.addWinner(req.query.campaignId, req.query.prizeId, req.body);
  res.status(httpStatus.CREATED).send(campaign);
});

const updateWinner = catchAsync(async (req, res) => {
  const campaign = await campaignService.updateWinner(req.query.campaignId, req.query.prizeId, req.body);
  res.status(httpStatus.OK).send(campaign);
});

const deleteWinner = catchAsync(async (req, res) => {
  let campaign = await campaignService.deleteWinner(req.query.campaignId, req.query.prizeId);
  res.status(httpStatus.OK).send(campaign);
});

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  publishCampaign,
  addPrize,
  updatePrize,
  deletePrize,
  addNote,
  updateNote,
  deleteNote,
  addWinner,
  updateWinner,
  deleteWinner,
};
