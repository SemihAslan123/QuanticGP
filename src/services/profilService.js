import api from './api';

export default {
    async fetchBillets(userId) {
        try {
            const response = await api.get(`/profil/${userId}/billets`);
            return response.data;
        } catch (error) {
            console.error('Erreur fetchBillets :', error);
            throw error;
        }
    },
    async fetchActivites(userId) {
        try {
            const response = await api.get(`/profil/${userId}/activites`);
            return response.data;
        } catch (error) {
            console.error('Erreur fetchActivites :', error);
            throw error;
        }
    }
};
