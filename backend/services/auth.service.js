import { axiosAgent } from './axios.service';

/**
 * Envoie une requête POST à /login pour authentifier l'utilisateur.
 *
 * @param {string} email - L'email de l'utilisateur.
 * @param {string} password - Le mot de passe de l'utilisateur.
 * @returns {Promise<Object>} - Les données retournées par l'API.
 */
async function login(email, password) {
    try {
        const response = await axiosAgent.post('/login', { email, password });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            return { success: false, error: error.response.data.error };
        } else {
            return { success: false, error: 'Erreur lors de la connexion' };
        }
    }
}

export { login };
