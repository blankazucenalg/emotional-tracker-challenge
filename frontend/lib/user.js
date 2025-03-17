const { getToken } = require("../utils/authUtils");

const API_URL = 'http://localhost:5050/api';

async function getUserProfile() {
  const token = Cookie.get('token');
  let user;
  if (token) {
    try {
      const res = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      user = res.data;
    } catch (error) {
      Cookie.remove('token');
      user = null;
    }
  } else {
    user = null;
  }
  return user;
}

export default {
  getUserProfile
}