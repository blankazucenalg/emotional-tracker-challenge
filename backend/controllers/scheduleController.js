
const agenda = require("../agenda.js");
const { sendEmail } = require("./emailController.js");

async function scheduleReminder(reminderId, frequency, data, timezone) {
  try {
    agenda.define(`reminder email ${reminderId}`, async (job) => {
      const data = job.attrs.data;
      await sendEmail(data.to, data.subject, data.htmlContent);
    }, { priority: "high", concurrency: 10 });

    await agenda.every(frequency, `reminder email ${reminderId}`, { ...data, _id: reminderId }, { timezone });
    console.log('job created ', frequency, timezone, data);
  } catch (error) {
    console.error(`Error scheduling reminder '${reminderId}': ${error.message}`);
  }
}

async function cancelReminder(reminderId) {
  try {
    console.log('cancel reminder ', reminderId);
    await agenda.cancel({ name: `reminder email ${reminderId}` });
  } catch (error) {
    console.error(`Error canceling scheduled reminder ${reminderId}: ${error.message}`);
  }
}

module.exports = {
  scheduleReminder,
  cancelReminder
}