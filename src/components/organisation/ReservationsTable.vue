<!-- frontend/src/components/organisation/ReservationsTable.vue -->
<template>
  <section class="reservations-section-orga">
    <!-- Section Réservations de Services -->
    <h2>Demande de services</h2>
    <div class="filter-bar">
      <label for="service-status-filter">Filtrer par statut :</label>
      <select id="service-status-filter" v-model="serviceStatusFilter">
        <option value="">Tous</option>
        <option value="EN ATTENTE">En attente</option>
        <option value="ACCEPTÉ">Accepté</option>
      </select>
    </div>
    <div class="reservations-table">
      <table>
        <thead>
        <tr>
          <th @click="sortServices('id_service')">
            ID Demande
            <font-awesome-icon :icon="getSortIcon('id_service', 'services')" />
          </th>
          <th @click="sortServices('prestataire_id')">
            ID Utilisateur
            <font-awesome-icon :icon="getSortIcon('prestataire_id', 'services')" />
          </th>
          <th @click="sortServices('prestataire_nom')">
            Nom
            <font-awesome-icon :icon="getSortIcon('prestataire_nom', 'services')" />
          </th>
          <th @click="sortServices('prestataire_prenom')">
            Prénom
            <font-awesome-icon :icon="getSortIcon('prestataire_prenom', 'services')" />
          </th>
          <th @click="sortServices('prestataire_mail')">
            Email
            <font-awesome-icon :icon="getSortIcon('prestataire_mail', 'services')" />
          </th>
          <th @click="sortServices('id_stand')">
            ID Emplacement
            <font-awesome-icon :icon="getSortIcon('id_stand', 'services')" />
          </th>
          <th @click="sortServices('date_service')">
            Date
            <font-awesome-icon :icon="getSortIcon('date_service', 'services')" />
          </th>
          <th @click="sortServices('heure_ouverture')">
            Horaire
            <font-awesome-icon :icon="getSortIcon('heure_ouverture', 'services')" />
          </th>
          <th @click="sortServices('statut_service')">
            Statut
            <font-awesome-icon :icon="getSortIcon('statut_service', 'services')" />
          </th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="reservation in filteredServices" :key="reservation.id_service">
          <td>{{ reservation.id_service }}</td>
          <td>{{ reservation.prestataire_id }}</td>
          <td>{{ reservation.prestataire_nom || 'N/A' }}</td>
          <td>{{ reservation.prestataire_prenom || 'N/A' }}</td>
          <td>{{ reservation.prestataire_mail || 'N/A' }}</td>
          <td>{{ reservation.id_stand || 'Non spécifié' }}</td>
          <td>{{ reservation.date_service ? new Date(reservation.date_service).toLocaleDateString() : 'N/A' }}</td>
          <td>
            {{ reservation.type_service === 'continu'
              ? `${reservation.heure_ouverture || 'N/A'} - ${reservation.heure_fermeture || 'N/A'}`
              : reservation.heure_commencement || 'N/A' }}
          </td>
          <td>
              <span :class="['reservation-status', reservation.statut_service?.toLowerCase() || 'na']">
                {{ reservation.statut_service || 'N/A' }}
              </span>
          </td>
          <td class="actions-cell">
            <select
                v-if="reservation.statut_service === 'EN ATTENTE'"
                @change="$emit('change-status', reservation.id_service, $event.target.value)"
                class="status-select"
            >
              <option value="EN ATTENTE" :selected="reservation.statut_service === 'EN ATTENTE'">En attente</option>
              <option value="ACCEPTÉ" :selected="reservation.statut_service === 'ACCEPTÉ'">Accepter</option>
            </select>
            <button
                v-if="reservation.statut_service === 'EN ATTENTE'"
                class="btn-delete"
                @click="$emit('delete-reservation', reservation.id_service)"
            >
              <font-awesome-icon icon="trash" />
            </button>
            <button
                v-if="reservation.statut_service === 'ACCEPTÉ'"
                class="btn-edit"
                @click="openEditModal(reservation, 'service')"
            >
              <font-awesome-icon icon="edit" />
            </button>
            <button class="btn-details" @click="toggleDetails(reservation)">
              <font-awesome-icon icon="eye" />
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="filteredServices.length === 0" class="no-data">
        <p>Aucune réservation de service trouvée.</p>
      </div>
    </div>

    <!-- Section Réservations d'Emplacements -->
    <h2>Demande d'emplacements</h2>
    <div class="filter-bar">
      <label for="stand-status-filter">Filtrer par statut :</label>
      <select id="stand-status-filter" v-model="standStatusFilter">
        <option value="">Tous</option>
        <option value="EN ATTENTE">En attente</option>
        <option value="RÉSERVÉ">Réservé</option>
      </select>
    </div>
    <div class="reservations-table">
      <table>
        <thead>
        <tr>
          <th @click="sortStands('id_emplacement')">
            ID Emplacement
            <font-awesome-icon :icon="getSortIcon('id_emplacement', 'stands')" />
          </th>
          <th @click="sortStands('nom_emplacement')">
            Nom Emplacement
            <font-awesome-icon :icon="getSortIcon('nom_emplacement', 'stands')" />
          </th>
          <th @click="sortStands('utilisateur_id')">
            ID Utilisateur
            <font-awesome-icon :icon="getSortIcon('utilisateur_id', 'stands')" />
          </th>
          <th @click="sortStands('nom_utilisateur')">
            Nom
            <font-awesome-icon :icon="getSortIcon('nom_utilisateur', 'stands')" />
          </th>
          <th @click="sortStands('prenom_utilisateur')">
            Prénom
            <font-awesome-icon :icon="getSortIcon('prenom_utilisateur', 'stands')" />
          </th>
          <th @click="sortStands('mail_utilisateur')">
            Email
            <font-awesome-icon :icon="getSortIcon('mail_utilisateur', 'stands')" />
          </th>
          <th @click="sortStands('date_reservation')">
            Date Réservation
            <font-awesome-icon :icon="getSortIcon('date_reservation', 'stands')" />
          </th>
          <th @click="sortStands('statut')">
            Statut
            <font-awesome-icon :icon="getSortIcon('statut', 'stands')" />
          </th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="stand in filteredStands" :key="stand.id_emplacement">
          <td>{{ stand.id_emplacement }}</td>
          <td>{{ stand.nom_emplacement }}</td>
          <td>{{ stand.utilisateur_id || 'Non attribué' }}</td>
          <td>{{ stand.nom_utilisateur || 'N/A' }}</td>
          <td>{{ stand.prenom_utilisateur || 'N/A' }}</td>
          <td>{{ stand.mail_utilisateur || 'N/A' }}</td>
          <td>{{ stand.date_reservation ? new Date(stand.date_reservation).toLocaleDateString() : 'Non définie' }}</td>
          <td>
              <span :class="['reservation-status', stand.statut?.toLowerCase() || 'na']">
                {{ stand.statut || 'N/A' }}
              </span>
          </td>
          <td class="actions-cell">
            <select
                v-if="stand.statut === 'EN ATTENTE'"
                @change="$emit('change-stand-status', stand.id_emplacement, $event.target.value)"
                class="status-select"
            >
              <option value="EN ATTENTE" :selected="stand.statut === 'EN ATTENTE'">En attente</option>
              <option value="RÉSERVÉ" :selected="stand.statut === 'RÉSERVÉ'">Réservé</option>
              <option value="LIBRE" :selected="stand.statut === 'LIBRE'">Libre</option>
            </select>
            <button
                v-if="stand.statut === 'EN ATTENTE'"
                class="btn-delete"
                @click="$emit('delete-stand-reservation', stand.id_emplacement)"
            >
              <font-awesome-icon icon="trash" />
            </button>
            <button
                v-if="stand.statut === 'RÉSERVÉ'"
                class="btn-edit"
                @click="openEditModal(stand, 'stand')"
            >
              <font-awesome-icon icon="edit" />
            </button>
            <button class="btn-details" @click="toggleStandDetails(stand)">
              <font-awesome-icon icon="eye" />
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="filteredStands.length === 0" class="no-data">
        <p>Aucune réservation d'emplacement trouvée.</p>
      </div>
    </div>

    <!-- Section Liste de tous les stands -->
    <div class="stand-list-toggle">
      <button @click="toggleStandList" class="stand-list-btn">
        Liste stand
        <font-awesome-icon :icon="showStandList ? 'chevron-up' : 'chevron-down'" />
      </button>
    </div>

    <transition name="fade">
      <div v-if="showStandList" class="stand-list-section">
        <h3>Tous les stands</h3>
        <div v-if="allStands && allStands.length > 0" class="reservations-table">
          <table>
            <thead>
            <tr>
              <th @click="sortAllStands('id_emplacement')">
                ID Emplacement
                <font-awesome-icon :icon="getSortIcon('id_emplacement', 'allStands')" />
              </th>
              <th @click="sortAllStands('nom_emplacement')">
                Nom Emplacement
                <font-awesome-icon :icon="getSortIcon('nom_emplacement', 'allStands')" />
              </th>
              <th @click="sortAllStands('statut')">
                Statut
                <font-awesome-icon :icon="getSortIcon('statut', 'allStands')" />
              </th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="stand in sortedAllStands" :key="stand.id_emplacement">
              <td>{{ stand.id_emplacement }}</td>
              <td>{{ stand.nom_emplacement }}</td>
              <td>
                  <span :class="['reservation-status', stand.statut?.toLowerCase() || 'na']">
                    {{ stand.statut || 'N/A' }}
                  </span>
              </td>
              <td class="actions-cell">
                <button class="btn-details" @click="toggleStandDetails(stand)">
                  <font-awesome-icon icon="eye" />
                </button>
              </td>
            </tr>
            </tbody>
          </table>
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
                <span>Type: {{ selectedReservation.type_service || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="money-bill" class="detail-icon" />
                <span>Prix: {{ selectedReservation.prix_moyen || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="credit-card" class="detail-icon" />
                <span>Carte: {{ selectedReservation.carte_banquaire || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="eye" class="detail-icon" />
                <span>Visibilité: {{ selectedReservation.visibilite ? 'Oui' : 'Non' }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="chart-line" class="detail-icon" />
                <span>Statut: {{ selectedReservation.statut_service_prestataire || 'N/A' }}</span>
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
                <span>Statut: {{ selectedStand.statut || 'N/A' }}</span>
              </div>
              <div class="detail-item" v-if="selectedStand.utilisateur_id">
                <font-awesome-icon icon="user" class="detail-icon" />
                <span>Réservé par: {{ selectedStand.prenom_utilisateur || 'N/A' }} {{ selectedStand.nom_utilisateur || 'N/A' }}</span>
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

    <!-- Modal pour modifier le statut -->
    <transition name="modal-fade">
      <div v-if="editModalVisible" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Modifier le statut</h3>
            <button class="close-btn" @click="closeEditModal">×</button>
          </div>
          <div class="modal-body">
            <label for="edit-status-select">Nouveau statut :</label>
            <select
                id="edit-status-select"
                v-model="newStatus"
                class="status-select"
            >
              <option v-if="editItemType === 'service'" value="EN ATTENTE">En attente</option>
              <option v-if="editItemType === 'service'" value="ACCEPTÉ">Accepté</option>
              <option v-if="editItemType === 'stand'" value="EN ATTENTE">En attente</option>
              <option v-if="editItemType === 'stand'" value="RÉSERVÉ">Réservé</option>
              <option v-if="editItemType === 'stand'" value="LIBRE">Libre</option>
            </select>
            <div class="modal-actions">
              <button class="btn-confirm" @click="confirmStatusChange">Confirmer</button>
              <button class="btn-cancel" @click="closeEditModal">Annuler</button>
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
      serviceStatusFilter: '',
      standStatusFilter: '',
      sortKey: {
        services: '',
        stands: '',
        allStands: '',
      },
      sortOrder: {
        services: 1,
        stands: 1,
        allStands: 1,
      },
      editModalVisible: false,
      editItem: null,
      editItemType: null,
      newStatus: '',
    };
  },
  computed: {
    filteredServices() {
      let filtered = [...this.reservations];
      if (this.serviceStatusFilter) {
        filtered = filtered.filter(res => res.statut_service === this.serviceStatusFilter);
      }
      return this.sortData(filtered, this.sortKey.services, this.sortOrder.services);
    },
    filteredStands() {
      let filtered = [...this.standReservations];
      if (this.standStatusFilter) {
        filtered = filtered.filter(stand => stand.statut === this.standStatusFilter);
      }
      return this.sortData(filtered, this.sortKey.stands, this.sortOrder.stands);
    },
    sortedAllStands() {
      return this.sortData([...this.allStands], this.sortKey.allStands, this.sortOrder.allStands);
    },
  },
  methods: {
    sortData(data, key, order) {
      if (!key) return data;
      return data.sort((a, b) => {
        let valA = a[key] || '';
        let valB = b[key] || '';
        if (key === 'date_service' || key === 'date_reservation') {
          valA = valA ? new Date(valA).getTime() : 0;
          valB = valB ? new Date(valB).getTime() : 0;
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase();
        } else if (typeof valB === 'string') {
          valB = valB.toLowerCase();
        }
        if (valA < valB) return -1 * order;
        if (valA > valB) return 1 * order;
        return 0;
      });
    },
    sortServices(key) {
      if (this.sortKey.services === key) {
        this.sortOrder.services *= -1;
      } else {
        this.sortKey.services = key;
        this.sortOrder.services = 1;
      }
    },
    sortStands(key) {
      if (this.sortKey.stands === key) {
        this.sortOrder.stands *= -1;
      } else {
        this.sortKey.stands = key;
        this.sortOrder.stands = 1;
      }
    },
    sortAllStands(key) {
      if (this.sortKey.allStands === key) {
        this.sortOrder.allStands *= -1;
      } else {
        this.sortKey.allStands = key;
        this.sortOrder.allStands = 1;
      }
    },
    getSortIcon(key, type) {
      if (this.sortKey[type] === key) {
        return this.sortOrder[type] === 1 ? 'sort-up' : 'sort-down';
      }
      return 'sort';
    },
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
    openEditModal(item, type) {
      this.editItem = item;
      this.editItemType = type;
      this.newStatus = item.statut_service || item.statut || '';
      this.editModalVisible = true;
    },
    closeEditModal() {
      this.editModalVisible = false;
      this.editItem = null;
      this.editItemType = null;
      this.newStatus = '';
    },
    confirmStatusChange() {
      if (this.editItemType === 'service') {
        this.$emit('change-status', this.editItem.id_service, this.newStatus);
      } else if (this.editItemType === 'stand') {
        this.$emit('change-stand-status', this.editItem.id_emplacement, this.newStatus);
      }
      this.closeEditModal();
    },
  },
};
</script>

<style scoped src="../../styles/OrgaStyle/ReservationsTable.css"></style>