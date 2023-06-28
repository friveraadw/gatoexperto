import axios from 'axios';

const API_URL = 'https://backend-ecommerce-chi.vercel.app/';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data.token;
  } catch (error) {
    throw error.response.data.error;
  }
};
