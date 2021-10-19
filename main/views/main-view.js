/*!
 * main/views/main-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllProjects } = require('../../project/models/model-project');
const issueList = require('../../issue/templates/issue-list');

function mainView (lessonsTodayList, curWeek, user, wsport) {
  let allProjectsIds = getAllProjects().map(item => {return item.id});
  return `
    <div id="dashboard" class="container-fluid p-3" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row py-2 px-3">
        ${allProjectsIds.map(issueListWrapper).join('')}
      </div>
      <hr class="my-5" />
      <h5 class="text-muted">Recently closed issues:</h5>
      <div class="row py-2 px-3">
        ${allProjectsIds.map(id => issueListWrapper(id, '', 'closed')).join('')}
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
    <div class="col-12 col-md-6 p-3">
      <h5>Project: ${getAllProjects().filter(item => item.id === projectId)[0].name}</h5>
      ${issueList(projectId, user, state)}
    </div>
  `;
}


module.exports = mainView;
