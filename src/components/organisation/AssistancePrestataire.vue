<!-- frontend/src/components/organisation/AssistancePrestataire.vue -->
<template>
  <section class="assistance-section-orga">
    <!-- Section Assistance Prestataires -->
    <h2>Demande d'assistance</h2>
    <div class="filter-bar">
      <label for="status-filter">Filtrer par statut :</label>
      <select id="status-filter" v-model="statusFilter">
        <option value="">Tous</option>
        <option value="EN ATTENTE">En attente</option>
        <option value="ACCEPTÉ">Accepté</option>
        <option value="REFUSÉ">Refusé</option>
      </select>
    </div>
    <div class="assistance-table">
      <table>
        <thead>
        <tr>
          <th @click="sortDemandes('id_demande')">
            ID Demande
            <font-awesome-icon :icon="getSortIcon('id_demande', 'demandes')" />
          </th>
          <th @click="sortDemandes('nom_utilisateur')">
            Nom
            <font-awesome-icon :icon="getSortIcon('nom_utilisateur', 'demandes')" />
          </th>
          <th @click="sortDemandes('prenom_utilisateur')">
            Prénom
            <font-awesome-icon :icon="getSortIcon('prenom_utilisateur', 'demandes')" />
          </th>
          <th @click="sortDemandes('mail_utilisateur')">
            Email
            <font-awesome-icon :icon="getSortIcon('mail_utilisateur', 'demandes')" />
          </th>
          <th @click="sortDemandes('date_demande')">
            Date
            <font-awesome-icon :icon="getSortIcon('date_demande', 'demandes')" />
          </th>
          <th @click="sortDemandes('statut_demande')">
            Statut
            <font-awesome-icon :icon="getSortIcon('statut_demande', 'demandes')" />
          </th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="demande in filteredDemandes" :key="demande.id_demande">
          <td>{{ demande.id_demande }}</td>
          <td>{{ demande.nom_utilisateur || 'N/A' }}</td>
          <td>{{ demande.prenom_utilisateur || 'N/A' }}</td>
          <td>{{ demande.mail_utilisateur || 'N/A' }}</td>
          <td>{{ demande.date_demande ? new Date(demande.date_demande).toLocaleDateString() : 'N/A' }}</td>
          <td>
              <span :class="['reservation-status', demande.statut_demande?.toLowerCase() || 'na']">
                {{ demande.statut_demande || 'N/A' }}
              </span>
          </td>
          <td class="actions-cell">
            <select
                v-if="demande.statut_demande === 'EN ATTENTE'"
                @change="changeStatus(demande.id_demande, $event.target.value)"
                class="status-select"
            >
              <option value="EN ATTENTE" :selected="demande.statut_demande === 'EN ATTENTE'">En attente</option>
              <option value="ACCEPTÉ" :selected="demande.statut_demande === 'ACCEPTÉ'">Accepté</option>
              <option value="REFUSÉ" :selected="demande.statut_demande === 'REFUSÉ'">Refusé</option>
            </select>
            <button
                v-if="demande.statut_demande === 'EN ATTENTE'"
                class="btn-delete"
                @click="deleteDemande(demande.id_demande)"
            >
              <font-awesome-icon icon="trash" />
            </button>
            <button
                v-if="demande.statut_demande === 'ACCEPTÉ' || demande.statut_demande === 'REFUSÉ'"
                class="btn-edit"
                @click="openEditModal(demande, 'demande')"
            >
              <font-awesome-icon icon="edit" />
            </button>
            <button class="btn-details" @click="toggleDetails(demande)">
              <font-awesome-icon icon="eye" />
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="filteredDemandes.length === 0" class="no-data">
        <p>Aucune demande d'assistance trouvée.</p>
      </div>
    </div>

    <button @click="$emit('back')" class="button-back-orga">Retour</button>

    <!-- Modal pour les détails des demandes -->
    <transition name="modal-fade">
      <div v-if="selectedDemande" class="modal-overlay" @click.self="hideDetails">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ selectedDemande.prenom_utilisateur }} {{ selectedDemande.nom_utilisateur }}</h3>
            <button class="close-btn" @click="hideDetails">×</button>
          </div>
          <div class="modal-body">
            <div class="details-grid">
              <div class="detail-item">
                <font-awesome-icon icon="id-badge" class="detail-icon" />
                <span>ID Demande: {{ selectedDemande.id_demande }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="user" class="detail-icon" />
                <span>Nom: {{ selectedDemande.nom_utilisateur || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="user" class="detail-icon" />
                <span>Prénom: {{ selectedDemande.prenom_utilisateur || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="envelope" class="detail-icon" />
                <span>Email: {{ selectedDemande.mail_utilisateur || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="calendar-alt" class="detail-icon" />
                <span>Date: {{ selectedDemande.date_demande ? new Date(selectedDemande.date_demande).toLocaleDateString() : 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="info-circle" class="detail-icon" />
                <span>Statut: {{ selectedDemande.statut_demande || 'N/A' }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="comment" class="detail-icon" />
                <span>Présentation: {{ selectedDemande.presentation || 'Non fournie' }}</span>
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
              <option value="EN ATTENTE">En attente</option>
              <option value="ACCEPTÉ">Accepté</option>
              <option value="REFUSÉ">Refusé</option>
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
import organisationService from '@/../backend/services/organisation.service';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faEye,
  faEdit,
  faTrash,
  faSortUp,
  faSortDown,
  faSort,
  faIdBadge,
  faUser,
  faEnvelope,
  faCalendarAlt,
  faInfoCircle,
  faComment
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faEye, faEdit, faTrash, faSortUp, faSortDown, faSort, faIdBadge, faUser, faEnvelope, faCalendarAlt, faInfoCircle, faComment);

export default {
  name: 'AssistancePrestataire',
  components: {
    FontAwesomeIcon,
  },
  props: {
    demandes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedDemande: null,
      statusFilter: '',
      sortKey: {
        demandes: '',
      },
      sortOrder: {
        demandes: 1,
      },
      editModalVisible: false,
      editItem: null,
      editItemType: null,
      newStatus: '',
      localDemandes: [], // Pour stocker localement les données si pas passées via props
    };
  },
  computed: {
    filteredDemandes() {
      let filtered = [...(this.demandes.length ? this.demandes : this.localDemandes)];
      if (this.statusFilter) {
        filtered = filtered.filter(demande => demande.statut_demande === this.statusFilter);
      }
      return this.sortData(filtered, this.sortKey.demandes, this.sortOrder.demandes);
    },
  },
  async created() {
    if (!this.demandes.length) {
      await this.fetchDemandes();
    }
  },
  methods: {
    async fetchDemandes() {
      try {
        const demandes = await organisationService.getDemandes();
        this.localDemandes = demandes || [];
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes :', error);
        this.localDemandes = [];
      }
    },
    sortData(data, key, order) {
      if (!key) return data;
      return data.sort((a, b) => {
        let valA = a[key] || '';
        let valB = b[key] || '';
        if (key === 'date_demande') {
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
    sortDemandes(key) {
      if (this.sortKey.demandes === key) {
        this.sortOrder.demandes *= -1;
      } else {
        this.sortKey.demandes = key;
        this.sortOrder.demandes = 1;
      }
    },
    getSortIcon(key, type) {
      if (this.sortKey[type] === key) {
        return this.sortOrder[type] === 1 ? 'sort-up' : 'sort-down';
      }
      return 'sort';
    },
    toggleDetails(demande) {
      this.selectedDemande = this.selectedDemande === demande ? null : demande;
    },
    hideDetails() {
      this.selectedDemande = null;
    },
    openEditModal(item, type) {
      this.editItem = item;
      this.editItemType = type;
      this.newStatus = item.statut_demande || '';
      this.editModalVisible = true;
    },
    closeEditModal() {
      this.editModalVisible = false;
      this.editItem = null;
      this.editItemType = null;
      this.newStatus = '';
    },
    async confirmStatusChange() {
      if (this.editItem && this.editItemType === 'demande') {
        try {
          await organisationService.traiterDemande(this.editItem.id_demande, { action: this.newStatus });
          this.updateLocalDemande(this.editItem.id_demande, this.newStatus);
          this.closeEditModal();
        } catch (error) {
          console.error('Erreur lors de la mise à jour du statut :', error);
        }
      }
    },
    async changeStatus(id, newStatus) {
      try {
        await organisationService.traiterDemande(id, { action: newStatus });
        this.updateLocalDemande(id, newStatus);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut :', error);
      }
    },
    async deleteDemande(id) {
      if (confirm('Voulez-vous vraiment supprimer cette demande ?')) {
        try {
          await organisationService.deleteDemande(id);
          this.localDemandes = this.localDemandes.filter(demande => demande.id_demande !== id);
        } catch (error) {
          console.error('Erreur lors de la suppression :', error);
        }
      }
    },
    updateLocalDemande(id, newStatus) {
      const demandeIndex = this.localDemandes.findIndex(d => d.id_demande === id);
      if (demandeIndex !== -1) {
        this.localDemandes[demandeIndex].statut_demande = newStatus;
        this.localDemandes = [...this.localDemandes]; // Force la réactivité
      }
    },
  },
};
</script>

<style scoped src="../../styles/OrgaStyle/ReservationsTable.css"></style>