<template>
  <div class="registration-container">
    <h1>Inscription</h1>

    <form @submit.prevent="handleRegistration" v-if="!showPresentationForm">
      <div class="form-group">
        <label for="prenomUtilisateur">Prénom</label>
        <input v-model="prenomUtilisateur" type="text" id="prenomUtilisateur" placeholder="John" required />
      </div>

      <div class="form-group">
        <label for="nomUtilisateur">Nom</label>
        <input v-model="nomUtilisateur" type="text" id="nomUtilisateur" placeholder="Doe" required />
      </div>

      <div class="form-group">
        <label for="emailUtilisateur">Email</label>
        <input v-model="emailUtilisateur" type="email" id="emailUtilisateur" placeholder="exemple@mail.com" required />
      </div>

      <div class="form-group">
        <label for="motDePasse">Mot de passe</label>
        <input v-model="motDePasse" type="password" id="motDePasse" placeholder="********" required />
      </div>

      <div class="form-group">
        <label for="typeUtilisateur">Type d'utilisateur</label>
        <select v-model="typeUtilisateur" id="typeUtilisateur" required>
          <option value="client">Client</option>
          <option value="prestataire">Prestataire</option>
          <option value="organisateur">Organisateur</option>
        </select>
      </div>

      <button type="submit">Suivant</button>
    </form>

    <!-- Formulaire de présentation pour prestataire/organisateur -->
    <form @submit.prevent="submitPresentation" v-if="showPresentationForm">
      <h2>Présentez-vous</h2>
      <div class="form-group">
        <label for="presentation">Pourquoi voulez-vous devenir {{ typeUtilisateur }} ?</label>
        <textarea
            v-model="presentation"
            id="presentation"
            placeholder="Décrivez vos motivations, expériences ou compétences (200 caractères max)"
            maxlength="200"
            rows="5"
            required
        ></textarea>
      </div>
      <button type="submit">Envoyer la demande</button>
      <button type="button" @click="showPresentationForm = false">Retour</button>
    </form>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <br>
    <button class="login-button" @click="goToLogin">Se connecter</button>
  </div>
</template>

<script>
import inscriptionService from '@/../backend/services/inscription.service';

export default {
  name: 'RegistrationView',
  data() {
    return {
      prenomUtilisateur: '',
      nomUtilisateur: '',
      emailUtilisateur: '',
      motDePasse: '',
      typeUtilisateur: 'client',
      presentation: '', // Nouvelle donnée pour la présentation
      showPresentationForm: false, // Contrôle l'affichage du second formulaire
      errorMessage: '',
    };
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: 'Login' });
    },
    async handleRegistration() {
      if (this.typeUtilisateur === 'prestataire' || this.typeUtilisateur === 'organisateur') {
        // Affiche le formulaire de présentation au lieu d'envoyer directement
        this.showPresentationForm = true;
      } else {
        // Pour les clients, inscription directe
        await this.submitRegistration();
      }
    },
    async submitPresentation() {
      await this.submitRegistration();
    },
    async submitRegistration() {
      const userData = {
        prenomUtilisateur: this.prenomUtilisateur,
        nomUtilisateur: this.nomUtilisateur,
        emailUtilisateur: this.emailUtilisateur,
        motDePasse: this.motDePasse,
        typeUtilisateur: this.typeUtilisateur,
        presentation: this.presentation || '', // Ajoute la présentation si elle existe
      };
      try {
        await inscriptionService.register(userData);
        if (this.typeUtilisateur === 'prestataire' || this.typeUtilisateur === 'organisateur') {
          alert(`Votre demande pour devenir ${this.typeUtilisateur} a été envoyée avec succès. Votre compte est créé en tant que client en attendant la validation.`);
        } else {
          alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        }
        this.errorMessage = '';
        this.$router.push({name: 'Login'});
      } catch (error) {
        console.error('Erreur lors de l\'inscription : ', error.response?.data || error);
        this.errorMessage = error.response?.data?.error || 'Une erreur est survenue lors de l\'inscription.';
      }
    },
  },
};
</script>

<style scoped>
/* Styles existants inchangés */
.registration-container {
  width: 100%;
  max-width: 600px;
  margin: 90px auto 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

h1, h2 {
  text-align: center;
  color: #e74c3c;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #c0392b;
}

.login-button {
  margin-top: 15px;
  background-color: #4caf50;
}

.login-button:hover {
  background-color: #45a049;
}

.error-message {
  margin-top: 15px;
  color: #e74c3c;
  font-weight: bold;
  text-align: center;
}
</style>