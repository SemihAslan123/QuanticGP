<template>
    <div class="section" id="section4">
      <img class="f1test" src="/assets/homePage/F1_Transition_Ecuries.png" alt="Bannière les écuries" style="margin-top: 200px;" />
  
      <img class="team-logo" :src="currentDuo[0]" alt="Logo de l'écurie" />
      <hr class="HRteamLogoCarousel" />
  
      <div class="carousel">
        <button class="arrow left" @click="prevImagePilotes">❮</button>
  
        <div class="image-container">
          <transition-group name="fade" tag="div" class="duo-container">
            <img
              :class="index === 0 ? 'cartesPilotes1' : 'cartesPilotes2'"
              v-for="(image, index) in currentDuo.slice(1, 3)"
              :key="index + '-' + image"
              :src="image"
              :alt="'Image ' + (index + 1)"
            />
          </transition-group>
        </div>
  
        <button class="arrow right" @click="nextImagePilotes">❯</button>
      </div>
  
      <hr class="HRteamLogoCarousel" style="margin-top: 100px; margin-bottom: 100px;" />
  
      <div class="car-container" key="car">
        <div class="car-image-container">
          <img class="car-image" :src="currentDuo[3]" alt="Voiture de l'écurie" />
          <button class="arrow_voiture arrow_left_voiture" @click="prevImagePilotes">❮</button>
          <button class="arrow_voiture arrow_right_voiture" @click="nextImagePilotes">❯</button>
        </div>
  
        <div class="text-container" style="text-align: start; margin-left: 100px;">
          <h1 class="partieEcurieTitre" key="title">{{ currentDuo[4] }}</h1>
          <p class="sousTitrePartieEcurie">Conçue par {{ currentDuo[5] }} - {{ currentDuo[6] }}</p>
  
          <p class="contenuPartieEcurie">
            <i class="fas fa-flag-checkered" style="color: white;"></i> 24 Courses 
            <i class="fas fa-trophy" style="color: #FFD700; margin-left: 20px;"></i> {{ currentDuo[7] }} Victoires
            <i class="fas fa-stopwatch" style="color: #e51e53; margin-left: 20px;"></i> {{ currentDuo[8] }} Poles
          </p>
  
          <hr class="HRteamLogoCarousel" style="margin-top: 20px; margin-bottom: 0; width: 60%; background-color: lightgray; height: 2px; opacity: 0.5;" />
  
          <p class="contenuPartieEcurie" style="margin-top: 60px;">
            <i class="fas fa-cogs"></i> Moteur : {{ currentDuo[9] }} <br /><br />
            <i class="fas fa-industry"></i> Cylindrée : {{ currentDuo[10] }} <br /><br />
            <i class="fas fa-bolt"></i> Puissance : {{ currentDuo[11] }} <br /><br />
            <i class="fas fa-weight-hanging"></i> Poids : {{ currentDuo[12] }} <br /><br />
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "PilotesCarousel",
    props: {
      currentDuo: Array
    },
    emits: ["next-image", "prev-image"],
    methods: {
      nextImagePilotes() {
        this.$emit("next-image");
      },
      prevImagePilotes() {
        this.$emit("prev-image");
      }
    }
  };
  </script>
  