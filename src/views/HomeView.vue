<template>

   <div class="page-container">

      <head>
         <meta charset="UTF-8">
      </head>

    <!-- =========================================================================================================================-->
    <!-- ================================================= PREMIER CONTAINER ==================================================== -->
    <!-- =========================================================================================================================-->


      <div class="section" id="section1">

         <video class="video-background" autoplay loop muted>

            <source src="../../public/assets/homePage/vidHomePage.mp4" type="video/mp4">

            <!-- Fallback message -->
            Votre navigateur ne supporte pas les vidéos HTML5.
         </video>


            <h1 class="nomEvenementSection1">QUANTIC<br><span class="span1">G</span>RAND <span class="span1">P</span>RIX</h1>

            <p class="sousTitreEvenementSection1">Des pilotes <span class="span2">emblématiques</span>, un circuit <span class="span2">mythique</span>, un format <span class="span2">inédit</span>.</p>


         <div class="overlayVideo"></div>


      </div>


    <!-- =========================================================================================================================-->
    <!-- ================================================= DEUXIÈME CONTAINER =================================================== -->
    <!-- =========================================================================================================================-->


      <div class="section" id="section2">


         <div class="ContainersTopSection2">

            <div class="firstSec2Container">

               <div class="calendrierContainer">

                  <p>Calendrier 2025</p>

                  <div class="datesEvent">

                     <p class="ligneDate"> 
                        <span class="span3">17</span>    
                        <span class="verticalDate">Juillet <br> 
                           <span class="journeeCalendrier">Première journée</span>
                        </span>
                     </p>

                     <p class="ligneDate"> 
                        <span class="span3">18</span>    
                        <span class="verticalDate">Juillet <br> 
                           <span class="journeeCalendrier">Deuxième journée</span>
                        </span>
                     </p>

                     <p class="ligneDate"> 
                        <span class="span3">19</span>    
                        <span class="verticalDate">Juillet <br> 
                           <span class="journeeCalendrier">Troisième journée</span>
                        </span>
                     </p>

                  </div>

               </div>

            </div>


            <div class="secondSec2Container">

               <img class="photoMonacoNuit" src="../../public/assets/homePage/monacoCircuitNuit.jpg" alt="Photo Monaco">

               <p class="nomCircuit">Circuit de Monaco</p>

               <p class="lieuCircuit">🇲🇨 Monte-Carlo, Principauté de Monaco</p>

               <p class="titreCompteRebours">Compte à rebours</p>

               <!-- COMPTE À REBOURS -->
               <div class="countdown-container">
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


               <!-- BARRE DE PROGRESSION-->
               <div class="progress-container">
                  <div class="progress-bar">

                  <!-- Remplissage de la barre -->
                  <div class="progress-fill" :style="{ width: getProgressPercentage() + '%' }"></div>
                  <!-- Drapeau d'arrivée -->
                  <img src="/assets/homePage/drapeauProgressBar.png" alt="Drapeau" class="flag-icon" />

                  </div>
               </div>


            </div>

         </div>   

         <!--
         <transition name="fade">
            <img :src="currentImage" :key="currentImage" alt="Bannière page d'accueil" class="imageBaniere">
         </transition>
         -->

      </div>


   <!-- =============================================================================================================================-->
    <!-- ================================================ DEUXIEME CONTAINER : A ==================================================== -->
    <!-- =============================================================================================================================-->


      <div class="section" id="section2A">

         <div class="containerTexteA">

            <h1 class="titrePremierTexte">CHAQUE VIRAGE À MONACO EST UNE OPPORTUNITÉ<br> DE <span class="texteRouge">GAGNER</span> OU DE <span class="texteRouge">PERDRE</span> LA COURSE <span class="nomCitation">- Juan Manuel Fangio</span></h1>

            <p class="premierTexte">
               Chaque pilote de Formule 1 rêve de gagner sur le circuit mythique de Monaco, le plus lent et le plus
               difficile du Championnat du Monde de Formule 1. Celui qui s’impose au Quantic GP le mérite, car
               même une petite erreur dans les rues de la principauté est fatale.
               <br><br>
               Les qualifications jouent un rôle crucial, car les dépassements sont presque impossibles. Toutefois,
               avec de nombreux abandons, une conduite maîtrisée peut offrir l’opportunité de marquer des points.
            </p>
            
         </div>

         <router-link to="/articlehistoire" tag="div" class="carteHistoireCircuit">

            <p class="texteHistoireCircuit">Un circuit immuable,<br> Le Circuit de Monaco</p>

            <p class="sousTitreHistoireCircuitUn">📰 - Article <span class="sousTitreLectureEnUn">(Lecture en 1 min)</span></p>

         </router-link>

      </div>


    <!-- =============================================================================================================================-->
    <!-- ================================================ DEUXIEME CONTAINER : B ==================================================== -->
    <!-- =============================================================================================================================-->


    <div class="section" id="section2B">

      <router-link to="/articlecoulisses" tag="div" class="carteCoulisses">

         <p class="texteHistoireCircuit">Les coulisses de<br> l'événement</p>

         <p class="sousTitreHistoireCircuitUn">📰 - Article <span class="sousTitreLectureEnUn">(Lecture en 3 min)</span></p>

      </router-link>   


      <router-link to="/articlemonaco" tag="div" class="carteVieMonaco">

         <p class="texteHistoireCircuit">La vie à Monaco pendant l'événement<br> </p>

         <p class="sousTitreHistoireCircuitUn">📰 - Article <span class="sousTitreLectureEnUn">(Lecture en 3 min)</span></p>

      </router-link>


      <router-link to="/articleguide" tag="div" class="carteGuidePratique">

         <p class="texteHistoireCircuit">Le guide pratique du Quantic GP</p>

         <p class="sousTitreHistoireCircuitUn">📰 - Article <span class="sousTitreLectureEnUn">(Lecture en 1 min)</span></p>

      </router-link>

    </div>


    <!-- =============================================================================================================================-->
    <!-- ======================================= TROISIÈME CONTAINER : CARTE DE L'EVENEMENT ========================================= -->
    <!-- =============================================================================================================================-->

      <div class="section" id="section3">

         <h1 class="titreCarteInteractive">CARTE INTERACTIVE</h1>


         <div class="carteContainer">

            <div class="partieGaucheCarte">

               <button class="buttonSwitchStands" @click="switchImage()">
            <img src="/assets/homePage/standsIcon.png"  alt="Icon" class="iconButtonSwitchStands">
         </button>

            </div>


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
                  :xlink:href="currentImageMap"
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
         </div>


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
         currentImageMap: '/assets/homePage/CarteEvenementAvecStands.png',
         withStands: true,
         emplacementsPrincipaux: homePageMap.emplacementsPrincipaux,
         emplacementsPrestataires: homePageMap.emplacementsPrestataires,

         // Les images de la bannière (SECTION 1)
         images : [
            '/assets/homePage/photo1.png',
            '/assets/homePage/photo2.png',
            '/assets/homePage/photo3.png'
         ],
         currentImageIndex: 0,

         // Le compte à rebours 
         targetDate: new Date('2025-07-17T07:00:00'), 
         countdown: {
         days: 0,
         hours: 0,
         minutes: 0,
         },

         startDate: new Date('2024-09-01T00:00:00'),
      };
   },


   computed: {
      
      currentImage() {
         return this.images[this.currentImageIndex];
      }
   },


   mounted() {

      this.updateCountdown();
      this.timer = setInterval(this.updateCountdown, 60000);

      this.startBannerImageRotation();
   },


   beforeDestroy() {

      clearInterval(this.timer);

      clearInterval(this.imageInterval);
   },


   methods: {


      getProgressPercentage() {
         const now = new Date();
         const totalDuration = this.targetDate - this.startDate;
         const elapsed = now - this.startDate;

         // Calcul du pourcentage
         return Math.min(100, (elapsed / totalDuration) * 100);
      },


      updateCountdown() {

         const now = new Date();
         const difference = this.targetDate - now;

         if (difference <= 0) {
         this.countdown = { days: 0, hours: 0, minutes: 0 };
         return;
         }

         const days = Math.floor(difference / (1000 * 60 * 60 * 24));
         const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
         const minutes = Math.floor((difference / (1000 * 60)) % 60);

         this.countdown = { days, hours, minutes };
      },


      startBannerImageRotation() {

         this.imageInterval = setInterval(() => {
         this.currentImageIndex =
            (this.currentImageIndex + 1) % this.images.length;
         }, 10000); // Changement toutes les 6 secondes
         
      },


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
        this.currentImageMap = '/assets/homePage/CarteEvenementSansStands.png';
      } else {
        this.currentImageMap = '/assets/homePage/CarteEvenementAvecStands.png';
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
