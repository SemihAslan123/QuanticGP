<template>
  <div class="user-service-view">
    <!-- Vue pour les clients : affiche simplement la liste des services validés -->
    <div v-if="userType === 'client'">
      <h1>Liste des Services</h1>
      <div v-if="services.length === 0" class="no-items">
        <p>Aucun service disponible pour le moment.</p>
      </div>
      <div v-else class="services-grid">
        <div class="service-card" v-for="service in services" :key="service.id_service">
          <h2>{{ service.nom_service }}</h2>
          <p><strong>Type :</strong> {{ service.type_service }}</p>
          <p><strong>Description :</strong> {{ service.description_service }}</p>
          <p v-if="service.date_service">
            <strong>Date :</strong> {{ service.date_service | formatDate }}
          </p>
          <p v-if="service.heure_service">
            <strong>Heure :</strong> {{ service.heure_service }}
          </p>
        </div>
      </div>
    </div>

    <!-- Vue pour les prestataires : menu et contenu dynamique -->
    <div v-else-if="userType === 'prestataire'">
      <div class="prestataire-view">
        <h1>Gestion Prestataire</h1>
        <!-- Menu de navigation -->
        <div class="menu">
          <button :class="{active: activeTab === 'profile'}" @click="activeTab = 'profile'">
            Modifier Profil
          </button>
          <button :class="{active: activeTab === 'presentation'}" @click="activeTab = 'presentation'">
            Présentation
          </button>
          <button :class="{active: activeTab === 'services'}" @click="activeTab = 'services'">
            Gestion des Services
          </button>
          <button :class="{active: activeTab === 'reservation'}" @click="activeTab = 'reservation'">
            Réservation d'Emplacement
          </button>
        </div>

        <!-- Contenu en fonction de l'onglet actif -->
        <div class="tab-content">
          <!-- Onglet Modifier Profil -->
          <div v-if="activeTab === 'profile'">
            <h2>Modifier Profil</h2>
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-group">
                <label for="nom">Nom</label>
                <input id="nom" v-model="user.nom" type="text" required />
              </div>
              <div class="form-group">
                <label for="prenom">Prénom</label>
                <input id="prenom" v-model="user.prenom" type="text" required />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input id="email" v-model="user.mail" type="email" required />
              </div>
              <button type="submit">Mettre à jour</button>
            </form>
          </div>

          <!-- Onglet Présentation -->
          <div v-if="activeTab === 'presentation'">
            <h2>Modifier Présentation</h2>
            <Editor v-model="presentationContent" :init="editorInit" />
            <button @click="savePresentation">Sauvegarder la présentation</button>
          </div>

          <!-- Onglet Gestion des Services -->
          <div v-if="activeTab === 'services'">
            <h2>Gestion des Services</h2>
            <div v-if="services.length === 0" class="no-items">
              <p>Aucun service enregistré.</p>
            </div>
            <div v-else class="services-grid">
              <div
                class="service-card"
                :class="{ pending: service.statut === 'EN ATTENTE' }"
                v-for="service in services"
                :key="service.id_service"
              >
                <h3>{{ service.nom_service }}</h3>
                <p><strong>Type :</strong> {{ service.type_service }}</p>
                <p><strong>Description :</strong> {{ service.description_service }}</p>
                <p v-if="service.date_service">
                  <strong>Date :</strong> {{ service.date_service | formatDate }}
                </p>
                <p v-if="service.heure_service">
                  <strong>Heure :</strong> {{ service.heure_service }}
                </p>
                <p v-if="service.statut === 'EN ATTENTE'" class="status-label">
                  <strong>Statut :</strong> En attente
                </p>
                <div class="service-actions">
                  <!-- Pour un service en attente, seule l'annulation est autorisée -->
                  <button v-if="service.statut === 'EN ATTENTE'" @click="deleteService(service.id_service)">
                    Annuler la demande
                  </button>
                  <!-- Pour les autres services, seuls les boutons 'Configurer' et 'Supprimer' sont affichés -->
                  <template v-else>
                    <button @click="configureService(service)">Configurer</button>
                    <button @click="deleteService(service.id_service)">Supprimer</button>
                  </template>
                </div>
              </div>
            </div>

            <!-- Formulaire de demande de nouveau service -->
            <div class="new-service-form">
              <h3>Demande de Nouveau Service</h3>
              <form @submit.prevent="requestNewService">
                <div class="form-group">
                  <label for="emplacement">Emplacement validé</label>
                  <select id="emplacement" v-model="newService.id_emplacement" required>
                    <option v-for="emp in validatedEmplacements" :key="emp.id_emplacement" :value="emp.id_emplacement">
                      {{ emp.nom_emplacement }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="nom_service">Nom du Service</label>
                  <input id="nom_service" v-model="newService.nom_service" type="text" required />
                </div>
                <div class="form-group">
                  <label for="type_service">Type de Service</label>
                  <input id="type_service" v-model="newService.type_service" type="text" required />
                </div>
                <div class="form-group">
                  <label for="presentation_service">Présentation</label>
                  <textarea id="presentation_service" v-model="newService.presentation_service" required></textarea>
                </div>
                <div class="form-group">
                  <label for="description_service">Description</label>
                  <textarea id="description_service" v-model="newService.description_service"></textarea>
                </div>
                <div class="form-group">
                  <label for="date_service">Date du Service</label>
                  <input id="date_service" v-model="newService.date_service" type="date" required />
                </div>
                <div class="form-group">
                  <label for="heure_service">Heure du Service</label>
                  <input id="heure_service" v-model="newService.heure_service" type="time" required />
                </div>
                <button type="submit">Envoyer la demande</button>
              </form>
            </div>
          </div>

          <!-- Onglet Réservation d'Emplacement -->
          <div v-if="activeTab === 'reservation'">
            <h2>Réservation d'Emplacement</h2>
            <div v-if="reservationError" class="error-message">{{ reservationError }}</div>
            <div v-if="reservationSuccess" class="success-message">{{ reservationSuccess }}</div>

            <div class="reservation-container">
              <div class="reservation-filters">
                <h3>Filtrer les emplacements</h3>
                <div class="form-group">
                  <label for="nom_emplacement">Nom de l'emplacement</label>
                  <input
                    id="nom_emplacement"
                    v-model="searchEmplacement.nom_emplacement"
                    @input="searchEmplacements"
                    type="text"
                    placeholder="Filtrer par nom"
                  />
                </div>
              </div>

              <div class="available-emplacements">
                <h3>Emplacements Disponibles</h3>
                <div v-if="availableEmplacements.length > 0">
                  <div class="emplacement-card" v-for="emp in availableEmplacements" :key="emp.id_emplacement">
                    <p><strong>Nom :</strong> {{ emp.nom_emplacement }}</p>
                    <p><strong>Coordonnées :</strong> {{ emp.coordonnees_svg }}</p>
                    <button @click="selectEmplacement(emp)">Sélectionner cet emplacement</button>
                  </div>
                </div>
                <div v-else class="no-items">
                  <p>Aucun emplacement disponible correspondant aux critères.</p>
                </div>
              </div>

              <div class="reservation-details" v-if="selectedEmplacement">
                <h3>Détails de la Réservation</h3>
                <p><strong>Emplacement sélectionné :</strong> {{ selectedEmplacement.nom_emplacement }}</p>
                <div class="form-group">
                  <label for="date_reservation">Date de réservation</label>
                  <input id="date_reservation" v-model="reservationData.date_reservation" type="date" required />
                </div>
                <div class="form-group">
                  <label for="reservation_description">Description</label>
                  <textarea id="reservation_description" v-model="reservationData.description" required></textarea>
                </div>
                <button @click="reserveEmplacement">Réserver cet emplacement</button>
              </div>
            </div>

            <div class="my-reservations">
              <h3>Mes demandes en attente</h3>
              <div v-if="myReservations.length > 0">
                <div class="reservation-card" v-for="reservation in myReservations" :key="reservation.id_emplacement">
                  <p><strong>Emplacement :</strong> {{ reservation.nom_emplacement }}</p>
                  <p><strong>Date :</strong> {{ reservation.date_reservation | formatDate }}</p>
                  <p><strong>Description :</strong> {{ reservation.description }}</p>
                  <button @click="cancelReservation(reservation)">Annuler la demande</button>
                </div>
              </div>
              <div v-else class="no-items">
                <p>Aucune demande en attente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Message par défaut si le type n'est pas reconnu -->
    <div v-else>
      <p>Vous n'avez pas accès à ce service.</p>
    </div>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import prestataireService from '@/services/prestataires';

export default {
  name: 'PrestataireView',
  components: { Editor },
  data() {
    return {
      activeTab: 'profile',
      user: {},
      userType: '',
      services: [],
      presentationContent: '',
      newService: {
        id_emplacement: '',
        nom_service: '',
        type_service: '',
        presentation_service: '',
        description_service: '',
        date_service: '',
        heure_service: ''
      },
      validatedEmplacements: [],
      availableEmplacements: [],
      selectedEmplacement: null,
      myReservations: [],
      reservationError: '',
      reservationSuccess: '',
      searchEmplacement: {
        nom_emplacement: ''
      },
      reservationData: {
        date_reservation: '',
        description: ''
      },
      editorInit: {
        height: 300,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
      }
    };
  },
  created() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      this.user = storedUser;
      this.userType = storedUser.type_utilisateur || storedUser.type;
      if (this.userType === 'client') {
        this.fetchClientServices();
      } else if (this.userType === 'prestataire') {
        if (!this.user.id_utilisateur && this.user.id) {
          this.user.id_utilisateur = this.user.id;
        }
        this.fetchPrestataireServices();
        this.fetchValidatedEmplacements();
        this.presentationContent = this.user.presentation || '';
      }
    } else {
      this.$router.push({ name: 'Login' });
    }
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'reservation') {
        this.searchEmplacements();
        this.fetchMyReservations();
      }
    }
  },
  methods: {
    async fetchClientServices() {
      try {
        const data = await prestataireService.fetchServicesForClient();
        this.services = data;
      } catch (error) {
        console.error('Erreur lors du chargement des services client :', error);
      }
    },
    async fetchPrestataireServices() {
      try {
        const data = await prestataireService.fetchServicesForPrestataire(this.user.id_utilisateur);
        this.services = data;
      } catch (error) {
        console.error('Erreur lors du chargement des services prestataire :', error);
      }
    },
    async updateProfile() {
      try {
        const updatedUser = await prestataireService.updateProfile(this.user);
        this.user = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profil mis à jour avec succès !');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du profil :', error);
        alert('Erreur lors de la mise à jour du profil');
      }
    },
    async savePresentation() {
      try {
        this.user.presentation = this.presentationContent;
        localStorage.setItem('user', JSON.stringify(this.user));
        alert('Présentation mise à jour avec succès !');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la présentation :', error);
        alert('Erreur lors de la sauvegarde de la présentation');
      }
    },
    async deleteService(serviceId) {
      try {
        // Pour un service en attente, on appelle l'API d'annulation de demande
        const service = this.services.find(s => s.id_service === serviceId);
        if (service && service.statut === 'EN ATTENTE') {
          await prestataireService.deleteServiceRequest(serviceId);
        } else {
          await prestataireService.deleteService(serviceId);
        }
        this.services = this.services.filter(s => s.id_service !== serviceId);
        alert('Service supprimé avec succès !');
      } catch (error) {
        console.error('Erreur lors de la suppression du service :', error);
        alert('Erreur lors de la suppression du service');
      }
    },
    configureService(service) {
      alert(`Configurer le service "${service.nom_service}" (fonctionnalité à implémenter).`);
    },
    async requestNewService() {
      try {
        const payload = {
          ...this.newService,
          id_utilisateur: this.user.id_utilisateur
        };
        await prestataireService.requestService(payload);
        alert('Demande de service envoyée avec succès !');
        this.fetchPrestataireServices();
        this.newService = {
          id_emplacement: '',
          nom_service: '',
          type_service: '',
          presentation_service: '',
          description_service: '',
          date_service: '',
          heure_service: ''
        };
      } catch (error) {
        console.error('Erreur lors de la demande de service :', error);
        alert('Erreur lors de la demande de service');
      }
    },
    async fetchValidatedEmplacements() {
      try {
        const data = await prestataireService.fetchValidatedEmplacements(this.user.id_utilisateur);
        this.validatedEmplacements = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des emplacements validés :', error);
      }
    },
    async searchEmplacements() {
      try {
        const params = {
          nom_emplacement: this.searchEmplacement.nom_emplacement || undefined
        };
        const data = await prestataireService.fetchAvailableEmplacements(params);
        this.availableEmplacements = data;
      } catch (error) {
        console.error('Erreur lors de la recherche des emplacements :', error);
        this.reservationError = 'Erreur lors de la recherche des emplacements';
      }
    },
    selectEmplacement(emp) {
      this.selectedEmplacement = emp;
    },
    async reserveEmplacement() {
      this.reservationError = "";
      this.reservationSuccess = "";
      if (!this.reservationData.date_reservation || !this.reservationData.description) {
        this.reservationError = "Veuillez renseigner la date de réservation et une description.";
        return;
      }
      try {
        const reservationPayload = {
          id_utilisateur: this.user.id_utilisateur,
          id_emplacement: this.selectedEmplacement.id_emplacement,
          date_reservation: this.reservationData.date_reservation,
          description: this.reservationData.description
        };
        await prestataireService.requestEmplacementReservation(reservationPayload);
        this.reservationSuccess = "Demande de réservation envoyée avec succès !";
        this.availableEmplacements = this.availableEmplacements.filter(emp => emp.id_emplacement !== this.selectedEmplacement.id_emplacement);
        this.fetchMyReservations();
        this.selectedEmplacement = null;
        this.reservationData = { date_reservation: '', description: '' };
      } catch (error) {
        console.error('Erreur lors de la demande de réservation :', error);
        this.reservationError = "Erreur lors de la demande de réservation.";
      }
    },
    async fetchMyReservations() {
      try {
        const data = await prestataireService.fetchMyEmplacementReservations(this.user.id_utilisateur);
        this.myReservations = data;
      } catch (error) {
        console.error('Erreur lors du chargement de mes demandes de réservation :', error);
      }
    },
    async cancelReservation(reservation) {
      try {
        await prestataireService.cancelEmplacementReservation(reservation.id_emplacement);
        alert('Demande annulée avec succès !');
        this.fetchMyReservations();
        this.searchEmplacements();
      } catch (error) {
        console.error("Erreur lors de l'annulation de la demande :", error);
        alert("Erreur lors de l'annulation de la demande");
      }
    }
  },
  filters: {
    formatDate(value) {
      if (!value) return '';
      const dateObj = new Date(value);
      return dateObj.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.user-service-view {
  padding: 20px;
}
.menu {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.menu button {
  padding: 10px 20px;
  background-color: #3498db;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}
.menu button.active {
  background-color: #2980b9;
}
.tab-content {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}
.profile-form,
.services-grid,
.new-service-form {
  margin-top: 20px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.service-card,
.emplacement-card,
.reservation-card {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.service-card.pending {
  background-color: #fff8b3; /* fond jaune pour les demandes en attente */
}
.status-label {
  color: #e67e22;
  font-weight: bold;
}
.service-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
.service-actions button,
.emplacement-card button,
.reservation-card button,
.new-service-form button,
.profile-form button,
.tab-content button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #3498db;
  color: #fff;
}
.service-actions button:hover,
.emplacement-card button:hover,
.reservation-card button:hover,
.new-service-form button:hover,
.profile-form button:hover,
.tab-content button:hover {
  background-color: #2980b9;
}
.no-items {
  text-align: center;
  color: #e74c3c;
  margin-top: 20px;
}
.reservation-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
.reservation-filters,
.reservation-details {
  width: 30%;
}
.available-emplacements {
  width: 40%;
}
.error-message {
  color: red;
  margin-bottom: 10px;
  font-weight: bold;
}
.success-message {
  color: green;
  margin-bottom: 10px;
  font-weight: bold;
}
.my-reservations {
  margin-top: 30px;
}
.my-reservations h3 {
  margin-bottom: 10px;
}
</style>
