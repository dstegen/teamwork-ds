/*!
 * main/views/main-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllIssues } = require('../../issue/models/model-issue');


function mainView (lessonsTodayList, curWeek, user={}, wsport) {
  return `
    <div id="dashboard" class="p-3" style="min-height: 500px;">
      <h1 class="mb-5">Dashboard</h1>
      <h5>List of issues:</h5>
      <div class="list-group">
        ${getAllIssues().map( item => { return '<a href="/issue/edit/'+item.id+'" class="list-group-item list-group-item-action">'+item.name+'</a>'}).join('')}
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


module.exports = mainView;
