<!-- frontend/src/components/ReservationsTable.vue -->
<template>
  <section class="reservations-section-orga">
    <h2>Réservations</h2>
    <div v-if="reservations && reservations.length > 0" class="reservations-table-container">
      <table class="reservations-table">
        <thead>
        <tr>
          <th>ID Réservation</th>
          <th>Id Utilisateur</th>
          <th>Nom Utilisateur</th>
          <th>Prénom Utilisateur</th>
          <th>ID Stand</th>
          <th>Date</th>
          <th>Heure Début</th>
          <th>Heure Fin</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="reservation in reservations" :key="reservation.id_reservation">
          <td>{{ reservation.id_reservation }}</td>
          <td>{{ reservation.id_utilisateur }}</td>
          <td>{{ reservation.nom_utilisateur }}</td>
          <td>{{ reservation.prenom_utilisateur }}</td>
          <td>{{ reservation.id_stand }}</td>
          <td>{{ new Date(reservation.date_reservation).toLocaleDateString() }}</td>
          <td>{{ reservation.heure_debut }}</td>
          <td>{{ reservation.heure_fin }}</td>
          <td>
              <span :class="['reservation-status', reservation.statut.toLowerCase()]">
                {{ reservation.statut }}
              </span>
          </td>
          <td>
            <select @change="$emit('change-status', reservation.id_reservation, $event.target.value)" class="status-select">
              <option value="en attente" :selected="reservation.statut === 'en attente'">En attente</option>
              <option value="acceptée" :selected="reservation.statut === 'acceptée'">Acceptée</option>
              <option value="refusée" :selected="reservation.statut === 'refusée'">Refusée</option>
            </select>
            <button class="btn-delete" @click="$emit('delete-reservation', reservation.id_reservation)">Supprimer</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Aucune réservation trouvée.</p>
    </div>
    <button @click="$emit('back')" class="button-back-orga">Retour</button>
  </section>
</template>

<script>
export default {
  name: 'ReservationsTable',
  props: {
    reservations: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style scoped src="../../styles/OrganisationPage.css">
/* Styles pour la sidebar */
</style>

