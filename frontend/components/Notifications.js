import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ReminderContext } from '../context/ReminderContext';

const setAlertFunction = (r) => alert(`Recordatorio: ${r.activityName}`);

const Notifications = () => {
  const { getTodayAgenda } = useContext(ReminderContext);

  useEffect(() => {
    console.log('Notifications');
    getTodayAgenda(setAlertFunction);
  }, []);

  return (<>
    {/* {loading ? (<p>Cargando...</p>) : notifications.length === 0 ? (<div>No notifications</div>) : (
      { notifications.map(r => <div>{r.activityName}</div>) }
    )} */}
  </>)
}
export default Notifications;