import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/HomeView.vue';
import Reservation from '../views/ReservationBilletView.vue';
import FAQ from '../views/FAQView.vue';
import Paiement from '../views/PaiementBilletView.vue';
import Organisation from '../views/OrganisationView.vue';
import Login from '../components/LoginComponent.vue';  // Import de la page Login

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/reservation',
      name: 'reservation',
      component: Reservation,
      beforeEnter: (to, from, next) => {
        // Vérifier si l'utilisateur est connecté
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          next(); // Si connecté, continue la navigation vers la réservation
        } else {
          next(); // Si non connecté, redirige vers la page de login
        }
      }
    },
    {
      path: '/faq',
      name: 'FAQ',
      component: FAQ,
    },
    {
      path: '/paiement',
      name: 'Paiement',
      component: Paiement,
      props: true,
    },
    {
      path: '/organisation',
      name: 'Organisation',
      component: Organisation,
    },
    {
      path: '/login',  // Ajout de la route pour la page de connexion
      name: 'Login',
      component: Login,
    },
  ],
});
