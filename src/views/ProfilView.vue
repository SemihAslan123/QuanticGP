<template>
  <div class="espace-au-dessus">
    <div class="billet-container">
      <h1>Vos Billets</h1>
      <div v-if="loading" class="loading">
        Chargement en cours...
      </div>
      <div v-else-if="billets.length === 0" class="no-billets">
        <p>Aucun billet trouvé pour votre compte.</p>
      </div>
      <div v-else class="billets-list">
        <div class="billet-card" v-for="billet in billets" :key="billet.id_billet">
          <h2>Billet #{{ billet.id_billet }}</h2>
          <p><strong>Course :</strong> {{ billet.course_nom || 'Non spécifiée' }}</p>
          <p><strong>Hôtel :</strong> {{ billet.hotel_nom || 'Non spécifié' }}</p>
          <p><strong>Date de début du parking :</strong> {{ billet.date_debut_parking || 'Non spécifiée' }}</p>
          <p><strong>Date de fin du parking :</strong> {{ billet.date_fin_parking || 'Non spécifiée' }}</p>
          <p><strong>VIP :</strong> {{ billet.is_vip ? 'Oui' : 'Non' }}</p>
          <p><strong>Prix total :</strong> {{ billet.prix_total }} €</p>
          <p><strong>Date de paiement :</strong> {{ billet.date_paiement | formatDate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserBilletsView',
  data() {
    return {
      billets: [],
      loading: true,
    };
  },
  created() {
    this.fetchBillets();
  },
  methods: {
    async fetchBillets() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        this.$router.push({ name: 'Login' });
        return;
      }
      console.log(user.id);
      try {
        const response = await axios.get(`http://localhost:3001/profil/${user.id}/billets`);
        this.billets = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des billets :', error);
        alert('Une erreur est survenue lors de la récupération de vos billets.');
      } finally {
        this.loading = false;
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
