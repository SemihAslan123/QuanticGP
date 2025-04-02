<template>
  <div class="service-detail">
    <div class="card" v-if="service">
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
        <!-- Affichage conditionnel des horaires selon le type de service -->
        <p v-if="service.type_service === 'continu' && service.heure_ouverture && service.heure_fermeture">
          <strong>Horaires :</strong> {{ service.heure_ouverture }} - {{ service.heure_fermeture }}
        </p>
        <p v-else-if="service.type_service === 'ponctuel' && service.heure_commencement">
          <strong>Heure de commencement :</strong> {{ service.heure_commencement }}
        </p>
      </div>
      <div class="reservation" v-if="!showReservationForm">
        <button @click="openReservationForm">Réserver ce service</button>
      </div>

      <!-- Formulaire de réservation intégré -->
      <div v-if="showReservationForm" class="reservation-form">
        <h2>Réserver le service : {{ service.nom_service }}</h2>
        <p>
          <strong>Date du service :</strong>
          {{ formatDate(service.date_service) }}
        </p>
        <div v-if="service.type_service === 'continu'">
          <label for="reservationTime">
            Choisissez une heure de commande (entre {{ service.heure_ouverture }} et {{ service.heure_fermeture }}) :
          </label>
          <input
            id="reservationTime"
            v-model="reservationTime"
            type="time"
            required
          />
        </div>
        <div v-else-if="service.type_service === 'ponctuel'">
          <p>Ce service est à heure fixe.</p>
        </div>
        <div class="buttons">
          <button @click="confirmReservation">Confirmer la réservation</button>
          <button @click="cancelReservationForm">Annuler</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Chargement du service...</p>
    </div>
  </div>
</template>

<script>
import prestataireService from '@/../backend/services/prestataires.service';

export default {
  name: 'ServiceDetail',
  data() {
    return {
      service: null,
      showReservationForm: false,
      reservationTime: ""
    };
  },
  methods: {
    async fetchService() {
      try {
        // Récupérer l'ID du service depuis l'URL
        const serviceId = parseInt(this.$route.params.id, 10);
        // Récupérer la liste des services validés pour le client
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
    openReservationForm() {
      this.showReservationForm = true;
    },
    cancelReservationForm() {
      this.showReservationForm = false;
      this.reservationTime = "";
    },
    async confirmReservation() {
      // Pour un service continu, vérifier que l'heure de commande est renseignée
      if (this.service.type_service === 'continu' && !this.reservationTime) {
        alert("Veuillez renseigner l'heure de commande.");
        return;
      }
      // Récupérer les informations de l'utilisateur depuis localStorage en utilisant la même logique que sur la page Planning
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        alert("Utilisateur non authentifié.");
        return;
      }
      const payload = {
        id_utilisateur: user.id,
        id_service: this.service.id_service,
        // Pour un service continu, transmettre l'heure choisie ; sinon, null
        heure_commande: this.service.type_service === 'continu' ? this.reservationTime : null
      };
      try {
        await prestataireService.reserveService(payload);
        alert("Réservation effectuée avec succès !");
        this.showReservationForm = false;
        this.reservationTime = "";
      } catch (error) {
        console.error("Erreur lors de la réservation du service :", error);
        alert("Erreur lors de la réservation du service.");
      }
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

.reservation-form {
  background: #fff;
  color: #2c3e50;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.reservation-form h2 {
  margin-top: 0;
}

.reservation-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.reservation-form input[type="time"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
}

.reservation-form .buttons {
  text-align: center;
}

.reservation-form button {
  background: #27ae60;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  margin-right: 10px;
  transition: background 0.3s;
}

.reservation-form button:hover {
  background: #1e8449;
}
</style>
