const mongoose = require('mongoose');
const db = mongoose.connection;
const { Agenda } = require('@hokify/agenda')
const agenda = new Agenda();

db.collection('jobs').createIndex({
  nextRunAt: 1,
  lockedAt: 1,
  name: 1,
  priority: 1
});

agenda.mongo(db, 'jobs');

async function scheduleTask(name, frequency, data, timezone, callback) {
  try {
    await agenda.define(name, { priority: "high", concurrency: 10 }, async (job, done) => {
      console.log('Job started');
      await callback(job.attrs.data);
      done();
    });

    await agenda.start();
    await agenda.every(frequency, name, data, { timezone });
  } catch (error) {
    console.error(`Error scheduling task '${name}': ${error.message}`);
  }
}

async function cancelTask(name) {
  try {
    await agenda.cancel({ name });
  } catch (error) {
    console.error(`Error canceling scheduled task ${name}: ${error.message}`);
  }
}

module.exports = {
  scheduleTask,
  cancelTask
}