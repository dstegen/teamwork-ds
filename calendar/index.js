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
const { getAllEvents, getProjectEvents, updateEvent, deleteEvent } = require('./models/model-calendar');
const calendarView = require('./views/calendar-view');
const { getProjectById } = require('../project/models/model-project');


function calendarController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  let events = [];
  if (route.split('/')[1] === 'project' && Number(route.split('/')[2]) > 0) {
    events = getProjectEvents(Number(route.split('/')[2]));
    let project = getProjectById(Number(route.split('/')[2]));
    let calHeadline = 'Calendar for <a href="/project/view/'+project.id+'">'+project.name+'<a/>';
    uniSend(view(wsport, naviObj, calendarView(events, calHeadline)), response);
  } else if (route.startsWith('calendar/update')) {
    //add/updateIssue
    getFormObj(request).then(
      data => {
        updateEvent(data.fields);
        uniSend(new SendObj(302, [], '', '/calendar/'), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update/add: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (route.startsWith('calendar/delete')) {
    getFormObj(request).then(
      data => {
        deleteEvent(Number(data.fields.id));
        uniSend(new SendObj(302, [], '', '/calendar/'), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t delete event: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else {
    events = getAllEvents();
    uniSend(view(wsport, naviObj, calendarView(events)), response);
  }
}


module.exports = calendarController;
