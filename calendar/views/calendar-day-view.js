/*!
 * calendar/views/calendar-day-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const editEventModal = require('../templates/edit-event-modal');
const config = require('../../main/models/model-config').getConfig();


function calendarDayView (events, user) {
  //console.log(events);
  events = events.filter(item => (item.members && item.members.includes(user.id.toString())));
  return `
    <script>
      let eventId = '';
      document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridDay',
          headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridDay,timeGridDay'
          },
          locale: '${config.lang}',
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
          height: 300,
          editable: true,
          selectable: true,
          eventContent: function(arg) {
            //console.log(calendar.view.type);
            if (arg.event.extendedProps.online === true && calendar.view.type !== 'dayGridWeek') {
              let italicEl = document.createElement('span')
              italicEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="fillColor" class="bi bi-camera-video mx-1 mb-1" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175l3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/></svg>';
              italicEl.innerHTML += moment(arg.event.start).format('HH:mm')+' '+arg.event.title;
              let arrayOfDomNodes = [ italicEl ];
              return { domNodes: arrayOfDomNodes };
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
              var dotEl = info.el.getElementsByClassName('fc-daygrid-event-dot')[0];
              if (dotEl) {
                dotEl.style.borderColor = 'var(--bs-danger)';
              }
            }
          },

          eventDrop: function(info) {
            //console.log(info.event.extendedProps);
            if (!confirm("Are you sure about this change?")) {
              info.revert();
            } else {
              // Ajax call to update event
              initFlatpickr();
              let endDate = '';
              if (info.event.end != undefined) endDate = moment(info.event.end).format('YYYY-MM-DD HH:mm');
              let allDay = false;
              if (info.event.allDay === true) {
                allDay = true;
              } else {
                allDay = false;
              }
              $.ajax({
                url: '/calendar/update/', // url where to submit the request
                type : "POST", // type of action POST || GET
                dataType : 'json', // data type
                data : {
                  "id": info.event.id,
                  "title": info.event.title,
                  "start": moment(info.event.start).format('YYYY-MM-DD HH:mm'),
                  "end": endDate,
                  "allDay": allDay,
                  "sourceUrl": info.event.source.url
                },
                success : function(result) {
                    console.log(result);
                }
              });
            }
          },

          eventClick: function(info) {
            $('#sourceUrl-field').val(info.event.source.url);
            $('#id-field').val(info.event.id);
            $('#eventId').text(info.event.id);
            $('#start-field').val(moment(info.event.start).format('YYYY-MM-DD HH:mm'));
            if (info.event.end != undefined) {
              $('#end-field').val(moment(info.event.end).format('YYYY-MM-DD HH:mm'));
            } else {
              $('#end-field').val('');
            }
            $('#title-field').val(info.event.title);
            if (info.event.allDay === true) {
              document.getElementById("allDay-true").checked = true;
            } else {
              document.getElementById("allDay-true").checked = false;
            }
            if (info.event.extendedProps.members !== undefined) {
              $('#members-field').val(info.event.extendedProps.members);
            } else {
              $('#members-field').val('');
            }
            if (info.event.extendedProps.online !== undefined) {
              document.getElementById("online-true").checked = info.event.extendedProps.online;
            } else {
              document.getElementById("online-true").checked = false;
            }
            $('#description-field').val(info.event.extendedProps.description);
            $("#editEventModal").modal('show');
            initFlatpickr();
          },

          dateClick: function(info) {
            $('#id-field').val('');
            $('#start-field').val(moment(info.dateStr).format('YYYY-MM-DD HH:mm'));
            $('#end-field').val('');
            $('#title-field').val('');
            $('#description-field').val('');
            document.getElementById("allDay-true").checked = false;
            $('#members-field').val('');
            document.getElementById("online-true").checked = false;
            $("#editEventModal").modal('show');
            initFlatpickr();
          },

          select: function(info) {
            $('#id-field').val('');
            $('#start-field').val(moment(info.startStr).format('YYYY-MM-DD HH:mm'));
            $('#end-field').val(moment(info.endStr).format('YYYY-MM-DD HH:mm'));
            $('#title-field').val('');
            $('#description-field').val('');
            document.getElementById("allDay-true").checked = true;
            $('#members-field').val('');
            document.getElementById("online-true").checked = false;
            $("#editEventModal").modal('show');
            initFlatpickr();
          },

          events: ${JSON.stringify(events)}
        });
        calendar.render();
      });
    </script>
      <div class="border p-3">
        <div id="calendar"></div>
        <div class="d-flex justify-content-end mt-2">
          <a class="small text-muted" href="/calendar">Team calendar</a>
        </div>
      </div>
      ${editEventModal()}
    `;
}


module.exports = calendarDayView;
