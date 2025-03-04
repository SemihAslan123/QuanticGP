<template>
  <div>
    <!-- Boutons pour naviguer entre les événements -->
    <div class="calendar-controls">
      <button @click="goToPreviousEvent" :disabled="!hasPreviousEvent">⬅ Précédent</button>
      <button @click="goToNextEvent" :disabled="!hasNextEvent">Suivant ➡</button>
    </div>

    <!-- Affichage du calendrier avec ref -->
    <FullCalendar ref="fullCalendar" :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import userService from '@/services/profilService';
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
        initialView: 'dayGridMonth',
        initialDate: new Date(),
        selectable: true,
        editable: false,
        displayEventTime: false,
        events: [],
        // Lors du survol d'une cellule, affiche les événements du jour
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
  computed: {
    hasPreviousEvent() {
      return this.getPreviousEventDate(new Date(this.calendarOptions.initialDate)) !== null;
    },
    hasNextEvent() {
      return this.getNextEventDate(new Date(this.calendarOptions.initialDate)) !== null;
    }
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
          userService.fetchBillets(user.id),
          userService.fetchActivites(user.id)
        ]);
        const formattedEvents = [];
        this.eventDates = [];
        // Ajouter les billets
        billets.forEach(billet => {
          formattedEvents.push({
            id: `billet-${billet.id}`,
            title: `Billet: ${billet.course_nom || ('N°' + billet.id)}`,
            start: billet.course_date,
            color: '#3498db'
          });
          this.eventDates.push(new Date(billet.course_date).toISOString().split("T")[0]);
        });
        // Ajouter les activités
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
        // Supprime les doublons et trie les dates
        this.eventDates = [...new Set(this.eventDates)].sort();
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
      }
    },
    getNextEventDate(currentDate) {
      return this.eventDates.find(date => new Date(date) > currentDate) || null;
    },
    getPreviousEventDate(currentDate) {
      return [...this.eventDates].reverse().find(date => new Date(date) < currentDate) || null;
    },
    goToNextEvent() {
      const nextDate = this.getNextEventDate(new Date(this.calendarOptions.initialDate));
      if (nextDate) {
        this.calendarOptions.initialDate = nextDate;
        this.$nextTick(() => {
          this.$refs.fullCalendar.getApi().gotoDate(nextDate);
        });
      }
    },
    goToPreviousEvent() {
      const prevDate = this.getPreviousEventDate(new Date(this.calendarOptions.initialDate));
      if (prevDate) {
        this.calendarOptions.initialDate = prevDate;
        this.$nextTick(() => {
          this.$refs.fullCalendar.getApi().gotoDate(prevDate);
        });
      }
    }
  }
};
</script>

<style scoped>
/* Style global du calendrier */
.fc {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 1000px;
  margin: 0 auto;
}

/* Barre de navigation */
.calendar-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.calendar-controls button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
}

.calendar-controls button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.calendar-controls button:hover:not(:disabled) {
  background-color: #2980b9;
}

/* Toolbar (en-tête du calendrier) */
.fc-toolbar {
  background-color: #fff;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

/* Boutons de la toolbar */
.fc-button {
  background-color: #3498db !important;
  border: none !important;
  color: white !important;
  border-radius: 5px !important;
  padding: 6px 12px !important;
  transition: background 0.3s;
}

.fc-button:hover {
  background-color: #2980b9 !important;
}

/* Jours du calendrier */
.fc-daygrid-day {
  background-color: #fff !important;
  border: 1px solid #f0f0f0 !important;
}

/* Événements */
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

/* Week-ends en fond légèrement gris */
.fc-day-sat, .fc-day-sun {
  background-color: #fafafa !important;
}

/* Animation au survol des événements */
.fc-event:hover {
  transform: scale(1.05);
  transition: 0.2s ease-in-out;
}
</style>
