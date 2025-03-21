import Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'tippy.js/dist/tippy.css';

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Ajouter toutes les icônes solides à la bibliothèque
library.add(fas);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');