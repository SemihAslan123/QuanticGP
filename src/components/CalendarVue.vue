<template>
  <div>
    <!-- Affichage du calendrier avec ref -->
    <FullCalendar ref="fullCalendar" :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import profilService from '@/../backend/services/profil.service';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        // Désactivation de la barre d'outils (flèches, Today, etc.)
        headerToolbar: false,
        // Choix d'une vue adaptée
        initialView: 'dayGrid',
        // Date initiale fixée au 15 juillet 2025
        initialDate: '2025-07-15',
        // Affichage uniquement du 15 au 19 juillet 2025
        visibleRange: {
          start: '2025-07-15',
          end: '2025-07-20' // date de fin exclusive
        },
        selectable: true,
        editable: false,
        displayEventTime: false,
        // Pour réduire la hauteur du calendrier par rapport à la largeur
        aspectRatio: 3,
        events: [],
        dayCellDidMount(info) {
          const calendarApi = info.view.calendar;
          const eventsOfDay = calendarApi.getEvents().filter(event =>
            event.start.toISOString().split('T')[0] === info.date.toISOString().split('T')[0]
          );
          if (eventsOfDay.length) {
            const tooltipContent = eventsOfDay.map(e => e.title).join('<br>');
            tippy(info.el, {
              content: tooltipContent,
              allowHTML: true,
              placement: 'top'
            });
          }
        }
      },
      eventDates: []
    };
  },
  created() {
    this.loadEvents();
  },
  methods: {
    async loadEvents() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) return;
      try {
        const [billets, activites] = await Promise.all([
          profilService.fetchBillets(user.id),
          profilService.fetchActivites(user.id)
        ]);
        const formattedEvents = [];
        this.eventDates = [];
        billets.forEach(billet => {
          formattedEvents.push({
            id: `billet-${billet.id}`,
            title: `Billet: ${billet.course_nom || ('N°' + billet.id)}`,
            start: billet.course_date,
            color: '#3498db'
          });
          this.eventDates.push(new Date(billet.course_date).toISOString().split("T")[0]);
        });
        activites.forEach(activite => {
          formattedEvents.push({
            id: `activite-${activite.id}`,
            title: `Activité: ${activite.name}`,
            start: activite.date,
            color: '#e74c3c'
          });
          this.eventDates.push(new Date(activite.date).toISOString().split("T")[0]);
        });
        this.calendarOptions.events = formattedEvents;
        this.eventDates = [...new Set(this.eventDates)].sort();
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Augmentation de la largeur et ajustement de l'affichage */
.fc {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 1200px; /* largeur augmentée */
  margin: 0 auto;
}

/* Toolbar (en-tête du calendrier) - non utilisée ici puisque headerToolbar est désactivé */
.fc-toolbar {
  display: none;
}

/* Styles pour le calendrier */
.fc-daygrid-day {
  background-color: #fff !important;
  border: 1px solid #f0f0f0 !important;
}

.fc-event {
  border-radius: 5px;
  padding: 5px;
  font-size: 0.85em;
  text-align: center;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.fc-day-sat, .fc-day-sun {
  background-color: #fafafa !important;
}

.fc-event:hover {
  transform: scale(1.05);
  transition: 0.2s ease-in-out;
}
</style>
