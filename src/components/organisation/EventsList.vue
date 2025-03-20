<!-- frontend/src/components/EventsList.vue -->
<template>
  <section class="events-orga">
    <h2>Liste des activitées</h2>
    <div v-if="events && events.length > 0" class="events-grid-orga">
      <div v-for="event in events" :key="event.id" class="event-card-orga">
        <img v-if="event.image" :src="event.image" alt="Image de l'événement" class="event-image-orga" />
        <h3 class="event-name-orga">{{ event.name }}</h3>
        <p class="event-date-orga">{{ new Date(event.date).toLocaleDateString() }}</p>
        <p class="event-time-orga">
          <strong>Horaire :</strong> {{ event.heure_debut }} - {{ event.heure_fin }}
        </p>
        <p class="event-price-orga">
          <strong>Prix :</strong> {{ event.prix }} €
        </p>
        <p class="event-description-orga">
          <strong>Description :</strong> {{ event.description }}
        </p>
        <div class="event-actions-orga">
          <button @click="$emit('edit-event', event)" class="btn-edit">Modifier</button>
          <button @click="$emit('delete-event', event.id)" class="btn-delete">Supprimer</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Aucune activitée trouvée.</p>
    </div>
    <button @click="$emit('back-to-create')" class="button-back-orga">Retour à la création d'activitée</button>
  </section>
</template>

<script>
export default {
  name: 'EventsList',
  props: {
    events: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
<style scoped src="../../styles/OrgaStyle/EventsList.css">

</style>
