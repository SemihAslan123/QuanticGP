// frontend/src/services/authService.js

import api from './api';

export default {
  async login(email, password) {
    try {
      const response = await api.post('/login', { email, password });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        return { success: false, error: error.response.data.error };
      } else {
        return { success: false, error: 'Erreur lors de la connexion' };
      }
    }
  },
};
