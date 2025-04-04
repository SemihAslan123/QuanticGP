<template>
  <div class="conteneur-reservation-billet">
    <h1>Réservation de billet</h1>
    <form @submit.prevent="submitReservation">
      <!-- Champs utilisateur si non connecté -->
      <div v-if="!isLoggedIn">
        <div>
          <label for="prenom">Prénom:</label>
          <input type="text" v-model="prenom" required />
        </div>
        <div>
          <label for="nom">Nom:</label>
          <input type="text" v-model="nom" required />
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="text" v-model="email" required />
        </div>
      </div>

      <!-- Courses -->
      <h2>Choisissez vos courses :</h2>
      <div class="course-cards">
        <div
          v-for="course in courses"
          :key="course.id"
          class="course-card"
          @click="toggleCourseSelection(course)"
          :class="{ selected: selectedCourses.includes(course) }"
        >
          <img :src="course.image" alt="Image de la course" class="course-image" />
          <h3>{{ course.nom }}</h3>
          <p>Date : {{ course.date }}</p>
          <p>{{ course.description }}</p>
          <p>Prix : {{ course.prix }}€</p>
        </div>
      </div>

      <!-- Dates de parking -->
      <h2>Choisissez vos dates de parking :</h2>
      <div class="parking-dates">
        <label for="startDate">Date de début du parking :</label>
        <input
          type="date"
          id="startDate"
          v-model="startDate"
          :min="'2025-07-15'"
          :max="'2025-07-19'"
          @change="updateMaxEndDate"
        />
        <label v-if="startDate" for="endDate">Date de fin du parking :</label>
        <input
          v-if="startDate"
          type="date"
          id="endDate"
          v-model="endDate"
          :min="startDate"
          :max="'2025-07-19'"
          @change="calculateTotal"
        />
      </div>
      <div v-if="startDate || endDate">
        <button id="annulation" type="button" @click="cancelParkingSelection">Annuler la sélection de parking</button>
      </div>

      <!-- Billet VIP -->
      <h2>Souhaitez-vous un billet VIP ?</h2>
      <div class="checkbox-group">
        <label for="vip" class="checkbox-label">
          <input type="checkbox" v-model="isVIP" @change="calculateTotal" id="vip" />
          <span class="checkbox-custom"></span> Billet VIP (+100€)
        </label>
      </div>
      <div class="vip-info">
        <button type="button" @click="toggleVipInfo" id="info-button">C'est quoi VIP ?</button>
        <p v-if="isVipInfoVisible" class="vip-description">
          Le billet VIP offre une expérience premium, y compris un accès exclusif aux zones réservées, des boissons gratuites, et des sièges prioritaires.
        </p>
      </div>

      <!-- Hôtels -->
      <h2>Choisissez un hôtel :</h2>
      <div class="hotel-cards">
        <div
          v-for="hotel in hotels"
          :key="hotel.id"
          class="hotel-card"
          @click="selectHotel(hotel)"
          :class="{ selected: selectedHotel && selectedHotel.id === hotel.id }"
        >
          <img :src="hotel.image" alt="Image de l'hôtel" class="hotel-image" />
          <h3>{{ hotel.nom }}</h3>
          <p>Emplacement : {{ hotel.emplacement }}</p>
          <p>Prix : {{ hotel.prix }}€</p>
        </div>
      </div>
      <h2>Choisissez vos dates pour l'hôtel :</h2>
      <div class="hotel-dates" v-if="selectedHotel">
        <label for="hotelStartDate">Date de début :</label>
        <input
          type="date"
          id="hotelStartDate"
          v-model="hotelStartDate"
          :min="'2025-07-15'"
          :max="'2025-07-19'"
          @change="updateMaxHotelEndDate"
        />
        <label v-if="hotelStartDate" for="hotelEndDate">Date de fin :</label>
        <input
          v-if="hotelStartDate"
          type="date"
          id="hotelEndDate"
          v-model="hotelEndDate"
          :min="hotelStartDate"
          :max="'2025-07-19'"
          @change="calculateTotal"
        />
      </div>
      <div v-if="selectedHotel">
        <button id="annulation" @click="cancelHotelSelection">Annuler la sélection de l'hôtel</button>
      </div>

      <!-- Prix total -->
      <div>
        <h2>Prix Total: {{ totalPrice }}€</h2>
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <button type="submit">Payer</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ReservationView",
  data() {
    return {
      prenom: "",
      nom: "",
      email: "",
      parking: false,
      selectedHotel: null,
      selectedCourses: [],
      startDate: null,
      endDate: null,
      hotelStartDate: null,
      hotelEndDate: null,
      hotels: [
        { id: 1, nom: "Riviera Marriott", emplacement: "Ouest", image: "/assets/hotels/hotel1.jpeg", prix: 600 },
        { id: 2, nom: "Fairmont Monte Carlo", emplacement: "Est", image: "/assets/hotels/hotel2.jpg", prix: 700 },
      ],
      // Mise à jour des dates au format ISO
      courses: [
        {
          id: 1,
          nom: "Course 1",
          date: "2025-07-17",  // format ISO (YYYY-MM-DD)
          prix: 500,
          description: "Course de Formule 1 standard en journée, idéale pour les amateurs souhaitant profiter de l'action à moindre coût.",
          image: "/assets/courses/course1.jpeg"
        },
        {
          id: 2,
          nom: "Course 2",
          date: "2025-07-18",  // format ISO
          prix: 850,
          description: "Course en fin de journée, incluant un accès VIP aux zones de ravitaillement et des stands pour observer les équipes de près.",
          image: "/assets/courses/course2.png"
        },
        {
          id: 3,
          nom: "Course 3",
          date: "2025-07-19",  // format ISO
          prix: 1200,
          description: "Course nocturne spectaculaire avec accès exclusif aux coulisses et une rencontre avec les pilotes après la course.",
          image: "/assets/courses/course3.png"
        },
      ],
      totalPrice: 0,
      isVIP: false,
      isVipInfoVisible: false,
      isLoggedIn: false,
      user: null,
      errorMessage: "",
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.isLoggedIn = true;
      this.user = user;
      this.prenom = user.prenom;
      this.nom = user.nom;
      this.email = user.mail;
    }
  },
  methods: {
    toggleVipInfo() {
      this.isVipInfoVisible = !this.isVipInfoVisible;
    },
    toggleCourseSelection(course) {
      const index = this.selectedCourses.findIndex((c) => c.id === course.id);
      if (index > -1) {
        this.selectedCourses.splice(index, 1);
      } else {
        this.selectedCourses.push(course);
      }
      this.calculateTotal();
    },
    updateMaxEndDate() {
      if (this.endDate && new Date(this.endDate) < new Date(this.startDate)) {
        this.endDate = this.startDate;
      }
      this.calculateTotal();
    },
    updateMaxHotelEndDate() {
      if (this.hotelEndDate && new Date(this.hotelEndDate) < new Date(this.hotelStartDate)) {
        this.hotelEndDate = this.hotelStartDate;
      }
      this.calculateTotal();
    },
    calculateTotal() {
      let price = 0;
      this.selectedCourses.forEach((course) => {
        price += course.prix;
      });
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const days = Math.min(Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1, 5);
        price += days * 50;
      }
      if (this.selectedHotel && this.hotelStartDate && this.hotelEndDate) {
        const start = new Date(this.hotelStartDate);
        const end = new Date(this.hotelEndDate);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        price += Math.max(0, nights) * this.selectedHotel.prix;
      }
      if (this.isVIP) price += 100;
      this.totalPrice = price;
    },
    submitReservation() {
      if (this.selectedCourses.length === 0) {
        this.errorMessage = "Veuillez sélectionner au moins une course.";
        return;
      }
      if (this.startDate && !this.endDate) {
        this.errorMessage = "Veuillez sélectionner une date de fin de parking si une date de début est définie.";
        return;
      }
      if (this.selectedHotel) {
        if (!this.hotelStartDate || !this.hotelEndDate) {
          this.errorMessage = "Veuillez sélectionner des dates valides pour votre séjour à l'hôtel.";
          return;
        }
        if (this.hotelStartDate === this.hotelEndDate) {
          this.errorMessage = "La date d'arrivée et de départ pour l'hôtel ne peuvent pas être identiques.";
          return;
        }
      }
      this.errorMessage = "";
      this.$router.push({
        name: "Paiement",
        params: {
          prenom: this.prenom,
          nom: this.nom,
          email: this.email,
          selectedCourses: this.selectedCourses,
          selectedHotel: this.selectedHotel,
          hotelStartDate: this.hotelStartDate,
          hotelEndDate: this.hotelEndDate,
          startDate: this.startDate,
          endDate: this.endDate,
          isVIP: this.isVIP,
          totalPrice: this.totalPrice,
        },
      });
    },
    cancelParkingSelection() {
      this.startDate = null;
      this.endDate = null;
      this.calculateTotal();
    },
    cancelHotelSelection() {
      this.selectedHotel = null;
      this.hotelStartDate = null;
      this.hotelEndDate = null;
      this.calculateTotal();
    },
    selectHotel(hotel) {
      this.selectedHotel = this.selectedHotel?.id === hotel.id ? null : hotel;
      this.hotelStartDate = null;
      this.hotelEndDate = null;
      this.calculateTotal();
    },
  },
};
</script>


<style scoped>
/* Style du bouton d'information "C'est quoi VIP ?" */
.vip-info {
  text-align: center;
  margin-top: 20px;
}

#info-button {
  background-color: #3498db; /* Bleu clair */
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
  width: 300px;
}

#info-button:hover {
  background-color: #2980b9; /* Bleu plus foncé au survol */
}

.vip-description {
  font-size: 1.1em;
  color: #fff;
  background-color: #2c3e50;
  border-radius: 5px;
  padding: 15px;
  max-width: 30%;
  margin: 10px auto;
}

.error-message {
  color: #e74c3c;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.conteneur-reservation-billet{
  padding-top: 70px;
}

.parking-dates {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.parking-dates label {
  font-weight: bold;
  margin-bottom: 10px;
  color: #fff;
}

.parking-dates input {
  width: 200px;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 20px;
}

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
  background-color: #3f3232; /* Légère teinte rouge au survol */
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
  color: #fff;
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
  color: #fff;
  font-size: 0.9em;
}

/* Style du bouton d'annulation */
#annulation {
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

#annulation:hover {
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
  color: #fff;
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
  background-color: #06be06;
  border-color: #06be06;
}

.checkbox-label input:checked + .checkbox-custom::after {
  transform: scale(180%);
}

/* Style de l'image de la course */
.course-image {
  width: 260px;
  height: 260px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: -18px;
  border: 1px solid black; /* Ajoute une bordure noire fine autour de l'image */
}

/* Style des boutons de navigation (flèches) */
button[type="button"] {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 2em;
}

button[type="button"]:hover {
  background-color: #c0392b;
}

button[type="button"]:focus {
  outline: none;
}

button[type="button"]:active {
  background-color: #d35400;
}

/* Style du texte de la course */
.course-info h3 {
  font-size: 1.5em;
  color: #e74c3c;
  margin-bottom: 0;
}

.course-info p {
  color: #fff;
  font-size: 22px;
  margin: 5px 0;
}

.course-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
}

.course-card {
  border: 2px solid #e74c3c;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 250px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
  background-color: #3f3232;
}

.course-card.selected {
  border: 2px solid #27ae60;
}

.course-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.course-card h3 {
  color: #e74c3c;
  margin-bottom: 10px;
  font-size: 1.3em;
}

.course-card p {
  color: #fff;
  font-size: 0.9em;
}
</style>
