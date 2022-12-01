const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    APP_URL: Joi.string().required().description('app url'),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    AWS_BUCKET_REGION: Joi.string().description('S3 bucket region'),
    AWS_ACCESS_KEY: Joi.string().description('S3 bucket key'),
    AWS_SECRET_KEY: Joi.string().description('S3 bucket secret'),
    AWS_USERNAME: Joi.string().description('S3 bucket username'),
    AWS_BUCKET_NAME: Joi.string().description('S3 bucket name'),
    TWILIO_ACCOUNT_SID: Joi.string().description('Twilio account sid'),
    TWILIO_AUTH_TOKEN: Joi.string().description('Twilio auth token'),
    TWILIO_SERVICE_SID: Joi.string().description('Twilio service sid'),
    TAX: Joi.number().description('tax on complete rent in percentage'),
    DELIVERY: Joi.number().description('tax on complete rent in percentage'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  grahqlPort: envVars.GRAPHQL_PORT,
  appUrl: envVars.APP_URL,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  s3: {
    bucket: {
      region: envVars.AWS_BUCKET_REGION,
      accessKey: envVars.AWS_ACCESS_KEY,
      privateKey: envVars.AWS_SECRET_KEY,
      username: envVars.AWS_USERNAME,
      name: envVars.AWS_BUCKET_NAME,
    },
  },
  twilio: {
    accountSid: envVars.TWILIO_ACCOUNT_SID,
    authToken: envVars.TWILIO_AUTH_TOKEN,
    serviceSid: envVars.TWILIO_SERVICE_SID,
  },
  tax: envVars.tax,
  delivery: envVars.delivery,
};
