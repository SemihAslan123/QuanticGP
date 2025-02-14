// frontend/src/services/inscriptionService.js

import api from './api';

export default {
    async register(userData) {
        // userData contient les champs requis pour l'inscription
        const response = await api.post('/inscription', userData);
        return response.data;
    }
};
