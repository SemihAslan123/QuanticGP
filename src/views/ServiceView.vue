
<template>
  <div>
    <h1>{{ detail_service.nom_service }}</h1>
    <p>{{ detail_service.description_service }}</p>
    <p>Date: {{ detail_service.date_service }}</p>
    <p>Heure: {{ detail_service.heure_service }}</p>
  </div>
</template>

<script>
import {id} from "postcss-selector-parser";

export default {
  name: "ServiceView",
  methods: {id},
  data() {
    return {
      detail_service: {},
    };
  },
  mounted() {
    // Récupérer l'ID du service depuis les paramètres de l'URL
    const serviceId = this.$route.params.id;

    // Effectuer une requête pour récupérer les informations du service
    fetch(`http://localhost:3000/service/${serviceId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données du service");
          }
          return response.json();
        })
        .then(data => {
          console.log("Données du service:", data);
          this.detail_service = data;
        })
        .catch(error => {
          console.error(error);
        });
  }
}
</script>

<style scoped>

</style>