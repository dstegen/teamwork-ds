/*!
 * main/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend } = require('webapputils-ds');
const { thisWeek } = require('../lib/dateJuggler');
const getNaviObj = require('../lib/getNaviObj');
const mainView = require('./views/main-view');
const mydashboardView = require('./views/mydashboard-view');
const view = require('../main/views/base-view');
const resourcesView = require('./views/resources-view');
const { registerWs } = require('../lib/websockets');


function mainController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let key = 1001;
  registerWs(wss, key, user.id);
  if (route === 'resource') {
    uniSend(view(wsport, getNaviObj(user), resourcesView()), response);
  } else if (route === 'dashboard') {
    uniSend(view(wsport, getNaviObj(user), mainView([], thisWeek(), user, wsport)), response);
  } else {
    uniSend(view(wsport, getNaviObj(user), mydashboardView(wss, wsport, user)), response);
  }
}


module.exports = mainController;
