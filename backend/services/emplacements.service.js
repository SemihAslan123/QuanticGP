// src/services/emplacements.service.js
import { getRequest } from './axios.service';


async function getEmplacementsPrestataires() {

  return getRequest('/emplacements');
}

export { getEmplacementsPrestataires };
