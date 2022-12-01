const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html) => {
  const msg = { from: config.email.from, to, subject, text, html };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, code) => {
  const subject = 'Reset password code';

  const text = null;

  const data = {
    code,
  };

  const filePath = path.join(__dirname, '../../src/views', 'forgetPassCodeEmail.html');

  var template = fs.readFileSync(filePath, 'utf-8');

  const html = ejs.render(template, data);
  console.log('in');

  await sendEmail(to, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationLinkEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `${config.appUrl}verify-email?token=${token}`;

  const text = null;

  const data = {
    verificationEmailUrl,
  };

  const filePath = path.join(__dirname, '../../src/views', 'verifyEmail.html');

  var template = fs.readFileSync(filePath, 'utf-8');

  const html = ejs.render(template, data);

  await sendEmail(to, subject, text, html);
};

const sendVerificationCodeEmail = async (to, code) => {
  const subject = 'Email Verification';

  const text = null;

  const data = {
    code,
  };

  const filePath = path.join(__dirname, '../../src/views', 'verifyCodeEmail.html');

  var template = fs.readFileSync(filePath, 'utf-8');

  const html = ejs.render(template, data);

  await sendEmail(to, subject, text, html);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationLinkEmail,
  sendVerificationCodeEmail,
};
