import { createContext, useState } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5050/api';

export const EmotionContext = createContext();

export const EmotionProvider = ({ children }) => {
  const [emotionsSummary, setEmotionsSummary] = useState([]);
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all emotions (client-side only, not using getServerSideProps)
  // TODO: Implement server-side fetching
  const getEmotions = async () => {
    try {
      setLoading(true);
      const token = Cookie.get('token');

      if (!token) {
        setEmotions([]);
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/emotions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setEmotions(res.data);
    } catch (error) {
      console.error('Error fetching emotions');
    } finally {
      setLoading(false);
    }
  };

  // Add a new emotion entry (frontend only, not connected to backend)
  const addEmotion = (emotionData) => {
    // This will be lost on page refresh
    const newEmotion = {
      id: Date.now().toString(),
      ...emotionData,
      date: new Date().toISOString()
    };

    setEmotions(prev => [newEmotion, ...prev]);

    // TODO: Connect to backend API
  };

  const getEmotionsSummary = async () => {
    try {
      setLoading(true);
      const token = Cookie.get('token');

      if (!token) {
<<<<<<< Updated upstream
        setEmotions([]);
=======
        setEmotionsSummary([]);
>>>>>>> Stashed changes
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/emotions/analytics/summary`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

<<<<<<< Updated upstream
      setEmotions(res.data);
=======
      setEmotionsSummary(res.data);
>>>>>>> Stashed changes
    } catch (error) {
      console.error('Error fetching emotions summary');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
  const shareWithTherapist = async (emotionIds) => {
    // TODO: Implement sharing with therapist
    console.log('Sharing emotions with therapist:', emotionIds);
  };

  return (
    <EmotionContext.Provider
      value={{
        emotions,
        loading,
        getEmotions,
        addEmotion,
        getEmotionsSummary,
<<<<<<< Updated upstream
=======
        emotionsSummary,
>>>>>>> Stashed changes
        shareWithTherapist
      }}
    >
      {children}
    </EmotionContext.Provider>
  );
};