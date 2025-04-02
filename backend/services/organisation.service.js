import { axiosAgent } from './axios.service';

export default {
    // Événements
    async getEvents() {
        const response = await axiosAgent.get('/organisation/events');
        return response.data;
    },
    async createEvent(eventData) {
        const response = await axiosAgent.post('/organisation/', eventData);
        return response.data;
    },
    async updateEvent(eventId, eventData) {
        const response = await axiosAgent.put(`/organisation/events/${eventId}`, eventData);
        return response.data;
    },
    async deleteEvent(eventId) {
        const response = await axiosAgent.delete(`/organisation/events/${eventId}`);
        return response.data;
    },

    // Réservations de services prestataires
    async getReservations() {
        const response = await axiosAgent.get('/organisation/stands');
        return response.data;
    },
    async updateReservationStatus(reservationId, newStatus) {
        // On appelle le nouvel endpoint pour les réservations de service
        const response = await axiosAgent.patch(`/organisation/service-reservations/${reservationId}`, { statut: newStatus });
        return response.data;
    },
    async deleteReservation(reservationId) {
        const response = await axiosAgent.delete(`/organisation/stands/${reservationId}`);
        return response.data;
    },

    // Réservations d'emplacements
    async getStandReservations() {
        const response = await axiosAgent.get('/organisation/stand-reservations');
        return response.data;
    },
    async updateStandStatus(standId, newStatus) {
        const response = await axiosAgent.patch(`/organisation/stand-reservations/${standId}`, { statut: newStatus });
        return response.data;
    },
    async deleteStandReservation(standId) {
        const response = await axiosAgent.delete(`/organisation/stand-reservations/${standId}`);
        return response.data;
    },
    async getAllStands() {
        const response = await axiosAgent.get('/organisation/all-stands');
        return response.data;
    },

    // Prestataires
    async getPrestataires() {
        const response = await axiosAgent.get('/organisation/prestataires');
        return response.data;
    },
    async updatePrestataire(prestataireId, newType) {
        const response = await axiosAgent.patch(`/organisation/prestataires/${prestataireId}`, { type_utilisateur: newType });
        return response.data;
    },

    // Statistiques
    async getStatistics() {
        const response = await axiosAgent.get('/organisation/statistics');
        return response.data;
    },

    // Demande prestataire
    async getDemandes() {
        const response = await axiosAgent.get('/organisation/demandes-prestataires');
        return response.data;
    },
    async traiterDemande(id, data) {
        const response = await axiosAgent.post(`/organisation/demandes-prestataires/${id}`, data);
        return response.data;
    },
    async deleteDemande(id) {
        const response = await axiosAgent.delete(`/organisation/demandes-prestataires/${id}`);
        return response.data;
    },
};
