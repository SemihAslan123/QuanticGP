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
      <div class="checkbox-group">
        <label for="parking" class="checkbox-label">
          <input type="checkbox" v-model="parking" @change="calculateTotal" id="parking" />
          <span class="checkbox-custom"></span> Prendre une place de parking (+50€)
        </label>
      </div>

      <!-- Case à cocher pour un billet VIP -->
      <div class="checkbox-group">
        <label for="vip" class="checkbox-label">
          <input type="checkbox" v-model="isVIP" @change="calculateTotal" id="vip" />
          <span class="checkbox-custom"></span> Billet VIP (+100€)
        </label>
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
          <p> Prix : {{ hotel.prix}}</p>
        </div>
      </div>
      <!-- Bouton pour annuler la sélection de l'hôtel -->
      <div v-if="selectedHotel">
        <button type="button" @click="cancelHotelSelection">Annuler la sélection de l'hôtel</button>
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
      selectedHotel: '',
      selectedCourse: '',
      /* eslint-disable no-undef */
      hotels: [
        {
          id: 1,
          nom: 'Riviera Marriott',
          emplacement: 'Ouest',
          image: require('@/assets/hotels/hotel1.jpeg'), // eslint-disable-line no-undef
          prix : 200,
        },
        {
          id: 2,
          nom: 'Aparthotel Adagio',
          emplacement: 'Est',
          image: require('@/assets/hotels/hotel2.jpg'), // eslint-disable-line no-undef
          prix : 350,
        }
      ],
      /* eslint-enable no-undef */
      courses: [
        {id: 1, nom: 'Course 1', prix: 50},
        {id: 2, nom: 'Course 2', prix: 75},
        {id: 3, nom: 'Course 3', prix: 100}
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
          parking: this.parking,
          isVIP: this.isVIP,
          totalPrice: this.totalPrice,
        },
      });
    },
    selectHotel(hotel) {
      // Si l'hôtel sélectionné est le même qu'avant, ne pas réinitialiser
      if (this.selectedHotel && this.selectedHotel.id === hotel.id) {
        return;
      }
      this.selectedHotel = hotel;
      this.calculateTotal();
    },
    cancelHotelSelection() {
      this.selectedHotel = null;
      this.calculateTotal();
    },
    calculateTotal() {
      let price = 0;

      // Ajout du prix de la course
      if (this.selectedCourse) price += this.selectedCourse.prix;

      // Ajout du prix de l'hôtel (fixé à 200€ pour Riviera Marriott et 350€ pour Aparthotel Adagio)
      if (this.selectedHotel) {
        price += this.selectedHotel.prix;
      }

      // Ajout du prix du parking et du billet VIP
      if (this.parking) price += 50;
      if (this.isVIP) price += 100;

      // Mise à jour du prix total
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

/* Style du bouton d'annulation */
button[type="button"] {
  background-color: #f39c12;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-top: 10px;
  width: auto;
  display: inline-block;
  text-align: center;
}

button[type="button"]:hover {
  background-color: #e67e22; /* Orange foncé au survol */
  transform: scale(1.05); /* Légère augmentation de la taille au survol */
}

button[type="button"]:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(255, 165, 0, 0.7); /* Lueur orange autour du bouton lorsqu'il est sélectionné */
}

button[type="button"]:active {
  background-color: #d35400; /* Changer la couleur au clic */
  transform: scale(1); /* Réduire l'effet de survol au clic */
}

/* Style du texte du bouton */
button[type="button"] {
  font-weight: bold;
  text-transform: uppercase;
}

form {
  margin-bottom: 10em; /* Ajoute une marge de 50px en bas du formulaire */
}

/* Centrer les cases à cocher et leur texte, mais la case doit être à droite du texte */
.checkbox-group {
  display: flex;
  justify-content: center; /* Centre les éléments horizontalement */
  align-items: center; /* Centre verticalement */
  margin-top: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 1.1em;
  color: #333;
  cursor: pointer;
  flex-direction: row-reverse; /* Mettre la case à cocher à droite du texte */
}

.checkbox-label input {
  display: none; /* Cacher l'élément input natif */
}

.checkbox-custom {
  width: 22px;
  height: 22px;
  border: 2px solid #e74c3c;
  border-radius: 5px;
  margin-left: 10px; /* Ajoute un espacement entre la case et le texte */
  transition: background-color 0.3s ease, border-color 0.3s ease;
  position: relative;
}

.checkbox-label input:checked + .checkbox-custom {
  background-color: #e74c3c;
  border-color: #e74c3c;
}

.checkbox-custom::after {
  content: '✔';
  color: white;
  position: absolute;
  left: 2px;
  bottom: 15px;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  transform: scale(0);
  transition: transform 0.3s ease;
}

.checkbox-label input:checked + .checkbox-custom::after {
  transform: scale(180%);
}

</style>
