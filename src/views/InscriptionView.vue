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
    <br>
    <button class="login-button" type="submit" @click="goToLogin">Se connecter</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      prenomUtilisateur: "",
      nomUtilisateur: "",
      emailUtilisateur: "",
      motDePasse: "",
      typeUtilisateur: "client", // Valeur par défaut
    };
  },
  methods: {
        goToLogin() {
      this.$router.push({ name: "Login" });
    },
    async handleRegistration() {
      try {
        const response = await axios.post("http://localhost:3001/inscription", {
          prenomUtilisateur: this.prenomUtilisateur,
          nomUtilisateur: this.nomUtilisateur,
          emailUtilisateur: this.emailUtilisateur,
          motDePasse: this.motDePasse,
          typeUtilisateur: this.typeUtilisateur,
        });

        console.log("Réponse de l’API : ", response.data);
        alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        this.$router.push({ name: "Login" }); // Redirige vers la page de connexion
      } catch (error) {
        console.error("Erreur lors de l'inscription : ", error);
        alert("Une erreur est survenue lors de l'inscription.");
      }
    },
  },
};
</script>

<style scoped>

.login-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.registration-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 90px;
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
</style>
