import axios from 'axios';
import Cookie from 'js-cookie';
import { createContext, useState } from 'react';
import { setReminderNotifications } from '../lib/alertNotifications';

// API URL
const API_URL = 'http://localhost:5050/api';

export const ReminderContext = createContext();

export const ReminderProvider = ({ children }) => {
	const [reminders, setReminders] = useState([]);
	const [loading, setLoading] = useState(false);

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
			setReminderNotifications(true);
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
				setReminderNotifications();
			}
		} catch (err) {
			console.error(err);
			alert('Failed posting reminder');
		} finally {
			setLoading(false);
		}
	};

	const deleteReminder = async (reminderId) => {
		try {
			setLoading(true);
			const token = Cookie.get('token');
			if (!token) {
				setLoading(false);
				return;
			}
			const res = await axios.delete(`${API_URL}/reminders/${reminderId}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			})

			if (res.data) {
				setReminders(reminders.filter(r => r._id !== reminderId));
				setReminderNotifications();
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
			}}
		>
			{children}
		</ReminderContext.Provider>
	);
};