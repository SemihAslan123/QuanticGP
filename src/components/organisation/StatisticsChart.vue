<!-- frontend/src/components/StatisticsChart.vue -->
<template>
  <section class="statistics-orga">
    <h2>Statistiques</h2>
    <div class="stats-overview">
      <div class="stat-item">
        <h3>Nombre total d'activitées</h3>
        <p>{{ totalEvents }}</p>
      </div>
      <div class="stat-item">
        <h3>Nombre de participants total unique</h3>
        <p>{{ totalParticipants }}</p>
      </div>
      <div class="stat-item">
        <h3>Nombre de tickets de réservation</h3>
        <p>{{ totalTicketPrestataire }}</p>
      </div>
    </div>
    <div class="stats-graphs">
      <div class="chart-container">
        <h3 class="chart-title">Nombre de Participants par Activitées</h3>
        <canvas id="participantsChart"></canvas>
      </div>
    </div>
  </section>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'StatisticsChart',
  props: {
    totalEvents: { type: [Number, String], default: 0 },
    totalParticipants: { type: [Number, String], default: 0 },
    totalTicketPrestataire: { type: [Number, String], default: 0 },
    participantsData: { type: Array, default: () => [] },
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const ctx = document.getElementById('participantsChart').getContext('2d');
      const labels = this.participantsData.map(item => item.event_name);
      const data = this.participantsData.map(item => parseInt(item.participants_count, 10));
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Nombre de Participants',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } },
        },
      });
    },
  },
};
</script>

<style scoped src="../../styles/OrganisationPage.css">
/* Styles pour la sidebar */
</style>

