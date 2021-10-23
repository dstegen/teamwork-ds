/*!
 * calendar/views/calendar-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules


function calendarView (events) {
  return `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
          },
          firstDay: 1,
          navLinks: true,
          weekNumbers: true,
          height: 600,
          editable: true,
          selectable: true,
          eventDrop: function(info) {
            alert(info.event.title + " was dropped on " + info.event.start.toISOString());
            if (!confirm("Are you sure about this change?")) {
              info.revert();
            }
            console.log(info.event.id);
            // Ajax call to update event
          },
          eventClick: function(info) {
            alert('Event: ' + info.event.title);
            // Trigger event edit modal!
          },
          events: ${JSON.stringify(events)}
        });
        calendar.render();
      });
    </script>
    <div class="container py-3">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Calendar
        <span id="clock" class="d-none d-md-block">19:52:41</span>
      </h2>
      <div class="border p-3">
        <div id="calendar"></div>
      </div>
    </div>
  `;
}


module.exports = calendarView;
