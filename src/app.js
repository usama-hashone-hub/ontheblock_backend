const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const { getPath, uploadImage } = require('./utils/cloudinary');
const { userService, roomService, messageService } = require('./services');
const { User } = require('./models');
const pick = require('./utils/pick');
const moment = require('moment');
const { Room, Message } = require('./models');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { sendTaskNotificationUsingExpo, testCorn, testfunc, getTaskNotifications } = require('./utils/cron');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.enable('trust proxy');

// set security HTTP headers
// app.use(helmet());
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());
// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

app.get('/', (req, res, next) => {
  res.send({ message: 'Welcome to youhook APIs' });
});

sendTaskNotificationUsingExpo.start();
// getTaskNotifications();
// sendTestNotification();
// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// io.on('connection', (socket) => {
//   console.log('connected');

//   socket.on('join', async (data) => {
//     const { authId } = data;
//     console.log('====================== JOIN ===================');
//     await userService.updateUserById(authId, {
//       socketId: socket.id,
//       isOnline: true,
//     });
//   });

//   socket.on('createRoom', async (data) => {
//     const { room } = data;
//     console.log('====================== CREATE JOIN ===================');
//     await roomService.createRoom(room);
//   });

//   getRoomMessages = async (data) => {
//     const { roomId, authId, joinRoom } = data;
//     console.log('====================== GET MESSAGE ===================');

//     const options = pick(data, ['sortBy', 'limit', 'page']);

//     if (joinRoom == true) {
//       const messages = await messageService.queryMessages({ room: roomId }, options);

//       const messageIds = messages.results.map((msg) => msg.id);

//       // Updateding messages seenBy array aacording to authId
//       await Message.updateMany(
//         { _id: { $in: messageIds }, to: { $in: [authId] }, status: { $ne: 'readed' } },
//         { $addToSet: { seenBy: authId } }
//       );

//       //Updating msg status by comparing seenBy and user array
//       await Message.updateMany(
//         { _id: { $in: messageIds }, to: { $in: [authId] }, $expr: { $eq: [{ $size: '$to' }, { $size: '$seenBy' }] } },
//         { status: 'readed' }
//       );
//     }

//     const updatedMessages = await messageService.queryMessages({ room: roomId }, options);
//     io.emit(roomId, updatedMessages);
//   };

//   socket.on('getRoomMessages', async (data) => {
//     await getRoomMessages(data);
//   });

//   socket.on('roomJoin', async (data) => {
//     const { roomId, authId } = data;
//     console.log('====================== ROOM JOIN ===================');
//     await roomService.updateRoomById(roomId, { $addToSet: { users: authId }, $addToSet: { connectedUsers: authId } });
//     socket.join(roomId);

//     await getRoomMessages({ ...data, joinRoom: true });
//   });

//   socket.on('sendMessage', async (data) => {
//     const { authId, roomId, message, messageType, files } = data;
//     console.log('====================== SEND MESSAGE ===================');
//     const room = await roomService.getRoomById(roomId);
//     const roomUsers = await roomService.getRoomByIdUserPopulated(roomId);

//     if (!room.users.includes(authId)) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot send message user is not in the room');
//     }

//     if (!room.connectedUsers.includes(authId)) {
//       throw new ApiError(httpStatus.BAD_REQUEST, 'please join room before sending message');
//     }

//     if (messageType == 'file') {
//       if (files?.length <= 0 || files == undefined) {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'messageType file must have atleast 1 file in files array');
//       }
//     }

//     const m = await messageService.createMessage({
//       room: roomId,
//       type: messageType,
//       message: message,
//       from: authId,
//       files: messageType == 'text' ? [] : files,
//       to: room.users.filter((user) => user != authId),
//       seenBy: room.connectedUsers.filter((user) => user != authId),
//       status: room.connectedUsers.length == room.users.length ? 'readed' : 'delevired',
//     });

//     let updateRoom = { lastMessage: m._id };

//     if (!room.primeUser) {
//       updateRoom = { ...updateRoom, primeUser: room.users.filter((user) => user != authId).at(0) };
//     }

//     await roomService.updateRoomById(roomId, updateRoom);

//     await getRoomMessages(data);

//     const tokens = roomUsers.users
//       .filter((user) => user._id != authId)
//       .reduce((acc, curr) => {
//         acc.push(...curr?.deviceTokens);
//         return acc;
//       }, []);

//     if (tokens.length > 0) {
//       let sender = await userService.getUserById(authId);

//       await sendFireBAseNotifications({
//         title: room?.chatName ? room?.chatName : roomUsers?.primeUser?.name,
//         body: message,
//         tokens,
//         imageUrl: 'image url',
//         notificationData: { roomId, name: sender.name, id: sender._id },
//       });
//     }
//   });

//   socket.on('leaveRoom', async (data) => {
//     const { authId, roomId } = data;
//     console.log('====================== leaveRoom ===================');
//     await roomService.updateRoomById(roomId, { $pull: { connectedUsers: authId } });
//     socket.leave(roomId);
//   });

//   socket.on('typing', async (data) => {
//     const { roomId, authId } = data;
//     console.log('====================== typing ===================');
//     const user = await userService.getUserById(authId);
//     io.emit('typing-' + roomId, { typing: true, message: user?.name + ' is Typing' });
//   });

//   socket.on('stopTyping', (data) => {
//     const { roomId } = data;
//     console.log('====================== stop Typing ===================');
//     io.emit('stopTyping-' + roomId, { typing: false });
//   });

//   socket.on('disconnect', () => {
//     console.log('====================== DISCONNECT ===================');
//   });
// });

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = { app, http };
