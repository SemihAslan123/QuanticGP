<template>

  <form @submit.prevent="submitRegistration">
    <h2>Inscription</h2>

    <label for="nom">Nom :</label>
    <input type="text" id="nom" name="nom" placeholder="Entrez votre nom" required>

    <label for="prenom">Prénom :</label>
    <input type="text" id="prenom" name="prenom" placeholder="Entrez votre prénom" required>

    <label for="email">E-mail :</label>
    <input type="email" id="email" name="email" placeholder="Entrez votre email" required>

    <label for="password">Mot de passe :</label>
    <input type="password" id="password" name="password" placeholder="Entrez un mot de passe" required>

    <label for="user_type">Type d'utilisateur :</label>
    <select id="user_type" name="user_type" required>
      <option value="">--Choisissez une option--</option>
      <option value="client">Client</option>
      <option value="prestataire">Prestataire</option>
    </select>

    <button type="submit">S'inscrire</button>

  </form>

</template>



<script>
export default {
  name: "InscriptionView",
  data() {
    return {
      nom: "",
      prenom: "",
      email: "",
      mdp: "",
      type_utilisateur: "",
    };
  },
  methods: {
    async submitRegistration() {
      try {
        const response = await fetch("http://localhost:3000/inscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom_utilisateur: this.nom,
            prenom_utilisateur: this.prenom,
            mail_utilisateur: this.email,
            mot_de_passe: this.mdp,
            type_utilisateur: this.type_utilisateur,
            image_prestataire: null, // Si vous ne gérez pas d'images pour l'instant
          }),
        });

        if (response.ok) {
          const data = await response.json();
          alert("Inscription réussie !");
          console.log("Utilisateur créé :", data.utilisateur);
        } else {
          const error = await response.json();
          alert(`Erreur : ${error.error}`);
        }
      } catch (err) {
        console.error("Erreur réseau ou serveur :", err);
        alert("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    },
  },
};
</script>




<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f9;
}
form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input, select, button {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}

</style>