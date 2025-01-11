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
                @click="resetClick"
                :class="currentSection === 'event' ? 'active' : ''"
                class="sidebar-item-orga"
            >
              <i class="icon-event"></i> Créer une activitée
            </button>
          </li>
          <li>
            <button
                @click="showEvents"
                :class="currentSection === 'events' ? 'active' : ''"
                class="sidebar-item-orga"
            >
              <i class="icon-list"></i> Liste des activitées
            </button>
          </li>
          <li>
            <!-- Menu Dropdown -->
            <div class="dropdown" :class="{ open: dropdownVisible }">
              <button class="dropdown-button" @click="toggleDropdown">Gestion des prestataires</button>
              <div class="dropdown-menu">
                <button @click="currentSection = 'reservations'; loadReservations()">Ticket réservation</button>
                <button @click="currentSection = 'assistance';">Assistance prestataire</button>
                <button @click="currentSection = 'listPrestataire'; loadPrestataires()">Liste prestataires</button>
              </div>
            </div>

          </li>
          <li>
            <button
                @click="chargeStat"
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
        <h2>Créer une activitée</h2>
        <form @submit.prevent="saveEvent">
          <div class="form-group-orga">
            <label>Nom de l'activitée :</label>
            <input type="text" v-model="courseName" required />
          </div>
          <div class="form-group-orga">
            <label>Date de l'activitée :</label>
            <input type="date" v-model="eventDate" required />
          </div>
          <div class="form-group-orga">
            <label>Prix (en €) :</label>
            <input type="number" v-model="eventPrice" required />
          </div>
          <div class="form-group-orga">
            <label>Horaire Début :</label>
            <input type="time" v-model="horaireDebut" required />
          </div>
          <div class="form-group-orga">
            <label>Horaire Fin :</label>
            <input type="time" v-model="horaireFin" required />
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
            <button v-if="currentSection !== 'events'" @click="showEvents">Voir les activitées</button>
          </div>
        </form>
      </section>


      <!-- Section pour modifier un événement -->
      <section v-if="currentSection === 'modifyEvent'" class="event-form-orga">
        <h2>Modifier l'activitée</h2>
        <form @submit.prevent="saveEvent">
          <div class="form-group-orga">
            <label>Nom de l'activitée :</label>
            <input type="text" v-model="courseName" required />
          </div>
          <div class="form-group-orga">
            <label>Date de l'activitée :</label>
            <input type="date" v-model="eventDate" required />
          </div>
          <div class="form-group-orga">
            <label>Prix (en €) :</label>
            <input type="number" v-model="eventPrice" required />
          </div>
          <div class="form-group-orga">
            <label>Horaire Début :</label>
            <input type="time" v-model="horaireDebut" required />
          </div>
          <div class="form-group-orga">
            <label>Horaire Fin :</label>
            <input type="time" v-model="horaireFin" required />
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
            <button @click="showEvents">Voir les activitées</button>
          </div>
        </form>
      </section>

      <section v-if="currentSection === 'events'" class="events-orga">
        <h2>Liste des activitées</h2>
        <div v-if="events.length > 0" class="events-grid-orga">
          <div v-for="event in events" :key="event.id" class="event-card-orga">
            <img :src="event.image" alt="Image de l'événement" class="event-image-orga" v-if="event.image" />
            <h3 class="event-name-orga">{{ event.name }}</h3>
            <p class="event-date-orga">{{ new Date(event.date).toLocaleDateString() }}</p>

            <p class="event-time-orga">
              <strong>Horaire :</strong>
              {{ event.heure_debut }} - {{ event.heure_fin }}
            </p>

            <p class="event-price-orga">
              <strong>Prix :</strong> {{ event.prix }} €
            </p>
            <p class="event-description-orga">
              <strong>Description :</strong> {{ event.description }}
            </p>

            <!-- Modifier et Supprimer -->
            <div class="event-actions-orga">
              <button @click="editEvent(event)" class="btn-edit">Modifier</button>
              <button @click="deleteEvent(event.id)" class="btn-delete">Supprimer</button>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Aucune activitée trouvé.</p>
        </div>
        <button @click="goBackToCreateEvent" class="button-back-orga">Retour à la création d'activitée</button>
      </section>


      <section v-if="currentSection === 'assistance'" class="">
        <h2>Assistance Prestataire</h2>
      </section>

      <section v-if="currentSection === 'listPrestataire'" class="list-prestataire-section-orga">
        <h2>Liste des Prestataires</h2>

        <!-- Barre de recherche et filtre -->
        <div class="filter-container-orga">
          <input
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher par nom ou email"
              class="search-bar-orga"
          />
          <select v-model="selectedFilter" class="filter-select-orga">
            <option value="">Tous les types</option>
            <option value="prestataire">Prestataire</option>
            <option value="client">Client</option>
            <option value="organisateur">Organisateur</option>
          </select>
        </div>

        <!-- filtre -->
        <div v-if="filteredPrestataires.length > 0" class="prestataires-grid-orga">
          <div
              v-for="prestataire in filteredPrestataires"
              :key="prestataire.id_utilisateur"
              class="prestataire-card-orga"
          >
            <h3 class="prestataire-name-orga">
              {{ prestataire.nom_utilisateur }} {{ prestataire.prenom_utilisateur }}
            </h3>
            <p class="prestataire-id-orga">Id : {{ prestataire.id_utilisateur }}</p>
            <p class="prestataire-email-orga">Email : {{ prestataire.mail_utilisateur }}</p>
            <span :class="['prestataire-service', prestataire.type_utilisateur.toLowerCase()]">
        Service : {{ prestataire.type_utilisateur }}
      </span>
            <select
                @change="changeService(prestataire.id_utilisateur, $event.target.value)"
                class="service-select"
            >
              <option value="prestataire" :selected="prestataire.type_utilisateur === 'prestataire'">
                Prestataire
              </option>
              <option value="client" :selected="prestataire.type_utilisateur === 'client'">
                Client
              </option>
              <option value="organisateur" :selected="prestataire.type_utilisateur === 'organisateur'">
                Organisateur
              </option>
            </select>
          </div>
        </div>
        <div v-else>
          <p>Aucun prestataire correspondant trouvé.</p>
        </div>
      </section>



      <section v-if="currentSection === 'reservations'" class="reservations-section-orga">
        <h2>Réservations</h2>
        <div v-if="reservations.length > 0" class="reservations-table-container">
          <table class="reservations-table">
            <thead>
            <tr>
              <th>ID Réservation</th>
              <th>Id Utilisateur</th>
              <th>Nom Utilisateur</th>
              <th>Prénom Utilisateur</th>
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
              <td>{{ reservation.nom_utilisateur }}</td>
              <td>{{ reservation.prenom_utilisateur }}</td>
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

                <button class="btn-delete" @click="deleteReservation(reservation.id_reservation)">
                  Supprimer
                </button>
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




      <section v-if="currentSection === 'statistiques'" class="statistics-orga">
        <h2>Statistiques</h2>

        <div class="stats-overview">
          <div class="stat-item">
            <h3>Nombre total d'activitées</h3>
            <p>{{ totalEvents }}</p>
          </div>
          <div class="stat-item">
            <h3>Nombre de participants total unique</h3>
            <p>{{ totalParticipants }}</p>
          </div>
          <div class="stat-item">
            <h3>Nombre de tickets de réservation</h3>
            <p>{{ totalTicketPrestataire }}</p>
          </div>
        </div>

        <div class="stats-graphs">
          <div class="chart-container">
            <h3 class="chart-title">Nombre de Participants par Activitées</h3>
            <canvas id="participantsChart"></canvas>
          </div>
        </div>
      </section>




    </main>
  </div>
</template>






<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
//import axios from 'axios';
//import Chart from 'chart.js/auto';
import eventData from '@/data/eventData';
import prestatairesData from '@/data/prestatairesData'
import reservationData from "@/data/reservationData";
import { statisticsData } from "@/data/statistics";
//import users from '@/data/users'

import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);


export default {
  name: 'OrganisationView',
  data() {
    return {
      currentSection: 'event',
      dropdownVisible: false,
      courseName: '',
      eventDate: '',
      eventPrice: null,
      horaireDebut: '',
      horaireFin: '',
      eventDescription: '',
      eventImage: null,
      events: [],
      reservations: [],
      quillEditor: null,
      totalEvents: 0,
      totalParticipants: 0,
      totalTicketPrestataire: 0,
      prestataires: [],
      editingPrestataireId: null,
      searchQuery: '',
      selectedFilter: '',
      participantsData: [],
      participantsChart: null,
    };
  },

  created() {
    this.loadReservations(); // Charger les réservations
    this.loadStatistics(); // Charger les stats
    this.showEvents(); // Charger les events
    this.loadPrestataires(); // Charger les prestataire
  },


  mounted() {


    if (this.currentSection === 'statistiques') {
      this.loadStatistics();
    }

    this.quillEditor = new Quill(this.$refs.editorContainer, {
      theme: 'snow',
      placeholder: 'Écrivez la description de l’activitée...',
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

  // Pour edit
  watch: {
    currentSection(newSection, oldSection) {


      if (oldSection === 'event' && this.quillEditor) {
        this.dellEditor();
      }
      if (newSection === 'modifyEvent') {
        if (!this.quillEditor) {
          this.recreateEditor();
        }
      }
    },
  },


  computed: {
    filteredPrestataires() {
      return this.prestataires.filter(prestataire => {
        // Filtre par type
        const matchesFilter = !this.selectedFilter || prestataire.type_utilisateur === this.selectedFilter;

        // Filtre par nom ou email
        const matchesSearch =
            prestataire.nom_utilisateur.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            prestataire.mail_utilisateur.toLowerCase().includes(this.searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
      });
    }
  },


  methods: {

    renderParticipantsChart() {
      console.log("Démarrage du rendu du graphique...");
      const chartElement = document.getElementById('participantsChart');
      if (!chartElement) {
        console.error('Élément du graphique introuvable.');
        return;
      }

      const ctx = chartElement.getContext('2d');

      if (this.participantsChart) {
        this.participantsChart.destroy();
      }

      const labels = this.participantsData.map(item => item.eventName);
      const data = this.participantsData.map(item => parseInt(item.participants, 10));

      this.participantsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Nombre de Participants',
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      console.log("Graphique rendu avec succès !");
    },


    loadPrestataires() {
      try {
        // Charger les données locales
        this.prestataires = prestatairesData;
        console.log("Prestataires chargés localement :", JSON.stringify(this.prestataires, null, 2));
      } catch (error) {
        console.error('Erreur lors du chargement des prestataires :', error);
        alert('Erreur lors du chargement des prestataires.');
      }
    },




    chargeStat() {
      console.log("Changement de section : statistiques");
      this.currentSection = 'statistiques';

      this.$nextTick(() => {
        console.log("Vérification de l'élément canvas...");
        this.loadStatistics();
      });
    },


    loadStatistics() {
      try {

        const data = statisticsData;

        console.log("Statistiques récupérées :", data);


        this.totalEvents = data.totalEvents;
        this.totalTicketPrestataire = data.totalTicketPrestataire;

        // Calculer le total des participants uniques
        const uniqueParticipants = new Set();
        data.participantsByEvent.forEach(event => {
          uniqueParticipants.add(event.eventId);
        });
        this.totalParticipants = uniqueParticipants.size;


        this.participantsData = data.participantsByEvent;


        this.renderParticipantsChart();
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        alert("Erreur lors de la récupération des statistiques.");
      }
    },




    editEvent(event) {
      this.courseName = event.name || '';
      this.eventDate = event.date ? new Date(event.date).toISOString().split('T')[0] : '';
      this.horaireDebut = event.heure_debut || '';
      this.horaireFin = event.heure_fin || '';
      this.eventPrice = event.prix || null;
      this.eventImage = event.image || null;
      this.currentSection = 'modifyEvent';
      this.editingEventId = event.id;

      this.$nextTick(() => {
        if (this.quillEditor) {
          this.quillEditor.root.innerHTML = event.description || '';
        }
      });

    },


    deleteEvent(eventId) {
      if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
        const eventIndex = this.events.findIndex(event => event.id === eventId);
        if (eventIndex !== -1) {
          this.events.splice(eventIndex, 1);
          alert("Activité supprimée avec succès.");
        } else {
          alert("Activité non trouvée.");
        }
      }
    },


    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },

    dellEditor() {
      if (this.quillEditor) {
        this.quillEditor = null;
      }
    },

    recreateEditor() {
      if (this.quillEditor) {
        this.quillEditor = null;
      }
      this.$nextTick(() => {
        this.quillEditor = new Quill(this.$refs.editorContainer, {
          theme: 'snow',
          placeholder: 'Écrivez la description de l’activité...',
          modules: {
            toolbar: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ align: [] }],
              ['bold', 'italic', 'underline'],
              ['link', 'image'],
              ['blockquote', 'code-block'],
              ['clean'],
            ],
          },
        });
      });
    },



    // Méthode pour afficher les événements
    async showEvents() {
      try {

        const response = await new Promise((resolve) => {
          setTimeout(() => resolve(eventData), 500);
        });

        this.events = response;
        this.currentSection = 'events';
      } catch (error) {
        console.error("Erreur lors de la récupération des activités :", error);
        alert("Erreur lors de la récupération des activités.");
      }
    },
    goBackToCreateEvent() {
      this.currentSection = 'event';
      this.resetForm();
      this.recreateEditor();
    },

    resetClick() {
      this.currentSection = 'event';
      this.goBackToCreateEvent();
    },



    saveEvent() {
      if (!this.courseName || !this.eventDate || !this.horaireDebut || !this.horaireFin || !this.eventPrice || !this.quillEditor.getText().trim() || !this.eventImage) {
        alert("Veuillez remplir tous les champs avant de sauvegarder.");
        return;
      }

      const eventDescription = this.quillEditor.getText().trim();
      const newEventData = {
        id: this.editingEventId || Date.now(),
        name: this.courseName,
        date: this.eventDate,
        heure_debut: this.horaireDebut,
        heure_fin: this.horaireFin,
        prix: this.eventPrice,
        description: eventDescription,
        image: this.eventImage,
      };

      if (this.editingEventId) {
        const index = this.events.findIndex(event => event.id === this.editingEventId);
        if (index !== -1) {
          this.events.splice(index, 1, newEventData); // Remplacez l'ancien événement
          alert("Événement mis à jour avec succès.");
        } else {
          alert("Événement non trouvé.");
        }
      } else {
        this.events.push(newEventData); // Ajoutez un nouvel événement
        alert("Événement créé avec succès.");
      }

      this.resetForm(); // Réinitialisez le formulaire
      this.currentSection = 'events';
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
      this.horaireDebut = '';
      this.horaireFin = '';
      this.eventPrice = null;
      this.eventImage = null;

      if (this.quillEditor) {
        this.quillEditor.setText('');
      }
    },


    // voir les réservations
    async loadReservations() {
      try {
        // Charge les données locales de réservation
        this.reservations = reservationData.map((reservation) => {
          // Trouver l'utilisateur correspondant à l'id_utilisateur
          const utilisateur = prestatairesData.find(
              (user) => user.id_utilisateur === reservation.id_utilisateur
          );

          return {
            ...reservation,
            nom_utilisateur: utilisateur ? utilisateur.nom_utilisateur : "Inconnu",
            prenom_utilisateur: utilisateur ? utilisateur.prenom_utilisateur : "Inconnu",
          };
        });

        console.log("Réservations enrichies :", this.reservations);
      } catch (error) {
        console.error("Erreur lors du chargement des réservations :", error);
        alert("Erreur lors du chargement des réservations.");
      }
    },



    //changer le statue d'une réservation
    changeStatus(reservationId, newStatus) {
      if (!["en attente", "acceptée", "refusée"].includes(newStatus)) {
        alert("Statut invalide.");
        return;
      }

      try {
        // Trouver la réservation par son ID
        const reservationIndex = this.reservations.findIndex(
            (reservation) => reservation.id_reservation === reservationId
        );

        if (reservationIndex === -1) {
          alert("Réservation non trouvée.");
          return;
        }

        // Mettre à jour le statut de la réservation
        this.reservations[reservationIndex].statut = newStatus;
        alert("Statut mis à jour avec succès.");


        console.log(
            `Statut de la réservation ID ${reservationId} mis à jour :`,
            this.reservations[reservationIndex]
        );
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut :", error);
        alert("Erreur lors de la mise à jour du statut.");
      }
    },


    changeService(prestataireId, newService) {
      console.log("ID du prestataire :", prestataireId);

      if (!["prestataire", "client", "organisateur"].includes(newService)) {
        alert("Service invalide.");
        return;
      }

      try {
        // Trouver le prestataire par ID
        const prestataireIndex = this.prestataires.findIndex(p => p.id_utilisateur === prestataireId);

        if (prestataireIndex !== -1) {
          // Mettre à jour le type d'utilisateur
          this.prestataires[prestataireIndex].type_utilisateur = newService;
          alert("Service mis à jour avec succès.");
        } else {
          alert("Prestataire non trouvé.");
        }

        console.log("Prestataires après mise à jour :", JSON.stringify(this.prestataires, null, 2));
      } catch (error) {
        console.error("Erreur lors de la mise à jour du service :", error);
        alert("Erreur lors de la mise à jour du service.");
      }
    },





    //supprimer une réservation
    deleteReservation(reservationId) {
      if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
        // Trouver l'index de la réservation
        const reservationIndex = this.reservations.findIndex(
            (r) => r.id_reservation === reservationId
        );

        if (reservationIndex !== -1) {
          // Supprimer la réservation de la liste
          this.reservations.splice(reservationIndex, 1);
          alert("Réservation supprimée localement.");

          console.log(`Réservation avec ID ${reservationId} supprimée.`);
        } else {
          alert("Réservation non trouvée.");
        }
      }
    },
  }
};

</script>


<style src="../styles/OrganisationPage.css"></style>
