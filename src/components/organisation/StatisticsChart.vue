<!-- frontend/src/components/StatisticsChart.vue -->
<template>
  <section class="statistics-orga">
    <h2>Statistiques</h2>
    <div class="stats-overview">
      <div class="stat-item">
        <h3>Nombre total d'activités</h3>
        <p>{{ totalEvents }}</p>
      </div>
      <div class="stat-item">
        <h3>Nombre de participants total unique</h3>
        <p>{{ totalParticipants }}</p>
      </div>
      <div class="stat-item">
        <h3>Nombre de tickets prestataires</h3>
        <p>{{ totalTicketPrestataire }}</p>
      </div>
      <div class="stat-item">
        <h3>Nombre total de services prestataires</h3>
        <p>{{ totalServices }}</p>
      </div>
      <div class="stat-item">
        <h3>Nombre total de billets vendus</h3>
        <p>{{ totalTickets }}</p>
      </div>
    </div>
    <div class="stats-graphs">
      <div class="chart-container">
        <h3 class="chart-title">Nombre de Participants par Activité</h3>
        <canvas id="participantsChart"></canvas>
      </div>
      <div class="chart-container">
        <h3 class="chart-title">Répartition des Services Prestataires par Type</h3>
        <canvas id="servicesChart"></canvas>
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
    totalServices: { type: [Number, String], default: 0 },
    totalTickets: { type: [Number, String], default: 0 },
    participantsData: { type: Array, default: () => [] },
    servicesByType: { type: Array, default: () => [] },
  },
  watch: {
    participantsData(newVal) {
      if (newVal && newVal.length > 0) {
        this.$nextTick(() => this.renderParticipantsChart());
      }
    },
    servicesByType(newVal) {
      if (newVal && newVal.length > 0) {
        this.$nextTick(() => this.renderServicesChart());
      }
    },
  },
  methods: {
    renderParticipantsChart() {
      const canvas = document.getElementById('participantsChart');
      if (!canvas) {
        console.error('Canvas "participantsChart" non trouvé');
        return;
      }
      const ctx = canvas.getContext('2d');
      const labels = this.participantsData.map(item => item.event_name);
      const data = this.participantsData.map(item => parseInt(item.participants_count, 10));

      console.log('Participants Chart - Labels:', labels);
      console.log('Participants Chart - Data:', data);

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
    renderServicesChart() {
      const canvas = document.getElementById('servicesChart');
      if (!canvas) {
        console.error('Canvas "servicesChart" non trouvé');
        return;
      }
      const ctx = canvas.getContext('2d');
      const labels = this.servicesByType.map(item => item.type_service || 'Non spécifié');
      const data = this.servicesByType.map(item => parseInt(item.service_count, 10));

      console.log('Services Chart - Labels:', labels);
      console.log('Services Chart - Data:', data);

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            label: 'Nombre de Services',
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped src="../../styles/OrgaStyle/StatisticsChart.css">

</style>