<template>
  <div class="activite-container">
    <div class="filters">
      <h2>Filtres</h2>
      <div>
        <label for="search-name">Rechercher par nom:</label>
        <input
            id="search-name"
            type="text"
            v-model="filters.name"
            placeholder="Nom de l'activité"
        />
      </div>
      <div>
        <label for="search-date">Rechercher par date:</label>
        <input
            id="search-date"
            type="date"
            v-model="filters.date"
        />
      </div>
      <div>
        <label for="min-price">Prix minimum (€):</label>
        <input
            id="min-price"
            type="number"
            v-model.number="filters.minPrice"
            placeholder="Min"
            min="0"
        />
      </div>
      <div>
        <label for="max-price">Prix maximum (€):</label>
        <input
            id="max-price"
            type="number"
            v-model.number="filters.maxPrice"
            placeholder="Max"
            min="0"
        />
      </div>
    </div>

    <div v-if="filteredActivities.length === 0" class="no-activities">
      <p>Aucune activité disponible pour le moment selon les critères de recherche.</p>
    </div>

    <div v-else class="activities-list">
      <div class="activity-card" v-for="activity in filteredActivities" :key="activity.id">
        <h3>{{ activity.name }}</h3>
        <p><strong>Date :</strong> {{ activity.date | formatDate }}</p>
        <p><strong>Horaire :</strong> {{ activity.heure_debut }} - {{ activity.heure_fin }}</p>
        <p><strong>Prix :</strong> {{ activity.prix }} €</p>
        <p><strong>Description :</strong> {{ activity.description }}</p>
        <img :src="activity.image" alt="Image de l'activité" class="activity-image" />

        <!-- Condition pour désactiver le bouton si l'activité est déjà dans le panier -->
        <button
            :disabled="isActivityInCart(activity)"
            :class="{'disabled-button': isActivityInCart(activity)}"
            @click="addToCart(activity)"
        >
          {{ isActivityInCart(activity) ? 'Déjà dans le panier' : 'Ajouter au panier' }}
        </button>
      </div>
    </div>

    <!-- Affichage du Panier à droite -->
    <div class="cart-container">
      <h2>Panier</h2>
      <div v-if="cart.length === 0" class="empty-cart">
        <p>Votre panier est vide.</p>
      </div>
      <div v-else>
        <div class="cart-item" v-for="item in cart" :key="item.id">
          <h4>{{ item.name }}</h4>
          <p>{{ item.prix }} €</p>
          <button @click="removeFromCart(item)">Retirer</button>
        </div>
        <div class="total">
          <p><strong>Total : {{ totalPrice }} €</strong></p>
        </div>
        <button @click="checkout">Payer la commande</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ClientActiviteView',
  data() {
    return {
      activities: [], // Toutes les activités récupérées
      cart: [], // Panier vide
      filters: { // Critères de filtrage
        name: '',
        date: '',
        minPrice: 0,
        maxPrice: 1000,
      },
    };
  },
  created() {
    this.fetchActivities(); // Appel à la méthode pour récupérer les activités
    this.loadCart(); // Charger le panier de l'utilisateur connecté
  },
  methods: {
    async fetchActivities() {
      try {
        const response = await axios.get('http://localhost:3001/clientActivite');
        this.activities = response.data; // Remplir le tableau avec les événements récupérés
      } catch (error) {
        console.error('Erreur lors de la récupération des événements :', error);
        this.activities = []; // En cas d'erreur, afficher un tableau vide
      }
    },
    addToCart(activity) {
      if (!this.isActivityInCart(activity)) {
        this.cart.push(activity); // Ajouter l'activité au panier
        this.saveCart(); // Sauvegarder le panier dans localStorage
      }
    },
    removeFromCart(activity) {
      this.cart = this.cart.filter(item => item.id !== activity.id); // Retirer l'activité du panier
      this.saveCart(); // Sauvegarder le panier dans localStorage
    },
    checkout() {
      this.$router.push('/clientPaiementActivite');
    },

    loadCart() {
      const user = JSON.parse(localStorage.getItem('user')); // Récupérer les infos de l'utilisateur connecté
      if (user && user.id) {
        const cart = localStorage.getItem(`cart_${user.id}`);
        this.cart = cart ? JSON.parse(cart) : []; // Charger le panier pour cet utilisateur
      }
    },
    saveCart() {
      const user = JSON.parse(localStorage.getItem('user')); // Récupérer l'utilisateur connecté
      if (user && user.id) {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(this.cart)); // Sauvegarder le panier avec une clé unique à l'utilisateur
      }
    },
    isActivityInCart(activity) {
      return this.cart.some(item => item.id === activity.id); // Vérifier si l'activité est déjà dans le panier
    },
  },
  computed: {
    filteredActivities() {
      return this.activities.filter(activity => {
        const matchesName = activity.name.toLowerCase().includes(this.filters.name.toLowerCase());
        const matchesDate = this.filters.date ? new Date(activity.date).toLocaleDateString() === new Date(this.filters.date).toLocaleDateString() : true;
        const matchesMinPrice = parseFloat(activity.prix) >= this.filters.minPrice;
        const matchesMaxPrice = parseFloat(activity.prix) <= this.filters.maxPrice;

        return matchesName && matchesDate && matchesMinPrice && matchesMaxPrice;
      });
    },
    totalPrice() {
      if (!Array.isArray(this.cart) || this.cart.length === 0) {
        return 0; // Si le panier est vide ou mal initialisé, retourner 0
      }
      return this.cart.reduce((total, item) => total + parseFloat(item.prix), 0).toFixed(2); // Calculer la somme totale
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
.activite-container {
  margin-top: 100px;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  padding: 20px;
}

.filters {
  flex: 0 0 300px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.filters label {
  display: block;
  margin-bottom: 5px;
}

.filters input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.activities-list {
  flex: 1;
}

.activity-card {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.activity-card h3 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.activity-card p {
  margin: 5px 0;
  color: #34495e;
}

.activity-image {
  width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 8px;
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

.disabled-button {
  background-color: #ccc;
  cursor: not-allowed;
}

.cart-container {
  width: 300px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.cart-item {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.empty-cart {
  text-align: center;
  font-size: 1.2em;
  color: #e74c3c;
}

.total {
  font-size: 1.5em;
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
}

button {
  width: 100%;
  margin-top: 20px;
}
</style>
