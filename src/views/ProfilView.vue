<template>
  <div class="page-container">

    <!-- Nouveau Bloc Planning -->
    <section class="section-container planning-section">
      <h1>Votre Planning</h1>
      <div>
        <Calendar />
      </div>
    </section>

    <!-- Bloc Billets -->
    <section class="section-container billets-section">
      <h1>Vos Billets</h1>
      <div v-if="billets.length === 0" class="no-items">
        <p>Vous n'avez acheté aucun billet pour le moment.</p>
      </div>
      <div v-else class="cards-grid">
        <div class="card" v-for="billet in billets" :key="billet.id">
          <h2>Billet #{{ billet.id }}</h2>
          <div class="card-details">
            <p><strong>Course :</strong> {{ billet.course_nom || 'Non spécifiée' }}</p>
            <p v-if="billet.course_date">
              <strong>Date de la course :</strong> {{ billet.course_date | formatDate }}
            </p>
            <p v-if="billet.hotel_nom"><strong>Hôtel :</strong> {{ billet.hotel_nom }}</p>
            <p v-if="billet.date_debut_parking">
              <strong>Parking :</strong> {{ billet.date_debut_parking | formatDate }} -
              {{ billet.date_fin_parking | formatDate }}
            </p>
            <p v-if="billet.date_debut_hotel">
              <strong>Hôtel :</strong> {{ billet.date_debut_hotel | formatDate }} -
              {{ billet.date_fin_hotel | formatDate }}
            </p>
            <p><strong>VIP :</strong> {{ billet.is_vip ? 'Oui' : 'Non' }}</p>
            <p><strong>Prix :</strong> {{ billet.prix_total }} €</p>
            <p><strong>Date de paiement :</strong> {{ billet.date_paiement | formatDate }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bloc Activités -->
    <section class="section-container activites-section">
      <h1>Vos Activités</h1>
      <div v-if="activites.length === 0" class="no-items">
        <p>Vous n'êtes inscrit à aucune activité pour le moment.</p>
      </div>
      <div v-else class="cards-grid">
        <div class="card" v-for="activite in activites" :key="activite.id">
          <h2>{{ activite.name }}</h2>
          <div class="card-details">
            <p><strong>Date :</strong> {{ activite.date | formatDate }}</p>
            <p><strong>Heure :</strong> {{ activite.heure_debut }} - {{ activite.heure_fin }}</p>
            <p><strong>Prix :</strong> {{ activite.prix }} €</p>
            <p><strong>Description :</strong> {{ activite.description }}</p>
            <img v-if="activite.image" :src="activite.image" alt="Image de l'activité" class="activite-image"/>
          </div>
        </div>
      </div>
    </section>

    <!-- Déconnexion -->
    <button class="logout-button" @click="logout">Se déconnecter</button>
  </div>
</template>

<script>
import userService from '@/services/profilService';
import Calendar from "@/components/CalendarVue.vue";

export default {
  name: 'UserBilletsView',
  components: { Calendar },
  data() {
    return {
      billets: [],
      activites: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        // Rediriger si pas connecté
        this.$router.push({ name: 'Login' });
        return;
      }
      try {
        const [billets, activites] = await Promise.all([
          userService.fetchBillets(user.id),
          userService.fetchActivites(user.id)
        ]);
        this.billets = billets;
        this.activites = activites;
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      }
    },
    logout() {
      localStorage.removeItem("user");
      window.location.reload();
    }
  },
  computed: {
    // Fusionne billets et activites en ajoutant une propriété "planningDate"
    mergedPlanning() {
      const planningItems = [];

      // Pour les activités, on utilise directement la date de l'événement
      this.activites.forEach(act => {
        planningItems.push({
          ...act,
          type: 'activite',
          planningDate: act.date
        });
      });

      // Pour les billets, on utilise course_date (si présente) sinon la date de paiement
      this.billets.forEach(b => {
        const planningDate = b.course_date || b.date_paiement;
        planningItems.push({
          ...b,
          type: 'billet',
          planningDate
        });
      });

      // Tri par date croissante
      planningItems.sort((a, b) => new Date(a.planningDate) - new Date(b.planningDate));
      return planningItems;
    },
    // Regroupe les éléments fusionnés par jour (clé formatée en YYYY-MM-DD)
    groupedPlanning() {
      const groups = {};
      this.mergedPlanning.forEach(item => {
        if (!item.planningDate) return;
        const dateKey = new Date(item.planningDate).toISOString().split('T')[0];
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(item);
      });
      // Conversion de l'objet en tableau trié par date
      return Object.keys(groups)
          .sort()
          .map(date => ({ date, items: groups[date] }));
    }
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
    }
  }
};
</script>

<style scoped>
.page-container {
  padding: 50px;
  max-width: 1200px;
  margin: 50px auto;
}

h1 {
  font-size: 24px;
  color: #bababb;
  margin-bottom: 20px;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid transparent;
  transition: border-bottom 0.3s ease;
}

.billets-section h1 {
  border-bottom: 2px solid #3498db;
}

.activites-section h1 {
  border-bottom: 2px solid #e74c3c;
}

.section-container {
  margin-bottom: 40px;
}

.no-items {
  text-align: center;
  font-size: 1.1em;
  color: #e74c3c;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
}

.card h2 {
  font-size: 20px;
  margin-bottom: 15px;
}

.card-details p {
  font-size: 1em;
  color: #34495e;
  margin: 10px 0;
}

.card-details strong {
  font-weight: bold;
}

.activite-image {
  width: 100%;
  border-radius: 8px;
  margin-top: 15px;
}

.logout-button {
  padding: 12px 24px;
  background-color: #f44336;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  display: block;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #e53935;
}

/* Bloc Planning */
.planning-section h1 {
  border-bottom: 2px solid #27ae60;
}

.planning-container {
  margin-top: 20px;
}

.planning-day {
  margin-bottom: 30px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.8);
  border-left: 4px solid #27ae60;
  border-radius: 4px;
}

.planning-day h2 {
  margin-bottom: 10px;
  font-size: 20px;
  color: #27ae60;
}

.planning-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.planning-item {
  margin-bottom: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.planning-item.activite-item {
  border-left: 4px solid #e74c3c;
}

.planning-item.billet-item {
  border-left: 4px solid #3498db;
}

.planning-item strong {
  margin-right: 5px;
}
</style>
