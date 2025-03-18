import Cookie from 'js-cookie';
import axios from 'axios';

const API_URL = 'http://localhost:5050/api';
const WEEK_DAYS = { 0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday' };

let timeouts = [];
let alertsWereSet = false;
let notifications = [];
let reminders;

function setAlertFunction(r) {
  alert(`Recordatorio: ${r.activityName} a las ${r.time} hrs.`);
}

export async function setReminderNotifications(getCached) {
  try {
    const token = Cookie.get('token');
    if (!token) {
      notifications = [];
      return;
    }
    if (!getCached || !reminders) {
      resetAlerts();
      const res = await axios.get(`${API_URL}/reminders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      reminders = res.data;

      const today = new Date();
      notifications = reminders.map(r => {
        const [hours, minutes] = r.time.split(':');
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0, 0);
        return { ...r, todayDate };
      }).filter(r => {
        const weekday = WEEK_DAYS[today.getDay()];
        return r.weekDays[weekday] === true && r.todayDate > today;
      });
      notifications.sort((a, b) => a.todayDate < b.todayDate ? -1 : 1);

      // Set alert reminders at specific time for today's agenda
      setAlerts(notifications, setAlertFunction);
    }
  } catch (error) {
    console.error(error);
  }
}

export function setAlerts(notification, setAlertFunction) {
  if (!alertsWereSet) {
    timeouts = notification.map(r => {
      return setTimeout(() => setAlertFunction(r), r.todayDate - Date.now());
    });
    alertsWereSet = true;
    console.log('Alerts were set');
  }
}

export function resetAlerts() {
  for (let i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
  timeouts = [];
  notifications = [];
  alertsWereSet = false;
  console.log('Reset alerts');
}
