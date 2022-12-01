const admin = require('firebase-admin');
const serviceAccount = require('../../nodetemplate-53166-firebase-adminsdk-wbsbn-116f7fbd29.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendFireBAseNotifications = async (data) => {
  const { tokens, title, body, imageUrl, notificationData } = data;

  admin.messaging().sendMulticast(
    {
      notification: {
        title: title,
        body: body,
        imageUrl: imageUrl,
      },
      data: notificationData,
      tokens: tokens,
    },
    true //to test validation only in dev mode
  );
};

module.exports = {
  sendFireBAseNotifications,
};
