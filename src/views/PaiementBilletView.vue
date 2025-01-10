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
          <strong>Hôtel choisi:</strong> {{ selectedHotel.nom }} - {{ selectedHotel.emplacement }} - {{ selectedHotel.prix }}€
        </p>
        <!-- Affichage des dates de l'hôtel -->
        <p v-if="hotelStartDate"><strong>Date d'arrivée à l'hôtel:</strong> {{ hotelStartDate }}</p>
        <p v-if="hotelEndDate"><strong>Date de départ de l'hôtel:</strong> {{ hotelEndDate }}</p>

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
export default {
  name: 'PaiementView',
  data() {
    return {
      prenom: '',
      nom: '',
      email: '',
      selectedHotel: null,
      selectedCourses: [],
      startDate: null, // Parking start date
      endDate: null, // Parking end date
      hotelStartDate: null, // Hotel start date
      hotelEndDate: null, // Hotel end date
      isVIP: false,
      totalPrice: 0,
      parkingPrice: 0,
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      id: null, // Will hold user ID
    };
  },
  created() {
    const {
      prenom, nom, email, selectedCourses, selectedHotel,
      startDate, endDate, hotelStartDate, hotelEndDate,
      isVIP, totalPrice
    } = this.$route.params;

    this.prenom = prenom;
    this.nom = nom;
    this.email = email;
    this.selectedCourses = selectedCourses || [];
    this.selectedHotel = selectedHotel;
    this.startDate = startDate; // Parking dates
    this.endDate = endDate;
    this.hotelStartDate = hotelStartDate; // Hotel dates
    this.hotelEndDate = hotelEndDate;
    this.isVIP = isVIP;
    this.totalPrice = totalPrice;

    if (this.startDate && this.endDate) {
      this.calculateParkingPrice();
    }

    this.setUserId();
  },
  mounted() {
    this.setUserId();
  },
  methods: {
    setUserId() {
      let user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        this.id = user.id;
        this.email = user.email;
      } else {
        // Generate a unique user ID if not logged in
        const storedBillets = JSON.parse(localStorage.getItem("billets")) || [];
        this.id = storedBillets.length ? storedBillets[storedBillets.length - 1].userId + 1 : 1;
      }
    },
    calculateParkingPrice() {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const differenceInTime = end - start;
      const differenceInDays = (differenceInTime / (1000 * 3600 * 24)) + 1;
      this.parkingPrice = differenceInDays * 50;
    },
    handlePayment() {
      // Créer un nouvel objet billet avec toutes les informations, même si certaines sont nulles.
      const newBillet = {
        id: Date.now(),  // ID unique généré avec un timestamp
        userId: this.id ?? null,  // Si 'this.id' est null, on garde 'null'
        course_nom: this.selectedCourses?.map(course => course.nom).join(", ") ?? 'Aucune course sélectionnée',
        is_vip: this.isVIP ?? false,
        prix_total: this.totalPrice + (this.isVIP ? 100 : 0),
        date_paiement: new Date().toISOString(),
        hotel_nom: this.selectedHotel?.nom ?? 'Aucun hôtel sélectionné',
        date_debut_hotel: this.hotelStartDate ?? null,
        date_fin_hotel: this.hotelEndDate ?? null,
        date_debut_parking: this.startDate ?? null,
        date_fin_parking: this.endDate ?? null,
      };

      // Sauvegarder le billet dans localStorage
      const billets = JSON.parse(localStorage.getItem("billets")) || [];
      billets.push(newBillet);
      localStorage.setItem("billets", JSON.stringify(billets));

      alert('Le paiement a été effectué avec succès!');
      this.$router.push({ name: 'Home' });
    }

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
