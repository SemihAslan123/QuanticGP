<template>

   <div class="page-container">

      <head>
         <meta charset="UTF-8">
      </head>

    <!-- =========================================================================================================================-->
    <!-- ================================================= PREMIER CONTAINER ==================================================== -->
    <!-- =========================================================================================================================-->


      <div class="section" id="section1">

         <h1>Bienvenue chez Quantic GP</h1>

         <router-link to="/reservation">
            <button>Réserver un Billet</button>
         </router-link>

         <router-link to="/faq">
            <button>FAQ</button>
         </router-link>

      </div>


    <!-- =========================================================================================================================-->
    <!-- ================================================= DEUXIÈME CONTAINER =================================================== -->
    <!-- =========================================================================================================================-->


      <div class="section" id="section2">Section 2</div>


    <!-- =============================================================================================================================-->
    <!-- ======================================= TROISIÈME CONTAINER : CARTE DE L'EVENEMENT ========================================= -->
    <!-- =============================================================================================================================-->

      <div class="section" id="section3">


         <button class="buttonSwitchStands" @click="switchImage()">
            <img src="../assets/homePage/standsIcon.png"  alt="Icon" class="iconButtonSwitchStands">
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


         <!-- HOTEL Riviera Marriott -->
         <g
         inkscape:groupmode="layer"
         id="layer1"
         inkscape:label="HotelA"
         style="display:inline;opacity:1;fill:url(#linearGradient3)"
         @mouseover="showTooltip({
               logo: require('@/assets/logo.png'),
               name: 'Hôtel Riviera Marriott : La Porte de Monaco',
               textTitle:'Équipements de l\'établissement',
               text: '• Parking public payant sur site \n • Salle de sport / piscine \n • Bar / lounge \n • Animaux domestiques autorisés',
               details: 'Durant l\'événement, les réservations de l\'hôtel \nRiviera Marriott se font directement sur notre site.',
               image: require('@/assets/homePage/emplacementsImages/emplacementHotelA.jpg') 
            })"
         @mouseleave="hideTooltip"
         @mousemove="moveTooltip">
         <path
            style="display:inline;opacity:0;fill:#000000;cursor:pointer;"
            d="m 320.55604,539.75048 -10.45292,194.80431 95.97676,6.3351 14.88748,-194.48755 z"
            id="path2" />
         </g>


         <!-- HOTEL Fairmont Monte Carlo -->
         <g
         inkscape:groupmode="layer"
         id="layer2"
         inkscape:label="HotelB"
         @mouseover="showTooltip({
               logo: require('@/assets/logo.png'),
               name: 'Hôtel Fairmont Monte Carlo',
               textTitle:'Équipements de l\'établissement',
               text: '• Service de taxi gratuit \n • Salle de sport / piscine \n • Bar / lounge \n • Animaux domestiques autorisés',
               details: 'Durant l\'événement, les réservations de l\'hôtel \nFairmont Monte Carlo se font directement \nsur notre site.',
               image: require('@/assets/homePage/emplacementsImages/emplacementHotelB.jpg') 
            })"
         @mouseleave="hideTooltip"
         @mousemove="moveTooltip">
         <path
            style="opacity:0;fill:#000000;cursor:pointer;"
            d="m 1549.9388,884.49541 c 82.8724,-94.96735 81.9765,-93.62347 81.9765,-93.62347 l 60.9225,52.6352 -81.9766,93.62347 z"
            id="path3" />
         </g>


         <!-- Zone VIP -->
         <g
            inkscape:groupmode="layer"
            id="layer3"
            inkscape:label="ZoneVIP"
            @mouseover="showTooltip({
               logo: require('@/assets/logo.png'),
               name: 'Secteur Nord : Zone VIP',
               textTitle:'Services à disposition',
               text: '• Bar à cocktails \n • Service de restauration gastronomique \n • Photographies et souvenirs exclusifs \n • Zones de détente et de relaxation',
               details: 'La zone VIP offre une expérience exclusive avec \ndes services personnalisés, un confort raffiné et un \naccès privilégié aux moments forts de l\'événement.',
               image: require('@/assets/homePage/emplacementsImages/emplacementZoneVIP.jpg') 
            })"
            @mouseleave="hideTooltip"
            @mousemove="moveTooltip">
            <path
               style="display:inline;opacity:0;fill:#000000;cursor:pointer;"
               d="m 818.33648,266.39094 -13.14533,30.40847 -1.90053,24.54851 5.54321,19.16368 27.55769,24.39013 44.66245,18.37179 39.59437,8.71076 46.87974,1.10865 72.37852,-7.44375 96.7686,-10.29453 26.6075,-11.08643 21.3809,-19.32205 10.1362,-27.87444 -9.8194,-111.02262 -74.5958,67.78557 -60.5002,31.35874 -50.36407,3.32593 -65.56828,-14.88749 -70.16123,-19.95556 z"
               id="path4" />
         </g>


         <!-- Gradin A : MONTE-CARLO -->
         <g
            inkscape:groupmode="layer"
            id="layer4"
            inkscape:label="GradinA"
            @mouseover="showTooltip({
               logo: require('@/assets/logo.png'),
               name: 'Gradin Est : Monte-Carlo',
               textTitle:'Services à disposition',
               text: '• Gradins spacieux et confortables \n • Position idéale pour observer la course \n • Accès PMR prévu \n',
               details: 'Le plus grand gradin, situé au niveau de la ligne de \ndépart, offrant une vue imprenable sur la course.',
               image: require('@/assets/homePage/emplacementsImages/emplacementGradinA.jpg') 
            })"
            @mouseleave="hideTooltip"
            @mousemove="moveTooltip">
            <path
               style="display:inline;opacity:0;fill:#000000;cursor:pointer;"
               d="m 1201.4265,553.22959 19.7102,77.9449 170.2245,-38.52449 195.7582,-103.03061 87.352,-92.27959 -88.2479,-49.27551 -84.6643,89.59183 -129.4602,72.56939 z"
               id="path4" />
         </g>


         <!-- Gradin B : SENNA -->
         <g
            inkscape:groupmode="layer"
            id="layer5"
            inkscape:label="GradinB"
            @mouseover="showTooltip({
               logo: require('@/assets/logo.png'),
               name: 'Gradin Sud : Senna',
               textTitle:'Services à disposition',
               text: '• Gradins spacieux et confortables \n • Position idéale pour observer la course \n • Accès PMR prévu',
               details: 'Gradin face à la chicane de la Piscine, offrant un aperçu \nsur l\'un des passages les plus techniques du circuit.',
               image: require('@/assets/homePage/emplacementsImages/emplacementGradinB.jpg') 
            })"
            @mouseleave="hideTooltip"
            @mousemove="moveTooltip">
            <path
               style="display:inline;opacity:0;fill:#000000;cursor:pointer;"
               d="m 634.14346,827.68075 96.29352,10.45292 23.12311,-208.10802 -91.22543,-10.13616 19.63881,54.1651 -13.30371,118.78312 z"
               id="path4" />
         </g>


         <!-- Gradin C : RIVIERA -->
         <g
            inkscape:groupmode="layer"
            id="layer6"
            inkscape:label="GradinC"
            @mouseover="showTooltip({
               logo: require('@/assets/logo.png'),
               name: 'Gradin Nord : Riviera',
               textTitle:'Services à disposition',
               text: '• Gradins spacieux et confortables \n • Position idéale pour observer la course \n • Accès PMR prévu',
               details: 'Gradin face à Sainte-Dévote, offrant une vue \nsur un des virages les plus iconiques du circuit.',
               image: require('@/assets/homePage/emplacementsImages/emplacementGradinC.jpg') 
            })"
            @mouseleave="hideTooltip"
            @mousemove="moveTooltip">
            <path
               style="display:inline;opacity:0;fill:#000000;cursor:pointer;"
               d="m 522.0122,420.33385 c 49.41378,26.92418 50.99755,29.77497 50.99755,29.77497 l 41.81166,-79.5055 85.8406,1.58378 -0.63351,-54.79861 -114.98206,-5.38484 z"
               id="path4" />
         </g>


         <!-- Karting Enfant -->
         <g
            inkscape:groupmode="layer"
            id="layer7"
            inkscape:label="KartingEnfant"
            @mouseover="showTooltip({
               logo: require('@/assets/logo.png'),
               name: 'Le Circuit P\'tit Monaco : Karting Enfant',
               textTitle:'Services à disposition',
               text: '• Karting deux places : parent/enfant \n • Mini-compétitions et courses amicales \n • Atelier de pilotage',
               details: 'Un circuit adapté aux enfants pour \ndécouvrir la course à leur façon.',
               image: require('@/assets/homePage/emplacementsImages/emplacementKartingEnfant.jpg') 
            })"
            @mouseleave="hideTooltip"
            @mousemove="moveTooltip">
            <path
               style="display:inline;opacity:0;fill:#000000;cursor:pointer;"
               d="m 277.73469,788.40816 c 5.82347,109.75 5.82347,109.75 5.82347,109.75 l 29.11735,137.07554 53.30714,-0.448 38.07653,-4.9275 26.4296,-70.77759 8.06326,-25.53367 -18.36633,-8.95918 -16.12653,-65.85 7.61531,-57.33878 -73.01735,-13.43878 -10.30306,-14.33469 z"
               id="path4" />
         </g>


         <!-- Simulateur -->
         <g
            inkscape:groupmode="layer"
            id="layer8"
            inkscape:label="Simulateur"
            @mouseover="showTooltip({
               logo: require('@/assets/logo.png'),
               name: 'F1 24 : Simulateur',
               textTitle:'Services à disposition',
               text: '• Plusieurs modes de courses \n • Simulation des G-Forces \n • Mode VR',
               details: 'Vivez l\'expérience F1 24 avec un \n simulateur ultra-réaliste, pour des \n sensations de course uniques.',
               image: require('@/assets/homePage/emplacementsImages/emplacementSimulateur.jpg') 
            })"
            @mouseleave="hideTooltip"
            @mousemove="moveTooltip">
            <path
               style="display:inline;opacity:0;fill:#000000;cursor:pointer;"
               d="m 349.85612,1104.6673 c 47.48368,-25.9816 47.48368,-25.9816 47.48368,-25.9816 l 54.65102,36.7327 67.19387,25.7576 -15.90255,45.6919 -40.09234,-10.975 -86.90409,-45.0199 z"
               id="path4" />
         </g>


         <!-- Espace de rencontre -->
         <g
            inkscape:groupmode="layer"
            id="layer9"
            inkscape:label="EspaceRencontre"
            @mouseover="showTooltip({
               logo: require('@/assets/logo.png'),
               name: 'Hangar Renault : Espace de rencontre',
               textTitle:'Services à disposition',
               text: '• Stands de photo avec les F1 \n • Espace autographes \n • Café / Bar cocktails',
               details: 'Un espace immersif où les fans vivent \nla F1 de près, et rencontrent les \npilotes en exclusivité.',
               image: require('@/assets/homePage/emplacementsImages/emplacementEspaceRencontre.jpg') 
            })"
            @mouseleave="hideTooltip"
            @mousemove="moveTooltip">
            <path
               style="display:inline;opacity:0;fill:#000000;cursor:pointer;"
               d="m 748.80877,608.80307 c 7.60211,-58.28292 9.50264,-56.69915 9.50264,-56.69915 l 86.47411,10.76967 9.1859,-56.06563 -139.37219,-15.83775 -42.44517,58.28292 -4.43457,52.26457 78.87199,6.96861 z"
               id="path4" />
         </g>


         <!-- Exposition F1 -->
         <g
            inkscape:groupmode="layer"
            id="layer10"
            inkscape:label="Exposition"
            @mouseover="showTooltip({
               logo: require('@/assets/logo.png'),
               name: 'Musée L\'Autodrome : Exposition de F1',
               textTitle:'Contenu de l\'exposition',
               text: '• Salle des équipements de pilote \n • Mur de trophées et médailles \n • Cinéma de la F1 \n• Boutique souvenirs',
               details: 'Explorer l\'histoire de la F1 à travers \ndes voitures mythiques et des \nexpériences immersives. ',
               image: require('@/assets/homePage/emplacementsImages/emplacementExposition.jpg') 
            })"
            @mouseleave="hideTooltip"
            @mousemove="moveTooltip">
            <path
               style="display:inline;opacity:0;fill:#000000;cursor:pointer;"
               d="m 886.95919,595.11378 c 9.8551,-72.79337 9.8551,-72.79337 9.8551,-72.79337 l 93.62347,18.14235 86.45614,6.71938 87.128,4.03164 -5.1515,74.5852 -168.43264,-21.50204 z"
               id="path4" />
         </g>


         <!-- Parking -->
         <g
            inkscape:groupmode="layer"
            id="layer11"
            inkscape:label="Parking"
            @mouseover="showTooltip({
               logo: require('@/assets/logo.png'),
               name: 'Parc de Stationnement',
               textTitle:'Places restantes',
               text: 'Capacité de 10.000',
               details: 'Le parking est simple d\'accès et compte \nplusieurs emplacement pour personnes \nen situation d\'handicap.',
               image: require('@/assets/homePage/emplacementsImages/emplacementParking.jpg') 
            })"
            @mouseleave="hideTooltip"
            @mousemove="moveTooltip">
            <path
               style="display:inline;opacity:0;fill:#000000;cursor:pointer;"
               d="m 817.70298,1075.3832 0.31675,-203.51512 477.50817,-0.31676 0.3167,204.62368 z"
               id="path4" />
         </g>


         <!-- =============================================================================================================================-->
         <!-- ===================================== PARTIE DES EMPLACEMENT POUR PRESTATAIRE (1 à 35) ===================================== -->
         <!-- =============================================================================================================================-->

         <!-- Les groupes ci-dessous seront opérationnels seulement si withStands = true -->
         <g v-if="withStands">

                  <g inkscape:groupmode="layer" id="Emplacement_1" inkscape:label="Emplacement_1" 
                  @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone A - Emplacement n°1',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 478.86837,453.3347 -6.49541,84.88826 26.20561,3.13572 6.49541,-84.66429 z"></path>
                  </g>

               <g inkscape:groupmode="layer" id="Emplacement_2" inkscape:label="Emplacement_2" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone A - Emplacement n°2',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 470.58112,552.33368 -6.71938,84.4403 25.98163,3.13572 6.49541,-84.44031 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_3" inkscape:label="Emplacement_3" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone A - Emplacement n°3',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 462.51786,648.19694 -6.27143,84.44031 25.75765,3.80765 6.49541,-84.21633 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_4" inkscape:label="Emplacement_4" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone A - Emplacement n°4',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 453.55868,749.6597 1.11989,86.00816 25.53368,1.1199 1.34387,-84.66429 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_5" inkscape:label="Emplacement_5" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone A - Emplacement n°5',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 452.2148,848.21072 10.975,86.00816 23.29388,-2.91173 -8.95919,-82.87245 -23.51786,0.67194 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_6" inkscape:label="Emplacement_6" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone B - Emplacement n°1',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 425.33725,1003.6526 19.26224,-17.24647 60.69847,59.35457 -18.36633,17.6944 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_7" inkscape:label="Emplacement_7" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone B - Emplacement n°2',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 501.26633,1075.774 c 0,-1.7919 10.975,-23.0699 10.975,-23.0699 l 77.9449,36.2847 -11.87092,21.502 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_8" inkscape:label="Emplacement_8" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone B - Emplacement n°3',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 597.80153,1091.2286 0.89592,25.5337 85.78419,-3.5837 -0.22398,-23.9658 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_9" inkscape:label="Emplacement_9" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone B - Emplacement n°4',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 661.41174,1145.4316 28.89337,28.6694 41.43622,-42.7801 -27.77347,-28.8933 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_10" inkscape:label="Emplacement_10" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone B - Emplacement n°5',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 594.8898,1157.9745 6.27143,40.0923 59.13061,-8.5112 -5.15153,-38.3005 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_11" inkscape:label="Emplacement_11" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone B - Emplacement n°6',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="opacity:0;fill:#000000;cursor:pointer;" d="m 524.56021,1150.5832 -4.4796,38.0765 58.90664,6.4954 4.47959,-38.7485 z" id="path22" />
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_12" inkscape:label="Emplacement_12" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone C - Emplacement n°1',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="opacity:0;fill:#000000;cursor:pointer;" d="m 778.58374,842.56824 29.14145,25.97391 38.32736,-46.87974 -29.45822,-24.07338 z" id="path23" />
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_13" inkscape:label="Emplacement_13" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone C - Emplacement n°2',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="opacity:0;fill:#000000;cursor:pointer;" d="m 818.17811,783.65182 38.32735,12.03668 19.0053,-58.28291 -38.64411,-9.81941 z" id="path24" />
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_14" inkscape:label="Emplacement_14" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone C - Emplacement n°3',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="opacity:0;fill:#000000;cursor:pointer;" d="m 833.6991,676.58863 4.43457,40.86139 59.23318,-8.86913 -4.11781,-36.74358 z" id="path25" />
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_15" inkscape:label="Emplacement_15" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone C - Emplacement n°4',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="opacity:0;fill:#000000;cursor:pointer;" d="m 908.13652,672.47082 1.58378,38.64411 57.6494,-2.8508 -1.26702,-38.64411 z" id="path26" />
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_16" inkscape:label="Emplacement_16" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone C - Emplacement n°5',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="opacity:0;fill:#000000;cursor:pointer;" d="m 984.15772,671.83731 -4.43457,39.91113 58.91645,7.60211 4.7513,-38.6441 z" id="path27" />
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_17" inkscape:label="Emplacement_17" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone C - Emplacement n°6',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="opacity:0;fill:#000000;cursor:pointer;" d="m 1058.5951,685.77453 -8.8691,38.32735 58.5997,13.62046 9.1859,-39.91112 -61.1337,-12.35345 z" id="path28" />
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_18" inkscape:label="Emplacement_18" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone C - Emplacement n°7',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="opacity:0;fill:#000000;cursor:pointer;" d="m 1128.2812,711.74844 22.1729,26.29066 -28.1912,119.09987 -25.3404,-27.55768 z" id="path29" />
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_19" inkscape:label="Emplacement_19" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone D - Emplacement n°1',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="opacity:0;fill:#000000;cursor:pointer;" d="m 1162.4908,857.13897 25.6571,5.06808 15.2043,-91.54219 -23.7567,-2.53404 z" id="path30" />
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_20" inkscape:label="Emplacement_20" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone D - Emplacement n°2',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="opacity:0;fill:#000000;cursor:pointer;" d="m 1176.7447,751.50119 60.817,5.85996 3.1675,-39.43599 -58.5996,-4.9097 z" id="path31" />
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_21" inkscape:label="Emplacement_21"
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone D - Emplacement n°3',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1253.3994,719.82569 c 0,0 0.7919,40.22788 2.5341,40.22788 1.7421,0 61.1337,-3.80106 60.5002,-3.95944 -0.6335,-0.15837 -2.2173,-41.17814 -2.2173,-41.17814 l -59.7083,4.11781 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_22" inkscape:label="Emplacement_22" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone D - Emplacement n°4',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1326.4115,711.59006 c 0,0 16.6296,35.63493 17.4215,35.95169 0.7919,0.31675 54.4819,-25.18202 54.4819,-25.18202 l -17.4216,-35.79332 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_23" inkscape:label="Emplacement_23" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone D - Emplacement n°5',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1392.4549,680.23132 24.2317,31.99225 46.8798,-34.52629 -22.9648,-32.30901 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_24" inkscape:label="Emplacement_24" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone D - Emplacement n°6',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1442.3438,712.6987 -12.5118,95.02649 42.6035,-1.58377 11.8783,-93.91785 -40.703,0.63351 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_25" inkscape:label="Emplacement_25" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone D - Emplacement n°7',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1432.2076,823.24619 40.8614,-0.79189 -11.7199,94.07623 -44.1873,1.4254 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_26" inkscape:label="Emplacement_26" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone D - Emplacement n°8',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1388.9706,931.41801 0.6335,55.27375 69.8445,-2.69242 -1.2671,-55.27374 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_27" inkscape:label="Emplacement_27" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone D - Emplacement n°9',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1304.397,933.47692 1.267,56.69914 71.2699,-3.00917 -1.5838,-56.85752 -72.2201,2.53404 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_28" inkscape:label="Emplacement_28" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone E - Emplacement n°1',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1565.5615,914.31324 9.8194,48.78027 -70.7948,13.46209 -8.8691,-47.83 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_29" inkscape:label="Emplacement_29" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone E - Emplacement n°2',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1509.971,871.55132 42.2868,-8.394 -2.8508,-95.0265 -40.5447,7.12699 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_30" inkscape:label="Emplacement_30" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone E - Emplacement n°3',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1508.8623,763.06274 c 6.8103,-2.21728 43.3955,-8.55238 43.3955,-8.55238 l -1.9006,-94.23461 -42.1284,8.23563 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_31" inkscape:label="Emplacement_31" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone E - Emplacement n°4',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1499.6764,615.77168 c 0,0 23.5983,36.11006 24.2318,36.42682 0.6335,0.31675 86.6325,-36.42682 86.1574,-38.16898 -0.4752,-1.74215 -20.9059,-35.63493 -22.0145,-35.63493 -1.1087,0 -88.3747,37.37709 -88.3747,37.37709 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_32" inkscape:label="Emplacement_32" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone E - Emplacement n°5',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1602.4634,569.68383 c 0,0 23.5983,33.41765 24.2318,33.25927 0.6335,-0.15838 49.2554,-35.79331 49.2554,-35.79331 l -23.7566,-33.25927 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_33" inkscape:label="Emplacement_33" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone E - Emplacement n°6',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1643.8,607.37767 c 0.6335,-0.31675 38.8024,-14.0956 38.8024,-14.0956 l 21.381,57.80779 -38.8025,14.57073 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_34" inkscape:label="Emplacement_34" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone E - Emplacement n°7',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1666.7647,677.85565 15.6794,59.07481 40.0695,-10.6113 -15.6794,-58.44129 -38.8025,9.66103 z"></path>
               </g>

               <g inkscape:groupmode="layer" id="Emplacement_35" inkscape:label="Emplacement_35" 
               @mouseover="showTooltip({
                     logo: require('@/assets/logo.png'),
                     name: 'Zone E - Emplacement n°8',
                     textTitle:'Caractéristiques de l\'emplacement',
                     text: '...',
                     details: 'Emplacement réservé aux prestataires et soumis à réservation.',
                     image: ''
                  })" 
                  @mouseleave="hideTooltip" 
                  @mousemove="moveTooltip">
                  <path style="display:inline;opacity:0;fill:#000000;cursor:pointer;" d="m 1682.4441,750.7093 c 0,0 -2.8508,60.97533 -1.9006,60.97533 0.9503,0 41.0198,2.8508 41.0198,2.8508 l 2.3757,-62.08398 z"></path>
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

         currentImage: require('@/assets/homePage/CarteEvenementAvecStands.png'),

         withStands: true
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

         // Hauteur et largeur de la fenêtre
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
        this.currentImage = require('@/assets/homePage/CarteEvenementSansStands.png');
      } else {
        this.currentImage = require('@/assets/homePage/CarteEvenementAvecStands.png');
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
