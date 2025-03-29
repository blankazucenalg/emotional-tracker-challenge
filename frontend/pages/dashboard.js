import Cookie from 'js-cookie';
import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import EmotionsComposition from '../components/EmotionsComposition';
import EmotionsHighlight from '../components/EmotionsHighlight';
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

const FilterSet = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.7rem;
`;

export default function Dashboard() {
  const MIN_DATE = '2025-01-01';
  const MAX_DATE = moment().format('YYYY-MM-DD');

  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    dateStart: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    dateEnd: moment().format('YYYY-MM-DD'),
  });
  const [emotionsSummary, setEmotionsSummary] = useState([]);
  const [emotionsComposition, setEmotionsComposition] = useState([]);
  const [emotionsHighlight, setEmotionsHighlight] = useState({});

  async function getEmotionsComposition(token, form) {
    const response = await fetch(`http://localhost:5050/api/emotions/analytics/highlights?dateStart=${form.dateStart}&dateEnd=${form.dateEnd}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to submit the data. Please try again.')
    }

    const data = await response.json();
    return data;
  }

  async function getEmotionsSummary(token, form) {
    const response = await fetch(`http://localhost:5050/api/emotions/analytics/summary?dateStart=${form.dateStart}&dateEnd=${form.dateEnd}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to submit the data. Please try again.')
    }

    const data = await response.json();
    console.log(data);
    return data;
  }

  async function getData() {
    setIsLoading(true);
    setError(null);
    try {

      const token = Cookie.get('token');

      if (!token) {
        setEmotionsHighlight([]);
        setEmotionsSummary([]);
        setEmotionsComposition([]);
        setIsLoading(false);
        return;
      }

      console.log(form);

      const emotionsSummaryRes = await getEmotionsSummary(token, form);
      emotionsSummaryRes.sort((a, b) => a.lastDate > b.lastDate ? -1 : 1);
      setEmotionsSummary(emotionsSummaryRes);

      const emotionCompositionRes = await getEmotionsComposition(token, form);
      setEmotionsComposition(emotionCompositionRes);

      const emotionsHighlightRes = emotionCompositionRes[0];
      setEmotionsHighlight(emotionsHighlightRes);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    getData();
  }

  // Basic auth protection
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    getData();
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

          <FilterSet>
            <form onSubmit={handleSubmit}>
              <input type='date' id="dateStart" name="dateStart" min={MIN_DATE} value={form.dateStart} onChange={handleChange} max={form.dateEnd} />
              <input type='date' id="dateEnd" name="dateEnd" max={MAX_DATE} value={form.dateEnd} onChange={handleChange} min={form.dateStart} />
              <input type='submit' value="Seleccionar fechas" />
            </form>
          </FilterSet>
          <div>

            {loading || isLoading ? (<p>Cargando... </p>
            ) : error ? (
              <p>{error.message}</p>
            ) : (
              <>
                <EmotionsSummary data={emotionsSummary} />
                <EmotionsComposition data={emotionsComposition} />
                <EmotionsHighlight data={emotionsHighlight} />
              </>
            )}
          </div>
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