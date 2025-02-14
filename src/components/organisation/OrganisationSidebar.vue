<!-- frontend/src/components/OrganisationSidebar.vue -->
<template>
  <aside class="sidebar-orga">
    <div class="sidebar-header-orga">
      <h2>Tableau de Bord</h2>
    </div>
    <nav class="sidebar-nav-orga">
      <ul>
        <li>
          <button @click="$emit('update-section', 'dashboard')"
                  :class="{ active: currentSection === 'dashboard' }"
                  class="sidebar-item-orga">
            <i class="icon-dashboard"></i> Tableau de bord
          </button>
        </li>
        <li>
          <button @click="$emit('update-section', 'event')"
                  :class="{ active: currentSection === 'event' }"
                  class="sidebar-item-orga">
            <i class="icon-event"></i> Créer une activitée
          </button>
        </li>
        <li>
          <button @click="$emit('update-section', 'events')"
                  :class="{ active: currentSection === 'events' }"
                  class="sidebar-item-orga">
            <i class="icon-list"></i> Liste des activitées
          </button>
        </li>
        <li>
          <div class="dropdown" :class="{ open: dropdownVisible }">
            <button class="dropdown-button" @click="toggleDropdown">
              Gestion des prestataires
            </button>
            <div class="dropdown-menu">
              <button @click="$emit('update-section', 'reservations')">Ticket réservation</button>
              <button @click="$emit('update-section', 'assistance')">Assistance prestataire</button>
              <button @click="$emit('update-section', 'listPrestataire')">Liste prestataires</button>
            </div>
          </div>
        </li>
        <li>
          <button @click="$emit('update-section', 'statistiques')"
                  :class="{ active: currentSection === 'statistiques' }"
                  class="sidebar-item-orga">
            <i class="icon-stats"></i> Statistiques
          </button>
        </li>
      </ul>
    </nav>
    <div class="sidebar-footer-orga">
      <router-link to="/" class="return-home-orga">Retour à l'accueil</router-link>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'OrganisationSidebar',
  props: ['currentSection'],
  data() {
    return {
      dropdownVisible: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
  },
};
</script>

<style scoped src="../../styles/OrganisationPage.css">
/* Styles pour la sidebar */
</style>
