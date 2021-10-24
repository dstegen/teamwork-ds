/*!
 * calendar/views/calendar-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const formTextInput = require('../../main/templates/form-textinput');
const formCheckbox = require('../../main/templates/form-checkbox');


function calendarView (events, calHeadline='Calendar') {
  let editable = false;
  if (calHeadline === 'Calendar') editable = true;
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
          editable: ${editable},
          selectable: ${editable},

          eventDrop: function(info) {
            alert(info.event.title + " was dropped on " + info.event.start.toISOString());
            if (!confirm("Are you sure about this change?")) {
              info.revert();
            }
            console.log(info.event.id);
            // Ajax call to update event
          },

          eventClick: function(info) {
            $('#id-field').val(info.event.id);
            $('#start-field').val(moment(info.event.start).format('YYYY-MM-DD'));
            $('#end-field').val(moment(info.event.end).format('YYYY-MM-DD'));
            $('#title-field').val(info.event.title);
            $('#fullDay-true').val(info.event.fullDay);
            $("#editEventModal").modal('show');
          },

          dateClick: function(info) {
            $('#id-field').val('');
            $('#start-field').val(moment(info.dateStr).format('YYYY-MM-DD'));
            $('#end-field').val('');
            $('#title-field').val('');
            $('#fullDay-true').val('');
            $("#editEventModal").modal('show');
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
    <!-- Modal -->
    <div class="modal fade" id="editEventModal" tabindex="-1" aria-labelledby="editEventModal" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add/edit event</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="edit-event-form" action="/calendar/update" method="post">
              <input type="text" id="id-field" name="id" class="d-none" hidden value="" />
              <div class="form-group row">
                ${formTextInput('', 'start', 'required', '', '', 'date')} <div class="col-3"></div>
                ${formTextInput('', 'end', '', '', '', 'date')} <div class="col-3"></div>
                ${formTextInput('', 'title', 'required', '', '', 'text')} <div class="col-3"></div>
                ${formCheckbox (['true'], 'fullDay', [], [], true)} <div class="col-3"></div>
              </div>
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-sm btn-secondary me-3 mt-3" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-sm btn-primary mt-3">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}


module.exports = calendarView;
