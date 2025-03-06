<!-- frontend/src/views/OrganisationView.vue -->
<template>
  <div class="dashboard-orga">
    <!-- Sidebar -->
    <OrganisationSidebar :currentSection="currentSection" @update-section="updateSection" />
    <!-- Main Content -->
    <main class="content-orga">
      <header>
        <h1>Gestion</h1>
      </header>
      <!-- Sections selon currentSection -->
      <div v-if="currentSection === 'dashboard'">
        <h2>Bienvenue</h2>
      </div>
      <EventForm v-if="currentSection === 'event'" :editing="false" @save-event="handleCreateEvent" @show-events="updateSection('events')" />
      <EventForm v-if="currentSection === 'modifyEvent'" :editing="true" :initialData="currentEventData" @save-event="handleUpdateEvent" />
      <EventsList v-if="currentSection === 'events'" :events="events" @edit-event="handleEditEvent" @delete-event="handleDeleteEvent" @back-to-create="updateSection('event')" />
      <ReservationsTable v-if="currentSection === 'reservations'" :reservations="reservations" @change-status="handleChangeStatus" @delete-reservation="handleDeleteReservation" @back="updateSection('dashboard')" />
      <StatisticsChart v-if="currentSection === 'statistiques'"
                       :totalEvents="totalEvents"
                       :totalParticipants="totalParticipants"
                       :totalTicketPrestataire="totalTicketPrestataire"
                       :participantsData="participantsData" />
      <ListPrestataire v-if="currentSection === 'listPrestataire'" :prestataires="prestataires" @change-service="handleChangeService" />
      <AssistancePrestataire v-if="currentSection === 'assistance'" />
    </main>
  </div>
</template>

<script>
import OrganisationSidebar from '@/components/organisation/OrganisationSidebar.vue';
import EventForm from '@/components/organisation/EventForm.vue';
import EventsList from '@/components/organisation/EventsList.vue';
import ReservationsTable from '@/components/organisation/ReservationsTable.vue';
import StatisticsChart from '@/components/organisation/StatisticsChart.vue';
import ListPrestataire from '@/components/organisation/ListPrestataire.vue';
import AssistancePrestataire from '@/components/organisation/AssistancePrestataire.vue';
import organisationService from '@/services/organisationService';

export default {
  name: 'OrganisationView',
  components: {
    OrganisationSidebar,
    EventForm,
    EventsList,
    ReservationsTable,
    StatisticsChart,
    ListPrestataire,
    AssistancePrestataire,
  },
  data() {
    return {
      currentSection: 'event',
      events: [],
      reservations: [],
      prestataires: [],
      totalEvents: 0,
      totalParticipants: 0,
      totalTicketPrestataire: 0,
      participantsData: [],
      currentEventData: {},
      editingEventId: null,
    };
  },
  mounted() {
    if (this.currentSection === 'statistiques') {
      this.loadStatistics();
    }
  },
  methods: {
    updateSection(section) {
      this.currentSection = section;
      if (section === 'events') {
        this.fetchEvents();
      } else if (section === 'reservations') {
        this.loadReservations();
      } else if (section === 'statistiques') {
        this.loadStatistics();
      } else if (section === 'listPrestataire') {
        this.loadPrestataires();
      }
    },
    async fetchEvents() {
      try {
        const data = await organisationService.getEvents();
        this.events = data;
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        alert("Erreur lors de la récupération des événements.");
      }
    },
    async loadReservations() {
      try {
        const data = await organisationService.getReservations();
        this.reservations = data;
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations :", error);
        alert("Erreur lors de la récupération des réservations.");
      }
    },
    async loadStatistics() {
      try {
        const data = await organisationService.getStatistics();
        this.totalEvents = data.totalEvents;
        this.totalParticipants = data.totalParticipants;
        this.totalTicketPrestataire = data.totalTicketPrestataire;
        this.participantsData = data.participantsByEvent ? JSON.parse(JSON.stringify(data.participantsByEvent)) : [];
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        alert("Erreur lors de la récupération des statistiques.");
      }
    },
    async loadPrestataires() {
      try {
        const data = await organisationService.getPrestataires();
        this.prestataires = data;
      } catch (error) {
        console.error("Erreur lors de la récupération des prestataires :", error);
        alert("Erreur lors de la récupération des prestataires.");
      }
    },
    async handleCreateEvent(eventData) {
      try {
        await organisationService.createEvent(eventData);
        alert("Événement créé avec succès.");
        this.updateSection('events');
      } catch (error) {
        console.error("Erreur lors de la création de l'événement :", error);
        alert("Erreur lors de la création de l'événement.");
      }
    },
    async handleUpdateEvent(eventData) {
      try {
        await organisationService.updateEvent(this.editingEventId, eventData);
        alert("Événement mis à jour avec succès.");
        this.updateSection('events');
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'événement :", error);
        alert("Erreur lors de la mise à jour de l'événement.");
      }
    },
    handleEditEvent(event) {
      this.editingEventId = event.id;
      this.currentEventData = {
        courseName: event.name,
        eventDate: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        eventPrice: event.prix,
        horaireDebut: event.heure_debut,
        horaireFin: event.heure_fin,
        eventDescription: event.description,
        eventImage: event.image,
      };
      this.currentSection = 'modifyEvent';
    },
    async handleDeleteEvent(eventId) {
      if (confirm("Êtes-vous sûr de vouloir supprimer cet activitée ?")) {
        try {
          await organisationService.deleteEvent(eventId);
          alert("Activitée supprimé avec succès.");
          await this.fetchEvents();
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          alert("Erreur lors de la suppression de l'activitée.");
        }
      }
    },
    async handleChangeStatus(reservationId, newStatus) {
      try {
        await organisationService.updateReservationStatus(reservationId, newStatus);
        alert("Statut mis à jour avec succès.");
        await this.loadReservations();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut :", error);
        alert("Erreur lors de la mise à jour du statut.");
      }
    },
    async handleDeleteReservation(reservationId) {
      if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
        try {
          await organisationService.deleteReservation(reservationId);
          alert("Réservation supprimée avec succès.");
          await this.loadReservations();
        } catch (error) {
          console.error("Erreur lors de la suppression de la réservation :", error);
          alert("Erreur lors de la suppression de la réservation.");
        }
      }
    },
    async handleChangeService(prestataireId, newType) {
      try {
        await organisationService.updatePrestataire(prestataireId, newType);
        alert("Service mis à jour avec succès.");
        await this.loadPrestataires();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du service :", error);
        alert("Erreur lors de la mise à jour du service.");
      }
    },
  },
};
</script>

<style scoped src="../styles/OrganisationPage.css">
/* Styles pour la sidebar */
</style>
