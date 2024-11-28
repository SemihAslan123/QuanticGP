<template>
  <div class="espace-au-dessus">
    <div class="payment-container">
      <h1>Paiement de votre réservation</h1>

      <!-- Récapitulatif de la commande -->
      <div class="order-summary">
        <h2>Récapitulatif de la commande :</h2>
        <p><strong>Prénom:</strong> {{ prenom }}</p>
        <p><strong>Nom:</strong> {{ nom }}</p>
        <p><strong>Email:</strong> {{ email }}</p>

        <!-- Liste des courses sélectionnées -->
        <div v-if="selectedCourses.length">
          <h3>Courses choisies :</h3>
          <ul>
            <li v-for="course in selectedCourses" :key="course.id">
              {{ course.nom }} - {{ course.prix }}€
            </li>
          </ul>
        </div>

        <!-- Hôtel sélectionné -->
        <p v-if="selectedHotel">
          <strong>Hôtel choisi:</strong> {{ selectedHotel.nom }} -
          {{ selectedHotel.emplacement }} -
          {{ selectedHotel.prix }}€
        </p>

        <!-- Affichage des dates de parking si sélectionnées -->
        <div v-if="startDate && endDate">
          <p><strong>Date de début du parking:</strong> {{ startDate }}</p>
          <p><strong>Date de fin du parking:</strong> {{ endDate }}</p>
          <p><strong>Prix du parking:</strong> {{ parkingPrice }}€</p>
        </div>

        <!-- Options supplémentaires -->
        <p v-if="isVIP">Billet VIP (+100€)</p>

        <!-- Prix total -->
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PaiementView',
  data() {
    return {
      prenom: '',
      nom: '',
      email: '',
      selectedHotel: null,
      selectedCourses: [],
      startDate: null,
      endDate: null,
      isVIP: false,
      totalPrice: 0,
      parkingPrice: 0,
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
    };
  },
  created() {
    const { prenom, nom, email, selectedCourses, selectedHotel, startDate, endDate, isVIP, totalPrice } = this.$route.params;
    this.prenom = prenom;
    this.nom = nom;
    this.email = email;
    this.selectedCourses = selectedCourses || [];
    this.selectedHotel = selectedHotel;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isVIP = isVIP;
    this.totalPrice = totalPrice;

    if (this.startDate && this.endDate) {
      this.calculateParkingPrice();
    }
  },
  methods: {
    calculateParkingPrice() {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const differenceInTime = end - start;
      const differenceInDays = (differenceInTime / (1000 * 3600 * 24))+1;
      this.parkingPrice = differenceInDays * 50;
    },
    async handlePayment() {
      try {
        // Simulation de l'insertion dans la base de données
        const response = await axios.post('http://localhost:3001/billets', {
          prenom: this.prenom,
          nom: this.nom,
          email: this.email,
          selectedCourses: this.selectedCourses,
          selectedHotel: this.selectedHotel,
          startDate: this.startDate,
          endDate: this.endDate,
          isVIP: this.isVIP,
          totalPrice: this.totalPrice,
        });

        console.log('Réponse de l’API :', response.data);
        alert('Le paiement a été effectué avec succès!');
        this.$router.push({ name: 'Home' });
      } catch (error) {
        console.error('Erreur lors du paiement :', error);
        alert('Une erreur est survenue lors du paiement.');
      }
    },
  },
};
</script>


<style scoped>

.espace-au-dessus{
  padding-top: 90px;
}

.payment-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #dbd8d8;
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

.order-summary ul {
  list-style-type: none;
  padding: 0;
}

.order-summary li {
  margin: 5px 0;
  font-size: 1.1em;
  color: #333;
}
</style>
