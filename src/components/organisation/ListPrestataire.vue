<!-- frontend/src/components/ListPrestataire.vue -->
<template>
  <section class="list-prestataire-section-orga">
    <h2>Liste des Prestataires</h2>
    <div class="filter-container-orga">
      <input type="text" v-model="searchQuery" placeholder="Rechercher par nom ou email" class="search-bar-orga" />
      <select v-model="selectedFilter" class="filter-select-orga">
        <option value="">Tous les types</option>
        <option value="prestataire">Prestataire</option>
        <option value="client">Client</option>
        <option value="organisateur">Organisateur</option>
      </select>
    </div>
    <div v-if="filteredPrestataires.length > 0" class="prestataires-grid-orga">
      <div v-for="prestataire in filteredPrestataires" :key="prestataire.id_utilisateur" class="prestataire-card-orga">
        <h3 class="prestataire-name-orga">{{ prestataire.nom_utilisateur }} {{ prestataire.prenom_utilisateur }}</h3>
        <p class="prestataire-id-orga">Id : {{ prestataire.id_utilisateur }}</p>
        <p class="prestataire-email-orga">Email : {{ prestataire.mail_utilisateur }}</p>
        <span :class="['prestataire-service', prestataire.type_utilisateur.toLowerCase()]">
          Service : {{ prestataire.type_utilisateur }}
        </span>
        <select @change="handleChangeService(prestataire.id_utilisateur, $event.target.value)" class="service-select">
          <option value="prestataire" :selected="prestataire.type_utilisateur === 'prestataire'">Prestataire</option>
          <option value="client" :selected="prestataire.type_utilisateur === 'client'">Client</option>
          <option value="organisateur" :selected="prestataire.type_utilisateur === 'organisateur'">Organisateur</option>
        </select>
      </div>
    </div>
    <div v-else>
      <p>Aucun prestataire correspondant trouvé.</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ListPrestataire',
  props: {
    prestataires: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchQuery: '',
      selectedFilter: '',
    };
  },
  computed: {
    filteredPrestataires() {
      return this.prestataires.filter(prestataire => {
        const matchesFilter = !this.selectedFilter || prestataire.type_utilisateur.toLowerCase() === this.selectedFilter;
        const matchesSearch =
            prestataire.nom_utilisateur.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            prestataire.mail_utilisateur.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      });
    },
  },
  methods: {
    handleChangeService(id, newType) {
      this.$emit('change-service', id, newType);
    },
  },
};
</script>

<style scoped src="../../styles/OrganisationPage.css">
/* Styles pour la sidebar */
</style>

