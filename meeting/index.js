/*!
 * meeting/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, SendObj } = require('webapputils-ds');
const getNaviObj = require('../lib/getNaviObj');
const view = require('../main/views/base-view');
const lobbyView = require('./views/lobby-view');
const meetingView = require('./views/meeting-view');
const { getEvent } = require('../calendar/models/model-calendar');


function meetingController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  if (route === 'meeting') {
    uniSend(view(wsport, naviObj, lobbyView(user)), response);
  } else if (route.startsWith('meeting/attend/')) {
    let meetingId = route.split('/')[2];
    uniSend(view(wsport, naviObj, meetingView(getEvent(meetingId), user)), response);
  } else {
    uniSend(new SendObj(302, [], '', '/'), response);
  }
}


module.exports = meetingController;
