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
                  class="sidebar-item-orga"
                  title="Tableau de bord">
            <font-awesome-icon icon="home" />
          </button>
        </li>
        <li>
          <button @click="$emit('update-section', 'event')"
                  :class="{ active: currentSection === 'event' }"
                  class="sidebar-item-orga"
                  title="Créer une activité">
            <font-awesome-icon icon="plus-circle" />
          </button>
        </li>
        <li>
          <button @click="$emit('update-section', 'events')"
                  :class="{ active: currentSection === 'events' }"
                  class="sidebar-item-orga"
                  title="Liste des activités">
            <font-awesome-icon icon="list" />
          </button>
        </li>
        <li>
          <div class="dropdown" :class="{ open: dropdownVisible }">
            <button class="dropdown-button" @click="toggleDropdown" title="Gestion des prestataires">
              <font-awesome-icon icon="users" />
            </button>
            <div class="dropdown-menu">
              <button @click="$emit('update-section', 'reservations')">
                <font-awesome-icon icon="ticket-alt" /> Ticket prestataires
              </button>
              <button @click="$emit('update-section', 'assistance')">
                <font-awesome-icon icon="headset" /> Assistance prestataire
              </button>
              <button @click="$emit('update-section', 'listPrestataire')">
                <font-awesome-icon icon="address-book" /> Liste utilisateurs
              </button>
            </div>
          </div>
        </li>
        <li>
          <button @click="$emit('update-section', 'statistiques')"
                  :class="{ active: currentSection === 'statistiques' }"
                  class="sidebar-item-orga"
                  title="Statistiques">
            <font-awesome-icon icon="chart-bar" />
          </button>
        </li>
      </ul>
    </nav>
    <div class="sidebar-footer-orga">
      <router-link to="/" class="return-home-orga" title="Retour à l'accueil">
        <font-awesome-icon icon="sign-out-alt" />
      </router-link>
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

<style scoped src="../../styles/OrgaStyle/OrganisationSidebar.css"></style>