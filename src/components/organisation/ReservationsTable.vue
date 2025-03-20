<!-- frontend/src/components/organisation/ReservationsTable.vue -->
<template>
  <section class="reservations-section-orga">
    <!-- Section Réservations de Services -->
    <h2>Demande de services</h2>
    <div v-if="reservations && reservations.length > 0" class="reservations-grid">
      <div v-for="reservation in reservations" :key="reservation.id_reservation" class="reservation-card">
        <div class="reservation-info">
          <span class="info-label">ID Demande:</span> {{ reservation.id_reservation }}
        </div>
        <div class="reservation-info">
          <span class="info-label">ID Utilisateur:</span> {{ reservation.id_utilisateur }}
        </div>
        <div class="reservation-info">
          <span class="info-label">Nom:</span> {{ reservation.nom_utilisateur }}
        </div>
        <div class="reservation-info">
          <span class="info-label">Prénom:</span> {{ reservation.prenom_utilisateur }}
        </div>
        <div class="reservation-info">
          <span class="info-label">Email:</span> {{ reservation.mail_utilisateur || 'N/A' }}
        </div>
        <div class="reservation-info">
          <span class="info-label">ID Emplacement:</span> {{ reservation.id_stand || 'Non spécifié' }}
        </div>
        <div class="reservation-info">
          <span class="info-label">Date:</span> {{ new Date(reservation.date_reservation).toLocaleDateString() }}
        </div>
        <div class="reservation-info">
          <span class="info-label">Heure Début:</span> {{ reservation.heure_debut }}
        </div>
        <div class="reservation-info">
          <span class="info-label">Statut:</span>
          <span :class="['reservation-status', reservation.statut.toLowerCase()]">
            {{ reservation.statut }}
          </span>
        </div>
        <div class="actions-cell">
          <select @change="$emit('change-status', reservation.id_reservation, $event.target.value)" class="status-select">
            <option value="EN ATTENTE" :selected="reservation.statut === 'EN ATTENTE'">En attente</option>
            <option value="RÉSERVÉ" :selected="reservation.statut === 'RÉSERVÉ'">Réservé</option>
          </select>
          <button class="btn-delete" @click="$emit('delete-reservation', reservation.id_reservation)">Rejeter</button>
          <button class="btn-details" @click="toggleDetails(reservation)">Détails</button>
        </div>
      </div>
    </div>
    <div v-if="!reservations || reservations.length === 0" class="no-data">
      <p>Aucune réservation de service trouvée.</p>
    </div>

    <!-- Section Réservations d'Emplacements -->
    <h2>Demande d'emplacements</h2>
    <div v-if="standReservations && standReservations.length > 0" class="reservations-grid">
      <div v-for="stand in standReservations" :key="stand.id_emplacement" class="reservation-card">
        <div class="reservation-info">
          <span class="info-label">ID Emplacement:</span> {{ stand.id_emplacement }}
        </div>
        <div class="reservation-info">
          <span class="info-label">Nom Emplacement:</span> {{ stand.nom_emplacement }}
        </div>
        <div class="reservation-info">
          <span class="info-label">ID Utilisateur:</span> {{ stand.utilisateur_id || 'Non attribué' }}
        </div>
        <div class="reservation-info">
          <span class="info-label">Nom:</span> {{ stand.nom_utilisateur || 'N/A' }}
        </div>
        <div class="reservation-info">
          <span class="info-label">Prénom:</span> {{ stand.prenom_utilisateur || 'N/A' }}
        </div>
        <div class="reservation-info">
          <span class="info-label">Email:</span> {{ stand.mail_utilisateur || 'N/A' }}
        </div>
        <div class="reservation-info">
          <span class="info-label">Date Réservation:</span> {{ stand.date_reservation ? new Date(stand.date_reservation).toLocaleDateString() : 'Non définie' }}
        </div>
        <div class="reservation-info">
          <span class="info-label">Statut:</span>
          <span :class="['reservation-status', stand.statut.toLowerCase()]">
            {{ stand.statut }}
          </span>
        </div>
        <div class="actions-cell">
          <select @change="$emit('change-stand-status', stand.id_emplacement, $event.target.value)" class="status-select">
            <option value="EN ATTENTE" :selected="stand.statut === 'EN ATTENTE'">En attente</option>
            <option value="RÉSERVÉ" :selected="stand.statut === 'RÉSERVÉ'">Réservé</option>
            <option value="LIBRE" :selected="stand.statut === 'LIBRE'">Libre</option>
          </select>
          <button class="btn-delete" @click="$emit('delete-stand-reservation', stand.id_emplacement)">Rejeter</button>
        </div>
      </div>
    </div>
    <div v-if="!standReservations || standReservations.length === 0" class="no-data">
      <p>Aucune réservation d'emplacement trouvée.</p>
    </div>

    <!-- Bouton Liste Stand avec flèche -->
    <div class="stand-list-toggle">
      <button @click="toggleStandList" class="stand-list-btn">
        Liste stand
        <font-awesome-icon :icon="showStandList ? 'chevron-up' : 'chevron-down'" />
      </button>
    </div>

    <!-- Section Liste de tous les stands -->
    <transition name="fade">
      <div v-if="showStandList" class="stand-list-section">
        <h3>Tous les stands</h3>
        <div v-if="allStands && allStands.length > 0" class="reservations-grid">
          <div v-for="stand in allStands" :key="stand.id_emplacement" class="reservation-card">
            <div class="reservation-info">
              <span class="info-label">ID Emplacement:</span> {{ stand.id_emplacement }}
            </div>
            <div class="reservation-info">
              <span class="info-label">Nom Emplacement:</span> {{ stand.nom_emplacement }}
            </div>
            <div class="reservation-info">
              <span class="info-label">Statut:</span>
              <span :class="['reservation-status', stand.statut.toLowerCase()]">
                {{ stand.statut }}
              </span>
            </div>
            <div class="actions-cell">
              <button class="btn-details" @click="toggleStandDetails(stand)">Détails</button>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <p>Aucun stand trouvé.</p>
        </div>
      </div>
    </transition>

    <button @click="$emit('back')" class="button-back-orga">Retour</button>

    <!-- Modal pour les détails des services -->
    <transition name="modal-fade">
      <div v-if="selectedReservation" class="modal-overlay" @click.self="hideDetails">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ selectedReservation.nom_service }}</h3>
            <button class="close-btn" @click="hideDetails">×</button>
          </div>
          <div class="modal-body">
            <p class="service-description">{{ selectedReservation.description_service || 'Service prestataire' }}</p>
            <p class="event-description">
              <strong>Description de l'événement :</strong> {{ selectedReservation.description_evenement || 'Aucune description disponible' }}
            </p>
            <div class="details-grid">
              <div class="detail-item">
                <font-awesome-icon icon="clipboard" class="detail-icon" />
                <span>Type: {{ selectedReservation.type_service }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="money-bill" class="detail-icon" />
                <span>Prix: {{ selectedReservation.prix_moyen }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="credit-card" class="detail-icon" />
                <span>Carte: {{ selectedReservation.carte_banquaire }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="eye" class="detail-icon" />
                <span>Visibilité: {{ selectedReservation.visibilite ? 'Oui' : 'Non' }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="chart-line" class="detail-icon" />
                <span>Statut: {{ selectedReservation.statut_service_prestataire }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal pour les détails des stands -->
    <transition name="modal-fade">
      <div v-if="selectedStand" class="modal-overlay" @click.self="hideStandDetails">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ selectedStand.nom_emplacement }}</h3>
            <button class="close-btn" @click="hideStandDetails">×</button>
          </div>
          <div class="modal-body">
            <div class="details-grid">
              <div class="detail-item">
                <font-awesome-icon icon="map-marker-alt" class="detail-icon" />
                <span>ID Emplacement: {{ selectedStand.id_emplacement }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="info-circle" class="detail-icon" />
                <span>Statut: {{ selectedStand.statut }}</span>
              </div>
              <div class="detail-item" v-if="selectedStand.utilisateur_id">
                <font-awesome-icon icon="user" class="detail-icon" />
                <span>Réservé par: {{ selectedStand.prenom_utilisateur }} {{ selectedStand.nom_utilisateur }}</span>
              </div>
              <div class="detail-item" v-if="selectedStand.utilisateur_id">
                <font-awesome-icon icon="envelope" class="detail-icon" />
                <span>Email: {{ selectedStand.mail_utilisateur || 'N/A' }}</span>
              </div>
              <div class="detail-item" v-if="selectedStand.date_reservation">
                <font-awesome-icon icon="calendar-alt" class="detail-icon" />
                <span>Date de réservation: {{ new Date(selectedStand.date_reservation).toLocaleDateString() }}</span>
              </div>
              <div class="detail-item" v-if="!selectedStand.utilisateur_id">
                <font-awesome-icon icon="user-slash" class="detail-icon" />
                <span>Non réservé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'ReservationsTable',
  props: {
    reservations: {
      type: Array,
      default: () => [],
    },
    standReservations: {
      type: Array,
      default: () => [],
    },
    allStands: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedReservation: null,
      selectedStand: null,
      showStandList: false,
    };
  },
  methods: {
    toggleDetails(reservation) {
      this.selectedReservation = this.selectedReservation === reservation ? null : reservation;
    },
    hideDetails() {
      this.selectedReservation = null;
    },
    toggleStandList() {
      this.showStandList = !this.showStandList;
    },
    toggleStandDetails(stand) {
      this.selectedStand = this.selectedStand === stand ? null : stand;
    },
    hideStandDetails() {
      this.selectedStand = null;
    },
  },
};
</script>

<style scoped src="../../styles/OrgaStyle/ReservationsTable.css"></style>