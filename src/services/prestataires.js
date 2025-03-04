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
  },
  async requestService(serviceData) {
    try {
      const response = await api.post('/prestataire/service/request', serviceData);
      return response.data;
    } catch (error) {
      console.error('Erreur requestService :', error);
      throw error;
    }
  },
  async fetchAvailableEmplacements(searchParams) {
    try {
      const response = await api.get('/prestataire/emplacements/available', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Erreur fetchAvailableEmplacements :', error);
      throw error;
    }
  },
  async requestEmplacementReservation(reservationData) {
    try {
      const response = await api.post('/prestataire/emplacements/reservation', reservationData);
      return response.data;
    } catch (error) {
      console.error('Erreur requestEmplacementReservation :', error);
      throw error;
    }
  },
  async fetchMyEmplacementReservations(userId) {
    try {
      const response = await api.get(`/prestataire/emplacements/myrequests/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur fetchMyEmplacementReservations :', error);
      throw error;
    }
  },
  async cancelEmplacementReservation(emplacementId) {
    try {
      const response = await api.delete(`/prestataire/emplacements/reservation/${emplacementId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur cancelEmplacementReservation :', error);
      throw error;
    }
  },
  async fetchValidatedEmplacements(userId) {
    try {
      const response = await api.get(`/prestataire/emplacements/validated/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur fetchValidatedEmplacements :', error);
      throw error;
    }
  }
};
