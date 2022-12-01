const mongoose = require('mongoose');
const { app, http } = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const AWS = require('aws-sdk');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');
const can = require('./middlewares/auth');
const { verifyTokenGetUser, getPayload } = require('./services/token.service');

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = http.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });

  // const credentials = {
  //   accessKeyId: config.s3.bucket.accessKey,
  //   secretAccessKey: config.s3.bucket.privateKey,
  // };
  // const s3 = new AWS.S3({ credentials, region: config.s3.bucket.region });

  // s3.headBucket(
  //   {
  //     Bucket: config.s3.bucket.name,
  //   },
  //   function (err, data) {
  //     if (err) {
  //       logger.error('Unable to connect to S3 bucket => ' + err);
  //     } else {
  //       logger.info('Connected to S3');
  //     }
  //   }
  // );
});

const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // Get the user token from the headers.
    const token = req.headers.authorization || '';

    // Try to retrieve a user with the token
    const { user } = await getPayload(token);

    // add the user to the context
    return { user };
  },
});

graphqlServer.listen({ port: config.grahqlPort }).then(({ url }) => {
  logger.info(`Connected to GraphQl ${url}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
