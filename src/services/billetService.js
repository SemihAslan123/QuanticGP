import api from './api';

export default {
    async createBillet(payload) {
        const response = await api.post('/billets', payload);
        return response.data;
    },
};
