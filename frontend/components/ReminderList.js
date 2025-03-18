import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ReminderContext } from '../context/ReminderContext';

const HistoryContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #2c3e50;
`;

const EmptyState = styled.p`
  color: #7f8c8d;
  text-align: center;
  font-style: italic;
`;

const ReminderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReminderCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ReminderHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ReminderName = styled.span`
  font-weight: bold;
  text-transform: capitalize;
  
  &.happy { color: #27ae60; }
  &.sad { color: #2980b9; }
  &.angry { color: #c0392b; }
  &.anxious { color: #f39c12; }
  &.neutral { color: #7f8c8d; }
`;

const ReminderDate = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const ReminderIntensity = styled.div`
  margin: 0.5rem 0;
  
  span {
    font-size: 0.9rem;
    color: #7f8c8d;
  }
`;

const ReminderActions = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const Button = styled.button`
  background-color: #3CABDB;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.7rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const getWeekdays = (weekdaysObj) => {
  return Object.keys(weekdaysObj);
}

const ReminderList = () => {
  const { reminders, loading, getReminders, deleteReminder } = useContext(ReminderContext);

  // Fetch reminders on component mount
  useEffect(() => {
    getReminders();
  }, []);

  const handleDelete = (event) => {
    const id = event.target.id.replace('delete-', '');
    deleteReminder(id);
  }

  return (
    <HistoryContainer>
      <Title>Recordatorios establecidos</Title>

      {loading ? (
        <p>Cargando...</p>
      ) : reminders.length === 0 ? (
        <EmptyState>No hay recordatorios aún.</EmptyState>
      ) : (
        <ReminderContainer>
          {reminders.map((reminder) => (
            <ReminderCard key={reminder.id || reminder._id}>
              <ReminderHeader>
                <ReminderName className={reminder.activityName}>
                  {reminder.activityName}
                </ReminderName>
                <ReminderDate>{formatDate(reminder.creationDate)}</ReminderDate>
              </ReminderHeader>

              <ReminderIntensity>
                Dias de recordatorio:
                {getWeekdays(reminder.weekDays).map(weekday => <span key={weekday}>{weekday}, </span>)}

              </ReminderIntensity>

              <ReminderIntensity>
                Hora de recordatorio: <span>{reminder.time} HRS</span>
              </ReminderIntensity>

              <ReminderActions>
                <Button id={`delete-${reminder._id}`} onClick={handleDelete}>Eliminar</Button>
              </ReminderActions>

            </ReminderCard>
          ))}
        </ReminderContainer>
      )}
    </HistoryContainer>
  );
};

export default ReminderList;