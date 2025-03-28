import { axiosAgent } from './axios.service';

export default {
    async getEvents() {
        try {
            const response = await axiosAgent.get('/clientActivite');
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des événements :", error);
            throw error;
        }
    },
};
