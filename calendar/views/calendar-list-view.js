/*!
 * calendar/views/calendar-list-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { humanToday } = require('../../lib/dateJuggler');


function calendarListView (events, user={}) {
  return `
    <script>
      let eventId = '';
      document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'listWeek',
          headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'timeGridWeek,listWeek'
          },
          firstDay: 1,
          navLinks: true,
          weekNumbers: true,
          eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            meridiem: false
          },
          nowIndicator: true,
          slotMinTime: '07:00:00',
          slotMaxTime: '22:00:00',
          height: 600,
          viewDidMount: function(viewObj) {
            if (viewObj.view.type === 'listWeek') {
              document.getElementsByClassName('fc-day-today')[0].children[0].children[0].style.backgroundColor = 'var(--bs-primary)';
              document.getElementsByClassName('fc-day-today')[0].children[0].children[0].children[0].style.color = 'white';
              document.getElementsByClassName('fc-day-today')[0].children[0].children[0].children[1].style.color = 'white';
            }
          },
          eventDidMount: function(info) {
            if (info.event.extendedProps.members && info.event.extendedProps.members.includes(${user.id})) {
              // Change background color of row
              if (info.event.allDay === true) {
                if (calendar.view.type === 'listWeek') {
                  info.el.style.backgroundColor = '#FFEEEE';
                } else {
                  info.el.style.backgroundColor = '#var(--bs-danger)';
                }
              }
              // Change color of dot marker
              var dotEl = info.el.getElementsByClassName('fc-list-event-dot')[0];
              if (dotEl) {
                dotEl.style.borderColor = 'var(--bs-danger)';
              }
            }
          },
          events: ${JSON.stringify(events)}
        });
        calendar.render();
      });
    </script>
      <h5 class="d-flex justify-content-between p-3 mb-3 border">
        <a href="/calendar">Calendar</a>
        ${humanToday()}
      </h5>
      <div class="border p-3">
        <div id="calendar"></div>
      </div>
  `;
}


module.exports = calendarListView;
