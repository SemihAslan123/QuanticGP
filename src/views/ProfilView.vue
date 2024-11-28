<template>
  <div class="profil-container">
    <div class="profil-box">
      <h2>Profil de {{ user?.prenom || "Utilisateur" }}</h2>
      <div v-if="user">
        <div class="profil-info">
          <p><strong>Nom:</strong> {{ user.nom }}</p>
          <p><strong>Prénom:</strong> {{ user.prenom }}</p>
          <p><strong>Email:</strong> {{ user.mail }}</p>
          <p><strong>Type:</strong> {{ user.type }}</p>
        </div>

        <div v-if="user.type === 'client'" class="billet-info">
          <h3>Billets</h3>
          <ul>
            <li v-for="billet in billets" :key="billet.id">
              {{ billet.course_nom }} - {{ billet.hotel_nom }} - {{ billet.date_debut_parking }} au {{ billet.date_fin_parking }} - Prix: {{ billet.prix_total }} €
            </li>
          </ul>
        </div>

        <!-- Détails des services si l'utilisateur est un prestataire -->
        <div v-if="user.type === 'prestataire'" class="service-info">
          <h3>Services</h3>
          <ul>
            <li v-for="service in services" :key="service.id_service">
              {{ service.nom_service }} - {{ service.type_service }} - Date: {{ service.date_service }} à {{ service.heure_service }}
            </li>
          </ul>
        </div>
      </div>
      <button class="logout-button" @click="logout">Se déconnecter</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      billets: [],
      services: [],
    };
  },
  mounted() {
    this.fetchUserProfile();
  },
  methods: {
    // Récupérer les informations de l'utilisateur
    async fetchUserProfile() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        this.user = user;
        // Récupérer les billets de l'utilisateur
        if (this.user.type === 'client') {
          await this.fetchBillets();
        }
        // Récupérer les services si l'utilisateur est un prestataire
        if (this.user.type === 'prestataire') {
          await this.fetchServices();
        }
      }
    },

    // Récupérer les billets pour l'utilisateur
    async fetchBillets() {
      const response = await fetch(`http://localhost:3001/billets/${this.user.id}`);
      const data = await response.json();
      if (data.success) {
        this.billets = data.billets;
      } else {
        console.error('Erreur lors de la récupération des billets');
      }
    },

    // Récupérer les services pour le prestataire
    async fetchServices() {
      const response = await fetch(`http://localhost:3001/services/${this.user.id}`);
      const data = await response.json();
      if (data.success) {
        this.services = data.services;
      } else {
        console.error('Erreur lors de la récupération des services');
      }
    },

    logout() {
      localStorage.removeItem("user");
      this.$router.push('/login'); // Rediriger vers la page de connexion
    }
  },
};
</script>

<style scoped>
/* Conteneur de la page de profil */
.profil-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

/* Cadre de la boîte de profil */
.profil-box {
  background: #f0ebeb;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.profil-info p {
  font-weight: bold;
  margin-bottom: 10px;
}

.billet-info, .service-info {
  margin-top: 20px;
}

.billet-info ul, .service-info ul {
  list-style-type: none;
  padding: 0;
}

.logout-button {
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  border-radius: 5px;
}

.logout-button:hover {
  background-color: #e5533c;
}
</style>
