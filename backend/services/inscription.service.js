import { axiosAgent } from './axios.service';

export default {
    async register(userData) {
        // userData contient les champs requis pour l'inscription
        const response = await axiosAgent.post('/inscription', userData);
        return response.data;
    }
};
