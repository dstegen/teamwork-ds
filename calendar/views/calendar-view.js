/*!
 * calendar/views/calendar-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const editEventModal = require('../templates/edit-event-modal');


function calendarView (events, calHeadline='Calendar') {
  let editable = false;
  if (calHeadline === 'Calendar') editable = true;
  return `
    <script>
      let eventId = '';
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
          eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            meridiem: false
          },
          height: 600,
          editable: ${editable},
          selectable: ${editable},

          eventDrop: function(info) {
            if (!confirm("Are you sure about this change?")) {
              info.revert();
            } else {
              // Ajax call to update event
              let endDate = '';
              if (info.event.end != undefined) endDate = moment(info.event.end).format('YYYY-MM-DD HH:mm');
              let allDay = false;
              if (info.event.allDay === true) allDay = true;
              $.ajax({
                url: '/calendar/update/', // url where to submit the request
                type : "POST", // type of action POST || GET
                dataType : 'json', // data type
                data : {
                  "id": info.event.id,
                  "start": moment(info.event.start).format('YYYY-MM-DD HH:mm'),
                  "end": endDate,
                  "allDay": allDay
                },
                success : function(result) {
                    console.log(result);
                }
              });
            }
          },

          eventClick: function(info) {
            $('#id-field').val(info.event.id);
            $('#eventId').text(info.event.id);
            $('#start-field').val(moment(info.event.start).format('YYYY-MM-DD HH:mm'));
            if (info.event.end != undefined) {
              $('#end-field').val(moment(info.event.end).format('YYYY-MM-DD HH:mm'));
            } else {
              $('#end-field').val('');
            }
            $('#title-field').val(info.event.title);
            if (info.event.allDay === true) document.getElementById("allDay-true").checked = true;
            if (info.event.extendedProps.members != undefined) {
              $('#members-field').val(info.event.extendedProps.members);
            } else {
              $('#members-field').val('');
            }
            $("#editEventModal").modal('show');
            initFlatpickr();
          },

          dateClick: function(info) {
            $('#id-field').val('');
            $('#start-field').val(moment(info.dateStr).format('YYYY-MM-DD HH:mm'));
            $('#end-field').val('');
            $('#title-field').val('');
            document.getElementById("allDay-true").checked = false;
            $('#members-field').val('');
            $("#editEventModal").modal('show');
            initFlatpickr();
          },

          select: function(info) {
            $('#id-field').val('');
            $('#start-field').val(moment(info.startStr).format('YYYY-MM-DD HH:mm'));
            $('#end-field').val(moment(info.endStr).format('YYYY-MM-DD HH:mm'));
            $('#title-field').val('');
            document.getElementById("allDay-true").checked = false;
            $('#members-field').val('');
            $("#editEventModal").modal('show');
            initFlatpickr();
          },

          events: ${JSON.stringify(events)}
        });
        calendar.render();
      });
    </script>
    <div class="container py-3">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        <span>${calHeadline}</span>
        <span id="clock" class="d-none d-md-block">19:52:41</span>
      </h2>
      <div class="border p-3">
        <div id="calendar"></div>
      </div>
    </div>
    ${editEventModal()}
  `;
}


module.exports = calendarView;
