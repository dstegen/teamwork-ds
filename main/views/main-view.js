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
    <div id="dashboard" class="container-fluid p-3" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row py-2 px-3">
        <div class="col-12 col-md-6 p-3 border">
          <h5>List of issues:</h5>
          <div class="list-group">
            ${getAllIssues().map( item => { return '<a href="/issue/edit/'+item.id+'" class="list-group-item list-group-item-action">'+item.name+'</a>'}).join('')}
          </div>
        </div>
        <div class="col-12 col-md-6 p-3 border">

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


module.exports = mainView;
