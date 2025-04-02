import { axiosAgent } from './axios.service';

/**
 * Récupère les billets d'un utilisateur.
 */
async function fetchBillets(userId) {
    try {
        const response = await axiosAgent.get(`/profil/${userId}/billets`);
        return response.data;
    } catch (error) {
        console.error('Erreur fetchBillets :', error);
        throw error;
    }
}

/**
 * Récupère les activités auxquelles l'utilisateur est inscrit.
 */
async function fetchActivites(userId) {
    try {
        const response = await axiosAgent.get(`/profil/${userId}/activites`);
        return response.data;
    } catch (error) {
        console.error('Erreur fetchActivites :', error);
        throw error;
    }
}

/**
 * Récupère les réservations de service d'un utilisateur.
 */
async function fetchReservations(userId) {
    try {
        const response = await axiosAgent.get(`/profil/${userId}/reservations`);
        return response.data;
    } catch (error) {
        console.error('Erreur fetchReservations :', error);
        throw error;
    }
}

export default { fetchBillets, fetchActivites, fetchReservations };
