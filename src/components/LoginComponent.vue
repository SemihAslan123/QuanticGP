<template>
  <div class="login-container">
    <div class="login-box">
      <h2 v-if="!isLoggedIn">Connexion</h2>
      <form v-if="!isLoggedIn" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" v-model="password" required />
        </div>
        <button class="login-button" type="submit">Se connecter</button>
      </form>
      <br>
      <button v-if="!isLoggedIn" @click="goToInscription">S'inscrire</button>

      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

      <div v-if="isLoggedIn" class="welcome-box">
        <p>Bienvenue, {{ user?.prenom || "Utilisateur" }} !</p>
        <p>Session ID : {{ user?.sessionId }}</p>
        <button class="logout-button" @click="logout">Se déconnecter</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      isLoggedIn: false,
      user: null,
      errorMessage: '',
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.isLoggedIn = true;
      this.user = user;
    }
  },
  methods: {
    goToInscription() {
      this.$router.push({ name: "InscriptionView" });
    },
    logout() {
      localStorage.removeItem("user");
      this.isLoggedIn = false;
      this.user = null;
    },
    async submitForm() {
      try {
        const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          this.isLoggedIn = true;
          this.user = data.user;
          this.errorMessage = '';
          window.location.reload()
        } else {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        this.errorMessage = 'Erreur du serveur, veuillez réessayer plus tard.';
      }
    },
  },
};
</script>

<style scoped>
/* Conteneur principal centré */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

/* Cadre du formulaire de connexion */
.login-box {
  background: #f0ebeb;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

/* Style des groupes de champs */
.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

/* Bouton de connexion */
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

.login-button:hover {
  background-color: #45a049;
}

/* Bouton de déconnexion */
.logout-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #f44336;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #e53935;
}

/* Message d'erreur */
.error {
  margin-top: 15px;
  color: #e74c3c;
  font-weight: bold;
}

/* Bienvenue box */
.welcome-box {
  margin-top: 20px;
}

</style>
