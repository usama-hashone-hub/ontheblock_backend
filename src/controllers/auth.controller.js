const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, phoneVerificationService } = require('../services');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { getPath } = require('../utils/cloudinary');

const register = catchAsync(async (req, res) => {
  if (req.files?.photo) req.body.photo = await getPath(req.files?.photo)[0];
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).send({
    code: 200,
    message: 'Logout successfully',
  });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  // const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);

  const code = Math.floor(100000 + Math.random() * 900000);
  let user = await userService.getUserByEmail(req.body.email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found with this email');
  }

  await emailService.sendResetPasswordEmail(user.email, code);
  await userService.updateUserById(user.id, {
    passwordResetCode: code,
    passwordResetExpireAt: moment().add(10, 'minutes').format(),
  });
  res.status(httpStatus.OK).send({
    code: 200,
    message: 'Reset password code sent to email.',
  });
});

const verifyForgotPasswordCode = catchAsync(async (req, res) => {
  // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);

  const code = Math.floor(100000 + Math.random() * 900000);
  let user = await userService.getUserByEmail(req.body.email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found with this email');
  }

  console.log({ expire: user.passwordResetExpireAt, mom: user.updatedAt });

  if (user.passwordResetExpireAt < user.updatedAt) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code is Expired');
  }
  if (user.passwordResetCode != req.body.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code is Worng');
  }
  await userService.updateUserById(user.id, { isEmailVerified: true });
  const resetPasswordToken = await tokenService.generateResetPasswordToken(user.email);

  res.status(httpStatus.OK).send({
    code: 200,
    message: 'Forget password Code verified successfully. use following token to reset your password',
    resetPasswordToken,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.OK).send({
    code: 200,
    message: 'Password reset successfully.',
  });
});

// Email verification APIS using Token
const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationLinkEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.OK).send({
    code: 200,
    message: 'Email sent successfully',
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.OK).send({
    code: 200,
    message: 'Email verified successfully',
  });
});

// Email verification APIS using code
const sendVerificationCode = catchAsync(async (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000);
  let user = await userService.getUserByEmail(req.body.email);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found with this email');
  }

  await userService.updateUserById(user.id, { verificationCode: code });
  await emailService.sendVerificationCodeEmail(user.email, code);
  res.status(httpStatus.OK).send({
    code: 200,
    message: 'verification code send successfully',
  });
});

const verifyCode = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found with this email');
  }

  let expireAt = new Date(user.updatedAt);
  expireAt.setSeconds(expireAt.getSeconds() + 300);

  if (expireAt < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code is Expired');
  }
  if (user.verificationCode != req.body.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Code is Worng');
  }
  await userService.updateUserById(user.id, { isEmailVerified: true });
  res.status(httpStatus.OK).send({
    code: 200,
    message: 'Email verified successfully',
  });
});

// Mobile number verification APIS using twilio
const sendVerificationMessage = catchAsync(async (req, res) => {
  await phoneVerificationService.sendVerificationMessage(req.body.phone, req.body.email);
  res.status(httpStatus.OK).send({
    code: 200,
    message: 'Message sent successfully',
  });
});

const verifyMobileCode = catchAsync(async (req, res) => {
  await phoneVerificationService.verifyMessageCode(req.body.code, req.body.email);
  res.status(httpStatus.OK).send({
    code: 200,
    message: 'Phone verified successfully',
  });
});

const updateProfile = catchAsync(async (req, res) => {
  await userService.updateUserById(req.user.id, req.body);
  let user = await userService.getUserById(req.user.id);
  res.send({ user });
});

const getProfile = catchAsync(async (req, res) => {
  let user = await userService.getUserById(req.user.id);
  res.send({ user });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  sendVerificationCode,
  verifyEmail,
  verifyCode,
  sendVerificationMessage,
  verifyMobileCode,
  verifyForgotPasswordCode,
  updateProfile,
  getProfile,
};
