/*!
 * main/views/teacher-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../models/model-config').getConfig();
const { formatDay } = require('../../lib/dateJuggler');
const { getTitleNameById } = require('../../user/models/model-user');
const { getLatestMessages } = require('../../communication/models/model-messages');
const getWelcome = require('./get-welcome');
const getOnlinelessons = require('./get-onlinelessons');
const recentMessages = require('./recent-messages');
const returnedHomeworkOverview = require('../../lesson/views/returned-homework-overview');
const classChat = require('../../main/templates/chat');
const userOnline = require('../../main/templates/user-online');


function teacherView (teacher, wsport) {
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="border py-2 px-3 mb-3">
          <h4>${getWelcome(config.lang)} ${getTitleNameById(teacher.id)},</h4>
          <p>
            ${locale.teacher.today_is[config.lang]} ${formatDay()} ${getLatestMessages(teacher.id).length > 0 ? ' '+locale.teacher.you_have[config.lang]+' <strong>'+getLatestMessages(teacher.id).length+'</strong> '+locale.teacher.new_messages[config.lang]+':' : ''}
          </p>
          <div style="font-size: 0.9rem;">
            ${recentMessages(teacher.id)}
            <br />
          </div>
        </div>
        <div class="border py-2 px-3 mb-3">
          <h4>${locale.headlines.scheduledOnlinelessons[config.lang]}:</h4>
          <hr />
          <h5>${locale.headlines.thisWeek[config.lang]}</h5>
          <div style="font-size: 0.9rem;">
            ${getOnlinelessons(teacher, 0)}
            <br />
          </div>
          <hr />
          <h5>${locale.headlines.nextWeek[config.lang]}</h5>
          <div style="font-size: 0.9rem;">
            ${getOnlinelessons(teacher, 1)}
            <br />
          </div>
        </div>
        <div class="border py-2 px-3 mb-3">
          <h4>${locale.headlines.returned_homework[config.lang]}:</h4>
          <hr />
          <div style="font-size: 0.9rem;">
            ${returnedHomeworkOverview(teacher)}
          <br />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6">
        ${classChat(teacher.group, teacher)}
        ${userOnline(teacher.group, config.lang)}
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


module.exports = teacherView;
