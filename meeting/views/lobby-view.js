/*!
 * meeting/views/lobby-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const calendarMeetingListView = require('../../calendar/views/calendar-meeting-list-view');


function lobbyView (user) {
  let meetingEvents = [
    {
      "id": 8800001,
      "title": "Group Meeting",
      "start": "2021-11-04T10:00:00+01:00",
      "end": "",
      "members": "100000,100001,100002,100003",
      "allDay": false,
      "url": "/meeting/attend/1"
    }
  ];
  return `
    <div id="meeting" class="container py-3">
      <div class="d-flex justify-content-between py-2 px-3 my-3 border align-middle">
        <h2 class="m-0">Meetings overview</h2>
        <span>
          <a href="/meeting/create" class="btn btn-sm btn-primary mt-1">Create a meeting</a>
        </span>
      </div>
      <div>
        ${calendarMeetingListView(meetingEvents, user)}
      </div>
    </div>
  `;
}


module.exports = lobbyView;
