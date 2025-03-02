// src/services/prestataires.js
import api from './api';

export default {
  async fetchServicesForClient() {
    try {
      const response = await api.get('/prestataire/services');
      return response.data;
    } catch (error) {
      console.error('Erreur fetchServicesForClient :', error);
      throw error;
    }
  },
  async fetchServicesForPrestataire(userId) {
    try {
      const response = await api.get(`/prestataire/${userId}/services`);
      return response.data;
    } catch (error) {
      console.error('Erreur fetchServicesForPrestataire :', error);
      throw error;
    }
  },
  async updateProfile(prestataireData) {
    try {
      const response = await api.post('/prestataire/update', prestataireData);
      return response.data;
    } catch (error) {
      console.error('Erreur updateProfile :', error);
      throw error;
    }
  }
};
