import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    billets: [],
    activites: [],
    avis: [] // pour stocker les avis du livre d'or
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_BILLETS(state, billets) {
      state.billets = billets;
    },
    SET_ACTIVITES(state, activites) {
      state.activites = activites;
    },
    SET_AVIS(state, avis) {
      state.avis = avis;
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit('SET_USER', user);
    },
    setBillets({ commit }, billets) {
      commit('SET_BILLETS', billets);
    },
    setActivites({ commit }, activites) {
      commit('SET_ACTIVITES', activites);
    },
    setAvis({ commit }, avis) {
      commit('SET_AVIS', avis);
    }
  },
  getters: {
    isLoggedIn: state => !!state.user,
    // Autres getters au besoin
  }
});
