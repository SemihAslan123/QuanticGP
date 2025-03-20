// frontend/src/services/organisationService.js
import api from './api';

export default {
    // Événements
    async getEvents() {
        const response = await api.get('/organisation/events');
        return response.data;
    },
    async createEvent(eventData) {
        const response = await api.post('/organisation/', eventData);
        return response.data;
    },
    async updateEvent(eventId, eventData) {
        const response = await api.put(`/organisation/events/${eventId}`, eventData);
        return response.data;
    },
    async deleteEvent(eventId) {
        const response = await api.delete(`/organisation/events/${eventId}`);
        return response.data;
    },

    // Réservations de services
    async getReservations() {
        const response = await api.get('/organisation/stands');
        return response.data;
    },
    async updateReservationStatus(reservationId, newStatus) {
        const response = await api.patch(`/organisation/stands/${reservationId}`, { statut: newStatus });
        return response.data;
    },
    async deleteReservation(reservationId) {
        const response = await api.delete(`/organisation/stands/${reservationId}`);
        return response.data;
    },

    // Réservations d'emplacements
    async getStandReservations() {
        const response = await api.get('/organisation/stand-reservations');
        return response.data;
    },
    async updateStandStatus(standId, newStatus) {
        const response = await api.patch(`/organisation/stand-reservations/${standId}`, { statut: newStatus });
        return response.data;
    },
    async deleteStandReservation(standId) {
        const response = await api.delete(`/organisation/stand-reservations/${standId}`);
        return response.data;
    },
    // Tous les stands
    async getAllStands() {
        const response = await api.get('/organisation/all-stands');
        return response.data;
    },

    // Prestataires
    async getPrestataires() {
        const response = await api.get('/organisation/prestataires');
        return response.data;
    },
    async updatePrestataire(prestataireId, newType) {
        const response = await api.patch(`/organisation/prestataires/${prestataireId}`, { type_utilisateur: newType });
        return response.data;
    },

    // Statistiques
    async getStatistics() {
        const response = await api.get('/organisation/statistics');
        return response.data;
    },
};