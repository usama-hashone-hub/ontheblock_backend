const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const can = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword), authController.forgotPassword);
router.post(
  '/verify-forgot-password-code',
  validate(authValidation.verifyForgotPasswordCode),
  authController.verifyForgotPasswordCode
);
router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

// Email verification APIS using   Token
router.post('/send-verification-email', can('verifyEmail'), authController.sendVerificationEmail);
router.post('/verify-email', can('verifyEmail'), validate(authValidation.verifyEmail), authController.verifyEmail);

// Email verification APIS using code
router.post(
  '/send-verification-code',
  can('verifyEmail'),
  validate(authValidation.verifyCodeEmail),
  authController.sendVerificationCode
);
router.post('/verify-code', can('verifyEmail'), validate(authValidation.verifyCode), authController.verifyCode);

// Mobile number verification APIS using twilio
router.post(
  '/send-verification-message',
  can('verifyPhone'),
  validate(authValidation.validatePhone),
  authController.sendVerificationMessage
);
router.post(
  '/verify-mobile-code',
  can('verifyPhone'),
  validate(authValidation.verifyPhone),
  authController.verifyMobileCode
);

router.patch(
  '/update-profile',
  can('updateProfile'),
  validate(authValidation.updateProfileAttributes),
  authController.updateProfile
);

router.get('/get-profile', can('getMyProfile'), authController.getProfile);

module.exports = router;
