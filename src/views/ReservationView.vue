<template>
  <div>
    <h1>Réservation de Billet</h1>
    <form @submit.prevent="submitReservation">
      <!-- Champ pour le prénom -->
      <div>
        <label for="prenom">Prénom:</label>
        <input type="text" v-model="prenom" required />
      </div>

      <!-- Champ pour le nom -->
      <div>
        <label for="nom">Nom:</label>
        <input type="text" v-model="nom" required />
      </div>

      <!-- Champ pour l'email -->
      <div>
        <label for="email">Email:</label>
        <input type="text" v-model="email" required />
      </div>

      <!-- Sélecteur pour choisir une course -->
      <div>
        <label for="course">Choisir une course:</label>
        <select v-model="selectedCourse" @change="calculateTotal" required>
          <option value="">-- Choisir une course --</option>
          <option v-for="course in courses" :key="course.id" :value="course">
            {{ course.nom }} - {{ course.prix }}€
          </option>
        </select>
      </div>

      <!-- Case à cocher pour une place de parking -->
      <div>
        <label for="parking">Prendre une place de parking (+50€):</label>
        <input type="checkbox" v-model="parking" @change="calculateTotal" />
      </div>

      <!-- Case à cocher pour un billet VIP -->
      <div>
        <label for="vip">Billet VIP (+100€):</label>
        <input type="checkbox" v-model="isVIP" @change="calculateTotal" />
      </div>

      <!-- Affichage des hôtels sous forme de cartes -->
      <h2>Choisissez un hôtel :</h2>
      <div class="hotel-cards">
        <div v-for="hotel in hotels" :key="hotel.id"
             class="hotel-card"
             @click="selectHotel(hotel)"
             :class="{'selected': selectedHotel && selectedHotel.id === hotel.id}">
          <img :src="hotel.image" alt="Image de l'hôtel" class="hotel-image" />
          <h3>{{ hotel.nom }}</h3>
          <p>Emplacement : {{ hotel.emplacement }}</p>

          <!-- Sélecteur de chambre uniquement si l'hôtel est sélectionné -->
          <div v-if="selectedHotel && selectedHotel.id === hotel.id">
            <label for="chambre">Choisir une chambre :</label>
            <select v-model="chambre" @change="calculateTotal" required>
              <option value="">-- Choisir une chambre --</option>
              <option v-for="room in hotel.chambres" :key="room.id" :value="room">
                {{ room.numero }} - {{ room.prix }}€
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Affichage du prix total -->
      <div>
        <h2>Prix Total: {{ totalPrice }}€</h2>
      </div>

      <!-- Bouton pour soumettre le formulaire -->
      <button type="submit">Payer</button>
    </form>
  </div>
</template>

<script>


export default {
  name: 'ReservationView',
  data() {
    return {
      prenom: '',
      nom: '',
      email: '',
      parking: false,
      selectedHotel: null,
      selectedCourse: null,
      chambre: null,
      /* eslint-disable no-undef */
      hotels: [
        {
          id: 1,
          nom: 'Riviera Marriott',
          emplacement: 'Ouest',
          image: require('@/assets/hotels/hotel1.jpeg'), // eslint-disable-line no-undef
          chambres: [
            { id: 1, numero: '101', prix: 100 },
            { id: 2, numero: '102', prix: 150 },
            { id: 3, numero: '103', prix: 120 },
            { id: 4, numero: '104', prix: 200 },
            { id: 5, numero: '105', prix: 175 },
            { id: 6, numero: '106', prix: 130 },
            { id: 7, numero: '107', prix: 160 },
            { id: 8, numero: '108', prix: 180 },
            { id: 9, numero: '109', prix: 110 },
            { id: 10, numero: '110', prix: 140 }
          ]
        },
        {
          id: 2,
          nom: 'Aparthotel Adagio',
          emplacement: 'Est',
          image: require('@/assets/hotels/hotel2.jpg'), // eslint-disable-line no-undef
          chambres: [
            { id: 3, numero: '201', prix: 200 },
            { id: 4, numero: '202', prix: 220 },
            { id: 5, numero: '203', prix: 180 },
            { id: 6, numero: '204', prix: 250 },
            { id: 7, numero: '205', prix: 210 },
            { id: 8, numero: '206', prix: 190 },
            { id: 9, numero: '207', prix: 230 },
            { id: 10, numero: '208', prix: 240 },
            { id: 11, numero: '209', prix: 210 },
            { id: 12, numero: '210', prix: 260 }
          ]
        }
      ],
      /* eslint-enable no-undef */
      courses: [
        { id: 1, nom: 'Course 1', prix: 50 },
        { id: 2, nom: 'Course 2', prix: 75 },
        { id: 3, nom: 'Course 3', prix: 100 }
      ],
      totalPrice: 0,
      isVIP: false,
    };
  },

  methods: {
    submitReservation() {
      this.$router.push({
        name: 'Paiement',
        params: {
          prenom: this.prenom,
          nom: this.nom,
          email: this.email,
          selectedCourse: this.selectedCourse,
          selectedHotel: this.selectedHotel,
          chambre: this.chambre,
          parking: this.parking,
          isVIP: this.isVIP,
          totalPrice: this.totalPrice,
        },
      });
    },
    selectHotel(hotel) {
      // Si l'hôtel sélectionné est le même qu'avant, ne pas réinitialiser la chambre
      if (this.selectedHotel && this.selectedHotel.id === hotel.id) {
        return;
      }
      this.selectedHotel = hotel;
      this.chambre = null; // Réinitialiser la chambre lorsque l'hôtel change
      this.calculateTotal();
    },
    calculateTotal() {
      let price = 0;
      if (this.selectedCourse) price += this.selectedCourse.prix;
      if (this.chambre) price += this.chambre.prix; // Si une chambre est sélectionnée, ajouter son prix
      if (this.parking) price += 50;
      if (this.isVIP) price += 100;
      this.totalPrice = price;
    }
  }
};
</script>


<style scoped>
/* Organisation générale */
.hotel-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.hotel-card {
  border: 2px solid #e74c3c; /* Bordure rouge */
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 250px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.hotel-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
  background-color: #ffe5e5; /* Légère teinte rouge au survol */
}

.hotel-card.selected {
  border: 2px solid #27ae60; /* Une bordure verte pour indiquer la sélection */
}

.hotel-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

h1 {
  text-align: center;
  color: #e74c3c; /* Titre rouge */
  font-size: 2em;
  margin-bottom: 20px;
}

h2 {
  color: #e74c3c;
  text-align: center;
  font-size: 1.5em;
  margin-top: 30px;
}

label {
  display: block;
  margin-top: 15px;
  font-weight: bold;
  color: #333;
}

select,
input[type="text"],
input[type="checkbox"] {
  width: 80%; /* Réduit la taille des champs de texte */
  max-width: 300px; /* Limite la taille maximale */
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  text-align: center;
}

button[type="submit"] {
  background-color: #e74c3c; /* Rouge pour le bouton */
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
  width: 10em;
}

button[type="submit"]:hover {
  background-color: #c0392b; /* Rouge foncé au survol */
}

form div {
  margin-bottom: 20px;
}

.hotel-card h3 {
  color: #e74c3c;
  margin-bottom: 10px;
  font-size: 1.3em;
}

.hotel-card p {
  color: #555;
  font-size: 0.9em;
}

.price-total {
  font-weight: bold;
  font-size: 1.2em;
  color: #333;
  text-align: center;
  margin-top: 15px;
}

</style>
