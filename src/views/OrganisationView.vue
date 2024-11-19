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

        <button @click="goBackToCreateEvent">Retour à la création d'événement</button>
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
          <label for="eventImage">Image de l'événement : ( 50 mo Max ) </label>
          <input type="file" @change="handleFileUpload" />
          <img v-if="eventImage" :src="eventImage" alt="Image de l'événement" />
        </div>

        <button type="submit" @click="saveEvent">Sauvegarder</button>
      </div>

      <!-- Bouton pour afficher les événements -->
      <button v-if="currentSection !== 'events'" @click="showEvents">Afficher les événements</button>
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
    goBackToCreateEvent(){
      this.currentSection = 'event';
      this.resetQuillEditor();
    },
    resetQuillEditor() {
      if (this.quillEditor) {
        this.quillEditor.root.innerHTML = '';
      }
      this.courseName = '';
      this.eventDate = '';
      this.eventImage = null;
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
@import url('https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&family=Pixelify+Sans:wght@400..700&family=Sour+Gummy:ital,wght@0,100..900;1,100..900&display=swap');

body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  background-color: rgba(0,22,43,255); /* Fond sombre */
  font-family: "Host Grotesk", sans-serif;
  color: #d4d4d4;
}

.organizer-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}

.content {
  max-width: 900px;
  width: 100%;
  background-color: rgba(19, 16, 46, 0.945); /* Fond sombre */
  border-radius: 15px;

  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5);
}

h1, h2 {
  text-align: center;
  color: #f3265d; /* Rouge vif */
  font-family: "Host Grotesk", sans-serif;
}

h1 {
  font-size: 2.5em;
}

h2 {
  font-size: 1.8em;
}

label {
  display: block;
  margin-top: 20px;
  font-weight: bold;
  color: #ececec;
  margin-bottom: 5px;
  font-family: "Host Grotesk", sans-serif;
}

input[type="text"],
input[type="date"],
.editor-container {
  width: 100%;
  padding: 12px;
  background-color: rgba(243, 38, 93, 0.363); /* Fond semi-transparent */
  border: 1px solid #f3265d;
  border-radius: 10px;
  font-size: 1em;
  margin-bottom: 20px;
  color: #fff;
}

input[type="file"] {
  margin-top: 10px;
  color: #d4d4d4;
}

button {
  width: 100%;
  background-color: #8d3434; /* Rouge intense */
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 15px;
  font-size: 1.2em;
  font-family: "Host Grotesk", sans-serif;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-top: 15px;
}

button:hover {
  background-color: #f3265d; /* Rouge plus clair */
  transform: scale(1.05);
}

button:active {
  transform: scale(0.95);
}

img {
  display: block;
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 15px;
  margin: 10px 0;
  border: 2px solid #f3265d;
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.1);
}

/* Événements */
.event-item {
  background-color: rgba(243, 38, 93, 0.15); /* Rouge transparent */
  border: 2px solid #f3265d;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.event-item:hover {
  transform: scale(1.03);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.5);
}

.event-item h3 {
  color: #f3265d;
  font-size: 1.5em;
  font-family: "Host Grotesk", sans-serif;
  margin-bottom: 10px;
}

.event-item p {
  color: #d4d4d4;
  font-size: 1em;
}

/* Éditeur */
.editor-container {
  height: 200px;
  background-color: rgba(19, 16, 46, 0.945); /* Fond sombre */
  border: 1px solid #f3265d;
  border-radius: 10px;
  padding: 15px;
  font-size: 1em;
  color: #fff; /* Texte blanc par défaut */
  overflow-y: auto; /* Permet le défilement si le contenu dépasse */
}

/deep/ .ql-editor::before {
  color: rgba(255, 255, 255, 0.6) !important;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #08070f; /* Fond sombre */
}

::-webkit-scrollbar-thumb {
  background-color: #f3265d; /* Rouge vif */
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #c0392b; /* Rouge foncé */
}

</style>
