<template>
    <div>
  
      <!-- COMPTE À REBOURS -->
      <div class="countdown-container">
        <p class="titreCompteRebours">Décompte final</p>
        <div class="countdown-item">
          <div class="circle">
            <div class="number">{{ countdown.days }}</div>
            <div class="label">JOURS</div>
          </div>
        </div>
        <div class="countdown-item">
          <div class="circle">
            <div class="number">{{ countdown.hours }}</div>
            <div class="label">HEURES</div>
          </div>
        </div>
        <div class="countdown-item">
          <div class="circle">
            <div class="number">{{ countdown.minutes }}</div>
            <div class="label">MINUTES</div>
          </div>
        </div>
      </div>
  
      <!-- BARRE DE PROGRESSION -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: getProgressPercentage() + '%' }"></div>
          <img src="/assets/homePage/drapeauProgressBar.png" alt="Drapeau" class="flag-icon" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "CountdownCircuit",
    props: {
      countdown: Object,
      getProgressPercentage: Function
    }
  };
  </script>
  