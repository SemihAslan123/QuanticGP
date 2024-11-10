<template>
  <div class="payment-container">
    <h1>Paiement de votre réservation</h1>

    <!-- Récapitulatif de la commande -->
    <div class="order-summary">
      <h2>Récapitulatif de la commande :</h2>
      <p><strong>Prénom:</strong> {{ prenom }}</p>
      <p><strong>Nom:</strong> {{ nom }}</p>
      <p><strong>Email:</strong> {{ email }}</p>
      <p v-if="selectedHotel"><strong>Hôtel choisi:</strong> {{ selectedHotel.nom }} - {{ selectedHotel.emplacement }}</p>
      <p><strong>Course choisie:</strong> {{ selectedCourse.nom }} - {{ selectedCourse.prix }}€</p>
      <p v-if="chambre"><strong>Chambre choisie:</strong> {{ chambre.numero }} - {{ chambre.prix }}€</p>
      <p v-if="parking">Place de parking (+50€)</p>
      <p v-if="isVIP">Billet VIP (+100€)</p>
      <h3>Prix Total: {{ totalPrice }}€</h3>
    </div>

    <!-- Formulaire de paiement -->
    <div class="payment-form">
      <h2>Informations de paiement</h2>
      <form @submit.prevent="handlePayment">
        <div class="form-group">
          <label for="cardNumber">Numéro de carte</label>
          <input
            v-model="cardNumber"
            type="text"
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            maxlength="19"
            required
          />
        </div>

        <div class="form-group">
          <label for="expiryDate">Date d'expiration</label>
          <input
            v-model="expiryDate"
            type="text"
            id="expiryDate"
            placeholder="MM/AA"
            maxlength="5"
            required
          />
        </div>

        <div class="form-group">
          <label for="cvv">Code de sécurité (CVV)</label>
          <input
            v-model="cvv"
            type="password"
            id="cvv"
            placeholder="XXX"
            maxlength="3"
            required
          />
        </div>

        <div class="form-group">
          <label for="nameOnCard">Nom sur la carte</label>
          <input
            v-model="nameOnCard"
            type="text"
            id="nameOnCard"
            placeholder="John Doe"
            required
          />
        </div>

        <button type="submit" class="submit-button">Confirmer le paiement</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaiementView',
  data() {
    return {
      prenom: '',
      nom: '',
      email: '',
      selectedHotel: null,
      selectedCourse: null,
      chambre: null,
      parking: false,
      isVIP: false,
      totalPrice: 0,
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
    };
  },
  created() {
    // Récupérer les données passées depuis la page de réservation
    const { prenom, nom, email, selectedCourse, selectedHotel, chambre, parking, isVIP, totalPrice } = this.$route.params;
    this.prenom = prenom;
    this.nom = nom;
    this.email = email;
    this.selectedCourse = selectedCourse;
    this.selectedHotel = selectedHotel;
    this.chambre = chambre;
    this.parking = parking;
    this.isVIP = isVIP;
    this.totalPrice = totalPrice;
  },
  methods: {
    handlePayment() {
      alert('Le paiement a été effectué avec succès!');
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>

<style scoped>
.payment-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: #e74c3c;
}

.order-summary {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.order-summary h2,
h3 {
  text-align: center;
  color: #e74c3c;
}

.payment-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.payment-form h2 {
  text-align: center;
  color: #e74c3c;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.submit-button {
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

.submit-button:hover {
  background-color: #c0392b;
}
</style>
