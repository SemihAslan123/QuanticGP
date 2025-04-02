<template>
  <div>
    <!-- Affichage du calendrier -->
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
  components: { FullCalendar },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        headerToolbar: false,
        initialView: 'dayGrid',
        initialDate: '2025-07-15',
        visibleRange: {
          start: '2025-07-15',
          end: '2025-07-20'
        },
        selectable: true,
        editable: false,
        displayEventTime: false,
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
        const [billets, activites, reservations] = await Promise.all([
          profilService.fetchBillets(user.id),
          profilService.fetchActivites(user.id),
          profilService.fetchReservations(user.id)
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
        reservations.forEach(reservation => {
          formattedEvents.push({
            id: `reservation-${reservation.id}`,
            title: `Réservation: ${reservation.nom_service}`,
            start: reservation.date_service,
            color: '#27ae60'
          });
          this.eventDates.push(new Date(reservation.date_service).toISOString().split("T")[0]);
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
.fc {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 1200px;
  margin: 0 auto;
}
.fc-toolbar {
  display: none;
}
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
