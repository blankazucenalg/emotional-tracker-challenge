import Cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import EmotionsComposition from '../components/EmotionsComposition';
import EmotionsSummary from '../components/EmotionsSummary';
import Layout from '../components/Layout';
import { AuthContext } from '../context/AuthContext';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WelcomeCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-top: 0;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  margin-bottom: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
`;

const CardText = styled.p`
  color: #7f8c8d;
  margin: 0;
`;

const CardLink = styled.a`
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

export async function getServerSideProps() {
  const token = Cookie.get('token');
  if (!token) {
    return { props: { emotionsSummary: [] } };
  }
  const res = await fetch('http://localhost:5050/api/emotions/analytics/summary', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  const emotionsSummary = await res.json();
  // Pass data to the page via props
  return { props: { emotionsSummary } }
}

export default function Dashboard({ emotionsSummary }) {
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
      <Layout title="Panel - Terapia Emocional">
        <p>Cargando...</p>
      </Layout>
    );
  }

  return (
    <Layout title="Panel - Terapia Emocional">
      <DashboardContainer>
        <WelcomeCard>
          <Title>¡Bienvenido, {user.name}!</Title>
          <Subtitle>Aquí tienes un resumen de tu bienestar emocional</Subtitle>

          {/* TODO: Add charts and statistics */}
          <EmotionsSummary />
          <EmotionsComposition />
        </WelcomeCard>



        <Grid>
          <Card>
            <CardTitle>Seguimiento Emocional</CardTitle>
            <CardText>
              Registra tus emociones diarias y mantén un seguimiento de tu bienestar mental.
            </CardText>
            <CardLink onClick={() => router.push('/emotions')}>
              Seguimiento de Emociones
            </CardLink>
          </Card>

          <Card>
            <CardTitle>Recordatorios</CardTitle>
            <CardText>
              Configura recordatorios para actividades que mejoran tu salud mental.
            </CardText>
            <CardLink onClick={() => router.push('/reminders')}>
              Configurar recordatorios
            </CardLink>
          </Card>

          <Card>
            <CardTitle>Compartir con Terapeuta</CardTitle>
            <CardText>
              Comparte tus datos de seguimiento emocional con tu terapeuta.
            </CardText>
            <CardLink>
              Próximamente
            </CardLink>
          </Card>
        </Grid>

      </DashboardContainer>

    </Layout>
  );
}