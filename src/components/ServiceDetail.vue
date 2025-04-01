<template>
  <div class="service-detail">
    <div class="card">
      <div class="header">
        <img
          v-if="service.image_prestataire"
          :src="service.image_prestataire"
          alt="Image du service"
        />
        <h2>{{ service.nom_service }}</h2>
      </div>
      <div class="content">
        <p><strong>Type :</strong> {{ service.type_service }}</p>
        <p><strong>Description :</strong> {{ service.description_service }}</p>
        <!-- Bloc pour afficher la présentation -->
        <div v-if="service.presentation_service" class="presentation">
          <h3>Présentation</h3>
          <p>{{ service.presentation_service }}</p>
        </div>
        <p v-if="service.date_service">
          <strong>Date :</strong> {{ formatDate(service.date_service) }}
        </p>
        <p v-if="service.heure_service">
          <strong>Heure :</strong> {{ service.heure_service }}
        </p>
      </div>
      <div class="reservation">
        <button @click="reserveService">Réserver ce service</button>
      </div>
    </div>
  </div>
</template>

<script>
import prestataireService from '@/../backend/services/prestataires.service';

export default {
  name: 'ServiceDetail',
  data() {
    return {
      service: null
    };
  },
  methods: {
    async fetchService() {
      try {
        // Récupérer l'ID du service depuis l'URL
        const serviceId = parseInt(this.$route.params.id, 10);
        // Récupérer la liste complète des services validés et filtrer celui-ci
        const services = await prestataireService.fetchServicesForClient();
        this.service = services.find(s => s.id_service === serviceId);
        if (!this.service) {
          console.error("Service non trouvé");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du service :", error);
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    reserveService() {
      // Fonctionnalité de réservation à implémenter ultérieurement
      alert("Réservation à implémenter ultérieurement.");
    }
  },
  created() {
    this.fetchService();
  }
};
</script>

<style scoped>
.service-detail {
  background: #2c3e50;
  color: #fff;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background: #34495e;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 800px;
}

.header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #7f8c8d;
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.header img {
  width: 150px;
  border-radius: 8px;
  margin-right: 20px;
}

.header h2 {
  font-size: 2rem;
  margin: 0;
}

.content p {
  margin: 10px 0;
  line-height: 1.6;
}

.content strong {
  color: #ecf0f1;
}

.presentation {
  background: #3b5360;
  border-radius: 4px;
  padding: 15px;
  margin: 20px 0;
}

.presentation h3 {
  margin-top: 0;
}

.reservation {
  text-align: center;
  margin-top: 20px;
}

.reservation button {
  background: #e74c3c;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.reservation button:hover {
  background: #c0392b;
}
</style>
