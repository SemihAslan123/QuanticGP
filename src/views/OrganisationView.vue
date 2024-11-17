<template>
  <div class="organizer-page">
    <div class="content">
      <h1>Gestion de la Course</h1>

      <!-- Section pour afficher les événements -->
      <div v-if="currentSection === 'events'">
        <h2>Liste des événements</h2>
        <div v-if="events.length > 0">
          <div v-for="event in events" :key="event.id" class="event-item">
            <h3>{{ event.name }}</h3>
            <p>{{ event.date }}</p>
            <p>{{ event.description }}</p>
            <img :src="event.image" alt="Event image" v-if="event.image" />
          </div>
        </div>
        <div v-else>
          <p>Aucun événement trouvé.</p>
        </div>
      </div>

      <!-- Section pour modifier l'événement -->
      <div v-if="currentSection === 'event'">
        <h2>Créer un événement</h2>
        <div>
          <label for="courseName">Nom de la course :</label>
          <input type="text" v-model="courseName" required />
        </div>
        <div>
          <label for="eventDate">Date de l'événement :</label>
          <input type="date" v-model="eventDate" required />
        </div>

        <div>
          <label for="eventDescription">Description de l'événement :</label>
          <!-- Zone pour l'éditeur WYSIWYG -->
          <div ref="editorContainer" class="editor-container"></div>
        </div>

        <div>
          <label for="eventImage">Image de l'événement :</label>
          <input type="file" @change="handleFileUpload" />
          <img v-if="eventImage" :src="eventImage" alt="Image de l'événement" />
        </div>

        <button type="submit" @click="saveEvent">Sauvegarder</button>
      </div>

      <!-- Bouton pour afficher les événements -->
      <button @click="showEvents">Afficher les événements</button>
    </div>
  </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import axios from 'axios';

export default {
  name: 'OrganisationView',
  data() {
    return {
      currentSection: 'event', // La section actuellement affichée
      courseName: '',
      eventDate: '',
      eventDescription: '',
      eventImage: null,
      events: [], // Liste des événements récupérés
      quillEditor: null, // Instance de l'éditeur Quill
    };
  },
  mounted() {
    // Initialiser Quill lorsque le composant est monté
    this.quillEditor = new Quill(this.$refs.editorContainer, {
      theme: 'snow',
      placeholder: 'Écrivez la description de l’événement...',
      modules: {
        toolbar: [
          [{ header: '1' }, { header: '2' }, { font: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['bold', 'italic', 'underline'],
          ['link', 'image'],
          ['blockquote', 'code-block'],
          ['clean'],
        ]
      }
    });

    // Récupérer la valeur initiale si nécessaire
    this.quillEditor.root.innerHTML = this.eventDescription;
  },
  methods: {
    // Méthode pour afficher les événements
    async showEvents() {
      try {
        const response = await axios.get('http://localhost:3001/organisation');  // URL pour récupérer les événements
        this.events = response.data; // Enregistrer les événements dans la variable `events`
        this.currentSection = 'events'; // Afficher la section des événements
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        alert("Erreur lors de la récupération des événements.");
      }
    },
    async saveEvent() {
      if (!this.courseName || !this.eventDate || !this.quillEditor.getText().trim() || !this.eventImage) {
        alert("Veuillez remplir tous les champs avant de sauvegarder.");
        return;
      }

      // Récupérer la description de l'événement
      this.eventDescription = this.quillEditor.getText().trim();

      // Construire l'objet de données
      const eventData = {
        courseName: this.courseName,
        eventDate: this.eventDate,
        eventDescription: this.eventDescription,
        eventImage: this.eventImage // image encodée en base64
      };

      try {
        const response = await axios.post('http://localhost:3001/organisation', eventData);
        alert(response.data.message);

        // Réinitialiser le formulaire après succès
        this.resetForm();
      } catch (error) {
        console.error("Erreur lors de l'envoi des données:", error);
        alert("Erreur lors de l'enregistrement de l'événement.");
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.eventImage = reader.result; // Encodage en base64
        };
        reader.readAsDataURL(file);
      }
    },
    resetForm() {
      this.courseName = '';
      this.eventDate = '';
      this.quillEditor.setText('');
      this.eventImage = null;
    },
  }
};
</script>

<style scoped>
/* Style général de la page */
.organizer-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f7f7f7; /* Fond clair */
  font-family: Arial, sans-serif;
}

.content {
  max-width: 800px;
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}

h1, h2 {
  text-align: center;
  color: #e74c3c; /* Rouge principal */
}

h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.8em;
  margin-bottom: 15px;
}

label {
  display: block;
  margin-top: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

input[type="text"],
input[type="date"],
textarea,
.editor-container {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  margin-bottom: 20px;
}

input[type="file"] {
  display: block;
  margin-top: 15px;
  margin-bottom: 15px;
}

button {
  background-color: #e74c3c; /* Rouge principal */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  width: 100%;
}

button:hover {
  background-color: #c0392b; /* Rouge plus foncé */
  transform: scale(1.05); /* Légère animation au survol */
}

img {
  display: block;
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
}

.editor-container {
  height: 200px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  font-size: 1em;
  background-color: #fafafa;
}

/* Style des événements */
.event-item {
  background-color: #ffe5e5; /* Légère teinte rouge */
  border: 2px solid #e74c3c;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-item:hover {
  transform: scale(1.03);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.event-item h3 {
  font-size: 1.5em;
  color: #e74c3c;
  margin-bottom: 10px;
}

.event-item p {
  color: #555;
  margin-bottom: 10px;
}

/* Animation pour l'image d'événement */
.event-item img {
  transition: transform 0.3s ease;
}

.event-item img:hover {
  transform: scale(1.1);
}
</style>
