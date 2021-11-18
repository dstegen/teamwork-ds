/*!
 * meeting/views/meeting-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const jitsi = require('../templates/jitsi');

function meetingView (meeting, user) {
  return `
    <div id="meeting" class="container py-3 mb-5">
      <div class="d-flex justify-content-between py-2 px-3 my-3 border">
        <h2 class="m-0">${meeting.title}</h2>
        <button class="btn btn-sm btn-danger mr-3" onclick="api.executeCommand('hangup');">Leave meeting</button>
      </div>
      <div id="jitsi" class="border p-3">
        ${jitsi(meeting, user)}
      </div>
    </div>
    <script>
      window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        e.returnValue = '';
      });
    </script>
  `;
}


module.exports = meetingView;
