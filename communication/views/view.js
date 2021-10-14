/*!
 * communication/views/view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const classChat = require('../../main/templates/chat');
const privateMessages = require('../../main/templates/private-messages');
const newPrivateMessage = require('../../main/templates/new-private-message');


function communicationView (user, wsport) {
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        ${locale.headlines.navi_communication[config.lang]}
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
    <div class="row">
      <div class="col-12 col-md-6">
        ${newPrivateMessage(user.id)}
        ${privateMessages(user.id)}
      </div>
      <div class="col-12 col-md-6">
        ${classChat(user.group, user)}
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


module.exports = communicationView;
