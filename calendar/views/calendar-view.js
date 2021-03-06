/*!
 * calendar/views/calendar-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllCalendars } = require('../models/model-calendar');
const editEventModal = require('../templates/edit-event-modal');
const newCalendarModal = require('../templates/new-calendar-modal');
const config = require('../../main/models/model-config').getConfig();


function calendarView (calHeadline='Calendar', user={}, project) {
  let editable = false;
  if (calHeadline === 'Calendar') editable = true;
  let eventSources = getAllCalendars().map(item => { return item.url; });
  let outline = '';
  let calendarButtons = '';
  if (project && project.name) {
    eventSources = [ '/calendar/load/project/'+project.id ];
    calendarButtons = '<button id="events-project-'+project.id+'" type="button" class="me-2 btn btn-sm btn-danger" onclick="toggleCalendar(\'project-'+project.id+'\', \'danger\')">'+project.name+'</button>';
    outline = 'outline-';
  }
  getAllCalendars().forEach( item => {
    calendarButtons += '<button id="events-'+item.id+'" type="button" class="me-2 btn btn-sm btn-'+outline+item.color+'" onclick="toggleCalendar(\''+item.id+'\', \''+item.color+'\')">'+item.name+'</button>';
  });
  return `
    <script>
      let eventId = '';
      let calendar = {};
      document.addEventListener('DOMContentLoaded', function() {
        var calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridDay,dayGridMonth,timeGridWeek,timeGridDay,listWeek'
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
          height: 650,
          editable: ${editable},
          selectable: true,
          eventContent: function(arg) {
            if (arg.event.extendedProps.online === true) {
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
              if (info.event.allDay === true) info.el.style.backgroundColor = 'var(--bs-danger)';
              // Change color of dot marker
              var dotEl = info.el.getElementsByClassName('fc-list-event-dot')[0];
              if (dotEl) {
                dotEl.style.borderColor = 'var(--bs-danger)';
              }
              var dotEl2 = info.el.getElementsByClassName('fc-daygrid-event-dot')[0];
              if (dotEl2) {
                dotEl2.style.borderColor = 'var(--bs-danger)';
              }
            }
          },

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
            ${editable === true ? 'info.jsEvent.preventDefault();' : ''}
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

          eventSources: ${JSON.stringify(eventSources)}
        });
        calendar.render();
      });
    </script>
    <div class="container py-3 mb-5">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        <span>${calHeadline}</span>
        <span id="clock" class="d-none d-md-block">19:52:41</span>
      </h2>
      <div class="py-2 px-3 d-flex justify-content-between mb-1 border">
        <span>
          ${calendarButtons}
        </span>
        <button type="button" class="btn btn-sm btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#newCalendarModal"> + </button>
      </div>
      <div class="border p-3">
        <div id="calendar"></div>
      </div>
    </div>
    ${editEventModal()}
    ${newCalendarModal()}
  `;
}


module.exports = calendarView;
