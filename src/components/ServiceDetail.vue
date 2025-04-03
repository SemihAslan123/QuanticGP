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

      <!-- Boutons de réservation et retour -->
      <div class="reservation">
        <button v-if="!showReservationForm && !reserved" @click="openReservationForm">
          Réserver ce service
        </button>
        <button @click="goBack">Retour</button>
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
          <select v-model="reservationTime" id="reservationTime" required>
            <option value="">-- Sélectionnez une heure --</option>
            <option v-for="time in availableTimes" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
        <div v-else-if="service.type_service === 'ponctuel'">
          <p>Ce service est à heure fixe.</p>
        </div>
        <div class="buttons">
          <button @click="confirmReservation">Confirmer la réservation</button>
          <button @click="cancelReservationForm">Annuler</button>
        </div>
      </div>

      <!-- Message de validation affiché une fois la réservation effectuée -->
      <div v-if="reserved" class="reservation-message">
        <p class="success-message">{{ successMessage }}</p>
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
      reservationTime: "",
      errorMessage: "",
      successMessage: "",
      reserved: false
    };
  },
  computed: {
    availableTimes() {
      if (!this.service || !this.service.heure_ouverture || !this.service.heure_fermeture) return [];
      // Convertir une heure au format "HH:mm" en minutes depuis minuit
      const timeToMinutes = timeStr => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };
      // Formater des minutes en heure "HH:mm"
      const minutesToTime = minutes => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
      };
      const startMinutes = timeToMinutes(this.service.heure_ouverture);
      const endMinutes = timeToMinutes(this.service.heure_fermeture);
      const times = [];
      const interval = 15; // intervalle de 15 minutes
      for (let minutes = startMinutes; minutes <= endMinutes; minutes += interval) {
        times.push(minutesToTime(minutes));
      }
      return times;
    }
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
      this.errorMessage = "";
      this.successMessage = "";
    },
    cancelReservationForm() {
      this.showReservationForm = false;
      this.reservationTime = "";
      this.errorMessage = "";
      // Si l'utilisateur annule, on ne marque pas la réservation comme faite
    },
    async confirmReservation() {
      // Pour les services de type continu, vérification de la sélection
      if (this.service.type_service === 'continu') {
        if (!this.reservationTime) {
          this.errorMessage = "Veuillez sélectionner une heure de commande.";
          return;
        }
      }
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        this.errorMessage = "Utilisateur non authentifié.";
        return;
      }
      const payload = {
        id_utilisateur: user.id,
        id_service: this.service.id_service,
        heure_commande: this.service.type_service === 'continu' ? this.reservationTime : null
      };
      try {
        await prestataireService.reserveService(payload);
        // En cas de succès, afficher le message de validation instantanément
        this.successMessage = "Réservation effectuée avec succès !";
        this.reserved = true;
        this.showReservationForm = false;
        this.reservationTime = "";
      } catch (error) {
        console.error("Erreur lors de la réservation du service :", error);
        this.errorMessage = "Erreur lors de la réservation du service.";
      }
    },
    goBack() {
      this.$router.push('/prestataire');
    }
  },
  created() {
    this.fetchService();
  }
};
</script>

<style scoped>
.service-detail {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%);
  color: #fff;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background: #34495e;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 800px;
  transition: transform 0.3s ease;
}
.card:hover {
  transform: translateY(-3px);
}

.header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #7f8c8d;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
.header img {
  width: 120px;
  border-radius: 8px;
  margin-right: 20px;
  border: 2px solid #ecf0f1;
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
  border-radius: 6px;
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
  padding: 12px 24px;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  margin: 0 5px;
}
.reservation button:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.reservation-form {
  background: #fff;
  color: #2c3e50;
  padding: 25px;
  margin-top: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}
.reservation-form h2 {
  margin-top: 0;
}
/* Changer la couleur du texte "Date du service" en noir */
.reservation-form p strong {
  color: #000;
}
.reservation-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}
.reservation-form select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  transition: border-color 0.3s;
}
.reservation-form select:focus {
  border-color: #27ae60;
  outline: none;
}
.buttons {
  text-align: center;
}
.reservation-form button {
  background: #27ae60;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  margin: 0 5px;
  transition: background 0.3s, transform 0.3s;
}
.reservation-form button:hover {
  background: #1e8449;
  transform: translateY(-2px);
}
.error-message {
  color: red;
  font-weight: bold;
  margin-top: -10px;
  margin-bottom: 10px;
}
.success-message {
  color: green;
  font-weight: bold;
  margin-top: -10px;
  margin-bottom: 10px;
}
</style>
