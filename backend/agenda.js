const mongoose = require('mongoose');
const db = mongoose.connection;
const { Agenda } = require('@hokify/agenda')
const { sendEmail } = require('./controllers/emailController');
const Reminder = require('./models/reminderModel');
const { transformReminder } = require('./controllers/transformReminder');

const agenda = new Agenda();

(async function () {
  db.collection('jobs').createIndex({
    nextRunAt: 1,
    lockedAt: 1,
    name: 1,
    priority: 1
  });

  agenda.mongo(db, 'jobs');

  await agenda.start();


  const reminderConfigs = await Reminder.find();
  reminderConfigs.forEach(async function (reminder) {
    const jobs = await agenda.jobs({ name: 'reminder email', "data._id": reminder._id.toString() });
    const jobReminder = await transformReminder(reminder);

    agenda.define(`reminder email ${reminder._id}`, async (job) => {
      const data = job.attrs.data;
      await sendEmail(data.to, data.subject, data.htmlContent);
    }, { priority: "high", concurrency: 10 });

    await agenda.every(jobReminder.frequency, `reminder email ${reminder._id}`, { ...jobReminder.data, _id: reminder._id }, { timezone: jobReminder.timezone });
  });

})();

module.exports = agenda;