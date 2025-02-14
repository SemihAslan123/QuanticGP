// frontend/src/services/authService.js

import api from './api';

export default {
    async login(email, password) {
        const response = await api.post('/login', { email, password });
        return response.data;
    },
};
