<!-- frontend/src/components/EventForm.vue -->
<template>
  <section class="event-form-orga">
    <h2>{{ editing ? "Modifier l'activitée" : "Créer une activitée" }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group-orga">
        <label>Nom de l'activitée :</label>
        <input type="text" v-model="form.courseName" required />
      </div>
      <div class="form-group-orga">
        <label>Date de l'activitée :</label>
        <input type="date" v-model="form.eventDate" required />
      </div>
      <div class="form-group-orga">
        <label>Prix (en €) :</label>
        <input type="number" v-model="form.eventPrice" required />
      </div>
      <div class="form-group-orga">
        <label>Horaire Début :</label>
        <input type="time" v-model="form.horaireDebut" required />
      </div>
      <div class="form-group-orga">
        <label>Horaire Fin :</label>
        <input type="time" v-model="form.horaireFin" required />
      </div>
      <div class="form-group-orga">
        <label>Description :</label>
        <div ref="editorContainer" class="editor-container-orga"></div>
      </div>
      <div class="form-group-orga">
        <label>Image :</label>
        <input type="file" @change="handleFileUpload" />
        <img v-if="form.eventImage" :src="form.eventImage" alt="Image de l'événement" />
      </div>
      <button type="submit">{{ editing ? "Enregistrer" : "Créer" }}</button>
      <div class="actions-orga">
        <button v-if="!editing" type="button" @click="$emit('show-events')">Voir les activitées</button>
      </div>
    </form>
  </section>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
  name: 'EventForm',
  props: {
    editing: {
      type: Boolean,
      default: false,
    },
    initialData: {
      type: Object,
      default: () => ({
        courseName: '',
        eventDate: '',
        eventPrice: null,
        horaireDebut: '',
        horaireFin: '',
        eventDescription: '',
        eventImage: null,
      }),
    },
  },
  data() {
    return {
      form: { ...this.initialData },
      quillEditor: null,
    };
  },
  mounted() {
    this.initQuillEditor();
  },
  methods: {
    initQuillEditor() {
      this.$nextTick(() => {
        this.quillEditor = new Quill(this.$refs.editorContainer, {
          theme: 'snow',
          placeholder: 'Écrivez la description de l’activitée...',
          modules: {
            toolbar: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ align: [] }],
              ['bold', 'italic', 'underline'],
              ['link', 'image'],
              ['blockquote', 'code-block'],
              ['clean'],
            ],
          },
        });
        if (this.form.eventDescription) {
          this.quillEditor.root.innerHTML = this.form.eventDescription;
        }
      });
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.form.eventImage = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    handleSubmit() {
      const descriptionText = this.quillEditor.getText().trim();
      if (!this.form.courseName || !this.form.eventDate || !this.form.horaireDebut || !this.form.horaireFin || !this.form.eventPrice || !descriptionText || !this.form.eventImage) {
        alert("Veuillez remplir tous les champs.");
        return;
      }
      this.form.eventDescription = this.quillEditor.root.innerHTML;
      this.$emit('save-event', this.form);
    },
  },
  watch: {
    initialData(newVal) {
      this.form = { ...newVal };
      if (this.quillEditor) {
        this.quillEditor.root.innerHTML = this.form.eventDescription;
      }
    },
  },
};
</script>

<style scoped src="../../styles/OrganisationPage.css">
/* Styles pour la sidebar */
</style>

