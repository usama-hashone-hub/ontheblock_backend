const {
  authService,
  tokenService,
  userService,
  emailService,
  phoneVerificationService,
  propertyService,
} = require('../../services');
const pick = require('../../utils/pick');
const moment = require('moment');
const { Inventory } = require('../../models');
const { checkUser } = require('../../utils/GraphqlAuth');
const ImageKit = require('imagekit');
const mongoose = require('mongoose');

const doc = async (user) => {
  return { ...user._doc };
};

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
          $group: {
            _id: '$type',
            inventories: {
              $push: {
                images: '$images',
                _id: '$_id',
                name: '$name',
                brand: '$brand',
                model_no: '$model_no',
                serail_no: '$serail_no',
              },
            },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: {
            path: '$category',
          },
        },
        {
          $project: {
            inventories: {
              $slice: ['$inventories', 0, 10],
            },
            category: '$category',
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
  },
  Mutation: {
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
      const user = await authService.loginUserWithEmailAndPassword(email, password);
      await userService.updateUserById(user._id, { notificationToken: notificationToken });
      const token = await tokenService.generateAuthTokens(user, true);
      return { ...(await doc(user)), ...token };
    },
    updateUser: async (_, args, context) => {
      await checkUser(context, 'updateProfile');
      if (!context.user) {
        throw new Error('Unauthenticated!');
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
    forgetPasswordChange: async (_, { token, password }, constext) => {
      await authService.resetPassword(token, password);
      return {
        result: true,
      };
    },
    resetPassword: async (_, { password, newPassword, email }, constext) => {
      await authService.changePassword(email, password, newPassword);
      return {
        result: true,
      };
    },
  },
};

module.exports = {
  authResolver,
};
