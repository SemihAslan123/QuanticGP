<template>
  <div class="payment-container">
    <h1>Page de Paiement</h1>

    <div class="cart-summary">
      <h2>Résumé de votre commande</h2>
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <p>{{ item.name }} - {{ item.prix }} €</p>
      </div>
      <div class="total">
        <p><strong>Total : {{ totalPrice }} €</strong></p>
      </div>
    </div>

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
      cart: [],
      paymentDetails: {
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
      },
    };
  },
  created() {
    this.loadCart();
  },
  methods: {
    loadCart() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) {
        const cart = localStorage.getItem(`cart_${user.id}`);
        this.cart = cart ? JSON.parse(cart) : [];
      }
    },
    processPayment() {
      // Implémentez ici le traitement du paiement via une API (par exemple, Stripe)
      alert('Paiement traité avec succès !');
      this.clearCart();
    },
    clearCart() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) {
        localStorage.removeItem(`cart_${user.id}`);
      }
    },
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((total, item) => total + parseFloat(item.prix), 0).toFixed(2);
    },
  },
};
</script>

<style scoped>
.payment-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.cart-summary {
  margin-bottom: 20px;
}

.cart-item {
  margin: 5px 0;
}

.total {
  font-size: 1.2em;
  margin-top: 10px;
  font-weight: bold;
}

.payment-form label {
  display: block;
  margin-bottom: 5px;
}

.payment-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
}

button:hover {
  background-color: #2ecc71;
}
</style>
