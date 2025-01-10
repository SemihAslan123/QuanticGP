<template>
  <div class="payment-container">
    <!-- Bloc récapitulatif avec fond blanc -->
    <div class="cart-summary">
      <h2>Résumé de votre commande</h2>
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <p>{{ item.name }} - {{ item.prix }} €</p>
        <p><strong>Heure : </strong>{{ item.heure_debut }} - {{ item.heure_fin }}</p>
        <p><strong>Description : </strong>{{ item.description }}</p>
        <p><strong>Date : </strong>{{ item.date | formatDate }}</p>
        <img v-if="item.image" :src="item.image" alt="Image de l'activité" class="activite-image" />
      </div>
      <div class="total">
        <p><strong>Total : {{ totalPrice }} €</strong></p>
      </div>
    </div>

    <!-- Bloc de paiement -->
    <div class="payment-form">
      <h2>Informations de Paiement</h2>
      <form @submit.prevent="processPayment">
        <label for="card-name">Nom sur la carte</label>
        <input id="card-name" type="text" v-model="paymentDetails.cardName" required />

        <label for="card-number">Numéro de carte</label>
        <input id="card-number" type="text" v-model="paymentDetails.cardNumber" required maxlength="16" />

        <label for="expiry-date">Date d'expiration (MM/AA)</label>
        <input id="expiry-date" type="text" v-model="paymentDetails.expiryDate" required maxlength="5" />

        <label for="cvv">CVV</label>
        <input id="cvv" type="text" v-model="paymentDetails.cvv" required maxlength="3" />

        <button type="submit">Payer {{ totalPrice }} €</button>
      </form>
    </div>
  </div>
</template>


<script>
export default {
  name: 'PaymentPage',
  data() {
    return {
      cart: [],  // Panier
      paymentDetails: {  // Détails de paiement
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
      },
    };
  },
  created() {
    this.loadCart();  // Charger le panier depuis localStorage
  },
  methods: {
    loadCart() {
      const user = JSON.parse(localStorage.getItem('user')); // Récupérer l'utilisateur depuis le localStorage
      if (user && user.id) {
        const cart = localStorage.getItem(`cart_${user.id}`);  // Charger le panier spécifique à l'utilisateur
        this.cart = cart ? JSON.parse(cart) : [];
      }
    },
    processPayment() {
      const user = JSON.parse(localStorage.getItem('user'));  // Récupérer l'utilisateur
      if (user && user.id) {
        const userActivities = JSON.parse(localStorage.getItem(`activities_${user.id}`)) || [];
        const activitiesToAdd = this.cart.map(item => ({
          id: item.id,
          name: item.name,
          prix: item.prix,
          heure_debut: item.heure_debut,
          heure_fin: item.heure_fin,
          description: item.description,
          date: item.date,
          image: item.image,
        }));

        localStorage.setItem(`activities_${user.id}`, JSON.stringify([...userActivities, ...activitiesToAdd]));

        // Vider le panier après paiement
        this.clearCart();

        alert('Le paiement a été effectué avec succès!');
        this.$router.push({ name: 'Home' });  // Rediriger vers la page d'accueil
      }
    },
    clearCart() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) {
        localStorage.removeItem(`cart_${user.id}`);  // Retirer le panier du localStorage
        this.cart = [];  // Vider le panier dans l'état du composant
      }
    },
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => total + parseFloat(item.prix), 0).toFixed(2);
    },
  },
  filters: {
    formatDate(value) {
      if (!value) return 'Non spécifiée';
      const date = new Date(value);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
};
</script>

<style scoped>
.payment-container {
  margin-top: 100px;
  display: flex;
  justify-content: center;  /* Centrer les blocs horizontalement */
  align-items: center;      /* Centrer les blocs verticalement */
  gap: 30px;
  padding: 20px;
  height: calc(100vh - 100px); /* Pour s'assurer que les blocs sont centrés sur toute la hauteur de la page */
}

.cart-summary {
  flex: 0 0 600px;
  background-color: white;  /* Fond blanc pour le récapitulatif */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.cart-item {
  margin-bottom: 20px;
}

.activite-image {
  width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 8px;
}

.payment-form {
  flex: 0 0 300px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.payment-form label {
  display: block;
  margin-bottom: 5px;
}

.payment-form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #2980b9;
}

</style>
