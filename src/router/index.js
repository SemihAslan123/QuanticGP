import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/HomeView.vue';
import Reservation from '../views/ReservationView.vue';
import FAQ from '../views/FAQView.vue';
import Paiement from '../views/PaiementView.vue';

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
      name: 'Reservation',
      component: Reservation,
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
  ],
});
