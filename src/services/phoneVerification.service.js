const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const accountSid = config.twilio.accountSid;
const authToken = config.twilio.authToken;
const client = require('twilio')(accountSid, authToken);

const sendVerificationMessage = async (number, email = undefined) => {
  if (email != undefined) {
    let user = await userService.getUserByEmail(email);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found with this email');
    }
  }
  await client.verify.v2
    .services(config.twilio.serviceSid)
    .verifications.create({ to: number, channel: 'sms' })
    .then(async (verification) => {
      // await userService.updateUserById(user.id, { phone: number });
    });
};

const verifyMessageCode = async (code, email) => {
  let user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found with this email');
  }
  let verificationResult = await client.verify.v2
    .services(config.twilio.serviceSid)
    .verificationChecks.create({ code, to: user.phone });

  if (verificationResult.status === 'approved') {
    return await userService.updateUserById(user.id, { phoneVerified: true });
  }

  throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Unable to verify code. status: ${verificationResult.status}`);
};

const verifyMessageCodeGraphQl = async (code, phone) => {
  let verificationResult = await client.verify.v2
    .services(config.twilio.serviceSid)
    .verificationChecks.create({ code, to: phone });

  if (verificationResult.status === 'approved') {
    return true;
  }

  throw new Error(`Unable to verify code. status: ${verificationResult.status}`);
};

module.exports = {
  sendVerificationMessage,
  verifyMessageCode,
  verifyMessageCodeGraphQl,
};
