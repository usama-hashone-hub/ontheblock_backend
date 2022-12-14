const { Expo } = require('expo-server-sdk');

const sendPushNotifications = async (expoPushMessages) => {
  let expo = new Expo();
  expo
    .sendPushNotificationsAsync(expoPushMessages)
    .then(() => {
      /* Note that expo.sendPushNotificationsAsync will not send the push notifications
       * to the user immediately but will send the information to Expo notifications
       * service instead, which will later send the notifications to the users
       * (yes, Expo might fail to send it, but usually doesn't happen) */

      functions.logger.log('Push notifications requested correctly');
    })
    .catch((error) => {
      functions.logger.error(`Error requesting push notifications`, error);
    });
};

const sendTestNotification = () => {
  let expo = new Expo();
  expo
    .sendPushNotificationsAsync([
      {
        title: 'test notification from backend server ',
        body: 'Lorem ipsom',
        data: { id: 'sadfqwe23qwfwefasdasdasd' },
        to: 'ExponentPushToken[ZRas1CAIYszJIZrdjDfJjY]',
      },
    ])
    .then(() => {
      /* Note that expo.sendPushNotificationsAsync will not send the push notifications
       * to the user immediately but will send the information to Expo notifications
       * service instead, which will later send the notifications to the users
       * (yes, Expo might fail to send it, but usually doesn't happen) */

      console.log('Push notifications requested correctly');
    })
    .catch((error) => {
      console.error(`Error requesting push notifications`, error);
    });
};

module.exports = {
  sendPushNotifications,
  sendTestNotification,
};
