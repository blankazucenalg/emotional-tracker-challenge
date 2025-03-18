import { createContext, useState } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import { setAlerts } from '../lib/alertNotifications';

// API URL
const API_URL = 'http://localhost:5050/api';

export const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
	const [reminders, setReminders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [todayAgenda, setTodayAgenda] = useState([]);

	const getTodayAgenda = async (setAlertFunction) => {
		try {
			const token = Cookie.get('token');

			if (!token) {
				setTodayAgenda([]);
				setLoading(false);
				return;
			}

			const res = await axios.get(`${API_URL}/reminders`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			const reminders = res.data;
			const weekDays = { 0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday' };
			const today = new Date();
			const todayAgenda = reminders.filter(r => {
				const weekday = weekDays[today.getDay()];
				return r.weekDays[weekday] === true;
			}).map(r => {
				const [hours, minutes] = r.time.split(':');
				const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0, 0);
				return { ...r, todayDate };
			});
			todayAgenda.sort((a, b) => a.todayDate < b.todayDate ? -1 : 1);
			setTodayAgenda(todayAgenda);
			// Set alert reminders at specific time for today's agenda
			setAlerts(todayAgenda, setAlertFunction);

		} catch (error) {
			console.error(error);

		} finally {
			setLoading(false);
		}
	}




	const getReminders = async () => {
		try {
			setLoading(true);
			const token = Cookie.get('token');

			if (!token) {
				setReminders([]);
				setLoading(false);
				return;
			}

			const res = await axios.get(`${API_URL}/reminders`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			setReminders(res.data);
		} catch (error) {
			console.error('Error fetching reminders');
		} finally {
			setLoading(false);
		}
	};

	const addReminder = async (reminderData) => {
		try {
			setLoading(true);
			const token = Cookie.get('token');
			if (!token) {
				setLoading(false);
				return;
			}
			const res = await axios.post(`${API_URL}/reminders`, reminderData, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})

			if (res.data) {
				const newReminder = {
					id: res.data._id,
					...res.data,
				};
				setReminders(prev => [newReminder, ...prev]);
			}
		} catch (err) {
			console.error(err);
			alert('Failed posting reminder');
		} finally {
			setLoading(false);
		}
	};

	const deleteReminder = async (reminderData) => {
		try {
			setLoading(true);
			const token = Cookie.get('token');
			if (!token) {
				setLoading(false);
				return;
			}
			const res = await axios.delete(`${API_URL}/reminders/${reminderData._id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})

			if (res.data) {
				setReminders(reminders.filter(r => r._id !== reminderData._id));
			}
		} catch (err) {
			console.error(err);
			alert('Failed posting reminder');
		} finally {
			setLoading(false);
		}
	};

	return (
		<ReminderContext.Provider
			value={{
				reminders,
				loading,
				getReminders,
				addReminder,
				deleteReminder,
				todayAgenda,
				getTodayAgenda,
			}}
		>
			{children}
		</ReminderContext.Provider>
	);
};