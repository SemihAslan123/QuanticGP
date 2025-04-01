<template>
    <div class="partieGaucheCarte">
      <img src="/assets/homePage/Quantic_GP_Carte_FH.png" alt="TitreCarte" class="QuanticGPCarteFH"> 
      <p class="sousTitreCarteInteractive">CARTE INTERACTIVE DE L'ÉVÉNEMENT</p>
  
      <hr class="HRlegendeCarte" />
  
      <p @click="$emit('hide-show-all', true)" class="showhideall">MONTRER TOUT</p>
      <p @click="$emit('hide-show-all', false)" class="showhideall">CACHER TOUT</p>
  
      <hr class="HRlegendeCarte" />
  
      <button class="buttonSwitchStands" @click="$emit('switch-image', 1)">ÉVÉNEMENT</button>
  
      <div class="legendePartieEvent">
        <div class="ligneLegendeEvenement">
          <p :class="{'buttonLegendeEvenement': true, 'active': legendStates.stands}" @click="$emit('switch-couches', 1); $emit('toggle-legende', 'stands')">
            <span class="legendeTextAlignGauche">
              <i class="icon fas fa-store"></i>
              <span class="legendeTexte">STANDS</span>
            </span>
            <span class="legendeTextAlignDroite">35</span>
          </p>
        </div>
  
        <div class="ligneLegendeEvenement">
          <p :class="{'buttonLegendeEvenement': true, 'active': legendStates.kiosqueinfo}" @click="$emit('switch-couches', 2); $emit('toggle-legende', 'kiosqueinfo')">
            <span class="legendeTextAlignGauche">
              <i class="icon fas fa-info-circle"></i>
              <span class="legendeTexte">KIOSQUES D'INFORMATION</span>
            </span>
            <span class="legendeTextAlignDroite">2</span>
          </p>
        </div>
  
        <div class="ligneLegendeEvenement">   
          <p :class="{'buttonLegendeEvenement': true, 'active': legendStates.dab}" @click="$emit('switch-couches', 3); $emit('toggle-legende', 'dab')">
            <span class="legendeTextAlignGauche">
              <i class="icon fas fa-money-bill-wave"></i>
              <span class="legendeTexte">DISTRIBUTEURS DE BILLETS</span>
            </span>
            <span class="legendeTextAlignDroite">2</span>
          </p>
        </div>
  
        <div class="ligneLegendeEvenement">   
          <p :class="{'buttonLegendeEvenement': true, 'active': legendStates.postesecours}" @click="$emit('switch-couches', 4); $emit('toggle-legende', 'postesecours')">
            <span class="legendeTextAlignGauche">
              <i class="icon fas fa-first-aid"></i>
              <span class="legendeTexte">POSTES DE SECOURS</span>
            </span>
            <span class="legendeTextAlignDroite">3</span>
          </p>
        </div>
  
        <div class="ligneLegendeEvenement">
          <p :class="{'buttonLegendeEvenement': true, 'active': legendStates.toilettes}" @click="$emit('switch-couches', 5); $emit('toggle-legende', 'toilettes')">
            <span class="legendeTextAlignGauche">
              <i class="icon fas fa-restroom"></i>
              <span class="legendeTexte">TOILETTES</span>
            </span>
            <span class="legendeTextAlignDroite">3</span>
          </p>
        </div>
      </div>
  
      <hr class="HRlegendeCarte" />
  
      <button class="buttonSwitchAffichageStands" @click="$emit('toggle-stands-styles')">
        AFFICHER STANDS LIBRES / RÉSERVÉS
      </button>
  
      <hr class="HRlegendeCarte" />
  
      <button class="buttonSwitchStands" @click="$emit('switch-image', 2)">CIRCUIT</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "CarteLegend",
    props: {
      legendStates: Object
    }
  };
  </script>
  