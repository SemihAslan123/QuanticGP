import { axiosAgent } from './axios.service';

export default {
    // Récupère la liste des avis
    async getAvis() {
        const response = await axiosAgent.get('/livreDor');
        return response.data;
    },

    // Soumet un nouvel avis
    async submitAvis(payload) {
        const response = await axiosAgent.post('/livreDor', payload);
        return response.data;
    }
};
