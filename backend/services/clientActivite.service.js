import { axiosAgent } from './axios.service';

export default {
    // Récupérer les événements
    async getActivities() {
        try {
            const response = await axiosAgent.get('/clientActivite');
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des activités:', error);
            throw error;
        }
    },

    // Processus de paiement : inscription aux activités
    async processPayment(paymentData) {
        try {
            const response = await axiosAgent.post('/clientActivite/payment', paymentData);
            return response.data;
        } catch (error) {
            console.error('Erreur lors du paiement des activités:', error);
            throw error;
        }
    }
};
