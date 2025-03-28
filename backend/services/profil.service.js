import { axiosAgent } from './axios.service';

/**
 * Récupère les billets d'un utilisateur.
 *
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<Object[]>} - La liste des billets.
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
 *
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<Object[]>} - La liste des activités.
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

export default { fetchBillets, fetchActivites };
