// src/backend/services/axios.service.js
import axios from 'axios';


const axiosAgent = axios.create({
  baseURL: 'http://localhost:3000/api',
});


// intercepteur pour gérer les réponses
axiosAgent.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);


/**
 * Fonction utilitaire pour les requêtes GET.
 * Elle renvoie directement la donnée contenue dans response.data.
 */
async function getRequest(uri, config = {}) {
  try {
    const response = await axiosAgent.get(uri, config);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la requête GET :", error);
    throw error;
  }
}


export { axiosAgent, getRequest };
