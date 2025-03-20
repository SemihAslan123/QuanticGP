<!-- frontend/src/views/OrganisationView.vue -->
<template>
  <div class="dashboard-orga">
    <OrganisationSidebar :currentSection="currentSection" @update-section="updateSection" />
    <main class="content-orga">
      <header>
        <h1>Gestion</h1>
      </header>
      <div v-if="currentSection === 'dashboard'" class="dashboard-section">
        <div class="dashboard-card" @click="updateSection('events')">
          <font-awesome-icon icon="calendar-alt" />
          <h3>Événements</h3>
          <p>{{ totalEvents }}</p>
        </div>
        <div class="dashboard-card">
          <font-awesome-icon icon="users" />
          <h3>Participants</h3>
          <p>{{ totalParticipants }}</p>
        </div>
        <div class="dashboard-card">
          <font-awesome-icon icon="ticket-alt" />
          <h3>Billets Vendus</h3>
          <p>{{ totalTickets }}</p>
        </div>
        <div class="dashboard-card">
          <font-awesome-icon icon="concierge-bell" />
          <h3>Services Prestataires</h3>
          <p>{{ totalServices }}</p>
        </div>
      </div>
      <EventForm v-if="currentSection === 'event'" :editing="false" @save-event="handleCreateEvent" @show-events="updateSection('events')" />
      <EventForm v-if="currentSection === 'modifyEvent'" :editing="true" :initialData="currentEventData" @save-event="handleUpdateEvent" />
      <EventsList v-if="currentSection === 'events'" :events="events" @edit-event="handleEditEvent" @delete-event="handleDeleteEvent" @back-to-create="updateSection('event')" />
      <ReservationsTable
          v-if="currentSection === 'reservations'"
          :reservations="reservations"
          :stand-reservations="standReservations"
          :all-stands="allStands"
      @change-status="handleChangeStatus"
      @delete-reservation="handleDeleteReservation"
      @change-stand-status="handleChangeStandStatus"
      @delete-stand-reservation="handleDeleteStandReservation"
      @back="updateSection('dashboard')"
      />
      <StatisticsChart
          v-if="currentSection === 'statistiques'"
          :totalEvents="totalEvents"
          :totalParticipants="totalParticipants"
          :totalTicketPrestataire="totalTicketPrestataire"
          :totalServices="totalServices"
          :totalTickets="totalTickets"
          :participantsData="participantsData"
          :servicesByType="servicesByType"
      />
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
      currentSection: 'dashboard',
      events: [],
      reservations: [],
      standReservations: [],
      allStands: [], // Changé de availableStands à allStands
      prestataires: [],
      totalEvents: 0,
      totalParticipants: 0,
      totalTicketPrestataire: 0,
      totalServices: 0,
      totalTickets: 0,
      participantsData: [],
      servicesByType: [],
      currentEventData: {},
      editingEventId: null,
    };
  },
  mounted() {
    if (this.currentSection === 'statistiques' || this.currentSection === 'dashboard') {
      this.loadStatistics();
    }
  },
  methods: {
    updateSection(section) {
      console.log("Section mise à jour :", section);
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
        const serviceData = await organisationService.getReservations();
        this.reservations = serviceData;

        const standData = await organisationService.getStandReservations();
        this.standReservations = standData;

        const allStandsData = await organisationService.getAllStands(); // Changé de getAvailableStands à getAllStands
        this.allStands = allStandsData;
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
        this.totalServices = data.totalServices;
        this.totalTickets = data.totalTickets;
        this.participantsData = data.participantsByEvent || [];
        this.servicesByType = data.servicesByType || [];
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
      if (confirm("Êtes-vous sûr de vouloir supprimer cet activité ?")) {
        try {
          await organisationService.deleteEvent(eventId);
          alert("Activité supprimée avec succès.");
          await this.fetchEvents();
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          alert("Erreur lors de la suppression de l'activité.");
        }
      }
    },
    async handleChangeStatus(reservationId, newStatus) {
      try {
        await organisationService.updateReservationStatus(reservationId, newStatus.toUpperCase());
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
    async handleChangeStandStatus(standId, newStatus) {
      try {
        await organisationService.updateStandStatus(standId, newStatus.toUpperCase());
        alert("Statut de l'emplacement mis à jour avec succès.");
        await this.loadReservations();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du statut de l'emplacement :", error);
        alert("Erreur lors de la mise à jour du statut de l'emplacement.");
      }
    },
    async handleDeleteStandReservation(standId) {
      if (confirm("Êtes-vous sûr de vouloir rejeter cette réservation d'emplacement ?")) {
        try {
          await organisationService.deleteStandReservation(standId);
          alert("Réservation d'emplacement rejetée avec succès.");
          await this.loadReservations();
        } catch (error) {
          console.error("Erreur lors du rejet de la réservation d'emplacement :", error);
          alert("Erreur lors du rejet de la réservation d'emplacement.");
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

<style scoped src="../styles/OrgaStyle/OrganisationView.css"></style>