/*!
 * calendar/views/calendar-meeting-list-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
//const { humanToday } = require('../../lib/dateJuggler');


function calendarMeetingListView (events, user={}) {
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
      <div class="border p-3">
        <div id="calendar"></div>
      </div>
  `;
}


module.exports = calendarMeetingListView;
