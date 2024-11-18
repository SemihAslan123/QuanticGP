<template>

   <div class="page-container">

      <head>
         <meta charset="UTF-8">
      </head>

    <!-- =========================================================================================================================-->
    <!-- ================================================= PREMIER CONTAINER ==================================================== -->
    <!-- =========================================================================================================================-->


     <!--<div class="section" id="section1">-->

        <!--<h1>Bienvenue chez Quantic GP</h1>-->

         <router-link to="/reservation">
            <button>Réserver un Billet</button>
         </router-link>

         <router-link to="/faq">
            <button>FAQ</button>
         </router-link>

      <!--</div>-->


    <!-- =========================================================================================================================-->
    <!-- ================================================= DEUXIÈME CONTAINER =================================================== -->
    <!-- =========================================================================================================================-->


     <div class="section" id="section2">
       <div class="content-container">
         <h2>Le Quantic Grand Prix</h2>
         <p class="intro-text">
           Le Quantic GP se compose cette année de plusieurs pilotes légendaires, un circuit mythique et un format inédit.
         </p>

         <div class="info-block">
           <h3>Un circuit légendaire</h3>
           <p>
             Chaque pilote de Formule 1 rêve de gagner sur le circuit mythique de Monaco, le plus lent et le plus difficile du Championnat du Monde de Formule 1. Celui qui s’impose au Quantic GP le mérite, car même une petite erreur dans les rues de la principauté est fatale. Les qualifications jouent un rôle crucial, car les dépassements sont presque impossibles. Toutefois, avec de nombreux abandons, une conduite maîtrisée peut offrir l’opportunité de marquer des points.
           </p>
         </div>

         <div class="info-block">
           <h3>Histoire du circuit</h3>
           <p>
             Le Circuit de Monaco, créé en 1929 par Antony Noghès avec le soutien du Prince Louis II, est l'un des circuits les plus emblématiques de la Formule 1. Introduit au championnat en 1950, il a conservé son tracé de 3,34 km presque intact. Technique et exigeant, il met en valeur le talent des pilotes, comme Ayrton Senna, qui y a triomphé six fois. Ses virages légendaires, de Sainte Dévote au virage Fairmont, en passant par le tunnel et la Rascasse, en font une épreuve mythique où chaque erreur peut être fatale.
           </p>
         </div>

         <div class="info-block">
           <h3>Assister au Quantic Grand Prix</h3>
           <p>
             Venir au Quantic Grand Prix à Monaco est un moment inoubliable qui doit être anticipé et préparé. À travers ce site, nous vous proposons des informations utiles et une équipe de professionnels chargée de vous assister dans l’organisation de votre séjour : hôtel, billets, terrasse, yacht, limousine, restaurant.
           </p>
         </div>
       </div>
     </div>



     <!-- =============================================================================================================================-->
    <!-- ======================================= TROISIÈME CONTAINER : CARTE DE L'EVENEMENT ========================================= -->
    <!-- =============================================================================================================================-->

      <div class="section" id="section3">


         <button class="buttonSwitchStands" @click="switchImage()">
            <img src="/assets/homePage/standsIcon.png"  alt="Icon" class="iconButtonSwitchStands">
         </button>


         <svg
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


      <div class="section" id="section4"></div>


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
