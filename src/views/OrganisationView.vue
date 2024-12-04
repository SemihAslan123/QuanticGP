<template>
  <div class="dashboard-orga">

    <!-- Sidebar -->
    <aside class="sidebar-orga">
      <div class="sidebar-header-orga">
        <h2>Tableau de Bord</h2>
      </div>
      <nav class="sidebar-nav-orga">
        <ul>
          <li>
            <button
                @click="currentSection = 'dashboard'"
                :class="currentSection === 'dashboard' ? 'active' : ''"
                class="sidebar-item-orga"
            >
              <i class="icon-dashboard"></i> Tableau de bord
            </button>
          </li>
          <li>
            <button
                @click="currentSection = 'event'"
                :class="currentSection === 'event' ? 'active' : ''"
                class="sidebar-item-orga"
            >
              <i class="icon-event"></i> Créer un événement
            </button>
          </li>
          <li>
            <button
                @click="showEvents"
                :class="currentSection === 'events' ? 'active' : ''"
                class="sidebar-item-orga"
            >
              <i class="icon-list"></i> Liste des événements
            </button>
          </li>
          <li>
            <!-- Menu Dropdown -->
            <div class="dropdown" :class="{ open: dropdownVisible }">
              <button class="dropdown-button" @click="toggleDropdown">Gestion des prestataires</button>
              <div class="dropdown-menu">
                <button @click="currentSection = 'reservations'; loadReservations()">Ticket prestataire</button>
                <button @click="currentSection = 'assistance'">Assistance prestataire</button>
                <button @click="currentSection = 'listPrestataire'">Liste prestataires</button>
              </div>
            </div>

          </li>
          <li>
            <button
                @click="currentSection = 'statistiques'"
                :class="currentSection === 'statistiques' ? 'active' : ''"
                class="sidebar-item-orga"
            >
              <i class="icon-stats"></i> Statistiques
            </button>
          </li>
        </ul>
      </nav>
      <div class="sidebar-footer-orga">
        <router-link to="/" class="return-home-orga">
          Retour à l'accueil
        </router-link>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="content-orga">
      <header>
        <h1>Gestion</h1>
      </header>

      <section v-if="currentSection === 'dashboard'" class="dashboard-section-orga">
        <h2>Bienvenue</h2>
      </section>

      <section v-if="currentSection === 'event'" class="event-form-orga">
        <h2>Créer un événement</h2>
        <form @submit.prevent="saveEvent">
          <div class="form-group-orga">
            <label>Nom de l'événement :</label>
            <input type="text" v-model="courseName" required />
          </div>
          <div class="form-group-orga">
            <label>Date de l'événement :</label>
            <input type="date" v-model="eventDate" required />
          </div>
          <div class="form-group-orga">
            <label>Description :</label>
            <div ref="editorContainer" class="editor-container-orga"></div>
          </div>
          <div class="form-group-orga">
            <label>Image :</label>
            <input type="file" @change="handleFileUpload" />
            <img v-if="eventImage" :src="eventImage" alt="Image de l'événement" />
          </div>
          <button type="submit">Enregistrer</button>
          <div class="actions-orga">
            <button v-if="currentSection !== 'events'" @click="showEvents">Voir les événements</button>
          </div>
        </form>
      </section>

      <section v-if="currentSection === 'events'" class="events-orga">
        <h2>Liste des événements</h2>
        <div v-if="events.length > 0" class="events-grid-orga">
          <div v-for="event in events" :key="event.id" class="event-card-orga">
            <img :src="event.image" alt="Image de l'événement" class="event-image-orga" v-if="event.image" />
            <h3 class="event-name-orga">{{ event.name }}</h3>
            <p class="event-date-orga">{{ new Date(event.date).toLocaleDateString() }}</p>
            <p class="event-description-orga">{{ event.description }}</p>
          </div>
        </div>
        <div v-else>
          <p>Aucun événement trouvé.</p>
        </div>
        <button @click="goBackToCreateEvent" class="button-back-orga">Retour à la création d'événement</button>
      </section>

      <section v-if="currentSection === 'assistance'" class="">
        <h2>Assistance Prestataire</h2>
      </section>

      <section v-if="currentSection === 'reservations'" class="reservations-section-orga">
        <h2>Réservations</h2>
        <div v-if="reservations.length > 0" class="reservations-table-container">
          <table class="reservations-table">
            <thead>
            <tr>
              <th>ID Réservation</th>
              <th>ID Utilisateur</th>
              <th>ID Stand</th>
              <th>Date</th>
              <th>Heure Début</th>
              <th>Heure Fin</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="reservation in reservations" :key="reservation.id_reservation">
              <td>{{ reservation.id_reservation }}</td>
              <td>{{ reservation.id_utilisateur }}</td>
              <td>{{ reservation.id_stand }}</td>
              <td>{{ new Date(reservation.date_reservation).toLocaleDateString() }}</td>
              <td>{{ reservation.heure_debut }}</td>
              <td>{{ reservation.heure_fin }}</td>
              <td>
            <span :class="['reservation-status', reservation.statut.toLowerCase()]">
              {{ reservation.statut }}
            </span>
              </td>
              <td>
                <select
                    @change="changeStatus(reservation.id_reservation, $event.target.value)"
                    class="status-select"
                >
                  <option value="en attente" :selected="reservation.statut === 'en attente'">En attente</option>
                  <option value="acceptée" :selected="reservation.statut === 'acceptée'">Acceptée</option>
                  <option value="refusée" :selected="reservation.statut === 'refusée'">Refusée</option>
                </select>

                <button class="btn-delete" @click="deleteReservation(reservation.id_reservation)">Supprimer</button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>Aucune réservation trouvée.</p>
        </div>
        <button @click="currentSection = 'prestataire'" class="button-back-orga">Retour</button>
      </section>



      <section v-if="currentSection === 'statistiques'" class="stats-orga">
        <h2>Statistiques</h2>
        <p>Les statistiques apparaîtront ici...</p>
      </section>

    </main>
  </div>
</template>






<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import axios from 'axios';

export default {
  name: 'OrganisationView',
  data() {
    return {
      currentSection: 'event',
      dropdownVisible: false,
      courseName: '',
      eventDate: '',
      eventDescription: '',
      eventImage: null,
      events: [], // Liste des événements récupérés
      reservations: [], // list des réservations stand
      quillEditor: null, // Instance de l'éditeur Quill
    };
  },
  mounted() {

    this.quillEditor = new Quill(this.$refs.editorContainer, {
      theme: 'snow',
      placeholder: 'Écrivez la description de l’événement...',
      modules: {
        toolbar: [
          [{ header: '1' }, { header: '2' }, { font: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['bold', 'italic', 'underline'],
          ['link', 'image'],
          ['blockquote', 'code-block'],
          ['clean'],
        ]
      }
    });

    // Récupérer la valeur initiale si nécessaire
    this.quillEditor.root.innerHTML = this.eventDescription;
  },
  methods: {

    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },

    dellEditor(){
      if (this.quillEditor){
          this.quillEditor = null;
      }
    },
    // Méthode pour afficher les événements
    async showEvents() {
      try {
        const response = await axios.get('http://localhost:3001/organisation/events');  // URL pour récupérer les événements
        this.events = response.data; // Enregistrer les événements dans la variable `events`
        this.currentSection = 'events'; // Afficher la section des événements
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        alert("Erreur lors de la récupération des événements.");
      }
    },
    goBackToCreateEvent() {
      this.currentSection = 'event';
      this.resetForm();
      this.$nextTick(() => {
        this.dellEditor();
        this.quillEditor = new Quill(this.$refs.editorContainer, {
          theme: 'snow',
          placeholder: 'Écrivez la description de l’événement...',
          modules: {
            toolbar: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ align: [] }],
              ['bold', 'italic', 'underline'],
              ['link', 'image'],
              ['blockquote', 'code-block'],
              ['clean'],
            ]
          }
        });
      });
    },

    async saveEvent() {
      if (!this.courseName || !this.eventDate || !this.quillEditor.getText().trim() || !this.eventImage) {
        alert("Veuillez remplir tous les champs avant de sauvegarder.");
        return;
      }

      // Récupérer la description de l'événement
      this.eventDescription = this.quillEditor.getText().trim();

      // Construire l'objet de données
      const eventData = {
        courseName: this.courseName,
        eventDate: this.eventDate,
        eventDescription: this.eventDescription,
        eventImage: this.eventImage
      };

      try {
        const response = await axios.post('http://localhost:3001/organisation/', eventData);
        alert(response.data.message);

        // Réinitialiser le formulaire après succès
        this.resetForm();
      } catch (error) {
        console.error("Erreur lors de l'envoi des données:", error);
        alert("Erreur lors de l'enregistrement de l'événement.");
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.eventImage = reader.result; // Encodage en base64
        };
        reader.readAsDataURL(file);
      }
    },
    resetForm() {
      this.courseName = '';
      this.eventDate = '';
      this.quillEditor.setText('');
      this.eventImage = null;
    },


    // voir les réservations
    async loadReservations() {
      try {
        const response = await axios.get('http://localhost:3001/organisation/stands');
        console.log("Données récupérées :", JSON.stringify(response.data, null, 2));
        this.reservations = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations :', error);
        alert('Erreur lors de la récupération des réservations.');
      }
    },


    //changer le statue d'une réservation
    async changeStatus(reservationId, newStatus) {
      if (!["en attente", "acceptée", "refusée"].includes(newStatus)) {
        alert("Statut invalide.");
        return;
      }

      try {
        await axios.patch(`http://localhost:3001/organisation/stands/${reservationId}`, { statut: newStatus });
        alert("Statut mis à jour avec succès.");
        this.loadReservations(); // Recharge les données
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut :", error);
        alert("Erreur lors de la mise à jour du statut.");
      }
    },


    //supprimer une réservation
    async deleteReservation(reservationId) {
      if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
        try {
          await axios.delete(`http://localhost:3001/organisation/stands/${reservationId}`);
          alert("Réservation supprimée avec succès.");
          this.loadReservations(); // Recharge les données
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          alert("Erreur lors de la suppression.");
        }
      }
    }
  }
};

</script>


<style src="../styles/OrganisationPage.css"></style>
