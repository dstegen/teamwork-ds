/*!
 * calendar/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const getNaviObj = require('../lib/getNaviObj');
const view = require('../main/views/base-view');
const { getAllEvents, getProjectEvents, getEvent, updateEvent, deleteEvent } = require('./models/model-calendar');
const calendarView = require('./views/calendar-view');


function calendarController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  let events = [];
  if (route.split('/')[1] === 'project' && Number(route.split('/')[2]) > 0) {
    events = getProjectEvents(Number(route.split('/')[2]));
  } else {
    events = getAllEvents();
  }
  uniSend(view(wsport, naviObj, calendarView(events)), response);
}


module.exports = calendarController;
