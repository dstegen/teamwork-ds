/*!
 * meeting/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const uuidv4 = require('uuid').v4;
const getNaviObj = require('../lib/getNaviObj');
const view = require('../main/views/base-view');
const lobbyView = require('./views/lobby-view');
const meetingView = require('./views/meeting-view');


function meetingController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  let meeting = {
    name: 'Team meeting',
    id: 'e3ffa11e-c277-4980-b20e-4c1efac67b60',
    key: uuidv4()
  }
  if (route === 'meeting') {
    uniSend(view(wsport, naviObj, lobbyView(user)), response);
  } else if (route.startsWith('meeting/attend/')) {
    uniSend(view(wsport, naviObj, meetingView(meeting, user)), response);
  } else {
    uniSend(new SendObj(302, [], '', '/'), response);
  }
}


module.exports = meetingController;
