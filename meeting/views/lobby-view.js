/*!
 * meeting/views/lobby-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllEvents } = require('../../calendar/models/model-calendar');
const calendarMeetingListView = require('../../calendar/views/calendar-meeting-list-view');
const editEventModal = require('../../calendar/templates/edit-event-modal');

function lobbyView (user) {
  let meetingEvents = getAllEvents().filter(item => item.online === true);
  return `
    <div id="meeting" class="container py-3">
      <div class="d-flex justify-content-between py-2 px-3 my-3 border align-middle">
        <h2 class="m-0">Meetings overview</h2>
        <span>
          <a href="#" onclick="newOnlineMeeting();" class="btn btn-sm btn-primary mt-1">Create a meeting</a>
        </span>
      </div>
      <div>
        ${calendarMeetingListView(meetingEvents, user)}
      </div>
    </div>
    <script>
      function newOnlineMeeting() {
        document.getElementById("online-true").checked = true;
        $('#editEventModal').modal('show');
        initFlatpickr();
      }
    </script>
    ${editEventModal()}
  `;
}


module.exports = lobbyView;
