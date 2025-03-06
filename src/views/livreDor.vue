<template>
  <div class="livre-dor">
    <h1>Livre d'Or</h1>

    <!-- Formulaire d'avis (affiché si l'utilisateur est connecté) -->
    <div v-if="isLoggedIn" class="avis-form">
      <h2>Donnez votre avis</h2>
      <textarea v-model="nouvelAvis" placeholder="Écrivez votre avis ici..."></textarea>

      <!-- Sélection de la note -->
      <select v-model="note" required>
        <option value="" disabled>Sélectionner une note</option>
        <option v-for="n in [1,2,3,4,5]" :key="n" :value="n">{{ n }}</option>
      </select>

      <!-- Message d'erreur affiché en rouge -->
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

      <button @click="soumettreAvis">Envoyer</button>
    </div>

    <!-- Liste des avis -->
    <div v-if="avis.length > 0" class="avis-list">
      <div v-for="avisItem in avis" :key="avisItem.id_avis" class="avis-item">
        <p><strong>{{ avisItem.nom_utilisateur }} {{ avisItem.prenom_utilisateur }}</strong> :</p>
        <p>{{ avisItem.commentaire }}</p>
        <p><strong>Date :</strong> {{ formatDate(avisItem.date_avis) }}</p>
        <p><strong>Note :</strong> {{ avisItem.note }}</p>
        <hr />
      </div>
    </div>

    <!-- Message si aucun avis n'est présent -->
    <div v-else>
      <p>Aucun avis pour l'instant. Soyez le premier à donner votre avis !</p>
    </div>
  </div>
</template>

<script>
import livreDorService from '@/services/livreDorService';

export default {
  name: 'LivreDorView',
  data() {
    return {
      avis: [],
      nouvelAvis: '',
      note: '',
      isLoggedIn: false,
      user: null,
      errorMessage: '', // Variable pour stocker le message d'erreur
    };
  },
  async mounted() {
    // Vérifie la connexion utilisateur via localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.isLoggedIn = true;
      this.user = user;
    }

    // Récupère les avis via le service
    try {
      this.avis = await livreDorService.getAvis();
    } catch (error) {
      console.error('Erreur lors de la récupération des avis :', error);
    }
  },
  methods: {
    async soumettreAvis() {
      // Vérifier que le commentaire et la note sont renseignés
      if (!this.nouvelAvis.trim() || !this.note) {
        this.errorMessage = "Veuillez écrire un avis et sélectionner une note.";
        return;
      }

      // Réinitialise le message d'erreur s'il y en avait un
      this.errorMessage = "";

      try {
        // Prépare le payload pour l'API
        const payload = {
          userId: this.user.id,
          commentaire: this.nouvelAvis,
          note: this.note,
        };

        const response = await livreDorService.submitAvis(payload);

        if (response.success) {
          // Réinitialise le formulaire
          this.nouvelAvis = '';
          this.note = '';
          // Rafraîchit la page pour afficher le nouvel avis
          window.location.reload();
        } else {
          this.errorMessage = "Erreur lors de l'envoi de votre avis.";
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'avis :", error);
        this.errorMessage = "Erreur lors de l'envoi de l'avis.";
      }
    },

    // Formate la date en affichant jour, mois, année, heure et minute
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

/* Style pour le message d'erreur en rouge */
.error {
  color: #e74c3c;
  margin-top: 10px;
  font-weight: bold;
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
