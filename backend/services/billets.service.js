import { axiosAgent } from './axios.service'; // Assurez-vous que axiosAgent est bien configuré dans axios.service.js

/**
 * Envoie une requête POST pour créer un billet.
 *
 * @param {Object} payload - Les données du billet à créer.
 * @returns {Promise<Object>} - La réponse contenant le message de succès ou les données du billet.
 */
async function createBillet(payload) {
    try {
        const response = await axiosAgent.post('/billets', payload);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du billet :", error);
        throw error;
    }
}

export { createBillet };
