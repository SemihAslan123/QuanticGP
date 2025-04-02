<template>
  <section class="reservations-section-orga">
    <h2>Gestion des demandes de prestataires</h2>
    <div class="filter-bar">
      <label for="status-filter">Filtrer par statut :</label>
      <select id="status-filter" v-model="statusFilter" class="status-select">
        <option value="">Tous</option>
        <option value="EN ATTENTE">En attente</option>
        <option value="ACCEPTÉ">Accepté</option>
        <option value="REFUSÉ">Refusé</option>
      </select>
    </div>
    <div class="reservations-table">
      <table>
        <thead>
        <tr>
          <th @click="sortDemandes('id_demande')">
            ID Demande
            <font-awesome-icon :icon="getSortIcon('id_demande', 'demandes')" />
          </th>
          <th @click="sortDemandes('prenom_utilisateur')">
            Prénom
            <font-awesome-icon :icon="getSortIcon('prenom_utilisateur', 'demandes')" />
          </th>
          <th @click="sortDemandes('nom_utilisateur')">
            Nom
            <font-awesome-icon :icon="getSortIcon('nom_utilisateur', 'demandes')" />
          </th>
          <th @click="sortDemandes('mail_utilisateur')">
            Email
            <font-awesome-icon :icon="getSortIcon('mail_utilisateur', 'demandes')" />
          </th>
          <th @click="sortDemandes('date_demande')">
            Date Demande
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
          <td>{{ demande.prenom_utilisateur }}</td>
          <td>{{ demande.nom_utilisateur }}</td>
          <td>{{ demande.mail_utilisateur }}</td>
          <td>{{ new Date(demande.date_demande).toLocaleDateString('fr-FR') }}</td>
          <td>
              <span :class="['reservation-status', demande.statut_demande.toLowerCase()]">
                {{ demande.statut_demande }}
              </span>
          </td>
          <td class="actions-cell">
            <select
                v-if="demande.statut_demande === 'EN ATTENTE'"
                @change="changeStatus(demande.id_demande, $event.target.value)"
                class="status-select"
            >
              <option value="EN ATTENTE" :selected="demande.statut_demande === 'EN ATTENTE'">En attente</option>
              <option value="ACCEPTÉ">Accepter</option>
              <option value="REFUSÉ">Refuser</option>
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
        <p>Aucune demande trouvée.</p>
      </div>
    </div>

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
                <span>Nom: {{ selectedDemande.nom_utilisateur }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="user" class="detail-icon" />
                <span>Prénom: {{ selectedDemande.prenom_utilisateur }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="envelope" class="detail-icon" />
                <span>Email: {{ selectedDemande.mail_utilisateur }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="calendar-alt" class="detail-icon" />
                <span>Date: {{ new Date(selectedDemande.date_demande).toLocaleDateString('fr-FR') }}</span>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="info-circle" class="detail-icon" />
                <span>Statut: {{ selectedDemande.statut_demande }}</span>
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
            <select id="edit-status-select" v-model="newStatus" class="status-select">
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

export default {
  name: 'AssistancePrestataire',
  data() {
    return {
      demandes: [],
      statusFilter: '',
      sortKey: {
        demandes: '',
      },
      sortOrder: {
        demandes: 1,
      },
      selectedDemande: null,
      editModalVisible: false,
      editItem: null,
      editItemType: null,
      newStatus: '',
    };
  },
  async created() {
    await this.fetchDemandes();
  },
  computed: {
    filteredDemandes() {
      let filtered = [...this.demandes];
      if (this.statusFilter) {
        filtered = filtered.filter(demande => demande.statut_demande === this.statusFilter);
      }
      return this.sortData(filtered, this.sortKey.demandes, this.sortOrder.demandes);
    },
  },
  methods: {
    async fetchDemandes() {
      try {
        const demandes = await organisationService.getDemandes();
        this.demandes = demandes || [];
        console.log("Demandes récupérées :", this.demandes);
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes :", error);
        alert("Erreur lors du chargement des demandes.");
        this.demandes = [];
      }
    },
    async changeStatus(id, newStatus) {
      try {
        await organisationService.traiterDemande(id, { action: newStatus });
        alert(`Statut modifié en "${newStatus}" avec succès.`);
        await this.fetchDemandes();
      } catch (error) {
        console.error("Erreur lors du changement de statut :", error);
        alert("Une erreur est survenue lors du changement de statut.");
      }
    },
    async deleteDemande(id) {
      if (confirm("Voulez-vous vraiment supprimer cette demande ?")) {
        try {
          await organisationService.deleteDemande(id); // À implémenter dans le service si nécessaire
          alert("Demande supprimée avec succès.");
          await this.fetchDemandes();
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          alert("Une erreur est survenue lors de la suppression.");
        }
      }
    },
    sortData(data, key, order) {
      if (!key) return data;
      return data.sort((a, b) => {
        let valA = a[key] || '';
        let valB = b[key] || '';
        if (key === 'date_demande') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
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
      this.newStatus = item.statut_demande;
      this.editModalVisible = true;
    },
    closeEditModal() {
      this.editModalVisible = false;
      this.editItem = null;
      this.editItemType = null;
      this.newStatus = '';
    },
    async confirmStatusChange() {
      try {
        await organisationService.traiterDemande(this.editItem.id_demande, { action: this.newStatus });
        alert(`Statut modifié en "${this.newStatus}" avec succès.`);
        await this.fetchDemandes();
        this.closeEditModal();
      } catch (error) {
        console.error("Erreur lors de la modification du statut :", error);
        alert("Une erreur est survenue lors de la modification.");
      }
    },
  },
};
</script>

<style scoped src="../../styles/OrgaStyle/ReservationsTable.css"></style>