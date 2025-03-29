import { createContext, useState } from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5050/api';

export const EmotionContext = createContext();

export const EmotionProvider = ({ children }) => {
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
  const addEmotion = async (emotionData) => {
    try {
      setLoading(true);
      const token = Cookie.get('token');
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await axios.post(`${API_URL}/emotions`, emotionData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (res.data) {
        const newEmotion = {
          id: res.data._id,
          ...res.data,
        };
        setEmotions(prev => [newEmotion, ...prev]);
      }
    } catch (err) {
      console.error(err);
      alert('Failed posting emotion');
    } finally {
      setLoading(false);
    }
  };

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
        shareWithTherapist,
      }}
    >
      {children}
    </EmotionContext.Provider>
  );
};