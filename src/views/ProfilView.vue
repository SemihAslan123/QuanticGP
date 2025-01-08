<template>
  <div class="espace-au-dessus">
    <div class="billet-container">
      <h1>Vos Billets</h1>
      <div v-if="billets.length === 0" class="no-billets">
        <p>Vous n'avez acheté aucun billet pour le moment.</p>
      </div>
      <div v-else class="billets-list">
        <div class="billet-card" v-for="billet in billets" :key="billet.id">
          <h2>Billet #{{ billet.id }}</h2>
          <p><strong>Course :</strong> {{ billet.course_nom || 'Non spécifiée' }}</p>
          <p v-if="billet.hotel_nom"><strong>Hôtel :</strong> {{ billet.hotel_nom || 'Non spécifié' }}</p>
          <p v-if="billet.date_debut_parking"><strong>Date de début du parking :</strong> {{ billet.date_debut_parking | formatDate }}</p>
          <p v-if="billet.date_fin_parking"><strong>Date de fin du parking :</strong> {{ billet.date_fin_parking | formatDate }}</p>
          <p v-if="billet.date_debut_hotel"><strong>Date de début de l'hôtel :</strong> {{ billet.date_debut_hotel | formatDate }}</p>
          <p v-if="billet.date_fin_hotel"><strong>Date de fin de l'hôtel :</strong> {{ billet.date_fin_hotel | formatDate }}</p>
          <p><strong>VIP :</strong> {{ billet.is_vip ? 'Oui' : 'Non' }}</p>
          <p><strong>Prix total :</strong> {{ billet.prix_total }} €</p>
          <p><strong>Date de paiement :</strong> {{ billet.date_paiement | formatDate }}</p>
        </div>
      </div>
    </div>
    <button class="logout-button" @click="logout">Se déconnecter</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserBilletsView',
  data() {
    return {
      billets: [], // Initialiser billets comme un tableau vide
    };
  },
  created() {
    this.fetchBillets();
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.isLoggedIn = false;
      this.user = null;
      window.location.reload()
    },
    async fetchBillets() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        this.$router.push({ name: 'Login' });
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/profil/${user.id}/billets`);
        this.billets = response.data; // Réponse attendue : une liste de billets, ou une liste vide
      } catch (error) {
        console.error('Erreur lors de la récupération des billets :', error);
        // Pas besoin de message d'alerte, on gère uniquement l'affichage
        this.billets = [];
      }
    },
  },
  filters: {
    formatDate(value) {
      if (!value) return 'Non spécifiée';
      const date = new Date(value);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
};
</script>


<style scoped>
.espace-au-dessus {
  padding-top: 90px;
}

/* Bouton de déconnexion */
.logout-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #f44336;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 300px;
}

.logout-button:hover {
  background-color: #e53935;
}

.billet-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: #3498db;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  font-size: 1.2em;
  color: #999;
}

.no-billets {
  text-align: center;
  font-size: 1.2em;
  color: #e74c3c;
}

.billets-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.billet-card {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.billet-card h2 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.billet-card p {
  margin: 5px 0;
  color: #34495e;
  font-size: 1em;
}
</style>
