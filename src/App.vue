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
      <router-link to="/organisation" exact-active-class="active-link">ORGANISATION</router-link>
      <router-link to="/prestataire" exact-active-class="active-link">PRESTATAIRE</router-link>
    </nav>

    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<style>

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

nav {
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

nav a {
  margin: 0 40px;
  font-size: 18px;
  text-decoration: none;
  font-weight: 600;
  color: #c8d1d9;
  transition: color 0.3s ease, transform 0.2s ease;
}

nav a:hover {
  color: #e51e53;
  transform: scale(1.1);
}

nav a.active-link {
  color: #e51e53;
}
</style>

<script setup>

import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  const navbar = document.querySelector('.navbar'); // Sélectionne la barre de navigation

  const handleScroll = () => {
    if (window.scrollY === 0) {
      // Si la page est tout en haut
      navbar.classList.add('transparent');
    } else {
      // Si la page est scrollée
      navbar.classList.remove('transparent');
    }
  };

  // Vérifie si la page est déjà en haut au moment du chargement
  if (window.scrollY === 0) {
    navbar.classList.add('transparent');
  }

  // Ajoute l'écouteur d'événement scroll
  window.addEventListener('scroll', handleScroll);

  // Supprime l'écouteur lors du démontage
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});

</script>
