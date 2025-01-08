<template>
  <div id="app">
    <nav class="navbar">
      <!-- Logo cliquable -->
      <router-link to="/" exact-active-class="active-link" class="logo-link">
        <img src="../public/assets/logo.png" alt="Logo" class="logoNavBar">
      </router-link>

      <!-- Liens cliquables -->
      <router-link to="/reservation" exact-active-class="active-link">BILLETS</router-link>
      <router-link to="/faq" exact-active-class="active-link">FAQ</router-link>
      <router-link to="/livredor" exact-active-class="active-link">livre d'or</router-link>

      <!-- Affiche l'onglet Organisation si l'utilisateur est un organisateur -->
      <router-link v-if="isLoggedIn && user?.type === 'organisateur'" to="/organisation" exact-active-class="active-link">ORGANISATION</router-link>

      <router-link to="/prestataire" exact-active-class="active-link">PRESTATAIRE</router-link>

      <!-- Affiche "Connexion" si l'utilisateur n'est pas connecté -->
      <router-link v-if="!isLoggedIn" to="/login" class="login-link" exact-active-class="active-link">CONNEXION</router-link>

      <!-- Affiche "Profil" si l'utilisateur est connecté -->
      <router-link v-if="isLoggedIn" to="/profil" class="login-link" exact-active-class="active-link">PROFIL</router-link>
    </nav>

    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const isLoggedIn = ref(false);
const user = ref(null);  // Stocke les données utilisateur

onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser) {
    isLoggedIn.value = true;
    user.value = storedUser;  // Assigne les données utilisateur
  }

  // Gestion du défilement pour changer la couleur de la barre de navigation
  const navbar = document.querySelector('.navbar');

  const handleScroll = () => {
    if (window.scrollY === 0) {
      navbar.classList.add('transparent');
    } else {
      navbar.classList.remove('transparent');
    }
  };

  if (window.scrollY === 0) {
    navbar.classList.add('transparent');
  }

  window.addEventListener('scroll', handleScroll);

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});
</script>

<style scoped>
.logoNavBar {
  position: absolute;
  max-width: 90px;
  height: auto;
  left: 10%;
  top: 23%;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.navbar.transparent {
  background-color: rgba(248, 249, 250, 0); /* Complètement transparent */
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 30px;
  background-color: rgba(248, 249, 250, 0.116); /* Transparence légère */
  backdrop-filter: blur(10px); /* Effet flou */
  transition: background-color 0.3s ease;
  z-index: 1000;
}

.navbar a {
  margin: 0 40px;
  font-size: 18px;
  text-decoration: none;
  font-weight: 600;
  color: #c8d1d9;
  transition: color 0.3s ease, transform 0.2s ease;
}

.navbar a:hover {
  color: #e51e53;
  transform: scale(1.1);
}

.navbar a.active-link {
  color: #e51e53;
}
</style>
