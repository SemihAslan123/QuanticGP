<template>
  <div class="page-container">
    <!-- SECTION 1 -->
    <div class="section" id="section1">
      <video class="video-background" autoplay loop muted>
        <source src="../../public/assets/homePage/vidHomePage.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas les vidéos HTML5.
      </video>
      <h1 class="nomEvenementSection1">
        QUANTIC<br /><span class="span1">G</span>RAND <span class="span1">P</span>RIX
      </h1>
      <p class="sousTitreEvenementSection1">
        Des pilotes <span class="span2">emblématiques</span>, un circuit
        <span class="span2">mythique</span>, un format <span class="span2">inédit</span>.
      </p>
      <div class="overlayVideo"></div>
    </div>

    <!-- SECTION 2 -->
    <div class="section" id="section2">
      <div class="ContainersTopSection2">
        <div class="firstSec2Container">
          <div class="calendrierContainer">
            <p>Calendrier 2025</p>
            <div class="datesEvent">
              <p class="ligneDate">
                <span class="span3">17</span>
                <span class="verticalDate">
                  Juillet <br /><span class="journeeCalendrier">Première journée</span>
                </span>
              </p>
              <p class="ligneDate">
                <span class="span3">18</span>
                <span class="verticalDate">
                  Juillet <br /><span class="journeeCalendrier">Deuxième journée</span>
                </span>
              </p>
              <p class="ligneDate">
                <span class="span3">19</span>
                <span class="verticalDate">
                  Juillet <br /><span class="journeeCalendrier">Troisième journée</span>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div class="secondSec2Container">
          <img class="photoMonacoNuit" src="../../public/assets/homePage/monacoCircuitNuit.jpg" alt="Photo Monaco" />
          <p class="nomCircuit">Circuit de Monaco</p>
          <p class="lieuCircuit">🇲🇨 Monte-Carlo, Principauté de Monaco</p>
          <CountdownCircuit :countdown="countdown" :getProgressPercentage="getProgressPercentage" />
        </div>
      </div>
    </div>

    <!-- SECTION 2A -->
    <div class="section" id="section2A">
      <div class="containerTexteA">
        <h1 class="titrePremierTexte">
          CHAQUE VIRAGE À MONACO EST UNE OPPORTUNITÉ<br />
          DE <span class="texteRouge">GAGNER</span> OU DE <span class="texteRouge">PERDRE</span> LA COURSE
          <span class="nomCitation">- Juan Manuel Fangio</span>
        </h1>
        <p class="premierTexte">
          Chaque pilote de Formule 1 rêve de gagner sur le circuit mythique de Monaco, le plus lent et le plus
          difficile du Championnat du Monde de Formule 1. Celui qui s’impose au Quantic GP le mérite, car
          même une petite erreur dans les rues de la principauté est fatale.<br /><br />
          Les qualifications jouent un rôle crucial, car les dépassements sont presque impossibles. Toutefois,
          avec de nombreux abandons, une conduite maîtrisée peut offrir l’opportunité de marquer des points.
        </p>
      </div>
      <router-link to="/articlehistoire" tag="div" class="carteHistoireCircuit">
        <p class="texteHistoireCircuit">Un circuit immuable,<br /> Le Circuit de Monaco</p>
        <p class="sousTitreHistoireCircuitUn">
          📰 - Article <span class="sousTitreLectureEnUn">(Lecture en 1 min)</span>
        </p>
      </router-link>
    </div>

    <!-- SECTION 2B -->
    <div class="section" id="section2B">
      <router-link to="/articlecoulisses" tag="div" class="carteCoulisses">
        <p class="texteHistoireCircuit">Les coulisses de<br /> l'événement</p>
        <p class="sousTitreHistoireCircuitUn">
          📰 - Article <span class="sousTitreLectureEnUn">(Lecture en 4 min)</span>
        </p>
      </router-link>
      <router-link to="/articlemonaco" tag="div" class="carteVieMonaco">
        <p class="texteHistoireCircuit">La vie à Monaco pendant l'événement<br /></p>
        <p class="sousTitreHistoireCircuitUn">
          📰 - Article <span class="sousTitreLectureEnUn">(Lecture en 1 min)</span>
        </p>
      </router-link>
      <router-link to="/articleguide" tag="div" class="carteGuidePratique">
        <p class="texteHistoireCircuit">Le guide pratique du Quantic GP</p>
        <p class="sousTitreHistoireCircuitUn">
          📰 - Article <span class="sousTitreLectureEnUn">(Lecture en 5 min)</span>
        </p>
      </router-link>
    </div>

    <!-- SECTION 3 -->
    <div class="section" id="section3">
      <img class="f1test2" src="/assets/homePage/F1_Transition_Carte.png" />
      <img :src="'/assets/homePage/CarteCircuit.png'" style="display: none;" />
      <img :src="'/assets/homePage/GradinsNord.png'" style="display: none;" />
      <CarteInteractive
        :legendStates="legendStates"
        @switch-image="switchImage"
        @switch-couches="switchCouches"
        @toggle-legende="toggleLegendeButtonActive"
        @hide-show-all="hideShowAllCouches"
        @toggle-stands-styles="toggleStandsStyles"
      >
        <svg
          class="svgCarte"
          version="1.1"
          id="svg1"
          width="2341"
          height="1317"
          viewBox="0 0 2341 1317"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Groupe CarteEntiere -->
          <g id="g1" style="display:inline">
            <image
              width="2341"
              height="1317"
              preserveAspectRatio="true"
              :xlink:href="currentImagePrincipal"
            />
          </g>

          <!-- Couche Stands -->
          <g
            id="coucheStands"
            ref="coucheStands"
            :style="{ opacity: withStands ? 1 : 0, transition: withTransition ? 'opacity 0.25s' : 'opacity 0s' }"
          >
            <image
              width="2341"
              height="1317"
              preserveAspectRatio="true"
              :xlink:href="carteCoucheStands"
            />
          </g>

          <!-- Couche Kiosque Info -->
          <g
            id="coucheKiosqueInfo"
            ref="coucheKiosqueInfo"
            :style="{ opacity: withKiosqueInfo ? 1 : 0, transition: withTransition ? 'opacity 0.25s' : 'opacity 0s' }"
          >
            <image
              width="2341"
              height="1317"
              preserveAspectRatio="true"
              :xlink:href="carteCoucheKiosqueInfo"
            />
          </g>

          <!-- Couche DAB -->
          <g
            id="coucheDAB"
            ref="coucheDAB"
            :style="{ opacity: withDAB ? 1 : 0, transition: withTransition ? 'opacity 0.25s' : 'opacity 0s' }"
          >
            <image
              width="2341"
              height="1317"
              preserveAspectRatio="true"
              :xlink:href="carteCoucheDAB"
            />
          </g>

          <!-- Couche Poste de secours -->
          <g
            id="couchePosteSecours"
            ref="couchePosteSecours"
            :style="{ opacity: withPosteSecours ? 1 : 0, transition: withTransition ? 'opacity 0.25s' : 'opacity 0s' }"
          >
            <image
              width="2341"
              height="1317"
              preserveAspectRatio="true"
              :xlink:href="carteCouchePosteSecours"
            />
          </g>

          <!-- Couche Toilettes -->
          <g
            id="coucheToilettes"
            ref="coucheToilettes"
            :style="{ opacity: withToilettes ? 1 : 0, transition: withTransition ? 'opacity 0.25s' : 'opacity 0s' }"
          >
            <image
              width="2341"
              height="1317"
              preserveAspectRatio="true"
              :xlink:href="carteCoucheToilettes"
            />
          </g>

          <!-- Couche PitStop -->
          <g
            id="couchePitStop"
            ref="couchePitStop"
            :style="{ opacity: withPitStop ? 1 : 0, transition: withTransition ? 'opacity 0.25s' : 'opacity 0s' }"
            @mouseover="showToolTipCircuit()"
          >
            <image
              width="2341"
              height="1317"
              preserveAspectRatio="true"
              :xlink:href="carteCouchePitStop"
            />
          </g>

          <!-- Emplacements principaux -->
          <g v-if="withEmplacementPrincipaux">
            <g
              v-for="emplacement in emplacementsPrincipaux"
              :key="emplacement.id"
              @mouseover="showTooltip(emplacement)"
              @mouseleave="hideTooltip"
              @mousemove="moveTooltip"
              @click="handleClickCarte(emplacement)"
            >
              <path
                :class="['base-path', { highlight: emplacement.highlight }]"
                :d="emplacement.path"
              />
            </g>
          </g>

          <!-- Emplacements prestataires -->
          <g v-if="withStands">
            <g
              v-for="emplacement in emplacements_prestataires"
              :key="emplacement.id_emplacement"
              @mouseover="showTooltipPrestataire(emplacement)"
              @mouseleave="hideTooltip"
              @mousemove="moveTooltip"
            >
            <path
              :style="styleStandsActive
                ? {
                    display: 'inline',
                    fill: emplacement.display_status === 'ACCEPTÉ'
                      ? 'blue'
                      : emplacement.display_status === 'RÉSERVÉ'
                      ? 'red'
                      : emplacement.display_status === 'LIBRE'
                      ? 'green'
                      : 'transparent',
                    opacity: ['ACCEPTÉ', 'RÉSERVÉ', 'LIBRE'].includes(emplacement.display_status) ? 0.3 : 0,
                    cursor: 'pointer',
                    transition: 'fill 0.5s ease, opacity 0.5s ease'
                  }
                : {
                    display: 'inline',
                    fill: 'transparent',
                    opacity: 1,
                    cursor: 'pointer',
                    transition: 'fill 0.5s ease, opacity 0.5s ease'
                  }"
              :d="emplacement.coordonnees_svg"
            />
            </g>
          </g>

          <!-- Overlay transition -->
          <g id="overlay" style="opacity: 0; transition: opacity 0.25s; pointer-events: none;">
            <image
              width="2341"
              height="1317"
              preserveAspectRatio="true"
              :xlink:href="overlayImage"
            />
          </g>
        </svg>
        <!-- TOOLTIP STANDARD -->
        <TooltipInfo
          v-if="tooltipVisible"
          :tooltipStyles="tooltipStyles"
          :toolTipLogo="toolTipLogo"
          :toolTipName="toolTipName"
          :toolTipNomPrestataire="toolTipNomPrestataire"
          :toolTipTypeService="toolTipTypeService"
          :toolTipStatut="toolTipStatut"
          :toolTipTextTitle="toolTipTextTitle"
          :tooltipText="tooltipText"
          :tooltipDetails="tooltipDetails"
          :tooltipImage="tooltipImage"
          :toolTipPrix="toolTipPrix"
          :toolTipCB="toolTipCB"
        />
        <!-- TOOLTIP CIRCUIT -->
      </CarteInteractive>
    </div>

    <!-- SECTION 4 : Carousel Pilotes -->
    <PilotesCarousel
      :currentDuo="currentDuo"
      @next-image="nextImagePilotes"
      @prev-image="prevImagePilotes"
    />
  </div>
</template>

<script>
import { getEmplacementsPrestataires } from '../../backend/services/emplacements.service';
import homePageMap from '@/data/homePageMap.json';
import homePageEcuries from '@/data/homePageEcuries.json';

import CarteInteractive from '@/components/CarteInteractive.vue';
import CountdownCircuit from '@/components/CountdownCircuit.vue';
import PilotesCarousel from '@/components/PilotesCarousel.vue';
import TooltipInfo from '@/components/TooltipInfo.vue';

export default {
  name: 'HomePage',
  components: {
    CarteInteractive,
    CountdownCircuit,
    PilotesCarousel,
    TooltipInfo
  },
  data() {
    return {
      tooltipVisible: false,
      tooltipCIRCUITVisible: false,
      toolTipLogo: '',
      toolTipName: '',
      toolTipNomPrestataire: '',
      toolTipTypeService: '',
      toolTipStatut: '',
      toolTipTextTitle: '',
      tooltipText: '',
      tooltipDetails: '',
      tooltipImage: '',
      toolTipPrix: '',
      toolTipCB: '',
      tooltipStyles: { top: '0px', left: '0px' },

      legendStates: {
        stands: true,
        dab: false,
        kiosqueinfo: false,
        postesecours: false,
        toilettes: false
      },

      currentImagePrincipal: '/assets/homePage/CarteEvenementSansStands.png',
      overlayImage: '/assets/homePage/CarteTransitionBleu.png',
      carteCoucheStands: '/assets/homePage/couches/Couche_Stands.png',
      carteCoucheKiosqueInfo: '/assets/homePage/couches/Couche_KiosqueInformation.png',
      carteCoucheDAB: '/assets/homePage/couches/Couche_DAB.png',
      carteCouchePosteSecours: '/assets/homePage/couches/Couche_PosteSecours.png',
      carteCoucheToilettes: '/assets/homePage/couches/Couche_Toilettes.png',
      carteCouchePitStop: '/assets/homePage/couches/Couche_PitStop.png',

      withEmplacementPrincipaux: true,
      withStands: true,
      withDAB: false,
      withKiosqueInfo: false,
      withPosteSecours: false,
      withToilettes: false,
      withPitStop: false,

      emplacementsPrincipaux: homePageMap.emplacementsPrincipaux,
      toolTipHeight: 700,
      withTransition: true,
      styleStandsActive: false,

      emplacements_prestataires: [],

      images: [
        '/assets/homePage/photo1.png',
        '/assets/homePage/photo2.png',
        '/assets/homePage/photo3.png'
      ],
      currentImageIndex: 0,

      pilotesDuos: homePageEcuries.pilotesDuos,
      currentDuoIndex: 0,

      targetDate: new Date('2025-07-17T07:00:00'),
      countdown: {
        days: 0,
        hours: 0,
        minutes: 0
      },
      startDate: new Date('2024-09-01T00:00:00')
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentImageIndex];
    },
    currentDuo() {
      return this.pilotesDuos[this.currentDuoIndex];
    }
  },
  mounted() {
    this.updateCountdown();
    this.timer = setInterval(this.updateCountdown, 60000);
    this.startBannerImageRotation();
    this.fetchEmplacements();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.imageInterval);
  },
  methods: {
    fetchEmplacements() {
      getEmplacementsPrestataires()
        .then(data => {
          this.emplacements_prestataires = data;
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des emplacements:', error);
        });
    },
    getProgressPercentage() {
      const now = new Date();
      const totalDuration = this.targetDate - this.startDate;
      const elapsed = now - this.startDate;
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
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      }, 10000);
    },
    showTooltip(info) {
      this.toolTipLogo = info.logo;
      this.toolTipName = info.name;
      this.toolTipTextTitle = info.textTitle;
      this.tooltipText = info.text;
      this.tooltipDetails = info.details;
      this.tooltipImage = info.image;
      this.tooltipVisible = true;
      this.toolTipHeight = 700;
    },
    showTooltipPrestataire(emplacement) {
      // Si l'emplacement a un service associé et que son statut est "ACCEPTÉ",
      // on affiche les informations détaillées. Sinon, on affiche "Réservé".
      this.toolTipName = emplacement.nom_emplacement;

      if (emplacement.display_status === 'ACCEPTÉ') {
        this.toolTipNomPrestataire = emplacement.nom_prestataire;
        this.toolTipTypeService = emplacement.type_service;
        this.toolTipStatut = emplacement.display_status;
        this.toolTipTextTitle = 'Informations du prestataire :';
        this.tooltipText = emplacement.description_service;
        this.tooltipDetails = '';
        this.toolTipPrix = emplacement.prix_moyen ? '💵 Prix moyen : ' + emplacement.prix_moyen : '';
        this.toolTipCB = emplacement.carte_banquaire ? '💳 Carte banquaire : ' + emplacement.carte_banquaire : '';
      } else if (emplacement.display_status === 'LIBRE') {
        this.toolTipStatut = emplacement.display_status;
        this.tooltipText = "Cet emplacement est libre et peut être soumis à réservation."
      } else {
        this.toolTipNomPrestataire = '';
        this.toolTipTypeService = '';
        this.toolTipStatut = emplacement.display_status;
        this.toolTipTextTitle = '';
        this.tooltipText = "Emplacement réservé par un prestataire, en attente de validation par un administrateur.";
        this.tooltipDetails = '';
        this.toolTipPrix = '';
        this.toolTipCB = '';
      }

      this.tooltipVisible = true;
      this.toolTipHeight = 500;
    },
    showToolTipCircuit() {
      this.tooltipCIRCUITVisible = true;
      this.toolTipHeight = 500;
    },
    hideTooltip() {
      this.toolTipLogo = '';
      this.toolTipName = '';
      this.toolTipNomPrestataire = '';
      this.toolTipTypeService = '';
      this.toolTipStatut = '';
      this.toolTipTextTitle = '';
      this.tooltipText = '';
      this.tooltipDetails = '';
      this.tooltipImage = '';
      this.toolTipPrix = '';
      this.toolTipCB = '';
      this.tooltipVisible = false;
      this.tooltipCIRCUITVisible = false;
    },
    moveTooltip(event) {
      const scrollOffset = window.scrollY || document.documentElement.scrollTop;
      let tooltipTop = event.clientY + scrollOffset + 40;
      let tooltipLeft = event.clientX + 40;
      const windowHeight = window.innerHeight;
      const tooltipHeight = this.toolTipHeight;
      if (tooltipTop + tooltipHeight > windowHeight + scrollOffset) {
        tooltipTop = windowHeight + scrollOffset - tooltipHeight;
      }
      if (tooltipTop < scrollOffset) {
        tooltipTop = scrollOffset + 40;
      }
      this.tooltipStyles = {
        top: `${tooltipTop}px`,
        left: `${tooltipLeft}px`
      };
    },
    switchImage(image) {
      const overlayElement = document.getElementById("overlay");
      this.disableMouseEvents();
      overlayElement.style.opacity = 1;
      overlayElement.style.pointerEvents = 'auto';
      setTimeout(() => {
        if (image == 1) {
          this.withTransition = true;
          this.currentImagePrincipal = '/assets/homePage/CarteEvenementSansStands.png';
          this.withEmplacementPrincipaux = true;
          this.withStands = true;
          this.withPitStop = false;
          this.legendStates['stands'] = true;
        }
        if (image == 2) {
          this.withTransition = false;
          this.currentImagePrincipal = '/assets/homePage/CarteCircuit.png';
          this.withEmplacementPrincipaux = false;
          this.withStands = false;
          this.withDAB = false;
          this.withKiosqueInfo = false;
          this.withToilettes = false;
          this.withPosteSecours = false;
          this.withPitStop = true;
          this.legendStates['dab'] = false;
          this.legendStates['kiosqueinfo'] = false;
          this.legendStates['toilettes'] = false;
          this.legendStates['postesecours'] = false;
        }
        if (image == 3) {
          this.withTransition = false;
          this.currentImagePrincipal = '/assets/homePage/GradinsNord.png';
          this.withEmplacementPrincipaux = false;
          this.withStands = false;
          this.withDAB = false;
          this.withKiosqueInfo = false;
          this.withToilettes = false;
          this.withPosteSecours = false;
          this.withPitStop = false;
          this.legendStates['dab'] = false;
          this.legendStates['kiosqueinfo'] = false;
          this.legendStates['toilettes'] = false;
          this.legendStates['postesecours'] = false;
        }
        setTimeout(() => {
          overlayElement.style.opacity = 0;
          overlayElement.style.pointerEvents = 'none';
          this.enableMouseEvents();
        }, 250);
      }, 1000);
    },
    handleClickCarte(emplacement) {
      this.tooltipVisible = false;
      setTimeout(() => {
        if (['GradinA', 'GradinB', 'GradinC'].includes(emplacement.zone)) {
          this.switchImage(3);
        }
      }, 150);
    },
    switchCouches(index) {
      if (this.currentImagePrincipal === '/assets/homePage/CarteEvenementSansStands.png') {
        const map = {
          1: 'withStands',
          2: 'withKiosqueInfo',
          3: 'withDAB',
          4: 'withPosteSecours',
          5: 'withToilettes'
        };
        this[map[index]] = !this[map[index]];
      }
    },
    hideShowAllCouches(state) {
      if (this.currentImagePrincipal !== '/assets/homePage/CarteEvenementSansStands.png') return;
      const props = ['withStands', 'withKiosqueInfo', 'withDAB', 'withPosteSecours', 'withToilettes'];
      props.forEach(p => this[p] = state);
      for (const key in this.legendStates) {
        if (Object.hasOwn(this.legendStates, key)) {
          this.legendStates[key] = state;
        }
      }
    },
    toggleLegendeButtonActive(key) {
      if (this.currentImagePrincipal === '/assets/homePage/CarteEvenementSansStands.png') {
        this.legendStates[key] = !this.legendStates[key];
      }
    },
    toggleStandsStyles() {
      this.styleStandsActive = !this.styleStandsActive;
    },
    nextImagePilotes() {
      this.currentDuoIndex = (this.currentDuoIndex + 1) % this.pilotesDuos.length;
    },
    prevImagePilotes() {
      this.currentDuoIndex = (this.currentDuoIndex - 1 + this.pilotesDuos.length) % this.pilotesDuos.length;
    },
    disableMouseEvents() {
      document.addEventListener('mousemove', this.preventMouse, true);
      document.addEventListener('mouseover', this.preventMouse, true);
      document.addEventListener('mouseleave', this.preventMouse, true);
      document.addEventListener('click', this.preventMouse, true);
    },
    enableMouseEvents() {
      document.removeEventListener('mousemove', this.preventMouse, true);
      document.removeEventListener('mouseover', this.preventMouse, true);
      document.removeEventListener('mouseleave', this.preventMouse, true);
      document.removeEventListener('click', this.preventMouse, true);
    },
    preventMouse(event) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
};
</script>

<style src="../styles/HomePage.css"></style>
