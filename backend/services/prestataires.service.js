import { axiosAgent } from './axios.service';

export default {
    async fetchServicesForClient() {
        try {
            const response = await axiosAgent.get('/prestataire/services');
            return response.data;
        } catch (error) {
            console.error('Erreur fetchServicesForClient :', error);
            throw error;
        }
    },
    async fetchServicesForPrestataire(userId) {
        try {
            const response = await axiosAgent.get(`/prestataire/${userId}/services`);
            return response.data;
        } catch (error) {
            console.error('Erreur fetchServicesForPrestataire :', error);
            throw error;
        }
    },
    async updateProfile(prestataireData) {
        try {
            const response = await axiosAgent.post('/prestataire/update', prestataireData);
            return response.data;
        } catch (error) {
            console.error('Erreur updateProfile :', error);
            throw error;
        }
    },
    async requestService(serviceData) {
        try {
            const response = await axiosAgent.post('/prestataire/service/request', serviceData);
            return response.data;
        } catch (error) {
            console.error('Erreur requestService :', error);
            throw error;
        }
    },
    async deleteService(serviceId) {
        try {
            const response = await axiosAgent.delete(`/prestataire/service/${serviceId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur deleteService :', error);
            throw error;
        }
    },
    async deleteServiceRequest(serviceId) {
        try {
            const response = await axiosAgent.delete(`/prestataire/service/request/${serviceId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur deleteServiceRequest :', error);
            throw error;
        }
    },
    async fetchAvailableEmplacements(searchParams) {
        try {
            const response = await axiosAgent.get('/prestataire/emplacements/available', { params: searchParams });
            return response.data;
        } catch (error) {
            console.error('Erreur fetchAvailableEmplacements :', error);
            throw error;
        }
    },
    async requestEmplacementReservation(reservationData) {
        try {
            const response = await axiosAgent.post('/prestataire/emplacements/reservation', reservationData);
            return response.data;
        } catch (error) {
            console.error('Erreur requestEmplacementReservation :', error);
            throw error;
        }
    },
    async fetchMyEmplacementReservations(userId) {
        try {
            const response = await axiosAgent.get(`/prestataire/emplacements/myrequests/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur fetchMyEmplacementReservations :', error);
            throw error;
        }
    },
    async cancelEmplacementReservation(emplacementId) {
        try {
            const response = await axiosAgent.delete(`/prestataire/emplacements/reservation/${emplacementId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur cancelEmplacementReservation :', error);
            throw error;
        }
    },
    async fetchValidatedEmplacements(userId) {
        try {
            const response = await axiosAgent.get(`/prestataire/emplacements/validated/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Erreur fetchValidatedEmplacements :', error);
            throw error;
        }
    },
    async updateService(serviceData) {
        try {
            const response = await axiosAgent.post('/prestataire/service/update', serviceData);
            return response.data;
        } catch (error) {
            console.error('Erreur updateService :', error);
            throw error;
        }
    }
};
