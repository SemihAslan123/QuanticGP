import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/HomeView.vue';
import Reservation from '../views/ReservationBilletView.vue';
import FAQ from '../views/FAQView.vue';
import Paiement from '../views/PaiementBilletView.vue';
import Organisation from '../views/OrganisationView.vue';
import Login from '../components/LoginComponent.vue';
import Profil from "@/views/ProfilView.vue";
import PrestataireView from "@/views/PrestataireView.vue";
import ArticleHistoireCircuit from '../views/ArticleHistoireCircuit.vue';
import ArticleCoulisses from '../views/ArticleCoulisses.vue';
import ArticleGuide from '../views/ArticleGuide.vue';
import ArticleVieMonaco from '../views/ArticleVieMonaco.vue';
import InscriptionView from "@/views/InscriptionView.vue";

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
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/profil',
      name: 'Profil',
      component: Profil,
      beforeEnter: (to, from, next) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          next();
        } else {
          next({ name: 'Login' });
        }
      }
    },
    {
      path: '/prestataire',
      name: 'Prestataire',
      component : PrestataireView
    },

    {
      path: '/articlehistoire',
      name: 'ArticleHistoireCircuit',
      component: ArticleHistoireCircuit,
    },

    {
      path: '/articlecoulisses',
      name: 'ArticleCoulisses',
      component: ArticleCoulisses,
    },

    {
      path: '/articleguide',
      name: 'ArticleGuide',
      component: ArticleGuide,
    },

    {
      path: '/articlemonaco',
      name: 'ArticleVieMonaco',
      component: ArticleVieMonaco,
    },

    {
      path: '/inscription',
      name: 'InscriptionView',
      component: InscriptionView,
    }
  ],
});
