var cron = require('node-cron');
const { Task } = require('../models');
const { sendFireBAseNotifications } = require('./firebaseNotifications');

const sendTaskNotification = cron.schedule('* 12 * * *', async () => {
  let curDate = moment().format();
  let nextweekDate = moment().add(7, 'days').format();
  let tasks = await Task.find({
    get_notifications: true,
    is_completed: false,
    schedule_date: { $gte: curDate, $lt: nextweekDate },
  })
    .sort({ schedule_date: 'desc' })
    .populate('added_by');

  let sendtasks = tasks.map(
    async (task) => {
      await sendFireBAseNotifications({
        title: 'Upcomming Task',
        body: 'You notifictaion is about to be there',
        imageUrl: 'image.png',
        notificationData: {
          id: task.id,
        },
        tokens: task.added_by.nonotificationToken,
      });
    },
    {
      scheduled: true,
    }
  );

  Promise.all(sendtasks).then(function () {
    console.log('notification send successfully');
  });
});

module.exports = {
  sendTaskNotification,
};
