import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { EmotionContext } from '../context/EmotionContext';

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

const EmotionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmotionCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EmotionName = styled.span`
  font-weight: bold;
  text-transform: capitalize;
  
  &.happy { color: #27ae60; }
  &.sad { color: #2980b9; }
  &.angry { color: #c0392b; }
  &.anxious { color: #f39c12; }
  &.neutral { color: #7f8c8d; }
`;

const EmotionIntensity = styled.div`
  margin: 0.5rem 0;
  
  span {
    font-size: 0.9rem;
    color: #7f8c8d;
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const EmotionsSummary = () => {
  const { emotions, loading, getEmotionsSummary } = useContext(EmotionContext);

  // Fetch emotions on component mount
  useEffect(() => {
    getEmotionsSummary();
  }, []);

  const translateEmotion = (emotion) => {
    const translations = {
      happy: "Feliz",
      sad: "Triste",
      angry: "Enojado",
      anxious: "Ansioso",
      neutral: "Neutral"
    };
    return translations[emotion] || emotion;
  };

  return (
    <HistoryContainer>
      {loading ? (
        <p>Cargando...</p>
      ) : emotions.length === 0 ? (
        <EmptyState>No hay emociones registradas aún. ¡Comienza a hacer seguimiento de tus emociones arriba!</EmptyState>
      ) : (
        <EmotionList>
          {emotions.map((emotion) => (
            <EmotionCard key={emotion.id || emotion._id}>
              <EmotionName className={emotion.emotion}>
                {translateEmotion(emotion.emotion)}
              </EmotionName>

              <EmotionIntensity>
                Intensidad: <span>{emotion.intensity}/10</span>
              </EmotionIntensity>
            </EmotionCard>
          ))}
        </EmotionList>
      )}
    </HistoryContainer>
  );
};

export default EmotionsSummary;