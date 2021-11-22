/*!
 * main/views/main-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllProjects } = require('../../project/models/model-project');
const { getAllIssues } = require('../../issue/models/model-issue');
const issueList2 = require('../../issue/templates/issue-list2');
const { getAllEvents } =require('../../calendar/models/model-calendar');
const calendarListView = require('../../calendar/views/calendar-list-view');
const activitiesList = require('../templates/activities-list');


function mainView (lessonsTodayList, curWeek, user, wsport) {
  let allProjectsIds = getAllProjects().filter(item => item.state !== 'finished').map(item => {return item.id});
  return `
    <div id="dashboard" class="container py-3 mb-5" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row py-2">
        <div class="col-12 col-lg-6">
          ${allProjectsIds.map(issueListWrapper).join('')}
          <hr class="my-5" />
          <h5 class="text-muted">Recently closed issues:</h5>
          ${allProjectsIds.map(id => issueListWrapper(id, '', 'closed')).join('')}
        </div>
        <div class="col-12 col-lg-6">
          ${activitiesList()}
          ${calendarListView(getAllEvents(101), user)}
        </div>
      </div>
    </div>
    <script>
      // Websockets
      const hostname = window.location.hostname ;
      const wsProtocol = location.protocol.replace('http','ws');
      const socket = new WebSocket(wsProtocol+'//'+hostname+':${wsport}/', 'protocolOne', { perMessageDeflate: false });
      socket.onmessage = function (msg) {
        location.reload();
        console.log(msg.data);
      };
    </script>
  `;
}


// Additional functions

function issueListWrapper (projectId, user, state) {
  return `
      <div class="mb-3 border p-3 d-flex justify-content-between">
        <h5 class="m-0">
          Project: <a href="/project/view/${projectId}">${getAllProjects().filter(item => item.id === projectId)[0].name}</a>
        </h5>
        <span class="small">
          <a href="/kanban/${projectId}" class="text-muted">Kanban board</a>
          &nbsp;|&nbsp;
          <a href="/calendar/project/${projectId}" class="text-muted">Calendar view</a>
        </span>
      </div>
      ${issueList2(getAllIssues(projectId), user, state)}
      <div class="mb-5"></div>
  `;
}




module.exports = mainView;
