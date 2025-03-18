import { useState, useContext } from 'react';
import styled from 'styled-components';
import { EmotionContext } from '../context/EmotionContext';
import { ReminderContext } from '../context/ReminderContext';

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #2c3e50;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #34495e;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Range = styled.input`
  width: 100%;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  gap: .2rem;
`;

const Button = styled.button`
  background-color: #3CABDB;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const ReminderForm = () => {
  const activities = [
    'Seguimiento de emoción',
    'Actividad física',
    'Diario de gratitud',
    'Práctica de mindfulness',
    'Recordatorio de acto solidario',
    'Tiempo con tu mascota',
    'Contacto con la naturaleza',
    'Actividad para romper la monotonía',
    'Práctica de yoga',
    'Hora de dormir',
    'Tiempo de socializar'
  ]
  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const [form, setForm] = useState({
    activityName: activities[0],
    time: '',
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  });

  const { addReminder } = useContext(ReminderContext);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    let change = value;
    if (weekDays.indexOf(name) > -1) {
      change = checked;
    }
    setForm({ ...form, [name]: change });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);

    addReminder({
      activityName: form.activityName,
      time: form.time,
      monday: form.monday,
      tuesday: form.tuesday,
      wednesday: form.wednesday,
      thursday: form.thursday,
      friday: form.friday,
      saturday: form.saturday,
      sunday: form.sunday
    })

    // Reset form
    setForm({
      activityName: activities[0],
      time: '',
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    });
  };

  return (
    <FormContainer>
      <Title>Actividades para tu bienestar</Title>

      <p>Realizar actividades que contribuyan a tu bienestar es un paso muy importante en tu proceso de terapia y salud mental diaria.</p>
      <p>Si frecuentemente olvidas realizar alguna actividad que contribuya a tu bienestar, podemos recordarte hacerlo por ti.</p>

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="activityName">¿Qué actividad te interesa que te recordemos?</Label>
          <Select
            id="activityName"
            name="activityName"
            value={form.activityName}
            onChange={handleChange}
          >
            {activities.map((activityName, index) =>
              <option key={index} value={activityName}>{activityName}</option>)}
          </Select>
        </InputGroup>

        <InputGroup>
          <legend>¿Qué días quieres el recordatorio?</legend>

          <CheckboxContainer>
            <Label htmlFor="monday">Lunes</Label>
            <Input type="checkbox" id='monday' name='monday' checked={form.monday} onChange={handleChange} />
            <Label htmlFor="tuesday">Martes</Label>
            <Input type="checkbox" id='tuesday' name='tuesday' checked={form.tuesday} onChange={handleChange} />
            <Label htmlFor="wednesday">Miércoles</Label>
            <Input type="checkbox" id='wednesday' name='wednesday' checked={form.wednesday} onChange={handleChange} />
            <Label htmlFor="thursday">Jueves</Label>
            <Input type="checkbox" id='thursday' name='thursday' checked={form.thursday} onChange={handleChange} />
            <Label htmlFor="friday">Viernes</Label>
            <Input type="checkbox" id='friday' name='friday' checked={form.friday} onChange={handleChange} />
            <Label htmlFor="saturday">Sábado</Label>
            <Input type="checkbox" id='saturday' name='saturday' checked={form.saturday} onChange={handleChange} />
            <Label htmlFor="sunday">Domingo</Label>
            <Input type="checkbox" id='sunday' name='sunday' checked={form.sunday} onChange={handleChange} />
          </CheckboxContainer>
        </InputGroup>

        <InputGroup>
          <Label htmlFor="time">¿A qué hora quieres el recordatorio?</Label>
          <input id='time' name='time' type='time' step="600" value={form.time} required onChange={handleChange} />
        </InputGroup>

        <Button type="submit">Configurar recordatorio</Button>
      </Form>
    </FormContainer>
  );
}

export default ReminderForm;