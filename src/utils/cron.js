var cron = require('node-cron');
const { Task } = require('../models');
const { sendPushNotifications } = require('./expoNotifications');
const { sendFireBAseNotifications } = require('./firebaseNotifications');
const moment = require('moment');
const { notificationService } = require('../services');

const sendTaskNotification = cron.schedule('0 0 * * *', async () => {
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

const sendTaskNotificationUsingExpo = cron.schedule('0 0 * * *', async () => {
  let pushMessages = await getTaskNotifications();
  await sendPushNotifications(pushMessages);
});

var getTaskNotifications = async () => {
  let curDate = moment().format();
  let nextweekDate = moment().add(7, 'days').format();
  let tasks = await Task.find({
    get_notifications: true,
    is_completed: false,
    schedule_date: { $gte: curDate, $lt: nextweekDate },
  })
    .sort({ schedule_date: 'desc' })
    .populate('added_by');

  let pushMessages = tasks.reduce((acc, curr) => {
    let daysRemaning = moment(curr.schedule_date).diff(curDate, 'days');

    let OneWeekRemaining = daysRemaning == 7 ? true : false;
    let ThreeDaysRemaining = daysRemaning == 3 ? true : false;
    let OneDayRemaining = daysRemaning == 1 ? true : false;
    let TwelveHoursRemaining = daysRemaning == 0 ? true : false;

    if (OneWeekRemaining || ThreeDaysRemaining || OneDayRemaining || TwelveHoursRemaining) {
      let title =
        daysRemaning == 1
          ? 'Task will be expire tomorrow'
          : daysRemaning == 0
          ? 'Task will be expire today'
          : `Upcomming Task in will be expire in ${daysRemaning} days`;

      acc.push({
        title: title,
        subtitle: 'Task Reminder',
        body: curr.description,
        data: {
          id: curr._id,
        },
        sound: 'default',
        to: curr.added_by.notificationToken,
      });
    }

    return acc;
  }, []);

  console.log({ pushMessages });

  let task;
  let notify = pushMessages.map(async (msg) => {
    task = tasks.find((t) => msg.data.id == t._id);
    console.log(task);
    return await notificationService.createNotification({
      title: 'Task Reminder',
      notification: msg.title,
      property: task.property,
      task: msg.data.id,
      type: 'reminder',
      to: task.added_by,
    });
  });

  Promise.all(notify).then(async (res) => {
    console.log({ res });
    // await sendPushNotifications(pushMessages);
    return pushMessages;
  });
};

module.exports = {
  sendTaskNotification,
  sendTaskNotificationUsingExpo,
  getTaskNotifications,
};
