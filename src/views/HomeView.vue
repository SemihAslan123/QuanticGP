<template>

   <div class="page-container">

      <head>
         <meta charset="UTF-8">
      </head>

    <!-- =========================================================================================================================-->
    <!-- ================================================= PREMIER CONTAINER ==================================================== -->
    <!-- =========================================================================================================================-->


      <div class="section" id="section1">Section 1</div>


    <!-- =========================================================================================================================-->
    <!-- ================================================= DEUXIÈME CONTAINER =================================================== -->
    <!-- =========================================================================================================================-->


      <div class="section" id="section2">Section 2</div>


    <!-- =============================================================================================================================-->
    <!-- ======================================= TROISIÈME CONTAINER : CARTE DE L'EVENEMENT ========================================= -->
    <!-- =============================================================================================================================-->

      <div class="section" id="section3">


         <button class="buttonSwitchStands" @click="switchImage()">
            <img src="/assets/homePage/standsIcon.png"  alt="Icon" class="iconButtonSwitchStands">
         </button>


         <svg class="svgCarte"
         version="1.1"
         id="svg1"
         width="2341"
         height="1317"
         viewBox="0 0 2341 1317"
         xmlns="http://www.w3.org/2000/svg"
         >


            <!-- Définitions des éléments SVG -->
            <defs>
               <linearGradient id="linearGradient2">
               <stop style="stop-color:#000000;stop-opacity:1;" offset="0" />
               <stop style="stop-color:#000000;stop-opacity:0;" offset="1" />
               </linearGradient>
               <linearGradient xlink:href="#linearGradient2" id="linearGradient3" />
            </defs>


            <!-- Groupe CarteEntiere (Non cliquable) -->
            <g id="g1" style="display:inline">
               <image
               width="2341"
               height="1317"
               preserveAspectRatio="true"
               :xlink:href="currentImage"
               />
            </g>


         <!-- =============================================================================================================================-->
         <!-- ============================================ PARTIE DES EMPLACEMENT PRINCIPAUX ============================================== -->
         <!-- =============================================================================================================================-->


            <g v-for="emplacement in emplacementsPrincipaux" :key="emplacement.id" 
                  @mouseover="showTooltip(emplacement)"
                  @mouseleave="hideTooltip"
                  @mousemove="moveTooltip">
                  <path
                     style="display:inline;opacity:0;fill:#000000;cursor:pointer;"
                     :d="emplacement.path"
                  />
            </g>


         <!-- =============================================================================================================================-->
         <!-- ===================================== PARTIE DES EMPLACEMENT POUR PRESTATAIRE (1 à 35) ===================================== -->
         <!-- =============================================================================================================================-->

         <!-- Les groupes ci-dessous seront opérationnels seulement si withStands = true -->
            <g v-if="withStands">

               <g v-for="emplacement in emplacementsPrestataires" :key="emplacement.id" 
                  @mouseover="showTooltip(emplacement)"
                  @mouseleave="hideTooltip"
                  @mousemove="moveTooltip">
                  <path
                     style="display:inline;opacity:0;fill:#000000;cursor:pointer;"
                     :d="emplacement.path"
                  />
               </g>

            </g>

         </svg>


         <!-- TOOLTIP = info-bulle qui s'affiche lors du survol d'une zone-->
         <div v-if="tooltipVisible" :style="tooltipStyles" class="tooltip">

            <div class="toolTipLogo"  v-if="toolTipLogo">
               <img :src="toolTipLogo" alt="Logo QGP" style="max-width: 100px; height: auto;">
            </div>

            <div class="toolTipName">{{ toolTipName }}</div>

            <div class="infosContainer">

               <div class="toolTipTextTitle">{{ toolTipTextTitle }}</div>

               <div class="toolTipText">{{ tooltipText }}</div>

            </div>

            <div class="toolTipDetails">{{ tooltipDetails }}</div>

            <div class="toolTipImage" v-if="tooltipImage">
               <img class="imageInTooltip" :src="tooltipImage" alt="Image emplacement" style="max-width: 300px; height: auto;">
            </div>

         </div>

      </div>

   


      <!-- =========================================================================================================================-->
      <!-- ================================================= QUATRIÈME CONTAINER =================================================== -->
      <!-- =========================================================================================================================-->


      <div class="section" id="section4">Section 4</div>


   </div>

</template>


<!-- ========================================================================================== -->
<!-- ===================================== BALISE SCRIPT  ===================================== -->
<!-- ========================================================================================== -->


<script>


   import homePageMap from '@/data/homePageMap.json';


   export default {

   data() {

      return {

         tooltipVisible: false,
         toolTipLogo: '',
         toolTipName: '',
         toolTipTextTitle: '',
         tooltipText: '',
         tooltipDetails: '',
         tooltipImage: '',
         tooltipStyles: { top: '0px', left: '0px' },
         currentImage: '/assets/homePage/CarteEvenementAvecStands.png',
         withStands: true,
         emplacementsPrincipaux: homePageMap.emplacementsPrincipaux,
         emplacementsPrestataires: homePageMap.emplacementsPrestataires

      };
   },

   methods: {


      showTooltip(info) {

         this.toolTipLogo = info.logo;
         this.toolTipName = info.name;
         this.toolTipTextTitle = info.textTitle;
         this.tooltipText = info.text;
         this.tooltipDetails = info.details;
         this.tooltipImage = info.image;
         this.tooltipVisible = true;

      },


      hideTooltip() {

         this.tooltipVisible = false;
      },


      moveTooltip(event) {
         const scrollOffset = window.scrollY || document.documentElement.scrollTop;
         
         // Position de l'info-bulle
         let tooltipTop = event.clientY + scrollOffset + 40;
         let tooltipLeft = event.clientX + 40;

         const windowHeight = window.innerHeight;

         // Hauteur estimée de la tooltip (ajustée dynamiquement si nécessaire)
         const tooltipHeight = 700; // Ajuste en fonction de ta tooltip

         // Vérification si la tooltip dépasse la hauteur de la fenêtre
         if (tooltipTop + tooltipHeight > windowHeight + scrollOffset) {
            // Si oui, on la place juste avant la fin de la fenêtre
            tooltipTop = windowHeight + scrollOffset - tooltipHeight;
         }

         // Vérification si la tooltip dépasse du haut de la fenêtre
         if (tooltipTop < scrollOffset) {
            // Si oui, on la place juste après le curseur
            tooltipTop = scrollOffset + 40;
         }


         // Appliquer les nouvelles positions
         this.tooltipStyles = {
            top: `${tooltipTop}px`,
            left: `${tooltipLeft}px`
         };
      },


      // Méthode pour switch entre la vue "Avec Stands" et "Sans Stands"
      switchImage() {

         if (this.withStands) {
        this.currentImage = '/assets/homePage/CarteEvenementSansStands.png';
      } else {
        this.currentImage = '/assets/homePage/CarteEvenementAvecStands.png';
      }
      
      this.withStands = !this.withStands;

      }

   }
   };

</script>


<!-- ========================================================================================== -->
<!-- ===================================== BALISE STYLE  ====================================== -->
<!-- ========================================================================================== -->


<style src="../styles/HomePage.css"></style>
