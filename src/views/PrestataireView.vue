
<template>
  <div class="organizer-page">
    <div class="content" v-if="utilisateurPage === 'public'">
      <h1>Liste Prestataire</h1>

      <div class="liste_prest" v-for="liste_prestataire in liste_prestataires_client" :key="liste_prestataire.id_utilisateur">
        <img :src="'http://localhost:3000' + liste_prestataire.image_prestataire" alt="Image Prestataire">
        <p> {{ liste_prestataire.nom_utilisateur }} {{ liste_prestataire.prenom_utilisateur }} </p>
        <br>
        <h5>Liste service du prestataire: {{ liste_prestataire.nom_service }}</h5>
        <p> {{liste_prestataire.description_service}} </p>
        <p> {{ liste_prestataire.date_service }} / {{ liste_prestataire.heure_service }} </p>
        <router-link :to="`/service/${liste_prestataire.id_service}`">
          <button>Accéder au service</button>
        </router-link>
      </div>
      <button @click="utilisateurPagePrestataire()">Passer Prestataire</button>
    </div>
  </div>



  <!--
  <div v-else-if="utilisateurPage === 'prestataire'">
     apikey: rmp0bfrnlogabznwpk64t1wqcd1lbkp9ujasandoy5281vzp
    <editor
        v-model="content"
        api-key="rmp0bfrnlogabznwpk64t1wqcd1lbkp9ujasandoy5281vzp"
        :init="{
      height: 500,
      menubar: false,
      plugins: 'link image code',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | image',
      images_upload_handler: handleImageUpload
    }"/>
    <button @click="utilisateurPagePublic">Passer Public</button>
  </div>
  -->

</template>

<script>
//import Editor from '@tinymce/tinymce-vue';

export default {
  name: 'PrestataireView',
  //components: {
 //   Editor
  //},
  data() {
    return {
      utilisateurPage: "public",
      content: '',
      liste_prestataires_client: [], // Stockera la liste des prestataires récupérés de l'API
    };
  },
  mounted() {
    // Appel à l'API pour récupérer les utilisateurs lorsque le composant est monté
    fetch('http://localhost:3001/prestataire')
        .then(response => {
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des utilisateurs");
          }
          return response.json();
        })
        .then(data => {
          console.log("Données utilisateurs:", data)
          this.liste_prestataires_client = data; // Assigner les données aux utilisateurs
        })
        .catch(error => {
          console.error("Erreur:", error);
        });
  },
  methods: {
    handleImageUpload(blobInfo, success, failure) {
      // Transformez l'image en URL et affichez-la directement
      const reader = new FileReader();
      reader.onload = () => success(reader.result);
      reader.onerror = () => failure("Erreur lors du chargement de l'image");
      reader.readAsDataURL(blobInfo.blob());
    },
    utilisateurPagePublic() {
      this.utilisateurPage = 'public';
    },
    utilisateurPagePrestataire() {
      this.utilisateurPage = 'prestataire';
    }
  }
};


</script>


<style scoped>

.organizer-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f7f7f7; /* Fond clair */
  font-family: Arial, sans-serif;
}

.content {
  max-width: 800px;
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}

.liste_prest {
  background-color: black;
  color: #cccccc;
  margin-bottom: 20px;
  padding: 20px;
}


h1, h5 {
  text-align: center;
  color: #e74c3c; /* Rouge principal */
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

h5 {
  font-size: 1.8em;
  margin-bottom: 15px;
}

button {
  background-color: #e74c3c; /* Rouge principal */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  width: 100%;
}

button:hover {
  background-color: #c0392b; /* Rouge plus foncé */
  transform: scale(1.05); /* Légère animation au survol */
}
</style>
