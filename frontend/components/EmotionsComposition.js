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
  gap: 0;
`;

const EmotionCard = styled.div`
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  height: 60px;
  justify-content: center;

  &.happy { background-color: #27ae60; }
  &.sad { background-color: #2980b9; }
  &.angry { background-color: #c0392b; }
  &.anxious { background-color: #f39c12; }
  &.neutral { background-color: #7f8c8d; }
`;

const EmotionPart = styled.div`
  font-weight: bold;
  text-transform: capitalize;
  text-align:center;
  display: flex;
  flex-direction: column;
`;

const EmotionPercentage = styled.span`
  color:rgb(36, 37, 37);
  font-size: 0.8rem;
`;

const EmotionsComposition = ({ data }) => {

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
            <EmotionCard key={emotion.id || emotion._id} className={emotion.emotion} style={{ width: `${emotion.percentage}%` }}>
              <EmotionPart>
                <span>{translateEmotion(emotion.emotion)}</span>
                <EmotionPercentage>{emotion.percentage.toLocaleString()}%</EmotionPercentage>
              </EmotionPart>
            </EmotionCard>
          ))}
        </EmotionList>
      )}
    </HistoryContainer>
  );
};

export default EmotionsComposition;