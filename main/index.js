/*!
 * main/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend } = require('webapputils-ds');
const { thisWeek, weekDayNumber } = require('../lib/dateJuggler');
const getNaviObj = require('../lib/getNaviObj');
const mainView = require('./views/main-view');
const view = require('../main/views/base-view');


function mainController (request, response, wss, wsport, user) {
  uniSend(view(wsport, getNaviObj(user), mainView([], thisWeek(), user, wsport)), response);
}


module.exports = mainController;
