const {
  authService,
  tokenService,
  userService,
  emailService,
  phoneVerificationService,
  propertyService,
  notificationService,
} = require('../../services');
const pick = require('../../utils/pick');
const moment = require('moment');
const { Inventory, User } = require('../../models');
const { checkUser } = require('../../utils/GraphqlAuth');
const ImageKit = require('imagekit');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const fs = require('fs');
const path = require('path');
const AppleAuth = require('apple-auth');
const jwt = require('jsonwebtoken');

const doc = async (user) => {
  return { ...user._doc };
};

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: 'Invalid user detected. Please try again' };
  }
}

const applecConfig = fs.readFileSync(path.join(__dirname, '../../', '/config/appleLogin/', 'config.json'));

let auth = new AppleAuth(
  applecConfig,
  path.join(__dirname, '../../', '/config/appleLogin/', 'AuthKey.p8').toString(),
  'text'
);

const authResolver = {
  Query: {
    profile: async (_, args, context) => {
      await checkUser(context, 'getProfile');
      return context.user;
      // console.log(context);
      // const user = await userService.getUserById(context._id);
      // return await doc(user);
    },
    getInventoryByCategory: async (_, args, context) => {
      await checkUser(context, 'getInventoryByCategory');
      console.log(context.user._id, args.propertyId);

      let data = await Inventory.aggregate([
        {
          $match: {
            property: mongoose.Types.ObjectId(args.propertyId),
            added_by: mongoose.Types.ObjectId(context.user._id),
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'type',
            foreignField: '_id',
            as: 'type',
          },
        },
        {
          $unwind: {
            path: '$type',
          },
        },
        {
          $group: {
            _id: '$mainCatgeory',
            inventories: {
              $push: {
                images: '$images',
                _id: '$_id',
                name: '$name',
                brand: '$brand',
                model_no: '$model_no',
                serail_no: '$serail_no',
                mainCatgeory: '$mainCatgeory',
                type: '$type',
              },
            },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'mainCatgeory',
          },
        },
        {
          $unwind: {
            path: '$mainCatgeory',
          },
        },
        {
          $project: {
            inventories: {
              $slice: ['$inventories', 0, 100],
            },
            mainCatgeory: '$mainCatgeory',
          },
        },
      ]);

      return data;
    },
    getInventoryMainCategoryAndChildCategory: async (_, args, context) => {
      await checkUser(context, 'getInventoryMainCategoryAndChildCategory');
      console.log(context.user._id, args.propertyId);

      let data = await Inventory.aggregate([
        {
          $match: {
            property: mongoose.Types.ObjectId(args.propertyId),
            added_by: mongoose.Types.ObjectId(context.user._id),
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'type',
            foreignField: '_id',
            as: 'type',
          },
        },
        {
          $unwind: {
            path: '$type',
          },
        },
        {
          $group: {
            _id: '$mainCatgeory',
            subCategories: {
              $addToSet: {
                _id: '$type._id',
                name: '$type.name',
                image: '$type.image',
                parentCategory: '$type.parentCategory',
              },
            },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'mainCatgeory',
          },
        },
        {
          $unwind: {
            path: '$mainCatgeory',
          },
        },
      ]);

      return data;
    },
    users: async (_, args, context) => {
      const filter = pick(args.filters, [
        'role',
        'first_name',
        'last_name',
        'phone',
        'email',
        'photo',
        'is_active',
        'createdAt',
        'updatedAt',
      ]);
      const options = pick(args.options, ['sortBy', 'limit', 'page']);
      return await userService.queryUsers(filter, options);
    },
    getImageKitToken: async (_, args, context) => {
      var imagekit = new ImageKit({
        publicKey: 'public_9oA6a9dbCTuAWI1qrlnQcdi2h/U=',
        privateKey: 'private_uI05KYEBY48GyrXEh8UKe+CY5s8=',
        urlEndpoint: 'https://ik.imagekit.io/ak4gva2wf',
      });

      var authenticationParameters = imagekit.getAuthenticationParameters();
      return authenticationParameters;
    },
    notifications: async (_, args, context) => {
      await checkUser(context, 'getNotifications');
      let to = context.user._id;
      const filter = pick({ ...args.filters, to }, ['task', 'seen', 'property', 'type', 'to']);
      let options = pick(args.options, ['sortBy', 'limit', 'page']);
      options['populate'] = [
        { path: 'property', model: 'Property' },
        { path: 'task', model: 'Task' },
      ];
      console.log(filter);
      return await notificationService.queryNotifications(filter, options);
    },
  },
  Mutation: {
    googleAuthentication: async (_, { googleData, property, userData }, context) => {
      googleData = JSON.parse(googleData);
      const verificationResponse = await verifyGoogleToken(googleData);

      if (verificationResponse.error) {
        throw new Error({
          message: verificationResponse.error,
        });
      }

      const profileData = verificationResponse?.payload;
      let user;

      if (profileData?.email && (await User.isEmailTaken(profileData.email))) {
        user = await userService.getUserByEmail(profileData?.email);
      } else {
        user = await userService.createUser({ ...profileData, ...userData, auth: 'google' });
        await propertyService.createProperty({ property, added_by: user._id });
      }

      const token = await tokenService.generateAuthTokens(user, true);
      return { ...(await doc(user)), ...token };
    },
    appleAuthentication: async (_, { appleData, property, userData }, context) => {
      appleData = JSON.parse(appleData);
      const response = await auth.accessToken(appleData.code);
      const idToken = jwt.decode(response.id_token);

      const user = {};

      if (idToken?.email && (await User.isEmailTaken(idToken.email))) {
        user = await userService.getUserByEmail(idToken?.email);
      } else {
        user = await userService.createUser({ ...idToken, ...userData, auth: 'apple' });
        await propertyService.createProperty({ property, added_by: user._id });
      }

      const token = await tokenService.generateAuthTokens(user, true);
      return { ...(await doc(user)), ...token };
    },
    signup: async (_, args, context) => {
      const user = await userService.createUser(args.userInput);
      const token = await tokenService.generateAuthTokens(user, true);
      return { ...(await doc(user)), ...token };
    },
    registerWithProperty: async (_, args, context) => {
      const user = await userService.createUser(args.userInput);
      const token = await tokenService.generateAuthTokens(user, true);

      const property = await propertyService.createProperty({ ...args.propertyInput, added_by: user._id });

      return { ...(await doc(user)), ...token };
    },
    login: async (_, { email, password, notificationToken }, context) => {
      let user;

      if (!isNaN(email)) {
        user = await authService.loginUserWithPhoneAndPassword(email, password);
      } else {
        user = await authService.loginUserWithEmailAndPassword(email, password);
      }

      await userService.updateUserById(user._id, { notificationToken: notificationToken });
      const token = await tokenService.generateAuthTokens(user, true);
      return { ...(await doc(user)), ...token };
    },
    updateUser: async (_, args, context) => {
      await checkUser(context, 'updateProfile');
      if (!context.user) {
        throw new Error('Unauthenticated!');
      }

      if (Object.hasOwn(args.updateUserInput, 'phone') && args.updateUserInput?.phone != '') {
        args.updateUserInput['phoneVerified'] = false;
      }

      let user = await userService.updateUserById(context.user._id, args.updateUserInput);
      return await doc(user);
    },
    verifyPhone: async (_, { code, phone }, context) => {
      const res = await phoneVerificationService.verifyMessageCodeGraphQl(code, phone);
      return {
        phone,
        result: res,
      };
    },
    resendCode: async (_, { phone }, context) => {
      await phoneVerificationService.sendVerificationMessage(phone);
      return {
        phone,
        result: true,
      };
    },
    sendPhoneCode: async (_, { phone }, context) => {
      await phoneVerificationService.sendVerificationMessage(phone);
      return {
        phone,
        result: true,
      };
    },
    forgotPassword: async (_, { email }, { req, res }) => {
      const code = Math.floor(100000 + Math.random() * 900000);
      let user = await userService.getUserByEmail(email);

      if (!user) {
        throw new Error('User not found with this email');
      }

      await emailService.sendResetPasswordEmail(user.email, code);
      await userService.updateUserById(user.id, {
        passwordResetCode: code,
        passwordResetExpireAt: moment().add(10, 'minutes').format(),
      });
      return {
        result: true,
      };
    },
    forgotPasswordVerification: async (_, { email, code }, { req, res }) => {
      let user = await userService.getUserByEmail(email);

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found with this email');
      }

      if (user.passwordResetExpireAt < user.updatedAt) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Code is Expired');
      }
      if (user.passwordResetCode != code) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Code is Worng');
      }
      await userService.updateUserById(user.id, { isEmailVerified: true });
      const resetPasswordToken = await tokenService.generateResetPasswordToken(user.email);
      return {
        token: resetPasswordToken,
        result: true,
      };
    },
    forgetPasswordChange: async (_, { token, password }, context) => {
      await authService.resetPassword(token, password);
      return {
        result: true,
      };
    },
    resetPassword: async (_, { password, newPassword, email }, context) => {
      await authService.changePassword(email, password, newPassword);
      return {
        result: true,
      };
    },
    updateNotification: async (_, { id, updateNotification }, context) => {
      return await notificationService.updateNotificationById(id, updateNotification);
    },
  },
};

module.exports = {
  authResolver,
};
