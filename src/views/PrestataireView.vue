<template>
  <div class="user-service-view">
    <!-- Vue Client -->
    <div v-if="userType === 'client' || userType === 'organisateur'" class="client-view">
      <h1>Liste des Services</h1>
      <div v-if="services.length === 0" class="no-items">
        <p>Aucun service disponible pour le moment.</p>
      </div>
      <div v-else class="services-grid">
        <div class="service-card" v-for="service in services" :key="service.id_service">
          <!-- Lien vers la page de détail du service -->
          <router-link :to="{ name: 'ServiceDetail', params: { id: service.id_service } }" class="service-link">
            <h2>{{ service.nom_service }}</h2>
            <p><strong>Type :</strong> {{ service.type_service }}</p>
            <p><strong>Description :</strong> {{ service.description_service }}</p>
            <p v-if="service.date_service">
              <strong>Date :</strong> {{ service.date_service | formatDate }}
            </p>
            <!-- Affichage conditionnel des horaires -->
            <p v-if="service.type_service === 'continu' && service.heure_ouverture && service.heure_fermeture">
              <strong>Horaires :</strong> {{ service.heure_ouverture }} - {{ service.heure_fermeture }}
            </p>
            <p v-else-if="service.type_service === 'ponctuel' && service.heure_commencement">
              <strong>Heure de commencement :</strong> {{ service.heure_commencement }}
            </p>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Vue Prestataire -->
    <div v-else-if="userType === 'prestataire'" class="prestataire-view">
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

      <!-- Contenu de l'onglet actif -->
      <div class="tab-content">
        <!-- Modifier Profil -->
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

        <!-- Modifier Présentation -->
        <div v-if="activeTab === 'presentation'">
          <h2>Modifier la présentation d'un service validé</h2>
          <div class="form-group">
            <label for="serviceSelect">Sélectionner un service validé :</label>
            <select id="serviceSelect" v-model="selectedServiceId" @change="loadSelectedService">
              <option disabled value="">-- Choisir un service --</option>
              <option v-for="service in validatedServices" :key="service.id_service" :value="service.id_service">
                {{ service.nom_service }}
              </option>
            </select>
          </div>
          <div v-if="selectedServiceId">
            <!-- Présentation actuelle -->
            <div class="form-group">
              <label>Présentation actuelle :</label>
              <div class="presentation-display">
                {{ currentServicePresentation }}
              </div>
            </div>
            <!-- Modification avec éditeur TinyMCE -->
            <div class="form-group">
              <label for="presentationEditor">Modifier la présentation :</label>
              <Editor
                  api-key="ke9ggt8j9i58rkp94ch8nhhmj8du8185lsjcw53yojch7fsp"
                  v-model="servicePresentationContent"
                  :init="editorInit"
              />
            </div>
            <div class="form-group">
              <label for="imageInput">Modifier l'URL de l'image :</label>
              <input id="imageInput" v-model="serviceImage" type="text" placeholder="URL de l'image" />
            </div>
            <button @click="updateServicePresentation">Sauvegarder les modifications</button>
          </div>
        </div>

        <!-- Gestion des Services -->
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
              <!-- Affichage conditionnel des horaires -->
              <p v-if="service.type_service === 'continu' && service.heure_ouverture && service.heure_fermeture">
                <strong>Horaires :</strong> {{ service.heure_ouverture }} - {{ service.heure_fermeture }}
              </p>
              <p v-else-if="service.type_service === 'ponctuel' && service.heure_commencement">
                <strong>Heure de commencement :</strong> {{ service.heure_commencement }}
              </p>
              <p v-if="service.statut === 'EN ATTENTE'" class="status-label">
                <strong>Statut :</strong> En attente
              </p>
              <div class="service-actions">
                <button v-if="service.statut === 'EN ATTENTE'" @click="deleteService(service.id_service)">
                  Annuler la demande
                </button>
                <template v-else>
                  <button @click="configureService(service)">Configurer</button>
                  <button @click="deleteService(service.id_service)">Supprimer</button>
                </template>
              </div>
            </div>
          </div>

          <!-- Demande de Nouveau Service -->
          <div class="new-service-form">
            <h3>Demande de Nouveau Service</h3>
            <form @submit.prevent="requestNewService">
              <div class="form-group">
                <label for="emplacement">Emplacement validé</label>
                <select id="emplacement" v-model="newService.id_emplacement" required>
                  <option disabled value="">-- Sélectionner un emplacement --</option>
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
                <select id="type_service" v-model="newService.type_service" required>
                  <option disabled value="">-- Choisir un type --</option>
                  <option value="continu">Continu</option>
                  <option value="ponctuel">Ponctuel</option>
                </select>
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
                <!-- Limitation de la date entre le 15 et le 19 juillet 2025 -->
                <input
                    id="date_service"
                    v-model="newService.date_service"
                    type="date"
                    required
                    min="2025-07-15"
                    max="2025-07-19"
                />
              </div>
              <!-- Affichage conditionnel des champs horaires -->
              <div v-if="newService.type_service === 'continu'">
                <div class="form-group">
                  <label for="heure_ouverture">Heure d'ouverture</label>
                  <input id="heure_ouverture" v-model="newService.heure_ouverture" type="time" required />
                </div>
                <div class="form-group">
                  <label for="heure_fermeture">Heure de fermeture</label>
                  <input id="heure_fermeture" v-model="newService.heure_fermeture" type="time" required />
                </div>
              </div>
              <div v-else-if="newService.type_service === 'ponctuel'">
                <div class="form-group">
                  <label for="heure_commencement">Heure de commencement</label>
                  <input id="heure_commencement" v-model="newService.heure_commencement" type="time" required />
                </div>
              </div>
              <button type="submit">Envoyer la demande</button>
            </form>
          </div>
        </div>

        <!-- Réservation d'Emplacement -->
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
                <!-- Limitation de la date entre le 15 et le 19 juillet 2025 -->
                <input
                    id="date_reservation"
                    v-model="reservationData.date_reservation"
                    type="date"
                    required
                    min="2025-07-15"
                    max="2025-07-19"
                />
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

    <!-- Accès refusé -->
    <div v-else class="access-denied">
      <p>Vous n'avez pas accès à ce service.</p>
    </div>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';
import prestataireService from '@/../backend//services/prestataires.service';

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
      selectedServiceId: '',
      servicePresentationContent: '',
      currentServicePresentation: '',
      serviceImage: '',
      // Objet newService mis à jour avec les nouveaux champs horaires
      newService: {
        id_emplacement: '',
        nom_service: '',
        type_service: '',
        presentation_service: '',
        description_service: '',
        date_service: '',
        heure_ouverture: '',
        heure_fermeture: '',
        heure_commencement: ''
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
  computed: {
    validatedServices() {
      return this.services.filter(service => service.statut === 'ACCEPTÉ');
    }
  },
  created() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      this.user = storedUser;
      this.userType = storedUser.type_utilisateur || storedUser.type;
      if (this.userType === 'client' || this.userType === 'organisateur') {
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
        // Construction du payload en fonction du type de service
        const payload = {
          id_utilisateur: this.user.id_utilisateur,
          id_emplacement: this.newService.id_emplacement,
          nom_service: this.newService.nom_service,
          type_service: this.newService.type_service,
          presentation_service: this.newService.presentation_service,
          description_service: this.newService.description_service || '',
          date_service: this.newService.date_service,
          heure_ouverture: this.newService.type_service === 'continu' ? this.newService.heure_ouverture : null,
          heure_fermeture: this.newService.type_service === 'continu' ? this.newService.heure_fermeture : null,
          heure_commencement: this.newService.type_service === 'ponctuel' ? this.newService.heure_commencement : null
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
          heure_ouverture: '',
          heure_fermeture: '',
          heure_commencement: ''
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
    },
    loadSelectedService() {
      const service = this.services.find(s => s.id_service === this.selectedServiceId);
      if (service) {
        this.currentServicePresentation = service.presentation_service;
        this.serviceImage = service.image_prestataire;
        this.servicePresentationContent = '';
      }
    },
    async updateServicePresentation() {
      if (!this.selectedServiceId) {
        alert("Veuillez sélectionner un service.");
        return;
      }
      const payload = {
        id_service: this.selectedServiceId,
        id_utilisateur: this.user.id_utilisateur,
        presentation_service: this.servicePresentationContent,
        image_prestataire: this.serviceImage
      };
      try {
        const updatedService = await prestataireService.updateService(payload);
        alert("Service mis à jour avec succès !");
        window.location.reload();
        const index = this.services.findIndex(s => s.id_service === this.selectedServiceId);
        if (index !== -1) {
          this.$set(this.services, index, updatedService);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du service :", error);
        alert("Erreur lors de la mise à jour du service.");
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
/* Conteneur global */
.user-service-view {
  padding: 20px;
  margin-top: 70px;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: #ecf0f1;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Titres */
h1 {
  text-align: center;
  margin-bottom: 30px;
}

/* Vue Client */
.client-view .services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.client-view .service-card {
  background: #ecf0f1;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  padding: 20px;
  transition: transform 0.3s;
}

.client-view .service-card:hover {
  transform: translateY(-5px);
}

.client-view .service-card h2 {
  margin-top: 0;
  color: #2c3e50;
}

.client-view .service-card p {
  margin: 8px 0;
  color: #2c3e50;
}

.client-view .service-link {
  text-decoration: none;
}

/* Vue Prestataire */
.prestataire-view {
  background: #fff;
  color: #2c3e50;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.menu {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.menu button {
  padding: 10px 20px;
  background: #3498db;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  transition: background 0.3s;
}

.menu button.active,
.menu button:hover {
  background: #2980b9;
}

.tab-content {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

/* Formulaires */
.profile-form,
.new-service-form,
.services-grid {
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
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
}

/* Cartes des services */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.service-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.service-card.pending {
  background: #fff8b3;
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
.new-service-form button,
.profile-form button,
.tab-content button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #3498db;
  color: #fff;
  transition: background 0.3s;
}

.service-actions button:hover,
.new-service-form button:hover,
.profile-form button:hover,
.tab-content button:hover {
  background: #2980b9;
}

/* Réservation */
.reservation-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.reservation-filters,
.available-emplacements,
.reservation-details {
  flex: 1;
  min-width: 250px;
}

.emplacement-card,
.reservation-card {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: #e74c3c;
  margin-bottom: 10px;
  font-weight: bold;
}

.success-message {
  color: #27ae60;
  margin-bottom: 10px;
  font-weight: bold;
}

.my-reservations {
  margin-top: 30px;
}

.my-reservations h3 {
  margin-bottom: 10px;
}

/* Message d'accès refusé */
.access-denied {
  text-align: center;
  padding: 20px;
  background: #e74c3c;
  border-radius: 4px;
  color: #fff;
}
</style>
