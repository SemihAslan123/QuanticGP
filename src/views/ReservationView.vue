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

      <!-- Sélecteur pour choisir un hôtel -->
      <div>
        <label for="hotel">Choisir un hôtel:</label>
        <select v-model="selectedHotel" @change="selectHotel">
          <option value="">-- Choisir un hôtel --</option>
          <option v-for="hotel in hotels" :key="hotel.id" :value="hotel">{{ hotel.nom }}</option>
        </select>
      </div>

      <!-- Sélecteur pour choisir une chambre, affiché uniquement si un hôtel est sélectionné -->
      <div v-if="selectedHotel">
        <label for="chambre">Choisir une chambre:</label>
        <select v-model="chambre" @change="calculateTotal" required>
          <option value="">-- Choisir une chambre --</option>
          <option v-for="room in selectedHotel.chambres" :key="room.id" :value="room">
            {{ room.numero }} - {{ room.prix }}€
          </option>
        </select>
      </div>

      <!-- Affichage du prix total -->
      <div>
        <h2>Prix Total: {{ totalPrice }}€</h2> <!-- Affichage du prix total calculé -->
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
      prenom: '', // Prénom de l'utilisateur
      nom: '',    // Nom de l'utilisateur
      email: '',  // Email de l'utilisateur
      parking: false, // Indicateur pour savoir si la place de parking est réservée
      selectedHotel: null, // Stocke l'hôtel sélectionné
      selectedCourse: null, // Stocke la course sélectionnée
      chambre: null, // Stocke la chambre sélectionnée
      hotels: [], // Liste des hôtels disponibles
      courses: [], // Liste des courses disponibles
      totalPrice: 0, // Prix total calculé
      isVIP: false, // Indicateur pour savoir si le billet est VIP
    };
  },
  methods: {
    // Fonction pour traiter la soumission du formulaire
    submitReservation() {
      // Vérifie si une course est sélectionnée avant de procéder
      if (!this.selectedCourse) {
        alert('Veuillez sélectionner une course.'); // Alerte si aucune course sélectionnée
        return; // Sort de la fonction si aucune course n'est sélectionnée
      }

      // Affiche une alerte confirmant la réservation
      alert(`Réservation effectuée pour ${this.prenom} ${this.nom} avec la course ${this.selectedCourse.nom}`);

      // Réinitialise tous les champs du formulaire après soumission
      this.resetForm();
    },

    // Fonction pour gérer la sélection d'un hôtel
    selectHotel() {
      // Réinitialise la chambre sélectionnée lorsque l'hôtel change
      if (!this.selectedHotel) {
        this.chambre = null; // Réinitialise la chambre si l'utilisateur choisit "Choisir un hôtel"
      }
      this.calculateTotal(); // Recalcule le prix total
    },

    // Fonction pour calculer le prix total
    calculateTotal() {
      // Réinitialise le prix total
      let price = 0;

      // Ajoute le prix de la course sélectionnée
      if (this.selectedCourse) {
        price += this.selectedCourse.prix;
      }

      // Ajoute le prix de la chambre sélectionnée
      if (this.chambre) {
        price += this.chambre.prix;
      }

      // Ajoute le coût du parking si sélectionné
      if (this.parking) {
        price += 50; // Coût de la place de parking
      }

      // Ajoute le coût du billet VIP si sélectionné
      if (this.isVIP) {
        price += 100; // Coût du billet VIP
      }

      // Met à jour le prix total
      this.totalPrice = price;
    },

    // Fonction pour réinitialiser les champs du formulaire
    resetForm() {
      this.prenom = ''; // Réinitialise le prénom
      this.nom = ''; // Réinitialise le nom
      this.email = ''; // Réinitialise l'email
      this.parking = false; // Réinitialise l'indicateur de parking
      this.isVIP = false; // Réinitialise l'indicateur VIP
      this.selectedHotel = null; // Réinitialise l'hôtel sélectionné
      this.selectedCourse = null; // Réinitialise la course sélectionnée
      this.chambre = null; // Réinitialise la chambre sélectionnée
      this.totalPrice = 0; // Réinitialise le prix total
    }
  },
  mounted() {
    // Chargement des données initiales lors du montage du composant
    this.hotels = [
      // Exemple d'hôtels, ces données peuvent venir d'une API ou d'un fichier local
      {id: 1, nom: 'Hôtel A', chambres: [{id: 1, numero: '101', prix: 100}, {id: 2, numero: '102', prix: 150}]},
      {id: 2, nom: 'Hôtel B', chambres: [{id: 3, numero: '201', prix: 200}]},
    ];

    // Exemple de courses, ces données peuvent venir d'une API ou d'un fichier local
    this.courses = [
      {id: 1, nom: 'Course 1', prix: 50},
      {id: 2, nom: 'Course 2', prix: 75},
      {id: 3, nom: 'Course 3', prix: 100},
    ];
  },
};
</script>

<style scoped>
/* Styles basiques pour le formulaire */
</style>
