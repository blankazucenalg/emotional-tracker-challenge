import styled from 'styled-components';

const HistoryContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem 0;
`;

const EmptyState = styled.p`
  color: #7f8c8d;
  text-align: center;
  font-style: italic;
`;

const EmotionList = styled.div`
  display: flex;
  flex-direction: row;
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

const EmotionDatum = styled.div`
  margin: 0.1rem 0;
  
  span {
    font-size: 0.9rem;
    color: #7f8c8d;
  }
`;

const EmotionDate = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const EmotionsSummary = ({ data }) => {

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
      {data.length === 0 ? (
        <EmptyState>No hay emociones registradas aún. ¡Comienza a hacer seguimiento de tus emociones arriba!</EmptyState>
      ) : (
        <EmotionList>
          {data.map((emotion) => (
            <EmotionCard key={emotion.id || emotion._id}>
              <EmotionName className={emotion.emotion}>
                {translateEmotion(emotion.emotion)}
              </EmotionName>

              <EmotionDatum>
                Veces registrada: <span>{emotion.count}</span>
              </EmotionDatum>

              <EmotionDatum>
                Intensidad promedio: <span>{emotion.averageIntensity.toLocaleString()}/10</span>
              </EmotionDatum>

              <EmotionDate>Última vez registrada: {formatDate(emotion.lastDate)}</EmotionDate>
            </EmotionCard>
          ))}
        </EmotionList>
      )}
    </HistoryContainer>
  );
};

export default EmotionsSummary;