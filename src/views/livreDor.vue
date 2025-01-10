<template>
  <div class="livre-dor">
    <h1>Livre d'Or</h1>

    <!-- Formulaire d'avis (en haut) -->
    <div v-if="isLoggedIn" class="avis-form">
      <h2>Donnez votre avis</h2>
      <textarea v-model="nouvelAvis" placeholder="Écrivez votre avis ici..."></textarea>

      <!-- Ajout d'un champ pour la note -->
      <select v-model="note" required>
        <option value="" disabled selected>Sélectionner une note</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>

      <button @click="soumettreAvis">Envoyer</button>
    </div>

    <!-- Liste des avis -->
    <div v-if="avis.length > 0" class="avis-list">
      <div v-for="avisItem in avis" :key="avisItem.id_avis" class="avis-item">
        <!-- Affichage du nom et prénom de l'utilisateur qui a commenté -->
        <p><strong>{{ avisItem.nom_utilisateur }} {{ avisItem.prenom_utilisateur }}</strong> :</p>
        <p>{{ avisItem.commentaire }}</p>
        <p><strong>Date :</strong> {{ formatDate(avisItem.date_avis) }}</p>
        <p><strong>Note :</strong> {{ avisItem.note }}</p>
        <hr />
      </div>
    </div>

    <!-- Message s'il n'y a pas encore d'avis -->
    <div v-else>
      <p>Aucun avis pour l'instant. Soyez le premier à donner votre avis !</p>
    </div>
  </div>
</template>

<script>
import { avisData } from '/src/data/data.js';

export default {
  data() {
    return {
      avis: [],
      nouvelAvis: '',
      note: '',
      isLoggedIn: false,
      user: null,
    };
  },
  mounted() {
    // Récupérer l'utilisateur connecté depuis localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.isLoggedIn = true;
      this.user = user;
    }

    // Charger les avis depuis le localStorage ou initialiser avec les données de `data.js`
    const storedAvis = JSON.parse(localStorage.getItem('avis')) || avisData;
    this.avis = storedAvis;
  },
  methods: {
    soumettreAvis() {
      // Vérifier si l'avis et la note sont renseignés
      if (!this.nouvelAvis.trim()) {
        alert('Veuillez écrire un avis avant de soumettre.');
        return;
      }

      if (!this.note) {
        alert('Veuillez choisir une note avant de soumettre.');
        return;
      }

      // Créer un nouvel avis avec le nom, prénom et les autres informations
      const newAvis = {
        id_avis: Date.now(), // Génère un ID unique basé sur le timestamp
        nom_utilisateur: this.user.nom,
        prenom_utilisateur: this.user.prenom,
        commentaire: this.nouvelAvis,
        note: this.note,
        date_avis: new Date().toISOString(), // Format de la date ISO
      };

      // Ajouter l'avis dans la liste et le sauvegarder dans localStorage
      this.avis.push(newAvis);
      localStorage.setItem('avis', JSON.stringify(this.avis));

      // Réinitialiser le formulaire
      this.nouvelAvis = '';
      this.note = '';
    },


    // Fonction pour formater la date
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(date).toLocaleDateString('fr-FR', options);
    },
  },
};
</script>

<style scoped>
.livre-dor {
  margin: 90px auto;
  font-family: Arial, sans-serif;
  max-width: 600px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.avis-form {
  margin-bottom: 30px;
}

.avis-form h2 {
  font-size: 1.5em;
  color: #4CAF50;
}

.avis-form textarea {
  width: 100%;
  height: 120px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  resize: vertical;
}

.avis-form select {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
}

.avis-form button {
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.2em;
  cursor: pointer;
}

.avis-form button:hover {
  background-color: #45a049;
}

.avis-list {
  margin-top: 30px;
}

.avis-item {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}

.avis-item p {
  margin: 5px 0;
}

.avis-item hr {
  border: 0;
  border-top: 1px solid #ddd;
  margin-top: 15px;
}
</style>
