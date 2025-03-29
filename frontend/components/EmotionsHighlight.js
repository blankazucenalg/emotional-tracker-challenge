import styled from "styled-components";

const EmotionName = styled.span`
  font-weight: bold;
  text-transform: capitalize;
  
  &.happy { color: #27ae60; }
  &.sad { color: #2980b9; }
  &.angry { color: #c0392b; }
  &.anxious { color: #f39c12; }
  &.neutral { color: #7f8c8d; }
`;

const EmptyState = styled.p`
  color: #7f8c8d;
  text-align: center;
  font-style: italic;
`;

const EmotionHighlight = styled.div`
`;

const EmotionsHighlight = ({ data }) => {

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

  return <EmotionHighlight>
    {(!data || !data.emotion) ? (
      <EmptyState>No hay emociones registradas en ese rango de fechas</EmptyState>
    ) : (<p>En este tiempo hemos notado que estuviste mayormente <EmotionName className={data.emotion}>{translateEmotion(data.emotion)}</EmotionName>, pues lo registraste {data.count} veces y ha tenido una intensidad promedio de {data.averageIntensity.toLocaleString()}/10</p>)
    }
  </EmotionHighlight>;
}

export default EmotionsHighlight;