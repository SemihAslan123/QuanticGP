import api from './api';

export default {
    // Récupère la liste des avis
    async getAvis() {
        const response = await api.get('/livreDor');
        return response.data;
    },

    // Soumet un nouvel avis
    async submitAvis(payload) {
        const response = await api.post('/livreDor', payload);
        return response.data;
    }
};
