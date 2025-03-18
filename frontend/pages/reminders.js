import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';
import ReminderForm from '../components/ReminderForm';
import ReminderList from '../components/ReminderList';

const RemindersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
`;

export default function Reminders() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  // Basic auth protection
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <Layout title="Recordatorios - Terapia Emocional">
        <p>Cargando...</p>
      </Layout>
    );
  }

  return (
    <Layout title="Recordatorios - Terapia Emocional">
      <RemindersContainer>
        <Title>Recordatorios</Title>

        <ReminderForm />
        <ReminderList />

      </RemindersContainer>
    </Layout>
  );
}