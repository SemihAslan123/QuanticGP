<template>
    <div :style="tooltipStyles" class="tooltip">
      <div class="toolTipLogo" v-if="toolTipLogo">
        <img :src="toolTipLogo" alt="Logo QGP" style="max-width: 100px; height: auto;" />
      </div>
  
      <div
        :class="{'active-color-tooltip': toolTipNomPrestataire, 'small-font': toolTipStatut === 'RÉSERVÉ'}"
        class="toolTipName"
      >
        {{ toolTipName }}

        <template v-if="toolTipStatut">
          <span> - </span>
          <div class="toolTipStatut" :class="{'status-reserve': toolTipStatut === 'RÉSERVÉ', 'status-libre': toolTipStatut === 'LIBRE'}">
            {{ toolTipStatut }}
          </div>
        </template>
      </div>

  
      <div class="toolTipNomPrestataire" v-if="toolTipNomPrestataire">
        <hr class="toolTipHR" />
        {{ toolTipNomPrestataire }}
      </div>
  
      <div class="toolTipTypePrestataire" v-if="toolTipTypeService">{{ toolTipTypeService }}</div>
  
      <div class="infosContainer" v-if="tooltipText">
        <div class="toolTipTextTitle">{{ toolTipTextTitle }}</div>
        <div class="toolTipText">{{ tooltipText }}</div>
      </div>
  
      <div class="toolTipPrix" v-if="toolTipPrix">{{ toolTipPrix }}</div>
  
      <div class="toolTipCB" v-if="toolTipCB">{{ toolTipCB }}</div>
  
      <div class="toolTipDetails" v-if="tooltipDetails && toolTipStatut !== 'RÉSERVÉ'">
        {{ tooltipDetails }}
      </div>
  
      <div class="toolTipImage" v-if="tooltipImage">
        <img class="imageInTooltip" :src="tooltipImage" alt="Image emplacement" style="max-width: 300px; height: auto;" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "TooltipInfo",
    props: {
      tooltipStyles: Object,
      toolTipLogo: String,
      toolTipName: String,
      toolTipNomPrestataire: String,
      toolTipTypeService: String,
      toolTipStatut: String,
      toolTipTextTitle: String,
      tooltipText: String,
      tooltipDetails: String,
      tooltipImage: String,
      toolTipPrix: String,
      toolTipCB: String
    }
  };
  </script>
  