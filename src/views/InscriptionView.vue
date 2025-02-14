<template>
  <div class="registration-container">
    <h1>Inscription</h1>

    <form @submit.prevent="handleRegistration">
      <div class="form-group">
        <label for="prenomUtilisateur">Prénom</label>
        <input
            v-model="prenomUtilisateur"
            type="text"
            id="prenomUtilisateur"
            placeholder="John"
            required
        />
      </div>

      <div class="form-group">
        <label for="nomUtilisateur">Nom</label>
        <input
            v-model="nomUtilisateur"
            type="text"
            id="nomUtilisateur"
            placeholder="Doe"
            required
        />
      </div>

      <div class="form-group">
        <label for="emailUtilisateur">Email</label>
        <input
            v-model="emailUtilisateur"
            type="email"
            id="emailUtilisateur"
            placeholder="exemple@mail.com"
            required
        />
      </div>

      <div class="form-group">
        <label for="motDePasse">Mot de passe</label>
        <input
            v-model="motDePasse"
            type="password"
            id="motDePasse"
            placeholder="********"
            required
        />
      </div>

      <div class="form-group">
        <label for="typeUtilisateur">Type d'utilisateur</label>
        <select v-model="typeUtilisateur" id="typeUtilisateur" required>
          <option value="client">Client</option>
          <option value="prestataire">Prestataire</option>
          <option value="organisateur">Organisateur</option>
        </select>
      </div>

      <button type="submit">S'inscrire</button>
    </form>

    <!-- Message d'erreur affiché si un email est déjà utilisé ou autre erreur -->
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <br>
    <button class="login-button" @click="goToLogin">Se connecter</button>
  </div>
</template>

<script>
import inscriptionService from '@/services/inscriptionService';

export default {
  name: 'RegistrationView',
  data() {
    return {
      prenomUtilisateur: "",
      nomUtilisateur: "",
      emailUtilisateur: "",
      motDePasse: "",
      typeUtilisateur: "client", // Valeur par défaut
      errorMessage: "", // Pour afficher les erreurs d'inscription
    };
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: "Login" });
    },
    async handleRegistration() {
      const userData = {
        prenomUtilisateur: this.prenomUtilisateur,
        nomUtilisateur: this.nomUtilisateur,
        emailUtilisateur: this.emailUtilisateur,
        motDePasse: this.motDePasse,
        typeUtilisateur: this.typeUtilisateur,
      };
      console.log("Données envoyées :", userData);
      try {
        const response = await inscriptionService.register(userData);
        console.log("Réponse de l’API : ", response);
        alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        this.errorMessage = "";
        await this.$router.push({name: "Login"}); // Redirection vers la page de connexion
      } catch (error) {
        console.error("Erreur lors de l'inscription : ", error.response?.data || error);
        // Affiche le message d'erreur envoyé par le backend (ex: "L'email est déjà utilisé.")
        this.errorMessage = error.response?.data?.error || "Une erreur est survenue lors de l'inscription.";
      }
    }
  }
};
</script>

<style scoped>
.registration-container {
  width: 100%;
  max-width: 600px;
  margin: 90px auto 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

h1 {
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
.form-group select {
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

/* Style pour le message d'erreur */
.error-message {
  margin-top: 15px;
  color: #e74c3c;
  font-weight: bold;
  text-align: center;
}
</style>
